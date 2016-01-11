/*
Performance view, renders performance charts
TODO: move data handling away from kendo and into collection
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/content/performance.html'
], function ($, _, Backbone, Handlebars, Template) {
	var view = Backbone.View.extend({
        attributes: {
            id: 'performanceView'
        },
		initialize: function() {
			if (!this.options.node) {
				this.remove();
				return;
			}
			this.treeNode = this.options.node;
			kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];
            $(window).resize(this.resizeHandler);
			this.render();
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			kendo.bind(this.$el, this.viewModel);
			
            // Init date pickers to rolling year by default
            this.toDate = this.$('[name=to]').kendoDatePicker({
                value: function() {
                    var d = new Date();
                    d.setMonth(d.getMonth() - 2);
                    return d;
                }(),
                parseFormats: ['yyyy-MM-ddTHH:mm:ss.fffzzz','yyyy-MM-dd']
            }).data('kendoDatePicker');
            this.fromDate = this.$('[name=from]').kendoDatePicker({
                value: function() {
                    var d = new Date();
                    d.setMonth(d.getMonth() - 14);
                    return d;
                }(),
                parseFormats: ['yyyy-MM-ddTHH:mm:ss.fffzzz','yyyy-MM-dd']
            }).data('kendoDatePicker');

            this.renderCharts();
		},
		events: {
			// 'click .expand-chart': 'expandChart',
            'click .print': 'printCharts',
            'change [name=from]': 'renderCharts',
            'change [name=to]': 'renderCharts'
		},
		viewModel: kendo.observable(),
		/*expandChart: function(e) {
			if (this.$(".chart-panel-wrapper.full").length > 0) {
                this.$(".chart-panel-wrapper.full").removeClass("full");
            } else {
                $(e.currentTarget).parents(".chart-panel-wrapper").addClass("full");
            }
            this.resizeHandler();
		},*/
        resizeHandler: _.debounce(function() {
            this.$(".chart").each(function() {
                var chart = $(this).data("kendoChart");
                if (chart) chart.refresh();
            });
        }, 300),
        onClose: function() {
            $(window).off('resize', this.resizeHandler);
        },
		renderCharts: function() {
			var that = this;
            var fromDate = this.fromDate.value().toISOString();
            var toDate = this.toDate.value().toISOString();

            if (toDate < fromDate) {
                Alert('The to date you have selected is before the from date. Please select a valid date range to continue.', 'OK');
                return;
            }
            
            var populateCharts = function(response) {
                var totalHoldings = response.totalHoldings;
                var byFundsTotal = [];

                // if there is more than 15 results, combine results with less than 2% value into other category
                if (response.byFundsTotal.length > 15) {
                    var total = 0;
                    var otherCount = 0;
                    byFundsTotal[0] = {
                        fund: 'Other',
                        fundid:  null,
                        totalValue: 0
                    };
                    for (var i in response.byFundsTotal) {
                        total = total + response.byFundsTotal[i].totalValue;
                    }
                    for (var i in response.byFundsTotal) {
                        if (response.byFundsTotal[i].totalValue / total < 0.02) {
                            otherCount++;
                            byFundsTotal[0].totalValue = byFundsTotal[0].totalValue + response.byFundsTotal[i].totalValue;
                        }
                        else {
                            byFundsTotal.push(response.byFundsTotal[i]);
                        }
                    }
                    byFundsTotal[0].fund = otherCount + ' Other Funds < 2%';
                }
                else {
                    byFundsTotal = response.byFundsTotal;
                }
                that.viewModel.set('totalHoldingsData', totalHoldings);
                that.viewModel.set('holdingsByFundData', byFundsTotal);
            };
            this.$(".chart-panel.full").remove();
            switch (this.treeNode.categoryName) {
                case "CAIS":
                    Server.getPositionChartData({from: fromDate, to: toDate}, populateCharts);
                    break;
                case "Firm":
                    Server.getPositionChartDataByClient({ id: this.treeNode.id, from: fromDate, to: toDate }, populateCharts);
                    break;
                case "Team":
                    Server.getPositionChartDataByTeam({ teamId: this.treeNode.advisorTeamId, from: fromDate, to: toDate }, populateCharts);
                    break;
                case "Advisor":
                    Server.getPositionChartDataByUser({ advisorId: this.treeNode.userId, from: fromDate, to: toDate }, populateCharts);
                    break;
                case "Client":
                    Server.positionChartDataByInvestor({ investorId: this.treeNode.investorId, from: fromDate, to: toDate }, populateCharts);
                    break;
                case "Entity":
                    Server.positionChartDataByEntity({ investmentEntityId: this.treeNode.investmentEntityId, from: fromDate, to: toDate }, populateCharts);
                    break;
            }
		},
        printCharts: function() {
            this.$(".main-column-content").printArea();
        }
	});
	return view;
});
