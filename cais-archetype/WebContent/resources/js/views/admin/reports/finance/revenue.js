define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report',
	'text!templates/admin/reports/revenue.html',
	'collections/admin/reports/revenue_collections',
	'views/admin/reports/finance/revenue_reporter'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, Template, RevenueCollections, RevenueReporter) {
	var Revenue = BaseReport.extend({
		options: {
			sectionTitle: 'Revenue'
		},
		template: Template,
		title: 'Revenue',
		className: 'revenue-view',
		events: {
			'click .modify-revenue': 'showModifyRevenue'
		},
		loadCount: 0,
		postRender: function() {
			this.$('.numbers-container .number').hide();
			RevenueCollections.totalRevenue.fetch({
				success: _.bind(this.initCharts, this),
				error: _.bind(function() {
					this.trigger('view:ready');
					Alert('There was an error while fetching the revenue data.', 'OK');
				}, this)
			});
		},
		initCharts: function() {
			var that = this;
			var ytdTotals = RevenueCollections.totalRevenue.getYtdByProduct();
			this.$('.revenue-by-product').kendoChart({
				seriesDefaults: {
					labels: false
				},
				legend: {
					position: "bottom"
				},
				chartArea: {
					background: ""
				},
				series: [{
					type: "donut",
					data: ytdTotals,
					overlay: {gradient: 'none'},
					field: 'value'
				}],
				tooltip: {
					visible: true,
					color: '#fff',
					template: "#= category # - $#= kendo.toString(value, 'n0') #"
				}
			});
			
			/*this.$('.revenue-monthly').kendoChart({
				seriesDefaults: {
					type: 'area'
				},
				legend: {
					position: "bottom"
				},
				chartArea: {
					background: ""
				},
				series: RevenueCollections.totalRevenue.getMonthlyChartData(),
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
			});*/

			this.$('.total-ytd').text(kendo.toString(RevenueCollections.totalRevenue.getYtdTotal(), 'c0'));
			this.$('.total-ytd-sp').text(kendo.toString(ytdTotals[0].value, 'c0'));
			this.$('.total-ytd-ai').text(kendo.toString(ytdTotals[1].value, 'c0'));
			this.$('.total-ytd-cm').text(kendo.toString(ytdTotals[2].value, 'c0'));
			
			this.trigger('view:ready');

			setTimeout(function() {
				this.$('.numbers-container .number').each(function(i) {
					$(this).delay(300*i).fadeIn(600);
				});
			}, 500);
		},
		showModifyRevenue: function(e) {
			e.preventDefault();
			Vm.create(this, 'RevenueReporter', RevenueReporter);
		}
	});
	return Revenue;
});