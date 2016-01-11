/*
Base entity detail view
Contains basic model interaction and template functions 
note this.panelId and this.template used in child views to set model and template
*/

define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/accounts/entity/entity_address.html',
	'models/entity_info',
	'models/tree/tree_events',
	'views/assets/big_loader'
], function ($, _, Backbone, Vm, Handlebars, Template, EntityInfoModel, TreeEvents, BigLoader, EntityNotifications) {
	var entityInfo = Backbone.View.extend({
		model: EntityInfoModel,
		initialize: function() {
			var modelOptions = {
				params: {
					panelId: this.panelId,
					investmentEntityId: this.options.entity.investmentEntityId
				}
			};
			this.model = new this.model(modelOptions);
			
			if (typeof modelOptions.params.panelId !== 'undefined') {

				this.model.fetch({
					success: _.bind(this.render, this),
					error: function(model, response) {
						Alert('Could not read this entity from the server. Error: ' + $.parseJSON(response.responseText).error, 'OK');
					}
				});
				this.listenTo(this.model, 'change', this.updateInput);
			} else {
				this.render();
			}
		},
		
		render: function() {
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.model.toJSON()));
			this.initKendo();
			if (this.postRender) this.postRender();
		},
		initKendo: function() {
			this.$('.form').setMasks();
			this.$('.form').kendoValidator({
				validateOnBlur: true,
				rules: {
					date: function (input) {
						var currentVal = input.val();
						if (input.attr("data-role") == "datepicker" && (currentVal || input.attr("required") == "required")) {
							var date = kendo.parseDate(currentVal, [ "M/dd/yyyy","yyyy/MM/dd", "M-dd-yyyy","yyyy-MM-dd"]);
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
					},
					validateMultiEmail: function(input) {
						if (input.hasClass('validate-multi-email') && input.val()) {
							var emails = input.val().split(',');
							var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							var valid = true;
							_.each(emails, function(email) {
								valid = regex.test($.trim(email));
							});
							return valid;
						}
						return true;
					}
					/*,
					validateSsn: function(input) {
						if (input.hasClass('ssn') && input.val().length) {
							var pattern = /^\d{3}-\d{2}-\d{4}$/;
							if (input.val().match(pattern)) {
								return true;
							}
							else {
								return false;
							}
						}
						return true;
					}
					*/
				},
				messages: {
					date: "Please enter a valid date",
					radio: "Please select a valid option",
					validateSsn: "Social Security Number must be in format xxx-xx-xxxx"
				}
			});
			this.$('[data-role=dropdownlist]').kendoDropDownList();

			var tooltip = this.$el.kendoTooltip({
				filter: "i.tooltip",
				width: 400,
				position: "top",
				content: function(e) {
					if (e.target.attr('data-tooltipcontainer')) {
						return $(e.target.attr('data-tooltipcontainer')).html();
					}
				}
			}).data("kendoTooltip");
		},
		panelId: 0,
		template: Template,
		events: {
			'change input': 'inputChangeHandler',
			//'change [type=text]': 'inputChangeHandler',
			//'change [type=radio]': 'inputChangeHandler',
			//'change [type=email]': 'inputChangeHandler',
			'change textarea': 'inputChangeHandler',
			'change select': 'inputChangeHandler',
			'click .save': 'saveModel'
		},
		// set model attribute when user changes inputs in UI 
		inputChangeHandler: function(event) {
			var elem = $(event.target);
			var value = elem.val();
			var name = elem.attr('name');
			if (elem.attr('data-role') === 'datepicker') {
				value = kendo.toString(new Date(kendo.parseDate(elem.val(), [ "M/dd/yyyy","yyyy/MM/dd", "M-dd-yyyy","yyyy-MM-dd"])), 'u');
				value = value.split(' ')[0];
			}
			// parse to int
			if (elem.hasClass('parseInt') && !isNaN(value)) value = parseInt(value);
			// parse to boolean
			if (value === 'true' && !elem.hasClass('noparse')) value = true;
			if (value === 'false' && !elem.hasClass('noparse')) value = false;
			this.model.set(elem.attr('name'), value);
		},
		setEntityTypeVisibility: function() {
			var individualIds = [39, 38, 47, 41, 49, 50];
			var value = parseInt(this.model.get('entityTypeOtherId'));
			// if joint or individual, show name and details
			if (_.indexOf(individualIds, value) >= 0) {
				this.$('.individual-fields').show();
				this.$('.non-individual-fields').remove();
			} else {
				this.$('.individual-fields').remove();
				this.$('.non-individual-fields').show();
			}
		},
		manageEntitySpecificVisibility: function() {
			var items = this.$('.type-specific-info');
			var entityTypeId = this.model.get('entityTypeOtherId');
			if (!items) return;
			items.each(function() {
				var ids = $(this).attr('data-typeid').split(',');
				_.each(ids, function(id, i) { ids[i] = parseInt(id) });
				if (_.indexOf(ids, entityTypeId) < 0) $(this).remove();
				else $(this).find('.required').attr('required','required');
			});
		},
		
		saveModel: function(event) {
			
			var alertUserIfSignedDocNecessary = function(model){

				var investmentEntityHasHoldings = model.attributes.investmentEntityHasHoldings;
				var advisorOrClientEmailTurnedOff = model.attributes.advisorOrClientEmailTurnedOff;
				if (investmentEntityHasHoldings){
					Alert('You\'ve updated an entity that has holdings.\n\nA new signed agreement may be required.', 'OK');
				}
				else if (advisorOrClientEmailTurnedOff){
					Alert('You\'ve updated an entity.  You should note that at least one email notification is currently disabled.', 'OK');
				}
			}			
						
			var onSuccess = function(model) {

				alertUserIfSignedDocNecessary(model);
				
				if ($(event.currentTarget).hasClass('continue')) {
					var index = this.$('.nav-link').index(this.$('.nav-link.active'));
					var next = this.$('.nav-link')[index + 1];
					if (!$(next).is(':visible')) next = this.$('.nav-link')[index + 2];
					setTimeout(function() {
						if (next) next.click();
					}, 300);
				}
			}
			
			if (!this.$('.form').data("kendoValidator").validate()) {
				this.model.trigger('validationError', this.model);
				return;
			}
			
			this.model.save(null, {
				success: function(model, response) {
					model.trigger('saveSuccess', model);
					onSuccess(model);
				},
				error: function(model, response) {
					Alert('Could not save the entity to the server. Error: ' + $.parseJSON(response.responseText).error, 'OK');
				}
			});
		},
		deleteModel: function() {
			new Alert("Are you sure you want to permanently delete this investment entity?", "YES", "NO");
			var that = this;
			$(document).bind("alertConfirm", function() {
				var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Deleting entity...'});
				that.model.deleteEntity(function(response) {
					loader.closeLoader();

					TreeEvents.trigger('selected:remove');

					that.$el.html('<p class="delete-confirmation">This entity has been deleted.</p>');
					$('.view-navigation, .control-bar').hide();
				}, function(response) {
					setTimeout(function() {
						loader.closeLoader();
						new Alert($.parseJSON(response.responseText).error, 'OK');
					}, 500);
				});
			});
		}
	});
	return entityInfo;
});