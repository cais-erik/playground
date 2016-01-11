define([
	'underscore',
	'backbone',
	'common/jstorage'
], function(_, Backbone){
	/** 
     * CachedModel class
     * Caches a model in local storage on set, but saves to server on save
	 */
	var CachedModel = Backbone.Model.extend({
		// unique cachename used to save model instance
		cacheName: null,
		initialize: function() {
		//	this.on('change', this.updateCache);
		//	this.on('sync', this.clearCache);
		},
		updateCache: function() {
			if (this.cacheName && !this.collection) $.jStorage.set(this.cacheName, this.toJSON());
		},
		clearCache: function() {
			if (this.cacheName) $.jStorage.deleteKey(this.cacheName);	
		},
		refreshFromCache: function() {
			if ($.jStorage.get(this.cacheName)) this.set($.jStorage.get(this.cacheName));
		},
		setCacheName: function(name) {
			this.cacheName = name;
			this.refreshFromCache();
		}
	});
	return CachedModel;
});

