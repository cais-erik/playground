define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'text!templates/entities/entity_selector.html',
	'collections/entities/entity_collections',
	'collections/entities/selected_entities',
	'amd/backbone/Backbone.CollectionBinder'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, Template, EntityCollections, SelectedEntites) {
	var EntitySelector = BaseKendoDialog.extend({
		template: Template,
		attributes: {
			'class': 'entity-selector-window'
		},
		collection: EntityCollections.all,
		options: {
			title: 'Select Accounts',
			resizable: false,
			selfRender: true,
			width: 425,
			productContext: 'all',
			height: function() {
				return $(window).height() - 350;
			}()
		},
		name: 'Trade Ticket',
		preInit: function() {
			if (this.options.productContext == 'capMarkets') {
				this.collection = EntityCollections.cm;
			}
			this.listenTo(this.collection, 'sync', this.refresh);
		},
		render: function() {
			var that = this;
			this.$el.html(Template);	
			this.entityGrid = this.$('.entity-grid').kendoGrid({
				columns: [
					{ title: "", template: "<input class='select-product' type='checkbox' value='${ id }'>", width: 35, sortable: false },
    				{ title: "Name", field: "name", template: "<div class='pointer client-info' data-entityId='${ id }'>${ accountName }</div>" }
    			],
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No Entities</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');

			this.collection.fetch();
		},
		refresh: function(){
			this.entityGrid.dataSource.data(this.collection.toJSON());
			SelectedEntites.each(function(entity) {
				this.$('.select-product[value=' + entity.id +']').prop('checked', true);
			}, this);
			var that = this;
			setTimeout(function() {
				that.$('.doc-loading').fadeOut('fast');	
			}, 500);
		},
		events: {
			'change .select-product': 'onProductSelect' 
		},
		onProductSelect: function(e) {
			var elem = $(e.currentTarget);
			var id = parseInt(elem.val());
			if (elem.prop('checked')) {
				SelectedEntites.add(this.collection.get(id));
			} else {
				SelectedEntites.remove(SelectedEntites.get(id));
			}
		}
	});
	return EntitySelector;
});