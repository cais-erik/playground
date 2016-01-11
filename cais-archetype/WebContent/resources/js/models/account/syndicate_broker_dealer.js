define([
	'underscore',
	'backbone',
	'models/account/base_account'
], function(_, Backbone, BaseModel){
	/** 
     * CapMarketBrokerDealer class
     * Model class for a syndicate CapMarketBrokerDealer offering
     * Extends BaseAccount
	 */
	var CapMarketBrokerDealer = BaseModel.extend({
		defaults: {
			sellingConcession: 0.5
		},
		accountType: 'Broker Dealer',
		idAttribute: 'accountId',
		urlRoot: '/api/accounts/syndicate/broker_dealer',
	});
	return CapMarketBrokerDealer;
});