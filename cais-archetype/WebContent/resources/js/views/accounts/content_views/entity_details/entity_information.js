define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_information.html',
	'text!templates/assets/investor_type_selectors.html',
	'models/entity_info',
	'collections/other_entity_types'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, TaxSelectorTemplate, EntityInfoModel, OtherEntityTypes) {
	var entityInfo = BaseDetailsView.extend({
		model: EntityInfoModel,
		panelId: 0,
		template: Template,
		taxSelectorTemplate: Handlebars.compile(TaxSelectorTemplate),
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.otherEntityTypes = new OtherEntityTypes();

			this.listenTo(this.otherEntityTypes, 'sync', this.onOtherEntityTypeSync);
			this.listenTo(this.model, 'change:entityTypeOtherId', this.entityChangeHandler);
			this.listenTo(this.model, 'change:usTaxStatusId', this.taxStatusChangeHandler);
			this.listenTo(this.model, 'change:entityTypeId', this.onEntityTypeIdChange);
			this.listenTo(this.model, 'change:taxExemptBasis', this.taxExemptBasisChangeHandler);
		},
		postRender: function() {
			this.entityChangeHandler(this.model, this.model.get('entityTypeOtherId'));
			this.taxStatusChangeHandler(this.model, this.model.get('usTaxStatusId'));
			this.taxExemptBasisChangeHandler(this.model, this.model.get('taxExemptBasis'));
			this.onEntityTypeIdChange(this.model, this.model.get('entityTypeId'));
			this.otherEntityTypes.fetch();
		},
		onOtherEntityTypeSync: function() {
			var selector = this.$('#us-tax-exempt-statuses');
			selector.html(this.taxSelectorTemplate(this.otherEntityTypes.us_tax_exempt_basis));
			selector.val(this.model.get('taxExemptBasis'));
			selector.kendoDropDownList();
		},
		entityChangeHandler: function(model, value) {
			if (parseInt(value) === 18) {
				this.$('#other-entity-type, #entityOtherTextInput').removeAttr('disabled').slideDown();
			}
			else {
				this.$('#other-entity-type, #entityOtherTextInput').attr('disabled', 'disabled').slideUp();
			}
			if (parseInt(value) === 51) {
				this.$('.show-for-entityTypeDetail51').slideDown();
			} else {
				this.$('.show-for-entityTypeDetail51').slideUp().find('input').val('');
			}
		},
		onEntityTypeIdChange: function(model, value) {
			if (parseInt(value) === 14) {
				this.$('.show-for-entityTypeId14').slideDown();
			} else {
				this.$('.show-for-entityTypeId14').slideUp().find('input').val('');
			}
		},
		taxStatusChangeHandler: function(model, value) {
			if (parseInt(value) === 8) {
				this.$('[name=taxExemptBasis]').removeAttr('disabled');
				this.$('.tax-exempt-info').slideDown();
			}
			else {
				this.$('[name=taxExemptBasis], #taxExemptStatusOther').attr('disabled', 'disabled').val('');
				this.model.set('taxExemptStatusOther', '');
				this.model.set('taxExemptBasis', '');
				this.$('.tax-exempt-info').slideUp();
			}
			this.$('[data-role=dropdownlist]').kendoDropDownList();
		},
		taxExemptBasisChangeHandler: function(model, value) {
			if (parseInt(value) === 83) { // other
				this.$('#taxExemptStatusOther').removeAttr('disabled').slideDown();
			}
			else {
				this.$('#taxExemptStatusOther').attr('disabled', 'disabled').val('').slideUp();
				this.model.set('taxExemptStatusOther', '');
				// this.model.set('taxExemptBasis', '');
			}
		}
	});
	return entityInfo;
});