define([
	'underscore',
	'backbone',
], function(_, Backbone) {
	/** 
     * SelectedEntities
     * Collection class for selected entites products
     */
	var SelectedEntities = Backbone.Collection.extend({
		initialize: function() {

		}
	});
	return new SelectedEntities();
});