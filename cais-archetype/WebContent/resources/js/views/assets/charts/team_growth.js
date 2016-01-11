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
	var TeamGrowth = BaseCharts.extend({
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
				chartArea: {
					background: ""
				},
				seriesDefaults: {
					type: "line",
					style: "smooth",
				},
				series: OrganizationCollections.BusinessUnitHistory.getChartData(),
				categoryAxis: {
					baseUnit: 'fit',
					categories: OrganizationCollections.BusinessUnitHistory.getCategories(),
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
					template: "<strong>#= kendo.toString(category, 'MMM yyyy') #:</strong> #= value # #= series.name #"
				}
			}).data('kendoChart');

		}
	});
	return TeamGrowth;
});