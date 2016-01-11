define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/admin/reports/fi/fi_iws.html',
	'collections/admin/reports/fi_collections',
], function ($, _, Backbone, Vm, Events, Handlebars, Template, FiCollections) {
	var FiIws = Backbone.View.extend({
		options: {
			sectionTitle: 'Fidelity IWS Report',
		},
		template: Template,
		title: 'Fidelity IWS Report',
		className: 'fi-iws-view',
		events: {},
		loadCount: 0,
		initialize: function() {
			FiCollections.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var that = this;
			Events.trigger('domchange:title', this.title);
			var template = Handlebars.compile(this.template);
			var context = $.extend(this.options, FiCollections.getNationalTotals());
			this.$el.html(template(context));
			
			this.trigger('view:ready');
			setTimeout(_.bind(this.postRender, this), 2);
			setTimeout(function() {
				that.$('.numbers-container .number').each(function(i) {
					$(this).delay(300*i).fadeIn(600);
				});
			}, 500);
		},
		postRender: function() {
			this.initPieChart();
			this.initMap();
			this.initCoverageChart();
		},
		initMap: function() {
			var options = {
				region: 'US',
				displayMode: 'regions',
				backgroundColor: 'none',
				resolution: 'provinces',
				legend: 'none',
				colors: ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#83c1e6']
			};
			var data = google.visualization.arrayToDataTable(FiCollections.getMapData());

			var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
			chart.draw(data, options);
		},
		initPieChart: function() {
			this.$('.pie-chart').kendoChart({
				seriesDefaults: {
					labels: {
						template: "#= category # - #= kendo.toString(value, 'n0') #",
						position: "outsideEnd",
						visible: true,
						background: "transparent",
						color: '#fff'
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
					data: FiCollections.getTargetsIdentified(),
					overlay: {gradient: 'none'},
					field: 'value'
				}]
			});
		},
		initCoverageChart: function() {
			this.$(".coverage-grid").kendoGrid({
				columns: [
					{ title: " ", field: "category", attributes: {style: 'font-weight: bold'}},
					{ title: "New England", field: 'newEngland'},
					{ title: "NY-Mid Atlantic", field: 'midAtlantic' },
					{ title: "South East", field: 'southEast' },
					{ title: "South Central", field: 'southCentral'},
					{ title: "North Central", field: 'nothCentral' },
					{ title: "South West", field: 'southWest' },
					{ title: "North West", field: 'northWest' },
					{ title: "Total", field: 'total' },
					/*{ title: "Growing Adv." },
					{ title: "National Accts" },
					{ title: "Total" }*/
				],
				groupable: false,
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {
					data: FiCollections.getTableData(),
				}
			}).data("kendoGrid");
		}
	});
	return FiIws;
});