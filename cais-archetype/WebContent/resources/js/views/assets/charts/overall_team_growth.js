define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/organization/organization_collections',
	'views/assets/charts/base_chart'
], function ($, _, Backbone, Vm, Events, Handlebars, OrganizationCollections, BaseCharts) {
	var OverallTeamGrowth = BaseCharts.extend({
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
				chartArea: { background: "" },
				seriesDefaults: {
					type: "line",
					style: "smooth"
				},
				dataSource: {
					data: OrganizationCollections.PersonnelHistory.getChartData()
				},
				series: [{
					field: 'count',
					categoryField: 'date'
				}],
				valueAxis: {
					labels: {
						format: "{0}"
					},
					line: {
						visible: false
					}
				},
				categoryAxis: {
					field: 'date',
					baseUnit: 'fit',
					majorGridLines: {
						visible: false
					},
					labels: {
						template: "#= kendo.toString(value, 'M/yy') #"
					}
				},
				tooltip: {
					visible: true,
					color: '#fff',
					format: "{0}",
					template: "<strong>#= kendo.toString(category, 'MMM yyyy') #:</strong> #= value # employees"
				}
			}).data('kendoChart');
		}
	});
	return OverallTeamGrowth;
});