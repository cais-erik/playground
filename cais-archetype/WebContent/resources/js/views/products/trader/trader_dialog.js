define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'views/products/trader/root_trader'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, Trader) {
	var TraderDialog = BaseKendoDialog.extend({
		options: {
			width: 640,
			height: 400,
			title: 'Order Form',
			resizable: false,
			selfRender: true
		},
		render: function() {
			this.trader = Vm.create(this, 'Trader', Trader, this.options);
			this.$el.html(this.trader.$el);
		},
		onClose: function() {
			this.trader.clean();
			this.kendoWindow.destroy();
			this.remove();
		},
	});
	return TraderDialog;
});