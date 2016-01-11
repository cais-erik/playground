/*
CAIS user model
TODO: move logic from server.js into this file
*/

define([
	'underscore',
	'backbone',
	'models/base_cais_model'
], function(_, Backbone, BaseModel) {
	var model = BaseModel.extend({
		idAttribute: 'userId',
		initialize: function(options) {}
	});
	return new model();
});