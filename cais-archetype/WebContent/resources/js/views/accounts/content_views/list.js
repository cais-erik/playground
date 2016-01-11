/*
List view, renders lists of investors
TODO: move data handling away from kendo and into collection
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/content/list.html'
], function ($, _, Backbone, Handlebars, Template) {
	var view = Backbone.View.extend({
		attributes: {
			'class': 'listview'
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
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.initList();
			this.onWindowResize();
		},
		events: {
			'click .clientFilter span': 'filterList'
		},
		initList: function() {
			var that = this;      
			this.clientsGrid = this.$("#listGrid").kendoGrid({
				columns: [
					{ title: "Client Name", field: "name", width: 240, template: "<div class='pointer client-info'><u>${ name }</u></div>", footerTemplate: "#= kendo.toString(count, 'n0') # clients", groupFooterTemplate: "#= kendo.toString(count, 'n0') # clients"},
					// { title: "Total Assets" },
					{ title: "AI Assets", field: "AIAssets", width: 200, format: "{0:C2}", footerTemplate: "#= kendo.toString(sum, 'C') #", groupFooterTemplate: "#= kendo.toString(sum, 'C') #" },
					// { title: "CM Assets" },
					// { title: "SP Assets" },
					{ title: "State", field: "state", width: 110},
					{ }
				],
				groupable: false,
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {
					aggregate: [
						{ field: "AIAssets", aggregate: "sum" },
						{ field: "name", aggregate: "count" }
					],
				},
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".k-grid").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No clients found for "'+ that.options.node.displayName + '".</b></td></tr>');
						that.$(".k-grid").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data("kendoGrid");          

			this.$("#listGrid").on("click", ".client-info", function (e) {
				var options = {};
				options.viewArray = that.clientsGrid.dataSource.data();
				options.selectedClient = that.clientsGrid.dataItem($(e.currentTarget).parents("tr"))
				options.allowNavigation = false;

				var dialog = new Dialog("client-detail", options);
			});

			switch (this.treeNode.categoryName) {
				case "CAIS":
					Server.getAllInvestors({}, function (response) {
						that.clientsGrid.dataSource.data(response);
						that.clientsGrid.refresh();
					});
					break;
				case "Firm":
					Server.getAllInvestorsByClient({ id: this.treeNode.clientId }, function (response) {
						that.clientsGrid.dataSource.data(response);
						that.clientsGrid.refresh();
					});
					break;
				case "Team":
					Server.getAllInvestorsByTeam({ teamId: this.treeNode.advisorTeamId }, function (response) {
						that.clientsGrid.dataSource.data(response);
						that.clientsGrid.refresh();
					});
					break;
				case "Advisor":
					Server.getAllInvestorsByUser({ selectedId: this.treeNode.userId, advisorTeamId: this.treeNode.advisorTeamId }, function (response) {
						that.clientsGrid.dataSource.data(response);
						that.clientsGrid.refresh();
					});
					break;
			}
		},
		filterList: function(e) {
			// handler for clicking on an item in the clientList filters along the top
			// find out which item was clicked, and filter the dataSource
			var selectedItem = $(e.currentTarget);
			this.$(".clientFilter .active").removeClass("active");
			selectedItem.addClass("active");

			if (selectedItem.text() == "All") {
				this.clientsGrid.dataSource.filter([]);
			} else {
				this.clientsGrid.dataSource.filter({ field: "name", operator: "startswith", value: selectedItem.text()});
			}
		},
		onWindowResize: _.debounce(function() {
			// util.js
        	resizeGrid('#listGrid');
		}, 300)
	});
	return view;
});
