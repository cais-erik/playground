define([
	'underscore',
	'backbone',
	'collections/base_tree_collection',
	'models/tree/client'
], function(_, Backbone, BaseCollection, ClientModel) {
	var clientsCollection = BaseCollection.extend({
		baseUrl: '/getInvestorHierarchy',
		model: ClientModel,
		collectionType: 'Clients',
		params: {
			userId: null,
			advisorTeamId: null
		},
		initialize: function() {
		}
	});
	return clientsCollection;
});