define([
	'underscore',
	'backbone'
], function(_, Backbone, User){
	/** 
     * CapMarketsAccess
     * Collection class for the cap markets access list
     */
	var CapMarketsAccess = Backbone.Collection.extend({
		baseUrl: '/api/accounts/syndicate',
		setUrl: function(accountId) {
			this.url = this.baseUrl + '/' + accountId + '/users';
		},
		setAccountSave: function(id, options) {
			this.invoke('set', {'accountId': id});
			this.setUrl(id);
			$.postJSON(this.url, this.toJSON(), function() {
				if (options.success) options.success();
			}).error(function(response) {
				if (options.success) options.error(response);
			})
		}
	});
	return CapMarketsAccess;
});

