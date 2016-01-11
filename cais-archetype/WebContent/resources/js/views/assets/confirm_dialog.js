/**
 * shows a confirm dialog, see options object
 * extends BaseDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/assets/dialog_confirm.html',
	'views/assets/base_dialog'
], function ($, _, Backbone, Handlebars, Template, BaseDialog) {
	var ConfirmDialog = BaseDialog.extend({
		template: Template,
		options: {
			message: 'Confirm message...',
			confirm_text: 'Ok',
			cancel_text: 'Cancel',
			cancelCallback: null,
			confirmCallback: null
		},
		events: {
			'click .cancel': 'onCancel',
			'click .confirm': 'onConfirm'
		},
		onCancel: function(e) {
			if (this.options.cancelCallback) this.options.cancelCallback();
			this.closeDialog();
		},
		onConfirm: function(e) {
			if (this.options.confirmCallback) this.options.confirmCallback();
			this.closeDialog();
		}
	});
	return ConfirmDialog;
});