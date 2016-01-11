define([
	'jquery',
	'underscore',
	'backbone',
	'routers/accounts_router',
	'Vm',
	'views/accounts/accounts_hierarchy',
	'views/accounts/content',
	'views/accounts/action_menu'
], function ($, _, Backbone, Router, Vm, HierarchyView, ContentView, ActionButtonView) {
	var AccountsView = Backbone.View.extend({
		el: $('#accountView'), // rendered in cais-accounts.jsp
		options: {
			fragment: {}
		},
		initialize: function() {
			this.hierarchyView = HierarchyView;
			this.contentView = Vm.create(this, 'ContentView', ContentView);
			this.actionButtonView = Vm.create(this, 'ActionButton', ActionButtonView, {
				hierarchy: this.hierarchyView
			});
		},
		render: function() {
			// app render startup, either load the fragment or load the first hierarchy node
			var that = this;
			if (this.options.fragment) {
				setTimeout(function() { // IE8 isn't happy without this timeout
					that.hierarchyView.loadNodeFromFragment(that.options.fragment);
				}, 1);
			}
			else {
				var first = this.hierarchyView.$('a.cais-list-item').first();
				var route = first.attr('href');
				this.hierarchyView.hierarchy.expand(first);
				Router.appRouter.navigate(this.contentView.activeLens + '/' + route.replace('#', ''), {trigger: true, replace: true});
			}
		},
		events: {
			'click .cais-list-item': 'listItemClickHandler'
		},
		renderContentView: function(View) {
			//if (this.contentView.subView) this.contentView.subView.remove();
			//Vm.create(this, 'ContentSubView', View);
			this.contentView.changeSubview(View);
		},
		listItemClickHandler: function(e) {
			e.preventDefault();
			var route = this.contentView.activeLens + '/' + $(e.currentTarget).attr('href').replace('#', '');
			Router.appRouter.navigate(route, {trigger: true});
		}
	});
	return AccountsView;
});