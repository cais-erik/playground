define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/assets/base_kendo_dialog',
	'text!templates/admin/reports/revenue_reporter.html',
	'collections/admin/reports/revenue_collections',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseKendoDialog, Template, RevenueCollections, Binder) {
	/** 
	 * View to show RevenueReporter
	 * Extends BaseKendoDialog
	 */
	var RevenueReporter = BaseKendoDialog.extend({
		template: Handlebars.compile(Template),
		_modelBinder: undefined,
		attributes: {
			'class': 'revenue-capture-window',
		},
		collection: RevenueCollections.MonthlyRevenue,
		options: {
			title: 'Enter AI Revenue',
			resizable: false,
			selfRender: true,
			width: 960,
			productContext: 'all',
			height: 400
		},
		render: function() {
			this.model = new this.collection.model();
			var that = this;
			this.collection.fetch({
				success: function() {
					that.reinit();
				},
				error: function() {
					that.reinit();
				}
			});
		},
		events: {
			'click .add-month': 'addMonth',
			'click .edit-date': 'editMonth',
			'click .delete-month': 'deleteMonth',
			'click .cancel-dialog': 'closeDialog'
		},
		reinit: function() {
			var context = {
				collection: this.collection.toJSON(),
				model: this.model.toJSON()
			};
			this.$el.html(this.template(context));
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);

			kendo.init(this.$el);
		},
		editMonth: function(e) {
			e.preventDefault();
			var model = this.collection.get($(e.currentTarget).attr('data-id'));
			if (model) {
				this.model = model;
				this.reinit();
			} else {
				new Alert('The selected date has not been saved to the server', 'OK');
			}
		},
		deleteMonth: function(e) {
			e.preventDefault();
			var model = this.collection.get($(e.currentTarget).attr('data-id'));
			if (model) {
				model.destroy();
				this.reinit();
			} else {
				new Alert('The selected date has not been saved to the server', 'OK');
			}
		},
		addMonth: function() {
			if (!this.$('form').data("kendoValidator").validate()) return;

			var model = this.model;
			var month = kendo.toString(new Date(this.model.get('settlementDate')), 'MMMM');
			// don't allow creating two instances with the same month
			this.collection.each(function(collectionModel) {
				if (kendo.toString(new Date(collectionModel.get('settlementDate')), 'MMMM') === month) {
					collectionModel.set(this.model.toJSON());
					model = collectionModel;
				}
			}, this);
			this.collection.add(model);
			model.save();
			this.model = new this.collection.model();
			this.reinit();
		},
		onDialogConfirm: function(e) {
			this.closeDialog();
		}
	});
	return RevenueReporter;
});