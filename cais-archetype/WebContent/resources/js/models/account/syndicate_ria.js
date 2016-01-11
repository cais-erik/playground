define([
	'underscore',
	'backbone',
	'models/account/base_account'
], function(_, Backbone, BaseModel){
	/** 
     * CapMarketRia class
     * Model class for a syndicate CapMarketRia offering
     * Extends BaseAccount
	 */
	var CapMarketRia = BaseModel.extend({
		defaults: {
			sellingConcession: 0
		},
		accountType: 'RIA Block',
		idAttribute: 'accountId',
		urlRoot: '/api/accounts/syndicate/ria_block',
	});
	return CapMarketRia;
});

