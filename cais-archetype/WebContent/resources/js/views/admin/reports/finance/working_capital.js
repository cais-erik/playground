define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report_r1',
	'text!templates/admin/reports/working_capital.html',
	'collections/admin/reports/revenue_collections',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, Template, RevenueCollections, Binder) {
	var WorkingCapital = BaseReport.extend({
		template: Template,
		title: 'Working Capital',
		className: 'working-capital-view',
		events: {},
		loadCount: 0,
		_modelBinder: undefined,
		initialize: function() {
			RevenueCollections.WorkingCapital.fetch({
				success: _.bind(function() {
					this.render();
				}, this)
			});
			/*this.listenTo(RevenueCollections.WorkingCapitalOverTime, 'sync', this.initChart);*/

		},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(RevenueCollections.WorkingCapital, this.$el);
			this.initChart();
			setTimeout(_.bind(function() {
				this.$('.numbers-container .number').each(function(i) {
					$(this).delay(300*i).fadeIn(600);
				});
				this.trigger('view:ready');
			}, this), 5); 
			
		},
		initChart: function() {
			this.$('.capital-over-time').kendoChart({
				seriesDefaults: {
					type: 'area'
				},
				legend: {
				   position: "bottom"
				},
				chartArea: {
				    background: ""
				},
				series: [RevenueCollections.WorkingCapitalOverTime.toJSON()],
				categoryAxis: {
					categories: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
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
			});	
		}
	});
	return WorkingCapital;
});