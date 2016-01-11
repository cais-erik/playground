define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/lists/base_list',
	'collections/admin/reports/active_clients'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseList, ActiveClientsCollection) {
	var ActiveClients = BaseList.extend({
		options: {},
		collection: ActiveClientsCollection,
		events: {},
		gridOptions: {
			columns: [
				{title: "Client", field: "name", width: "350px"},
				{title: "City", field: "billingcity"},
				{title: "State", field: "billingState"},
				{title: "Products", field: "products"}
			]
		}

	});
	return ActiveClients;
});