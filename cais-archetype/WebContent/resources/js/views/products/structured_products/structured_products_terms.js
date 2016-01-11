define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/products/base_terms',
	'text!templates/products/structured_products/terms.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseTerms, Template) {
	var SpTerms = BaseTerms.extend({
		template: Template,
		termUrl: '/api/users/terms/structured_products'
	});
	return SpTerms;
});