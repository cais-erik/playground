/**
 * BaseSelectableGridDialog
 * extends class BaseKendoDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'views/assets/base_kendo_dialog'
], function ($, _, Backbone, Vm, Handlebars, BaseKendoDialog) {
	var BaseSelectableGridDialog = BaseKendoDialog.extend({
		options: {
			title: '',
			resizable: false,
			selfRender: true,
			width: 640,
			productContext: 'all',
			height: 444,
			filter: false
		},
		preInit: function() {
			this.options = _.extend({}, BaseSelectableGridDialog.prototype.options, this.options);
		},
		render: function() {
			this.$el.html(this.template);
			if (this.postRender) this.postRender();
			this.renderGrid();
		},
		events: function() {
			return _.extend({}, BaseKendoDialog.prototype.events, {
				'change .selected-check': 'selectChangeHandler',
				'keyup [name=name-filter]': 'nameFilterChangeHandler',
				'click .all': 'selectAll',
				'click .confirm-dialog': 'onConfirm',
				'click .unselect-all': 'unselectAll',
				'click .select-group-all': 'selectGroupAll'
			});
		}(),
		renderGrid: function() {
			var that = this;
			var columns = this.getGridColumns();
			this.grid = this.$('.email-list').kendoGrid({
				columns: columns,
				toolbar: this.$('.filter').html(),
				dataSource: {
					data: function() {
						if (that.collection.toView) return that.collection.toView();
						else return that.collection.toJSON();
					}(),
					aggregate: [
						{ field: "emailAddress", aggregate: "count" }
					],
					filter: this.options.filter
				},
				groupable: true,
				dataBound: function () {
					that.$('.selected-count').text(that.collection.where({'selected': true}).length);
					//Get the number of Columns in the grid
					var colCount = that.$('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length === 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No accounts found.</b></td></tr>');
						that.$('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');
		},
		selectGroupAll: function(e) {
			var elem = $(e.currentTarget);
			var rows = elem.parents('tr').nextAll('tr');
			elem.toggleClass('selected');

			$(rows).each(function() {
				if ($(this).hasClass('k-grouping-row')) return false;
				if (elem.hasClass('selected')) {
					$(this).find('[type="checkbox"]').prop('checked', true).change();
				} else {
					$(this).find('[type="checkbox"]').prop('checked', false).change();
				}
			});
		},
		selectAll: function(e) {
			this.$('.selected-check').each(function() {
				if ($(this).prop('checked')) {
					return;
				}
				$(this).prop('checked', true).change();
			});
		},
		unselectAll: function(e) {
			this.$('.selected-check').each(function() {
				if (!$(this).prop('checked')) {
					return;
				}
				$(this).prop('checked', false).change();
			});
		},
		nameFilterChangeHandler: _.debounce(function(e) {
			var activeColummns = this.getGridColumns();
			var value = $(e.target).val();
			var filters = [];
			_.each(activeColummns, function(column) {
				if (column.field !== 'selected' && !column.format) {
					filters.push({field: column.field, operator:"contains", value: value});
				}
			});
			var filter = {
				logic: 'or',
				filters: filters
			};
			this.grid.dataSource.filter(filter);
		}, 100),
		selectChangeHandler: function(e) {
			var id = $(e.target).attr('id');
			this.collection.get(id).set('selected', $(e.target).is(':checked'));
			this.$('.selected-count').text(this.collection.where({'selected': true}).length);
		},
		renderCheckbox: function(data) {
			var input = $('<input class="selected-check" name="selected" type="checkbox">');
			input.attr('id', data.id);
			if (data.selected) input.attr('checked', 'checked');
			return input[0].outerHTML;
		}
	});
	return BaseSelectableGridDialog;
});