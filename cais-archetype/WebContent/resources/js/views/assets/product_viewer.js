define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/authed_user',
	'text!templates/products/syndicate/product_viewer.html',
	'text!templates/products/structured_products/product_viewer.html',
	'views/assets/email_notification_dialog',
	'views/assets/confirm_dialog',
	'views/assets/big_loader',
	'views/products/structured_products/deal_capture',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Vm, Events, AuthUser, CapMarketsTemplate, StructuredProductTemplate, EmailNotificationDialog, ConfDialog, BigLoader, DealCaptureView) {
	var ProductViewer = Backbone.View.extend({
		options: {
			animate: true,
			showDivRangeEditor: false
		},
		collection: null,
		model: null,
		initialize: function() {
			if (this.collection) this.listenTo(this.collection, 'activeProductChange', this.onCollectionSelect);
			if (this.options.loadModel) {
				this.model = this.options.loadModel;
				this.model.fetch({
					success: _.bind(this.render, this)
				});
			}
			if (this.model) this.listenTo(this.model, 'change:finalizedDividendRange', this.onFinalizedDivRangeChange);
		},
		render: function() {
			if (this.model.cacheName == 'StructuredProduct') {
				this.template = StructuredProductTemplate;
			} else {
				this.template = CapMarketsTemplate;
			}
			var that = this;
			var assetClass = this.model.get('assetClass');
			var template = Handlebars.compile(this.template);
			this.context = {
				model: this.model.toJSON(),
				user: AuthUser.toJSON(),
				emailUrl: this.model.getEmailUrl(),
				editUrl: this.model.getEditUrl(),
				bondOrPref: assetClass === 'Preferred Stock' || assetClass === 'Bond',
				showDivRangeEditor: (assetClass === 'Preferred Stock' || assetClass === 'Bond') && this.options.showDivRangeEditor
			};
			
			Events.trigger('domchange:title', this.model.getName());

			if (this.options.animate) {
				this.$el.fadeOut('fast', function() {
					that.$el.html(template(that.context)).hide().fadeIn('fast');
				});
			} else {
				that.$el.html(template(that.context));
			}
			this.trigger('view:ready', this);
		},
		events: {
			'click .delete-offering': 'deleteOffering',
			'click .send-email': 'sendEmail',
			'click .preview-email': 'previewEmail',
			'click .deal-terms': 'getDealTerms',
			'click .expire': 'expireOffering',
			'click .publish': 'publishOffering',
			'click .hide-offering': 'manageOfferVisibility',
			'click .show-offering': 'manageOfferVisibility',
			'click .update-div-range': 'updateDivRange',
			'click .edit-finalized-coupon': 'editFinalizedCoupon'
		},
		onFinalizedDivRangeChange: function() {
			this.$('.finalized-div-range').text(this.model.get('finalizedDividendRange'));
		},
		editFinalizedCoupon: function(e) {
			if (e) e.preventDefault();
			$(e.currentTarget).parents('dd').toggleClass('editing');
			this.$('[name=finalizedDividendRange]').val(this.model.get('finalizedDividendRange'));
		},
		updateDivRange: function(e) {
			if (e) e.preventDefault();
			this.model.set('finalizedDividendRange', this.$('[name=finalizedDividendRange]').val());
			this.model.save(null, {
				success: _.bind(function() {
					$(e.currentTarget).parents('dd.editing').removeClass('editing');
				}, this)
			});
		},
		onCollectionSelect: function(model) {
			this.model = model;
			this.model.fetch({
				success: _.bind(this.render, this),
				error: function() {
					Alert('This offer could not be loaded.', 'OK');
				}
			});
		},
		getDealTerms: function(e) {
			e.preventDefault();
			var that = this;
			Vm.create(this, 'DealCaptureView', DealCaptureView, {
				model: this.model.dealTerms
			});
		},
		manageOfferVisibility: function(e) {
			e.preventDefault();
			this.model.manageOfferVisibility({
				visible: $(e.currentTarget).hasClass('show-offering'),
				success: _.bind(function(response) {
					this.collection.fetch();
					this.model.fetch({
						success: _.bind(this.render, this)
					});
				}, this),
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a problem changing this offering\'s visibility.', 'OK');
					}
				}
			});
		},
		publishOffering: function(e) {
			e.preventDefault();
			var that = this;
			this.model.publishOffering({
				success: function(response) {
					Alert('This offering has been published.', 'OK');
					that.collection.fetch();
					that.model.fetch({
						success: _.bind(that.render, that)
					});
				},
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a problem publishing this offering.', 'OK');
					}
				}
			});
		},
		expireOffering: function(e) {
			e.preventDefault();
			var that = this;
			this.model.expireOffering({
				success: function(response) {
					Alert('This offering has been expired.', 'OK');
					that.collection.fetch();
					that.model.fetch({
						success: _.bind(that.render, that)
					});
				},
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a problem expiring this offering.', 'OK');
					}
				}
			});
		},
		sendEmail: function(e) {
			e.preventDefault();
			var that = this;
			// If it's not a cais employee, use the basic email notification dialog
			if (!AuthUser.get('caisemployee')) {
				this.bootStrapEmailDialog();
				return;
			}
			// else use the tabbed dialog that supports SF distros
			var emailDialog = Vm.create(this, 'EmailNotificationDialog', EmailNotificationDialog, {
				model: this.model,
				confirmCallback: function(list) {
					var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Sending emails...'});
					that.model.sendEmail(list, {
						success: function() {
							loader.closeLoader();
							Alert('Email sent!', 'OK');
							emailDialog.closeDialog();
						},
						error: function(response) {
							loader.closeLoader();
							try {
								new Alert(JSON.parse(response.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a problem emailing this offering.', 'OK');
							}
						}
					});
				}
			});
		},
		// TODO, this is repeated from base_syndicate_offer_detail, create syndicate utils file
		bootStrapEmailDialog: function(options) {
			var that = this;
			options = _.extend({
				collection: this.model.getContactList('PRELIMINARY_PROSPECTUS'),
				titleText: 'Notify Accounts',
				callback: null
			}, options);
			options.collection.fetch({
				success: function() {
					if (options.selectUser) {
						collection.invoke('set', {selected: false});
						collection.findWhere({'name': options.selectUser}).set('selected', true);
					}
					require(['views/assets/basic_email_dialog'], function(EmailNotificationDialog) {
						var emailDialog = Vm.create(this, 'EmailNotificationDialog', EmailNotificationDialog, {
							collection: options.collection,
							onConfirm: function(opt) {
								that.model.sendEmail(options.collection.getSelected(), opt);
							},
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
		},
		previewEmail: function(e) {
			e.preventDefault();
			window.open($(e.currentTarget).attr('href'), 'Preview', 'width=700,height=650,scrollbars=yes');
		},
		deleteOffering: function(e) {
			e.preventDefault();
			var that = this;
			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: 'Are you sure you would like to delete this offering?',
				confirmCallback: function() {
					that.model.destroy({
						success: function(model) {
							that.collection.remove(model);
							that.$el.fadeOut('slow');
						},
						error: function(response) {
							try {
								new Alert(JSON.parse(response.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a problem deleting this offering.', 'OK');
							}
						}
					}, {wait: true});
				}
			});
		},
		clean: function() {
			this.stopListening(this.collection);
			this.$('iframe').off('load');
		}
	});
	return ProductViewer;
});