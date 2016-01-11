define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'collections/accounts/advisor_teams',
	'collections/accounts/syndicate_access',
	'text!templates/accounts/firm_detail/syndicate_permissioner.html',
], function ($, _, Backbone, Vm, AdvisorTeamCollections, CapMarketsAccess, Template) {
	var CapMarketPermissioner = Backbone.View.extend({
		options: {},
		className: 'cap-market-permissioner',
		collection: new AdvisorTeamCollections.AllAdvisorTeamMembers(),
		selectedUsers: new CapMarketsAccess(),
		initialize: function() {
			this.selectedUsers.reset();
			this.collection.setUrl(this.options.client.id);
			this.listenTo(this.selectedUsers, 'add,', this.onMemberAdd);
			this.listenTo(this.selectedUsers, 'remove,', this.onMemberRemove);
			this.listenTo(this.selectedUsers, 'sync', this.onSelectedSync);
			this.collection.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var context = {
				teams: this.collection.toJSON()
			};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
		},
		events: {
			'click .select-all': 'selectAll',
			'click .select-all-firm': 'selectAllFirm',
			'click .remove-all': 'deselectAll',
			'change .member-select': 'onMemberSelectChange',
			'keyup .search-input': 'filterKeyupHandler'
		},
		changeAccountModel: function(model) {
			this.options.account = model;
			if (model.id) {
				this.selectedUsers.setUrl(model.id);
				this.selectedUsers.fetch();
			}
		},
		selectAllFirm: function(e) {
			this.$('.member-select').prop('checked', true).change();
		},
		selectAll: function(e) {
			e.preventDefault();
			$(e.currentTarget).parents('li').find('input').prop('checked', true).change();
		},
		deselectAll: function(e) {
			$(e.currentTarget).parents('li').find('input').prop('checked', false).change();
		},
		deslectAllAdvisors: function() {
			this.$('li input[type=checkbox]').prop('checked', false).change();
		},
		// check boxes of existing members
		onSelectedSync: function() {
			this.$('input').prop('checked', false);
			this.selectedUsers.each(function(model) {
				this.$('li#'+ model.get('advisorTeamId')).find('.member-select[value=' + model.get('userId') + ']').prop('checked', true);
			}, this);
		},
		// add/remove single member from selected users
		onMemberSelectChange: function(e) {
			var elem = $(e.target);
			var id = elem.val();
			var user = this.collection.get(elem.attr('data-advisorteamid')).members.get(id);

			if (elem.prop('checked')) {
				var model = new this.selectedUsers.model({
					userId: user.id,
					advisorTeamId: user.get('advisorTeamId'),
					accountId: this.options.account.id,
					clientId: this.options.client.id
				});
				this.selectedUsers.add(model);
			} else {
				this.selectedUsers.remove(this.selectedUsers.where({userId: user.id}));
			}
		},
		filterKeyupHandler: _.debounce(function(e) {
			var list = $(e.target).next('.selection-section-list').find('ul');
			var filter = $(e.target).val();
			if (filter) {
				list.find("li:not(:Contains(" + filter + "))").hide();
				list.find("li:Contains(" + filter + ")").show();
				list.find('.advisor h2:contains(' + filter +')').parents('li').find('li').show();

			} else {
				list.find("li").show();
			}
		}, 200),
	});
	return CapMarketPermissioner;
});