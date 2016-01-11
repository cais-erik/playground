/*
* Router for trade ticket
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/pipeline/pipeline_app_model',
	'models/authed_user'
], function ($, _, Backbone, Vm, Events, PipelineAppModel, AuthedUser) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			
			'trade/:id/events': 'events',
			'trade/:id/subscription': 'subscription',
			'trade/:id/checklist': 'checklist',
			'trade/:id/checklist/:position': 'checklist',
			':type/:lens/:transactionStatus': 'loadStatus',
			// Default - catch all
			'*actions': 'defaultAction'
		}
	});
	var router = new AppRouter();
	var initialize = function(options) {
		var appView = options.appView;
		// listen to the pipeline app model to reverse update the URL
		var onAppModelChange = function(model) {
			router.navigate(model.getUriComponent());
		};
		router.listenTo(PipelineAppModel, 'change', onAppModelChange);

		router.on('route:loadStatus', function(type, lens, transactionStatus) {
			// prevent CM access
			if (type === 'cm' && !AuthedUser.get('hasAcceptedCMTerms')) type = 'ai';
			PipelineAppModel.set({
				type: type,
				lens: lens,
				transactionStatusId: parseInt(transactionStatus)
			});	
		});

		router.on('route:subscription', function(id) {
			router.slug = router.route +'trade/' + id;
			PipelineAppModel.set({
				trade: {
					transactionId: parseInt(id),
					section: 'subscription',
					view: 'views/trade_ticket/checklist_views/root_subscription'
				}
			});
		});
		router.on('route:events', function(id) {
			router.slug = router.route +'trade/' + id;
			PipelineAppModel.set({
				trade: {
					transactionId: parseInt(id),
					section: 'events',
					view: 'views/trade_ticket/checklist_views/root_events'
				}
			});
		});
		router.on('route:checklist', function(id, position) {
			router.slug = router.route +'trade/' + id;
			PipelineAppModel.set({
				trade: {
					transactionId: parseInt(id),
					section: 'checklist',
					subViewName: position,
					view: 'views/trade_ticket/checklist_views/root_checklist'
				}
			});
		});

		router.on('route:defaultAction', function() {
			router.navigate('/ai/grid/0', {trigger: true, replace: true});
		});

		//Event routing
		Events.on('docs:regenerated', function() {
			router.navigate(router.slug.replace(router.route, '') + '/checklist/review', {trigger: true});
		});
		Events.on('task:rejected1', function() {
			router.navigate(router.slug.replace(router.route, '') + '/subscription', {trigger: true});
		});
		Events.on('tradeticket:close', function() {
			PipelineAppModel.set('trade', false);
			if (!PipelineAppModel.get('type')) {
				router.trigger('route:defaultAction');
			} else {
				router.trigger(PipelineAppModel.getUriComponent());
			}
		});

		router.route = '/investment-pipeline/';
		Backbone.history.start({pushState: true, root: router.route});

		// manage navigation links
		$(document).on('click', 'a[data-bypass]', function (e) {
			var href = $(this).attr('href').replace(router.route, '');
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