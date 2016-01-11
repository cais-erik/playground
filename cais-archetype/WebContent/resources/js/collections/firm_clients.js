define([
	'jquery',
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function($, _, Backbone, BaseCollection){
	var firmClientsCollection = BaseCollection.extend({
		baseUrl: 'getAllInvestorsByClient'
	});
	var teamCollection = BaseCollection.extend({
		baseUrl: 'getAllInvestorsByTeam'
	});
	var advisorTeamCollection = BaseCollection.extend({
		baseUrl: 'getAllInvestorsByUser'
	});
	return {
		firm: firmClientsCollection,
		team: teamCollection,
		advisor: advisorTeamCollection,
	};
});

