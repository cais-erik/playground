define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model',
	'collections/base_cais_collection',
	'models/user/user'
], function($, _, Backbone, BaseModel, BaseCollection, User) {
	// TODO: consider moving to own file
	var TeamMember = User.extend({
		defaults: _.extend({}, User.prototype.defaults, {
			roleId: 3
		}),
		initialize: function() {
			this.on('change:email', this.validateEmail);
		}
	});
	// TODO: move this up to the firm model
	var FirmTeamMembers = Backbone.Collection.extend({
		baseUrl: '/api/group/firm',
		model: TeamMember,
		setUrl: function(firmId) {
			this.url = this.baseUrl + '/' + firmId + '/members'
		}
	});
	// TODO: consider moving to own file
	var TeamMembers = Backbone.Collection.extend({
		model: TeamMember,
		setUrl: function(firmId) {
			this.url = '/api/group/team/' + firmId + '/members'
		},
		// adds an existing user object to the team
		addExistingMember: function(attributes, options) {
			var model = new this.model(attributes);
			var that = this; 
			$.postJSON(this.url, model.toJSON(), function(response) {
				if (options.success) options.success(model, that, response);
				that.add(model);
			}).error(function(response) {
				if (options.error) options.error(model, that, response);
			});
		}
	});
	var AdvisorTeam = Backbone.Model.extend({
		urlRoot: '/api/group/team',
		defaults: {
		//	permission: []
		},
		initialize: function(options) {
			var that = this;
			this.on('change:clientId', function() {	
				that.firmTeamMembers.setUrl(this.get('clientId'));
			});
			this.on('change:id', function() {	
				that.teamMembers.setUrl(this.id);
			});
			this.on('change', _.debounce(this.updateCompletion, 500));
		},
		completionMap: [
			{
				name: 'basic-info',
				testCase: function() {
					return this.get('advisorName') !== undefined && this.get('clientId') !== undefined;
				}
			},
			{
				name: 'team-members',
				testCase: function() {
					return this.teamMembers.length > 0;
				}
			}
		],
		completed: {
			'basic-info': false,
			'functions': false,
			'cais-account-team': false
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
		toJSON: function() {
			var addressAttrs = ['country', 'street1', 'street2', 'city', 'state', 'postalCode', 'email', 'alternateEmail', 'phone', 'fax', 'addressId', 'addressTypeId'];
			var obj = _.omit(this.attributes, addressAttrs);
			obj.address = _.pick(this.attributes, addressAttrs);
			return obj;
		},
		getAddress: function() {
			return _.omit(this.toJSON().address, ['addressId', 'email']);
		},
		getFirmMembers: function(callback) {
			var that = this;
			this.teamMembers.fetch({
				success: function() {
					if (that.firmTeamMembers.length) {
						if (callback) callback(that.filterFirmMembers());
					} else {
						that.firmTeamMembers.fetch({
							success: function() {
								if (callback) callback(that.filterFirmMembers());	
							}
						})
					}
				}
			});
		},
		filterFirmMembers: function() {
			var collection = new Backbone.Collection();
			this.firmTeamMembers.each(function(model) {
				if (!this.teamMembers.findWhere({userId: model.get('userId')})) collection.add(model);
			}, this);
			return collection
		},
		parse: function(response) {
			var obj = $.extend(response.address, _.omit(response, ['address']));
			return obj;
		},
		firmTeamMembers: new FirmTeamMembers,
		teamMembers: new TeamMembers
	});
	return AdvisorTeam;
});