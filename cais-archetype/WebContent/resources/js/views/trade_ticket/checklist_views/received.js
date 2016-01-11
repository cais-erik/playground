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
	'text!templates/trade_ticket/checklist/received.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseChecklistContent, TaskCollections, TransactionTasks, AuthUser, Template) {
	var ReceivedTask = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'received-tasks',
		template: Template,
		collection: TaskCollections.docsReceived,
		title: 'Documents Received',
		postRender: function() {
			if (!AuthUser.get('caisemployee') || TransactionTasks.at(4).get('status') === 'complete') {
	            this.$("#confirmDocsReceived").remove();
	        }
		},
		events: {
			'click #confirmDocsReceived': 'closeTask',
			'click #downloadDocsReceived': 'downloadDocsReceived'
		},
		downloadDocsReceived: function() {
			this.model.downloadDocuments(this.collection.pluck('documentId'));
		}
	});
	return ReceivedTask;
});