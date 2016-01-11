define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/pipeline/base_pipeline_header',
	'models/pipeline/pipeline_app_model',
	'text!templates/pipeline/ai/ai_header.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BasePipelineHeader, PipelineAppModel, Template) {
	var AiHeader = BasePipelineHeader.extend({
		options: {},
		template: Template,
	});
	return AiHeader;
});