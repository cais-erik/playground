define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/accounts/firm_view.html',
	'collections/firm_clients',
	'handlebars'
], function ($, _, Backbone, Template, FirmClients, Handlebars) {
	var firmView = Backbone.View.extend({
		collection: FirmClients,
		className: '.grid-wrapper',
		initialize: function() {
			this.collection.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var context = this.collection.toJSON();	
			if (!context.length) {
				context = [{
					name: 'No clients to display.',
					investorId: null
				}]
			}
			this.kendoGrid = this.$el.kendoGrid({
				dataSource: {
					data: context
				},
				sortable: {
					mode: "single",
					allowUnsort: false
				},
				filterable: true,
				columns: this.accountColumns
			}); //resizeClientGrid());

		},
		//TODO: clean this mess up
		accountColumns:[
				{ title: "<label class='nolabel_check column_check'onclick=''></label>", template: "<label class='nolabel_check' onclick=''></label>", width: 35, sortable: false, filterable: false },
				{ title: "Client Name", template: "<div class='pointer client-info' data-entityId='${ investorId }'>${ name }</div>" }
		]
	});
	return firmView;
});