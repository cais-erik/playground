/*
Extends MultiSelectorForm
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/assets/multiselector_form',
	'text!templates/products/structured_products/key-terms-list.html',
	'text!templates/products/structured_products/key-terms-list-item.html',
], function ($, _, Backbone, MultiSelectorForm, Template, ListItem) {
	var KeyTermsSelector = MultiSelectorForm.extend({
		template: Template,
		className: 'signatory-form',
		collection: Backbone.Collection,
		listItem: ListItem,
		postRender: function() {
			this.setupTextEditors();
			this.listenTo(this.collection, 'add', this.setupTextEditors);
		},
		setupTextEditors: function() {
			var view = this;
			kendo.init(this.$el);
			this.$('[data-role="editor"]').each(function() {
				var editor = $(this).data('kendoEditor');
				editor.bind('change', _.bind(view.onCollectionChange, view));
			});
		}
	});
	return KeyTermsSelector;
});