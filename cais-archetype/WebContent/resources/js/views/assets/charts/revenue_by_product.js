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
	var RevenueByProduct = BaseCharts.extend({
		className: 'revenue-by-product',
		options: {
			year: null
		},
		render: function() {
			this.initChart();
		},
		initChart: function() {
			var ytdTotals = RevenueCollections.totalRevenue.getYtdByProduct(this.options.year);
			 this.chart = this.$el.kendoChart({
				seriesDefaults: {
					labels: false
				},
				legend: {
					visible: true,
					position: "bottom"
				},
				chartArea: {
					background: ""
				},
				 seriesDefaults: {
	                    labels: {
	                        visible: true,
	                        background: "transparent",
	                        template: "#= category #: \n #= value#%"
	                    }
	                },
				series: [{
					type: "donut",
                    startAngle: 150,
						data: [{
	                        category: "Funds",
	                        value: 71
	                    },{
	                        category: "Syndicate",
	                        value: 25
	                    },{
	                        category: "Structured Notes",
	                        value: 4
	                    }],
	                    labels: {
	                        visible: true,
	                        background: "transparent",
	                        position: "outsideEnd",
	                        color: '#fff',
	                        template: "#= category #: \n #= value#%"
	                    }

				}],
				tooltip: {
					visible: true,
					color: '#fff',
					template: "#= category # : #= value #%"
				}
			}).data('kendoChart');
		}
	});
	return RevenueByProduct;
});