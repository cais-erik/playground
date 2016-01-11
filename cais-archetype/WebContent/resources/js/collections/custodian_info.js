define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var custodian = Backbone.Model.extend({
		idAttribute: 'idCustodianNames'
	});
	var collection = BaseCollection.extend({
		baseUrl: '/getCustodianInfo',
		model: custodian,
		params: {
			investmentEntityId: null
		}
	});
	return collection;
});