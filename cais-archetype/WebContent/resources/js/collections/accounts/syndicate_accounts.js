define([
	'underscore',
	'backbone',
	'models/account/syndicate_broker_dealer',
	'models/account/syndicate_ria'
], function(_, Backbone, CapMarketBrokerDealer, CapMarketRia) {
	/** 
     * CapMarketsAccounts
     * Collection class for a list of firm cap markets accounts
     */
	var CapMarketsAccounts = Backbone.Collection.extend({
		url: '/api/group/firm',
		setUrl: function(firmId) {
			this.url = '/api/group/firm/' + firmId + '/accounts/syndicate'
		},
		// cast the respone to the correct model type
		model: function(attrs, options) {
			if (attrs.institutionalId) {
				return new CapMarketRia(attrs, options);
			} else {
				return new CapMarketBrokerDealer(attrs, options);
			}
		},
		// merge the two acct types into one collection
		parse: function(response) {
			var that = this;
			var arr = [];
			_.each(response.brokerDealerAccounts, function(account) {
				arr.push(account);
			});
			_.each(response.riaBlockAccounts, function(account) {
				arr.push(account);
			});
			return arr;
		},
		// serializes the collection for view display
		toView: function(options) {
			return this.map(function(model){ return model.toView(options);});
		}
	});
	return CapMarketsAccounts;
});

