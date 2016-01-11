define([
	'underscore',
	'backbone'
], function(_, Backbone){
	/** 
     * BanksCollection
     * Collection class for a list of banks
     */
	var BanksCollection = Backbone.Collection.extend({
		url: '/api/loaddata/banks',
		initialize: function() {},
		// keep the collection sorted by the bank shortname
		comparator: 'shortName'
	});
	// this collection does not change often, so return new instance of BanksCollection class
	return new BanksCollection();
});

