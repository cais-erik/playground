define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/pipeline/pipeline_app_model',
	'models/authed_user'
], function ($, _, Backbone, Vm, Events, Handlebars, PipelineAppModel, AuthedUser) {
	var BasePipelineStep = Backbone.View.extend({
		options: {},
		el: '.pipeline-steps-container',
		initialize: function() {
			this.render();
			this.listenTo(PipelineAppModel, 'change:transactionStatusId change:filters', this.onFilterChange);
			this.listenTo(PipelineAppModel, 'change:lens', this.initViewToggle);
			this.listenTo(PipelineAppModel.selectedProducts, 'add remove reset', this.onSelectedProductCollectionChange);
			this.listenTo(Events, 'activePipelineCollection:sync', this.onActiveCollectionSync);
		},
		render: function() {
			this.$el.html(this.template);
			this.onFilterChange();
			if (!AuthedUser.get('hasAcceptedCMTerms')) {
				this.$('.pipeline-selector').remove();
			}
		},
		events: {
			'click .filter': 'onFilterClick',
			'click .pipeline-select': 'onPipelineClick',
			'click .delete-transaction': 'deleteTransactions',
			'click .grid-chart-toggle': 'onViewToggleClick',
			'click .export-to-excel': 'exportToExcel'
		},
		exportToExcel: function() {
			PipelineAppModel.trigger('exportToExcel');
		},
		onPipelineClick: function(e) {
			if (e) e.preventDefault();
			var elem = $(e.currentTarget);
			if (elem.hasClass('selected')) return;
			PipelineAppModel.set({
				'type': elem.attr('data-pipelinetype'),
				'transactionStatusId': 0,
				'lens': 'grid'
			});
		},
		initViewToggle: function() {
			if (PipelineAppModel.get('lens') === 'chart') {
				this.$('.grid-chart-toggle').removeClass("grid-view").addClass("chart-view");
			} else {
				this.$('.grid-chart-toggle').removeClass("chart-view").addClass("grid-view");
			}
		},
		onViewToggleClick: function(e) {
			var elem = $(e.currentTarget);
			if (elem.hasClass("grid-view")) {
				elem.removeClass("grid-view").addClass("chart-view");
				this.$('.export-to-excel').hide();
				PipelineAppModel.set('lens', 'chart');
			} else {
				elem.removeClass("chart-view").addClass("grid-view");
				this.$('.export-to-excel').show();
				PipelineAppModel.set('lens', 'grid');
			}
		},
		onFilterChange: function(e) {
			this.$('.filter.selected').removeClass('selected');
			this.$('.filter[data-filter=' + PipelineAppModel.get('transactionStatusId') + ']').addClass('selected');
			this.$('.filter-name').text(this.$('.filter.selected').text());
			if (PipelineAppModel.get('filters').dataNode) {
				this.$('.selectedName').text(PipelineAppModel.get('filters').dataNode.displayName);
				Events.trigger('domchange:title', this.$('.filter.selected').text() + ' ' + PipelineAppModel.get('filters').dataNode.displayName);
			}
		},
		onFilterClick: function(e) {
			var filterIndex = parseInt($(e.currentTarget).attr('data-filter'));
			PipelineAppModel.set('transactionStatusId', filterIndex);
		},
		onActiveCollectionSync: function(collection) {
			this.$('.table-records').text(collection.length);
		},
		deleteTransactions: function() {
			var text = 'Are you sure you want to permanently delete ' + PipelineAppModel.selectedProducts.length + ' transaction';
			if (PipelineAppModel.selectedProducts.length > 1) text = text + 's';
			new Alert(text + '?', 'YES', 'NO');

			$(document).bind('alertConfirm', function() {
				PipelineAppModel.deleteTransactions();
			});
		},
		onSelectedProductCollectionChange: function() {
			if (PipelineAppModel.selectedProducts.length) {
				var text = 'Delete ' + PipelineAppModel.selectedProducts.length + ' transaction';
				if (PipelineAppModel.selectedProducts.length > 1) text = text + 's';
				this.$('.delete-transaction').show().find('.inner').text(text);
			} else {
				this.$('.delete-transaction').hide();
			}
		},
		clean: function() {
			this.stopListening();
		}
	});
	return BasePipelineStep;
});