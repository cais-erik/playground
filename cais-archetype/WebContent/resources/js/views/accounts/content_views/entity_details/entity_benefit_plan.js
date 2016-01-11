define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_benefit_plan.html',
	'models/entity_info',
	'models/authed_user',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel, AuthUser) {
	var view = BaseDetailsView.extend({
		panelId: 6,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change:invFundPooled', this.onInvFundPooledChange);
			this.listenTo(this.model, 'change:isBenefitPlanInvestor', this.isBenefitPlanInvestorChange);
			this.listenTo(this.model, 'change:isIrisaInsuranceCo', this.isIrisaInsuranceCoChange);
			this.listenTo(this.model, 'change:erisa', this.erisaChange);
		},
		events: {},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);

			this.setEntityTypeVisibility();
			this.$('[data-role=numerictextbox]').kendoNumericTextBox({
				spinners: false
			});
			this.setupView();
		},
		setupView: function() {
			this.isBenefitPlanInvestorChange(this.model, this.model.get('isBenefitPlanInvestor'));
			this.erisaChange(this.model, this.model.get('erisa'));
			this.onInvFundPooledChange();
			this.isIrisaInsuranceCoChange();
		},
		isIrisaInsuranceCoChange: function() {
			if (this.model.get('isIrisaInsuranceCo')) {
				this.$('.is-irisa-insurance-inputs').slideDown();
			} else {
				this.$('.is-irisa-insurance-inputs').slideUp();
			}
		},
		isBenefitPlanInvestorChange: function(model, value) {
			if (!value) {
				this.$('.no-benefit-plan-input').slideDown();
			} else {
				this.$('.no-benefit-plan-input').slideUp();
			}
		},
		onInvFundPooledChange: function() {
			if (this.model.get('invFundPooled')) {
				this.$('.pooled-inv-fund-inputs').slideDown();
			} else {
				this.$('.pooled-inv-fund-inputs').slideUp();
			}
		},
		erisaChange: function(model, value) {
			if (!value) {
				this.$('.no-erisa-input').slideDown();
				this.$('.erisa-input').slideUp();
			} else {
				this.$('.no-erisa-input').slideUp();
				this.$('.erisa-input').slideDown();
			}
		}
	});
	return view;
});