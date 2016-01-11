/*
	Action button view
	manages the various menus available when navigating accounts section
	receives reference to hierarchy view as view option
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/action_menu.html',
	'models/authed_user',
	'routers/accounts_router',
	'common/details'
], function ($, _, Backbone, Handlebars, Template, User, Router) {
	var AccountsView = Backbone.View.extend({
		el: $('.action-btn'), // rendered in cais-accounts.jsp
		initialize: function() {
			this.$el.click(function(event) {
				event.stopPropagation();
			});
			$('body').on('click', _.bind(this.hideMenu, this));
			this.render();
		},
		menuContainer: this.$('.actions-menu-options'),
		template: Handlebars.compile(Template),
		render: function() {
			var context = {user: User.toJSON()};
			this.$('.actions-menu-options').empty();
			this.menuContainer.html(this.template(context));
		},
		events: {
			'click .secondaryButton': 'toggleMenu',
			'click li': 'hideMenu',
			'click .item a:not(.view-details)': 'select',
			'click .view-details': 'viewDetails'
		},
		select: function(e) {
			e.preventDefault();
			var route = $(e.currentTarget).attr('href');
			Router.appRouter.navigate('/' + route, {trigger:true});
		},
		toggleMenu: function() {
			this.menuContainer.slideToggle({duration: 300, easing: 'swing'});
			this.$el.toggleClass('open');
		},
		hideMenu: function() {
			this.menuContainer.slideUp({duration: 300, easing: 'swing'});
			this.$el.removeClass('open');
		},
		viewDetails: function(e) {
			// lifted from account.js
			e.preventDefault();
			var hierarchyItem = this.options.hierarchy.hierarchy.dataItem(this.options.hierarchy.hierarchy.select());
			var category = hierarchyItem.categoryName;
			var options = {selection: hierarchyItem.id};

			if (User.toJSON().caisemployee) {
				caisUserRole = "CAIS";
			} else if (User.toJSON().clientSupervisor) {
				caisUserRole = "clientSupervisor";
			} else {
				caisUserRole = "clientUser";
			}
			switch(category) {
				case "Advisor":
					var options = {selection: hierarchyItem.userId};
					if (caisUserRole == "CAIS") {
						var dialog = new Dialog("cais-member-detail", options);
					} else if (caisUserRole == "clientSupervisor") {
						var dialog = new Dialog("supervisor-member-detail", options);
					} else if (caisUserRole == "clientUser") {
						var dialog = new Dialog("member-detail", options);
					}
					break;
				default: 
					Router.appRouter.navigate('/detail/' + hierarchyItem.fragment, {trigger:true});
					break;
			}
		}
	});
	return AccountsView;
});