/*
Holdings view, renders a holding collection in a kendo grid
TODO: move data handling away from kendo and into collection, see URL attribute of this view
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/accounts/content/holdings.html',
	'models/authed_user',
	'views/assets/confirm_dialog',
	'thirdparty/jquery.PrintArea',
	'thirdparty/moment-timezone-with-data.min'
], function ($, _, Backbone, Vm, Handlebars, Template, AuthUser, ConfirmDialog, moment) {
	var view = Backbone.View.extend({
		attributes: {
			'class': 'holdings-view',
		},
		initialize: function() {
			if (!this.options.node) {
				this.remove();
				return;
			}
			this.treeNode = this.options.node;
			this.render();
			$(window).on('resize', this.onWindowResize);
		},
		holdingsUrl: null,
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.initGrid();
			this.refreshGrid();
			this.onWindowResize();
		},
		events: {
			'click .print-icon': 'print',
			'click .excel-icon': 'exportExcel',
			'click .delete-holding': 'deleteHolding'
		},
		refreshGrid: function() {
			// map the holdings URL to the correct resource;
			switch(this.treeNode.categoryName) {
				case "CAIS":
                    this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldings';
                    break;
				case 'Firm':
					this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldingsByClient?selectedId=' + this.treeNode.clientId;
					break;
				case "Team":
                    this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldingsByTeam?selectedId=' + this.treeNode.advisorTeamId;
                    break;
                case "Client":
                    this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldingsByInvestorForPerformance?selectedId=' + this.treeNode.investorId;
                    break;
                case "Advisor":
                    this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldingsByAdvisor?selectedId=' + this.treeNode.userId;
                    break;
                case "Entity":
                    this.holdingsGrid.dataSource.transport.options.read.url = '/getHoldingsByInvestmentEntity?selectedId=' + this.treeNode.investmentEntityId;
                    break;
			}
			if (this.holdingsGrid.dataSource.page() !== 1) this.holdingsGrid.dataSource.page(1);
			this.holdingsGrid.dataSource.read();            
		},
		initGrid: function() {
			var that = this;
			this.holdingsGrid = this.$('.holdings-grid').kendoGrid({
				autoBind: false,
				columns: this.getColumns(),
				dataSource: {
					aggregate: [{ field: "value", aggregate: "sum" }],
					transport: {
						read:  {
							url: "/getHoldings",
							dataType: 'json'
						}
					},
					error: function() {
						Alert('There was an error while fetching the data from the server', 'OK');
					},
					schema: {
						data: 'msg.holdings',
						total: 'msg.total'
					},
					sort: { field: "entityName", dir: "desc" }
				},
				groupable: true,
				sortable: true,
				filterable: true,
				pageable: {
					pageSize: 50,
					pageSizes: [50, 100, 200]
				},
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = $(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No holdings found for "' + that.options.node.displayName + '".</b></td></tr>');
						$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				},
				columnMenu: {
					columns: true,
					sortable: true
				}
			}).data("kendoGrid");
		},
		onWindowResize: _.debounce(function() {
			// util.js
        	resizeGrid('.holdings-grid');
		}, 300),
		getColumns: function() {
			var columns = [
				{ title: "Transaction ID", field: "caisId", width: 110 },
				{ title: "Fund", field: "fund" },
				{ title: "Advisor Name", field: "advisorName", hidden: true },
				{ title: "Investor Name", field: "investorName", hidden: true },
				{ title: "Investment Entity", field: "entityName" },
				{ title: "Purchase Date", field: "purchaseDate", width: 110, template: "#= moment(purchaseDate).tz('America/New_York').format('MM/DD/YYYY') #", type: 'date'},
				{ title: "Purchase Price", field: "purchasePrice", format: "{0:C2}", width: 130 },
				{ title: "Value", field: "value", format: "{0:C2}", width: 130, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C') #", groupFooterTemplate: "#= kendo.toString(sum, 'C') #" },
				{ title: "Change", field: "change", hidden: true, format: "{0:C2}", width: 110},
				{ title: "Nav", field: "nav", format: "{0:C4}", width: 80},
                { title: "Shares", field: "closingShareBalance", format: "{0:N4}", width: 80 },
				{ title: "NAV Date", field: "navDate", width: 100, template: "#= moment(navDate).tz('America/New_York').format('MM/DD/YYYY') #", type: 'date' },
				{ title: "Class", field: "className", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, hidden: true },
				{ title: "MTD", field: "mtdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 },
				{ title: "YTD", field: "ytdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 },
				{ title: "ITD", field: "itdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 }
			];
			var deleteColumn = { title: "", attributes: { style: "text-align: center;" }, template: function(data) {
				if (data.id) return '<a class="delete-holding" data-transactionid="' + data.id + '" href="#"><i class="icon-cancel-circled"></i></a>';
				else return '';
			}, headerAttributes: { style: "text-align: center;" }, width: 40 };

			// CAIS employee gets the delete button
			if (AuthUser.get('caisemployee')) columns.push(deleteColumn);

			return columns;
		},
		deleteHolding: function(e) {
			var elem = $(e.currentTarget);
			var row = elem.parents('tr');
			var transactionId = elem.data('transactionid');
			Vm.create(this, 'ConfDialog', ConfirmDialog, {
				message: 'Are you sure you would like to delete this holding?',
				confirmCallback: _.bind(function() {
					$.ajax({
						url: '/api/holdings/cais_position/' + transactionId,
						type: 'DELETE',
						success: function(resp) {
							row.fadeOut('slow', function() { row.remove(); });
						},
						error: function(resp) {
							try {
								new Alert(JSON.parse(resp.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a server error while deleting this holding.', 'OK');
							}
						}
					});

				}, this)
			});
		},
		print: function() {
			var wrapper = $("<div id='grid-print-wrapper'/>");
			var tableHeader = this.$(".holdings-grid .k-grid-header").clone();
			var tableBody = this.$(".holdings-grid .k-grid-content").clone();
			tableHeader.find("th").css("padding", "4px");
			tableBody.find("td").css("padding", "4px");
			tableBody.find("tr").first().prepend(tableHeader.find("tr").first());
			wrapper.append(tableBody.removeAttr("style").css("font-size", "10px").css("overflow", "visible"));
			wrapper.printArea();
		},
		exportExcel: function() {
			var data = this.holdingsGrid.dataSource.data();
			var param = {};
			function getTitle() {
				return $('.category-title').text()
				.replace('Firm : ', '')
				.replace('Client : ', '')
				.replace('Team : ', '')
				.replace('Advisor : ', '')
				.replace('Entity : ', '')
				.replace(' ', '_');
			}
			if (!data.length) {
				Alert('No holdings to export.', 'OK');
				return;   
			}

			param.fileName = getTitle() + "_holdings.xlsx";
			param.sheetName = "sheet1";
			param.builderName = "holdingsSheetBuilder";
			param.data = JSON.stringify(data);
			$.download('/exportJsonToExcel', param, 'POST');
		},
		clean: function() {
			// if the kendo grid READ ajax event hasn't finished, the widgets inside the grid throw JS errors once the READ event completes
			try {
				// so destroy the grid widget
				this.holdingsGrid.destroy();
			} catch(e) {
				// and fail silently, but with honor
			}
			$(window).off('resize', this.onWindowResize);
		}
	});
	return view;
});
