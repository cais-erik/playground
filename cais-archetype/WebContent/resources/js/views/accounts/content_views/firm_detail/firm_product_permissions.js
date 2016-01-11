define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/firm_detail/firm_product_permissions.html',
	'collections/products/all_products',
	'models/authed_user'
], function ($, _, Backbone, Vm, Template, AllProducts, AuthedUser) {
	var FirmProductPermissions = Backbone.View.extend({
		options: {},
		permissionList: null,
		className: 'firm-product-permissions',
		userPermissionTemplate: '{{#.}}<label><input name="permissionId" value="{{permissionId}}" type="checkbox">{{permission}}</label><br/>{{/.}}',
		initialize: function() {
			var that = this;
			var init = function() {
				if (that.options.editing && !that.model.selectedProducts.length) {
					that.model.selectedProducts.fetch({
						success: function() {
							that.render();
						}
					});
				}
				else {
					that.render();
				}
			};
			if (!AllProducts.length) {
				AllProducts.fetch({
					success: function() {
						init();
					}
				});
			}
			else {
				init();
			}
			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue span').text('CONTINUE');
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.permissionList = this.$('.grid-wrapper').kendoGrid({
                dataSource: {
                	autosync: true,
                	data: this.model.selectedProducts.toJSON(),
	                schema: {
	                    model: {
	                        id: "productId",
	                        fields: {
	                            legalName: { editable: false },
	                            overview: { editable: true, type: "boolean" },
	                            performances: { editable: true, type: "boolean" },
	                            mercer: { editable: true, type: "boolean" },
	                            document: { editable: true, type: "boolean" }
	                        }
	                    }
	                },
	                change: _.bind(this.onDataChange, this)
                },
                width: 500,
                columns: [
                    { field: "legalName", title: "Product Name" },
                    { field: "overview", title: "Overview", width: 80 },
                    { field: "performances", title: "Performances", width: 100 },
                    { field: "mercer", title: "Mercer", width: 80 },
                    { field: "document", title: "Document", width: 80 }
                ],
                dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No products.</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				},
                editable: function() {
                	if (!AuthedUser.get('caisemployee')) return false;
                	return true
                }()
            }).data('kendoGrid');
		},
		events: {},
		saveModel: function() {
			if (!AuthedUser.get('caisemployee')) {
				this.trigger('saveSuccess', {showUiFeedback: false});
				return;
			}
			var that = this;
			this.model.setProducts({
				success: function() {
					that.trigger('saveSuccess');
				},
				error: function() {
				}
			});
		},
		onDataChange: function(e) {
			if (e.items.length !== 1) return;
			var dataItem = e.items[0];
			var products = this.model.selectedProducts;

			products.get(dataItem.id).set({
				'mercer': dataItem.mercer,
				'overview': dataItem.overview,
				'performances': dataItem.performances,
				'document': dataItem.document
			});
		},
		initUserPermissions: function() {
			var that = this;
			this.model.getUserPermissions(function(response) {
				var template = Handlebars.compile(that.userPermissionTemplate);
				that.$('.permList').html(template(response));
			});
		},
		clean: function() {
			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue span').text('SAVE & CONTINUE');
		}
	});
	return FirmProductPermissions;
});