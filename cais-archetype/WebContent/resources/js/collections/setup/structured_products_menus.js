define([
	'underscore',
	'backbone'
], function(_, Backbone){
	/** 
     * StructuredProductsMenus Class
     * Extends Backbone model
     */
	var StructuredProductsMenus = Backbone.Model.extend({
		url: '/api/dropdown_list/structured_products',
		initialize: function() {},
		getMenus: function(callback) {
			if (_.isEmpty(this.attributes)) {
				this.fetch({
					success: callback
				});
			}
			else {
				callback(this);
			}
		}
	});
	// this collection does not change often, so return new instance of StructuredProductsMenus class
	return new StructuredProductsMenus();
});

