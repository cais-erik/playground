define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'amd/backbone/Backbone.ModelBinder',
	'views/pipeline/syndicate/base_syndicate_offer_detail',
	'views/assets/confirm_dialog',
	'views/assets/big_loader',
	'views/assets/product_viewer',
	'models/authed_user',
	'models/pipeline/pipeline_app_model',
	'collections/products/syndicate_all_offerings',
	'text!templates/pipeline/syndicate/syndicate_iois.html',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, Binder, BaseCmOfferDetail, ConfirmDialog, BigLoader, ProductViewer, AuthedUser, PipelineAppModel, SyndicateAllOfferings, Template) {
	/* CmIois Class
	 * Shows all IOIs of a CM transaction
	 * @extends BaseCmOfferDetail
	 */
	var CmIois = BaseCmOfferDetail.extend({
		_modelBinder: undefined,
		className: 'opportunity-details-container',
		canEditIoi: true,
		initialize: function() {
			this.listenTo(PipelineAppModel, 'change:iois', this.onIoiChange);
			this.template = Handlebars.compile(Template);
			// $(window).on('resize', this.resizeGrid);
			$('body').on('keyup', _.bind(this.onKeyUp, this));
			this.render();
			setTimeout(_.bind(function() {
				if (PipelineAppModel.get('iois')) this.onIoiChange();
			}, this), 5);
		},
		render: function() {
			var columns = [];
			var offeringModel = SyndicateAllOfferings.newModel(this.model.id, this.model.get('assetClass'));
			var context = {
				finalized: PipelineAppModel.get('transactionStatusId') === 1 ? true : false,
				offering: this.model.toJSON(),
				transactionStatusId: PipelineAppModel.get('transactionStatusId'),
				caisemployee: AuthedUser.get('caisemployee')
			};

			this.$el.html(this.template(context));
			this._modelBinder = new Backbone.ModelBinder();
			this._modelBinder.bind(this.model, this.el);

			if (PipelineAppModel.getActiveStatusName() === 'Finalized Orders') offeringModel.set({
				'finalized': true,
				'publicOfferingPrice': this.model.get('publicOfferingPrice')
			});

			this.productViewer = Vm.create(this, 'ProductViewer', ProductViewer, {
				el:  this.$('.product-viewer'),
				loadModel: offeringModel,
				animate: false,
				showDivRangeEditor: true
			});

			this.listenToOnce(this.productViewer, 'view:ready', this.onProductViewerReady);

			this.grid = this.$('.ioi-grid').kendoGrid({
				dataSource: this.model.getIoisGridDs(),
				editable: true,
				canEditIoi: true,
				sortable: {
					mode: "single",
					allowUnsort: false
				},
				selectable: false,
				columns: this.getColumns(),
				dataBound: function() {
					//Get the number of Columns in the grid
					var colCount = $(this.element).find('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length === 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 5px 0"><b>No IOIs found.</b></td></tr>');
						$(this.element).find('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}).data('kendoGrid');
			
			this.manageControlVisibility();
		},
		events: function(){
			return _.extend({}, BaseCmOfferDetail.prototype.events,{
				'click .save-iois': 'saveIois',
				'click .notify': 'notify',
				'click .finalize-transaction': 'finalizeTransaction',
				'click .add-ioi': 'addIoi',
				'click .notify-final-prospectus': 'notifyFinalProspectus',
				'click .book-transaction': 'bookTransaction',
				'click .delete-transaction': 'deleteTransaction',
				'click .is-booked.false': 'bookSingleTransaction'
			});
		},
		onKeyUp: function(e) {
			if ($('.k-window').is(':visible')) return false;
			if (e.keyCode === 27) { //esc key
				if (this.activeSingleTransaction) {
					this.activeSingleTransaction.closeView();
					return;
				}
				this.closeView();
			}
		},
		initUploader: function() {
			var that = this;
			var getSelectText = function() {
				if (that.model.get('finalProspectusId')) return '<i class="icon-upload"></i>Change Final Prospectus';
				else return '<i class="icon-upload"></i> Upload Final Prospectus';
			};
			var selectText = getSelectText();
			this.$('.upload-prospectus').kendoUpload({
				async: {
					saveUrl: this.model.url() + '/final_prospectus',
					autoUpload: true
				},
				upload: function(e) {
					that.loader = Vm.create(this, 'BigLoader', BigLoader, {message: 'Uploading...'});
				},
				success: function(e) {
					that.loader.closeLoader();
					that.model.set(_.omit(e.response.msg, 'cmTransactions'));
					that.render();
				},
				error: function(e) {
					that.loader.closeLoader();
					Alert('This file could not be uploaded at the time.', 'OK');
				},
				showFileList: false,
				multiple: false,
				localization:{
					select: selectText
				}
			});
		},
		onProductViewerReady: function() {
			var editable = this.productViewer.model.get('editable');
			if (editable === 'Expire') {
				this.canEditIoi = false;
				this.grid.canEditIoi = false;
				this.$('.add-ioi').addClass('disabled');
			} else {
				this.canEditIoi = true;
				this.grid.canEditIoi = true;
			}
		},
		manageControlVisibility: function() {
			var transactionStatusId = PipelineAppModel.get('transactionStatusId');
			switch (transactionStatusId) {
				case 0:  // active
					this.$('.upload-prospectus, .download-final-prospectus, .notify-final-prospectus').parents('li').remove();
					break;
				case 1:  // finalized
					this.grid.hideColumn(this.grid.columns.length - 1);
					this.$('.action-btns a').not('.download-final-prospectus, .notify-final-prospectus, .upload-prospectus').parents('li').remove();
					break;
			}
			this.initUploader();
		},
		onIoiChange: function() {
			var model = this.model.cmTransactions.get(PipelineAppModel.get('iois'));
			if (!model) return;

			var row = this.grid.table.find('tr[data-uid="' + this.grid.dataSource.get(model.id).uid + '"]');
			this.$('tr.k-state-selected').removeClass('k-state-selected');
			row.addClass('k-state-selected');
		},
		onSingleTransactionClose: function() {
			if (this.activeSingleTransaction.clean) this.activeSingleTransaction.clean();
			this.activeSingleTransaction.remove();
			this.activeSingleTransaction = null;
			PipelineAppModel.set('iois', null);
			this.$('tr.k-state-selected').removeClass('k-state-selected');
		},
		saveIois: function(e) {
			e.preventDefault();
			var button = $(e.currentTarget);
			var startText = button.text();
			button.text('Saving...');
			this.model.saveTransactions({
				success: function() {
					button.text('Changes Saved!');
					setTimeout(function() {
						button.text(startText);
					}, 1500);
				},
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a problem saving this transaction', 'OK');
					}
					button.text(startText);
				}
			});
		},
		notify: function(e) {
			e.preventDefault();
			this.bootStrapEmailDialog({
				collection: this.model.getContactList('PRICING_SHEET'),
				callback: _.bind(this.model.notifySelected, this.model),
				titleText: 'Notify of Allocation'
			});
		},
		notifyFinalProspectus: function(e) {
			e.preventDefault();
			this.bootStrapEmailDialog({
				collection: this.model.getContactList('FINAL_PROSPECTUS'),
				callback: _.bind(this.model.notifyFinalProspectus, this.model),
				titleText: 'Notify of Final Prospectus'
			});
		},
		finalizeTransaction: function(e) {
			e.preventDefault();
			var that = this;
			var onSuccess = function() {
				var loader = Vm.create(this, 'BigLoader', BigLoader);
				this.model.finalizeTransactions({
					success: function() {
						loader.closeLoader();
						new Alert('This transaction has been moved to booked orders.', 'OK');
						that.closeView();
					},
					error: function(response) {
						loader.closeLoader();
						try {
							new Alert(JSON.parse(response.responseText).error, 'OK');
						} catch (error) {
							new Alert('There was a server error finalizing this transaction.', 'OK');
						}
						
					}
				});
			};
			Vm.create(this, 'ConfDialog', ConfirmDialog, {
				message: 'Are you sure you would like to finalize this transaction?',
				confirmCallback: _.bind(onSuccess, this)
			});
		},
		deleteTransaction: function(e) {
			e.preventDefault();
			if (!AuthedUser.get('caisemployee')) return;
			var row = $(e.currentTarget).parents('tr');
			var selected = this.grid.dataItem(row);
			var model = this.model.cmTransactions.get(selected.caisId);
			
			Vm.create(this, 'ConfDialog', ConfirmDialog, {
				message: 'Are you sure you would like to delete ' + model.get('advisorName') + '\'s transaction?',
				confirmCallback: _.bind(function() {
					row.addClass('deleting');
					model.destroy({
						success: _.bind(function() {
							row.fadeOut('slow', _.bind(function() {
								this.grid.setDataSource(this.model.getIoisGridDs());
							}, this));
						}, this),
						error: function(model, response) {
							row.removeClass('deleting');
							try {
								new Alert(JSON.parse(response.responseText).error, 'OK');
							} catch (error) {
								new Alert('There was a server error while deleting this transaction.', 'OK');
							}
						},
						wait: true
					});
					
				}, this)
			});
		},
		bookSingleTransaction: function(e) {
			e.preventDefault();
			if (!AuthedUser.get('caisemployee')) return;
			var row = $(e.currentTarget).parents('tr');
			var selected = this.grid.dataItem(row);
			var model = this.model.cmTransactions.get(selected.caisId).set('selected', true);

			this.model.cmTransactions.invoke('unset', 'selected');
			this.bookTransaction(e, model);
		},
		bookTransaction: function(e, select) {
			if (e) e.preventDefault();
			var that = this;
			this.model.getBookingPreview({
				success: _.bind(function(bookingPreviews) {
					require(['views/assets/syndicate_transaction_booker'], function(CmTransactionBooker) {
						var cmTransactionBooker = Vm.create(this, 'CmTransactionBooker', CmTransactionBooker, {
							// only book transactions with an allocation
							collection: that.model.cmTransactions.getReadyToBeBooked(),
							model: that.model,
							bookingPreviews: bookingPreviews,
							selectModel: select || null
						});
					});
				}, this),
				error: function(response) {
					try {
						new Alert(JSON.parse(response.responseText).error, 'OK');
					} catch (error) {
						new Alert('There was a server error fetching the booking previews.', 'OK');
					}
				}
			});
		},
		addIoi: function(e) {
			e.preventDefault();
			var that = this;
			if (!this.canEditIoi) return;
			// load up everything needed for the trader
			require([
				'views/products/trader/trader_dialog',
				'collections/products/selected_products',
				'models/product/syndicate_equity_offering',
				'models/product/syndicate_preferred_offering'], function(Trader, SelectedProducts, CmEquityOffering, CmPreferredOffering) {
				// set the offering model
				var model = null;
				if (that.model.get('assetClass') === 'Equity') {
					model = new CmEquityOffering({internalCusip: that.model.get('internalCusip')});
				} else {
					model = new CmPreferredOffering({internalCusip: that.model.get('internalCusip')});
				}
				// fetch model and load the trader
				model.fetch({
					success: function() {
						SelectedProducts.reset([model]);
						var trader = Vm.create(that, 'TraderDialog', Trader, {productContext: 'capMarkets'});
						that.listenToOnce(Events, 'transactions:created', that.onIoiAdded);
					},
					error: function() {
						Alert('There was an error loading the Add IOI dialog.', 'OK');
					}
				});
			});
		},
		onIoiAdded: function(response) {
			var that = this;
			var currentId = this.model.id;
			this.model.collection.fetch({
				success: function(collection) {
					that.reInit(collection.get(currentId), that.options.row);
				},
				reset: true
			});
		},
		clean: function() {
			this.stopListening();
			$('body').off('keyup', this.onKeyup);
		},
		columns: {
			base: [
				{ title: "Account Name", field:"accountName", footerTemplate: "Totals:" },
				{ title: "Firm", caisPermissions: ['caisemployee'], field:"firmName"},
				{ title: "Team", field:"advisorTeamName"},
				{ title: "Advisor", field:"advisorName"},
				{ title: "IOI", field:"ioi", format: "{0:n0}", footerTemplate: "#= kendo.toString(sum, 'n0') #", width: 75, editor: function(container, options) {
					// Logic to determine if user can edit IOI
					var parentRow = container.parents('tr');
					var offerDetails = $('.k-grid.ioi-grid').data('kendoGrid').dataItem(parentRow);
					// if CAIS Total Allocation is present and user is NOT cais employee, do not edit
					if (offerDetails.allotted || !$('.k-grid.ioi-grid').data('kendoGrid').canEditIoi) {
						container.text(options.model.ioi);
						return;
					} else {
						$('<input name="' + options.field + '"/>')
							.appendTo(container)
							.kendoNumericTextBox({
								format: "{0:n0}",
								spinners: false
							});
					}
				}},
				{ title: "Allocation", field:"allotted", footerTemplate: "#= kendo.toString(sum, 'n0') #", width: 90, format: "{0:n0}", editor: function(container, options) {
					if (options.model.isBooked || !AuthedUser.get('caisemployee')) {
						container.text(options.model.allotted ? kendo.toString(options.model.allotted, 'n0') : '');
						return;
					}
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format: "{0:n0}",
							spinners: false
						});
				}},
				{ title: "S/C Split", field:"sellingConcession", format: "{0:p0}", editor: function(container, options) {
					if (options.model.isBooked || !AuthedUser.get('caisemployee') || options.model.accountType === 'RIA') {
						container.text(options.model.sellingConcession !== null ? kendo.toString(options.model.sellingConcession, 'p0') : '');
						return;
					}
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format: "{0:##,#.00###}",
							spinners: false
						});
				}},
				{ title: "Broker S/C", field:"brokerSellingConcession", format: "{0:$##,#.00####}"},
				{ title: "Allocation Price", field:"allocationPricePerShare", format: "{0:$##,#.00####}"},
				{ title: "Allocation Value", footerTemplate: "#= kendo.toString(sum, 'c') #", field:"allocationValue", width: 120, format: "{0:$##,#.00####}"},
				{ title: "Total Broker S/C", footerTemplate: "#= kendo.toString(sum, 'c') #", field:"totalBrokerSellingConcession", format: "{0:$##,#.00####}"},
				{ title: "Booked", field:"isBooked", caisPermissions: ['caisemployee'], width: 65, template: function(data) {
					if (data.isBooked && data.allotted !== null) return '<span class="is-booked true icon-suitcase" title="This transaction has been booked"><span>';
					else if (data.allotted !== null) return '<span class="is-booked false icon-suitcase" title="Click to book this transaction"><span>';
					else return '<span class="is-booked" title="Cannot book with no allocation">N/A<span>';
				}},
				{ title: "", caisPermissions: ['caisemployee'], width: 30, template: '<a class="delete-transaction" href="\\#"><i class="icon-trash"></i></a>' }
			],
			saveRow: { title: '', width: 85, template: '<a class="k-button k-button-icontext k-grid-save-changes save-ticker" href=""><span class="k-icon k-update"></span>Save</a>'}
		}
	});
	return CmIois;
});