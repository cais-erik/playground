define([
	'jquery',
	'underscore',
	'backbone',
	'routers/accounts_router',
	'handlebars',
	'text!templates/accounts/content/add_client.html',
	'models/client',
	'views/accounts/accounts_hierarchy',
	'views/assets/firm_team_advisor_select',
	'models/tree/tree_events',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Router, Handlebars, Template, Model, Hierarchy, Selector, TreeEvents) {
	var AccountsView = Backbone.View.extend({
		attributes: {
			'class': 'add-client-view'
		},
		options: {
			advisorTeamId: null, // preselected advisor team
			advisorId: null, // preselected advisor,
			createEntity: false // create new investment entity after saving
		},
		initialize: function() {
			var selectedIds = Hierarchy.getHierarchyIds();
			if (selectedIds !== 'cais') this.options = $.extend(this.options, selectedIds);
			this.selector = new Selector(this.options);
			this.render();
			this.listenTo(this.model, 'validationError', this.onModelError);
			this.model.on('change:name', this.model.validateName);
			this.model.set('advisorTeamId', this.options.advisorTeamId);
		},
		model: new Model(),
		render: function() {
			var template = Handlebars.compile(Template);
			var context = {
				model: this.model.toJSON()
			};
			
			this.$el.html(template(context));
			this.$('.delete').hide();
			this.$('.select-destination h1').after(this.selector.$el);
			this.$('.form').kendoValidator();
			kendo.init(this.$el);
		},
		events: {
			'click .save': 'onSubmit',
			'change input': 'inputChangeHandler',
			'change select': 'inputChangeHandler',
			'change [name=advisorTeamId]': 'onAdvisorTeamChange'
		},
		onSubmit: function(event) {
			if ($(event.currentTarget).hasClass('create-entity')) {
				this.options.createEntity = true;
			}
			else {
				this.options.createEntity = false;
			}
			if (this.$('.form').data('kendoValidator').validate()) {
				this.model.set(this.$('.form').serializeObject());
				this.model.unset('investorId');
				this.model.unset('id');
				var data = this.model.toJSON();
				data.advisorId = parseInt(data.advisorId);
				data.advisorTeamId = parseInt(data.advisorTeamId);
				data.clientId = parseInt(data.clientId);

				if (!data.advisorTeamId) {
					new Alert('Please select an advisor team.', 'OK');
					return false;
				}
				this.model.save(data, {
					success: _.bind(this.onModelCreate, this),
					error: function(response) {
						new Alert('There was an error creating this client. Error: ' + response.msg, 'OK');
					}
				});
			}
		},
		onModelCreate: function(model) {
			var team = Hierarchy.hierarchy.dataSource.get(model.get('advisorTeamId'));
			// if adding to one advisor, just refresh that node
			if (model.get('advisorId') !== 0) {
				var advisor = Hierarchy.hierarchy.dataSource.get(model.get('advisorId'));
				if (advisor) {
					advisor.one("change", _.bind(this.onComplete, this));
					advisor.loaded(false);
					advisor.hasChildren = true;
	                advisor.load();	
				}
				else {
					this.onComplete()
				}
				
			}
			// else refresh each member of the team
			else if (team) {
				$.each(team.children.data(), function(i, advisor) {
					if (i === team.children.data().length) {
						advisor.loaded(false);
						advisor.load();
					}
				});
				this.onComplete();
			}
			else {
				this.onComplete();
			}
		},
		onComplete: function() {
			this.trigger('showUiFeedback', 'Success', 'Client "' + this.model.get('name') + '" has been created.');
			if (this.options.createEntity) {
				this.listenToOnce(TreeEvents, 'selectNode', function() {
					Router.appRouter.navigate('/add_entity', {trigger: true});
				});
			}
			Router.appRouter.navigate('/detail/' + this.model.get('fragment'), {trigger: true});
		},
		onModelError: function(field, msg) {
			if (field === 'name') {
				Alert('This client name is already in use, please choose another.', 'OK');
				this.$('[name=name]').val('');
			}
		},
		onAdvisorTeamChange: function(event) {
			var value = $(event.target).val();
			this.model.set('advisorTeamId', value);
		},
		inputChangeHandler: function(event) {
			var elem = $(event.target);
			var value = elem.val();
			if (!isNaN(value)) value = parseInt(value);
			if (value === 'true') value = true;
			if (value === 'false') value = false;

			this.model.set(elem.attr('name'), value);
		}
	});
	return AccountsView;
});
