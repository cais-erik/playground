define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/charts/base_chart',
	'collections/admin/reports/revenue_collections'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseCharts, RevenueCollections) {
	var MonthlyRevenueByProduct = BaseCharts.extend({
		className: 'personnel-by-team',
		render: function() {
			this.initChart();
		},
		initChart: function() {
			var data = RevenueCollections.totalRevenue.getMonthlyChartData();
			console.log(data);
			console.log(RevenueCollections.totalRevenue.getMonthlyAxis());
			this.chart = this.$el.kendoChart({
				seriesDefaults: {
					type: 'area'
				},
				legend: {
					position: "bottom"
				},
				chartArea: {
					background: ""
				},
				series: {
					data: data,
					field: 'revenue'
				},
				categoryAxis: {
					categories: RevenueCollections.totalRevenue.getMonthlyAxis(),
					majorGridLines: {
						visible: false
					}
				},
				valueAxis: {
					labels: {
						format: "{0:C0}",
					}
				},
				tooltip: {
					visible: true,
					color: '#fff',
					template: "#= series.name # $#= kendo.toString(value, 'n0') #"
				}
			}).data('kendoChart');
		}
	});
	return MonthlyRevenueByProduct;
});