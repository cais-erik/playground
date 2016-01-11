/*
PresentTasks checklist view
extends BaseChecklistContent 
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/trade_ticket/task_collections',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'views/assets/confirm_dialog',
	'views/assets/big_loader',
	'text!templates/trade_ticket/checklist/present.html'
], function ($, _, Backbone, Vm, Events, Handlebars, TaskCollections, BaseChecklistContent, ConfDialog, BigLoader, Template) {
	var PresentTasks = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'present-tasks',
		title: 'Present Documents',
		template: Template,
		teamMemberTemplate: '{{#.}}<option value="{{emailaddress}}" data-firmdid="{{firmId}}">{{name}}</option>{{/.}}',
		collection: TaskCollections.docsPresented,
		events: {
			'click #downloaddocs': 'downloadDocs',
			'click #senddocs': 'sendDocs',
			'click #markComplete': 'closeTask',
			'click .download-doc': 'downloadSingleDoc'
		},
		preInit: function() {
			this.listenTo(TaskCollections.teamMembers, 'sync', this.renderTeamMembers);
		},
		postRender: function() {
			TaskCollections.teamMembers.reset().fetch();
			this.$("#additional-files").kendoUpload({
				showFileList: false,
				success: _.bind(this.onFileUpload, this),
				async: {
					saveUrl: '/uploadfile?tranId=' + this.model.params.transactionId,
					removeUrl: "remove",
					autoUpload: true
				}
			});
			this.$("#additional-files").next("span").text("Upload additional files ...");
			this.$('#subject').val('CAIS Subscription Documents for ' + this.model.get('entityName'));

//			if (this.model.get('isAddendumRequired') === 1) this.showAddendumPrompt(); // BAD
		},
		showAddendumPrompt: function() {
			var that = this;
			Vm.create(this, 'AddendumPrompt', ConfDialog, {
				message: 'Is this the first investment for this entity with Fidelity? An addendum form will be generated if you select yes.',
				confirm_text: 'Yes',
				cancel_text: 'No',
				cancelCallback: function() {
					that.model.setAddendum({
						value: false,
						success: function() {
							that.model.set('isAddendumRequired', 0);
						},
						error: function(response) {
							try {
								new Alert(JSON.parse(response.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a problem confirming this entity had an addendum. Please contact support.', 'OK');
							}
						}
					});
				},
				confirmCallback: function() {
					var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Retrieving addendum document...' });
					that.model.setAddendum({
						value: true,
						success: function(response) {
							that.$(".docs-presentedList").append('<li><label><input type="checkbox" class="doc-selector" style="margin-top: -1px" data-docid="'+ response.id + '" docname="' + response.name + '" checked><img class="download-doc" data-docid="'+ response.id + '" style="margin-top: 2px" src="/resources/assets/icons/pdf-icon.png" alt="doc" /><span> '+ response.name + '<span></label></li>');
							loader.closeLoader();
							that.model.set('isAddendumRequired', 0);
						},
						error: function(response) {
							loader.closeLoader();
							try {
								new Alert(JSON.parse(response.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a problem retrieving the addendum. Please contact support.', 'OK');
							}
						}
					});
				}
			});
		},
		onFileUpload: function(e) {
			if (e.response.status == "success") {
				var docId = e.response.msg;
				for (var i in e.files) {
					this.$(".docs-presentedList").append('<li><label><input type="checkbox" class="doc-selector" style="margin-top: -1px" data-docid="'+ docId + '" docname="' + e.files[i].name + '" checked><img class="download-doc" data-docid="'+ docId + '" style="margin-top: 2px" src="/resources/assets/icons/pdf-icon.png" alt="doc" /><span> '+ e.files[i].name + '<span></label></li>');
				}
			} else {
				var alert = new Alert("Uploaded File Cannot Exceed 10mb", "OK");
			}
		},
		renderTeamMembers: function() {
			var template = Handlebars.compile(this.teamMemberTemplate);
			this.$('[name=fromaddress]').html(template(TaskCollections.teamMembers.toJSON()));
			kendo.init(this.$el);
		},
		downloadDocs: function() {
			var documentIds = [];
			var that = this;
			this.$(".doc-selector:checked").each(function () {
				documentIds.push($(this).attr('data-docid'));
			});
			this.model.downloadDocuments(documentIds);
			this.model.insertTransactionEventLog("Documents Presented To Investor Downloaded", "User downloaded the documents presented to investor");

			setTimeout(function() {
				that.$('#downloaddocs').fadeOut('fast', function() {
					that.$('#markComplete').fadeIn('slow');
				});
			}, 500);
		},
		sendDocs: function() {
			var status = true;
			var that = this;
			var toAddress = this.$('#toaddress').val();
			var fromAddress = this.$('[name=fromaddress]').val();
			var attachmentPwd = this.$("#attachmentPwd").val();

			if (!fromAddress) {
				var alert = new Alert("Please select a valid From email address", "OK");
				return;
			}
			if (!attachmentPwd) {
				var alert = new Alert("Please provide a password", "OK");
				return;
			}
			if (!toAddress || (toAddress.indexOf(',') == -1 && !validateEmail(toAddress))) {
				var alert = new Alert("Please enter a valid To email address", "OK");
				return false;
			}
			if (toAddress.indexOf(',') != -1) {
				var multipleEmail = toAddress;
				var emailTokens = multipleEmail.split(",");
				var currentEmail = "";
				for (var i = 0; i < emailTokens.length; i++) {
					currentEmail = emailTokens[i];
					if (currentEmail.length > 0 && !validateEmail(currentEmail)) {
						var alert = new Alert("Please enter a valid To email address", "OK");
						status = false;
						break;
					}
				}
			}
			if (status != false) {
				var messageObj = {};
				var selectedDocs = [];
				messageObj.internetAddressesToList = toAddress;
				messageObj.internetAddressesCCList = "";
				messageObj.internetAddressesFromList = fromAddress;
				messageObj.subject = this.$("#subject").val();
				messageObj.body = this.$("#message-body").val();
				messageObj.attachmentPwd =  attachmentPwd;
				this.$(".docs-presentedList .doc-selector:checked").each(function () {
					var ind_selectedDocs = $(this).attr('data-docid');
					var docName = $(this).attr('docName');
					if (docName.indexOf("Paulson") == -1) {
						selectedDocs.push(ind_selectedDocs);
					}
				});
				messageObj.docIdList = selectedDocs;
				this.model.presentDocs(messageObj, {
					success: function() {
						that.model.approveTask();
					}
				});
				//var eventDetails = "User sent email with following contents : " + $("#message-body").val();
				//insertTransactionEventLog("Email sent for Documents Presented To Investor", eventDetails);
			}
		},
		clean: function() {
			this.stopListening();
		}
	});
	return PresentTasks;
});