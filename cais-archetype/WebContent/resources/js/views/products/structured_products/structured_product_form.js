define([
	'jquery',
	'underscore',
	'backbone',
	'amd/backbone/Backbone.ModelBinder',
	'Vm',
	'events',
	'handlebars',
	'views/products/base_offering_form',
	'views/products/structured_products/key_terms_selector',
	'collections/setup/structured_products_menus',
	'collections/products/structured_products',
	'models/product/structured_product',
	'views/products/structured_products/category_editor_dialog',
	'views/products/structured_products/issuer_editor_dialog',
	'text!templates/products/structured_products/structured_products_form.html'
], function ($, _, Backbone, Binder, Vm, Events, Handlebars, BaseOfferingForm, KeyTermsSelector, StructuredProductsMenus, StructuredProducts, StructuredProduct, CategoryEditorDialog, IssuerEditorDialog, Template) {
	var StructuredProductForm = BaseOfferingForm.extend({
		model: StructuredProduct,
		template: Template,
		collection: StructuredProducts,
		className: 'sp-offering-form',
		title: 'Structured Solution',
		initialize: function() {
			// Renders a list of US state options, accepts a default selection as option
			Handlebars.registerHelper('parseDate', function(isoDate, format) {
				return kendo.toString(new Date(isoDate), format);
			});
			// boostrap the setup data
			this.events = $.extend({}, BaseOfferingForm.prototype.events, this.events);
			this.setupData = StructuredProductsMenus;
			StructuredProductsMenus.getMenus(_.bind(this.postBootstrap, this));
		},
		postRender: function() {
			var that = this;
			setTimeout(function() {
				this.$('[name=issuerId]').trigger('change');
			}, 20);
			this.keyTermsSelector = Vm.create(this, 'KeyTermsSelector', KeyTermsSelector, {
				el: '.key-terms-selector',
				models: this.model.get('spKeyTerms')
			});
			this.listenTo(this.keyTermsSelector, 'collectionChange', this.onKeyTermsChange);
			this.listenTo(StructuredProducts.categories, 'sync', this.onCategoryChange);
			this.listenTo(StructuredProducts.issuers, 'sync', this.onIssuerCollectionChange);
		},
		events: {
			'change [name=issuerId]': 'onIssuerChange',
			'click .edit-categories': 'editCategories',
			'click .edit-issuers': 'editIssuers'
		},
		editCategories: function(e) {
			e.preventDefault();
			Vm.create(this, 'CategoryEditorDialog', CategoryEditorDialog);
		},
		editIssuers: function(e) {
			e.preventDefault();
			Vm.create(this, 'IssuerEditorDialog', IssuerEditorDialog);
		},
		onIssuerCollectionChange: function() {
			var datasource = new kendo.data.DataSource({
				data: StructuredProducts.issuers.toJSON()
			});
			this.$('[name="issuerId"]').kendoDropDownList({
				dataSource: datasource,
				dataTextField: 'issuerName',
				dataValueField: 'issuerId',
				value: this.model.get('issuerId')
			});
		},
		// updates the category widget when the categories change
		onCategoryChange: function() {
			var datasource = new kendo.data.DataSource({
				data: StructuredProducts.categories.toJSON()
			});
			this.$('[name="spCategoryId"]').kendoDropDownList({
				dataSource: datasource,
				dataTextField: 'name',
				dataValueField: 'id',
				value: this.model.get('spCategoryId')
			});
		},
		onKeyTermsChange: function(keyTerms) {
			// kendo editors don't really trigger a proper change event, so serialize these manually
			// angular kendo does a much better job binding the editor to views
			var models = [];
			var id = this.model.id;
			this.$('.key-terms > li').each(function() {
				var obj = {};
				$(this).find('textarea').each(function() {
					obj[$(this).attr('name')] = $(this).data('kendoEditor').value();
				});
				obj.spId = id;
				models.push(obj);
			});
			this.model.set('spKeyTerms', models);
		},
		onIssuerChange: function(e) {
			var id = parseInt($(e.target).val());
			var issuer = _.findWhere(this.setupData.get('spissuer'), {issuerId: id});
			if (issuer) {
				this.model.set('creditRating', issuer.creditRating);
			} else {
				this.model.set('creditRating', '');
			}
		}
	});
	return StructuredProductForm;
});