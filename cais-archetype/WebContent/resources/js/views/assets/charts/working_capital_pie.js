define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/charts/base_chart',
	'collections/admin/reports/revenue_collections',
], function ($, _, Backbone, Vm, Events, Handlebars, BaseCharts, RevenueCollections) {
	var WorkingCapitalPie = BaseCharts.extend({
		className: 'working-capital-pie',
		render: function() {
			this.initChart();
		},
		initChart: function() {
			var data = RevenueCollections.WorkingCapital.getBreakdown();
			this.chart = this.$el.kendoChart({
				title: false,
				legend: {
					position: "bottom"
				},
				chartArea: {
					background: ""
				},
				series: [{
					type: 'donut',
					data: data
				}],
				tooltip: {
					visible: true,
					color: '#fff',
					template: "#= category # - $#= kendo.toString(value, 'n0') #"
				}
			}).data('kendoChart');
		}
	});
	return WorkingCapitalPie;
});