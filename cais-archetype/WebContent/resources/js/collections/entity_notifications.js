define([
	'underscore',
	'backbone',
	'collections/base_cais_collection',
	'models/entity_notification'
], function(_, Backbone, BaseCollection, Notification) {
	var EntityNotificationCollection = BaseCollection.extend({
		baseUrl: '/getInvestmentEntityNotifications',
		model: Notification,
		params: {
			investmentEntityId: null
		},
		initialize: function() {},
		/** 
		 * sync the notifications with the server
		 * @param {object} options object containing success or failure responses
		 */
		updateNotifications: function(options) {
			var data = this.toJSON();
			Server.editInvestmentEntityNotifications(data, function (response) {
				if (response) {
					if (options.success) options.success(response);
				}
				else{
					if (options.error) options.error(response);
				}
			});
		}
	});
	return EntityNotificationCollection;
});