define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/pipeline/pipeline_app_model'
], function ($, _, Backbone, Vm, Events, Handlebars, PipelineAppModel) {
	var BasePipelineStep = Backbone.View.extend({
		options: {},
		initialize: function() {
			PipelineAppModel.selectedProducts.reset();
			this.listenTo(PipelineAppModel, 'change:filters change:transactionStatusId', this.reInit);
			this.listenTo(PipelineAppModel.selectedProducts, 'transactionsDeleted', this.reInit);
			this.listenTo(PipelineAppModel, 'exportToExcel', this.exportToExcel);
			this.listenTo(PipelineAppModel, 'change:offering', this.onOfferingSelect);

			$(window).on('resize', this.resizeOpportunityGrid);
			this.collection = this.pipelineCollections.getActiveCollection();

			this.render();
		},
		reInit: function() {
			var that = this;
			$('.grid-loader').show();
			if (this._expandedIndex) this._expandedIndex = null;
			if (this.activeIoisView) this.activeIoisView.closeView();
			this.collection = this.pipelineCollections.getActiveCollection();
			this.collection.fetch({
				success: function(collection) {
					that.resizeOpportunityGrid();
					if (that.grid.dataSource.page() !== 1) {
						that.grid.dataSource.page(1);
					}
					that.grid.dataSource.data(that.collection.toJSON());
					Events.trigger('activePipelineCollection:sync', collection);
					if (that.manageColumns) that.manageColumns();
					setTimeout(function() {
						$('.grid-loader').fadeOut('fast');
					}, 300);
				},
				error: function() {
					Alert('There was an error while fetching the opportunities from the server. Please change your filters, then try again.', 'OK');
					that.grid.dataSource.data([]);
					setTimeout(function() {
						$('.grid-loader').fadeOut('fast');
					}, 300);
				}
			});
		},
		events: {
			'change .select-product': 'onProductSelectChange'
		},
		exportToExcel: function() {
			this.collection.exportToExcel();
		},
		onProductSelectChange: function(e) {
			var id = parseInt($(e.currentTarget).val());
			var checked = $(e.currentTarget).prop('checked');
			if (checked) {
				PipelineAppModel.selectedProducts.add(new PipelineAppModel.selectedProducts.model({id:id}));
			} else {
				PipelineAppModel.selectedProducts.remove(PipelineAppModel.selectedProducts.get(id));
			}
		},
		// TODO: fix this
		resizeOpportunityGrid: _.debounce(function() {
//			var gridElement = $(".grid-wrapper.pipeline-content");
//			var gridGroupingHeader = gridElement.find(".k-grouping-header").first();
//			var gridHeader = gridElement.find(".k-grid-header").first();
//			var gridFooter = gridElement.find(".k-grid-footer").first();
//			var dataArea = gridElement.find(".k-grid-content").first();
//			var newHeight = gridElement.parent().innerHeight();
//
//			//gridElement.height(newHeight);
//			dataArea.height(newHeight - gridGroupingHeader.outerHeight() - gridHeader.outerHeight() - gridFooter.outerHeight());
			// util.js
			resizeGrid(".ai-pipeline-grid");
		}, 300),
		clean: function() {
			PipelineAppModel.selectedProducts.reset();
			this.stopListening();
			$(window).off('resize', this.resizeOpportunityGrid);
		}
	});
	return BasePipelineStep;
});