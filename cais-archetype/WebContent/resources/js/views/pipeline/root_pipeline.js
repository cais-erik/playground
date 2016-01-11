define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/authed_user',
	'models/pipeline/pipeline_app_model',
	'views/trade_ticket/root_trade_ticket',
	'views/accounts/hierarchy',
	'views/assets/flyout_nav',
	'views/pipeline/pipeline_content'
], function ($, _, Backbone, Vm, Events, Handlebars, AuthUser, PipelineAppModel, TradeTicketWindow, Hierarchy, FlyoutNav, PipelineContent) {
	var RootPipeline = Backbone.View.extend({
		el: $('.workspace'), // rendered in base template
		options: {},
		name: 'Pipeline',
		initialize: function() {
			Events.on('domchange:title', this.changeTitle);
			Vm.create(this, 'FlyoutNav', FlyoutNav);
			this.tradeTicketWindow = Vm.create(this, 'TradeTicket', TradeTicketWindow);
			this.hierarchy = Vm.create(this, 'HierarchyView', Hierarchy);

			this.listenTo(PipelineAppModel, 'change:trade', this.onTradeChange);
			
			// hierarchy doesn't need to load anything if cais user
			if (AuthUser.get('caisemployee')) {
				this.render();
			} else { // else wait for the hierarchy to load first node
				this.listenToOnce(this.hierarchy, 'treeReady', function() {
					this.render();
				});
			}
		},
		render: function() {
			this.hierarchy.selectFirstNode();
			this.contentView = Vm.create(this, 'PipelineContent',  PipelineContent);
		},
		events: {
			'click .cais-list-item': 'onHierarchyClick'
		},
		onTradeChange: function(e, options) {
			if (options) this.tradeTicketWindow.showView(options.view, options);
		},
		// don't allow the hierarchy tree to update the URL
		onHierarchyClick: function(e) {
			e.preventDefault();
		},
		/**
		 *	Renders a subview in the .main-column container
		 *  @param view, Backbone View class
		 *  @param options, View options object
		 */
		showView: function(view, options) {
			this.subView = Vm.create(this, 'Subview', view, options || {});
			this.$('.main-column').html(this.subView.$el);
		},
		/**	
		 *	Updates the title tag of the page
		 *  @param title, string, title of page
		 */
		changeTitle: function(title) {
			$(document).attr('title', title + ' | CAIS');
		},
	});
	return RootPipeline;
});