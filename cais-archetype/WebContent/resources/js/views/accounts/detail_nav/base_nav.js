/*
base detail nav view
*/
define([
	'jquery',
	'underscore',
	'backbone',
], function ($, _, Backbone, EntityNavTemplate) {
	var BaseDetailNav = Backbone.View.extend({
		template: null,
		className: 'view-navigation',
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template);
			if (this.postRender) this.postRender();
		},
		events: {
			'click .nav-link': 'navLinkClickHandler'
		},
		navLinkClickHandler: function(event) {
			var target = $(event.currentTarget);
			if (target.hasClass('disabled')) return;
			this.$('.active').removeClass('active');
			if (!target.parents('.expanded').length) this.$('.expanded').removeClass('expanded');
			if (target.children('ul').length) {
				target.addClass('expanded');
				target.children('ul').find('li:first').addClass('active');
			} else{
				target.addClass('active');
			}
			this.trigger('navLinkSelected', this.$('.active').attr('data-section'));
			event.stopPropagation();
		},
		// disables the selected nav elements, accepts array of $ objects
		// if none, disables all
		disableNavElements: function(elems) {
			if (elems) {
				elems.each(function() {$(this).addClass('disabled')});
			} else {
				this.$('.nav-link').addClass('disabled');
			}
		},
		// enables the selected nav elements, accepts array of $ objects if none, enables all
		enableNavElements: function(elems){
			if (elems) {
				elems.each(function() {$(this).removeClass('disabled')});
			} else {
				this.$('.nav-link').removeClass('disabled');
			}
		},
		enableCheckboxes: function(activeObj) {
			this.$("span[data-name]").removeClass("checked");
			for (var key in activeObj) {
				if (activeObj.hasOwnProperty(key)) {
					var obj = activeObj[key];
					if (obj == true) {
						this.$("span[data-name=" + key + "]").addClass("checked");
					} else {
						this.$("span[data-name=" + key + "]").removeClass("checked");
					}
				}
			}
		},
		selectNext: function() {
			this.$('.nav-link.active').next().click();
		},
		selectSection: function(section) {
			this.$('[data-section=' + section + ']').last().click();
		}
	});
	return BaseDetailNav;
}); 