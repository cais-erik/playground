/** 
 * FlyoutNav - view to manage the flyout navigation window
 * Extends Backbone.View
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm'
], function ($, _, Backbone, Vm) {
	var FlyoutNav = Backbone.View.extend({
		el: $('.flyout-nav'), // rendered in base template
		options: {},
		events: {
			'click .handle': 'toggleNav',
			'click li.nav-link a': 'navClickHandler'
		},
		toggleNav: function(e) {
			if (e) e.preventDefault();
			this.$el.toggleClass('active');
		},
		navClickHandler: function(e) {
			this.$('li a.active').removeClass('active');
			$(e.target).addClass('active');
		}
	});
	return FlyoutNav;
});