define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_issues_eligibility_exempt.html',
	'models/entity_info',
	'amd/backbone/Backbone.ModelBinder'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel, Binder) {
	// TODO: extend this from entity_issues_eligibility
	var view = BaseDetailsView.extend({
		panelId: 17,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change:benificialInterestsOfRestrictedPersons', this.benificialInterestsOfRestrictedPersonsChange);
			this.listenTo(this.model, 'change:newIssuesExemptDoNotApply', this.onApplicationSwitch);
		},
		events: {
			'click .save': 'saveModel'
		},
		saveModel: function() {
			var checkboxCount = this.$('.disable-container [type="checkbox"]:checked').length;
			if (this.model.get('newIssuesExemptDoNotApply') || checkboxCount) {
				BaseDetailsView.prototype.saveModel.apply(this, arguments);
			} else {
				new Alert('Please select which statements apply or select "None of the above apply".', 'OK');
			}

		},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);
			this.benificialInterestsOfRestrictedPersonsChange();
		},
		benificialInterestsOfRestrictedPersonsChange: function() {
			if (this.model.get('benificialInterestsOfRestrictedPersons')) {
				this.$('.benificialInterestsOfRestrictedPersons-true').slideDown('slow');
			} else {
				this.$('.benificialInterestsOfRestrictedPersons-true').slideUp('slow');
			}
		},
		onApplicationSwitch: function(model, value) {
			if (value) {
				this.$el.addClass('field-inputs-disabled');
				this.$('input[type=checkbox]').not('[name=newIssuesExemptDoNotApply]').removeAttr('checked').change().attr('disabled', 'disabled');
			} else {
				this.$el.removeClass('field-inputs-disabled');
				this.$('input[type=checkbox]').not('[name=newIssuesExemptDoNotApply]').removeAttr('disabled');
			}
		}
	});
	return view;
});