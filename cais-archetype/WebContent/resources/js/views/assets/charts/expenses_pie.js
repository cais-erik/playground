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
	var ExpensesPie = BaseCharts.extend({
		className: 'expenses-pie',
		render: function() {
			this.initChart();
		},
		initChart: function() {
			var data = RevenueCollections.YTDExpenses.getBreakdown();
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
	                        category: "Compensation & Related Expenses",
	                        value: 41
	                    },{
	                        category: "Advisor Commissions",
	                        value: 17
	                    },{
	                        category: "Operating Expenses",
	                        value: 33
	                    },{
	                        category: "Non-Cash Items",
	                        value: 8
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
	return ExpensesPie;
});