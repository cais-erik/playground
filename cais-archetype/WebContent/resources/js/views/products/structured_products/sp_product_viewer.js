define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'text!templates/products/structured_products/sp_product_viewer.html',
	'routers/structured_products_router',
	'models/authed_user',
	'thirdparty/moment'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, Template, Router, AuthUser) {
	var SpProductViewer = BaseKendoDialog.extend({
		template: Template,
		className: 'sp-product-viewer',
		options: {
			title: false,
			resizable: false,
			selfRender: true,
			width: 425,
			height: 325
		},
		name: 'Structured Product Viewer',
		render: function() {
			var context = {
				model: this.model.toJSON(),
				user: AuthUser.toJSON(),
				editUrl: this.model.getEditUrl()
			};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			this.$('.timeago').text(moment(this.model.get('closingDate')).fromNow());
		},
		clean: function() {
			this.kendoWindow.destroy();
			this.remove();
		},
		onClose: function() {
			this.kendoWindow.destroy();
			this.remove();
			Router.appRouter.navigate('');
		}
	});
	return SpProductViewer;
});