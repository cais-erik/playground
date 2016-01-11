define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model'
], function($, _, Backbone, BaseModel) {
	var model = BaseModel.extend({
		baseUrl: '/editInvestmentEntity',
		defaults: {
			panelId: 0,
			entityTypeOtherId: 0,
			entityTypeOtherText: null,
			taxExemptBasis: null,
			taxExemptOtherText: null
		},
		params: {
			investorId: null
		},
		// hacky override on sync method because this model reads and updates from different URLs on server
		methodToURL: {
			'create': '/editInvestmentEntity',
			'update': '/editInvestmentEntity',
			'delete': '/editInvestmentEntity'
		},
		idAttribute: 'investmentEntityId',
		initialize: function(options) {
			if (options) this.params = $.extend(this.params, options.params);
			this.setUrl();
		}
	});
	return model;
});