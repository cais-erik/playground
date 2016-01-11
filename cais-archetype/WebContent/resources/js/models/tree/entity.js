define([
	'underscore',
	'backbone',
	'models/tree/base_tree_model'
], function(_, Backbone, BaseModel) {
	var entityModel = BaseModel.extend({
		defaults: {
			categoryName: 'Entity'
		},
		idAttribute: 'investmentEntityId',
		initialize: function() {}
	});
	return entityModel;
});