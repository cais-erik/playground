/*
Trade Ticket Subscription View
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'views/accounts/content_views/entity_view',
	'collections/trade_ticket/task_collections',
	'models/trade_ticket/active_ticket_item',
	'views/assets/big_loader',
	'views/assets/confirm_dialog'
], function ($, _, Backbone, Vm, Events, AccountsEntityView, TaskCollections, ActiveTicketItem, BigLoader, ConfirmDialog) {
	var RootSubscription = Backbone.View.extend({
		className: 'subscription-view',
		initialize: function() {
			this.render();
		},
		render: function() {
			this.accountsEntityView = Vm.create(this, 'AccountsEntityView', AccountsEntityView, {
				node: {
					investmentEntityId: ActiveTicketItem.get('investmententityid'),
					advisorId: ActiveTicketItem.get('advisorId'),
					investorId: ActiveTicketItem.get('investorId')
				},
				startSection: 'entity-trade-details'
			});
			this.$el.html(this.accountsEntityView.$el);

			this.accountsEntityView.$('[data-section="entity-trade-details"]').show();
			this.accountsEntityView.$('.primaryButton.delete').remove();
			this.accountsEntityView.$('.primaryButton.continue')
				.addClass('regenerate-docs')
				.removeClass('continue')
				.removeClass('save')
				.find('span').text('REGENERATE DOCS');
		},
		events: {
			'click .regenerate-docs': 'regenerateDocs'
		},
		regenerateDocs: function() {
			if (TaskCollections.funds.haveModelsChanged()) {
				new Alert('Please save your fund changes before regenerating documents.', 'OK');
				return false;
			}
			var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Generating documents...'});
			ActiveTicketItem.regenerateDocs({
				success: function() {
					Vm.create(this, 'ConfirmDialog', ConfirmDialog, {
						message: 'Your Subscription Document has been successfully regenerated.',
						confirmCallback: function() {
							Events.trigger('docs:regenerated');
							location.reload();
						}
					});
					loader.closeLoader();
				},
				error: function(resp) {
					new Alert(resp, 'OK');
					loader.closeLoader();
				}
			});
		}
	});
	return RootSubscription;
});