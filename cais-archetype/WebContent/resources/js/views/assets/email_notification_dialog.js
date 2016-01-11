/**
 * Email Notification Dialog
 * extends class ConfirmDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/assets/email_notification_dialog.html',
	'collections/setup/client_email_list',
	'views/assets/confirm_dialog',
	'models/authed_user'
], function ($, _, Backbone, Vm, Handlebars, Template, ClientEmailList, ConfDialog, AuthedUser) {
	var EmailNotificationDialog = ConfDialog.extend({
		options: {
			confirm_text: 'Send Emails',
			cancel_text: 'Cancel'
		},
		template: Template,
		collections: [],
		activeCollection: null,
		postRender: function() {
			var that = this;

			this.collections = [
				{
					collection: new ClientEmailList([], {type: 'test'}),
					elem: this.$('.email-list-test'),
					grid: null
				},
				{
					collection: new ClientEmailList([], {type: this.options.model.cacheName}),
					elem: this.$('.email-list'),
					grid: null
				}
			];
			if (AuthedUser.get('caisemployee')) {
				this.activeCollection = this.collections[0];
				this.$('.test-distro').addClass('k-state-active');
			} else {
				this.activeCollection = this.collections[1];
				this.$('.live-distro').addClass('k-state-active');
				this.$('.test-distro').hide();
			}

			this.$('.tabs').kendoTabStrip({
				animation: false,
				activate: _.bind(that.onTabChange, that)
			});

			this.activeCollection.collection.fetch({
				success: function() {
					that.$('.doc-loading').hide();
					that.renderGrids();
				},
				error: function() {
					Alert('Could not load client list.', 'OK');
					that.$('.doc-loading').hide();
					that.renderGrids();
				}
			});
		},
		events: function(){
			return _.extend({}, ConfDialog.prototype.events,{
				'change .selected-check': 'selectChangeHandler',
				'keyup [name=name-filter]': 'nameFilterChangeHandler',
				'click .all': 'selectAll',
				'click .unselect-all': 'unselectAll'
			});
		},
		onTabChange: function(e) {
			var that = this;
			var index = $(e.item).index();
			this.activeCollection = this.collections[index];
			if (!this.collections[index].collection.length) {
				this.$('.doc-loading').show();
				this.collections[index].collection.fetch({
					success: function() {
						that.$('.doc-loading').hide();
						that.refreshGrids();
					},
					error: function() {
						Alert('Could not load client list.', 'OK');
						that.$('.doc-loading').hide();
						that.refreshGrids();
					}
				});
			}
			that.refreshGrids();
		},
		renderGrids: function() {
			var that = this;
			$.each(this.collections, function(i, collection) {
				collection.grid = collection.elem.kendoGrid({
					columns: [
						{title: " ", field: "selected", width: "25px", attributes: {style:'text-align:center; padding:.4em 0;'}, template: that.renderCheckbox},
						{title: "Firm", field: "firmName"},
						{title: "Name", field: "name"},
						{title: "Email", field: "emailAddress", width: '275px', footerTemplate: "<div style='float:right'>#= kendo.toString(count, 'n0') # clients, <span class='selected-count'></span> selected</div>"}
					],
					toolbar: that.$('.filter').html(),
					dataSource: {
						data: collection.collection.toJSON(),
						aggregate: [
							{ field: "emailAddress", aggregate: "count" }
						],
					},
					groupable: true,
					dataBound: function () {
						that.$('.selected-count').text(that.activeCollection.collection.getSelected().length);
						//Get the number of Columns in the grid
						var colCount = collection.elem.find('.k-grid-header colgroup > col').length;
						//If There are no results place an indicator row
						if (this.dataSource._view.length == 0) {
							var row = $('<tr class="kendo-data-row"><td colspan="' +
									colCount +
									'" style="text-align:center; padding: 25px 0"><b>No clients found.</b></td></tr>');
							collection.elem.find('.k-grid-content tbody').append(row);
							row.hide().fadeIn('500');
						}
					}
				}).data('kendoGrid');
			});
			
		},
		refreshGrids: function() {
			$.each(this.collections, function(i, collection) {	
				collection.grid.dataSource.data(collection.collection.toJSON());				
			});
			this.$('.selected-count').text(this.activeCollection.collection.getSelected().length);
		},
		
		selectAll: function(e) {
			console.log(this.activeCollection.elem.find('.selected-check').length);
			this.activeCollection.elem.find('.selected-check').each(function() {
				if ($(this).prop('checked')) {
					return;
				}
				$(this).prop('checked', true).change();
			});
		},
		unselectAll: function(e) {
			this.activeCollection.elem.find('.selected-check').each(function() {
				if (!$(this).prop('checked')) {
					return;
				}
				$(this).prop('checked', false).change();
			});
		},
		nameFilterChangeHandler: _.debounce(function(e) {
			this.refreshGrids();
			var filter = {
				logic: 'or',
				filters: [
					{field:"name", operator:"contains", value: $(e.target).val()},
					{field:"firmName", operator:"contains", value: $(e.target).val()}
				]
			};
			this.activeCollection.grid.dataSource.filter(filter);
		}, 100),
		selectChangeHandler: function(e) {
			var id = parseInt($(e.target).attr('id'));
			this.activeCollection.collection.get(id).set('selected', $(e.target).is(':checked'));
			this.$('.selected-count').text(this.activeCollection.collection.getSelected().length);
		},
		onConfirm: function(e) {
			var selected = this.activeCollection.collection.getSelected();
			if (!selected.length) {
				Alert('No clients are selected!', 'OK');
				return;
			}
			var that = this;	
			var message = 'Are you sure you would like to email ' + selected.length + ' clients? This cannot be undone.';
			if (selected.length === 1) message = 'Are you sure you would like to email ' + selected.length + ' client? This cannot be undone.';
			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: message,
				confirmCallback: function() {
					if (that.options.confirmCallback) that.options.confirmCallback(selected);
				}
			});
			
		},
		renderCheckbox: function(data) {
			var input = $('<input class="selected-check" name="selected" type="checkbox">');
			input.attr('id', data.uuid);
			if (data.selected) input.attr('checked', 'checked');
			return input[0].outerHTML;
		}
	});
	return EmailNotificationDialog;
});