define([
	'jquery',
	'underscore',
	'backbone',
	'amd/backbone/Backbone.ModelBinder',
	'Vm',
	'events',
	'handlebars',
	'models/authed_user',
	'collections/setup/banks',
	'views/assets/big_loader',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Binder, Vm, Events, Handlebars, AuthUser, Banks, BigLoader) {
	var AddCapMarketProduct = Backbone.View.extend({
		_modelBinder: undefined,
		options: {},
		model: null,
		template: null,
		collection: null,
		setupData: null,
		title: 'Offering Form',
		postBootstrap: function() {
			this._modelBinder = new Backbone.ModelBinder();
			// if we are editing an existing offering
			if (this.options.editId) {
				this.model = this.collection.get(this.options.editId);
				Events.trigger('domchange:title', 'Editing ' + this.title);
				this.model.fetch({
					success: _.bind(this.render, this),
					error: function() {
						Alert('Could not find this offering.', 'OK');
						Backbone.history.navigate('/', {trigger:true, replace:true});
					}
				});
			}
			// else we are creating a new one
			else {
				this.model = new this.model();
				Events.trigger('domchange:title', 'Create a New ' + this.title);
				// push the render function to the end of the call stack
				setTimeout(_.bind(this.render, this));
			}
		},
		initialize: function() {
			// boostrap the setup data
			this.setupData = Banks;
			if (!Banks.length) {
				Banks.fetch({success: _.bind(this.postBootstrap, this)});
			} else {
				_.bind(this.postBootstrap, this)();
			}
		},
		render: function() {
			var context = {
				offering: this.model.toJSON(),
				options: this.options,
				setupData: this.setupData.toJSON(),
				collection: this.collection.toJSON(),
				user: AuthUser.toJSON()
			};
			var template = Handlebars.compile(this.template);
			this.$el.html(template(context));
			this._modelBinder.bind(this.model, this.el);
			this.initKendoUi();
			if (this.postRender) this.postRender();
		},
		events: {
			'submit #insert-product': 'onSubmit',
			'change [name=preload-model]': 'prepopulateModel'
		},
		initKendoUi: function() {
			var that = this;
			var fileUploadText = 'Select file...';
			if (this.model.get('prospectusId') || this.model.get('terms')) fileUploadText = 'Pick New...';
			kendo.init(this.$el);
			
			this.$('form').kendoValidator({
				validateOnBlur: true,
				rules: {
					futureDate: function(input) {
						var attr = input.attr('data-futuredate');
						if (!input.val()) return true;
						if (typeof attr !== 'undefined' && attr !== false) {
							var date = kendo.parseDate(input.val(), ["MMM dd, yyyy","yyyy-MM-dd",'M/dd/yyyy h:mm tt']);
							if (date < new Date()) {
								return false;
							}
							return true;
						} else {
							return true;
						}
					},
					date: function (input) {
						if (!input.val()) return true;
						if (input.attr("data-role") === "datepicker") {
							var date = kendo.parseDate(input.val(), [ "MMM dd, yyyy","yyyy-MM-dd", "MM-dd-yyyy"]);
							if (date !== null) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					},
					upload: function(input) {
						if (input[0].type == "file") {
							var file = that.model.get('prospectusId') || that.model.get('terms');
							return file;
						}
						return true;
					},
					radio: function(input) {
						if (input.is("[type=radio]") && input.attr("required")) {
							return $(".form").find("[name=" + input.attr("name") + "]").is(":checked");
						}
						return true;
					},
					url: function(input) {
						var fieldValidation = input.attr('data-validurl');
						if (!input.val() || (typeof fieldValidation === 'undefined' || fieldValidation === false)) return true;
						return isValidURL(input.val());
					}
				},
				messages: {
					upload: 'A file must be provided',
					required: 'This field is required',
					date: "Please enter a valid date",
					futureDate: 'This date must be in the future',
					radio: "Please select a valid option",
					url: "You must use a valid URL (ie. http://www.google.com)"
				}
			});

			this.$('[name=file]').kendoUpload({
				multiple: false,
				showFileList: false,
				localization: {
					select: fileUploadText
				},
				async: {
					saveUrl: '/api/document/upload'
				},
				select: function(e) {
					if (!that.model.getDocumentCategoryId()) {
						new Alert('Please select an offering type before uploading a prospectus.', 'OK');
						e.preventDefault();
					}
					$.each(e.files, function(i, file) {
						if (!file.extension.match('^.*\.(pdf|PDF)$')) {
							e.preventDefault();
							Alert('The file must be a PDF document.', 'OK');
						}
					});
				},
				upload: function (e) {
					var data = {
						categoryId: that.model.getDocumentCategoryId()
					};
					e.data = data;
				},
				success: function (e) {
					if (e.response.status == 'success') {
						that.$('.k-upload-status .k-icon').removeClass('k-warning').addClass('k-success');
						that.model.set(that.$('[type=file]').attr('data-attrName'), e.response.msg.documentId);
						that.$('[data-for=file]').parent('.validation-wrapper').hide();
					} else {
						new Alert("Uploaded File Cannot Exceed 10mb", "OK");
					}
				}
			});

			// put the kendo multiselect options in the order they were received
			this.$('[data-role=multiselect]').each(function() {
				var kendoMulti = $(this).data('kendoMultiSelect');
				kendoMulti.value(that.model.get($(this).attr('name')));
			});
		},
		// prepopulates this model with an existing model then rerenders the UI
		prepopulateModel: function(e) {
			var model = this.collection.get($(e.currentTarget).val());
			this.model.prepopulate(model);
			this.render();
		},
		onSubmit: function(e) {
			e.preventDefault();
			var that = this;
			var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Creating offering...'});
			this.model.save([], {
				success: function(model) {
					that.collection.fetch({
						success: function() {
							loader.closeLoader();
							that.collection.trigger('modelEdit', model);
							Events.trigger('offering:create', model);
						}
					});
				},
				error: function(model, response, xhr) {
					loader.closeLoader();
					if (response.status !== 500) {
						Alert('Could not create this offering. Error: ' + $.parseJSON(response.responseText).error, 'OK');
					} else {
						Alert('Could not create this offering because of a server error.', 'OK');
					}
				}
			});
		}
	});
	return AddCapMarketProduct;
});