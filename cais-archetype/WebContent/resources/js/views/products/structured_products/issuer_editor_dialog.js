define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/products/structured_products/category_editor_dialog',
	'views/products/structured_products/issuer_editor'
], function ($, _, Backbone, Vm, Events, Handlebars, CategoryEditorDialog, IssuerEditor) {
	/** 
	 * View to show IssuerEditorDialog
	 * Extends CategoryEditorDialog
	 */
	var IssuerEditorDialog = CategoryEditorDialog.extend({
		options: {
			title: 'Edit Issuers',
			resizable: false,
			selfRender: true,
			width: 480,
			height: 400
		},
		render: function() {
			this.editor = Vm.create(this, 'IssuerEditor', IssuerEditor);
			this.$el.html(this.editor.$el);
		}
	});
	return IssuerEditorDialog;
});