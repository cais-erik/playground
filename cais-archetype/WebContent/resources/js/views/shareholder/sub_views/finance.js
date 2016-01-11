define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/admin/reports/revenue_collections',
	'views/shareholder/sub_views/base_sh_subview',
	'views/assets/tabbed_multi_view',
	'views/assets/charts/revenue_by_product',
	'views/assets/charts/monthly_revenue_by_product',
	'views/assets/charts/expenses_pie',
	'views/assets/charts/working_capital_pie',
	'text!templates/shareholder/finance.html',
	'amd/handlebars/handlebars.helpers'
	// 'collections/shareholders/shareholder_letters',
	// 'amd/backbone/Backbone.CollectionBinder',
	// 'amd/backbone/Backbone.ModelBinder',
	// 'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, RevenueCollections, BaseShSubview, TabbedMultiView, RevenueByProduct, MonthlyRevenueByProduct, ExpensesPie, WorkingCapitalPie, Template) {
	var Financials = BaseShSubview.extend({
		template: Handlebars.compile(Template),
		className: 'finance subview',
		title: 'Financials',
		revenueChartViews: [
			{
				name: '2014 Actual',
				view: RevenueByProduct
			}/*,
			{
				name: '2013 YTD Revenue by Product',
				view: RevenueByProduct,
				options: {
					year: 2013
				}
			}*/
			
			/*{
				name: 'Monthly Growth',
				view: MonthlyRevenueByProduct
			}*/
		],
		expensesChartViews: [

			{
				name: '2014 Actual',
				view: ExpensesPie
			}
		],
		workingCapitalChartViews: [
			{
				name: '2014 Actual',
				view: WorkingCapitalPie
			}
		],
		preRender: function(callback) {
			var thisYear = new Date().getFullYear();

			RevenueCollections.totalRevenue.fetch({
				success: _.bind(function() {
					this.context = {
						thisYear: thisYear,
						lastYear: thisYear - 1,
						ytdRevenue: RevenueCollections.totalRevenue.getYtdByProduct(),
						lastYearRevenue: RevenueCollections.totalRevenue.getYtdByProduct(thisYear - 1),

						// ytdTotal: RevenueCollections.totalRevenue.getYtdTotal(),
						// itdTotal: RevenueCollections.totalRevenue.getItdTotal(),
						lastYearTotal: RevenueCollections.totalRevenue.getYtdTotal(thisYear - 1),
						thisYearTotal: RevenueCollections.totalRevenue.getYtdTotal(),
						ytdCmTotals: RevenueCollections.totalRevenue.getCmTotals(),
						lastYearCmTotals: RevenueCollections.totalRevenue.getCmTotals(thisYear - 1),

						expenses: RevenueCollections.YTDExpenses.getBreakdown(),
						totalExpenses: RevenueCollections.YTDExpenses.getTotal(),
						workingCapitalBreakdown: RevenueCollections.WorkingCapital.getBreakdown(),
						workingCapital: RevenueCollections.WorkingCapital.toJSON()
					};
					this.render();
				}, this),
				error: function() {
					Alert('There was an error while fetching the revenue data.', 'OK');
				}
			});
		},
		postRender: function() {
			var revenueCharts = Vm.create(this, 'RevenueTabbedMultiView', TabbedMultiView, {
				subViews: this.revenueChartViews
			});
			var expensesCharts = Vm.create(this, 'ExpenseTabbedMultiView', TabbedMultiView, {
				subViews: this.expensesChartViews
			});
			var workingCapitalCharts = Vm.create(this, 'WorkingCapitalTabbedMultiView', TabbedMultiView, {
				subViews: this.workingCapitalChartViews
			});
			this.$('.charts').html(revenueCharts.$el);
			this.$('.expenses-charts').html(expensesCharts.$el);
			this.$('.capital-charts').html(workingCapitalCharts.$el);
		},
		events: {}
	});
	return Financials;
});