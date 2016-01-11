define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
    'thirdparty/moment-timezone-with-data.min',
	'views/pipeline/base_pipeline_step',
	'collections/pipeline/ai_pipeline_collections'
], function ($, _, Backbone, Vm, Events, Handlebars, moment, BasePipelineStep, AiPipelineCollections) {
	var CmStepOne = BasePipelineStep.extend({
		options: {},
		name: 'Pipeline',
		className: 'ai-pipeline-grid',
		pipelineCollections: AiPipelineCollections,
		render: function() {
			var that = this;
			this.grid = this.$el.kendoGrid({
				dataSource: {
				    schema: {
				        model: {
                            fields: {
                                firmName: { type: "string" },
                                advisorName: { type: "string" },
                                entityName: { type: "string" },
                                legalname: { type: "string" },
                                trade: { type: "string" },
                                status: {type:"string"},
                                amount: { type: "number" },
                                placementFeeAmount: { type: "number" },
                                investmentDate: { type: "date" },
                                subDueDate: { type: "date" },
                                wireDueDate: { type: "date" },
                                caisId: { type: "string" },
                                redId: { type: "string" }
                            }
                        }
                    },
					aggregate: [ { field: "amount", aggregate: "sum" } ],
				},

				sortable: {
					mode: "single",
					allowUnsort: false
				},
				filterable: {
                    operators: {
                        date: {
                            eq: "Equal",
                            neq: "Not equal",
                            lte: "Before or equal to",
                            gte: "After or equal to"
                        }
                    }
                },
				groupable: true,
				pageable: {
					pageSize: 200,
					pageSizes: [50, 100, 200],
					buttonCount: 5
				},
				columns: this.columns,
				dataBound: function () {
					//Get the number of Columns in the grid
					var colCount = that.$('.k-grid-header colgroup > col').length;
					//If There are no results place an indicator row
					if (this.dataSource._view.length == 0) {
						var row = $('<tr class="kendo-data-row"><td colspan="' +
								colCount +
								'" style="text-align:center; padding: 25px 0"><b>No trades found.</b></td></tr>');
						that.$('.k-grid-content tbody').append(row);
						row.hide().fadeIn('500');
					}
				}
			}, this.resizeOpportunityGrid()).data('kendoGrid');
			this.$el.prepend($('<div class="text-filter"><input type="text" name="filter" class="text-filter" placeholder="Search by text..."><a class="clear-input icon-cancel-circled" href="#"></a></div>'));
		},
		events: function() { return _.extend({}, BasePipelineStep.prototype.events, {
			'click .product-info': 'showProductInfo',
			'click .client-info': 'showClientInfo',
			'keyup [name=filter]': 'onFilterChange',
			'click .clear-input': 'clearInputClickHandler'
		}); },
		clearInputClickHandler: function(e) {
			e.preventDefault();
			$(e.currentTarget).prev('input').val('').trigger('keyup');
		},
		onFilterChange: _.throttle(function(e) {
			var value = $(e.currentTarget).val();
			var activeColummns = this.columns;
			var filters = [];
			var currFilterObj  = this.grid.dataSource.filter();
			var currentFilters = currFilterObj ? currFilterObj.filters: [];

			if (value.length) {
				$(e.currentTarget).parents('.text-filter').addClass('filtered');
			} else {
				$(e.currentTarget).parents('.text-filter').removeClass('filtered');
			}
			_.each(activeColummns, function(column) {
				if (column.field && column.field !== 'selected' && column.field !== 'investmentDate' &&column.field !== 'subDueDate'
				    &&column.field !== 'wireDueDate' && !column.format) {
//				    if(currentFilters && currentFilters.length>0){
//				        for(var i=0; i<currentFilters.length; i++){
//				            if(currentFilters[i].field==column.field){
//				                currentFilters.splice(i,1);
//				                break;
//				            }
//				        }
//				    }
            		filters.push({field: column.field, operator:"contains", value: value});
            	}

//				if (column.field !== 'selected' && !column.format && column.field) {
//				    if(column.template && typeof(column.template)==='function'){
//				        filters.push({field: column.template(column.field), operator:"contains", value: value});
//				    }
//				    else{
//					    filters.push({field: column.field, operator:"contains", value: value});
//					}
//				}
			});

//						if(currentFilters.length==0){
//            				currentFilters.push({type:'textFilter', logic:'or', filters:filters});
//            			}
//            			else{
//            			var found= false;
//            				for(var i=0; i<currentFilters.length; i++){
//            				    if(currentFilters[i].type=='textFilter'){
//            				                currentFilters.splice(i,1);
//            				                //found=true;
//            				                break;
//            				            }
//            				        }
//            				       // if(found==false){
//            				        currentFilters.push({type:'textFilter', logic:'or', filters:filters});
//            				       // }
//            			}

			this.grid.dataSource.filter({
				logic: 'or',
				filters: filters
			});
		},700,{leading:false}),
		columns: [
		    { title: $("<label class='nolabel_check column_check' onclick=''></label>").html(), template: "<input class='select-product' type='checkbox' value='${transactionid}'>", width: 28, sortable: false, filterable: false },
            { title: "Firm Name",field:"firmName", filterable: true, width: 110 },
            { title: "Advisor Name",field:"advisorName", filterable: true, width: 110 },
            { title: "Investment Entity", field: "entityName", filterable: true, width: 130, template: "<div class='pointer client-info' data-entityId='${ investmentEntityId }'>${ entityName }</div>" },
            { title: "Product",field: "legalname", filterable: true, width: 150,  template: "<div class='pointer product-info' data-fundId='${ productId }'>${ legalname }</div>" },
            { title: "Trade",  field: "trade", filterable: true, width: 60},
            { title: "Status", field: "status", filterable: true, width: 60,},
            { title: "Amount", field: "amount", filterable: true, width: 90, format: "{0:C2}", aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C2') #", groupFooterTemplate: "#= kendo.toString(sum, 'C0') #" },
            { title: "Placement Fee", field: "placementFeeAmount", filterable: true, width: 112, format: "{0:C2}" },
            { title: "Date", field: "investmentDate", template: "#= moment(investmentDate).tz('America/New_York').format('MMM DD, YYYY z') #", width: 90 },
            { title: "Sub Due Date",field:"subDueDate", filterable: true, template: "#= moment(subDueDate).tz('America/New_York').format('MMM DD, YYYY z') #", width: 104 },
            { title: "Wire Due Date",field:"wireDueDate", filterable: true, template: "#= moment(wireDueDate).tz('America/New_York').format('MMM DD, YYYY z') #", width: 108 },
		    { title: "CAISID(Sub)", field: "caisId", filterable: true, width: 92, template: "<a data-bypass class='pointer trade-info' href='/investment-pipeline/trade/${transactionid}/checklist' data-caisid='${caisId}' data-recordNumber='${ transactionid }'>${ caisId }</a>" },
			{ title: "CAISID(Red)", field:"redId", filterable: false, width: 70 }
		],
		showClientInfo: function(e) {
		    var fd = moment.tz('2014-09-19T04:00:00.000Z', 'New_York').formart('MMM d, yyyy');
		    alert("date:"+fd);

			var options = {
				selectedClient: this.grid.dataItem($(e.currentTarget).parents("tr")),
				isInvestmentEntity: true,
				allowNavigation: false
			};
			var dialog = new Dialog("client-detail", options);
			$(".right-icon").remove();
			$(".left-icon").remove();
		},
		showProductInfo: function(e){ 
			var fundId = $(e.currentTarget).attr('data-fundid');
			Server.getFundById( {fundId: fundId}, function(response) {
				var options = {
					selectedProduct: response,
					allowNavigation: false,
					dialogAddRemove: false	
				};
				var dialog = new Dialog("fund-info", options);
			});
		}
	});
	return CmStepOne;
});