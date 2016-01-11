/*
EntityCustodianInfo view
extends BaseDetailsView
*/

define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_custodian_information.html',
	'text!templates/assets/custodian_info_selectors.html',
	'models/entity_info',
	'collections/custodian_info',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, CustodianSelectorTemplate, EntityInfoModel, CustodianInfo, Binder) {
	var EntityCustodianInfo = BaseDetailsView.extend({
		panelId: 8,
		template: Template,
		_modelBinder: undefined,
		_needCustodianReportSet: false,
		_defaultRequiredFields: ['custodianPrimaryContactName','email','custodianAccountNumber'],
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			// big hack to refresh the model with the correct fully qualified name when model is saved
			this.listenTo(this.model, 'saveSuccess', _.bind(function(model) {
				this.custodianInfo.fetch({
					success: _.bind(function() {
						var custodian = this.custodianInfo.get(this.model.get('custodianId'));
						if (custodian) {
							this.model.set({'fullyQulifiedCustodianName': custodian.get('fullyQulifiedCustodianName')});
						}
					}, this)
				});
			}, this));
		},
		postRender: function() {
			// bootstrap the custodian info
			this.custodianInfo = new CustodianInfo();
			this.custodianInfo.params.investmentEntityId = this.model.get('params').investmentEntityId;
			this.custodianInfo.setUrl();
			this.custodianInfo.fetch({
				success: _.bind(function (collection) {
					// output the custodians to the template select box
					var template = Handlebars.compile(CustodianSelectorTemplate);
					this.$('[name=custodianId]').html(template(collection.toJSON()));
					// if there's a custodian with a default value and no custodian has been chosen, set the entity model
					collection.each(function(model) {
						if (model.get('isDefault') && !this.model.get('custodianId')) {
							this.model.set({
								'custodianId': model.get('idCustodianNames'),
								'custodianPrefix': model.get('custodianPrefix'),
								'custodianPostfix': model.get('custodianPostfix'),
								'fullyQulifiedCustodianName': model.get('fullyQulifiedCustodianName'),
								'custodianPrimaryContactName': model.get('custodianPrimaryContactName'),
								'email': model.get('contactEmail'),
								'needCustodianReport': true
							});
						}
					}, this);
					this.initBindings();
					this.$('[name=custodianId]').kendoDropDownList();
				}, this)
			});
		},
		// override events hash in BaseDetailsView to prevent default BaseDetailsView field binding
		events: {
			'click .save': 'saveModel'
		},
		initBindings: function() {
			// create a new model binder instance and custom bindings
			this._modelBinder = new Backbone.ModelBinder();
			var bindings = Backbone.ModelBinder.createDefaultBindings(this.$el, 'name');
			var view = this;
			var custodian = this.custodianInfo.get(this.model.get('custodianId'));
			
			/*bindings.fullyQulifiedCustodianName = {
				selector: '[name="fullyQulifiedCustodianName"]',
				converter: function(direction, value) {
					if (direction === 'ModelToView') {
						if (value) view.$('.sub-doc-name-preview').slideDown();
						else view.$('.sub-doc-name-preview').slideUp();
						return value;
					}
				}
			};*/
			bindings.needCustodianReport = {
				selector: '[name="needCustodianReport"]',
				// server accepts this value as string true/false
				converter: function(direction, value) {
					if (direction === 'ModelToView') {
						if (value === true) return 'true';
						if (value === false) return 'false';
						return '';
					} else {
						if (value === 'true') return true;
						if (value === 'false') return false;
						return null;
					}
				}
			};
			// bind the model binder to the view
			this._modelBinder.bind(this.model, this.el, bindings);

			// listen to these model change events
			this.listenTo(this.model, 'change:custodianId', this.onCustodianChange);
			this.listenTo(this.model, 'change:needCustodianReport', this.needsReportChange);

			if (this.model.get('needCustodianReport') !== null) {
				this._needCustodianReportSet = true;
			}

			// if a custodian was selected, load the custo info into the model
			if (custodian && this._needCustodianReportSet) {
				this.model.set({
					'fullyQulifiedCustodianName': custodian.get('fullyQulifiedCustodianName')
				});
				this.setCustodianType(this.model.get('custodianId'));
			}
			if (!this.model.get('needCustodianReport')) {
				this.$('[name=custodianPrefix]').attr('disabled', 'disabled');
				this.makeAllNotRequired();
			}
		},
		onCustodianChange: function() {
			// the active custodian model
			var custId = this.model.get('custodianId');
			var custodian = this.custodianInfo.get(custId);
			var wantsReporting = this.model.get('needCustodianReport');
			// setup the view for the custodian type
			this.setCustodianType(custId);
			if (!custodian) return;
			
			// set the selected custodian attrs in the model
			this.model.set({
				'custodianPrefix': wantsReporting ? custodian.get('custodianPrefix') : null,
				'custodianPostfix': custodian.get('custodianPostfix'),
				'custodianPrimaryContactName': custodian.get('custodianPrimaryContactName'),
				'email': custodian.get('contactEmail')
			});
			if (this._needCustodianReportSet) {
				this.model.set({
					'fullyQulifiedCustodianName': custodian.get('fullyQulifiedCustodianName')
				});
			}
		},
		needsReportChange: function() {
			// the active custodian
			var custodian = this.custodianInfo.get(this.model.get('custodianId'));
			// wants custodian reports
			if (this.model.get('needCustodianReport')) {
				this.$('[name=custodianPrefix]').removeAttr('disabled');
				if (custodian) {
					if (custodian.get('custodianPrefix')) this.model.set("custodianPrefix", custodian.get('custodianPrefix'));
				}
				this.makeDefaultsRequired();
			}
			// does not want custodian reports
			else {
				this.model.set('custodianPrefix', '');
				this.makeAllNotRequired();
				this.$('[name=custodianPrefix]').attr('disabled', 'disabled');
			}
		},
		// modifies the view for the selected custodianId
		setCustodianType: function(custId) {
			// N/A selected
			if (custId === 8) this.setNotApplicable();
			else this.$('[type=text], [type=tel], [type=email]').not('[name=custodianPrefix]').removeAttr('disabled').change();

			// other selected 
			if (custId === 7) this.showOtherCustodian();
			else this.hideOtherCustodian();
		},
		// configures the fields for when N/A is selected
		setNotApplicable: function() {
			if (this.model.get('needCustodianReport')) {
				this.model.set('needCustodianReport', false);
			}
			this.$('[type=text], [type=tel], [type=email]').val('').change().attr('disabled', 'disabled');
			// this.$('[name=custodianPrefix]').removeAttr('required');
			// this.$('[for=custodianPrefix]').text('Custodian Prefix');
			this.makeAllNotRequired();
		},
		// sets all fields accept needCustodianReport to not requried
		makeAllNotRequired: function() {
			this.$('input[required]').each(function() {
				var label = $(this).prev('label');
				if ($(this).attr('name') !== 'needCustodianReport') {
					$(this).removeAttr('required');
					label.text(label.text().replace('*', ''));
				}
			});
		},
		// makes all fields in _defaultRequiredFields required
		makeDefaultsRequired: function() {
			_.each(this._defaultRequiredFields, function(field) {
				var input = this.$('[name='+ field + ']');
				var label = input.prev('label');
				input.attr('required', 'required').removeAttr('disabled');
				label.text(label.text().replace('*', ''));
				label.text(label.text() + '*');
			}, this);
			if (this.model.get('custodianId') === 7) {
				var otherInput = this.$('[name=otherCustodianName]');
				otherInput.attr('required', 'required');
				otherInput.prev('label').text(otherInput.prev('label').text() + '*');
			}
		},
		showOtherCustodian: function(timing) {
			this.$('.other-custodian-name').slideDown(timing || 'slow').find('input').attr('required', 'required');
		},
		hideOtherCustodian: function() {
			this.$('.other-custodian-name').slideUp().find('input').removeAttr('required');
		},
		onClose: function() {
			this._modelBinder.unbind();
			this.stopListening();
		}
	});
	return EntityCustodianInfo;
});