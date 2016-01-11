define([
	'jquery',
	'underscore',
	'backbone',
	'collections/firm_supervisors',
	'collections/products/firm_products',
	'collections/accounts/syndicate_accounts',
	'collections/firm_team_members'
], function($, _, Backbone, FirmSupervisors, FirmProducts, CapMarketsAccounts, FirmTeamMembers) {
	var FirmModel = Backbone.Model.extend({
		urlRoot: '/api/group/firm',
		defaults: {
			typeOfGroup: 3,
			groupId: 6
			// clientType: 'Broker Dealer'
		},
		idAttribute: 'clientId',
		groupManagerDetails: Backbone.Collection.extend({
			url: '/getGroupManagerDetails',
			parse: function(resp, options) {
				return resp.msg;
			},
			model: Backbone.Model.extend({idAttribute: 'groupId'})
		}),
		initialize: function(options) {
			var that = this;
			this.groupManagerDetails = new this.groupManagerDetails();
			this.selectedProducts = new FirmProducts();
			this.supervisors = new FirmSupervisors();
			this.teamMembers = new FirmTeamMembers();
			this.capMarketsAccounts = new CapMarketsAccounts();
			this.on('change:fullName', this.validateName);
			this.on('change:clientId', function() {
				this.supervisors.setUrl(this.id);
				this.selectedProducts.setUrl(this.id);
				this.teamMembers.setUrl(this.id);
				this.capMarketsAccounts.setUrl(this.id);
			});
			this.on('change', _.debounce(this.updateCompletion, 500));
		},
		completed: {
			'basic-info': false,
			'product-access': false,
			'product-permissions': false,
			'functions': false
		},
		completionMap: [
			{
				name: 'basic-info',
				testCase: function() {
					return this.get('fullName') !== undefined && this.get('groupId') !== undefined;
				}
			},
			{
				name: 'product-access',
				testCase: function() {
					return this.selectedProducts.length > 0;
				}
			},
			{
				name: 'product-permissions',
				testCase: function() {
					return this.selectedProducts.length > 0;
				}
			},
			{
				name: 'supervisor',
				testCase: function() {
					return this.supervisors.length > 0;
				}
			},
			{
				name: 'cais-account-team',
				testCase: function() {
					return this.teamMembers.length > 0;
				}
			}
		],
		/*
		addSupervisor: function(model, options) {
			options = _.extend({}, options);
			if (!this.id) {
				if (options.error) options.error('Model has no ID.');
			//	return;
			}
			$.postJSON(this.urlRoot + '/' + this.id + '/supervisor', model.toJSON(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		*/
		setTeamMembers: function(members, options) {
			options = _.extend({}, options);
			if (!this.id) {
				if (options.error) options.error('Model has no ID.');
			//	return;
			}
			$.postJSON(this.urlRoot + '/' + this.id + '/cais_team', members.serialize(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		setProducts: function(options) {
			options = _.extend({}, options);
			if (!this.id) {
				if (options.error) options.error('Model has no ID.');
			//	return;
			}
			$.postJSON(this.urlRoot + '/' + this.id + '/products', this.selectedProducts.toJSON(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		// updates the completed object using the completion requirements map
		updateCompletion: function() {
			var that = this;
			_.each(this.completionMap, function(map) {
				that.completed[map.name] = _.bind(map.testCase, that)();
				that.trigger('completionUpdated', that.completed);
			});
			return this.completed;
		},
		validateName: function(model, value, options) {
			var name = this.get('fullName');
			var that = this;
			// do not validate if no name or if name change event was caused by server fetch/parse
			if (!name.length || options.xhr) return; 
			Server.doesFirmNameExists({firmName: name}, function(response) {
				if (response === 'true') {
					that.set({'fullName': ''});
					that.trigger('modelError', {
						field: 'fullName',
						msg: name + ' is already a firm on CAIS. Please pick another name.'
					});
				}
			});
		},
		getGroupManagerDetails: function() {return this.groupManagerDetails.get(this.get('groupId'))},
		getPermissionsByProduct: function() { return this.selectedProducts.toJSON()},
		toJSON: function() {
			var addressAttrs = ['country', 'street1', 'street2', 'city', 'state', 'postalCode', 'email', 'alternateEmail', 'phone', 'fax', 'addressId', 'addressTypeId'];
			var obj = _.omit(this.attributes, addressAttrs);
			obj.address = _.pick(this.attributes, addressAttrs);
			return obj;
		},
		parse: function(response) {
			var obj = $.extend(response.address, _.omit(response, ['address']));
			return obj;
		}
	});
	return FirmModel;
});