/**
 * Base tabbed dialog
 * extends class ConfirmDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/assets/email_notification_dialog.html',
	'views/assets/base_kendo_dialog',
], function ($, _, Backbone, Vm, Handlebars, Template, BaseKendoDialog) {
	var EmailNotificationDialog = BaseKendoDialog.extend({
		options: {
			confirm_text: 'Ok',
			cancel_text: 'Cancel'
		},
		template: Template,
		collections: [],
		activeCollection: null,
		className: 'tabbed-dialog',
		render: function() {
			var that = this;
			this.$el.html(this.template);
			this.$('.tabs').kendoTabStrip({
				animation: false,
				activate: _.bind(that.onTabChange, that)
			});

			if (this.postRender) this.postRender();
			this.activeCollection.fetch({
				success: function() {
					that.$('.doc-loading').hide();
				}
			});
		},
		events: {},
		onTabChange: function(e) {
			var that = this;
			var index = $(e.item).index();
			this.activeCollection = this.collections[index];

			this.$('.doc-loading').show();
			this.collections[index].fetch({
				success: function() {
					that.$('.doc-loading').hide();
				},
				error: function() {
					Alert('Could not load client list.', 'OK');
					that.$('.doc-loading').hide();
				}
			});
		}
	});
	return EmailNotificationDialog;
});