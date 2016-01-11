/*
Extends MultiSelectorForm
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/assets/multiselector_form',
	'text!templates/products/structured_products/category-list.html',
	'text!templates/products/structured_products/category-list-item.html',
	'collections/products/structured_products'
], function ($, _, Backbone, MultiSelectorForm, Template, ListItem, StructuredProducts) {
	var CategoryEditor = MultiSelectorForm.extend({
		template: Template,
		className: 'category-editor',
		collection: StructuredProducts.categories,
		listItem: ListItem,
		events: function() { return _.extend(MultiSelectorForm.prototype.events, {
			'click .save-model': 'saveModel',
			'click .category-name': 'onHeaderClick'
		}); },
		postRender: function() {
			if (!this.collection.length) this.collection.fetch();
		},
		onHeaderClick: function(e) {
			$(e.currentTarget).parents('li').toggleClass('active');
		},
		saveModel: function(e) {
			if (!this.$('.form').data('kendoValidator').validate()) return;
			var model = this._collectionBinder.getManagerForEl($(e.currentTarget)).getModel();
			var elem = $(e.currentTarget);
			var startText = elem.text();
			elem.text('Saving...');
			model.save(null, {
				success: _.bind(function() {
					elem.text('Saved!');
					setTimeout(function() { elem.text(startText); }, 1500);
				}, this),
				error: function() {
					elem.text('ERROR');
					setTimeout(function() { elem.text(startText); }, 2000);
				}
			});
		},
		addNew: function(e) {
			MultiSelectorForm.prototype.addNew.apply(this, arguments);
			var newItem = this.$('.items li:last-child').addClass('active');
			setTimeout(function() {
				newItem.find('[name="name"]').focus();
			}, 500);
		},
		removeItem: function(e) {
			var model = this._collectionBinder.getManagerForEl($(e.currentTarget)).getModel();
			var item = $(e.currentTarget).parents('li');
			model.destroy({
				success: function() {
					item.slideUp('slow', item.remove);
				},
				error: function() {
				}
			});
		}
	});
	return CategoryEditor;
});