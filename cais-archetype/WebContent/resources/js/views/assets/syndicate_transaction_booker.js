/**
 * Cm Transaction Booker
 * extends class ConfirmDialog
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'text!templates/pipeline/syndicate/syndicate_transaction_booker.html',
	'views/assets/base_kendo_dialog',
	'views/assets/big_loader',
	'views/assets/confirm_dialog',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Vm, Handlebars, Template, BaseKendoDialog, BigLoader, ConfDialog) {
	var CmTransactionBooker = BaseKendoDialog.extend({
		template: Handlebars.compile(Template),
		options: {
			height: function() {
				return $(window).height() - 150;
			}(),
			title: 'Book Transactions',
			selfRender: true
		},
		className: 'cm-transaction-booker',
		render: function() {
			this.$el.html(this.template(this.options.bookingPreviews.toJSON()));
			this.$('.booking-preview .content').hide();
			this.listenTo(this.collection, 'change', this.onCollectionChange);

			if (this.options.selectModel) {
				var check = this.$('[data-id=' + this.options.selectModel.get('id') + ']');
				check.click();
				setTimeout(function() {
					check.trigger('change');
				}, 2);
				check.parents('.booking-preview').find('.content').show();
			} else {
				this.$('.booking-preview').first().find('.content').show();
			}
		},
		events: function() {
			return _.extend({}, BaseKendoDialog.prototype.events, {
				'click .booking-preview header': 'onHeaderClick',
				'change [name=selected]': 'onSelectChange',
				'click [name=selected]': 'onSelectClick',
				'click .confirm-dialog': 'onConfirm',
				'click .sel-all': 'selectAll',
				'click .deselect-all': 'deselectAll',
				'keyup [name=name-filter]': 'filterList'

			});
		}(),
		onHeaderClick: function(e) {
			var content = $(e.currentTarget).parents('section').find('.content');
			if (content.is(':visible')) {
				content.slideUp('slow');
				return;
			}
			this.$('.booking-preview .content').not(content).slideUp('fast', function() {
				setTimeout(function() {
					content.slideDown('slow');
				}, 200);
			});
		},
		selectAll: function() { this.$('header input').not(':checked').click(); },
		deselectAll: function() { this.$('header input:checked').click(); },
		onSelectClick: function(e) { e.stopPropagation(); },
		onSelectChange: function(e) {
			var checked = $(e.currentTarget).prop('checked');
			var id = parseInt($(e.currentTarget).attr('data-id'));
			if (checked) {
				this.collection.findWhere({id: id}).set('selected', true);
			} else {
				this.collection.findWhere({id: id}).unset('selected');
			}
		},
		onConfirm: function(e) {
			var selected = this.collection.where({'selected': true});
			if (!selected.length) {
				Alert('No transactions are selected!', 'OK');
				return;
			}
			var that = this;
			var message = 'Are you sure you would like to book ' + selected.length + ' transactions?';
			if (selected.length === 1) message = 'Are you sure you would like to book ' + selected.length + ' transaction?';
			Vm.create(this, 'ConfDialog', ConfDialog, {
				message: message,
				confirmCallback: function() {
					that.book();
				}
			});
		},
		onCollectionChange: function() {
			var selected = this.collection.where({'selected': true});
			this.$('.selected-count').text(selected.length);
			if (selected.length) {
				this.$('.confirm-dialog').removeClass('btn-disabled');
			} else {
				this.$('.confirm-dialog').addClass('btn-disabled');
			}
		},
		book: function() {
			var loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Booking transactions...'});
			this.model.bookTransactions({
				success: _.bind(function() {
					loader.closeLoader();
					new Alert('The transactions have been booked', 'OK');
					this.closeDialog();
				}, this),
				error: function(response) {
					loader.closeLoader();
					try {
						new Alert('There was an error booking these transaction. Error: ' + JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a problem booking these transactions', 'OK');
					}
					
				}
			});
		},
		filterList: _.debounce(function(e) {
			var filter = $(e.currentTarget).val();
			var list = this.$('.wrap');
			if (filter) {
				list.find("section:not(:Contains(" + filter + "))").slideUp('fast');
				list.find("section:Contains(" + filter + ")").slideDown('fast');
			} else {
				list.find("section").slideDown('fast');
			}

		}, 400),
		closeDialog: function() {
			this.collection.invoke('unset', 'selected');
			this.kendoWindow.close();
		},
	});
	return CmTransactionBooker;
});