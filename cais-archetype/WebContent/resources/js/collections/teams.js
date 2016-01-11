define([
	'underscore',
	'backbone',
	'collections/base_tree_collection',
	'models/tree/team'
], function(_, Backbone, BaseCollection, TeamModel) {
	var teamsCollection = BaseCollection.extend({
		baseUrl: '/getHierarchyAdvisorTeams',
		params: {
			id: null,
			isCAISAccountHierarchy: true
		},
		collectionType: 'Teams',
		model: TeamModel,
		initialize: function(options) {}
	});
	return teamsCollection;
});