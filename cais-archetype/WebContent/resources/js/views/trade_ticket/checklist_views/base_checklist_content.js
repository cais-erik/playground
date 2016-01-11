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
	'models/trade_ticket/active_ticket_item'
], function ($, _, Backbone, Vm, Events, Handlebars, ActiveTicketItem) {
	var BaseChecklistContent = Backbone.View.extend({
		//_modelBinder: undefined,
		className: 'checklist-content-container',
		template: null,
		collection: null,
		model: ActiveTicketItem,
		context: {},
		initialize: function() {
			if (this.preInit) this.preInit();
			if (this.collection) {
				this.collection.fetch({
					success: _.bind(this.render, this)
				});
			} else {
				this.render();
			} 
		},
		render: function() {
			if (this.preRender) this.preRender();
			if (this.collection) this.context.collection = this.collection.toJSON();
			
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.context));
			if (this.postRender) this.postRender();
		},
		closeTask: function() {
			this.model.approveTask();
		},
		rejectTask: function() {
			this.model.rejectTask();
		},
		downloadSingleDoc: function(e) {
			e.preventDefault();
			this.model.downloadDocuments([$(e.currentTarget).attr('data-docid')]);
		}
	});
	return BaseChecklistContent;
});