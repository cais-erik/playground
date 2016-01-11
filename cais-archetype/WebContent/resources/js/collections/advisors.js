define([
	'underscore',
	'backbone',
	'collections/base_tree_collection',
	'models/tree/advisor'
], function(_, Backbone, BaseCollection, AdvisorModel) {
	var advisorsCollection = BaseCollection.extend({
		defaults: {},
		baseUrl: '/getHierarchyWealthAdvisorList',
		collectionType: 'Advisors',
		model: AdvisorModel,
		params: {
			advisorTeamId: null
		},
		initialize: function() {
		}
	});
	return advisorsCollection;
});