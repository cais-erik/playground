define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'routers/pipeline_router',
	'events',
	'handlebars',
	'models/authed_user',
	'views/assets/base_kendo_dialog',
	'views/trade_ticket/ticket_header',
	'text!templates/trade_ticket/root_trade_ticket.html',
	'models/trade_ticket/active_ticket_item'
], function ($, _, Backbone, Vm, Router, Events, Handlebars, AuthUser, BaseKendoDialog, TradeTicketHeader, Template, ActiveTicket) {
	var RootTradeTicket = BaseKendoDialog.extend({
		template: Template,
		attributes: {
			'class': 'trade-ticket-window'
		},
		options: {
			width: function() {
				return $(window).width() - 50;
			}(),
			height: function() {
				return $(window).height() - 50;
			}(),
			title: false,
			resizable: false,
			selfRender: false
		},
		name: 'Trade Ticket',
		preInit: function() {
			this.listenTo(Events, 'error:ticketLoadFailure', this.closeDialog);
			this.listenTo(Events, 'showUiFeedback', this.showUiFeedback);
			Events.on('domchange:title', this.changeTitle);
		},
		render: function(options, callback) {
			ActiveTicket.params.transactionId = options.transactionId;
			ActiveTicket.transactionData = {
				investmentEntityId: options.investmentEntityId
			};
			ActiveTicket.setTransactionId();
			
			Events.trigger('domchange:title', this.name);
			var template = Handlebars.compile(this.template);
			var context = {user:AuthUser.toJSON(), slug: Router.appRouter.slug};

			this.$el.html(template(context));

			this.header = Vm.create(this, 'TradeTicketHeader', TradeTicketHeader, {
				el: this.$('.dialog-header')
			});

			ActiveTicket.fetch({
				success: function() {
					if (callback) callback();
				}
			});	
		},
		events: {
			'click .account-navigation div': 'navClickHandler',
			'click .communicatorClose': 'closeUiFeedback'
		},
		navClickHandler: function(e) {
			this.$('.account-navigation div.active').removeClass('active');
			$(e.currentTarget).addClass('active');
		},
		/**
		 *	Renders a subview in the .main-column container
		 *  @param view, Backbone View class
		 *  @param options, View options object
		 */
		showView: function(view, options) {
			var that = this;
			var renderSubView = function () {
				ActiveTicket.transactionTasks.fetch({
					success: function() {
						require([view], function(View) {
							that.subView = Vm.create(that, 'Subview', View, options || {});
							that.$('.content-view').html(that.subView.$el);
							if (options.section) that.activeSection = options.section;
							that.updateSectionNav();
						});
					}
				});
			};
			if (!this.$el.is(':visible')) {
				//this.listenToOnce(ActiveTicket, 'sync', renderSubView);
				this.render(options, renderSubView);
				this.open();
				return;
			}
			if (options.section === 'checklist' && this.activeSection === 'checklist') {
				ActiveTicket.transactionTasks.selectTaskByName(options.subViewName);
				return;
			}
			renderSubView();
		},
		updateSectionNav: function() {
			this.$('.account-navigation .active').removeClass('active');
			this.$('.account-navigation .' + this.activeSection).addClass('active');			
		},
		/**	
		 *	Updates the title tag of the page
		 *  @param title, string, title of page
		 */
		changeTitle: function(title) {
			$(document).attr('title', title + ' | CAIS');
		},
		onWindowResize: _.debounce(function() {
			this.kendoWindow.setOptions({
				width: function() {
					return $(window).width() - 50;
				}(),
				height: function() {
					return $(window).height() - 50;
				}()
			});
			this.kendoWindow.center();
		}, 500),
		onClose: function() {
			this.activeSection = null;
			Events.trigger('tradeticket:close');
		},
		showUiFeedback: function(status, message) {
			var feedbackElem = this.$('.ui-feedback');
			this.$('.ui-feedback .message-text').text(message);
			this.$('.ui-feedback').fadeIn('fast').delay(2000).fadeOut('slow');
		},	
		closeUiFeedback: function() {
			this.$('.ui-feedback').hide();	
		}
	});
	return RootTradeTicket;
});