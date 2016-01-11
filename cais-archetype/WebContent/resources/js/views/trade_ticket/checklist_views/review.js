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
	'routers/pipeline_router',
	'views/trade_ticket/checklist_views/base_checklist_content',
	'collections/trade_ticket/task_collections',
	'text!templates/trade_ticket/checklist/review.html',
	'thirdparty/pdfobject_source'
], function ($, _, Backbone, Vm, Events, Handlebars, TradeTicketRouter, BaseChecklistContent, TransactionTasks, Template) {
	var ReviewTask = BaseChecklistContent.extend({
		//_modelBinder: undefined,
		className: 'review-tasks',
		template: Template,
		collection: TransactionTasks.review,
		title: 'Review Documents',
		events: {
			'click #download': 'downloadReviewDocs',
			'click #approve': 'closeTask',
			'click .download-doc': 'downloadSingleDoc',
			'click #reject': 'rejectTask'
		},
		preRender: function() {
			// inject the PDF download link into the context
			this.context.pdfDownloadLink = this.getPdfDownloadLink();
		},
		postRender: function() {
			try {
				var pdfObj = new PDFObject({ url: this.getPdfDownloadLink() }).embed("review-pdf");
				if (!pdfObj) this.$('.pdf-viewer').css('background', 'none');
			} catch(e) {
				this.$('.pdf-viewer').css('background', 'none');
			}
			// firefox REALLLLY doesn't like this property on the trade ticket window while showing a PDF file
			$('div.k-window').css('transform', 'none');

		},
		getPdfDownloadLink: function() {
			var doc = this.collection.at(0);
			return '/api/documents/trade/download?docId=' + doc.get('documentId') +'&transactionId=' + this.model.params.transactionId;
		},
		downloadReviewDocs: function() {
			this.model.downloadDocuments(this.collection.pluck('documentId'));
			this.model.insertTransactionEventLog("Subscription Documents Downloaded", "User downloaded the subscription document");
			var that = this;
			setTimeout(function() {
				that.$('#download').fadeOut('fast', function() {
					that.$('#approve, #reject').fadeIn('slow');
				});
			}, 1000);
		}
	});
	return ReviewTask;
});