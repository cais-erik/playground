define([
	'jquery',
	'underscore',
	'backbone',
	'events',
	'collections/base_cais_collection'
], function($, _, Backbone, Events, BaseCollection){
	var TransactionTasks = BaseCollection.extend({
		initialize: function() {
			this.listenTo(Events, 'task:approved', this.onTaskApproved);
		},
		preventSelectingIncomplete: true,
		baseUrl: '/getTransactionTasks',
		params: {
			transactionId: null
		},
		activeTask: null,
		// selects a task by taskCode
		selectTask: function(taskCode) {
			if (!taskCode) throw 'No taskCode provided to selectTask function.';
			var selectedTask  = this.findWhere({taskCode:taskCode});
			if (this.preventSelectingIncomplete && this.indexOf(selectedTask) !== 0) {
				if (selectedTask.get('status') === 'incomplete' && this.at(this.indexOf(selectedTask) - 1).get('status') !== 'complete') {
					return false;
				}
			}
			this.activeTask = this.findWhere({taskCode:taskCode});
			this.trigger('selectTask', this.activeTask);
		},
		// selects the next uncomplete task 
		selectNextIncompleteTask: function() {
			var next = this.findWhere({'status': 'incomplete'}) || this.at(this.length - 1);
			this.selectTask(next.get('taskCode'));
		},
		// selects a task by name
		selectTaskByName: function(name){
			this.selectTask(this.taskNameMap[name]);
		},
		onTaskApproved: function() {
			this.fetch({
				success: function() {
					Events.trigger('task:listupdated', this)
				}
			});
		},
		taskNameMap: {
			'review': 1,
			'present': 2,
			'verify': 3,
			'upload': 4,
			'received': 5,
			'approved': 6,
			'funding': 8,
			'complete': 9
		}
	});
	return new TransactionTasks();
});