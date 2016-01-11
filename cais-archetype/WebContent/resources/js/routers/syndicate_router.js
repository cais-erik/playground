/*
* Router for syndicate product page
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
			'edit/:type': 'editOffering',
			'edit/:type/:id': 'editOffering',
			'select-entities': 'selectEntities',
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
		});
		router.on('route:editOffering', function(type, id) {
			var view = null;
			if (type === 'equity') view = 'views/products/syndicate/syndicate_equity_form';
			if (type === 'preferred') view = 'views/products/syndicate/syndicate_preferred_form';
			if (type === 'bond') view = 'views/products/syndicate/syndicate_bond_form';
			if (view) {
				require([view], function(formView) {
					appView.showView(formView, {editId: id});
				});
			}
		});
		router.on('route:selectEntities', function() {
			require(['views/products/syndicate/select_entities'], function(SelectEntities) {
				appView.showView(SelectEntities);
			});
		});
		router.on('route:defaultAction', function() {
			appView.showFirst();
		});

		// Application level event routing
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

		Backbone.history.start({pushState: true, root: '/products/syndicate/'});
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