/*
Trade Ticket Subscription View
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'collections/trade_ticket/task_collections'
], function ($, _, Backbone, Vm, Events, TaskCollections) {
	var RootEvents = Backbone.View.extend({
		className: 'events-view',
		initialize: function() {
			TaskCollections.events.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var that = this;
			this.$el.kendoGrid({
                dataSource: {
                        data: TaskCollections.events.toJSON()
                },
                columns: [
                    { title: "Date", field: "date", width: 100, template: '#= kendo.toString(new Date(date), "MM/dd/yyyy" ) #' },
                    { title: "Transaction ID", field: "transactionId", width: 100 },
                    { title: "Name", field: "userName", width: 140 },
                    { title: "Event", field: "event", width: 200 },
                    { title: "Details", field: "details" }
                ],
                sortable: true,
                groupable: false,
                filterable: false,
                dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No events.</b></td></tr>');
						that.$('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				},
                height: 200
            });
            var gridElement = this.$el;
	        var dataArea = gridElement.find(".k-grid-content");
	        var newHeight = gridElement.parent().innerHeight() - 2;
	        var diff = gridElement.innerHeight() - dataArea.innerHeight();
	        gridElement.height(newHeight);
	        dataArea.height(newHeight - 25);
		}
	});
	return RootEvents;
});