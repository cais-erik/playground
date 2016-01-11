define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/shareholder/sub_views/base_sh_subview',
	'text!templates/shareholder/clients.html',
	// 'collections/shareholders/shareholder_letters',
	// 'amd/backbone/Backbone.CollectionBinder',
	// 'amd/backbone/Backbone.ModelBinder',
	// 'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseShSubview, Template) {
	var Clients = BaseShSubview.extend({
		template: Handlebars.compile(Template),
		className: 'clients subview',
		title: 'Clients',
		preRender: function(callback) {
			this.render();
		},
		events: {
		}
	});
	return Clients;
});