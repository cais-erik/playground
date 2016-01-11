/*
Approve task view,
extends ReceivedTask view
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/trade_ticket/checklist_views/received',
	'collections/trade_ticket/task_collections',
	'collections/trade_ticket/transaction_tasks',
	'models/authed_user',
	'text!templates/trade_ticket/checklist/approved.html'
], function ($, _, Backbone, Vm, Events, Handlebars, ReceivedTask, TaskCollections, TransactionTasks, AuthUser, Template) {
	var ApprovedTask = ReceivedTask.extend({
		//_modelBinder: undefined,
		className: 'approved-tasks',
		template: Template,
		title: 'Documents Approved',
		postRender: function() {
			if (!AuthUser.get('caisemployee') || TransactionTasks.at(5).get('status') === 'complete') {
	            this.$("#confirmDocsReceived").remove();
	        }
		}
	});
	return ApprovedTask;
});