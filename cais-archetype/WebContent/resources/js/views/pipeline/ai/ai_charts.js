	define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/pipeline/pipeline_app_model',
	'collections/pipeline/ai_pipeline_collections',
	'text!templates/pipeline/ai/charts.html'
	], function ($, _, Backbone, Vm, Events, Handlebars, PipelineAppModel, AiPipelineCollections, Template) {
	var AiCharts = Backbone.View.extend({
		options: {},
		initialize: function() {
			kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];
			this.collection = AiPipelineCollections.getActiveChartCollection();
			this.collection.fetch({
				success: _.bind(this.render, this)
			});
			this.listenTo(PipelineAppModel, 'change:filters change:transactionStatusId', this.reInit);
		},
		className: 'charts-wrapper',
		render: function() {
			this.$el.html(Template);
			this.$(".chart[data-chartType=bar]").each(_.bind(this.renderBarChart, this));
			this.$(".chart[data-chartType=pie]").each(_.bind(this.renderPieChart, this));
		},
		reInit: function() {
			var that = this;
			this.collection = AiPipelineCollections.getActiveChartCollection();
			this.collection.fetch({
				success: function(collection) {
					that.$(".chart[data-chartType=bar]").each(_.bind(that.renderBarChart, that));
					that.$(".chart[data-chartType=pie]").each(_.bind(that.renderPieChart, that));
				}
			});
		},
		events: {
			'click .expand': 'onExpandClick'
		},
		renderBarChart: function(i, chartWrapper) {
			var that =  this;
			var chartData = $(chartWrapper).attr("data-chartData");
			var chartCategory = $(chartWrapper).attr("data-chartCategory");
			$(chartWrapper).kendoChart({
				dataSource: {
					data: that.collection[chartData].toJSON()
				},
				seriesDefaults: {
					overlay: {gradient: 'none'},
					type: "bar",
					labels: {
						visible: true,
						format: "{0:C0}k"
					}
				},   
				series: [{ field: "totalValue"}],
				categoryAxis: {
					field: chartCategory
				},
				valueAxis: {
					labels: {
						format: "{0:C0}k"        		
					}
				},
				tooltip: {
					visible: true,
					format: "{0:C0}k"
				},
				chartArea: {
					margin: 20
				},
				legend: {
					visible: false
				}
			});
		},
		renderPieChart: function(i, chartWrapper) {
			var that = this;
			var chartData = $(chartWrapper).attr("data-chartData");
			var chartCategory = $(chartWrapper).attr("data-chartCategory");
			$(chartWrapper).kendoChart({
				dataSource: {
					data: that.collection[chartData].toJSON()
				},
				seriesDefaults: {
					overlay: {gradient: 'none'},
					type: "pie",
					labels: {
						visible: true
					},
					pie: {
						categoryField: chartCategory,
						labels: {
							template: "#= category #"
						}
					}
				},   
				series: [{ field: "totalValue"}],
				valueAxis: {
					labels: {
						format: "{0:C0}k"
					}
				},
				tooltip: {
					visible: true,
					format: "{0:C0}k"
				},
				chartArea: {
					margin: 20
				},
				legend: {
					visible: false
				}
			});
		},
		onExpandClick: function(e) {
			var elem = $(e.currentTarget);
			var selectedChartCategory = elem.parents(".chart-panel").find(".chart").attr("data-chartcategory");
			var selectedChartData = elem.parents(".chart-panel").find(".chart").attr("data-chartdata");
			var selectedChartType = elem.parents(".chart-panel").find(".chart").attr("data-charttype");
			
			var chartPanel = $("<div class='chart-panel full'/>");
			var chartHeader = $("<div class='header'/>");
			var chartHeaderIcon = $("<div class='shrink'/>");
			var chartWrapper = $("<div class='chart-wrapper'/>");
			var chart = $("<div class='chart'/>");

			chart.attr("data-chartcategory", selectedChartCategory);
			chart.attr("data-chartdata", selectedChartData);
			chart.attr("data-charttype", selectedChartType);
			
			chartHeader.text(elem.parents(".chart-panel").find('.header').text());
			chartHeader.append(chartHeaderIcon);
			chartHeaderIcon.click(function() {
				chartPanel.remove();
			});
			
			chartWrapper.append(chart);
		
			chartPanel.append(chartHeader);
			chartPanel.append(chartWrapper);
			
			this.$el.append(chartPanel);
			
			if(selectedChartType == "pie") {
				this.renderPieChart(0, chart);
			} else {
				this.renderBarChart(0, chart);
			}
		},
		clean: function() {
			this.stopListening();
		}
	});
	return AiCharts;
	});