define([
	'underscore',
	'jquery',
	'backbone',
	'models/pipeline/pipeline_app_model',
	'collections/base_cais_collection',
	'collections/products/transaction_collections',
	'collections/setup/contact_list',
	'models/authed_user',
	'amd/backbone/Kendo.Backbone.dataSource'
], function(_, $, Backbone, PipelineAppModel, BaseCaisCollection, TransactionCollections, ContactList, AuthedUser) {

	/** 
	 * CmOfferingModel, a cm offering
	 * @extends Backbone.Model
	 */
	var CmOfferingModel = Backbone.Model.extend({
		idAttribute: 'internalCusip',
		urlRoot: '/api/syndicate/published_offer',
		validateModel: function() {
			var requiredAttrs = ['publicOfferingPrice', 'settlementDate', 'grossSpread', 'size'];
			var valid = true;
			_.each(requiredAttrs, function(attr) {
				if (!this.get(attr)) valid = false;
			}, this);
			return valid;
		},
		toJSON: function() {
			var obj = _.clone(this.attributes);
			obj.id = this.get('serverId');
			return _.omit(obj, 'serverId');
		},
		// push the cm transactions to their own collection
		parse: function(response) {
			response.serverId = response.id;
			var that = this;

			// set the dates to date objects
			if (response.tradeDate) response.tradeDate = new Date(response.tradeDate);
			if (response.settlementDate) response.settlementDate = new Date(response.settlementDate);
			if (response.orderPeriod) response.orderPeriod = new Date(response.orderPeriod);
			if (response.tradeSheetCreateDate) response.tradeSheetCreateDate = new Date(response.tradeSheetCreateDate);

			// push the CM transactions to there own collections
			this.cmTransactions = new TransactionCollections.cmTransactions();
			_.each(response.cmTransactions, function(cmTransaction) {
				this.cmTransactions.add(new this.cmTransactions.model(cmTransaction));
			}, this);

			this.listenTo(this.cmTransactions, 'change', this.onCmTransactionChange);

			return response;
		},
		// returns total allotted of all nested CmTransactions
		getTotalAllotted: function() {
			var total = 0;
			this.cmTransactions.each(function(model) {
				if (model.get('allotted')) total = total + model.get('allotted');
			}, this);
			return total;
		},
		// returns unallotted shares
		getAllottedRemaining: function() {
			return this.get('size') - this.getTotalAllotted();
		},
		/*
		returns a contact list collection for a given offering
		@param type: the notification type, PRELIMINARY_PROSPECTUS, FINAL_PROSPECTUS, PRICING_SHEET, IOI
		*/
		getContactList: function(contentType) {
			var collection = this.contactList;
			if (!collection) collection = this.contactList = new ContactList([], {url: this.urlRoot + '/' + this.id +'/contact_list'});
			if (contentType) collection.url = this.urlRoot + '/' + this.id +'/contact_list?contentType=' + contentType;
			return collection;
		},
		saveTransactions: function(options) {
			options = _.extend({}, options);
			var that = this;
			var data = this.cmTransactions.toJSON();
			$.ajax({
				url: this.urlRoot + '/' + this.id +'/transactions',
				data: JSON.stringify(data),
				type: 'PUT',
				contentType : 'application/json',
				dataType: 'JSON',
				success: function(response) {
					that.cmTransactions.reset(response);
					if (options.success) options.success(response);
				},
				error: function(response) {
					if (options.error) options.error(response);
				}
			});
		},
		onCmTransactionChange: function(model) {
			if (_.has(model.changed, 'allotted') || _.has(model.changed, 'sellingConcession')) this.validateAllocation(model);
		},
		/** 
		 * Returns a kendo.Backbone.DataSource containing the CM transactions of this offering
		 */
		getIoisGridDs: function() {
			return new kendo.Backbone.DataSource({
				collection: this.cmTransactions,
				autoSync: true,
				schema: {
					model: {
						id: 'id',
						fields: {
							accountName: {editable: false},
							advisorName: {editable: false},
							advisorTeamName: {editable: false},
							firmName: {editable: false},
							brokerSellingConcession: {type: 'number', validation: { min: 1 }, editable: false},
							ioi: {type: 'number', validation: { min: 1 }},
							allocationValue: {type: 'number', validation: { min: 1}, editable: false},
							totalBrokerSellingConcession: {type: 'number', validation: { min: 1 }, editable: false},
							allocationPricePerShare: {type: 'number', validation: { min: 1 }, editable: false},
							allotted: {type: 'number', validation: { min: 1}},
							isBooked: {editable: false}
						}
					},
				},
				aggregate: [
					{ field: "ioi", aggregate: "sum" },
					{ field: "allotted", aggregate: "sum" },
					{ field: "brokerSellingConcession", aggregate: "sum" },
					{ field: "allocationValue", aggregate: "sum" },
					{ field: "totalBrokerSellingConcession", aggregate: "sum" }
				]
			});
		},
		// returns true or false if any of the cmTransactions of this offering have been changed
		isChanged: function() {
			var changed = false;
			var ignore = ['isBooked'];
			this.cmTransactions.each(function(model) {
				if (!_.isEmpty(model.changed) && _.isEmpty(_.pick(model.changed, ignore))) changed = true;
			});
			return changed;
		},
		/** 
		 * Validates the allocation is less than the total ammount
		 */
		validateAllocation: _.debounce(function(model) {
			// do not run validation if the size is null
			if (this.get('size') === null) return;
			if (this.getAllottedRemaining() < 0) {
				model.set('allotted', model.get('allotted') - Math.abs(this.getAllottedRemaining()));
				model.trigger('error', model, 'You have allocated more than the CAIS total allocation.');
				Alert('You have allocated more than the CAIS total allocation. This value has been readjusted.', 'OK');
			}
			if (model) this.calculateShares(model);
		}, 40),
		/** 
		 * Calculate all the share data for a transaction
		 * @param transaction, the BB model of the transaction to operate on
		 */
		calculateShares: _.debounce(function(transaction) {
			if (transaction.get('allotted')) {
				$.postJSON('/api/syndicate/calulate_shares', transaction.toJSON(), function(response) {
					transaction.set(response);
				}).error(function(response) {
					Alert(JSON.parse(response.responseText).error, 'OK');
				});
			} else {
				transaction.set({
					brokerSellingConcession: null,
					allocationPricePerShare: null,
					allocationValue: null,
					totalBrokerSellingConcession: null
				});
			}
		}, 50),
		/** 
		 * Notify selected accounts who have transactions
		 * @param options, an options object containing success or error callbacks
		 */
		notifySelected: function(options) {
			var selected = this.contactList.getSelected();
			$.postJSON(this.urlRoot + '/' + this.id +'/notify', selected.toJSON(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Finalize the transactions
		 * @param options, an options object containing success or error callbacks
		 */
		finalizeTransactions: function(options) {
			var that = this;
			$.post(this.urlRoot + '/' + this.id +'/finalize', function() {
				if (options.success) options.success();
				if (that.collection) that.collection.remove(that);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Books transactions with attribute "selected: true"
		 * @param options, an options object containing success or error callbacks
		 */
		bookTransactions: function(options) {
			var selected = new Backbone.Collection(this.cmTransactions.where({'selected': true}));
			var that = this;
			this.cmTransactions.invoke('unset', 'selected');
			$.postJSON(this.urlRoot + '/' + this.id +'/booked', selected.toJSON(), function(response) {
				that.cmTransactions.invoke('unset', 'selected');
				selected.invoke('set', {isBooked: true});
				if (options.success) options.success(response);
			}).error(function(response) {
				that.cmTransactions.invoke('set', {selected: true});
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Get preview of booking transactions
		 * @param options, an options object containing success or error callbacks, success callback contains booking preview collection
		 */
		getBookingPreview: function(options) {
			var selected = this.cmTransactions.getReadyToBeBooked();
			var that = this;
			$.postJSON(this.urlRoot + '/' + this.id +'/book_preview', selected.toJSON(), function(response) {
				var bookingPreview = new TransactionCollections.BookingPreviews();
				_.each(response, function(preview) {
					bookingPreview.add(new bookingPreview.model(preview));
				});
				if (options.success) options.success(bookingPreview);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		/** 
		 * Notifies transactions with attribute "selected: true" of final prospectus
		 * @param options, an options object containing success or fail callbacks
		 */
		notifyFinalProspectus: function(options) {
			var selected = this.contactList.getSelected();
			$.postJSON(this.urlRoot + '/' + this.id +'/notify_final_prospectus', selected.toJSON(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		}
	});

	var kendoOpportunitySchema = kendo.data.Model.define({
		fields: {
			ticker: {editable: false},
			issuer: {editable: false},
			totalIOI: {editable: false},
			publicOfferingPrice: {type:'number', validation: { min: 1 }},
			totalVolume: {type: 'number'},
			settlementDate: {type: 'date', validation: {}},
			tradeDate: {type: 'date', validation: {}},
			size: {type: 'number', validation: { min: 1 }},
			sellingConcession: {type: 'number'},
			grossSpread: {type: 'number'},
			orderPeriod: {editable: false},
			saveButton: {editable: false}
		},
		id: 'internalCusip',
		// hijack the toJSON method to inject the id
		toJSON: function(){
			// call the original toJSON method from the observable prototype
			var json = kendo.data.Model.prototype.toJSON.call(this);
			json.id = this.id;
			return json;
		}
	});
	var BaseOpportunities = BaseCaisCollection.extend({
		initialize: function() {
			this.onStatusIdChange();
			this.listenTo(PipelineAppModel, 'change:transactionStatusId', this.onStatusIdChange);
		},
		getOfferingGridDs: function() {
			return new kendo.Backbone.DataSource({
				collection: this,
				autoSync: true,
				schema: {
					model: kendoOpportunitySchema
				},
				aggregate: [
					{ field: "totalVolume", aggregate: "sum" },
					{ field: "totalIOI", aggregate: "sum" },
					{ field: "size", aggregate: "sum" }
				]
			});
		},
		onStatusIdChange: function() {
			this.params.transactionStatus = this.statuses[PipelineAppModel.get('transactionStatusId')];
			this.setUrl();
		},
		params: {
			transactionStatus: 'IOI_PLACED'
		},
		model:CmOfferingModel,
		parse: function(response) { return response; },
		statuses: ['IOI_PLACED','ACCEPTED_BY_USER'],
	});


	/** 
	 * Collections for all
	 */
	var AllOpportunities = BaseOpportunities.extend({
		baseUrl: '/api/syndicate/transactions'
	});

	var staticCollection = new AllOpportunities();

	var getActiveCollection = function() {
		var filters = PipelineAppModel.get('filters');
		staticCollection.params = {};
		switch (filters.type) {
			case 'cais':
			case 'CAIS':
				// do nothing
				break;
			case 'Firm': // firm
				if (!filters.dataNode.id) throw 'A client ID must be defined to fetch client opportunities.';
				staticCollection.params.cid = filters.dataNode.id;
				break;
			case "Team":
				if (!filters.dataNode.advisorTeamId) throw 'A advisorTeamId must be defined to fetch advisor team opportunities.';
				staticCollection.params.tid = filters.dataNode.advisorTeamId;
				break;
			case "Advisor":
				if (!filters.dataNode.userId) throw 'A userId must be defined to fetch advisor opportunities.';
				staticCollection.params.uid = filters.dataNode.userId;
				break;
			case "Client":
				if (!filters.dataNode.investorId) throw 'A investorId must be defined to fetch client(investor) opportunities.';
				staticCollection.params.vid = filters.dataNode.investorId;
				break;
			case "Entity":
				if (!filters.dataNode.investmentEntityId) throw 'A investmentEntityId must be defined to fetch investment entity opportunities.';
				staticCollection.params.eid = filters.dataNode.investmentEntityId;
				break;
		}
		staticCollection.onStatusIdChange();
		staticCollection.reset();
		return staticCollection;
	};

	return {
		getActiveCollection: getActiveCollection
	};
});