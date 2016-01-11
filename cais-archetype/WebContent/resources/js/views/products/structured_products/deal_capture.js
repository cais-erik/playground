define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'text!templates/products/structured_products/deal_terms_form.html',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, Template, Binder) {
	/** 
	 * Modal view to show the deal capture form for structured products
	 * Extends BaseKendoDialog
	 */
	var DealCapture = BaseKendoDialog.extend({
		template: Template,
		_modelBinder: undefined,
		attributes: {
			'class': 'deal-capture-window'
		},
		model: null,
		options: {
			title: 'Enter Deal Information',
			resizable: false,
			selfRender: true,
			width: 425,
			productContext: 'all',
			height: 275
		},
		render: function() {
			var that = this;
			this.$el.html(Template);	
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);
			this.listenTo(this.model, 'sync', this.reinit);
			this.model.fetch();
		},
		events: {
			'click .confirm-dialog': 'onDialogConfirm'
		},
		reinit: function() {
			kendo.init(this.$el);
		},
		onDialogConfirm: function(e) {
			this.model.save(null, {
				success: _.bind(this.closeDialog, this),
				error: function(response) {
					Alert('The deal information could not be saved. Error: ', JSON.parse(response.responseText).error, 'ok');
				}
			});
		}
	});
	return DealCapture;
});