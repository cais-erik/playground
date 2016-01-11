define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'views/products/structured_products/category_editor'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, CategoryEditor) {
	/** 
	 * View to show CategoryEditorDialog
	 * Extends BaseKendoDialog
	 */
	var CategoryEditorDialog = BaseKendoDialog.extend({
		_modelBinder: undefined,
		attributes: {
			'class': 'category-editor-dialog',
		},
		// collection: RevenueCollections.MonthlyRevenue,
		options: {
			title: 'Edit Product Categories',
			resizable: false,
			selfRender: true,
			width: 480,
			height: 400
		},
		render: function() {
			this.editor = Vm.create(this, 'CategoryEditor', CategoryEditor);
			this.$el.html(this.editor.$el);
		},
		events: {
			'click .save-dialog': 'saveDialog'
		},
		saveDialog: function(e) {
			this.editor.collection.save();
		},
		onDialogConfirm: function(e) {
			// this.closeDialog();
		}
	});
	return CategoryEditorDialog;
});