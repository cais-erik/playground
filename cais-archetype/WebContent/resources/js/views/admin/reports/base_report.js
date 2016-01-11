define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars'
], function ($, _, Backbone, Vm, Events, Handlebars) {
	var BaseReport = Backbone.View.extend({
		options: {},
		title: null,
		initialize: function() {
			this.render();
		},
		render: function() {
			Events.trigger('domchange:title', this.title);
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.options));
			var that = this;
			setTimeout(function() {
				if (that.postRender) that.postRender();
			}, 2);
		},
		events: {}
	});
	return BaseReport;
});