define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'amd/backbone/Backbone.ModelBinder',
	'text!templates/assets/user_form.html',
	'collections/setup/permissions',
	'collections/users/point_of_contacts',
	'views/assets/big_loader',
	'amd/common/Backbone.ModelBinder.config',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Vm, Binder, Template, Permissions, PointOfContacts, BigLoader) {
	var UserForm = Backbone.View.extend({
		options: {
			type: 'User', // user name type
			title: 'Add New User',
			removeFields: [] // array of potential field names to be removed from form
		},
		className: 'user-form',
		template: Template,
		collection : new PointOfContacts(),
		context: {
			permissions: Permissions.getUsersAvailablePermissions().toJSON(),
			options: this.options
		},
		_modelBinder: undefined,
		initialize: function() {
		    this.collection.fetch({
		        async : false
            });
			this.context.pointOfContacts = this.collection.toJSON();
			this._modelBinder = new Backbone.ModelBinder();
			this.render();
		},
		render: function() {
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.context));
			this._modelBinder.bind(this.model, this.el);
			this.validator = this.$el.kendoValidator().data('kendoValidator');
			this.initUserPermissions();
			this.removeFields();
		},
		events: {
			'click .save-user': 'saveUser',
			'change .permission-check': 'onPermissionChange',
		},
		reInit: function(model) {
			this._modelBinder.unbind();
			this.model = model;
			this._modelBinder.bind(this.model, this.el);
		},
		removeFields: function() {
			if (!this.options.removeFields.length) return;
			_.each(this.options.removeFields, function(field) {
				this.$('.container-' + field).remove();
			}, this);
		},
		onPermissionChange: function(e) {
			var elem = $(e.target);
			var id = $(e.target).val();
			if (elem.is(':checked')) {
				this.model.setFunctionPermission(id, true);
			}
			else {
				this.model.setFunctionPermission(id, false);
			}
		},
		initUserPermissions: function() {
			_.each(this.model.get('permission'), function(id) {
				this.$('[name=permission_' + id + ']').first().prop('checked', true);
			}, this);
		},
		saveUser: function() {
			if (!this.validator.validate()) return;
			this.loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Creating user...'});
			this.model.save(null, {
				success: _.bind(this.onSuccess, this),
				error: _.bind(this.onFail, this)
			});
		},
		onSuccess: function() {
			this.loader.closeLoader();
			if (this.options.success) this.options.success(this.model);
		},
		onFail: function(model, response) {
			this.loader.closeLoader();
			if (this.options.error) this.options.error.apply(this, arguments);
		},
		clean: function() {
			this.stopListening();
		}
	});
	return UserForm;
});