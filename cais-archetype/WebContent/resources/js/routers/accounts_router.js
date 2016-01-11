/*
Router for accounts page
/firm/team/advisor/client/entity
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm'
], function ($, _, Backbone, Vm) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Pages
			"add_client": "addClient",
			"add_entity": "addEntity",
			"add_team": "addTeam",
			"add_firm": "addFirm",
			"migrate_investor": "migrateInvestor",
			
			// firm routes
			"holdings/*route": "holdings",
			"performance/*route": "performance",
			"documents/*route": "documents",
			"list/*route": "list",
			"detail/*route": "detail",

			// Default - catch all
			'*actions': 'defaultAction'
		}
	});
	var accountsRouter = new AppRouter();
	// history of previous URL fragments, currently only saving last 4 in this array. 
	accountsRouter._prevFragments = [];

	var initialize = function(options) {
		var appView = options.appView;
		// splits a fragment into a firm/team/advisor/client/entity object to be used by base accounts view
		var parseFragment = function(fragment) {
			if (!fragment) {
				throw('No fragment provided to navigate to.');
				return null;
			}
			if (fragment === 'cais') return 'cais';
			var frag = fragment.split('/');
			var obj = {};
			for (var i = 0; i < frag.length; i++) {
				var classType = 'firm';
				if (i === 1) classType = 'team';
				if (i === 2) classType = 'advisorId';
				if (i === 3) classType = 'clientId';
				if (i === 4) classType = 'entityId';
				obj[classType] = parseInt(frag[i]);
			}
			return obj;
		};
		// executed on all routes
		accountsRouter.on('route', function(e) {
			accountsRouter._prevFragments.unshift(Backbone.history.getFragment());
			if (accountsRouter._prevFragments.length > 4) {
				accountsRouter._prevFragments = accountsRouter._prevFragments.slice(0,4);	
			} 
		});
		// misc routes
		accountsRouter.on('route:addTeam', function() {
			require(['views/accounts/content_views/team_details/team_details'], function(View) {
				appView.renderContentView(View);
			});
		});
		accountsRouter.on('route:addFirm', function() {
			require(['views/accounts/content_views/firm_details'], function(View) {
				appView.renderContentView(View);
			});
		});
		accountsRouter.on('route:migrateInvestor', function() {
			require(['views/accounts/content_views/migrate_investor'], function(View) {
				Vm.create(this, 'MigrateInvestor', View);
			});
		});
		accountsRouter.on('route:addClient', function() {
			require(['views/accounts/content_views/add_client'], function(View) {
				appView.renderContentView(View);
			});
		});
		accountsRouter.on('route:addEntity', function() {
			require(['views/accounts/content_views/add_entity'], function(View) {
				appView.renderContentView(View);
			});
		});
		// Lens routes
		accountsRouter.on('route:holdings', function(fragment) {
			appView.contentView.activeLens = 'holdings';
			appView.options.fragment = parseFragment(fragment);
			appView.render();
		});
		accountsRouter.on('route:performance', function(fragment) {
			appView.contentView.activeLens = 'performance';
			appView.options.fragment = parseFragment(fragment);
			appView.render();
		});
		accountsRouter.on('route:documents', function(fragment) {
			appView.contentView.activeLens = 'documents';
			appView.options.fragment = parseFragment(fragment);
			appView.render();
		});
		accountsRouter.on('route:list', function(fragment) {
			appView.contentView.activeLens = 'list';
			appView.options.fragment = parseFragment(fragment);
			appView.render();
		});
		accountsRouter.on('route:detail', function(fragment) {
			appView.contentView.activeLens = 'detail';
			appView.options.fragment = parseFragment(fragment);
			appView.render();
		});
		accountsRouter.on('route:defaultAction', function(actions) {
			appView.options.fragment = null;
			appView.render();
		});
		Backbone.history.start({pushState: true, root: '/cais-accounts/'});
		// manage navigation links
		$(document).on('click', 'a[data-bypass]', function (e) {
			var href = $(this).attr('href');
			var protocol = this.protocol + '//';
			
			if (href.slice(protocol.length) !== protocol) {
				e.preventDefault();
				accountsRouter.navigate(href, {trigger: true});
			}
		});
	};
	return {
		initialize: initialize,
		appRouter: accountsRouter
	};
});