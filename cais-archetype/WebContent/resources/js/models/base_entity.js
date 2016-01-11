define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {
	var model = Backbone.Model.extend({
		getAdvisors: function() {
			$.getJSON('/api/accounts/syndicate/'+ this.id + '/advisors', function() {

			});
		}
	});
	return model;
});