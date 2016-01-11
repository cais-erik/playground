define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model'
], function($, _, Backbone, BaseModel) {
	var advisorInfo = BaseModel.extend({
		///getAdvisorByUserId?userId=2226&advisorTeamName=Demo+Team+A&advisorTeamId=74
		baseUrl: '/getAdvisorByUserId',
		params: {
			advisorTeamName: null,
			userId: 0, // advisorid
			advisorTeamId: null
		},
		idAttribute: 'userId',
		initialize: function(options) {
			this.params = $.extend(this.params, options.params);
			this.setUrl();
		}
	});
	return advisorInfo;
});