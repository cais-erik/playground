/**
 * shows a confirm dialog, see options object
 * extends BaseKendoDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/assets/media_module_article.html',
	'views/assets/base_kendo_dialog'
], function ($, _, Backbone, Handlebars, Template, BaseKendoDialog) {
	var MediaModuleArticle = BaseKendoDialog.extend({
		template: Handlebars.compile(Template),
		className: 'media-module-article',
		options: {
			message: 'Confirm message...',
			confirm_text: 'Close',
			selfRender: true,
			cancelCallback: null,
			height: function() {
				return $(window).height() - 150;
			}(),
			confirmCallback: null,
			resizable: false,
			title: false
		},
		render: function() {
			var context = {
				model: this.model.toJSON(),
				options: this.options
			};
			this.$el.html(this.template(context));
		}
	});
	return MediaModuleArticle;
});