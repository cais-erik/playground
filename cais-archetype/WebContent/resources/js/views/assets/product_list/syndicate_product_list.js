define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'views/assets/product_list/product_list'
], function ($, _, Backbone, Vm, Events, ProductList) {
	var CapMarketsProducts = ProductList.extend({
		options: {
			canTransact: true,
			columns: [
				{title: "Asset Class", field: "assetClass", width: "100px", template: '#= assetClass # <span class="publish-status-#= data.published #">Unpublished<span>'},
				{title: "Issuer", field: "name"},
				{title: "Type", field: "offeringType", width: "75px"},
				{title: "Product", field: "productType"},
				{title: "Industry", field: "industryGroup"},
				{title: "Est. Deal Value", width: 120, field: "approxSize", format: "{0:c0}"},
				{title: "Pricing Range", field: "priceRange", sortable: false, template: function(data) {
					return data.assetClass === 'Preferred Stock' || data.assetClass === 'Bond' ? 'N/A' : data.priceRange || '';
				}},
				{title: "Exp. Timing", field: "expectedTiming", template: '#= kendo.toString(new Date(expectedTiming), "MM/dd/yyyy" ) #'},
				{title: "Order Period", width: 143, field: "orderPeriodEndDate", template: function(data) {
						if (data.orderPeriodEndDate) return kendo.toString(new Date(data.orderPeriodEndDate), "g" );
						else return '-';
					}
				},
				{title: "Prospectus", field: "prospectusId", width: 80, sortable: false, attributes: {style:'text-align:center;'}, template: function(data) {
						if (data.prospectusId) return '<a class="download-prospectus icon-download" target="_blank" href="/api/document/download?docId=' + data.prospectusId + '">&nbsp;</a>'
						else return 'N/A';
					}
				},
				{ title: 'Orders', width: 78, field: 'saveButton', template: function(data) {
						if (data.editable === 'Edit') {
							return '<a class="k-button k-button-icontext k-grid-save-changes edit-order" href="/investment-pipeline/cm/grid/0/' + data.internalCusip + '">Edit</a>';
						} else if (data.editable === 'Expire') {
							return '<div style="text-align: center;">Closed</div>';
						} else {
							return '<a class="k-button k-button-icontext k-grid-save-changes place-order" href="">Order</a>';
						}
					}
				}
			],
			dataBound: function () {
				var grid = this;
				grid.tbody.find('>tr').removeClass('last-child').each(function(){
					var dataItem = grid.dataItem(this);
					$(this).addClass('published-' + dataItem.published).addClass('expired-' + dataItem.expired).addClass('offer-row');
					$(this).attr('id', 'offer-' + dataItem.internalCusip);

				});
				grid.tbody.find('>tr:last-child').addClass('last-child');

				var colCount = grid.columns.length;
				//If There are no results place an indicator row
				if (grid.dataSource._view.length === 0) {
					var row = $('<tr class="kendo-data-row"><td colspan="' +
							colCount +
							'" style="text-align:center; padding: 25px 0"><b>No offerings found.</b></td></tr>');
					$(grid.tbody).append(row);
					row.hide().fadeIn('500');
				}
			}
		}
	});
	return CapMarketsProducts;
});