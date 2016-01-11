define([
	'underscore',
	'backbone',
	'collections/admin/reports/test_finance'
], function(_, Backbone, TestFinanceData) {

	/** 
     * TotalRevenue
     * Model class for Total Revenue
     * Extends backbone model
     */
	var TotalRevenue = Backbone.Model.extend({
		url: '/api/revenue/all/total_revenue',
		_currentDate: new Date(),
		typeMap: {
			'CM': 'Syndicate',
			'SP': 'Structured Solutions',
			'AI': 'Alternative Investments',
			'PM': 'Precious Metals'
		},
		getYtdByProduct: function(year) {
			year = year || this._currentDate.getFullYear();
			var sp = {
				category: 'Structured Solutions',
				value: this.getYtd('SP', year),
				itd: this.getItd('SP')
			};
			var ai = {
				category: 'Alternative Investments',
				value: this.getYtd('AI', year),
				itd: this.getItd('AI'),
			};
			var cm = {
				category: 'Syndicate',
				value: this.getYtd('CM', year),
				itd: this.getItd('CM')
			};
			var pm = {
				category: 'Precious Metals',
				value: this.getYtd('PM', year),
				itd: this.getItd('PM')
			};
			return [ai,cm,sp,pm];
		},
		// returns the total revenue YTD
		getYtdTotal: function(year) {
			year = year || this._currentDate.getFullYear();
			var arr = this.getYtdByProduct(year);
			var total = 0;
			for (i = 0; i < arr.length; i++) total = total + arr[i].value;
			return total;
		},
		// returns the sum of syndicate and structured solutions itd and ytd,
		getCmTotals: function(year) {
			year = year || this._currentDate.getFullYear();
			return {
				itd: this.getItd('CM') + this.getItd('SP') + this.getItd('PM'),
				ytd: this.getYtd('CM', year) + this.getYtd('SP', year) + this.getYtd('PM', year)
			};
		},
		// returns the total revenue ITD
		getItdTotal: function() {
			var arr = this.getYtdByProduct();
			var total = 0;
			for (i = 0; i < arr.length; i++) total = total + arr[i].itd;
			return total;
		},
		getMonthlyChartData: function() {
			var seriesArr = [];
			seriesArr[0] = {
				name: 'Alternative Investments',
				data: _.values(_.omit(this.get('AI'), 'date'))
			};
			seriesArr[1] = {
				name: 'Syndicate',
				data: _.values(_.omit(this.get('CM'), 'date'))
			};
			seriesArr[2] = {
				name: 'Structured Solutions',
				data: _.values(_.omit(this.get('SP'), 'date'))
			};
			seriesArr[3] = {
				name: 'Precious Metals',
				data: _.values(_.omit(this.get('PM'), 'date'))
			};
			return seriesArr;
		},
		getMonthlyAxis: function() {
			var monthArr = [];
			var dates = _.keys(_.omit(this.get('SP'), '2013'));
			_.each(dates, function(date) {
				// set to GMT - 4
				monthArr.push(kendo.toString(new Date(date + 'T00:00:00-04:00'), 'MMM'));
			});
			return monthArr;
		},
		// returns a category total for a given year
		getYtd: function(category, year) {
			var total = 0;
			_.each(this.get(category), function(value) {
				if (new Date(value.date).getFullYear() === year) {
					total = total + value.revenue;
				}
			});
			return total;
		},
		// returns the total ITD for a given category
		getItd: function(category) {
			var total = 0;
			_.each(this.get(category), function(value) {
				total = total + value.revenue;
			});
			return total;
		}
	});
	var WorkingCapital = Backbone.Model.extend({
		initialize: function() {
			this.set(TestFinanceData.workingCapital);
		},
		fetch: function(options) {
			if (options.success) options.success(this);
		},
		getBreakdown: function() {
			var arr = [
				{
					category: 'Cash Balance',
					value: this.get('cashToDate')
				},
				{
					category: 'AI Funds Pending Receivable',
					value: this.get('pendingReceivable')
				},
				{
					category: 'AI Feeder Funds Loan Receivable*',
					value: this.get('platformLoan')
				}
			];
			return arr;
		},
	});
	var WorkingCapitalOverTime = Backbone.Model.extend({
		initialize: function() {
			this.set(TestFinanceData.workingCapitalOverTime);
		}
	});
	var YTDExpenses = Backbone.Model.extend({
		initialize: function() {
			this.set(TestFinanceData.ytdExpenses);
		},
		fetch: function(options) {
			if (options.success) options.success(this);
		},
		getTotal: function() {
			// return this.get('oneTime') + this.get('variableTotal') + this.get('fixedTotal');
			return this.get('variableTotal') + this.get('fixedTotal');
		},
		getBreakdown: function() {
			var arr = [
				{
					category: 'Fixed',
					value: this.get('fixedTotal')
				},
				{
					category: 'Variable',
					value: this.get('variableTotal')
				}
			];
			return arr;
		},
		getGridData: function() {
			return [
				{
					category: 'Personnel',
					estYtd: this.get('fixedPersonnel'),
					allocation: this.get('fixedPersonnelAllocation')
				},
				{
					category: 'Non Personnel',
					estYtd: this.get('fixedNonPersonnel'),
					allocation: this.get('fixedNonPersonnelAllocation')
				},
				{
					category: 'Variable Expenses',
					estYtd: this.get('variableTotal'),
					allocation: this.get('variableAllocation')
				},
				{
					category: 'One Time Expenses',
					estYtd: this.get('oneTime'),
					allocation: this.get('oneTimeAllocation')
				},
				{
					category: 'Est. Monthly Corporate Burn',
					estYtd: this.get('estMonthlyBurn'),
					allocation: null
				}
			];
		}
	});
	var BurnRate = Backbone.Collection.extend({
		initialize: function() {},
		fetch: function(options) {
			if (options.success) options.success(this);
		},
		getTimeToZero: function() {
			return new Date('2016-03-26T05:00:00.000Z');
		}
	});

	var RevenueMonth = Backbone.Model.extend({});
	var MonthlyRevenue = Backbone.Collection.extend({
		url: '/api/revenue/ai/monthly',
		model: RevenueMonth,
		initialize: function() {}
	});


	return {
		totalRevenue: new TotalRevenue(),
		WorkingCapital: new WorkingCapital(),
		WorkingCapitalOverTime: new WorkingCapitalOverTime(),
		YTDExpenses: new YTDExpenses(),
		BurnRate: new BurnRate(TestFinanceData.burnRate),
		MonthlyRevenue: new MonthlyRevenue()
	};
});