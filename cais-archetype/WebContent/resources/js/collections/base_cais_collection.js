/*
	Resolves some of the peculiarities with our server API, extend other collections from here.
*/
define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){
	var baseCollection = Backbone.Collection.extend({
		parse: function(resp, options) {
			if (resp.status === 'error') {
				// TODO: do some error handling in here
			} 
			else { 
				return resp.msg;
			}
		},
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
		}
	});
	return baseCollection;
});

