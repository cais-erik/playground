define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_trade_details.html',
	'text!templates/trade_ticket/checklist/fund_table_row.html',
	'collections/trade_ticket/task_collections',
	'views/trade_ticket/checklist_views/verify',
	'amd/backbone/Backbone.CollectionBinder'
], function ($, _, Backbone, Vm, Handlebars, BaseDetailsView, Template, RowTemplate, TaskCollections, VerifyView) {
	var EntityTradeDetails = BaseDetailsView.extend({
		template: Template,
		postRender: function() {
			this.verifyView = Vm.create(this, 'VerifyView', VerifyView);
			this.$('.fund-update-container').html(this.verifyView.$el);
			this.verifyView.$('.details-footer, .details-header, [name=verify-confirm]').remove();
			// destroy the validator from BaseDetailsViews
			this.$('.form').data('kendoValidator').destroy();
		},
		events: {
			'click .update-transaction': 'updateFundDetails'
		},
		saveModel: function(e) {
			this.verifyView.updateDocs({
				success: function() {
					new Alert('These funds have been updated.' , 'OK');
				}
			});
		}
	});
	return EntityTradeDetails;
});