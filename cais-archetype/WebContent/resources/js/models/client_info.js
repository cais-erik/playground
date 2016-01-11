define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model'
], function($, _, Backbone, BaseModel) {
	var advisorInfo = BaseModel.extend({
		baseUrl: '/getClientByInvestorId',
		params: {
			investorId: null
		},
		idAttribute: 'investorId',
		initialize: function(options) {
			this.params = $.extend(this.params, options.params);
			this.setUrl();
		}
	});
	return advisorInfo;
});