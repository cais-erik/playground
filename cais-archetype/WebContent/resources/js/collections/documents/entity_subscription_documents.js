define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var EntityDocument = Backbone.Model.extend({});

	var EntitySubscriptionDocuments = BaseCollection.extend({
		baseUrl: '/getClientEntityDocuments',
		model: EntityDocument,
		params: {
			investorId: null,
		},
		initialize: function() {},
		parse: function(resp, options) {
			if (resp.status === 'failure') {
				Alert('Could not retrieve documents.  Please make sure you have access to these documents.', 'OK');
				return;
			} else {
				// do not show AFS or statements in this list
				return _.reject(resp.msg.documentsList, function(obj) {
					return obj.categoryName === 'Audited Financial Statements' || obj.categoryName === 'Final Monthly Statements';
				});
			}
		}
	});
	return EntitySubscriptionDocuments;
});