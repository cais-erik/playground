define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/accounts/entity/notifications/notifications_details.html',
	'text!templates/accounts/entity/notifications/notifications_details_advisor.html',
	'text!templates/accounts/entity/notifications/notifications_details_client.html',
	'text!templates/accounts/entity/notifications/notifications_details_thirdparty.html'
], function ($, _, Backbone, Handlebars, Template, AdvisorTemplate, ClientTemplate, ThirdPartyTemplate) {
	var view = Backbone.View.extend({
		initialize: function() {
			//this.render();
		},
		render: function() {
			var context = {
				selectedParty: this.model.partyDetails.toJSON()
			};

			if (this.model.get('notificationType') === "ADVISOR") {
				var template = Handlebars.compile(AdvisorTemplate);
			} else if (this.model.get('notificationType') == "CLIENT") {
				var template = Handlebars.compile(ClientTemplate);
			} else {
				var template = Handlebars.compile(ThirdPartyTemplate);
			}
			this.$el.html(template(context));
			this.$('[data-role=dropdownlist]').kendoDropDownList();
		},
		events: {
			'click .save-party': 'savePartyDetails',
			'change .interested-party-form input': 'interestedPartyChangeHandler',
			'change .interested-party-form select': 'interestedPartyChangeHandler'
		},
		interestedPartyChangeHandler: function(event) {
			var elem = $(event.target);
			var value = elem.val();
			var name = elem.attr('name');
			if (elem.attr('data-role') === 'datepicker') {
				value = kendo.toString(new Date(kendo.parseDate(elem.val(), [ "MMM dd, yyyy","yyyy-MM-dd"])), 'u');
				value = value.split(' ')[0];
			}
			// ugly hack for server not supporting numbers as int
			if (elem.hasClass('noparse')) {
			}
			else {
				if (!isNaN(value)) value = parseInt(value);	
			}
			if (value === 'true') value = true;
			if (value === 'false') value = false;
			this.model.partyDetails.set(elem.attr('name'), value);
		},
		savePartyDetails: function() {
			if(IndividualValidatorFactory.validate($("#thirdPartyContent").parents(".interested-party-form")) ){
				var that = this;
				this.model.editParty(function() {
					that.trigger('partyUpdate', this);
				}, function() {
					Alert('There was a problem saving the party details.', 'OK');
				});
			}
		},
		
		loadModel: function(model) {
			this.model = model;
			var that = this;

			// if the hierarchy tree is present, load the view and get the data from it
			if ($('#accountView #group-tree-wrapper').length) {
				require(['views/accounts/accounts_hierarchy'], function(Hierarchy) {
					var hierarchy = Hierarchy.hierarchy;
					var advisor = hierarchy.dataItem(hierarchy.parent(hierarchy.parent(hierarchy.select())));
					var selectedItem = hierarchy.dataItem(hierarchy.select());
					var options = {
						notificationType: model.get('notificationType'),
						userId: advisor.userId,
						advisorTeamName: advisor.advisorTeamName,
						advisorTeamId: selectedItem.advisorTeamId,
						investorId: hierarchy.dataItem(hierarchy.parent(hierarchy.select())).investorId,
					};
					that.model.getPartyDetails(options, function(details) {
						that.render();	
					});
				});
			} else { // else get data from view options (used on trade-ticket window)
				var options = {
					notificationType: model.get('notificationType'),
					userId: this.options.entity.advisorId || null,
					advisorTeamName: null,
					investorId: this.options.entity.investorId || null
				};
				this.model.getPartyDetails(options, function(details) {
					that.render();	
				});
			}
		},
		
		createNew: function(notificationModel) {
			var selectedParty = {
				type: "other",
				other: null,
				name: "",
				phone: "",
				phoneMobile: "",
				email: "",
				fax: "",
				country: "",
				street1: "",
				street2: "",
				city: "",
				state: "",
				postalCode: "",
				investmentEntityId: this.options.entity.investmentEntityId
			};
			this.model = notificationModel;
			this.model.partyDetails.set(selectedParty);
			this.render();
			this.$('[name=name]').focus();
		}
	});
	return view;
});