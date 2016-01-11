define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'amd/backbone/Backbone.ModelBinder',
	'text!templates/pipeline/syndicate/syndicate_single_transaction.html',
	'models/authed_user',
	'views/assets/confirm_dialog',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, Binder, Template, AuthUser, ConfirmDialog) {
	var BaseCmOfferDetail = Backbone.View.extend({
		reInit: function(model) {
			if (this.activeSingleTransaction) this.activeSingleTransaction.closeView();
			if (model) this.model = model;
			this.render();
		},
		events: {
			'click .close': 'closeView'
		},
		// returns the proper columns for the user
		getColumns: function() {
			var caisemployee = AuthUser.get('caisemployee');
			var validColumns = [];

			_.each($.extend(true, [], this.columns.base), function(column, i) {
				// columns with no permissions show to all
				if (typeof column.caisPermissions !== 'undefined') {
					var showToAdv = _.indexOf(column.caisPermissions, 'advisor') > -1;
					var showToCaisEmployee = _.indexOf(column.caisPermissions, 'caisemployee') > -1;
					// columns with 'caisemployee' show to caisemployee
					if (showToCaisEmployee && !showToAdv && !caisemployee) return;
					// columns with advisor show to only advisor
					if (showToAdv && !showToCaisEmployee && caisemployee) return;
					validColumns.push(column);
				} else {
					validColumns.push(column);
				}
			}, this);
			return validColumns;
		},
		closeView: function() {
			if (this.model.isChanged() && AuthUser.get('caisemployee')) {
				Vm.create(this, 'ConfDialog', ConfirmDialog, {
					message: 'Would you like to save the changes to these transactions?',
					cancelCallback: _.bind(function() {
						this.$el.fadeOut('fast', _.bind(function() {
							this.trigger('view:close');
							this.model.collection.reset().fetch();
						}, this));
					}, this),
					confirmCallback: _.bind(function() {
						this.model.saveTransactions({
							success: _.bind(function() {
								this.$el.fadeOut('fast', _.bind(function() {
									this.trigger('view:close');
								}, this));
							}, this),
							error: function(response) {
								try {
									new Alert(JSON.parse(response.responseText).error, 'OK');
								} catch (error) {
									new Alert('There was a problem saving this transaction', 'OK');
								}
							}
						});
					}, this)
				});
				return false;
			} else {
				this.$el.fadeOut('fast', _.bind(function() {
					this.trigger('view:close');
				}, this));
			}
		},
		bootStrapEmailDialog: function(options) {
			options = _.extend({
				collection: this.model.getContactList,
				titleText: 'Notify Accounts',
				callback: null
			}, options);
			var collection = options.collection;

			collection.fetch({
				success: function() {
					if (options.selectUser) {
						collection.invoke('set', {selected: false});
						collection.findWhere({'name': options.selectUser}).set('selected', true);
					}
					require(['views/assets/basic_email_dialog'], function(EmailNotificationDialog) {
						var emailDialog = Vm.create(this, 'EmailNotificationDialog', EmailNotificationDialog, {
							collection: collection,
//							filter: {
//								field: 'type',
//								operator: 'eq',
//								value: 'USER'
//							},
							onConfirm: options.callback || null,
							title: options.titleText
						});
					});
				},
				error: function(e) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('The list of email contacts could not be retrieved from the server.', 'OK');
					}
				}
			});
		}
	});
	return BaseCmOfferDetail;
});