define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/tree/tree_events',
	'routers/accounts_router',
	'views/assets/big_loader'
], function ($, _, Backbone, Vm, Events, TreeEvents, Router, BigLoader) {
	var BaseDetails = Backbone.View.extend({
		options: {},
		className: null,
		model: null,
		permissionList: null,
		template: null,
		viewNav: null,
		firmSubViews: {},
		initialize: function() {
			// override from accounts_main.js
			Backbone.emulateHTTP = false;
			this.model = new this.model();
			this.viewNav = Vm.create(this, 'DetailViewNav', this.viewNav);
			this.listenTo(this.viewNav, 'navLinkSelected', this.onNavChange);
			this.listenTo(this.model, 'completionUpdated', this.viewNav.enableCheckboxes);
			this.listenTo(this.model, 'modelError', this.onModelerror);

			// if a node was provided to the view, set the ID and assume editing
			if (this.options.node) {
				this.model.id = this.options.node.id;
				this.options.editing = true;
				this.model.fetch({
					success: _.bind(this.render, this)
				});
			}
			// else we are creating a new firm, just render with disabled nav
			else {
				this.viewNav.disableNavElements(this.viewNav.$('.nav-link').not(':first'));
				this.listenTo(this.model, 'sync', this.onModelSync);
				this.render();
			}
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(this.template);

			this.$el.html(template(this.model.toJSON()));
			this.$('#entity-content').after(this.viewNav.$el);
			this.$('.nav-link:eq(0)').click();
			if (this.postRender) this.postRender();
		},
		events: {
			'click .continue': 'saveModel',
			'click .finish': 'finish',
			'click .update-hierarchy': 'updateHierarchy'
		},
		onNavChange: function(e) {
			var that = this;
			if (this.subView) this.stopListening(this.subView);
			this.subView = Vm.create(this, 'FirmSubView', this.firmSubViews[e], {model: this.model, editing: this.options.editing});
			this.listenTo(this.subView, 'saveSuccess', this.onSaveSuccess);
			this.$('.view-detail-section').fadeOut('fast', function() {
				that.$('.view-detail-section').html(that.subView.$el);
				that.$('.view-detail-section').fadeIn('fast');
			});
		},
		onModelerror: function(e) {
			Alert(e.msg, 'OK');
		},
		onModelSync: function(model, changed, options) {
			if (model.id) {
				this.viewNav.enableNavElements();
				this.viewNav.disableNavElements(this.viewNav.$('[data-section=structured-products-accounts]'));
				this.viewNav.selectNext();
			}
		},
		saveModel: function() {
			if (this.subView.saveModel) this.subView.saveModel();
		},
		finish: function() {
			if (this.subView.saveModel) this.subView.saveModel();
			Router.appRouter.navigate('/holdings/' + this.model.id, {trigger: true});
		},
		updateHierarchy: function() {
			var fragment = {
				firm: this.model.id
			};
			TreeEvents.trigger('refreshTree', fragment, true);
			this.saveModel();
			Router.appRouter.navigate('/detail/' + this.model.id);
		},
		onSaveSuccess: function(options) {
			var defaults = {
				showUiFeedback: true
			};
			var settings = _.extend(defaults, options);
			this.viewNav.selectNext();
			if (settings.showUiFeedback) {
				setTimeout(function() {
					Events.trigger('showUiFeedback', 'success', 'Saved successfully');
				}, 500);
			}
		}
	});
	return BaseDetails;
});