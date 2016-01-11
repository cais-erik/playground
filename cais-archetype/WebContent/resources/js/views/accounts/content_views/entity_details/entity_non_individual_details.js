define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'Vm',
	'views/accounts/content_views/entity_details/entity_name_details',
	'text!templates/accounts/entity/entity_non_individual_details.html',
	'models/entity_info',
	'views/accounts/content_views/entity_details/signatories/signatory_form'
], function ($, _, Backbone, Handlebars, Vm, EntityNameDetails, Template, EntityInfoModel, SignatoryForm) {
	var entityInfo = EntityNameDetails.extend({
		panelId: 5,
		template: Template,
		postRender: function() {
			EntityNameDetails.prototype.postRender.apply(this, arguments);

			this.signatoryForm = Vm.create(this, 'SignatoryForm', SignatoryForm, {
				models: this.model.get('signatories')
			});
			this.$('.signatory-form-container').html(this.signatoryForm.$el);
			this.listenTo(this.signatoryForm, 'collectionChange', this.onSignatoryChange);
			this.listenTo(this.model, 'change:nonRegisteredInvestorCompany', this.onNonRegisteredInvestorCompanyChange);
			
			this.onNonRegisteredInvestorCompanyChange();
		},
		onSignatoryChange: function(signatories) {
			_.each(signatories, function(signatory) {
				signatory.investmentEntityId = this.model.get('investmentEntityId');
			}, this);
			this.model.set('signatories', signatories);
		},
		onNonRegisteredInvestorCompanyChange: function() {
			var value = this.model.get('nonRegisteredInvestorCompany');
			if (value) this.$('[data-for=nonRegisteredInvestorCompany]').slideDown();
			else this.$('[data-for=nonRegisteredInvestorCompany]').slideUp();
		}
	});
	return entityInfo;
});