/*
Documents view, renders lists of documents
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/accounts/documents/documents.html',
	'text!templates/accounts/documents/statements_select.html',
	'collections/documents/entity_statements',
	'collections/documents/entity_subscription_documents'
], function ($, _, Backbone, Vm, Handlebars, Template, StatementsTemplate, EntityStatements, EntitySubscriptionDocuments) {
	var view = Backbone.View.extend({
		attributes: {
			'class': 'listview'
		},
		entitySubscriptionDocuments: null,
		initialize: function() {
			if (!this.options.node) {
				this.remove();
				return;
			}
			// setup subdocument collections
			this.treeNode = this.options.node;
			this.entitySubscriptionDocuments = new EntitySubscriptionDocuments();
			this.entitySubscriptionDocuments.params.investorId = this.treeNode.parent().parent().investorId;
			this.entitySubscriptionDocuments.setUrl();
			
			// setup statement document collections
			this.collection = new EntityStatements();
			this.collection.params.investmentEntityId = this.treeNode.investmentEntityId;
			this.collection.setUrl();

			// setup view listeners
			this.listenTo(this.collection, 'sync', this.refresh);
			this.listenTo(this.entitySubscriptionDocuments, 'sync', this.refreshSubDocList);
			$(window).on('resize', this.onWindowResize);

			this.render();

			// fetch the collections
			this.collection.fetch({
				error: function() {
					Alert('Could not get statements for this entity.', 'OK');
				}
			});
			this.entitySubscriptionDocuments.fetch({
				error: function() {
					Alert('Could not get subscription documents for this entity.', 'OK');
				}
			});
		},
		render: function() {
			var template = Handlebars.compile(Template);
			Server.caisUser.getLocalSessionInfo(_.bind(function(user) {
				var context = {user: user, dates: this.getAvailableDates()};
				this.$el.html(template(context));
				this.$('.tabstrip').kendoTabStrip({activate: this.onWindowResize});
				this.initList();
				this.initSubDocList();
			}, this));
			this.onWindowResize();
		},
		events: {
			'change [name=year]': 'onYearChange',
			'click .download-statement': 'downloadStatement',
			'click .upload-document': 'showUploadView'
		},
		onYearChange: function(e) {
		//	this.documentsGrid.dataSource.data([]); 
			this.collection.setActiveYear($(e.target).val());
			this.collection.fetch({
				success: _.bind(this.refresh, this),
				error: function() {
					Alert('Could not get statements for this entity.', 'OK');
				}
			});
		},
		initSubDocList: function() {
			var that = this;
			this.subDocList = this.$('.subscription-doc-list').kendoGrid({
				columns: [
					{ title: "Name", field: "documentName", template: this.renderDocumentName, width: 250},
					// { title: "Description", field: "documentDescription", width: 300},
					{ title: "Account Number", field: "accountNumber", width: 150},
					{ title: "Entity", width: 200, field: "entityName"},
					{ title: "Type", field: "categoryName" },
					{ title: "Product", field: "productName", width: 270 },
					{ title: "Uploaded", field: "createDate",
						template: function(data) {
							if (data.createDate) return kendo.toString(kendo.parseDate(data.createDate, "yyyy-MM-dd"), 'MM/dd/yyyy');
							return '';
						}
					}
				],
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {},
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$(".subscription-doc-list").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No documents found for "'+ that.options.node.displayName + '".</b></td></tr>');
						that.$(".subscription-doc-list").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data("kendoGrid");
		},
		initList: function() {
			var that = this;
			this.documentsGrid = this.$('.document-list').kendoGrid({
				columns: [
					{ title: "Product Name", field: "fundName"},
					{ title: "Statements", field: "", width: 300, template: that.renderStatements},
					{ title: "K1", field: "K1", width: 200, template: that.renderK1, attributes: {'style': 'text-align:center;'}},
					{ title: "Audited Financial Statement", width: 200, field: "K1", template: that.renderAfs, attributes: {'style': 'text-align:center;'}}
				],
				sortable: true,
				columnMenu: {
					columns: true,
					filterable: false,
					sortable: true
				},
				dataSource: {},
				dataBound: function () {
					that.$('[data-role=dropdownlist]').kendoDropDownList();
					//Get the number of Columns in the grid
					var colCount = that.$(".document-list").find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No documents found for "'+ that.options.node.displayName + '".</b></td></tr>');
						that.$(".document-list").find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data("kendoGrid");
			this.refresh();
		},
		refresh: function() {
			this.documentsGrid.dataSource.data(this.collection.toJSON());
			this.$('[data-role=dropdownlist]').kendoDropDownList();
		},
		refreshSubDocList: function() {
			this.subDocList.dataSource.data(this.entitySubscriptionDocuments.toJSON());
		},
		downloadStatement: function(e) {
			var docId = $(e.currentTarget).parents('tr').find('[name=statementId]').val();
			window.open('/api/document/download?docId=' + docId);
		},
		renderDocumentName: function(data) {
			return '<a class="document-link" target="_blank" href="/api/document/download?docId=' + data.documentId + '">' + data.documentName + '</a>';
		},
		renderK1: function(data) {
			var k1 = data.toJSON().K1;
			if ($.isEmptyObject(k1)) {
				return 'No K1 document available';
			} else {
				return '<a href="/api/document/download?docId=' + k1.documentId + '" class="command-button-black download-doc" id="' + k1.documentId +'" target="_blank">Download</a>';
			}
		},
		renderAfs: function(data) {
			var auditFinancial = data.toJSON().auditFinancial;
			if ($.isEmptyObject(auditFinancial)) {
				return 'No audited financial statement';
			} else {
				return '<a href="/api/document/download?docId=' + auditFinancial.documentId + '" class="command-button-black download-doc" id="' + auditFinancial.documentId +'" target="_blank">Download</a>';
			}
		},
		renderStatements: function(data) {
			var template = Handlebars.compile(StatementsTemplate);
			var context = data.toJSON();
			context.activeYear = $('.title-header [name=year]').val();
			return template(context);
		},
		showUploadView: function(e) {
			e.preventDefault();
			var that = this;
			require(['views/accounts/content_views/documents/add_document'], function(AddDocumentsView) {
				var uploaderView = Vm.create(that, 'AddDocumentsView', AddDocumentsView, {investmentEntityId: that.treeNode.investmentEntityId});
				that.listenTo(uploaderView, 'fileUploaded', _.bind(that.collection.fetch, that.collection));
				that.$el.append(uploaderView.$el);
			});
		},
		getAvailableDates: function() {
			var currentYear = new Date().getFullYear();
			var years = [];
			var startYear = 2012;
			while ( startYear <= currentYear ) {
				years.push(currentYear--);
			}
			return years;
		},
		onWindowResize: _.debounce(function() {
			// util.js
			resizeGrid('.subscription-doc-list');
		}, 300),
	});
	return view;
});