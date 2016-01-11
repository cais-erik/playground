define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/pipeline/base_pipeline_header',
	'models/pipeline/pipeline_app_model',
	'text!templates/pipeline/syndicate/syndicate_header.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BasePipelineHeader, PipelineAppModel, Template) {
	var CmHeader = BasePipelineHeader.extend({
		options: {},
		template: Template,
		events: function() { return _.extend({}, BasePipelineHeader.prototype.events, {

		})}
	});
	return CmHeader;
});