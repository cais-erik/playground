define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/lists/base_list',
	'collections/admin/reports/near_term_conversion_clients'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseList, NearTermConversionClients) {
	var ActiveClients = BaseList.extend({
		options: {},
		collection: NearTermConversionClients,
		events: {},
		gridOptions: {
			columns: [
				{title: "Client", field: "name", width: "350px"},
				{title: "Expected Conversion Date", field: "expectedConversionDate", template: function(data) {
					if (data.expectedConversionDate) {
						return kendo.toString(new Date(data.expectedConversionDate), "MM/dd/yyyy" );
					}
					else {
						return 'No date provided';
					}
				}}
			]
		}

	});
	return ActiveClients;
});