define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_address.html',
	'models/entity_info',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel) {
	var entityInfo = BaseDetailsView.extend({
		panelId: 3,
		template: Template,
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.events = $.extend({}, BaseDetailsView.prototype.events, this.events);
		},
		postRender: function() {
			if (!this.model.get('mailing_street1')) {
				var that = this;
				// prepopulate client address
				Server.getInvestorDetails({investorId: this.options.entity.parent().parent().investorId}, function (response) {
					if (response.length) {
						that.model.set({
							"residence_street1": response[0].street1,
							"residence_street2": response[0].street2,
							"residence_country": response[0].country,
							"residence_city": response[0].city,
							"residence_state": response[0].state,
							"residence_postalCode": response[0].postalCode
						});
						var template = Handlebars.compile(Template);
						that.$el.html(template(that.model.toJSON()));
						that.initKendo();
					}
				});
			}
			if (this.model.get('mailing_street1') === this.model.get('residence_street1') && 
				this.model.get('mailing_city') === this.model.get('residence_city') &&
				this.model.get('mailing_street2') === this.model.get('residence_street2')) {
				this.$('#sameAsMailing').attr('checked', 'checked');
				this.$('.mailing-address input[type=text]').attr('disabled', 'disabled');
				this.$('[name=mailing_country]').data('kendoDropDownList').enable(false);
			}
		},
		events: {
			'change #sameAsMailing': 'sameAddressChangeHandler'
		},
		sameAddressChangeHandler: function(event) {
			// var dropDownList = this.$('[name=mailing_country],').data('kendoDropDownList');
			if ($(event.target).is(':checked')) {
				this.$('.mailing-address input[type=text]').attr('disabled', 'disabled');
				// change over all the values here...
				this.model.set({
					'mailing_city': this.model.get('residence_city'),
					'mailing_country': this.model.get('residence_country'),
					'mailing_postalCode': this.model.get('residence_postalCode'),
					'mailing_state': this.model.get('residence_state'),
					'mailing_street1': this.model.get('residence_street1'),
					'mailing_street2': this.model.get('residence_street2')
				});
				this.render();
				this.$('[name=mailing_country]').data('kendoDropDownList').enable(false);
			}
			else {
				this.$('[name=mailing_country]').data('kendoDropDownList').enable();
				this.$('.mailing-address input[type=text]').removeAttr('disabled');
			}
		}
	});
	return entityInfo;
});