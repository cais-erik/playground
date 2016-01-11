define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/shareholder/sub_views/base_sh_subview',
	'text!templates/shareholder/letter_editor.html',
	'collections/shareholders/shareholder_letters',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseShSubview, Template) {
	var ShLetterEditor = BaseShSubview.extend({
		template: Handlebars.compile(Template),
		className: 'shareholder-letter-editor',
		postRender: function() {
			var that = this;
			this.$el.appendTo('body');
			
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.$el);
			kendo.init(this.$el);

			this.$('.kendo-editor').kendoEditor({
				change: function() {
					that.model.set($(this.textarea).attr('name'), this.value());
				},
				keyup: _.throttle(function() {
					that.model.set($(this.textarea).attr('name'), this.value());
				}, 500)
			});

			this.$('[data-role="kendoupload"]').kendoUpload({
				multiple: false,
				// showFileList: false,
				localization: {
					// select: fileUploadText
				},
				files: this.model.get('attachments'),
				async: {
					saveUrl: '/api/document/upload'
				},
				select: function(e) {
				},
				upload: function (e) {
					var data = {
						categoryId: 48
					};
					e.data = data;
				},
				remove: function(e) {
					console.log(arguments);
				},
				success: _.bind(function (e) {
					var documentModel = e.response.msg;
					this.model.addAttachment(documentModel);
					this.model.unset('file'); // TODO fix in model binding
					if (e.response.status == 'success') {
						that.$('.k-upload-status .k-icon').removeClass('k-warning').addClass('k-success');
						that.$('[data-for=file]').parent('.validation-wrapper').hide();
					} else {
						new Alert("Uploaded File Cannot Exceed 10mb", "OK");
					}
				}, this)
			});

			setTimeout(function() {
				that.$el.addClass('active');
			}, 4);
		},
		events: {
			'click .save-letter': 'saveLetter',
			'click .delete-letter': 'deleteLetter',
			'click .cancel-dialog': 'closeDialog'
		},
		saveLetter: function(e) {
			e.preventDefault();
			var button = $(e.currentTarget);
			var startText = button.text();
			button.text('Saving...');
			this.model.save(null, {
				success: function() {
					button.text('Saved!');
					setTimeout(function() {
						button.text(startText);
					}, 500);
				},
				error: function(response) {
					button.text(startText);
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was an error saving the shareholder letter.', 'OK');
					}
				}
			});
		},
		closeDialog: function() {
			this.$el.removeClass('active');
			setTimeout(_.bind(this.clean,this), 2000);
		},
		clean: function() {
			this._modelBinder.unbind();
			this.remove();
		},
		deleteLetter: function(e) {
			e.preventDefault();
			if (this.model.id) this.model.destroy();
		}
	});
	return ShLetterEditor;
});