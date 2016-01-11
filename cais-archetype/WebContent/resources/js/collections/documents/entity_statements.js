define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var EntityStatement = Backbone.Model.extend({});

	var EntityStatements = BaseCollection.extend({
		baseUrl: '/getInvestmentEntityDocs',
		model: EntityStatement,
		params: {
			year: new Date().getFullYear(),
			investmentEntityId: null
		},
		initialize: function() {},
		setActiveYear: function(year) {
			this.params.year = year;
			this.setUrl();
		},
		parse: function(resp, options) {
			if (resp.status === 'failure') {
				Alert('Could not retrieve documents.  Please make sure you have access to these documents.', 'OK');
				return;
			} 
			else { 
				var monthArr = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				$.each(resp.msg, function(i, fund) {
					$.each(fund.statements, function(x, statement) {
						statement.monthName = monthArr[statement.month - 1];
					});
				});
				return resp.msg;
			}
		}
	});
	return EntityStatements;
});