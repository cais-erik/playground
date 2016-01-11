/*
Base accounts content view
Renders the accounts subheader and dispatches calls to load subviews
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'routers/accounts_router',
	'models/tree/tree_events',
	'views/accounts/accounts_hierarchy',
	'views/accounts/content_views/holdings',
	'views/accounts/content_views/performance',
	'views/accounts/content_views/documents/documents',
	'views/accounts/content_views/list',
	'views/accounts/content_views/entity_view',
	'views/accounts/content_views/client_details',
	'views/accounts/content_views/firm_details',
	'views/accounts/content_views/team_details/team_details',
	'text!templates/accounts/content_header.html'
], function ($, _, Backbone, Vm, Events, Handlebars, Router, TreeEvents, hierarchy, HoldingsView, PerformanceView, DocumentsView, ListView, EntityDetails, ClientDetails, FirmDetails, TeamDetails, Template) {
	var accountsContentView = Backbone.View.extend({
		el: $('.main-column'), // rendered in cais-accounts.jsp
		initialize: function() {
			this.listenTo(TreeEvents, 'selectNode', this.render);
			this.listenTo(TreeEvents, 'nodeUpdateComplete', this.onNodeUpdate);
			var template = Handlebars.compile(Template);
			this.$el.html(template({}));

			this.listenTo(Events, 'showUiFeedback', this.showUiFeedback);
		},
		activeLens: 'list', // default active lens
		render: function(node) {
			var that = this;
			var node = hierarchy.getActiveNode();
			if (this.subView) { 
			//	this.stopListening(this.subView);
				this.subView.remove();
				this.subView = null;
			}
			this.enableNavElems(node.categoryName);
			
			// switch the active lens to the next available lens if it isn't available for this category
			if (this.$('[data-lensname=' + this.activeLens + ']').hasClass('disabled')) {
				this.activeLens = this.$('.account-lens').not('.disabled').attr('data-lensname');
			}

			// load the currently active lens
			var newView;
			switch (this.activeLens) {
				case 'holdings':
					newView = HoldingsView;
					break;
				case 'rebates':
					console.log('load rebates view');
					break;
				case 'performance':
					newView = PerformanceView;
					break;
				case 'documents':
					newView = DocumentsView;
					break;
				case 'list':
					newView = ListView;
					break;
				case 'detail':
					newView = this.detailsDispatcher(node);
					break;
			}

			if (newView) {
				this.subView = Vm.create(this, 'ContentSubview', newView, {node:node});
				this.listenTo(this.subView, 'showUiFeedback', this.showUiFeedback);
				this.$('.content-view').html(this.subView.$el);
			}
			else {
				console.log('No view provided to content subview');
			}
			this.updateTemplate(node);
		},
		events: {
			'click .account-navigation a': 'loadLens',
			'click .communicatorClose': 'closeUiFeedback',
		},
		updateTemplate: function(node){
			if (node) {
				this.$('.category-title').text(node.displayName);
				this.$('.account-lens').each(function() {
					$(this).find('a').attr('href', '/' + $(this).attr('data-lensname') + '/' + node.fragment);
				});
			}
			else {
				this.$('.category-title').text('');
				this.$('.account-lens a').attr('href', '#');
				this.enableNavElems(false);
			}
			this.$('.account-lens.active').removeClass('active');
			this.$('[data-lensname=' + this.activeLens + ']').addClass('active');
		},
		// enables and disables the nav elements for tree nodes that have no data for specific lens
		enableNavElems: function(categoryName) {
			this.$('.account-lens.disabled').removeClass('disabled');
			if (!categoryName) {
				return;
			}
			if (categoryName === 'Advisor' || categoryName === 'CAIS') this.$('#detail-link, #documents-link').addClass('disabled');
			if (categoryName === 'Firm') this.$('#documents-link').addClass('disabled');
			if (categoryName === 'Team') this.$('#documents-link').addClass('disabled');
			if (categoryName === 'Client') this.$('#list-link, #documents-link').addClass('disabled');
			if (categoryName === 'Entity') this.$('#list-link').addClass('disabled');
		},
		changeSubview: function(View, options) {
			if (this.subView) {
				this.stopListening(this.subView);
				this.subView.remove();
			}
			var template = Handlebars.compile(Template);
			this.subView = Vm.create(this, 'ContentSubview', View, options);

			this.updateTemplate();
			this.$('.content-view').html(this.subView.$el);
			this.listenTo(this.subView, 'showUiFeedback', this.showUiFeedback);
		},
		loadLens: function(event) {
			event.preventDefault();
			var target = $(event.target);
			var lens = target.attr('href');
			if (target.parent().hasClass('disabled')) return;
			target.parent('div').siblings().removeClass('active');
			target.parent('div').addClass('active');
			
			this.activeLens = target.parent('div').attr('data-lensname');
			Router.appRouter.navigate(lens);
			this.render();
		},
		onNodeUpdate: function(node){
			if (node.displayName) this.$('.category-title').text(node.displayName);
		},
		showUiFeedback: _.throttle(function(status, message) {
			var feedbackElem = this.$('.ui-feedback');
			feedbackElem.removeClass('success').removeClass('error');
			feedbackElem.find('.message-text').text(message);
			if (status === 'Success') {
				feedbackElem.addClass('success').fadeIn('fast').delay(2000).fadeOut('slow');
			}
			else if (status === 'Error') {
				feedbackElem.addClass('error').fadeIn('fast').delay(2500).fadeOut('slow');
			}
		}, 2500, {trailing: false}),
		closeUiFeedback: function() {
			this.$('.ui-feedback').hide();
		},
		detailsDispatcher: function(node) {
			var view = null;
			switch (node.categoryName) {
				case 'Firm':
					view = FirmDetails;
					break;
				case 'Team':
					view = TeamDetails;
					break;
				case 'Advisor':
					console.log('Advisor details view');
					break;
				case 'Client':
					view = ClientDetails;
					break;
				case 'Entity':
					view = EntityDetails;
					break;
			}
			return view;
		}
	});
	return accountsContentView;
});