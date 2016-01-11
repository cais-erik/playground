define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {

	var model = Backbone.Model.extend({
		idAttribute: 'investorId'
	});
	var AllInvestors = BaseCollection.extend({
		baseUrl: '/getAllInvestors',
		model: model,
		initialize: function() {
			this.setUrl();
		},
	});
	return AllInvestors;
});