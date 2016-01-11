/**
 * Email Notification Dialog
 * extends class BaseSelectableGridDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/assets/basic_email_dialog.html',
	'views/assets/base_selectable_grid_dialog',
	'views/assets/confirm_dialog',
	'views/assets/big_loader'
], function ($, _, Backbone, Vm, Handlebars, Template, BaseSelectableGridDialog, ConfDialog, BigLoader) {
	var EmailNotificationDialog = BaseSelectableGridDialog.extend({
		template: Template,
		onConfirm: function(e) {
			var selected = this.collection.where({'selected': true});
			var that = this;
			if (!selected.length) {
				Alert('No clients are selected!', 'OK');
				return;
			}
			var message = 'Are you sure you would like to email ' + selected.length + ' clients? This cannot be undone.';
			if (selected.length === 1) message = 'Are you sure you would like to email ' + selected.length + ' client? This cannot be undone.';
			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: message,
				confirmCallback: function() {
					that.loader = Vm.create(that, 'BigLoader', BigLoader, {message: 'Notifying accounts...'});
					if (that.options.onConfirm) that.options.onConfirm({
						success: _.bind(that.onSuccess, that),
						error: _.bind(that.onError, that)
					});
				}
			});
		},
		onSuccess: function(e) {
			var that = this;
			var selected = this.collection.where({'selected': true});
			
			if (this.loader) this.loader.closeLoader();
			new Alert('The selected accounts have been notified', 'OK');
			// update the models in the collection
			_.each(selected, function(model) {
				model.set('notificationDate', new Date().toJSON());
			}, this);
			// update the kendo grid datasource
			var dataSource = new kendo.data.DataSource({
				data: function() {
					if (that.collection.toView) return that.collection.toView();
					else return that.collection.toJSON();
				}(),
				aggregate: [
					{ field: "emailAddress", aggregate: "count" }
				],
				filter: that.options.filter
			});
			this.grid.setDataSource(dataSource);
		},
		onError: function(e) {
			try {
				new Alert('There was an error while notifying these accounts. Error: ' + JSON.parse(response.responseText).error, 'OK');
			} catch (error) {
				new Alert('There was a server error while notifying these accounts.', 'OK');
			}
		},
		// renders the notified grid cell
		renderNotified: function(data) {
			if (!data.notificationDate) return '-';
			else return kendo.toString(new Date(data.notificationDate), 'M/d/yyyy h:mm tt');
		},
		getGridColumns: function() {
			return [
				{title: " ", field: "selected", width: "25px", attributes: {style:'text-align:center; padding:.4em 0;'}, template: this.renderCheckbox},
				{title: "Firm", field: "firmName"},
				{title: "Name", field: "name"},
				{title: "Email", field: "emailAddress", width: '275px', footerTemplate: "<div style='float:right'>#= kendo.toString(count, 'n0') # clients, <span class='selected-count'></span> selected</div>"},
				{title: "Notified", field: "notificationDate", template: this.renderNotified, groupHeaderTemplate: function(data) {
					var str = 'Notified: ';
					if (data.value) str += kendo.toString(new Date(data.value), 'M/d/yyyy h:mm tt');
					else str = 'Not notified';
					return str += ' <a class="select-group-all" href="#"> select/deselect all</a>';
				}}
			];
		}
	});
	return EmailNotificationDialog;
});