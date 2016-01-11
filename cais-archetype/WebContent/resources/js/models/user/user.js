define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		initialize: function(options) {},
		defaults: {
			permissions: []
		},
		setFunctionPermission: function(id, status) {
			id = parseInt(id);
			var arr = this.get('permissions');
			if (status) {
				if (_.indexOf(arr, id) >= 0) return;
				arr.push(id);
			} else {
				if (_.indexOf(arr, id) >= 0) {
					arr.splice(_.indexOf(arr, id), 1);
				}
			}
			this.set('permissions', arr);
		},
		idAttribute: 'userId',
		unblockUser: function(options) {
			$.post('/api/user/blocked/' + this.id, function() {
				if (options.success) options.success();
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		toJSON: function() {
			var addressAttrs = ['country', 'street1', 'street2', 'city', 'state', 'postalCode', 'email', 'alternateEmail', 'phone', 'fax', 'addressId', 'addressTypeId'];
			var obj = _.omit(this.attributes, addressAttrs);
			obj.address = _.pick(this.attributes, addressAttrs);
			return obj;
		},
		parse: function(response) {
			var obj = $.extend(_.omit(response, ['address']), response.address);
			return obj;
		},
		validateEmail: function(model, value, options) {
			var email = this.get('email');
			var that = this;
			if (!email || options.xhr) return;
			Server.doesEmailAddressExists({emailAddress: email}, function(response) {
				if (response === 'true') {
					that.set({'email': ''});
					that.trigger('modelError', {
						field: 'email',
						msg: email + ' is already in use. Please use another email.'
					});
				}
			});
		}
	});
	return User;
});