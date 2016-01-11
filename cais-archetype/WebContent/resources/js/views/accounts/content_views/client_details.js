define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'Vm',
	'routers/accounts_router',
	'text!templates/accounts/content/add_client.html',
	'models/client',
	'views/accounts/accounts_hierarchy',
	'views/assets/firm_team_advisor_select',
	'models/tree/tree_events',
	'views/assets/big_loader'
], function ($, _, Backbone, Handlebars, Vm, Router, Template, Model, Hierarchy, Selector, TreeEvents, BigLoader) {
	var AccountsView = Backbone.View.extend({
		className: 'client-details-view',
		initialize: function() {
			this.model = new this.model();
			this.model.params = {
				investorId: this.options.node.investorId
			};
			this.model.set('advisorTeamId', this.options.node.parent().parent().advisorTeamId);

			this.model.setUrl();
			this.model.fetch({
				success: _.bind(this.render, this)
			});
			this.listenTo(this.model, 'validationError', this.onModelError);
		},
		model: Model,
		render: function() {
			var template = Handlebars.compile(Template);
			var context = this.model.toJSON();
			
			this.$el.html(template(context));
			this.$('.select-destination').hide();
			this.model.on('change:name', this.model.validateName);
			this.startName = this.model.get('name');

			this.$('.form').kendoValidator();
			kendo.init(this.$el);
		},
		events: {
			'click .save': 'onComplete',
			'change input': 'inputChangeHandler',
			'change select': 'inputChangeHandler',
			'click .delete': 'deleteClient'
		},
		deleteClient: function() {
			if (this.options.node.hasChildren) {
				new Alert("This investor has entities. To delete this investor, first delete all of its investment entities.", "OK");
				return;
			}
			new Alert("Are you sure you want to permanently delete this investor?", "YES", "NO");
			var that = this;
			
			$(document).bind("alertConfirm", function() {
				var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Deleting investor...'});
				that.model.deleteClient(function(response) {
					loader.closeLoader();
					Hierarchy.hierarchy.select().slideUp();
					that.$el.html('<p class="delete-confirmation">This client has been deleted.</p>');
				});
			});
		},	
		onComplete: function(e) {
			if ($(e.currentTarget).hasClass('create-entity')) {
				this.options.createEntity = true;
			}
			if (this.$('.form').data('kendoValidator').validate()) {
		        this.model.save({}, {
		        	success: _.bind(this.onModelCreate, this),
		        	error: function(response) {
		        		Alert('There was an error creating this client. Error: ' + response, 'OK')
		        	}
		        })
		    }
		},
		onModelCreate: function(model) {
			if (this.options.createEntity) {
				this.listenToOnce(TreeEvents, 'nodeUpdateComplete', function() {
					Router.appRouter.navigate('/add_entity', {trigger: true});	 
				});
			}
			this.trigger('showUiFeedback', 'Success', 'Client "' + this.model.get('name') + '" has been saved.');
			Hierarchy.updateNode(Hierarchy.hierarchy.dataItem(Hierarchy.hierarchy.select()));
		},
		onModelError: function(field, msg) {
			if (field === 'name') {
				Alert('This client name is already in use, please choose another.', 'OK');
				this.model.set({name: this.startName}, {silent: true});
				this.$('[name=name]').val(this.startName);
			}
		},
		inputChangeHandler: function(event) {
			var elem = $(event.target);
			this.model.set(elem.attr('name'), elem.val());
		}
	});
	return AccountsView;
});
