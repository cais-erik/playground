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
	'text!templates/accounts/detail_nav/team_view_nav.html'
], function ($, _, Backbone, BaseDetailNav, TeamViewNavTemplate) {
	var TeamViewNav = BaseDetailNav.extend({
		template: TeamViewNavTemplate,
		className: 'team-detail-nav view-navigation'
	});
	return TeamViewNav;
}); 