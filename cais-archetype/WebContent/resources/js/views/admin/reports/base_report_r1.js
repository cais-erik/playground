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
		context: {
			sectionTitle: this.title
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(this.template);

			Events.trigger('domchange:title', this.title);
			this.context.sectionTitle = this.title;
			this.$el.html(template(this.context));
			setTimeout(function() {
				if (that.postRender) that.postRender();
			}, 500);
		},
		events: {}
	});
	return BaseReport;
});