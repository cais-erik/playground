define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/lists/base_list',
	'collections/admin/reports/data_tracking'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseList, DataTrackingCollection) {
	var DataTracking = BaseList.extend({
		options: {},
		collection: DataTrackingCollection,
		events: {},
		gridOptions: {
			columns: [
				{title: "Account Name", field: "name"},
				{title: "Point - BD", field: "pointBd"},
				{title: "Point - AI", field: "pointAi"},
				{title: "Intro Call", field: "introCall", template: function(data) {
					if (data.introCall) {
						return kendo.toString(new Date(data.introCall), "MM/dd/yyyy" );
					}
					else {
						return 'None';
					}
				}},
				{title: "Intro - Mtg", field: "introMtg", template: function(data) {
					if (data.introMtg) {
						return kendo.toString(new Date(data.introMtg), "MM/dd/yyyy" );
					}
					else {
						return 'None';
					}
				}},
				{title: "Demo", field: "demo", template: function(data) {
					if (data.demo) {
						return kendo.toString(new Date(data.demo), "MM/dd/yyyy" );
					}
					else {
						return 'None';
					}
				}},
				{title: "TA", field: "ta", template: function(data) {
					if (data.ta) {
						return kendo.toString(new Date(data.ta), "MM/dd/yyyy" );
					}
					else {
						return 'None';
					}
				}}
			]
		}
	});
	return DataTracking;
});