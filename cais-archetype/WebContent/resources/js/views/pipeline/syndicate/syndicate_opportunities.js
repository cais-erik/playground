define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/pipeline/base_pipeline_step',
	'collections/pipeline/syndicate_pipeline_collections',
	'views/assets/confirm_dialog',
	'views/assets/big_loader',
	'views/pipeline/syndicate/syndicate_iois',
	'models/authed_user',
	'models/pipeline/pipeline_app_model'
], function ($, _, Backbone, Vm, Events, Handlebars, BasePipelineStep, CmPipelineCollections, ConfirmDialog, BigLoader, CmIoisView, AuthedUser, PipelineAppModel) {
	var CmOpportunities = BasePipelineStep.extend({
		options: {
			editable: AuthedUser.get('caisemployee')
		},
		name: 'Pipeline',
		className: 'cm-pipeline',
		_scrollPosition: 0,
		pipelineCollections: CmPipelineCollections,
		render: function() {
			var that = this;
			this.grid = this.$el.kendoGrid({
				dataSource: this.collection.getOfferingGridDs(),
				sortable: {
					mode: "single",
					allowUnsort: false
				},
				groupable: false,
				// navigatable: true,
				columns: this.getColumns(),
				columnMenu: false,
				selectable: false,
				edit: _.bind(this.onEdit, this),
				editable: this.options.editable,
				dataBound: function () {
					//if (that.options.expand) this.expandRow(this.tbody.find("tr.k-master-row"));
					//Get the number of Columns in the grid
					var colCount = that.$('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length === 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No trades found.</b></td></tr>');
						that.$('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
					// set the scroll position of the grid
					if (that._scrollPosition) {
						that.$('.k-grid-content').scrollTop(that._scrollPosition);
					}
					// if an offering is actively selected in pipeline app model, select the row
					if (PipelineAppModel.get('offering')) {
						var model = this.dataSource.get(PipelineAppModel.get('offering'));
						if (model) this.table.find('tr[data-uid="' + model.uid + '"]').addClass('k-state-selected');
					}
				},
			}, this.resizeOpportunityGrid()).data('kendoGrid');

			// super hack to maintain scroll position in grid
			this.$('.k-grid-content').scroll(function(e) {
				that._scrollPosition = $(this).scrollTop();
			});
		},
		events: {
			'click .save-ticker': 'saveTickerRowChanges',
			'click .view-iois': 'onRowSelect',
			'click .generateTradeSheet': 'generateTradeSheet'
		},
		onEdit: function(e) {
			// don't allow editing in finalized
			var transactionStatus = PipelineAppModel.get('transactionStatusId');
			if (transactionStatus === 1) this.grid.closeCell();
		},
		manageColumns: function() {
			var transactionStatus = PipelineAppModel.get('transactionStatusId');
			switch (transactionStatus) {
				case 0: // active
					if (this.options.editable) this.grid.showColumn('saveButton');
					else {
						this.grid.hideColumn('saveButton');
					}
					this.grid.hideColumn('finalProspectusId');
					this.grid.showColumn('saveButton');
					this.grid.showColumn('dealSize');
					this.grid.showColumn('orderPeriod');
					this.grid.showColumn('publicOfferingPrice');
					this.grid.showColumn('cusip');
					this.grid.showColumn('totalIOI');
					this.grid.hideColumn('tradeSheet');
					this.grid.hideColumn('tradeSheetCreateDate');
					break;
				case 1: //finalized
					this.grid.showColumn('finalProspectusId');
	           		if (this.options.editable) {
                        this.grid.showColumn('tradeSheet');
                        this.grid.showColumn('tradeSheetCreateDate');
	           	    }
					this.grid.hideColumn('saveButton');
					this.grid.hideColumn('dealSize');
					this.grid.hideColumn('orderPeriod');
					this.grid.hideColumn('publicOfferingPrice');
					// this.grid.hideColumn('cusip');
					this.grid.hideColumn('totalIOI');
					break;
			}
			if (PipelineAppModel.get('offering')) this.onOfferingSelect();
		},
		// enableEditables: function() { this.$('[data-role=editable]').unbind('click', this._preventClick); },
		saveTickerRowChanges: function(e) {
			e.preventDefault();
			var that = this;
			var data = this.grid.dataItem($(e.currentTarget).parents('tr')).toJSON();
			var model = this.collection.get(data.id);
			/*if (!model.validateModel()) {
				new Alert('Please verify that all information is filled out correctly.', 'OK');
				return;
			}*/
			model.save(null, {
				success: function() {
					that.reInit();
				},
				error: function() {
					new Alert('This transaction status could not be saved.', 'OK');
				}
			});
		},
		onRowSelect: function(e) {
			e.preventDefault();
			var row = $(e.currentTarget).parents('tr');
			var selected = this.grid.dataItem(row);
			PipelineAppModel.set('offering', selected.id);
		},
		generateTradeSheet: function(e) {
	        e.preventDefault();
			var that = this;
			var data = this.grid.dataItem($(e.currentTarget).parents('tr')).toJSON();
			$.get('/api/syndicate/transactions/' + data.internalCusip +'/tradeSheet', function( data ) {
              new Alert( "The requested Trade Sheet will arrive your email shortly. Thanks for using CAIS portal!", "OK" );
            });
		},
		onOfferingSelect: function() {
			var model = this.collection.get(PipelineAppModel.get('offering'));
			if (!model) return;
			var row = this.grid.table.find('tr[data-uid="' + this.grid.dataSource.get(model.id).uid + '"]');
			this.$('tr.k-state-selected').removeClass('k-state-selected');
			row.addClass('k-state-selected');

			if (this.activeIoisView) {
				this.activeIoisView.reInit(model);
			} else {
				this.activeIoisView = Vm.create(this, 'CmIoisView', CmIoisView, {model: model});
				this.activeIoisView.$el.appendTo('.workspace').fadeIn('slow');
				this.listenToOnce(this.activeIoisView, 'view:close', this.onIoisViewClose);
			}
		},
		onIoisViewClose: function() {
			this.$('tr.k-state-selected').removeClass('k-state-selected');
			if (this.activeIoisView.clean) this.activeIoisView.clean();
			this.activeIoisView.remove();
			this.activeIoisView = null;
			PipelineAppModel.set('offering', null);
		},
		// returns the proper columns for the user
		getColumns: function() {
			var caisemployee = AuthedUser.get('caisemployee');
			var validColumns = [];
			// var schemaFields = this.collection.getOfferingGridDs().options.schema.model.fields;
			// TODO: inject a class name for every editable field here::

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
		columns: {
			base: [
				{ title: "Issuer",field:"issuer", width: 185, selectable: false, template: function(data) {
					return '<a href="#" class="view-iois">' + data.issuer + '<em class="indicator"></em></a>';
				}},
				{ title: "Ticker",field:"ticker", width: 70, selectable: false },
				{ title: "Total IOI", field: "totalIOI", format: "{0:n0}", selectable: false },
				{ title: "Total Allocation", caisPermissions:['caisemployee'], field: "size", format: "{0:n0}", editor: function(container, options) {
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format  : "{0:n0}",
							spinners: false
						});
				}},
				{ title: "Order Period", field:"orderPeriod", width: 135, template: function(data) {
						if (data.orderPeriod) return kendo.toString(data.orderPeriod, 'g');
						return '';
					}
				},
				{ title: "Trade Date",field:"tradeDate", width: 100,
					template: function(data) {
						if (data.tradeDate) return kendo.toString(data.tradeDate, 'MM/dd/yyyy');
						return '';
					}
				},
				{ title: "Settle Date",field:"settlementDate", width: 100, template: function(data) {
						if (data.settlementDate) return kendo.toString(data.settlementDate, 'MM/dd/yyyy');
						return '';
					}
				},
				{ title: 'CUSIP', field: "cusip", width: 90},
				{ title: 'Deal Size', caisPermissions: ['caisemployee'], format:"{0:##,#}", field: "dealSize", editor: function(container, options) {
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format  : "{0:##,#}",
							decimals: 0,
							spinners: false
						});
				}},
				{ title: 'Offering Price', field: "publicOfferingPrice", format: "{0:$##,#.00##}", editor: function(container, options) {
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format  : "{0:$##,#.00##}",
							decimals: 3,
							spinners: false
						});
				}},
				{ title: 'Total S/C', field: "sellingConcession", format:"{0:$##,#.00###}", editor: function(container, options) {
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format  : "{0:$##,#.00###}",
							decimals: 6,
							spinners: false
						});
				}},
				{ title: "Broker S/C", field: 'brokerSellingConcession', format:"{0:$##,#.00###}", caisPermissions: ['advisor'] },
				{ title: "Allocation Price", field: 'allocationPricePerShare', caisPermissions: ['advisor'] },
				{ title: "Allocation Value", field: 'allocationValue', format: "{0:$##,#.00##}", caisPermissions: ['advisor'] },
				{ title: "Total Broker S/C Value", field: 'totalBrokerSellingConcession', format: "{0:$##,#.00##}", caisPermissions: ['advisor'] },
				{ title: 'Gross Spread',  caisPermissions: ['caisemployee'], field: "grossSpread", format: "{0:$###,###,###.00#}", editor: function(container, options) {
					$('<input name="' + options.field + '"/>')
						.appendTo(container)
						.kendoNumericTextBox({
							format  : "{0:$##,#.00#}",
							decimals: 3,
							spinners: false
						});
				}},
				{ title: 'Final Prospectus', field: 'finalProspectusId', width: 115, template: function(data) {
						if (data.finalProspectusId) return '<a class="icon-download" href="/api/document/download?docId=' + data.finalProspectusId + '" target="_blank">View</a>';
						return 'None yet';
					}
				},
				{ title: 'Trade Sheet', field: 'tradeSheet', width: 115, template: function(data) {
                		if (data.tradeSheetCreateDate) return '<a class="command-button generateTradeSheet" href="">Regenerate</a>';
				        return '<a class="command-button generateTradeSheet" href="">Generate</a>';
				    }
                },
                { title: "Sheet Create Date", field:"tradeSheetCreateDate", width: 150,
                		template: function(data) {
                		if (data.tradeSheetCreateDate) return kendo.toString(data.tradeSheetCreateDate, 'MM/dd/yyyy');
                		return 'N/A';
                	}
                },
				{ title: ' ', width: 85,  caisPermissions: ['caisemployee'], field: 'saveButton', template: '<a class="k-button k-button-icontext k-grid-save-changes save-ticker" href=""><span class="k-icon k-update"></span>Save</a>'}
			]
		}
	});
	return CmOpportunities;
});