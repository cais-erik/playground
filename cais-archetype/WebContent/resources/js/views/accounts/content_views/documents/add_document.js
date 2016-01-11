/*
Add documents view, renders an uploader for documents
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/documents/add_document.html',
	'collections/products/products_by_entity'
], function ($, _, Backbone, Handlebars, Template, Products) {
	var view = Backbone.View.extend({
		attributes: {
			'class': 'add-documents-uploader'
		},
		collection: Products,
		initialize: function() {
			this.collection = new this.collection();
			this.collection.params.investmentEntityId = this.options.investmentEntityId;
			this.collection.setUrl();
			this.collection.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var template = Handlebars.compile(Template);
			var that = this;
			var context = {
				products: this.collection.toJSON()
			};
			this.$el.hide().html(template(context));
			this.$('[data-role=dropdownlist]').kendoDropDownList();
			this.$('[data-role=datepicker]').kendoDatePicker({
				format: "MMM dd, yyyy",
				value: new Date(),
				parseFormats: ['yyyy-MM-dd', 'M/d/yyyy', 'MM/dd/yyy', 'M/dd/yyyy', 'MM/d/yyyy']
			});
			this.initArticleUploader();
			setTimeout(function(){
				that.$el.slideDown({duration: 400, easing: 'swing'});
			}, 2);
		},
		events: {
			'click .cancel': 'closeUpload',
			'click .save': 'uploadDocument'
			//'change [name=categoryId]': 'categoryIdChangeHandler'
		},
		/*
		categoryIdChangeHandler: function(e) {
			if ($(e.currentTarget).val() === '25') {
				this.$('[name=documentDate]').data('kendoDatePicker').enable(true);
			}
			else {
				this.$('[name=documentDate]').data('kendoDatePicker').enable(false);	
			}
		},
		*/
		closeUpload: function() {
			this.$el.slideUp({duration: 400, easing: 'swing'});
		},
		uploadDocument: function() {
			var that = this;
			that.$('.k-upload-selected').click();
		},
		onFileUploaded: function() {
			this.closeUpload();
			this.trigger('fileUploaded');
		},
		initArticleUploader: function() {
			var that = this;
			this.$('#doc-file').kendoUpload({
				multiple: false,
				localization: {
					select: 'Select file'
				},
				async: {
                    saveUrl: '/uploadInvestmentDoc',
                    autoUpload: false
                },
				select: function(e) {
					$.each(e.files, function(i, file) {
						if (!file.extension.match('^.*\.(pdf|PDF)$')) {
							e.preventDefault();
							Alert('The file must be a PDF document.', 'OK');
						}
					});
				},
				upload: function (e) {
					var data = {
						categoryId: that.$('[name=categoryId]').val(),
						fundId: that.$('[name=fundId]').val(),
						investmentEntityId: that.options.investmentEntityId,
						documentDate: kendo.toString(new Date(kendo.parseDate(that.$('[name=documentDate]').val(), [ "MMM dd, yyyy","yyyy-MM-dd"])), 'u').split(' ')[0]     
					};
					e.data = data;
				},
				success: function (e) {
					if (e.response.status == 'success') {
						that.onFileUploaded();
					} else {
						var alert = new Alert("Uploaded File Cannot Exceed 10mb", "OK");
					}
				}
			});
		}
	});
	return view;
});
