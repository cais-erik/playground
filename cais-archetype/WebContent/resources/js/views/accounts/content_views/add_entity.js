define([
	'jquery',
	'underscore',
	'backbone',
	'routers/accounts_router',
	'events',
	'handlebars',
	'text!templates/accounts/entity/entity_information.html',
	'views/accounts/content_views/entity_details/entity_information',
	'models/entity',
	'collections/other_entity_types',
	'views/accounts/accounts_hierarchy',
	'views/assets/firm_team_advisor_select',
	'validator'
], function ($, _, Backbone, Router, Events, Handlebars, Template, BaseView, Model, OtherEntityTypes, Hierarchy, Selector) {
	var view = BaseView.extend({
		attributes: {
			'class': 'add-entity-view'
		},
		options: {
			advisorTeamId: null, // preselected advisor team
			advisorId: null, // preselected advisor,
			investorId: null, // preselected client,
			continueWorkflow: false, // continue on entity workflow after saving
			hideInvestors: false
		},
		initialize: function() {
			this.events = $.extend({}, BaseView.prototype.events, this.events);
			var selectedIds = Hierarchy.getHierarchyIds();
			if (selectedIds !== 'cais') this.options = $.extend(this.options, selectedIds);
			this.selector = new Selector(this.options);
			this.model = new Model();
			//this.listenTo(this.model, 'validationError', this.onModelError);
			this.listenTo(this.model, 'change:entityTypeOtherId', this.entityChangeHandler);
			this.listenTo(this.model, 'change:usTaxStatusId', this.taxStatusChangeHandler);
			this.listenTo(this.model, 'change:taxExemptBasis', this.taxExemptBasisChangeHandler);

			this.otherEntityTypes = new OtherEntityTypes();
			this.listenTo(this.otherEntityTypes, 'sync', this.onOtherEntityTypeSync);
			
			this.render();
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template(this.model.toJSON()));
			this.$('h1').after(this.selector.$el);
			this.$('.form').kendoValidator({
				validateOnBlur: true,
				rules: {
					date: function (input) {
						if (input.attr("data-role") == "datepicker" && input.attr("required") == "required") {
							var date = kendo.parseDate(input.val(), [ "MMM dd, yyyy","yyyy-MM-dd"]);
							if (date != null) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					},
					radio: function(input) {
						if (input.is("[type=radio]") && input.attr("required")) {
							return $(".form").find("[name=" + input.attr("name") + "]").is(":checked");
						}
						return true;
					}
				},
				messages: {
					date: "Please enter a valid date",
					radio: "Please select a valid option"
				}
			});
			this.$('.accounts-heading').show();
			this.$('.control-bar').show();

			this.otherEntityTypes.fetch();
		},
		events: {
			'click .save': 'onSubmit'
		},
		onSubmit: function(event) {
			var validator = this.$('.form').data("kendoValidator");
			if ($(event.currentTarget).hasClass('continue')) {
				this.options.continueWorkflow = true;
			}
			else {
				this.options.continueWorkflow = false;
			}

			if (validator.validate()) {
				
				this.model.set('clientId', parseInt(this.$('[name=clientId]').val()));
				this.model.set('advisorTeamId', parseInt(this.$('[name=advisorTeamId]').val()));
				this.model.set('userId', parseInt(this.$('[name=advisorId]').val()));
				this.model.set('investorId', parseInt(this.$('[name=investorId]').val()));
				this.model.set('investmentEntityId', null);

				if (!this.model.get('investorId')) {
					Alert('Please select a client', 'OK');
					return false;
				}
				
				this.model.save({}, {
					success: _.bind(this.onModelCreate, this),
					error: function(model, response) {
						Alert('There was an error creating this entity. Error: ' + $.parseJSON(response.responseText).error, 'OK');
					}
				});
			}
		},
		onModelCreate: function(model) {
			var investor = Hierarchy.hierarchy.dataSource.get(model.get('investorId'));
			// if investor is selected, refresh that node
			if (investor) {
				investor.one("change", _.bind(this.onComplete, this));
				investor.hasChildren = true;
				investor.loaded(false);
                investor.load();
			}
			// else just complete
			else {
				this.onComplete();
			}
		},
		onComplete: function() {
			if (this.options.continueWorkflow) {
				Events.on('entity-view-loaded', function(view) {
					view.advanceOne();
					Events.off('entity-view-loaded');
				});
			}
			Router.appRouter.navigate('/detail/' + this.model.get('fragment'), {trigger: true});
			// route to the new entity
			this.trigger('showUiFeedback', 'Success', 'This entity has been created.');
		}
	});
	return view;
});
