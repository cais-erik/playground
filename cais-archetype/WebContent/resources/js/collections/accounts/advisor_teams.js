define([
	'jquery',
	'underscore',
	'backbone',
	'models/user/user'
], function($, _, Backbone, User) {

	/** 
     * AdvisorTeamMembers
     * Collection class for AdvisorTeamMembers
     */
	var AdvisorTeamMembers = Backbone.Collection.extend({
		params: {
			type: null,
		},
		model: User,
		baseUrl: '/api/accounts',
		setUrl: function(accountId, teamId) {
			this.url = this.baseUrl + '/' + accountId + '/teams/' + teamId +'/advisors';
		}
	});

	/** 
     * AdvisorTeam
     * Model class for an Advisor Team
     */
	var AdvisorTeam = Backbone.Model.extend({
		members: AdvisorTeamMembers,
		initialize: function() {
			this.members = new this.members(); 
			if (this.collection.investmentEntity) {
				this.members.setUrl(this.collection.investmentEntity.id, this.id);
			}
			if (this.get('members')) {
				_.each(this.get('members'), function(model) {
					this.members.add(new this.members.model(model));
				}, this);
			}
		}
	});

	/** 
     * AdvisorTeams
     * Collection class for AdvisorTeams
     * Returns a collection of all advisor teams by account id
     */
	var AdvisorTeams = Backbone.Collection.extend({
		model: AdvisorTeam,
		params: {
			type: null,
		},
		baseUrl: '/api/accounts',
		setUrl: function(id) {
			this.url = this.baseUrl + '/' + id + '/teams';
		}
	});

	/** 
     * AllAdvisorTeamMembers
     * Collection class for AllAdvisorTeamMembers
     * Returns a collection of all advisor team members by account id
     */
	var AllAdvisorTeamMembers = Backbone.Collection.extend({
		model: AdvisorTeam,
		params: {
			type: null,
		},
		baseUrl: '/api/accounts',
		setUrl: function(id) {
			this.url = this.baseUrl + '/' + id + '/advisors';
		}
	});
	return {
		AdvisorTeams: AdvisorTeams,
		AllAdvisorTeamMembers: AllAdvisorTeamMembers
	};
});

