define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report',
	'views/admin/reports/lists/data_tracking_list',
	'text!templates/admin/reports/dashboard.html',
	'collections/admin/reports/data_tracking',
	'views/experimental/email_list_chart',
	'views/experimental/map',
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, DataTrackingList, Template, DataTrackingCollection, EmailListChart, HeatMap) {
	var ReportDashboard = BaseReport.extend({
		options: {},
		template: Template,
		className: 'data-tracking-view',
		title: 'Dashboard',
		events: {},
		postRender: function() {
			if (!DataTrackingCollection.length) {
				this.listenTo(DataTrackingCollection, 'sync', this.initTrackingData);
			}
			else {
				this.initTrackingData();
			}
			Vm.create(this, 'DataTrackingList', DataTrackingList, {
				el: this.$('.data-tracking')
			});
			Vm.create(this, 'ChartView', EmailListChart, {
				el: this.$('.distro-lists')
			});
			Vm.create(this, 'HeatMap', HeatMap, {
				el: this.$('.distro-heatmap')
			});
		},
		initTrackingData: function() {
			this.$('.days-to-ta').text(DataTrackingCollection.getDaysToTa());
			this.$('.converted-count').text(DataTrackingCollection.getConvertedVsUnconverted()[0].value);
			this.$('.in-progress').text(DataTrackingCollection.getConvertedVsUnconverted()[1].value);
			this.$('.conversions').kendoChart({
				seriesDefaults: {
					labels: {
						template: "#= category # - #= kendo.toString(value, 'n0') #",
						position: "outsideEnd",
						visible: true,
						background: "transparent"
					}
				},
				chartArea: {
				    background: ""
				},
				legend: {
					visible: false
				},
				series: [{
					type: "donut",
					data: DataTrackingCollection.getConvertedVsUnconverted(),
					overlay: {gradient: 'none'},
					field: 'value'
				}]
			});
			this.$('.by-status').kendoChart({
				seriesDefaults: {
					labels: {
						template: "#= category # - #= kendo.toString(value, 'n0') #",
						position: "outsideEnd",
						visible: true,
						background: "transparent"
					}
				},
				chartArea: {
				    background: ""
				},
				legend: {
					visible: false
				},
				series: [{
					type: "donut",
					data: DataTrackingCollection.getClientsByStatus(),
					overlay: {gradient: 'none'},
					field: 'value'
				}]
			});
			this.trigger('view:ready');
			setTimeout(function() {
				this.$('.numbers-container .number').each(function(i) {
					$(this).delay(300*i).fadeIn(600);
				});
			}, 500);
		}
	});
	return ReportDashboard;
});