define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_issues_eligibility.html',
	'models/entity_info',
	'amd/backbone/Backbone.ModelBinder'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel, Binder) {
	var view = BaseDetailsView.extend({
		panelId: 7,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change:isNewIssuesEligibilityApply', this.onApplicationSwitch);
		},
		events: {
			'click .save': 'saveModel'
		},
		saveModel: function() {
			var checkboxCount = this.$('.disable-container [type="checkbox"]:checked').length;
			if (this.model.get('isNewIssuesEligibilityApply') || checkboxCount) {
				BaseDetailsView.prototype.saveModel.apply(this, arguments);
			} else {
				new Alert('Please select which statements apply or select "None of the above apply".', 'OK');
			}
		},
		postRender: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);
			this.onApplicationSwitch(this.model, this.model.get('isNewIssuesEligibilityApply'));
		},
		onApplicationSwitch: function(model, value) {
			if (value === false || value === null) this.enableFields();
			else this.disableFields();
		},
		enableFields: function() {
			this.$el.removeClass('field-inputs-disabled');
			this.$('input[type=checkbox]').not('[name=isNewIssuesEligibilityApply]').removeAttr('disabled');
		},
		disableFields: function() {
			this.$el.addClass('field-inputs-disabled');
			this.$('input[type=checkbox]').not('[name=isNewIssuesEligibilityApply]').removeAttr('checked').change().attr('disabled', 'disabled');
		}
	});
	return view;
});