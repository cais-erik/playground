define([
	'jquery',
	'underscore',
	'models/tree/tree_events',
	'events',
	'backbone',
	'Vm',
	'text!templates/accounts/team_detail/team_members.html',
	'views/assets/user_form'
], function ($, _, TreeEvents, Events, Backbone, Vm, Template, UserForm) {
	var TeamMembers = Backbone.View.extend({
		options: {},
		className: 'team-members',
		memberListTemplate: '{{#.}}<li class="team-member">{{userDetails.firstName}} {{userDetails.lastName}}</li>{{/.}}',
		teamMembersTemplate: '{{#.}}<option value="{{userId}}">{{firstName}} {{lastName}}</option>{{/.}}{{^.}}<option value="">No team members</option>{{/.}}',
		initialize: function() {
			this.listenToOnce(this.model.firmTeamMembers, 'sync', this.populateFirmMembers);
			this.setNewMember();

			if (this.model.id) {
				this.model.firmTeamMembers.fetch();
				//this.model.teamMembers.fetch();
			}

			this.render();

			$('.team-details .primaryButton.continue').hide();
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.$('[data-role=dropdownlist]').kendoDropDownList();
			this.newMemberForm = Vm.create(this, 'UserForm', UserForm, {
				model: this.newMember,
				success: _.bind(this.onMemberAdd, this),
				error: function(model, response) {
					Alert('This team member could not be added. Error: ' + JSON.parse(response.responseText).error, 'OK');
				}
			});
			this.$('.team-member-form').html(this.newMemberForm.$el);
		},
		events: {
			'change [name=new-user]': 'showAddExisting',
			'click .add-existing': 'addExisting'
		},
		setNewMember: function() {
			if (this.newMember) this.stopListening(this.newMember);
			this.newMember = new this.model.teamMembers.model();
			this.newMember.set('clientId', this.model.get('clientId'));
			this.newMember.set(this.model.getAddress(), {silent: true});
			this.listenTo(this.newMember, 'modelError', this.onModelError);

			this.model.teamMembers.add(this.newMember);
		},
		showAddExisting: function(e) {
			var show = this.$('[name=new-user]:checked').val();
			var that = this;
			if (show === 'false') {
				this.$('.team-member-form').fadeOut('fast', function() {
					that.$('.add-existing-container').fadeIn('slow');
				});
			} else {
				this.$('.add-existing-container').fadeOut('fast', function() {
					that.$('.team-member-form').fadeIn('slow');
				});
			}
		},
		populateFirmMembers: function() {
			var that = this;
			this.model.getFirmMembers(function(collection) {
				var optionsTemplate = Handlebars.compile(that.teamMembersTemplate);
				that.$('[name=existingMembers]').html(optionsTemplate(collection.toJSON()));
				that.$('[data-role=dropdownlist]').kendoDropDownList();
				that.model.teamMembers.add(that.newMember);
			});
		},
		addExisting: function() {
			var that =  this;
			var id = parseInt(this.$('[name=existingMembers]').val());
			if (this.$('.add-existing').hasClass('disabled')) return false; 
			this.$('.add-existing').addClass('disabled');
			if (id) {
				var selectedModel = this.model.firmTeamMembers.findWhere({'userId': id});
				this.model.teamMembers.addExistingMember(selectedModel.attributes, {
					success: function(model, collection, response) {
						that.onMemberAdd(model);
						that.model.firmTeamMembers.remove(selectedModel);
						that.populateFirmMembers();
						setTimeout(function(){
							that.$('.add-existing').removeClass('disabled');
						}, 1500);
					},
					error: function(model, collection, response) {
						Alert('This team member could not be added. Error: ' + JSON.parse(response.responseText).error, 'OK');
					}
				});
			}
		},
		onMemberAdd: function(model) {
			// refresh the active tree node
			TreeEvents.trigger('teamMember:added', this.newMember);
			Events.trigger('showUiFeedback', 'success', model.get('firstName') + ' has been added to the team.');
			// reinit the user model and form
			this.setNewMember();
			this.newMemberForm.reInit(this.newMember);
		},
		saveModel: function() {
			var that = this;
			this.model.save([], {
				success: function() {
					that.trigger('saveSuccess');
				}
			});
		},
		onModelError: function(e) {
			this.model.trigger('modelError', e);
		},
		clean: function() {
			$('.team-details .primaryButton.continue').show();
			this.stopListening();
		}
	});
	return TeamMembers;
});