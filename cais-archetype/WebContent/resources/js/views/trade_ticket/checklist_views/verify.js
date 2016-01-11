define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'collections/trade_ticket/task_collections',
	'text!templates/trade_ticket/checklist/verify.html',
	'text!templates/trade_ticket/checklist/fund_table_row.html',
	'amd/backbone/Backbone.CollectionBinder'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseChecklistContent, TaskCollections, Template, RowTemplate) {
	var VerifyTask = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'verify-tasks',
		template: Template,
		collection: TaskCollections.funds,
		title: 'Verify Documents',
		events: {
			'click .add-button': 'createNew',
			'click .remove-button': 'removeFund',
			'click #updateDocs': 'updateDocs',
		},
		preInit: function() {
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(_.bind(this.getRowTemplate, this), "name");
			this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			this.listenTo(Events, 'funds:synced', this.reinit);
			this.collection.syncWithFund();
		},
		reinit: function() {
			this._collectionBinder.bind(this.collection, this.$('tbody'));
			kendo.init(this.$el);
			this.$el.kendoValidator();
			if (!this.collection.canUserCreateNew()) this.$('.add-button, .remove-button').remove();
		},
		postRender: function() {},
		rowTemplate: Handlebars.compile(RowTemplate),
		getRowTemplate: function(data) {
			return this.rowTemplate(data.model);
		},
		createNew: function() {
			var that =  this;
			TaskCollections.legalNameList.fetchWithShareClasses({
				success: function() {
					var model = new that.collection.model(_.clone(TaskCollections.legalNameList.at(0).attributes));
					model.set({
						'isNew': true,
						'minimumInvestment': 50000,
						'canCreateNew': true,
						'legalNameList': TaskCollections.legalNameList.toJSON(),
						'investmentDate': TaskCollections.funds.at(TaskCollections.funds.length - 1).get('investmentDate')
					});
					that.collection.add(model);
					kendo.init(that.$el);
				},
				error: function() {
					new Alert('There was an error while retrieving the list of funds.', 'OK');
				}
			});
		},
		removeFund: function(e) {
			var that = this;
			var elem = $(e.currentTarget);
			var row = elem.parents('tr');
			var id = parseInt(row.attr('id'));
			var model = this.collection.findWhere({'productId': id});
			row.fadeOut('fast', function() {
				that.collection.remove(model);
			});
		},
		updateDocs: function(options) {
			var that = this;
			var defaults = {
				success: _.bind(this.closeTask, this),
				error: function() {
					Alert('These funds could not be saved.', 'OK');
				}
			};
			options = $.extend(defaults, options);
			if (!this.$el.data('kendoValidator').validate()) return;
			this.collection.saveFunds(options);
		},
		clean: function() {
			this.stopListening();
		}
	});
	return VerifyTask;
});