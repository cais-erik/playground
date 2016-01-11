define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report_r1',
	'text!templates/admin/reports/ytd_expenses.html',
	'collections/admin/reports/revenue_collections',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config',
	'thirdparty/jquery.countdown'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, Template, RevenueCollections, Binder) {
	var YtdExpenses = BaseReport.extend({
		template: Template,
		title: 'YTD Expenses',
		className: 'ytd-expensesview',
		events: {},
		loadCount: 0,
		_modelBinder: undefined,
		initialize: function() {
			RevenueCollections.YTDExpenses.fetch({
				success: _.bind(function() {
					this.render();
				}, this)
			});

		},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(RevenueCollections.YTDExpenses, this.$el);
			this.initChart();
			this.initGrid();
			this.initCountDown();
			setTimeout(_.bind(function() {
				this.$('.numbers-container .number').each(function(i) {
					$(this).delay(300*i).fadeIn(600);
				});
				this.trigger('view:ready');
			}, this), 5);
		},
		initChart: function() {
			this.$('.utd-breakdown').kendoChart({
				seriesDefaults: {
					labels: {
						template: "#= category # - #= kendo.toString(percentage, 'p0') #",
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
					data: RevenueCollections.YTDExpenses.getBreakdown(),
					overlay: {gradient: 'none'},
					field: 'value'
				}]
			});
		},
		initGrid: function() {
			this.$(".expenses-grid").kendoGrid({
				columns: [
					{ title: " ", field: "category", attributes: {style: 'font-weight: bold'}},
					{ title: "Estimated YTD", field: 'estYtd', format: '{0:c0}' },
					{ title: "Allocation", field: 'allocation', format: '{0:p0}' }
				],
				groupable: false,
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {
					data: RevenueCollections.YTDExpenses.getGridData(),
				}
			}).data("kendoGrid");
			this.$(".burn-grid").kendoGrid({
				columns: [
					{ title: " ", field: "scenario", attributes: {style: 'font-weight: bold'}},
					{ title: "Annual Net C/F", field: 'annualNet'},
					{ title: "Monthly Burn Out Rate", field: 'monthlyBurnRate', format: '{0:c0}' },
					{ title: "Cash Zero Date Using $10MM Cash Balance", field: 'zeroDate' }
				],
				groupable: false,
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {
					data: RevenueCollections.BurnRate.toJSON()
				}
			}).data("kendoGrid");
		},
		initCountDown: function() {
			this.$('.time-to-zero').countdown({
				date: RevenueCollections.BurnRate.getTimeToZero()
			});
		}
	});
	return YtdExpenses;
});