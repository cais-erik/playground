/*
TODO: move server call to delete doc to model
	  revise server side API to return files as an array
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'Vm',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_documents.html',
	'models/entity_info',
	'views/assets/big_loader'
], function ($, _, Backbone, Handlebars, Vm, BaseDetailsView, Template, EntityInfoModel, BigLoader) {
	var entityInfo = BaseDetailsView.extend({
		panelId: 4,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change', this.render);
			this.events = $.extend({}, BaseDetailsView.prototype.events, this.events);
		},
		render: function() {
			BaseDetailsView.prototype.render.apply(this, arguments);
			this.initUploader();
		},
		events: {
			'click .removeDocument': 'removeDocument',
		},
		removeDocument: function(event){
			var that = this;
			var docTypeId = parseInt($(event.currentTarget).attr("data-docType"));
			var parent = $(event.currentTarget).parents('.document-info');
			var docName = parent.prev('input').attr('data-docName');
			var data = {
				investmentEntityId: this.model.id, 
				docTypeId: docTypeId
			};
            Server.deleteInvestmentEntityDoc(data, function (response) {
                parent.fadeOut('fast', function() {
                	that.model.set(docName, null);
                });
            });   
		},
		initUploader: function() {
			var that = this;
			this.$("input[type=file]").kendoUpload({
				showFileList: false,
				async: {
					autoUpload: true,
					saveUrl: "/saveInvestmentEntityDoc"
				},
				upload: function (e) {
					var data = {};
					data.investmentEntityId = that.model.id;
					data.docTypeId = $(this.element[0]).attr("data-docType");
					e.data = data;
					that.loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Uploading...'});
				},
				success: function (e) {
					var docTypeId = $(this.element[0]).attr("data-docType");
					// TODO: revise server side API to return this as an array so we can fix this ugly switch
					switch (parseInt(docTypeId)) {
						case 0:
							that.model.set({
								'photoId_doc_name': e.response.msg.name,
								'photoId_doc_id': e.response.msg.documentId
							});
							break;
						case 1:
							that.model.set({
								'addressVerification1_doc_name': e.response.msg.name,
								'addressVerification1_doc_id': e.response.msg.documentId
							});
							break;
						case 2:
							that.model.set({
								'addressVerification2_doc_name': e.response.msg.name, 
								'addressVerification2_doc_id': e.response.msg.documentId
							});
							break;
						case 3:
							that.model.set({
								'authorizedSignatoryList_doc_name': e.response.msg.name,
								'authorizedSignatoryList_doc_id': e.response.msg.documentId
							});
							break;
						case 4:
							that.model.set({
								'trustDeed_doc_name': e.response.msg.name,
								'trustDeed_doc_id': e.response.msg.documentId
							});
							break;

						case 5:
							that.model.set({
								'certificateOfFormation_doc_name': e.response.msg.name,
								'certificateOfFormation_doc_id': e.response.msg.documentId
							});
							break;

						case 6:
							that.model.set({
								'constitutiveDocuments_doc_name': e.response.msg.name,
								'constitutiveDocuments_doc_id': e.response.msg.documentId
							});
							break;
					}
					that.loader.closeLoader();
				}
			});
		}
	});
	return entityInfo;
});