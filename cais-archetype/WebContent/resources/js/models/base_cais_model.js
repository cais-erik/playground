/*
	Resolves some of the peculiarities with our server API, extend other models from here.
*/
define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){
	var baseModel = Backbone.Model.extend({
		// gets down to response.message object in response
		parse: function(resp, options) {
			if (resp.status === 'error') {
				// TODO: do some error handling in here
			} 
			else if (resp.msg) { 
				return resp.msg;
			}
			else {
				return resp
			}
		},
		// appends query string to URL
		setUrl: function() {
			if(!this.baseUrl) {
				throw 'Collection must have baseUrl defined';
				return;
			}
			if (this.params) {
				this.url = this.baseUrl + '?' + $.param(this.params);
			}
			else{
				this.url = this.baseUrl	
			}
			return this.url;
		},
		sync: function(method, model, options) {
			// insure that emulateHTTP is set to true, firm and team detail set it to false
			if (!Backbone.emulateHTTP) Backbone.emulateHTTP = true;
			// allow different URLs for put, post and delete
			if (method !== 'read') {
				options = options || {};
				options.url = model.methodToURL[method.toLowerCase()];
			}
			// handle the circumstance that our server returns 200 regardless of status type
			if (method === 'update') {
				var oldSuccess = options.success;
				options.success = function(response) {
					if (response.status === 'success') oldSuccess(response);
					else options.error(response);
				}
			}
			// handle the circumstance that our server returns 200 regardless of status type
			if (method === 'create') {
				var oldSuccess = options.success;
				options.success = function(response) {
					if (response.status === 'success') oldSuccess(response);
					else options.error(response);
				}
			}
			Backbone.sync(method, model, options);
		},
	});
	return baseModel;
});

