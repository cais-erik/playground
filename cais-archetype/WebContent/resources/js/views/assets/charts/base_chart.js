define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
], function ($, _, Backbone, Vm, Events, Handlebars) {
	var BaseCharts = Backbone.View.extend({
		className: 'chart-view',
		initialize: function() {
			this.listenTo(Events, 'rootShareholder:viewchange', this.onShViewChange);
			this.listenTo(Events, 'tabbedMultiView:tabChange', this.onShViewChange);
			this.render();
		},
		render: function() {
		},
		onShViewChange: function() {
			if (this.chart) this.chart.refresh();
		},
		clean: function(){
			this.stopListening();
		}
	});
	return BaseCharts;
});