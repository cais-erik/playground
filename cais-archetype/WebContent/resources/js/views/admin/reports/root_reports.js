define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/authed_user',
	'views/assets/flyout_nav',
	'views/assets/big_loader'
], function ($, _, Backbone, Vm, Events, Handlebars, AuthUser, FlyoutNav, BigLoader) {
	var RootReports = Backbone.View.extend({
		el: $('.workspace'), // rendered in base template
		options: {},
		initialize: function() {
			kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];
			Events.on('domchange:title', this.changeTitle);
			Vm.create(this, 'FlyoutNav', FlyoutNav);
			this.initViewPermissions();
		},
		/**
		 *	Renders a subview in the .main-column container
		 *  @param view, Backbone View class
		 *  @param options, View options object
		 */
		showView: function(view, options) {
			if (this.subView) this.subView.remove();
			// set the active tab if not set already
			if (!this.$('.flyout-nav li a.active').length) {
				var fragment = Backbone.history.getFragment() ;
				if (!fragment) fragment = '#'
				this.$('.flyout-nav li a[href="'+ fragment + '"]').addClass('active');
			}
			// show big loader
			var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Loading report...'});
			this.subView = Vm.create(this, 'Subview', view, options || {});
			this.$('.main-column').html(this.subView.$el);

			// hide loader on subview's view:ready event
			this.subView.on('view:ready', function() {
				loader.closeLoader();
			})
		},
		/**	
		 *	Simple hack to block users that are not on the EC from viewing revenue
		 *  @param callback, function, returns true or false
		 */
		initViewPermissions: function(callback) {
			var ecUserIds = [
				2230, // rfarooqui
				1901, // khennessy
				2240, // mbrown
				3143, // jnorton
				2847 // tshannon
			];
			Server.checkUserSwitchMenu(null, function(response) {
				if ($.inArray(AuthUser.get('userId'), ecUserIds) === -1 || response === 'EXIT_USER') {
					this.$('.finance-nav-items').remove();
					if (callback) callback(false);
				}
				else {
					if (callback) callback(true);
				}
			});
		},
		/**	
		 *	Updates the title tag of the page
		 *  @param title, string, title of page
		 */
		changeTitle: function(title) {
			$(document).attr('title', title + ' | CAIS');
		}
	});
	return RootReports;
});