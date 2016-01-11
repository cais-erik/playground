/*
Generic firm/team/client selector view
see options
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/assets/firm_team_advisor_selector.html',
	'collections/firms'
], function ($, _, Backbone, Handlebars, Template, Firms) {
	var view = Backbone.View.extend({
		className: 'destination-selector',
		options:{
			hideFirm: false, // don't show the firm level (typically there is only one firm avaiable for users, unless CAIS admin)
			hideInvestors: true, //hide investor selector
			hideAdvisor: false,
			hideTeam: false,
			firmId: null,
			advisorTeamId: null, // prepopulate advisor team id
			advisorId: null, // prepopulate advisor id
			investorId: null
		},
		initialize: function() {
			var that = this;
			// TODO: allow passing in firm id to view to bootstrap preselected firm
			Firms.fetch({
				success: function() {
					// bootstrap the firm teams if there is only one firm
					if (Firms.models.length === 1 || that.options.firmId) {
						that.firm = Firms.get(that.options.firmId) || Firms.at(0);
						that.firm.fetchChild(function(teams) {
							that.teams = teams;
							// that.options.hideFirm = true;
							// if there are preloaded options passed to view
							if (that.options.advisorTeamId) {
								that.team = that.teams.findWhere({'advisorTeamId': parseInt(that.options.advisorTeamId)});
								that.team.fetchChild(function(advisors) {
									that.advisors = advisors;
									if (that.options.advisorId) {
										that.advisor = that.advisors.findWhere({userId: parseInt(that.options.advisorId)});
										that.advisor.fetchChild(function(clients) {
											that.clients = clients;
											if (that.options.investorId) {
												that.client = that.clients.findWhere({investorId: parseInt(that.options.investorId)});
											}
											that.render();
										});
									}
									else{
										that.render();	
									}
									
								}, true);
							}
							else {
								that.render();
							}
						}, true);
					}
					else {
						that.render();
					}	
				}
			});
		},
		render: function() {
			var template = Handlebars.compile(Template);
			var context = {
				firms: Firms.toJSON(),
				options: this.options
			};
			if (this.teams) context.teams = this.teams.toJSON();
			if (this.advisors) context.advisors = this.advisors.toJSON();
			if (this.clients) context.clients = this.clients.toJSON();
			this.$el.html(template(context));
			
			if (this.options.advisorId || this.options.advisorTeamId) {
				this.$('[name=advisorTeamId]').val(this.options.advisorTeamId);
				this.$('[name=advisorId]').val(this.options.advisorId);
				this.options.advisorId = null;
				this.options.advisorTeamId = null;
			}
			if (this.firm) this.$('[name=clientId]').val(this.firm.get('clientId'));
			if (this.team) this.$('[name=advisorTeamId]').val(this.team.get('advisorTeamId'));
			if (this.advisor) this.$('[name=advisorId]').val(this.advisor.get('userId'));
			if (this.client) this.$('[name=investorId]').val(this.client.get('investorId'));
			this.$('[data-role=dropdownlist]').kendoDropDownList();
			this.trigger('render');
		},
		events: {
			'change [name=clientId]': 'firmChangeHandler',
			'change [name=advisorTeamId]': 'teamChangeHandler',
			'change [name=advisorId]': 'advisorChangeHandler'
		},
		// TODO: these two functions could be neater...
		firmChangeHandler: function(event) {
			var elem = $(event.target);
			var that = this;
			if (!elem.val()) {
				this.firm = null;
				this.render();
				return;
			}
			this.firm = Firms.findWhere({'clientId': parseInt(elem.val())});
			this.firm.fetchChild(function(teams) {
				that.teams = teams;
				that.render();
			}, true);
		},
		teamChangeHandler: function(event) {
			var elem = $(event.target);
			var that = this;
			if (!this.teams) return;
			if (!elem.val()) {
				this.team = null;
				this.advisors = null;
				this.render();
				return;
			}
			this.team = this.teams.findWhere({'advisorTeamId': parseInt(elem.val())});
			this.team.fetchChild(function(advisors) {
				that.advisors = advisors;
				that.render();
			}, true);
		},
		isAdvisorSelected: function() {
			var status = false;
			if (!this.$('[name=clientId]').is(':disabled') && !this.$('[name=advisorTeamId]').is(':disabled')) {
				status = this.$('[name=advisorId]').val();
			}
			return status;
		},
		advisorChangeHandler: function(event) {
			var elem = $(event.target);
			var that = this;
			if (!this.team) return;
			if (elem.val() === 0) {
				this.render();
				return;
			}
			this.advisor = this.advisors.findWhere({'userId': parseInt(elem.val())});
			this.advisor.fetchChild(function(clients) {
				that.clients = clients;
				that.render();
			}, true);
		}
	});
	return view;
});