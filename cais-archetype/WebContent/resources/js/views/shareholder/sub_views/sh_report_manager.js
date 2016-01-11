define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/shareholder/sh_report_manager.html',
	'models/shareholder/shareholder_app_model',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, Template, ShAppModel) {
	var ShReportManager = Backbone.View.extend({
		context: {},
		_modelBinder: undefined,
		el: '#report-manager',
		template: Handlebars.compile(Template),
		initialize: function() {
			this.listenTo(ShAppModel, 'change:section', this.onSectionChange);
			this.listenTo(ShAppModel, 'change:fromDate, change:toDate', this.onDateChange);
			this._modelBinder = new Backbone.ModelBinder();
			this.preRender();
		},
		preRender: function() { this.render(); },
		render: function() {
			this.context.subViews = ShAppModel.getSubViews();
			this.context.fromDate = ShAppModel.get('fromDate');
			this.context.toDate = ShAppModel.get('toDate');
			this.$el.html(this.template(this.context));

			this._modelBinder.bind(ShAppModel, this.$el);
			kendo.init(this.$el);
		},
		events: {
			'click nav li': 'onNavClick',
			'click .auto-pickers a': 'onAutoPickerClick'
		},
		onAutoPickerClick: function(e) {
			e.preventDefault();
			var range = $(e.currentTarget).data('range');
			ShAppModel.setDateRange({
				preset: range
			});
		},
		onNavClick: function(e) {
			ShAppModel.set('section', $(e.currentTarget).data('view-name'));
		},
		onDateChange: function() {
			// wait for next round of event loop
			setTimeout(_.bind(function() {
				this.$('[data-role=datepicker]').each(function() {
					$(this).data('kendoDatePicker').value($(this).val());
				});
			}, this));
		},
		onSectionChange: function(model, section) {
			this.setActive(section);
		},
		setActive: function(section) {
			this.$('nav li.active').removeClass('active');
			this.$('nav li[data-view-name=' + section +']').addClass('active');
		}
	});
	return ShReportManager;
});