/*
Trade Ticket Header view
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'views/trade_ticket/checklist_views/checklist_nav',
	'views/trade_ticket/checklist_views/checklist_content_view',
	'collections/trade_ticket/transaction_tasks',
	// checklist subviews
	'views/trade_ticket/checklist_views/review',
	'views/trade_ticket/checklist_views/present',
	'views/trade_ticket/checklist_views/verify',
	'views/trade_ticket/checklist_views/upload',
	'views/trade_ticket/checklist_views/received',
	'views/trade_ticket/checklist_views/approved',
	'views/trade_ticket/checklist_views/funding',
	'views/trade_ticket/checklist_views/trade_complete'
], function ($, _, Backbone, Vm, Events, ChecklistNav, ChecklistContentView, TransactionTasks) {
	var RootChecklist = Backbone.View.extend({
		className: 'checklist-view',
		initialize: function() {
			var that = this;
			this.navView = Vm.create(this, 'ChecklistNav', ChecklistNav);
			this.contentView = Vm.create(this, 'ChecklistContentView', ChecklistContentView);
			this.$el.append(this.navView.$el);
			this.$el.append(this.contentView.$el);

			TransactionTasks.fetch({
				success: function() {
					// if option was provided, navigate to that view, else select next incomplete
					if (that.options.subViewName) {
						TransactionTasks.selectTaskByName(that.options.subViewName);
					} else {
						TransactionTasks.selectNextIncompleteTask();
					}
				}
			});
			this.listenTo(TransactionTasks, 'selectTask', this.onSelectTask);
			this.listenTo(Events, 'task:listupdated', this.onTaskListUpdated);
		},
		subViews: [
			null,
			'views/trade_ticket/checklist_views/review',
			'views/trade_ticket/checklist_views/present',
			'views/trade_ticket/checklist_views/verify',
			'views/trade_ticket/checklist_views/upload',
			'views/trade_ticket/checklist_views/received',
			'views/trade_ticket/checklist_views/approved',
			null,
			'views/trade_ticket/checklist_views/funding',
			'views/trade_ticket/checklist_views/trade_complete'
		],
		render: function() {
			var that =  this;
			require([this.options.subViewPath], function(subview) {
				if (!subview) {
					throw 'No subview provided!';
					return;
				}
				that.contentView.changeView(subview, function(view) {
					that.subView = view
					that.$('.task-description').text(that.subView.title);
				});
			});
		},
		events: {
			'click .tab-section': 'changeSection'
		},
		changeSection: function(e) {
			var elem = $(e.currentTarget);
			var section = elem.attr('data-section');
			if (elem.hasClass('active')) return;
			if (section === 'comments') {
				this.options.previousPath = this.options.subViewPath;
				this.options.subViewPath = 'views/trade_ticket/checklist_views/comments';
				this.render();
			} else {
				this.options.subViewPath = this.options.previousPath || this.subViews[1];
				this.render();
			}
			this.$('.tab-section').removeClass('active');
			elem.addClass('active');
		},
		onSelectTask: function(task) {
			this.options.subViewPath = this.subViews[task.get('taskCode')];
			this.$('.tab-section').removeClass('active');
			this.$('.tab-section[data-section=details]').addClass('active');
			this.render();
		},
		clean: function() {
			this.stopListening();
		},
		onTaskListUpdated: function() {
			this.navView.$('li.active').next().find('a').click();
		}
	});
	return RootChecklist;
});