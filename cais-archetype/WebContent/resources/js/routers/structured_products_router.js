/*
* Router for structured products page
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events'
], function ($, _, Backbone, Vm, Events) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'offerings/:id': 'offerings',
			'edit': 'editOffering',
			'edit/:id': 'editOffering',
			// Default - catch all
			'*actions': 'defaultAction'
		}
	});
	var router = new AppRouter();
	// history of previous URL fragments, currently only saving last 4 in this array. 
	//router._prevFragments = [];
	var initialize = function(options) {
		var appView = options.appView;

		router.on('route:offerings', function(id) {
			appView.refresh(id);
            Server.getStructuredProductAccessHistory({id:id}, function(response) {},function(response) {});
		});
		router.on('route:editOffering', function(id) {
			var view = null;
			require(['views/products/structured_products/structured_product_form'], function(formView) {
				appView.showView(formView, {editId: id});
			});
		});
		router.on('route:defaultAction', function() {
			appView.refresh(null);
		});
		Events.on('offering:create', function(model) {
			router.navigate('offerings/' + model.id, {trigger: true});
		});
		/*
		Events.on('offering:edit', function(id) {
			router.navigate('edit-offering/' + id, {trigger: true});
		});
		*/
		Events.on('offering:view', function(id, options) {
			var config = options || {
				trigger: false,
				replace:  false
			};

			router.navigate('offerings/' + id, config);

		});

		Backbone.history.start({pushState: true, root: '/products/structured-solutions/'});
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