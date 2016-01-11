define([
	'underscore',
	'backbone',
	'collections/base_tree_collection',
	'models/tree/entity'
], function(_, Backbone, BaseCollection, EntityModel) {
	var entitiesCollection = BaseCollection.extend({
		baseUrl: '/getInvestmentEntitiesHierarchy',
		model: EntityModel,
		collectionType: 'Entities',
		params: {
			investorId: null
		},
		initialize: function() {
		}
	});
	return entitiesCollection;
});