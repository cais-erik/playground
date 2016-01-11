/**
 * shows a large spinner, with optional text
 * extends class BaseDialog 
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/assets/big_loader.html',
	'views/assets/base_dialog'
], function ($, _, Backbone, Handlebars, Template, BaseDialog) {
	var BigLoader = BaseDialog.extend({
		options: {
			message: 'Loading...'
		},
		closeLoader: function() {
			this.$el.fadeOut('fast', _.bind(this.remove, this));
		}
	});
	return BigLoader;
});