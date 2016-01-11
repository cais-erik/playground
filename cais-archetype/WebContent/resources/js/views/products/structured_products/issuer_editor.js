/*
Extends MultiSelectorForm
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/assets/multiselector_form',
	'views/products/structured_products/category_editor',
	'text!templates/products/structured_products/issuer-list.html',
	'text!templates/products/structured_products/issuer-list-item.html',
	'collections/products/structured_products'
], function ($, _, Backbone, MultiSelectorForm, CategoryEditor, Template, ListItem, StructuredProducts) {
	var IssuerEditor = CategoryEditor.extend({
		template: Template,
		collection: StructuredProducts.issuers,
		listItem: ListItem
	});
	return IssuerEditor;
});