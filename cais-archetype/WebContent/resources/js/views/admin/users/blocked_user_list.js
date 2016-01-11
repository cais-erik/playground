/*
List view, renders lists of blocked users
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/accounts/content/list.html',
	'collections/users/blocked_users',
	'views/assets/confirm_dialog'
], function ($, _, Backbone, Vm, Handlebars, Template, BlockedUsers, ConfDialog) {
	var BlockedUserList = Backbone.View.extend({
		attributes: {
			'class': 'listview'
		},
		collection: BlockedUsers,
		initialize: function() {
			this.collection = new this.collection();
			this.collection.fetch({
				success: _.bind(this.render, this)
			});
			$(window).on('resize', this.onWindowResize);
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.initList();
			this.onWindowResize();
		},
		events: {
			'click .clientFilter span': 'filterList',
			'click .unblock-user': 'unblockUser'
		},
		initList: function() {
			this.clientsGrid = this.$('#listGrid').kendoGrid({
				columns: [
					{ title: "First Name", field: "firstName"},
					{ title: "Last Name", field: "lastName"},
					{ title: "Username", field: "userName"},
					{ title: "Email", field: "address.email"},
					//{ title: "Last Login",  width: 110, field: "lastLogin", template: '#= kendo.toString(new Date(lastLogin), "MM/dd/yyyy" ) #'},
					{ title: "Unblock", width: 110, template: '<a href="/" data-userId="#= userId #" class="unblock-user command-button">Unblock</a>'}
				],
				sortable: true,
				dataSource: {
					data: this.collection.toJSON()
				},
				dataBound: function () {
					var grid = this;
					var colCount = grid.columns.length;
					//If There are no results place an indicator row
					if (grid.dataSource._view.length === 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No users found.</b></td></tr>');
						$(grid.tbody).append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data("kendoGrid");
		},
		unblockUser: function(e) {
			e.preventDefault();
			var elem = $(e.currentTarget);
			var id = parseInt(elem.attr('data-userId'));
			var model = this.collection.findWhere({'userId': id});
			var row = elem.parents('tr');
			var view = this;	
			var origColor = row.css('color');
			row.css('color', 'red');

			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: 'Are you sure you would like to unblock ' + model.get('firstName') + ' ' + model.get('lastName') +'? ' + model.get('firstName') +
					' will be emailed with instructions to reset his/her password.',
				confirmCallback: function() {
					model.unblockUser({
						success: function(model) {
							view.collection.remove(model);
							row.fadeOut('slow', function() {
								view.clientsGrid.removeRow(row);	
							});
						},
						error: function(response) {
							Alert('This user could not be unblocked.', 'OK');
							row.css('color', '#666');
						}
					});
				},
				cancelCallback: function() {
					row.css('color', origColor);
				}
			});
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
				this.clientsGrid.dataSource.filter({ field: "lastName", operator: "startswith", value: selectedItem.text()});
			}
		},
		onWindowResize: _.debounce(function() {
			// util.js
        	resizeGrid('#listGrid');
		}, 300),
	});
	return BlockedUserList;
});
