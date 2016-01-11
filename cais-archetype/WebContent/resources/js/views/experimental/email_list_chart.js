define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'collections/setup/client_email_list'
], function ($, _, Backbone, Vm, EmailList) {
	var Chart = Backbone.View.extend({
		lists: ['/api/sfdata/cmDistributionList','/api/sfdata/spDistributionList'],
		initialize: function() {
			var that = this;
			this.cmList = new EmailList([], {type: 'CapitalMarkets'});
			this.spList = new EmailList([], {type: 'StructuredProduct'});
			kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];
			this.cmList.fetch({
				success: function() {
					that.spList.fetch({
						success: _.bind(that.render, that)
					})
				}
			});
			$(window).resize(_.debounce(_.bind(this.resizeHandler, this), 200));
		},
		render: function() {
			this.$el.kendoChart({
				legend: {
					position: "top"
				},
				seriesDefaults: {
					type: 'column'
				},
				chartArea: {
					background: ""
				},
				series: [
					{
						name: "Syndicate",
						data: [this.cmList.length],
						overlay: {gradient: 'none'}
					}, 
					{
						name: "Structured Solutions",
						data: [this.spList.length],
						overlay: {gradient: 'none'}
					}
				],
				tooltip: {
					visible: true,
					format: "{0}%",
					template: "#= series.name #: #= value #"
				}
			});
		},
		resizeHandler: function() {
			var chart = this.$el.data("kendoChart");
			if (chart) {
				chart.refresh();
			}
		},
		events: {}
	});
	return Chart;
});