define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/shareholder/letters.html',
	'collections/shareholders/shareholder_letters',
	'models/shareholder/shareholder_app_model',
	'models/authed_user',
	'amd/backbone/Backbone.CollectionBinder',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, Template, ShareholderLetters, ShAppModel, AuthedUser) {
	var ShLetter = Backbone.View.extend({
		_modelBinder: undefined,
		_collectionBinder: undefined,
		template: Handlebars.compile(Template),
		context: {
			user: AuthedUser.toJSON()
		},
		collection: ShareholderLetters,
		rowTemplate: '<li><a data-name="title" class="show-letter" href="#"></a> <a href="#" class="edit-letter">Edit</a></li>',
		documentTemplate: '{{#.}}<li><a href="/api/document/download?docId={{documentId}}" target="_blank">{{description}}</a></li>{{/.}}{{^.}}<li>No documents</li>{{/.}}',
		title: 'Letter to our Shareholders',
		className: 'shareholder-letters subview',
		initialize: function(callback) {
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(this.rowTemplate, 'data-name');
			this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			this._modelBinder = new Backbone.ModelBinder();
			this.collection = new ShareholderLetters();
			this.listenToOnce(this.collection, 'sync', function() {
				this.loadLetterContent(this.collection.at(0));
			});
			this.collection.fetch({
				success: _.bind(this.render, this),
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was an error retrieving the shareholder letters.', 'OK');
					}
				}
			});
		},
		render: function() {
			$('.workspace').after(this.$el);
			this.$el.hide().html(this.template(this.context)).fadeIn('slow');
			this._collectionBinder.bind(this.collection, this.$('ul.previous'));
			if (!AuthedUser.get('caisemployee')) this.$('.edit-letter').remove();
		},
		events: {
			'click .edit-letter': 'showLetterEditor',
			'click .show-letter': 'showLetter',
			'click .close-letter': 'closeLetter'
		},
		showLetter: function(e) {
			var el = $(e.target)[0];
			var model = this._collectionBinder.getManagerForEl(el).getModel();
			this.loadLetterContent(model);
		},
		loadLetterContent: function(model) {
			var that = this;
			this.$('.letter-body').fadeOut('fast', function() {
				$(this).empty().html(model.get('content'));
				if (that._modelBinder) that._modelBinder.unbind();
				that._modelBinder.bind(model, $(this).parents('.letter-content'));
				$(this).fadeIn('slow');
			});
			this.$('.previous li.active').removeClass('active');
			this.$('.previous li#' + model.id).addClass('active');

			var template = Handlebars.compile(this.documentTemplate);
			this.$('ul.documents').html(template(model.get('attachments')));

			if (!AuthedUser.get('caisemployee')) this.$('.edit-letter').remove();
		},
		onEditModelChange: _.debounce(function(model) {
			this.$('.letter-body').html(model.get('content'));
		}, 200),
		showLetterEditor: function(e) {
			e.preventDefault();
			var el = $(e.target)[0];
			var elManager = this._collectionBinder.getManagerForEl(el);
			var model = new this.collection.model();
			if (elManager) model = elManager.getModel();
			else this.collection.add(model);

			this.listenTo(model, 'change:content', this.onEditModelChange);

			require(['views/shareholder/sub_views/sh_letter_editor'], _.bind(function(ShLetterEditor) {
				this.loadLetterContent(model);
				this.letterEditor = Vm.create(this, 'ShLetterEditor', ShLetterEditor, {
					model: model
				});
			}, this));
		},
		closeLetter: function(e) {
			this.$el.fadeOut('slow', _.bind(function() {
				this.clean();
				ShAppModel.set('showLetter', false);
				this.remove();
			}, this));
		},
		clean: function() {
			this.stopListening();
		}
	});
	return ShLetter;
});