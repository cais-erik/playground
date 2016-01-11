/*
View that dispactches entity details
This might be better if detail views were called via require calls rather than bootstrapped all at once.
*/

define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/entity_view.html',
	'models/tree/tree_events',
	'events',
	'views/accounts/detail_nav/detail_nav',
	'views/accounts/content_views/entity_details/entity_information',
	'views/accounts/content_views/entity_details/entity_name_details',
	'views/accounts/content_views/entity_details/entity_non_individual_details',
	'views/accounts/content_views/entity_details/entity_employment',
	'views/accounts/content_views/entity_details/entity_address',
	'views/accounts/content_views/entity_details/entity_documents',
	'views/accounts/content_views/entity_details/entity_advisor_details',
	'views/accounts/content_views/entity_details/entity_client_details',
	'views/accounts/content_views/entity_details/entity_benefit_plan',
	'views/accounts/content_views/entity_details/entity_issues_eligibility',
	'views/accounts/content_views/entity_details/entity_issues_eligibility_exempt',
	'views/accounts/content_views/entity_details/entity_custodian_information',
	'views/accounts/content_views/entity_details/entity_standing_wire',
	'views/accounts/content_views/entity_details/entity_notifications',
	'views/accounts/content_views/entity_details/entity_political_affiliation',
	'views/accounts/content_views/entity_details/entity_accredited_investor',
	'views/accounts/content_views/entity_details/entity_qualified_client',
	'views/accounts/content_views/entity_details/entity_qualified_person',
	'views/accounts/content_views/entity_details/entity_qualified_purchaser',
	'views/accounts/content_views/entity_details/entity_australia_qualification',
	'views/accounts/content_views/entity_details/entity_trade_details'
], function ($, _, Backbone, Vm, Template, TreeEvents, Events, ViewNav, InfoView, NameDetails, NonIndivDetails, Employment, Address, Documents, AdvisorInfo, ClientInfo, BenefitPlan, EntityIssuesEligibility, EntityIssuesEligibilityExempt, EntityCustodianInformation, EntityStandingWire, EntityNotifications, EntiityPoliticalAffiliation, EntityAccreditedInvestor, EntityQualifiedClient, EntityQualifiedPerson, EntityQualifiedPurchaser, EntityAustraliaQualification, EntityTradeDetails) {
	var view = Backbone.View.extend({
		options: {
			startSection: 'entity-information'
		},
		initialize: function() {
			this.viewNav = Vm.create(this, 'EntityViewNav', ViewNav, {investmentEntityId: this.options.node.investmentEntityId});
			this.listenTo(this.viewNav, 'navLinkSelected', this.onDetailNavChange);
			this.render();
		},
		className: 'entity-view',
		render: function() {
			this.$el.html(Template);
			this.$('#entity-content').after(this.viewNav.$el);
			if (this.options.startSection) this.viewNav.selectSection(this.options.startSection);
		},
		events: {
			'click .save': 'saveModel',
			'click .delete': 'deleteModel'
		},
		entitySubViews: {
			'entity-name-details': NameDetails,
			'entity-nonindiv-details': NonIndivDetails,
			'entity-information': InfoView,
			'entity-employment': Employment,
			'entity-address': Address,
			'entity-documents': Documents,
			'entity-advisor-info': AdvisorInfo,
			'entity-client-info': ClientInfo,
			'entity-benefit-plan': BenefitPlan,
			'entity-issues-eligibility': EntityIssuesEligibility,
			'entity-issues-eligibility-exempt': EntityIssuesEligibilityExempt,
			'entity-custodian-information': EntityCustodianInformation,
			'entity-standing-wire': EntityStandingWire,
			'entity-political-affiliation': EntiityPoliticalAffiliation,
			'entity-notifications': EntityNotifications,
			'entity-accredited-investor': EntityAccreditedInvestor,
			'entity-qualified-client': EntityQualifiedClient,
			'entity-qualified-person': EntityQualifiedPerson,
			'entity-qualified-purchaser': EntityQualifiedPurchaser,
			'entity-australia-qualification': EntityAustraliaQualification,
			'entity-trade-details': EntityTradeDetails
		},
		onDetailNavChange: function(navType) {
			var newView = this.entitySubViews[navType];
			var that = this;
			var renderView = function() {
				that.subView = Vm.create(that, 'EntityDetailView', newView, {entity:that.options.node});
				that.listenTo(that.subView.model, 'saveSuccess', that.onSaveSuccess);
				that.listenTo(that.subView.model, 'validationError', that.onValidationError);
				that.listenTo(that.subView.model, 'change:entityTypeOtherId', that.onEntityTypeChange);
				that.listenTo(that.subView.model, 'change:citizenship', that.onCitizenshipChange);
				that.$('.control-bar').before(that.subView.$el);
				that.subView.$el.hide().fadeIn('fast', function() {
					Events.trigger('entity-view-loaded', that);
				});
			}
			if (!newView) throw('No entity view titled: ' + navType); 
			if (this.subView) {
				this.subView.$el.fadeOut('fast', function() {
					that.subView.remove();
					that.stopListening(that.subView.model);	
					renderView();
				});
			} else {
				renderView();
			}
		},
		advanceOne: function() {
			var nextAvailable = this.viewNav.$('.nav-link.active').nextAll().not('.disabled');
			var next = nextAvailable.first();
			setTimeout(function() {
				next.click();
			}, 300);
		},
		saveModel: function(event) {
			this.subView.saveModel(event);
		},
		deleteModel: function() {
			this.subView.deleteModel();
		},
		onSaveSuccess: function(model) {
			// reset the checkboxes in the viewNav
			this.viewNav.initCheckboxes(model);
			TreeEvents.trigger('updateNode', this.options.node, model);
			Events.trigger('showUiFeedback', 'Success', 'This entity has been saved.');
		},
		onValidationError: function(model) {
			Events.trigger('showUiFeedback', 'Error', 'Please check your input for errors.');
		},	
		onCitizenshipChange: function(model, value) {
			// show and hide australia qualification
			if (value === 'AU') {
				this.viewNav.showAustQualification();
			} else {
				this.viewNav.hideAustQualification();
			}
		},
		onEntityTypeChange: function(model, value) {
			var individualIds = [39, 38, 47, 41, 49, 50];
			value = parseInt(value);
			// if joint or individual, show name and details
			if (_.indexOf(individualIds, value) >= 0) {
				this.viewNav.showIndivDetails(value);
			} else {
				this.viewNav.hideIndivDetails(value);
			}
		}
	});
	return view;
});