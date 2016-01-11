define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'views/accounts/content_views/base_details',
	'views/accounts/detail_nav/team_view_nav',
	'models/team',
	'views/accounts/content_views/team_details/team_basic_info',
	'views/accounts/content_views/team_details/team_members',
	'text!templates/accounts/team_detail/team_detail.html'
], function ($, _, Backbone, Vm, BaseDetails, TeamViewNav, TeamModel, BasicInfo, TeamMembers, Template) {
	var TeamDetail = BaseDetails.extend({
		options: {},
		className: 'team-details detail-view',
		model: TeamModel,
		viewNav: TeamViewNav,
		template: Template,
		firmSubViews: {
			'basic-info': BasicInfo,
			'team-members': TeamMembers
		}
	});
	return TeamDetail;
});