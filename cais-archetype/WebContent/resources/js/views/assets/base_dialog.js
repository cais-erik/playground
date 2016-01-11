/**
 * base fullscreen takeover dialog
 * consider wrapping jqueryui or kendo's dialog widget with this view
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/assets/big_loader.html'
], function ($, _, Backbone, Handlebars, Template) {
	var BigLoader = Backbone.View.extend({
		template: Template,
		attributes: {
			'class': 'fullscreen-dialog'
		},
		initialize: function() {
			this.render();
		},
		render: function(model) {
			var that = this;
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.options));
			this.$el.hide().appendTo('body').fadeIn('fast', function() {
				if (that.postRender) that.postRender();	
			});
		},
		closeDialog: function() {
			this.$el.fadeOut('fast', _.bind(this.remove, this));
		}
	});
	return BigLoader;
});