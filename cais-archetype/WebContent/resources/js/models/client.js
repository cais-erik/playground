define([
	'jquery',
	'underscore',
	'backbone',
	'models/base_cais_model'
], function($, _, Backbone, BaseModel) {
	var model = BaseModel.extend({
		baseUrl: '/getClientByInvestorId',
		params: {
			investorId: null
		},
		// hacky override on sync method because this model reads and updates from different URLs on server
		methodToURL: {
			'create': '/insertNewInvestor',
			'update': '/updateInvestorDetails',
			'delete': '/updateInvestorDetails'
		},
		idAttribute: 'investorId',
		initialize: function(options) {
			if (options) this.params = $.extend(this.params, options.params);
			this.setUrl();
			//this.on('change:name', this.validateName);
		},
		deleteClient: function(onSuccess, onFail) {
			var arr = [];
			arr[0] = this.id;
			Server.deleteInvestor( JSON.stringify(arr), function(response) {
				if (onSuccess) onSuccess(response);
	    	});
		},
		validateName: function(onSuccess, onFail) {
			var that = this
			var data = {
				investorName: this.get('name'),
				teamId: this.get('advisorTeamId')
			};
			Server.doesInvestorExistsForGroup(data, function(response) {
				if (response == "true") { // if investor name exists (error case)
					that.trigger('validationError', 'name', 'Investor name is already in use.');
					if (typeof onFail === 'function') onFail.call(that, that);
				} 
				else {
					if (typeof onSuccess ==='function') onSuccess.call(that, that);
				}
			});
		},
		// server side API is a little wonky about updating clients
		toJSON: function() {
			// omit uneeded client info from data before updating/creating
			var addressParams = ['country', 'street1', 'street2', 'city', 'state', 'postalCode','addressId', 'addressTypeId',
                                         'email', 'alternateEmail', 'fax', 'phone', 'deleteDate', 'deleteUser', 'updateUser', 'updateDate',
                                         'createDate', 'createUser', 'phone_mobile', 'params'];
            var data = _.pick(this.attributes, ['investorId', 'name', 'advisorTeamId', 'advisorId', 'clientId']);
            data.address = _.pick(this.attributes, addressParams);
            return data;
		}
	});
	return model;
});