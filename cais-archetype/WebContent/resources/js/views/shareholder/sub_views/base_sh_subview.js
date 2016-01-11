define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
], function ($, _, Backbone, Vm, Events, Handlebars) {
	var BaseShSubView = Backbone.View.extend({
		initialize: function() { this.preRender(); },
		preRender: function() { this.render(); },
		context: {},
		render: function() {
			this.$el.html(this.template(this.context));
			if (this.postRender) setTimeout(_.bind(this.postRender, this), 1);
		}
	});
	return BaseShSubView;
});