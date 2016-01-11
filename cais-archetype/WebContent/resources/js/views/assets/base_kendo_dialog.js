/**
 * base fullscreen takeover dialog with kendo dialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
], function ($, _, Backbone, Handlebars) {
	var BaseKendoDialog = Backbone.View.extend({
		attributes: {
			'class': 'kendo-dialog'
		},
		options: {
			selfRender: true
		},
		initialize: function() {
			this.events = _.extend({}, BaseKendoDialog.prototype.events, this.events);
			if (this.preInit) this.preInit();
			var defaults = {
				width: '640px',
				title: 'Dialog',
				modal: true,
				actions: [
					'Close'
				],
				visible: false,
				deactivate: _.bind(this.onClose, this)
				//close: _.bind(this.onClose, this)
			};
			var settings = $.extend(defaults, this.options);
			this.$el.appendTo('body');
			this.kendoWindow = this.$el.kendoWindow(settings).data('kendoWindow');

			if (this.options.selfRender) {
				this.render();
				this.open();
			}	
			$(window).on('resize', _.bind(this.onWindowResize, this));
		},
		open: function() {
			this.kendoWindow.center();
			this.kendoWindow.open();
		},
		events: {
			'click .cancel-dialog': 'closeDialog'
		},
		onClose: function() {
			this.kendoWindow.destroy();
			this.remove();
		},
		closeDialog: function() {
			this.kendoWindow.close();
		},
		onWindowResize: _.debounce(function() {
			this.kendoWindow.center();
		}, 200)
	});
	return BaseKendoDialog;
});