define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'collections/products/all_products',
	'models/authed_user',
	'text!templates/accounts/firm_detail/firm_product_access.html'
], function ($, _, Backbone, Vm, AllProducts, AuthedUser, Template) {
	var FirmProductAccess = Backbone.View.extend({
		options: {},
		products: AllProducts,
		permissionList: null,
		productTemplate: '{{#.}}<li class="product" id="{{productId}}">{{legalName}}{{/.}}',
		initialize: function() {
			var that = this;
			this.listenTo(this.model.selectedProducts, 'add remove reset', this.onSelectChange);
			this.listenTo(this.products, 'add remove reset', this.onProductChange);
			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue span').text('CONTINUE');
			AllProducts.fetch({
				success: function() {
					if (that.options.editing) {
						that.model.selectedProducts.fetch({
							success: function() {
								that.products.remove(that.model.selectedProducts.models);
								that.render();	
							}
						});
					}
					else {
						that.render()	
					}
				}
			});
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(Template);
			var context = {
				availableProducts: AllProducts.toJSON(),
				selectedProducts: this.model.selectedProducts.toJSON(),
				user: AuthedUser.toJSON()
			};
			this.$el.html(template(context));
			
			// if creating a new firm, populate list with default product list
			if (!this.options.editing && !this.model.selectedProducts.length) {
				var groupManagerDetails = this.model.getGroupManagerDetails();
				_.each(groupManagerDetails.get('productPermissions'), function(permission) {
					this.$('.available-products li#' + permission.productId).click();
				}, this);
			}
		},
		events: {
			'click .available-products li': 'selectProduct',
			'click .selected-products li': 'deselectProduct',
			'click .select-all': 'selectAll',
			'click .remove-all': 'deselectAll',
			'keyup .search-input': 'filterKeyupHandler' 
		},
		onSelectChange: _.debounce(function() {
			var template = Handlebars.compile(this.productTemplate);
			var that = this;
			this.$('.selected-products ul').html(template(this.model.selectedProducts.toJSON()));
			this.sortProductList();
		}, 50),
		onProductChange: _.debounce(function() {
			var template = Handlebars.compile(this.productTemplate);
			var that = this;
			this.$('.available-products ul').html(template(this.products.toJSON()));
			this.sortProductList();
		}, 50),
		filterKeyupHandler: _.debounce(function(e) {
			var list = $(e.target).next('.selection-section-list').find('ul');
			var filter = $(e.target).val();
			if (filter) {
				list.find("li:not(:Contains(" + filter + "))").hide();
				list.find("li:Contains(" + filter + ")").show();
			} else {
				list.find("li").show();
			}
		}, 200),
		deselectProduct: function(e) {
			if (!AuthedUser.get('caisemployee')) return;
			var elem = $(e.target);
			var id = parseInt(elem.attr('id'));
			var model = this.model.selectedProducts.get(id);
			this.model.selectedProducts.remove(model);
			this.products.add(model);
		},	
		selectProduct: function(e) {
			if (!AuthedUser.get('caisemployee')) return;
			var elem = $(e.target);
			var id = parseInt(elem.attr('id'));
			var model = this.products.get(id);
			this.products.remove(model);
			this.model.selectedProducts.add(model);
		},
		selectAll: function() {
			if (!AuthedUser.get('caisemployee')) return;
			this.model.selectedProducts.add(this.products.models);
			this.products.reset();
		},
		deselectAll: function() {
			if (!AuthedUser.get('caisemployee')) return;
			this.products.add(this.model.selectedProducts.models);
			this.model.selectedProducts.reset();
		},
		sortProductList: function() {
			this.$('.available-products li').tsort();
			this.$('.selected-products li').tsort();
		},
		clean: function() {
			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue span').text('SAVE & CONTINUE');
			this.stopListening();
		},
		saveModel: function() {
			var that = this;
			if (!AuthedUser.get('caisemployee')) {
				this.trigger('saveSuccess', {showUiFeedback: false});
				return;
			}
			this.model.setProducts({
				success: function() {
					that.trigger('saveSuccess');
				},
				error: function() {
				}
			});
		}
	});
	return FirmProductAccess;
});