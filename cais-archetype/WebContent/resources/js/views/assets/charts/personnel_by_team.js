define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/charts/base_chart',
	'collections/organization/organization_collections',
], function ($, _, Backbone, Vm, Events, Handlebars, BaseCharts, OrganizationCollections) {
	var PersonnelByTeam = BaseCharts.extend({
		className: 'personnel-by-team',
		render: function() {
			this.initChart();
		},
		initChart: function() {
			this.chart = this.$el.kendoChart({
				title: false,
				legend: {
					position: "bottom"
				},
				seriesDefaults: {
					type: "column"
				},
				series: OrganizationCollections.BusinessUnitHistory.getPersonnelByTeam(),
				valueAxis: {
					labels: {
						format: "{0}"
					},
					line: {
						visible: false
					},
					axisCrossingValue: 0
				},
				tooltip: {
					visible: true,
					color: '#fff',
					format: "{0}",
					template: "#= series.name #: #= value # employees"
				}
			}).data('kendoChart');
		}
	});
	return PersonnelByTeam;
});