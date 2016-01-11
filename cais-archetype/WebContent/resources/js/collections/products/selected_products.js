define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	/** 
     * SelectedProducts
     * Collection class for selected products
     */
	var SelectedProducts = Backbone.Collection.extend({
		initialize: function() {

		}
	});
	return new SelectedProducts();
});