define([
	'underscore',
	'backbone',
], function(_, Backbone){
	/** 
     * BaseAccounts class
     * Model class for an Accounts
     * Extends Backbone Model
	 */
	var BaseAccounts = Backbone.Model.extend({
		defaults: {},
		urlRoot: '/api/accounts',		
		parse: function(resp) {
			resp.accountType = this.accountType;
			return resp;
		},
		toJSON: function() {
			var obj = _.clone(this.attributes);
			delete obj.accountType
			return obj;
		},
		toView: function() {
			var obj = _.clone(this.attributes);
			obj.id = obj.accountId;
			return obj;
		}
	});
	return BaseAccounts;
});