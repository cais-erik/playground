/*
* Router for admin reports section
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/shareholder/shareholder_app_model'
], function ($, _, Backbone, Vm, Events, ShAppModel) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'clients': 'clients',
			'firm': 'firm',
			'financials': 'financials',
			'letter': 'letter',
			'products': 'products',
			// Default - catch all
			'*actions': 'defaultAction'
		}
	});
	var router = new AppRouter();
	var initialize = function(options) {
		router.listenTo(ShAppModel, 'change', function(model) {
			router.navigate(model.getUriComponent());
		});
		router.on('route:letter', function() {
			ShAppModel.set({'showLetter': true});
		});
		router.on('route:firm', function() {
			ShAppModel.set({'section': 'firm'});
		});
		router.on('route:financials', function() {
			ShAppModel.set({'section': 'financials'});
		});
		router.on('route:clients', function() {
			ShAppModel.set({'section': 'clients'});
		});
		router.on('route:products', function() {
			ShAppModel.set({'section': 'products'});
		});
		router.on('route:defaultAction', function() {
			ShAppModel.set({'section': 'financials'});
		});
		Backbone.history.start({pushState: true, root: '/shareholder/'});
		// manage navigation links
		$(document).on('click', 'a[data-bypass]', function (e) {
			var href = $(this).attr('href');
			var protocol = this.protocol + '//';
			if (href.slice(protocol.length) !== protocol) {
				e.preventDefault();
				router.navigate(href, {trigger: true});
			}
		});
	};
	return {
		initialize: initialize,
		appRouter: router
	};
});