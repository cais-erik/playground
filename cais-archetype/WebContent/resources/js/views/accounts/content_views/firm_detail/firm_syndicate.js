define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'amd/backbone/Backbone.ModelBinder',
	'models/firm',
	'text!templates/accounts/firm_detail/firm_syndicate_accts.html',
	'text!templates/accounts/firm_detail/assets/account_row_template.html',
	'models/account/syndicate_ria',
	'models/account/syndicate_broker_dealer',
	'views/accounts/content_views/firm_detail/syndicate_permissioner',
	'views/assets/confirm_dialog',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Binder, FirmModel, Template, RowTemplate, CapMarketRia, CapMarketBrokerDealer, CapMarketPermissioner, ConfDialog) {
	var FirmCapMarkets = Backbone.View.extend({
		options: {},
		className: 'firm-cap-markets',
		_modelBinder: undefined,
		accountModel: null,
		initialize: function() {
			$('.firm-details .primaryButton.continue').hide();
			$('.firm-details .primaryButton.continue span').text('SAVE');
			this._modelBinder = new Backbone.ModelBinder();
			this.collection = this.model.capMarketsAccounts;
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'remove', this.removeOne);
			this.listenTo(this.collection, 'select', this.selectModel);
			this.listenTo(this.collection, 'change', this.refreshTable);

			this.collection.reset().fetch();
			this.render();
		},
		render: function() {
			var context = {
				//parties: this.collection.toView()
			};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			kendo.init(this.$el);
			this.permissioner = Vm.create(this, 'CapMarketPermissioner', CapMarketPermissioner, {client:this.model});
			this.$('.cap-market-permissioner-container').html(this.permissioner.$el);

			this.accountTypeChangeHandler();
		},
		events: {
			'change [name=accountType]': 'accountTypeChangeHandler',
			// 'click .save-party-details': 'saveParty',
			'click .remove': 'removeParty',
			'click tbody tr': 'tableRowClickHandler',
			'click .create-new-party': 'showCreateNew'
		},
		showCreateNew: function() {
			this.$('#add-cap-market-acct').fadeIn('fast');
			$('.firm-details .primaryButton.continue').show();
			this.collection.trigger('select', null);
			this.permissioner.deslectAllAdvisors();
			this.accountTypeChangeHandler();
		},
		addOne: function(model, collection, options) {
			var template = Handlebars.compile(RowTemplate);
			var row = template(model.toView());
			this.$('tr.empty').hide();
			this.$('tbody').append(row);
		},
		removeOne: function(model, collection, options) {
			var that = this;
			this.$('tbody tr#' + model.id).fadeOut('slow', function() {
				$(this).remove();
				if (that.$('tbody tr').length === 1) that.$('tr.empty').show();
				that.$('#add-cap-market-acct').fadeOut();
			});
		},
		refreshTable: function(model) {
			var that = this;
			this.$('tbody').empty();
			this.collection.each(function(model) {that.addOne(model);});
			this.$('tbody tr#' + this.accountModel.id).addClass('selected');
		},
		removeParty: function(e) {
			var that = this;
			var id = $(e.currentTarget).parents('tr').attr('id');
			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: 'Are you sure you would like to delete this account?',
				confirmCallback: function() {
					that.collection.get(id).destroy({
						error: function(response) {
							Alert('This account could not be deleted.', 'OK');
						},
						wait: true
					});
					$('.firm-details .primaryButton.continue').hide();
				}
			});
		},
		tableRowClickHandler: function(e) {
			var elem = $(e.currentTarget);
			if (elem.hasClass('empty')) return;
			elem.siblings('tr').removeClass('selected');
			elem.addClass('selected');
			this.$('#add-cap-market-acct').show();
			var selectedModel = this.collection.get($(e.currentTarget).attr('id'));
			this.collection.trigger('select', selectedModel);
		},
		selectModel: function(model) {
			if (!model) {
				this.$('tr.selected').removeClass('selected');
				this.accountModel = null;
				return;
			}

			var that = this;
			this.accountModel = model;
			
			if (model.id) {
				this.$('.acct-type-selector').hide();
				$('.firm-details .primaryButton.continue').show();
			} else {
				this.$('.acct-type-selector').show();
			}
			if (model.accountType === 'RIA Block') {
				this.$('.broker-dealer-attrs').fadeOut('fast', function() {
					that.$('.ria-attrs').fadeIn('slow');
				});
				this._modelBinder.bind(this.accountModel, this.$('.ria-attrs'));
				this.validator = this.$('.ria-attrs').kendoValidator().data('kendoValidator');
			} else {
				this.$('.ria-attrs').fadeOut('fast', function() {
					that.$('.broker-dealer-attrs').fadeIn('slow');
				});
				this._modelBinder.bind(this.accountModel, this.$('.broker-dealer-attrs'));
				this.validator = this.$('.broker-dealer-attrs').kendoValidator().data('kendoValidator');
			}
			this.$('[name=sellingConcession]').trigger('blur');
			this.permissioner.changeAccountModel(this.accountModel);
		},
		accountTypeChangeHandler: function(e) {
			var type = this.$('[name=accountType]').val();
			var that = this;
			if (type === 'RIA') {
				this.selectModel(new CapMarketRia({clientId: this.model.id}));
			}
			else {
				this.selectModel(new CapMarketBrokerDealer({clientId: this.model.id}));
			}
		},
		saveModel: function() {
			var that = this;
			if (!this.validator.validate()) return;
			this.accountModel.save(null, {
				success: function(model) {
					that.collection.add(model);
					that.permissioner.selectedUsers.setAccountSave(model.id, {
						success: function() {
							that.trigger('saveSuccess');
							that.$('tr#' + model.id).click();
						},
						error: function(response) {
							Alert('There was an error while setting the advisor permissions for this account. Error: ' + $.parseJSON(response.responseText).error, 'OK');
						}
					});
				},
				error: function(response) {
					Alert('There was an error while creating this syndicate account. Error: ' + $.parseJSON(response.responseText).error, 'OK');
				}
			});
		},
		clean: function() {
			this.stopListening();
			$('.firm-details .primaryButton.continue span').text('SAVE & CONTINUE');
			$('.firm-details .primaryButton.continue').show();
		}
	});
	return FirmCapMarkets;
});