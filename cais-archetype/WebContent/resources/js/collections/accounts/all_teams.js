define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var AllTeams = Backbone.Collection.extend({
		url: '/api/advisor_teams',
	});
	return AllTeams;
});