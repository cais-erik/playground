/*
Trade compelete view 
Extends received veiw
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
	'text!templates/trade_ticket/checklist/trade_complete.html'
], function ($, _, Backbone, Vm, Events, Handlebars, ReceivedTask, TransactionTasks, Template) {
	var TradeComplete = ReceivedTask.extend({
		//_modelBinder: undefined,
		className: 'trade-complete-tasks',
		template: Template,
		title: 'Completed Trade',
		postRender: function() {
			return;
		}
	});
	return TradeComplete;
});