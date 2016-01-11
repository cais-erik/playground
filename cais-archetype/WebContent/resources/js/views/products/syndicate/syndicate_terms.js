define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/products/base_terms',
	'text!templates/products/syndicate/terms.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseTerms, Template) {
	var CapMarketTerms = BaseTerms.extend({
		template: Template,
		termUrl: '/api/users/terms/syndicate'
	});
	return CapMarketTerms;
});