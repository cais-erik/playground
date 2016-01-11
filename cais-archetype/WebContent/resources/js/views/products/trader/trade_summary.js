define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/products/trader/trade_summary.html',
], function ($, _, Backbone, Vm, Events, Handlebars, Template) {
	var TradeSummary = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template(this.options.data));
		},
		events: {
		}
	});
	return TradeSummary;
});