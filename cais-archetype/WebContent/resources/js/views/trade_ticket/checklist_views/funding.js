/*
Base Checklist Content View
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'collections/trade_ticket/task_collections',
	'collections/trade_ticket/transaction_tasks',
	'models/authed_user',
	'text!templates/trade_ticket/checklist/funding.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseChecklistContent, TaskCollections, TransactionTasks, AuthUser, Template) {
	var Funding = BaseChecklistContent.extend({
		className: 'funding-tasks',
		template: Template,
		title: 'Funding Wire Received',
		events: {
			'click #confirmFundsReceived': 'closeTask'
		},
		postRender: function() {
			if (!AuthUser.get('caisemployee') || TransactionTasks.findWhere({'taskCode': 8}).get('status') === 'complete') {
	            this.$("#confirmFundsReceived").remove();
	        }
		}
	});
	return Funding;
});