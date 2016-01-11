/*
Trade Ticket Header view
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'amd/backbone/Backbone.ModelBinder',
	'models/trade_ticket/active_ticket_item',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Binder, ActiveTicketItem) {
	var TradeTicketHeader = Backbone.View.extend({
		_modelBinder: undefined,
		initialize: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(ActiveTicketItem, this.el);
		}
	});
	return TradeTicketHeader;
});