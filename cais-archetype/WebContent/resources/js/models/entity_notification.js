define([
	'underscore',
	'backbone',
	'models/base_cais_model'
], function(_, Backbone, BaseModel) {
	/** 
     * EntityNotification class
     * Model class for user notifications
     * @class EntityNotification
     * @constructor new EntityNotification();
     * @return EntityNotification
     */
	var EntityNotification = BaseModel.extend({
		url: '/editInvestmentEntityNotifications',
		initialize: function() {
			var model = Backbone.Model.extend();
			this.partyDetails = new model;
		},
		methodToURL: {
			'create': '/editPartyContact',
			'update': '/editPartyContact'
		//	'delete': '/removeInvestmentEntityNotification'
		},
		/** 
		 * Stores the extra party details as a model if requested
		 */
		partyDetails: null,
		/** 
		 * Overrides Backbone's method to delete the notification contact
		 * @param {object} options object containing success or error callbacks
		 */
		destroy: function(options) {
			var that = this;
			Server.removeInvestmentEntityNotification({ id: this.id }, function (response) {
				if (options.success) options.success(response);
				that.trigger('destroy', that, that.collection, {});
			});
		},
		/** 
		 * Creates or updates a new party
		 * @param {function} onSuccess function, success callback
		 * @param {function} onFaile function, error callback
		 */
		editParty: function(onSucccess, onFail) {
			Server.editPartyContact(this.partyDetails.toJSON(), function (response) {
				if (onSucccess) onSucccess(response);
			}, function(response) {
				if (onFail) onFail(response);
			});
		},
		/** 
		 * Gets the additional details for a given contact
		 * @param {object} options object containing params to pass to server
		 * @param {function} callback function on ajax complete, receives server response as first argument
		 */
		getPartyDetails: function(options, callback) {
			var that = this;
			// get the details for the selected party to populate below the table
			if (options.notificationType == "ADVISOR") {
				Server.getAdvisorByUserId({userId: options.userId, advisorTeamName: options.advisorTeamName, advisorTeamId: options.advisorTeamId }, function (response) {
					that.partyDetails.set(response);
					if (typeof callback === 'function') callback.call(that, response);
				});
			} else if (options.notificationType == "CLIENT") {
				Server.getClientByInvestorId({ investorId: options.investorId }, function (response) {
					that.partyDetails.set(response);
					if (typeof callback === 'function') callback.call(that, response);
				});
			} else {
				Server.getPartyContact({ id: this.get('thirdPartyId') }, function (response) {
					that.partyDetails.set(response);
					if (typeof callback === 'function') callback.call(that, response);
				});
			}
		}
	});
	return EntityNotification;
});