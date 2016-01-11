/*
view to manage the entity details navigation
accepts investmentEntityId as options argument
Extends BaseDetailNav
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/accounts/detail_nav/base_nav',
	'text!templates/accounts/detail_nav/detail_nav.html'
], function ($, _, Backbone, BaseDetailNav, EntityNavTemplate) {
	var EntityDetailNav = BaseDetailNav.extend({
		options: {
			investmentEntityId: null
		},
		template: EntityNavTemplate,
		postRender: function() {
			this.initCheckboxes();
		},
		initCheckboxes: function() {
			var that = this;
			Server.getInvestmentEntityNavInfo({investmentEntityId: this.options.investmentEntityId}, function (response) {
				var info = response;
				// patch to check advisor info and client info by default
				info.advisorInformation = true;
				info.tradeDetails = true;
				info.clientInformation = true;
				that.enableCheckboxes(info);
			});
		},
		hideAustQualification: function() {
			this.$('[data-section="entity-australia-qualification"]').hide();
		},
		showAustQualification: function() {
			this.$('[data-section="entity-australia-qualification"]').show();
		},
		showIndivDetails: function(entityTypeId) {
			this.$('#detailsLink, #nonIndivDetailsLink, #employmentLink').removeClass('disabled');
			this.$('#detailsLink, #employmentLink').show();
			// this.$('[data-section="entity-benefit-plan"]').hide();
			this.$('#nonIndivDetailsLink').hide().addClass('disabled');

			// only show benefit plan for IRAs, keough and self-dir retirement acct
			/*if (entityTypeId === 47 || entityTypeId === 49 || entityTypeId === 50) {
				this.$('[data-section="entity-benefit-plan"]').show().removeClass('disabled');
			}*/
		},	
		hideIndivDetails: function(entityTypeId) {
			this.$('#detailsLink, #nonIndivDetailsLink').removeClass('disabled');
			this.$('#nonIndivDetailsLink').show();
			// this.$('[data-section="entity-benefit-plan"]').hide().addClass('disabled');
			this.$('#employmentLink').hide().addClass('disabled');
			this.$('#detailsLink').hide().addClass('disabled');

			if (entityTypeId === 47) {
				
			}
		}
	});
	return EntityDetailNav;
}); 