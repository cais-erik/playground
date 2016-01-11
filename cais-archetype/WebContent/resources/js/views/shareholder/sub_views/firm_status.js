define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/organization/organization_collections',
	'views/shareholder/sub_views/base_sh_subview',
	'views/assets/tabbed_multi_view',
	'views/assets/charts/personnel_by_team',
	'views/assets/charts/team_growth',
	'views/assets/charts/overall_team_growth',
	'text!templates/shareholder/firm_status.html',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Vm, Events, Handlebars, OrganizationCollections, BaseShSubview, TabbedMultiView, PersonnelByTeam, TeamGrowth, OverallTeamGrowth, Template) {
	var FirmStatus = BaseShSubview.extend({
		template: Handlebars.compile(Template),
		className: 'firm-status subview',
		title: 'Firm',
		chartViews: [
			{
				name: 'Personnel by Team',
				view: PersonnelByTeam
			}
		],
		preRender: function(callback) {
			$.when(
				OrganizationCollections.Organization.fetch(),
				OrganizationCollections.PersonnelHistory.fetch(),
				OrganizationCollections.BusinessUnitHistory.fetch(),
				OrganizationCollections.Employees.fetch()
			).done(_.bind(function(){
				this.context = {
					organization: OrganizationCollections.Organization.toJSON(),
					// employees: OrganizationCollections.Employees.toJSON(),
					employeesByGroup: OrganizationCollections.Employees.getByGroup()
				};
				this.render();
			}, this));
		},
		postRender: function() {
			var tabbedCharts = Vm.create(this, 'TabbedMultiView', TabbedMultiView, {
				subViews: this.chartViews
			});
			this.$('.firm-charts').html(tabbedCharts.$el);
		},
		events: {
			'click .business-unit h3': 'businessUnitClickHandler'
		},
		businessUnitClickHandler: function(e) {
			$(e.currentTarget).parent('li').toggleClass('active');
		}
	});
	return FirmStatus;
});