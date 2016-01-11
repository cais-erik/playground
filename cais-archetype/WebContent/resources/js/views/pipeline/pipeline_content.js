define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/pipeline/pipeline_app_model',
	'views/pipeline/ai/ai_opportunities',
	'views/pipeline/syndicate/syndicate_opportunities',
	'views/pipeline/ai/ai_charts',
	'views/pipeline/ai/ai_header',
	'views/pipeline/syndicate/syndicate_header'
], function ($, _, Backbone, Vm, Events, Handlebars, PipelineAppModel, AlternativesPipeline, CapMarketsPipeline, AiCharts, AiHeader, CmHeader) {
	var RootPipeline = Backbone.View.extend({
		el: $('.pipeline-content'), // rendered in base template
		options: {},
		name: 'Pipeline',
		// available pipelines
		pipelines: {
			ai: AlternativesPipeline,
			cm: CapMarketsPipeline
		},
		// available headers for each pipeline
		headers: {
			ai: AiHeader,
			cm: CmHeader
		},
		initialize: function() {
			this.listenTo(PipelineAppModel, 'change:lens', this.onLensChange);
			this.listenTo(PipelineAppModel, 'change:type', this.onTypeChange);
			if (PipelineAppModel.get('type')) this.onTypeChange();
		},
		onTypeChange: function() {
			this.header = Vm.create(this, 'ActivePipelineHeader', this.headers[PipelineAppModel.get('type')]);
			this.onLensChange();
		},
		onLensChange: _.throttle(function() {
			var lens = PipelineAppModel.get('lens');
			if (lens === 'chart') {
				this.chartView = Vm.create(this, 'PipelineView', AiCharts);
				this.$el.html(this.chartView.$el);
			} else {
				this.activePipeline = Vm.create(this, 'PipelineView', this.pipelines[PipelineAppModel.get('type')]);
				this.$el.html(this.activePipeline.$el);
				this.activePipeline.reInit();
			}
		}, 100, {trailing: false})
	});
	return RootPipeline;
});