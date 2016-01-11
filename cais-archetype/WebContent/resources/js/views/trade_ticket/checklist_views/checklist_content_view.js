/*
Trade Ticket Header view
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'text!templates/trade_ticket/checklist_content.html',
], function ($, _, Backbone, Vm, Events, Template) {
	var RootChecklist = Backbone.View.extend({
		//_modelBinder: undefined,
		className: 'task-content-pages',
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(Template);
		},
		changeView: function(subview, callback) {
			var that = this;
			this.$('.task-content').fadeOut('fast', function() {
				var view = Vm.create(this, 'ChecklistSubView', subview);
				$(this).html(view.$el);
				$(this).fadeIn('fast');
				if (callback) callback(view);
				that.trigger('viewchange', view);
			});
		}
	});
	return RootChecklist;
});