define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/firm_detail/firm_cais_team.html',
	'collections/setup/cais_team_members',
	'collections/firm_team_members',
	'models/authed_user'
], function ($, _, Backbone, Vm, Template, CaisTeamMembers, FirmTeamMembers, AuthedUser) {
	var FirmCaisAccountTeam = Backbone.View.extend({
		teamMemberTemplate: '{{#.}}<li id="{{userId}}" class="team-item">{{memberName}}</li>{{/.}}',
		selectedTeamMemberTemplate: '{{#.}}<li id="{{userId}}" class="team-item-selected">{{memberName}}</li>{{/.}}',
		initialize: function() {
			var that = this;
			this.selectedTeamMembers = new FirmTeamMembers(),
			this.activeTeamMembers = new Backbone.Collection(),
			this.listenTo(CaisTeamMembers, 'sync', this.render);
			this.listenTo(this.selectedTeamMembers, 'add remove reset', this.onSelectedChange);
			this.listenTo(this.activeTeamMembers, 'add remove reset', this.onActiveChange);

			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue').hide();
			
			if (this.options.editing) {
				this.model.teamMembers.fetch({
					success: function() {
						CaisTeamMembers.fetch();
					}
				});
			}
			else {
				CaisTeamMembers.fetch();
			}
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(Template);
			this.$el.html(template(CaisTeamMembers.toJSON()));
			if (!this.options.editing) {
				$('.primaryButton.continue').removeClass('continue').addClass('update-hierarchy');
			}
			if (this.model.teamMembers.length) {
				this.model.teamMembers.each(function(model) {
					that.selectedTeamMembers.add(CaisTeamMembers.allMembers.get(model.id));
				});
			}
			
		},
		events: {
			'click .group-item': 'groupItemClickHandler',
			'click .team-item': 'teamItemClickHandler',
			'click .team-item-selected': 'deselectItem',
			'keyup .search-input': 'filterKeyupHandler'
		},
		teamItemClickHandler: function(e) {
			if (!AuthedUser.get('caisemployee')) return;
			var selectedMember = this.teamMembers.findWhere({'userId': parseInt($(e.currentTarget).attr('id'))});
			this.activeTeamMembers.remove(selectedMember);
			this.selectedTeamMembers.add(selectedMember);
		},	
		groupItemClickHandler: function(e) {
			if (!AuthedUser.get('caisemployee')) return;
			var selectedGroup = $(e.currentTarget).attr('id');
			this.teamMembers = CaisTeamMembers.getTeamMembers(selectedGroup);
			this.activeTeamMembers.reset(this.teamMembers.models);
		},
		deselectItem: function(e) {
			if (!AuthedUser.get('caisemployee')) return;
			var selectedMember = this.selectedTeamMembers.findWhere({'userId': parseInt($(e.currentTarget).attr('id'))});
			this.selectedTeamMembers.remove(selectedMember);
			this.activeTeamMembers.add(selectedMember);
		},
		onActiveChange: function() {
			var template = Handlebars.compile(this.teamMemberTemplate);
			var that = this;
			this.$('.team-member-list').html(template(this.activeTeamMembers.toJSON()));
			if (this.selectedTeamMembers.length) {
				this.selectedTeamMembers.each(function(member) {
					that.$('.team-member-list').find('#' + member.get('userId')).hide();
				}, this);
			}
		},
		onSelectedChange: function() {
			var template = Handlebars.compile(this.selectedTeamMemberTemplate);
			this.$('.selected-members-list').html(template(this.selectedTeamMembers.toJSON()));
		//	this.model.teamMembers.reset(this.selectedTeamMembers.models);
		},
		filterKeyupHandler: _.debounce(function(e) {
			var list = $(e.target).next('.selection-section-list').find('ul');
			var filter = $(e.target).val();
			if (filter) {
				list.find("li:not(:Contains(" + filter + "))").hide();
				list.find("li:Contains(" + filter + ")").show();
			} else {
				list.find("li").show();
			}
		}, 200),
		saveModel: function() {
			if (!AuthedUser.get('caisemployee')) {
				this.trigger('saveSuccess', {showUiFeedback: false});
				return;
			}
			var that = this;
			this.model.setTeamMembers(this.selectedTeamMembers, {
				success: function() {
					that.trigger('saveSuccess');
				},
				error: function() {
				}
			});
		},
		clean: function() {
			this.stopListening();
			if (!AuthedUser.get('caisemployee')) $('.firm-details .primaryButton.continue').show();
		}
	});
	return FirmCaisAccountTeam;
});