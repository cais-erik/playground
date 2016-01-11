define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_details.html',
	'models/entity_info',
	'collections/products/all_products',
	'amd/backbone/Backbone.ModelBinder',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Handlebars, BaseDetailsView, Template, EntityInfoModel, AllProducts) {
	var entityInfo = BaseDetailsView.extend({
		panelId: 1,
		template: Template,
		productSelects: [],
		fundBooleans: ['affiliatedWithCaisFund','caisFundAdvisor','indirectlyAffiliatedWithCaisFund'],
		initialize: function() {
			BaseDetailsView.prototype.initialize.apply(this, arguments);
			this.products = AllProducts;

			this.listenTo(this.products, 'sync', this.onProductSync);
			this.listenTo(this.model, 'change:affiliatedWithCaisFund', this.setupFundSelectors);
			this.listenTo(this.model, 'change:caisFundAdvisor', this.setupFundSelectors);
			this.listenTo(this.model, 'change:indirectlyAffiliatedWithCaisFund', this.setupFundSelectors);

			// this could be neater...
			this.listenTo(this.model,'change:affiliatedCaisFunds', this.onAffiliatedCaisFundsChange);
			this.listenTo(this.model,'change:caisFundAdvisorFunds', this.onCaisFundAdvisorFundsChange);
			this.listenTo(this.model,'change:indirectlyAffiliatedCaisFunds', this.onIndirectlyAffiliatedCaisFundsChange);
			this.listenTo(this.model, 'change:expectedAffiliation', this.onExpectedAffiliationChange);
			this.listenTo(this.model, 'change:cftcOrNfa', this.onCftcOrNfaChange);

			if (!this.products.length) this.products.fetch();
		},
		events: {},
		postRender: function() {
			this.manageEntitySpecificVisibility();

			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);

			this.setupView();
		},
		setupView: function() {
			var view = this;
			kendo.init(this.$el);
			// setup all the multiselects and push to productSelects array
			this.$('.cais-funds-select').each(function() {
				view.productSelects.push({
					elem: $(this),
					multiselect: $(this).kendoMultiSelect({
						dataSource: {
							data: view.products.toJSON()
						},
						value: view.model.get($(this).attr('name')),
						dataTextField: 'legalName',
						dataValueField: 'productId'
					}).data('kendoMultiSelect')
				});
			});
			this.$('[name="maritalStatus"]').kendoDropDownList();
			this.setupFundSelectors();
			this.onExpectedAffiliationChange();
			this.onCftcOrNfaChange();
		},
		onCftcOrNfaChange: function() {
			var value = this.model.get('cftcOrNfa');
			if (value) this.$('[data-for=cftcOrNfa]').slideDown();
			else this.$('[data-for=cftcOrNfa]').slideUp();
		},
		setupFundSelectors: _.debounce(function() {
			_.each(this.fundBooleans, function(bool) {
				var domElem = this.$('[data-for=' + bool + ']');
				var select = domElem.find('select.cais-funds-select');
				if (this.model.get(bool)) {
					domElem.slideDown().find('.cais-funds-select').attr('required','required');
				} else {
					domElem.slideUp();
					select.removeAttr('required');
					this.model.set(select.attr('name'), []);
					if (select.data('kendoMultiSelect')) select.data('kendoMultiSelect').value('');
				}
			}, this);
		}, 300),
		// parse caisFund ids to integers 
		parseArrayOfInt: function(arr) {
			_.each(arr, function(id, i) { arr[i] = parseInt(id); });
			return arr;
		},
		onExpectedAffiliationChange: function() {
			var value = this.model.get('expectedAffiliation');
			if (value) {
				this.$('[data-for="expectedAffiliation"]').slideDown().find('input').attr('required', 'required');
			} else {
				this.$('[data-for="expectedAffiliation"]').slideUp().find('input').removeAttr('required');
				this.model.set('expectedAffiliationName', '');
			}
		},
		// this could be neater and in the model someplace...
		onAffiliatedCaisFundsChange: function(model, value) {
			this.model.set({'affiliatedCaisFunds': this.parseArrayOfInt(value)}, {trigger: false});
		},
		onCaisFundAdvisorFundsChange: function(model, value) {
			this.model.set({'caisFundAdvisorFunds': this.parseArrayOfInt(value)}, {trigger: false});
		},
		onIndirectlyAffiliatedCaisFundsChange: function(model, value) {
			this.model.set({'indirectlyAffiliatedCaisFundsChange': this.parseArrayOfInt(value)}, {trigger: false});
		},
		onProductSync: function() {
			var dataSource = new kendo.data.DataSource({
				data: this.products.toJSON()
			});
			// set the data on each of the select menus
			_.each(this.productSelects, function(select) {
				select.multiselect.setDataSource(dataSource);
			});
		}
	});
	return entityInfo;
});