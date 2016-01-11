define([
	'underscore',
	'backbone',
	'collections/accounts/advisor_teams'
], function(_, Backbone, AdvisorTeams) {


	var Account = Backbone.Model.extend({
		initialize: function() {
//			this.listenTo(this.advisorTeams, 'sync', this.onAdvisorTeamSync);
			this.advisorTeams = new this.advisorTeams();
			this.on('change:advisorTeamId', this.onAdvisorTeamChange);
			// reverse ref to this model
			this.advisorTeams.investmentEntity = this;
		},
		idAttribute: 'accountId',
		advisorTeams: AdvisorTeams.AdvisorTeams,
		initAdvisorTeams: function() {
			var that = this;
			this.advisorTeams.setUrl(this.id);
			this.advisorTeams.fetch({
				success: function(collection) {
					if (collection.length) {
						that.set('advisorTeamId', null, {silent: true});
						that.set('advisorTeamId', collection.at(0).id);
					}
				}
			});
		},
		onAdvisorTeamChange: function() {
			var that = this;
			this.team = this.advisorTeams.get(this.get('advisorTeamId'));
			this.team.members.fetch({
				success: function(collection) {
					that.set('userId', null, {silent: true});
					if (collection.length) that.set('userId', collection.at(0).id);
					that.trigger('team:sync', that.team.members);
				}
			});
		}
	});

	/** 
     * AllEntitites
     * Collection class for all entities
     */
	var AllEntitites = Backbone.Collection.extend({
		initialize: function() {},
		model: Account,
		url: '/api/entities'
	});
	/** 
     * CmEntities
     * Collection class for CM Entities
     */
	var CmEntities = Backbone.Collection.extend({
		url: '/api/entities/cm',
		model: Account,
		comparator: 'accountName',
		parse: function(response) {
			var arr = [];
			_.each(response.bdAccounts, function(acct) {
				arr.push(acct);
			}, this);
			_.each(response.riaBlockAccounts, function(acct) {
				arr.push(acct);
			}, this);
			return arr;
		}
	});
	/** 
     * SpEntities
     * Collection class for SP entities
     */
	var SpEntities = Backbone.Collection.extend({
		url: '/api/entities/sp',
		model: Account
	});
	/** 
     * AiEntities
     * Collection class for AI Entities
     */
	var AiEntities = Backbone.Collection.extend({
		url: '/api/entities/ai',
		model: Account
	});

	return {
		all: new AllEntitites(),
		cm: new CmEntities(),
		sp: new SpEntities(),
		ai: new AiEntities()
	}
});