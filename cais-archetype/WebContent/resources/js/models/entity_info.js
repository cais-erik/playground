define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model'
], function($, _, Backbone, BaseModel) {
	var entityModel = BaseModel.extend({
		baseUrl: '/getInvestmentEntityById',
		params: {
			investmentEntityId: null,
			panelId: 0
		},
		// hacky override on sync method because this model reads and updates from different URLs on server
		methodToURL: {
			'create': '/editInvestmentEntity',
			'update': '/editInvestmentEntity',
			'delete': '/editInvestmentEntity'
		},
		idAttribute: 'investmentEntityId',
		initialize: function(options) {
			this.params = $.extend(this.params, options.params);
			this.setUrl();
		},
		deleteEntity: function(onSuccess, onFail) {
			Server.deleteInvestmentEntity({id: parseInt(this.id)}, onSuccess, onFail);
		}
	});
	return entityModel;
});