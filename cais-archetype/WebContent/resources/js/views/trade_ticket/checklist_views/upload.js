/*
Base Checklist Content View
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'views/assets/big_loader',
	'collections/trade_ticket/task_collections',
	'text!templates/trade_ticket/checklist/upload.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseChecklistContent, BigLoader, TransactionTasks, Template) {
	var UploadTask = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'upload-tasks',
		template: Template,
		collection: TransactionTasks.docsReceived,
		title: 'Upload Documents',
		events: {
			'click .delete-button': 'deleteDocument',
			'change #requiredDocsUploadedConfirmation': 'confChangeHandler',
			'click #sendToAdministrator': 'sendToAdministrator',
			'click .download-doc': 'downloadSingleDoc'
		},
		render: function() {
			this.context.collection = this.collection.toJSON();
			this.context.entityDocs = this.collection.entityDocs.toJSON();
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.context));
			if (this.postRender) this.postRender();
		},
		postRender: function() {
			var that = this;
			this.$("#docs").kendoUpload({
				select: function verifySize(e) {
					var files = e.files;
					$.each(files, function () {
						if (this.size > 10240000) {
							new Alert("Uploaded File Cannot Exceed 10mb", "OK");
							this.preventDefault();
						} else if (this.extension.toLowerCase() != ".pdf" && this.extension.toLowerCase() != ".doc" && this.extension.toLowerCase() != ".docx") {
							new Alert("The only acceptable file extensions are .pdf, .doc or .docx", "OK");
							this.preventDefault();
						}
					});
				},
				async: {
					saveUrl: '/' + this.model.get('subscriptionId') + '/uploadTransactionDocs',
					removeUrl: "remove",
					autoUpload: true,
				},
				localization: {
					select: 'SELECT'
				},
				complete: function removeUploadedFilesList(e) {
					$("#upload-docs .k-upload-files").remove();
				},
				//select: attachClickHandler, 
				success: function (e) {
					if (e.response.status == 'success') {
						var fileNames = "";
						that.$(".uploaded-documents .doc-name").each(function () {
							fileNames += " " + $(this).text();
						});
						that.model.insertTransactionEventLog("Upload Documents", "User uploaded the following files: " + fileNames);
						that.collection.fetch({
							success: _.bind(that.render, that)
						});
					} else {
						var alert = new Alert("Uploaded File Cannot Exceed 10mb", "OK");
					}
				}
			});
		},
		confChangeHandler: function(e) {
			if (!this.$('.documents-list').children().length) {
				Alert('Please upload a document before continuing.', 'OK');
				$(e.target).prop('checked', false);
				return;
			}
			var checked = $(e.target).prop('checked');
			if (checked) {
				this.$("#sendToAdministrator").show();
			} else{
				this.$("#sendToAdministrator").hide();
			}
		},
		sendToAdministrator: function() {
			var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Sending documents...'});
			var addedDocs = this.$('[name="added-docs"]:checked');
			var addedDocIds = [];
			addedDocs.each(function() {
				addedDocIds.push($(this).val());
			});
			this.model.addedDocIds = addedDocIds;
			this.listenToOnce(Events, 'task:approved task:error', function() {
				loader.closeLoader();
			});
			this.closeTask();
		},
		deleteDocument: function(e) {
			var parent = $(e.currentTarget).parents('li');
			var id = $(e.currentTarget).attr('data-deletedocid');
			this.collection.deleteDocument(id, {
				success: function() {
					parent.fadeOut('slow', function(){
						$(this).remove();
					});
				},
				error: function() {

				}
			});
		}
	});
	return UploadTask;
});