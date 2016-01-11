define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars'
], function ($, _, Backbone, Vm, Events, Handlebars) {
	var BaseList = Backbone.View.extend({
		options: {},
		title: null,
		collection: null,
		gridOptions: {},
		defaultGridOptions: {
			sortable: true,
			selectable: true
		},
		initialize: function() {
			if (typeof this.collection === 'function') {
				this.collection = new this.collection(null, this.options);
			}
			
			if (!this.collection.length) {
				this.collection.fetch({
					success: _.bind(this.render, this)
				});
			}
			else {
				this.render();
			}
		},
		render: function() {
			this.list = this.$el.kendoGrid($.extend(this.gridOptions, this.defaultGridOptions)).data("kendoGrid");
			this.list.dataSource.data(this.collection.toJSON());
			if (this.postRender) this.postRender();
			this.trigger('view:ready');
		},
		events: {}

	});
	return BaseList;
});