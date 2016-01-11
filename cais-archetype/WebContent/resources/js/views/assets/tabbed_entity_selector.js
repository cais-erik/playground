define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/assets/entity_selector.html',
	'collections/entities/entity_collections',
	'collections/entities/selected_entities'
], function ($, _, Backbone, Vm, Events, Handlebars, Template, EntityCollections, SelectedEntites) {
	var EntitySelector = Backbone.View.extend({
		template: Template,
		attributes: {
			'class': 'entity-selector-window'
		},
		collections: [EntityCollections.cm,EntityCollections.sp,EntityCollections.ai],
		options: {
			productContext: 'all'
		},
		initialize: function() {
			this.activeCollection = this.collections[0];
			this.listenTo(EntityCollections.cm, 'sync', this.onCmSync);
			this.listenTo(EntityCollections.sp, 'sync', this.onSpSync);
			this.listenTo(EntityCollections.ai, 'sync', this.onAiSync);
			this.render();
		},
		render: function() {
			var that = this;
			this.$el.html(this.template);

			if (this.postRender) this.postRender();
			this.activeCollection.fetch({
				success: function() {
					that.$('.doc-loading').hide();
				}
			});
		},
		events: {
			'click .select-account': 'onProductSelect',
			'click tr': 'rowClickHandler'
		},
		postRender: function() {
			var that = this;
			this.cmGrid = this.$('.entity-grid.cm').kendoGrid({
				columns: [
					{ title: "", template: "<input class='select-account' type='checkbox' value='${ accountId }'>", width: 35, sortable: false },
					{ title: "Name", field: "name", template: "<div class='pointer client-info' data-entityId='${ accountId }'>${ accountName }</div>" }
    			],
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No Accounts</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');

			this.spGrid = this.$('.entity-grid.sp').kendoGrid({
				columns: [
					{ title: "", template: "<input class='select-account' type='checkbox' value='${ id }'>", width: 35, sortable: false },
    				{ title: "Name", field: "name", template: "<div class='pointer client-info' data-entityId='${ id }'>${ accountName }</div>" }
    			],
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No Accounts</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');

			this.aiGrid = this.$('.entity-grid.ai').kendoGrid({
				columns: [
					{ title: "", template: "<input class='select-account' type='checkbox' value='${ id }'>", width: 35, sortable: false },
    				{ title: "Name", field: "name", template: "<div class='pointer client-info' data-entityId='${ id }'>${ name }</div>" }
    			],
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No Accounts</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');
		},
		onCmSync: function(collection) {
			this.cmGrid.dataSource.data(collection.toJSON());
			if (collection.length === 1) {
				SelectedEntites.add(collection.at(0));
				this.trigger('singleSelected', collection);
			}
			this.refresh();
		},
		onSpSync: function(collection) {
			this.spGrid.dataSource.data(collection.toJSON());
			this.refresh();
		},
		onAiSync: function(collection) {
			this.aiGrid.dataSource.data(collection.toJSON());
			this.refresh();
		},
		refresh: function(){
			SelectedEntites.each(function(entity) {
				this.$('.select-account[value=' + entity.id +']').prop('checked', true);
			}, this);
		},
		rowClickHandler: function(e) {
			$(e.currentTarget).find('input[type=checkbox]').click();
		},
		onProductSelect: function(e) {
			e.stopPropagation();
			var elem = $(e.currentTarget);
			var id = elem.val();
			if (elem.prop('checked')) {
				SelectedEntites.add(this.activeCollection.get(id));
			} else {
				SelectedEntites.remove(SelectedEntites.get(id));
			}
		},
		clean: function() {
			this.stopListening();
		}
	});
	return EntitySelector;
});