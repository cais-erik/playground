define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/authed_user',
	'text!templates/products/structured_products/offering_list_item.html',
	'views/assets/email_notification_dialog',
	'views/assets/confirm_dialog',
	'views/assets/big_loader',
	'views/products/structured_products/deal_capture',
	'amd/handlebars/handlebars.helpers',
	'thirdparty/moment'
], function ($, _, Backbone, Vm, Events, AuthUser, StructuredProductTemplate, EmailNotificationDialog, ConfDialog, BigLoader, DealCaptureView) {
	var ProductViewer = Backbone.View.extend({
		options: {
			showDivRangeEditor: false
		},
		model: null,
		tagName: 'li',
		attributes: {
			'class': 'offering initializing',
		},
		initialize: function() {
			if (this.model) this.listenTo(this.model, 'change:finalizedDividendRange', this.onFinalizedDivRangeChange);
			var category = this.model.get('spCategoryId') || '';
			this.$el.attr('data-offering-id', this.model.id);
			this.$el.addClass('category-id-' + category);
			this.$el.addClass('expired-' + this.model.get('isExpired'));
			this.$el.addClass('published-' + this.model.get('isPublished'));
			this.render();
		},
		render: function() {
			this.template = StructuredProductTemplate;
			var assetClass = this.model.get('assetClass'),
				template = Handlebars.compile(this.template),
				currentModel = this.model.toJSON(),
				closingDate = moment(currentModel.closingDate);
			this.context = {
				model: currentModel,
				user: AuthUser.toJSON(),
				emailUrl: this.model.getEmailUrl(),
				editUrl: this.model.getEditUrl(),
				closingLabel:closingDate.isAfter(moment()) ? 'Closes' : 'Closed'
			};
			this.$el.html(template(this.context));
			this.setTime();
			Events.trigger('domchange:title', this.model.getName());
			this.trigger('view:ready', this);
		},
		events: {
			// 'click .offering-heading a': 'onHeaderClick',
			'click .navigation.on-click .edit-menu': 'toggleNavigation',
			'click .delete-offering': 'deleteOffering',
			'click .send-email': 'sendEmail',
			'click .preview-email': 'previewEmail',
			'click .deal-terms': 'getDealTerms',
			'click .expire': 'expireOffering',
			'click .publish': 'publishOffering',
			'click .hide-offering': 'manageOfferVisibility',
			'click .show-offering': 'manageOfferVisibility'
		},
		setTime: function() {
			this.$('.timeago').text(moment(this.model.get('closingDate')).fromNow());
		},
		/*onHeaderClick: function(e) {
			e.preventDefault();
			if ($(e.currentTarget).parents('li').hasClass('active')) {
				this.model.collection.setActiveModel(null);	
			} else {
				this.model.collection.setActiveModel(this.model);	
			}
		},*/
		toggleNavigation: function(e) {
			e.preventDefault();
			$(e.currentTarget).parent('li').toggleClass('active').parent('.navigation').one('mouseleave', function() {
				$(this).find('li.active').removeClass('active');
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
			this.model.publishOffering({
				success: _.bind(function(response) {
					new Alert('This offering has been published.', 'OK');
					// that.collection.fetch();
					this.model.fetch({
						success: _.bind(this.render, this)
					});
				}, this),
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