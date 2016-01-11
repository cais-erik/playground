define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/assets/tabbed_multi_view.html'
], function ($, _, Backbone, Vm, Events, Handlebars, Template) {
	/*
	 * TabbedMultiView class, renders an array of views in a tabbed UI
	 * subViews key must contain array of objects containing name and view
	 */
	var TabbedMultiView = Backbone.View.extend({
		context: {},
		subViews: [],
		className: 'tabbed-multi-view',
		template: Handlebars.compile(Template),
		initialize: function() {
			if (this.options.subViews) this.subViews = this.options.subViews;
			this.render();
		},
		render: function() {
			this.context.subViews = this.subViews;
			this.$el.html(this.template(this.context));
			this.initTabs();
			this.initViews();
		},
		initTabs: function() {
			this.$('.tabs li').first().addClass('k-state-active');
			this.$('.tabs').kendoTabStrip({
				animation:  {
					open: {
						effects: "fadeIn"
					}
				},
				activate: function() {
					Events.trigger('tabbedMultiView:tabChange', arguments);
				}
			});
		},
		initViews: function() {
			// init the subview in each tab
			_.each(this.subViews, function(view, i) {
				view.instance = Vm.create(this, 'SubView-' + view.name.replace(/ /g, '-'), view.view, view.options || null);
				this.$('.view-container').eq(i).html(view.instance.$el);
			}, this);
		},
		events: {
		}
	});
	return TabbedMultiView;
});