/*
Collections and other data objects used in the trade ticket window
*/

define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'collections/base_cais_collection',
	'models/trade_ticket/active_ticket_item'
], function($, _, Backbone, Events, BaseCollection, ActiveTicketItem) {

	var ReviewDocs = BaseCollection.extend({
		initialize: function() {
		},
		sync: function(method, model, options) {
			this.params = {
				documentId: ActiveTicketItem.get('documentId')
			};
			this.setUrl();
			Backbone.sync(method, model, options);
		},
		baseUrl: '/getReviewDocs',
		params: {
			documentId: null
		}
	});
	var CommentModel = Backbone.Model.extend({
		toJSON: function() {
			var data = _.clone(this.attributes);
			data.postDate = kendo.toString((new Date(data.postDate)), 'g');
			if (data.closedDate) data.closedDate = kendo.toString((new Date(data.closedDate)), 'g');
			return data;
		}
	});
	var Comments = BaseCollection.extend({
		initialize: function() {},
		baseUrl: '/getTaskComments',
		// sort date descending
		comparator: function(comment) {
			return -comment.get('postDate');
		},
		model: CommentModel,
		params: {
			transactionTaskId: null
		},
		addComment: function(commentObj, options) {
			options = $.extend({}, options);
			var that = this;
			var params = {
				transactionTaskId: ActiveTicketItem.transactionTasks.activeTask.get('transactionTaskId'),
				caisId: ActiveTicketItem.transactionTasks.at(0).get('caisId'), // Ugly dep, this is from the task list :(
				clientId: ActiveTicketItem.get('clientId'),
				subscriptionId: ActiveTicketItem.get('subscriptionId'),
			};
			var data = $.extend(params, commentObj);
			Server.addTaskComments(JSON.stringify(data), function (response) {
				var model = new that.model(response[0]);
				that.add(model);
		        ActiveTicketItem.insertTransactionEventLog("Comments Added", "User added the following comments: '" + data.comment + "'");
	            if (options.success) options.success(model, that);
	        });
		},
		closeComment: function(id, options) {
			options = $.extend({}, options);
			var that = this;
			var model = this.findWhere({'taskCommentsId': id});
			Server.closeTaskComment({ taskCommentsId: id }, function (response) {
		        if (options.success) options.success(model, that);
		        ActiveTicketItem.insertTransactionEventLog("Comments Closed", "User closed the following comment : '" + model.get('comment') + "'");
	        });
		},
		openComment: function(id, options) {
			options = $.extend({}, options);
			var that = this;
			var model = this.findWhere({'taskCommentsId': id});
			Server.openTaskComment({ taskCommentsId: id }, function (response) {
		        if (options.success) options.success(model, that);
	        });
		}
	});
	var EventLog = BaseCollection.extend({
		initialize: function() {},
		baseUrl: '/getEventLogList',
		// sort date descending
		comparator: function(evt) {
			var date = new Date(evt.get('date'));
			return -date;
		},
		sync: function(method, model, options) {
			this.params = {
				transactionId: ActiveTicketItem.params.transactionId
			};
			this.setUrl();
			Backbone.sync(method, model, options);
		}
	});
	var TeamMembers = BaseCollection.extend({
		baseUrl: '/getAllTeamMembers',
		serializeWithCaisMembers: function() {
			var model = new this.model({
				emailaddress: 'caisops@caisgroup.com',
				name: 'CAIS Team',
				userId: 'cais_team',
				id: 'cais_team'
			});
			this.add(model);
			return this.toJSON();
		},
		sync: function(method, model, options) {
			this.params = {
				investmentEntityId: ActiveTicketItem.get('investmententityid')
			};
			this.setUrl();
			Backbone.sync(method, model, options);
		}
	});
	var DocsPresented = BaseCollection.extend({
		initialize: function() {},
		baseUrl: '/getDocsPresented',
		sync: function(method, model, options) {
			this.params = {
				subscriptionId: ActiveTicketItem.get('subscriptionId'),
			    transactionId: ActiveTicketItem.params.transactionId
			};
			this.setUrl();
			Backbone.sync(method, model, options);
		},
		parse: function(resp, options) {
			return resp;
		},
		// serialize into an object containing paulson docs and regular docs
		toJSON: function() {
			var obj = {
				paulsonDocs: _.invoke(this.filter(function(model) {return model.get('fileName').indexOf("Paulson") != -1; }), 'toJSON'),
				docs: _.invoke(this.filter(function(model) { return model.get('fileName').indexOf("Paulson") === -1; }), 'toJSON')
			};
			return obj;
		}
	});
	var DocsReceived = BaseCollection.extend({
		baseUrl: '/getReceivedDocsList',
		deleteDocument: function(id, options) {
			var deleteInfo = {
				docId: id,
				transactionId: ActiveTicketItem.params.transactionId
			};
            Server.deleteUploadedDocumentFromTransaction(JSON.stringify(deleteInfo), function (response) {
                if (options.success) options.success();
            }, function(response) {
				if (options.error) options.error(response);
            });
		},
		sync: function(method, model, options) {
			this.params = {
				subscriptionId: ActiveTicketItem.get('subscriptionId')
			};
			this.setUrl();
			Backbone.sync(method, model, options);
		},
		parse: function(resp, options) {
			if (resp.status === 'error') {
				// TODO: do some error handling in here
			}
			else {
				// filter the entity docs to only contain unsubmitted docs
				var transactionDocIds = _.pluck(resp.msg.subDocs, 'documentId');
				var unsubmittedDocs = _.filter(resp.msg.entityDocs, function(doc) {
					return _.indexOf(transactionDocIds, doc.documentId) < 0;
				});
				// put the entity docs in their own collection
				this.entityDocs = new Backbone.Collection(unsubmittedDocs);
				return resp.msg.subDocs;
			}
		}
	});

	var Fund = Backbone.Model.extend({
		modelChanged: false,
		initialize: function() {
			this.on('change', this.onAttrChange);
		},
		onAttrChange: function() {
			this.modelChanged = true;
		}
	});
	var Funds = BaseCollection.extend({
		initialize: function() {},
		model: Fund,
		fetch: function(options) {
			if(options.success) options.success();
		},
		canUserCreateNew: function() {
			if (ActiveTicketItem.get('isCaisFund')) return true;
			return false;
		},
		syncWithFund: function() {
			this.reset();
			var additionalInvestment = ActiveTicketItem.get('hasExistingInvestment');
			_.each(ActiveTicketItem.get('funds'), function(fund) {
				fund.subscriptionId = ActiveTicketItem.get('subscriptionId');
				// inject isCaisFund from ActiveTicketItem model for each fund
				fund.isCaisFund = ActiveTicketItem.get('isCaisFund');
				fund.minimumInvestment = function() {
					if (additionalInvestment) return fund.minAdditionalInvestment;
					else return fund.minNewInvestment;
				}();
				fund.isPlacementFeeApplicable = ActiveTicketItem.get('isPlacementFeeApplicable');
				this.add(new this.model(fund), {silent: true});
			}, this);

			this.fetchWithShareClasses({
				success: function() {
					Events.trigger('funds:synced');
				}
			});
		},
		haveModelsChanged: function() {
			var changed = false;
			this.each(function(model) {
				if (model.modelChanged || model.get('isNew')) changed = true;
			});
			return changed;
		},
		fetchWithShareClasses: function(options) {
			var count = 0;
			var that = this;
				that.each(function(fund, i) {
					$.getJSON('/api/transaction/ai/' + ActiveTicketItem.get('clientId')+'/'+fund.get('productId')+ '/placement_fee', function(response) {
						that.invoke('set', {placementFeeOptions: response}, {silent: true});
					
					$.getJSON('/api/products/ai/' + fund.get('productId') + '/share_class', function(response) {
						response = response.sort();
						fund.set('shareClassOptions', response, {silent: true});
						count++;
						if (count === that.length && options.success) options.success(that);
					}).error(function() {
						if (options.error) options.error(this);
					});
				}, this);
			});
		},
		saveFunds: function(options) {
			var data = this.serialize();
			var that = this;
			Server.getVerifiedDocsList(JSON.stringify(data), function(response) {
				ActiveTicketItem.insertTransactionEventLog("Transaction Information Verified", "User verified the Transaction Information");
				that.invoke('set', {'isNew': false});
				that.each(function(model) {
					model.set({'isNew': false});
					model.modelChanged = false;
				});
				Events.trigger('fund:added');
				if (options.success) options.success(that, response)
			}, function(response) {
				if (options.error) options.error(that, response);
			});	
		},
		serialize: function() {
			var forEachModel = function(model) {
				var obj = _.pick(model.attributes, 'productId','amount','shareClass','placementFee','investmentDate');
				obj.subscriptionId = ActiveTicketItem.get('subscriptionId');
				obj.investmentEntityId = ActiveTicketItem.get('investmententityid');
				obj.caisId = ActiveTicketItem.transactionTasks.at(0).get('caisId'); // Ugly dep, this is from the task list :(
				obj.userId = ActiveTicketItem.get('advisorId'); // Ugly dep, this is from the task list :(
				return obj;
			};
		    return this.map(function(model){ return forEachModel(model); });
		}
	});
	var LegalNameList = Funds.extend({
		initialize: function() {
			_.each(ActiveTicketItem.get('legalNameList'), function(name) {
				this.add(new Backbone.Model({
					isCaisFund: true,
					isPlacementFeeApplicable: true, // these are all cais funds, so this is always true
					legalName: name.legalName,
					productId: name.fundId
				}));
			}, this);
		}
	});
	return {
		review: new ReviewDocs(),
		docsPresented: new DocsPresented(),
		docsReceived: new DocsReceived(),
		comments: Comments,
		funds: new Funds(),
		teamMembers: new TeamMembers(),
		events: new EventLog(),
		legalNameList: new LegalNameList()
	}
});

