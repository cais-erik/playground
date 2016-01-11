define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	/** 
     * ActiveClientsCollection
     * Collection class for active SF clients
     */
	var ActiveClientsCollection = Backbone.Collection.extend({
		typeMap: {
			'syndicate': 'cm',
			'structured_solutions': 'sp',
			'ai': 'ai'
		},
		initialize: function(model, options) {
			this.url = '/api/sfdata/' + this.typeMap[options.productType] + '/active_client';
		}
	});
	return ActiveClientsCollection;
});