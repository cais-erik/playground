define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	/** 
     * NearTermConversionClients
     * Collection class for active SF clients
     */
	var NearTermConversionClients = Backbone.Collection.extend({
		typeMap: {
			'syndicate': 'cm',
			'structured_solutions': 'sp',
			'ai': 'ai'
		},
		initialize: function(model, options) {
			this.url = '/api/sfdata/' + this.typeMap[options.productType] + '/near_term_conversion';
		},
		parse: function(response) {
			_.each(response, function(client) {
				if (client.expectedConversionDate === 'null') client.expectedConversionDate = null;
			});
			return response;
		}
	});
	return NearTermConversionClients;
});