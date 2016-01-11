define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_political_affiliation.html',
	'models/entity_info',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel, Binder) {
	var view = BaseDetailsView.extend({
		panelId: 16,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change:hasPoliticalAffiliation', this.onPoliticalAffiliationChange);
			this.listenTo(this.model, 'change:isGovernmentEntity', this.onIsGovernmentEntityChange);
			this.listenTo(this.model, 'change:payToPlay', this.onPayToPlayChange);
			this.listenTo(this.model, 'change:entityOwnedByGovernment', this.onEntityOwnedByGovernmentChange);
		},
		events: {
			'click .save': 'saveModel'
		},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);
			this.setEntityTypeVisibility();
			this.setupView();
		},
		setupView: function() {
			this.onPayToPlayChange();
			this.onPoliticalAffiliationChange();
			this.onIsGovernmentEntityChange();
			this.onEntityOwnedByGovernmentChange();
		},
		onEntityOwnedByGovernmentChange: function() {
			var isEntityOwnedByGovernment = this.model.get('entityOwnedByGovernment');
			if (isEntityOwnedByGovernment) {
				this.$('.has-entityOwnedByGovernment').slideDown('fast');
				this.$('[name=entityOwnedByGovernmentName]').attr('required', 'required');
			} else {
				this.$('.has-entityOwnedByGovernment').slideUp('slow');
				this.$('[name=entityOwnedByGovernmentName]').removeAttr('required');
			}
		},
		onPayToPlayChange: function() {
			var isPayToPlay = this.model.get('payToPlay');
			if (isPayToPlay) {
				this.$('.is-pay-to-play').slideDown('fast');
				this.$('[name=payToPlayList]').attr('required', 'required');
			} else {
				this.$('.is-pay-to-play').slideUp('slow');
				this.$('[name=payToPlayList]').removeAttr('required');
			}
		},
		onIsGovernmentEntityChange: function() {
			var isGovEntity = this.model.get('isGovernmentEntity');
			if (isGovEntity) {
				this.$('.is-government-entity').slideDown('fast');
				this.$('[name=entityAffiliatedGovernment], [name=payToPlay]').attr('required', 'required');
			} else {
				this.$('.is-government-entity').slideUp('slow');
				this.$('[name=entityAffiliatedGovernment], [name=payToPlay]').removeAttr('required');
			}
		},
		onPoliticalAffiliationChange: function() {
			var hasPoliticalAffiliation = this.model.get('hasPoliticalAffiliation');
			if (hasPoliticalAffiliation) {
				this.$('.has-political-affiliation').slideDown('fast');
				this.$('[name=affiliatedGovernment], [name=affiliatedGovernmentPosition]').attr('required', 'required');
			} else {
				this.$('.has-political-affiliation').slideUp('slow');
				this.$('[name=affiliatedGovernment], [name=affiliatedGovernmentPosition]').removeAttr('required');
			}
		}
	});
	return view;
});