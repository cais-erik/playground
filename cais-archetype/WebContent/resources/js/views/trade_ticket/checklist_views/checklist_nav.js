/*
Trade Ticket Checklist Nav
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'routers/pipeline_router',
	'handlebars',
	'text!templates/trade_ticket/trade_ticket_nav.html',
	'collections/trade_ticket/transaction_tasks'
], function ($, _, Backbone, Vm, Events, Router, Handlebars, Template, TransactionTasks) {
	var ChecklistNav = Backbone.View.extend({
		className: 'task-navigation',
		initialize: function() {
			this.render();
			this.listenTo(TransactionTasks, 'sync', this.refresh);
			this.listenTo(TransactionTasks, 'selectTask', this.onTaskSelect);
		},
		render: function() {
			var context = {slug: Router.appRouter.slug};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			this.$('.task-complete').hide();
		},
		onTaskSelect: function(task) {
			this.$('li.active').removeClass('active');
			this.$('[data-taskid=' + task.get('taskCode') +']').addClass('active');
		},
		refresh: function() {
			TransactionTasks.each(function(model) {
				var item = this.$('[data-taskid=' + model.get('taskCode') + ']').find('.task-complete').show();
				if (model.get('status') === 'complete') {
					item.show();
				} else {
					item.hide();
				}
			}, this);
		}
	});
	return ChecklistNav;
});