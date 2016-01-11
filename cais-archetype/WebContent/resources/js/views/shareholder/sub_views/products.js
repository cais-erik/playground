define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/shareholder/sub_views/base_sh_subview',
	'views/assets/tabbed_multi_view',
	'text!templates/shareholder/products.html',
	'views/assets/charts/personnel_by_team',
	'views/assets/charts/team_growth',
	'views/assets/charts/overall_team_growth',
	// 'collections/shareholders/shareholder_letters',
	// 'amd/backbone/Backbone.CollectionBinder',
	// 'amd/backbone/Backbone.ModelBinder',
	// 'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseShSubview, TabbedMultiView, Template, TeamGrowth, OverallTeamGrowth) {
	var Products = BaseShSubview.extend({
		template: Handlebars.compile(Template),
		className: 'products subview',
		title: 'Products',
		chartViews: [
			{
				name: 'Overall Personnel Growth',
				view: OverallTeamGrowth
			},
			{
				name: 'Team Growth',
				view: TeamGrowth
			}
		],
		preRender: function(callback) {
			this.render();
		},
		postRender: function() {
			var tabbedCharts = Vm.create(this, 'TabbedMultiView', TabbedMultiView, {
				subViews: this.chartViews
			});
			this.$('.charts').html(tabbedCharts.$el);
			tabbedCharts.$el.clone().appendTo(this.$('.cm-charts'));
		},
		events: {
		}
	});
	return Products;
});