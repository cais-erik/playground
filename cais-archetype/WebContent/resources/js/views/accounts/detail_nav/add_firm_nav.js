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
	'text!templates/accounts/detail_nav/add_firm_nav.html',
	'models/authed_user'
], function ($, _, Backbone, BaseDetailNav, AddFirmTemplate, AuthedUser) {
	var EntityDetailNav = BaseDetailNav.extend({
		template: AddFirmTemplate,
		className: 'firm-detail-nav view-navigation',
		postRender: function() {
			if (!AuthedUser.get('caisemployee')) {
				if (!AuthedUser.get('roleSuperivisor')) {
					this.$('[data-section=cap-markets-accounts], [data-section=structured-products-accounts]').hide();
				}
			}
		}
	});
	return EntityDetailNav;
}); 