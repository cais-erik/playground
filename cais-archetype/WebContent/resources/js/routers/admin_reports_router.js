/*
* Router for admin reports section
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
			'products/:type': 'products',
			'calendar': 'calendar',
			'fi/iws': 'fiIws',
			'revenue': 'revenue',
			'working_capital': 'workingCapital',
			'ytd_expenses': 'ytdExpenses',
			// Default - catch all
			'*actions': 'defaultAction'
		}
	});
	var router = new AppRouter();
	var initialize = function(options) {
		var appView = options.appView;
		router.on('route:products', function(type) {
			require(['views/admin/reports/products'], function(Dashboard) {
				var options = {
					productType: type,
					sectionTitle: function() {
						if (type === 'ai') return 'Alternative Investments';
						if (type === 'syndicate') return 'Syndicate';
						if (type === 'structured_solutions') return 'Structured Solutions';
					}()
				};
				appView.showView(Dashboard, options);
			});
		});
		router.on('route:calendar', function() {
			require(['views/admin/reports/calendar'], function(Calendar) {
				appView.showView(Calendar, options);
			});
		});
		router.on('route:fiIws', function() {
			require(['views/admin/reports/fi/fi_iws'], function(FiIws) {
				appView.showView(FiIws, options);
			});
		});
		router.on('route:workingCapital', function() {
			require(['views/admin/reports/finance/working_capital'], function(WorkingCapital) {
				appView.showView(WorkingCapital, options);
			});
		});
		router.on('route:ytdExpenses', function() {
			require(['views/admin/reports/finance/ytd_expenses'], function(ytdExpenses) {
				appView.showView(ytdExpenses, options);
			});
		});
		router.on('route:revenue', function() {
			appView.initViewPermissions(function(canViewRevenu) {
				if (canViewRevenu) {
					require(['views/admin/reports/finance/revenue'], function(Revenue) {
						appView.showView(Revenue, options);
					});
				}
				else {
					Alert('You do not have permission to view CAIS Revenue.', 'OK');
				}
			});
		});
		router.on('route:defaultAction', function() {
			require(['views/admin/reports/dashboard'], function(DataTracking) {
				appView.showView(DataTracking);
			});
		});
		Backbone.history.start({pushState: true, root: '/admin/reports/'});
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