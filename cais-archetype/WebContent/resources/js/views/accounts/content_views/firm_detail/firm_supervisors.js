define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/firm_detail/firm_supervisors.html',
	'text!templates/assets/user_list_item.html',
	'models/authed_user',
	'views/assets/user_form'
], function ($, _, Backbone, Vm, Template, UserListItemTemplate, AuthedUser, UserForm) {
	var FirmSupervisors = Backbone.View.extend({
		userPermissionTemplate: '{{#.}}<label><input class="permissionCheck" name="permission_{{id}}" value="{{id}}" type="checkbox">{{name}}</label><br/>{{/.}}',
		superVisorLi: UserListItemTemplate,
		initialize: function() {
			if (this.options.editing) {
				this.listenTo(this.model.supervisors, 'modelError', this.onModelError);
			}
			this.initNewSupervisor();
			this.model.supervisors.reset().fetch();
			this.listenTo(this.model.supervisors, 'add', this.addOne);
			this.render();
		},
		render: function() {
			var context = {
				editing: this.options.editing
			};

			var template = Handlebars.compile(Template);
			this.$el.html(template(context));

			this.$('.create-new-supervisor').hide();
			$('.firm-details .primaryButton').hide();

			this.newUserForm = Vm.create(this, 'UserForm', UserForm, {
				model: this.newSupervisor,
				removeFields: ['roleId'],
				success: _.bind(this.onSupervisorCreate, this),
				error: function(model, response) {
					Alert('This supervisor could not be created. Error: ' + JSON.parse(response.responseText).error, 'OK');
				}
			})
			this.$('.create-new-supervisor').html(this.newUserForm.$el);

			// roleSuperivisor is spelled wrong in database...
			if (AuthedUser.get('roleSuperivisor') || AuthedUser.get('caisemployee')) this.$('.show-supervisor-form').show();
		}, 
		events: {
			'click .show-supervisor-form': 'showSupervisorForm'
		},
		showSupervisorForm: function() {
			var that = this;
			this.options.editing = false;
			that.$('.create-new-supervisor').slideDown('fast');
			$('.firm-details .primaryButton.continue span').text('SAVE & CONTINUE');
		},	
		addOne: function(model, collection, options) {
			var template = Handlebars.compile(this.superVisorLi);
			var li = $(template(model.toJSON()));
			this.$('li.empty').hide();
			this.$('.supervisor-list').append(li);
			li.hide().fadeIn('slow');
			if (options.pulseUi) {
				li.addClass('new');
				setTimeout(function() {
					li.removeClass('new');
				}, 600);
			}
		},	
		onSupervisorCreate: function() {
			this.$('.create-new-supervisor').fadeOut('slow');
			var that = this;
			this.model.supervisors.add(this.newSupervisor, {pulseUi: true});
			// reinit the user model and form
			this.initNewSupervisor();
			this.newUserForm.reInit(this.newSupervisor);
		},
		initNewSupervisor: function() {
			this.newSupervisor = new this.model.supervisors.model;
			this.newSupervisor.url = this.model.supervisors.url;
			this.newSupervisor.set(_.omit(this.model.toJSON().address, ['email','addressId']), {silent: true});
			this.newSupervisor.set('clientId', this.model.get('clientId'));
			this.newSupervisor.on('change:email', this.newSupervisor.validateEmail);
			this.listenTo(this.newSupervisor, 'modelError', this.onModelError);
		},
		onModelError: function(e) {
			this.model.trigger('modelError', e);
		},
		saveModel: function() {
			this.trigger('saveSuccess');
		},
		clean: function() {
			this.stopListening();
			$('.firm-details .primaryButton').show();
		}
	});
	return FirmSupervisors;
});