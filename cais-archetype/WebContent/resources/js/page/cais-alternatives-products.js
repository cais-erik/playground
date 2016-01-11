(function(){
var products;
var	allResults;
var selectedProductData;
var selectedProductTypeId;
var filteredProductData;
var hashChecked = false;
// var performanceData;
var subFilters = [];
var fundAumGridData;
var firmAUMGridData;
var todayDate = new Date();
var lastYear = todayDate.getFullYear() - 1;
var productsPageLoaded = false;
var controlBar;
var cannotSelectFunds = false;
var loadHash = decodeURIComponent(window.location.hash).replace('#', '');

var overviewColumns = 
[
	{ title: "", template: "<label class='nolabel_check' onclick='' data-statusType='${ statusType }'></label>", width: 35, sortable: false, filterable: false },
    { title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>", filterable:true},
    { title: "Fund Name", field: "legalName" },
	{ title: "Strategy", field: "strategy" },
	{ title: "Sub Strategy", field: "subStrategy" },
	{ title: "Mercer Rating", field: "mercerRating" },
	{ title: "Strategy AUM", field: "strategyAUM", format: "{0:C0}" }, 
	{ title: "Capacity", field: "statusType", template: "#if (areSlotsRequired) {# <div class='details-icon field-tooltip-icon' data-tooltip='${ numberOfAvailableSlots } Remaining Slots'></div> #}# #if (statusType == 'Request Documents') {# <div class='request-documents'></div> #}# ${statusType}" }
]

var overviewColumnsSelected = 
[
	{ title: "", template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", width: 35, sortable: false, filterable: false },
    { title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
    { title: "Fund Name", field: "legalName" },
	{ title: "Strategy", field: "strategy" },
	{ title: "Sub Strategy", field: "subStrategy" },
	{ title: "Mercer Rating", field: "mercerRating" },
	{ title: "Strategy AUM", field: "strategyAUM", format: "{0:C0}" },
	{ title: "Capacity", field: "statusType", template: "#if (areSlotsRequired) {# <div class='details-icon field-tooltip-icon' data-tooltip='${ numberOfAvailableSlots } Remaining Slots'></div> #}# #if (statusType == 'Request Documents') {# <div class='request-documents'></div> #}# ${statusType}" }
]

var performanceColumns = 
[
	 { title: "", template: "<label class='nolabel_check' onclick='' data-statusType='${ statusType }'></label>", width: 35, sortable: false, filterable: false },
	 { title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
	 { title: "Fund Name", field: "legalName" },
	 { title: "Month To Date", field: "mtd", template: "#if (mtd == -9999) {# N/A #} else { # ${ mtd }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "Year To Date", field: "cumulativeYearToDate", template: "#if (typeof cumulativeYearToDate == 'undefined' || cumulativeYearToDate == -9999) {# N/A #} else { # ${ cumulativeYearToDate }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "Annualized Returns", field: "annualizedInception", template: "#if (annualizedInception == -9999) {# N/A #} else { # ${ annualizedInception }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "Trailing 12 Mos.", field: "oneYear", template: "#if (oneYear == -9999) {# N/A #} else { # ${ oneYear }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "3 Yr.", field: "threeYearReturn", template: "#if (threeYearReturn == -9999) {# N/A #} else { # ${ threeYearReturn }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "5 Yr.", field: "fiveYearReturn", template: "#if (fiveYearReturn == -9999) {# N/A #} else { # ${ fiveYearReturn }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "10 Yr.", field: "tenYears", template: "#if (tenYears == -9999) {# N/A #} else { # ${ tenYears }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	 { title: "Since Inception", field: "cumulativeInception", template: "#if (cumulativeInception == -9999) {# N/A #} else { # ${ cumulativeInception }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } }
]

var performanceColumnsSelected = 
[
	{ title: "", template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
	{ title: "Fund Name", field: "legalName" },
	{ title: "Month To Date", field: "mtd", template: "#if (mtd == -9999) {# N/A #} else { # ${ mtd }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Year To Date", field: "cumulativeYearToDate", template: "#if (typeof cumulativeYearToDate == 'undefined' || cumulativeYearToDate == -9999) {# N/A #} else { # ${ cumulativeYearToDate }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Annualized Returns", field: "annualizedInception", template: "#if (annualizedInception == -9999) {# N/A #} else { # ${ annualizedInception }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Trailing 12 Mos.", field: "oneYear", template: "#if (oneYear == -9999) {# N/A #} else { # ${ oneYear }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "3 Yr.", field: "threeYearReturn", template: "#if (threeYearReturn == -9999) {# N/A #} else { # ${ threeYearReturn }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "5 Yr.", field: "fiveYearReturn", template: "#if (fiveYearReturn == -9999) {# N/A #} else { # ${ fiveYearReturn }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "10 Yr.", field: "tenYears", template: "#if (tenYears == -9999) {# N/A #} else { # ${ tenYears }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Since Inception", field: "cumulativeInception", template: "#if (cumulativeInception == -9999) {# N/A #} else { # ${ cumulativeInception }% #}# ", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } }
]

var statisticsColumns = 
[
	{ title: "", template: "<label class='nolabel_check' onclick='' data-statusType='${ statusType }'></label>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
	{ title: "Fund Name", field: "legalName" },
	{ title: "Sharpe Ratio", field: "sharpeRatio", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Sortino Ratio", field: "sortinoRatio", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "% of Positive Months", field: "percentagePosMonths", template: '#= percentagePosMonths #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Annualized Volatility", field: "annualizedVolatility", template: '#= annualizedVolatility #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Annualized Downside Deviation", field: "annDownSideDeviation", template: '#= annDownSideDeviation #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Maximum Drawdown", field: "maximumDrawdown", template: '#= maximumDrawdown #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	//{ title: "10 Yr.", field: "tenYears", template: '#= tenYears #%', width: 100, filterable: false},
	//{ title: "Since Inception", field: "cumulativeInception", template:'#= cumulativeInception #%', width: 100, filterable: false}
]

var statisticsColumnsSelected = 
[
	{ title: "", template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
	{ title: "Fund Name", field: "legalName" },
	{ title: "Sharpe Ratio", field: "sharpeRatio", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Sortino Ratio", field: "sortinoRatio", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "% of Positive Months", field: "percentagePosMonths", template: '#= percentagePosMonths #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Annualized Volatility", field: "annualizedVolatility", template: '#= annualizedVolatility #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Annualized Downside Deviation", field: "annDownSideDeviation", template: '#= annDownSideDeviation #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Maximum Drawdown", field: "maximumDrawdown", template: '#= maximumDrawdown #%', filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	//{ title: "10 Yr.", field: "tenYears", template: '#= tenYears #%', width: 100, filterable: false},
	//{ title: "Since Inception", field: "cumulativeInception", template:'#= cumulativeInception #%', width: 100, filterable: false}
]

var correlationColumns = 
[
	{ title: "", template: "<label class='nolabel_check' onclick='' data-statusType='${ statusType }'></label>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>"},
	{ title: "Fund Name", field: "legalName" },
	{ title: "BarCap Global Agg TR", field: "barCapAgg", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "S&P 500", field: "sandp500", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "MSCI World TR LC", field: "msciWorldTRLC", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "MSCI Europe", field: "msciEurope", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "HFRI HF Comp Index", field: "hfrihfCompIndex", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "HFRI FoF Comp Index", field: "hfrifofCompIndex", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Barclay Global Macro Index", field: "bhgmi", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	//{ title: "10 Yr.", field: "tenYears", template: '#= tenYears #%', width: 100, filterable: false},
	//{ title: "Since Inception", field: "cumulativeInception", template:'#= cumulativeInception #%', width: 100, filterable: false}
]

var correlationColumnsSelected = 
[
	{ title: "", template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
	{ title: "Fund Name", field: "legalName" },
	{ title: "BarCap Global Agg TR", field: "barCapAgg", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "S&P 500", field: "sandp500", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "MSCI World TR LC", field: "msciWorldTRLC", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "MSCI Europe", field: "msciEurope", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "HFRI HF Comp Index", field: "hfrihfCompIndex", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "HFRI FoF Comp Index", field: "hfrifofCompIndex", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Barclay Global Macro Index", field: "bhgmi", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	//{ title: "10 Yr.", field: "tenYears", template: '#= tenYears #%', width: 100, filterable: false},
	//{ title: "Since Inception", field: "cumulativeInception", template:'#= cumulativeInception #%', width: 100, filterable: false}
]

var termsColumns =
[
	{ title: "", template: "<label class='nolabel_check' onclick='' data-statusType='${ statusType }'></label>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
    { title: "Fund Name", field: "legalName" },
	{ title: "Minimum Investment", field: "minimum", filterable: false,attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, format: "{0:C0}"},
	{ title: "Management Fee", field: "managementfee", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Incentive Fee", field: "incentivefee", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Subscriptions", field: "subscription", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Redemptions", field: "redemption", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Tax Reporting", field: "taxReporting", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } }
/*		{ title: "Notice", field: "notice", filterable: false},
		{ title: "Lockup", field: "lockup", filterable: false},
		{ title: "Exit Fee", field: "exitfee", filterable: false},
	*/ 
]

var termsColumnsSelected =
[
	{ title: "", template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", width: 35, sortable: false, filterable: false },
	{ title: "Firm Name", field: "frmshortname", template: "<div class='pointer product-info' data-fundId='${ fundId }'>${ frmshortname }</div>" },
    { title: "Fund Name", field: "legalName" },
	{ title: "Minimum Investment", field: "minimum", filterable: false,attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }, format: "{0:C0}"},
	{ title: "Management Fee", field: "managementfee", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Incentive Fee", field: "incentivefee", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Subscriptions", field: "subscription", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Redemptions", field: "redemption", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
	{ title: "Tax Reporting", field: "taxReporting", filterable: false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } }
]

var structuredProductsColumns = 
[
 	{ title: "Offering", field: "offering" },
 	{ title: "Asset Class", field: "assetClass" },
 	{ title: "Type", field: "type" },
 	{ title: "Underlying", field: "underlying" },
 	{ title: "Issuer", field: "spissuer.issuerName" },
 	{ title: "Payment", field: "payment" },
 	{ title: "Closing Date", field: "closingDate", template: "#= kendo.toString(kendo.parseDate(closingDate), 'MMM dd, yyyy') #" },
 	{ title: "Settle Date", field: "settleDate", template: "#= kendo.toString(kendo.parseDate(settleDate), 'MMM dd, yyyy') #" },
 	{ title: "CUSIP", field: "cusip" },
 	{ title: "Terms", field: "terms", headerAttributes: { style: "text-align: center" }, template: "#if (parseInt(terms) != 0) {# <div class='sp-document' style='cursor: pointer; text-align: center;' data-docid='${terms}'><img style='margin-top: 2px;' src='./resources/assets/icons/pdf-icon.png' alt='doc'></div> #}#" }
]

var hedgeFundLenses = ["Overview", "Performance", "Statistics", "Correlations", "Fund Terms"];
var privateEquityLenses = ["Overview", "Fund Terms"];

//var selectedColumns = performanceColumns;
//var selectedProductColumns = performanceColumnsSelected;

// change default lens of Hedge Fund to be Overview lens
var selectedColumns = overviewColumns;
var selectedProductColumns = overviewColumnsSelected;

var previousColumns;

var filterSections = [ { field: "strategy", title: "Strategy" }, { field: "investorLevel", title: "Investor Level" }, { field: "investorType", title: "Investor Type" } ];

$(document).bind("productsLoaded", function() {
	Server.caisUser.getLocalSessionInfo(function(response) {
		initializeFilterReset();
		initializeViewMenu();
		initializeRequestDocumentsHandler();
		initializeAnalytics();
		// initializeExcelExport();
		initProductCheckBoxes();
	    initProductInfoClickHandler();
	    // getOnOffShorePerformDocuments();     

	    var selectMenu = new MenuList($("#performance-summaries"), downloadPerformanceDocument, 140, true);

	    var user = response;


	    var removeButton = true;
	    $.each(user.userPermissions, function(i, permission) {
	    	if (permission.permissionId === 2) removeButton = false; // Generate Recommendations
	    });
	    if (removeButton) {
	        $("#subscribe, .instruction").remove();
	    }
	});

});

var currentTitle = "";
function setTitle(newTitle){
	currentTitle = newTitle ? newTitle : currentTitle;
	var $newTitle = $("<span>").text(currentTitle);
	$(".title-header").html($newTitle);
}
$(document).bind("loadProductsPage", function () {
    if (productsPageLoaded == false) {
        productsPageLoaded = true;
        selectProductType(1);
        setTitle();
    } else {
        $(window).trigger("resize");
    }
});

function selectProductType(productTypeId) {
	selectedProductTypeId = productTypeId;
    Server.getProductsByType({ productTypeId: productTypeId }, function (response) {
        filteredProductData = response;
        selectedProductData = response;
        allResults = response.length;

        loadProductGrid();
        loadSelectedProductsGrid();
        createSplitter();

        //createProductList();
        $(document).trigger("initializeSubscribeButton");

        // check if we got here via quick invest
        var quickInvestId = localStorage["quickInvestFundId"];
        if (quickInvestId) {
            localStorage.removeItem("quickInvestFundId");
            $("#products .grid-wrapper.available-products .product-info[data-fundid='" + quickInvestId + "']").parents("tr").find(".nolabel_check").click();
            $("#subscribe").click();
        }
        // loadProductList();
        $(".filter-list").jScrollPane();

        createFilters();
        subFilters = checkForFilters();
        filterResults();
        
        
        if (loadHash) {
        	// productList.find(':contains(' + loadHash + ')').click();
        	// TODO: make hash go to a product page
        	//window.location.hash = '';
        	selectProduct(loadHash);
        	loadHash = null;
        }
    });
	
}
// hack to show a product from the separate syndicate page
$(window).on('hashchange', function() {
  	selectProduct(decodeURIComponent(window.location.hash).replace('#', ''));
  	$('#main-nav .products ul').hide();
  	setTimeout(function() {
  		$('#main-nav .products ul').removeAttr('style');
  	}, 200);
}).trigger("hashchange");
function loadProductGrid() {	
	$("#products .main-column-content .grid-wrapper.available-products").replaceWith("<div class='grid-wrapper available-products'></div>");
	$("#products .main-column-content .grid-wrapper.available-products").kendoGrid({
		dataSource: {
			data: filteredProductData,
			change: setTableRecords
		},
		sortable: {
			mode: "single",
			allowUnsort: false
		},
		columns: selectedColumns,
        filterable: true,
        dataBound: checkForSelectedProducts
	});
	checkForSelectedProducts();
	$("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check:not([data-statustype='Open']):not([data-statustype='Limited Capacity']):not([data-statustype='Wait List'])").each(function(){
		$(this).addClass("disabled-check");
	});
}

function loadSelectedProductsGrid() {
	$("#products .main-column-content .grid-wrapper.selected-products").replaceWith("<div class='grid-wrapper selected-products'></div>");
	$("#products .main-column-content .grid-wrapper.selected-products").kendoGrid({
		dataSource: {
			data: selectedProducts
		},
		columns: selectedProductColumns,
		scrollable: true,
		sortable: {
			mode: "single",
			allowUnsort: false
		}
	});	
}

function createSplitter() {	
	var totalHeight = $("#products .main-column").height();
	
	//$("#products .main-column-content").height(totalHeight - 90 -37);
	setMainContentHeight();
	var remainder = $("#products .main-column-content").height() % 4;	
	var paneHeight = ( $("#products .main-column-content").height() - remainder ) / 4;
	
	$("#products .main-column-content").kendoSplitter({
        panes: [
            { collapsible: false, size: paneHeight * 3 + remainder + "px", min: "200px" },
            { collapsible: false, size: (paneHeight - 10) + "px", min: "50px" }
        ],
        orientation: "vertical",
        resize: onSplitterResize
	});
	//,{ collapsible: false, size: "40px", resizable: false, scrollable: false }
}

//when the user clicks on a new set of columns replace the main-column-content (otherwise we keep the previous kendo data, which can cause problems)
//create new grid-wrapper's for each grid, load the grids, then create the splitter, and then re-init the checkboxes to add / remove products
function reloadGridViewColumns() {
    $("#products .main-column-content").replaceWith("<div class='main-column-content'/>");
    $("#products .main-column-content").append("<div class='grid-wrapper available-products'/>");
    $("#products .main-column-content").append("<div class='grid-wrapper selected-products'/>");
	loadProductGrid();
	loadSelectedProductsGrid();
	initProductCheckBoxes();
	createSplitter();
	$(document).trigger("initializeSubscribeButton");
}

function setProductViewColumns(viewName) {

    // This function fires whenever the user selects an option from the lenses drop down
    // Instead of just calling reloadGridViewColumns() we need to get the new data from the server
    // put that data into selectedProductData, then call reloadGridViewColumns()

	var view = $(viewName).text() || viewName;
	switch (view) {
		case "Overview":
			selectedColumns = overviewColumns;
			selectedProductColumns = overviewColumnsSelected;
			reloadGridViewColumns();
			break;
		case "Performance":
			selectedColumns = performanceColumns;
			selectedProductColumns = performanceColumnsSelected;
			reloadGridViewColumns();
			break;
		case "Statistics":
			selectedColumns = statisticsColumns;
			selectedProductColumns = statisticsColumnsSelected;
			reloadGridViewColumns();
			break;
		case "Correlations":
			selectedColumns = correlationColumns;
			selectedProductColumns = correlationColumnsSelected
			reloadGridViewColumns();
			break;
		case "Fund Terms":
			selectedColumns = termsColumns;
			selectedProductColumns = termsColumnsSelected;
			reloadGridViewColumns();
			break;
	}	
}

function initProductCheckBoxes() {
	
	Server.caisUser.getLocalSessionInfo(function(response) {
	    var user = response;
	    var hasGenerateRecommendationPermission = false;
	    $.each(user.userPermissions, function(i, permission) {
	    	if (permission.permissionId === 2){
	    		hasGenerateRecommendationPermission = true;
	    	}
	    });
	
	    $("#products .main-column-content").on("click", ".grid-wrapper.available-products tbody .nolabel_check", function () {
	        
        	if (!hasGenerateRecommendationPermission) {
    	        new Alert("Thank you for your interest in conducting a transaction on the CAIS platform, however you must first become a Transactional Member. To do so, please contact us via phone or email:<br/><br/>Email Us:&nbsp;&nbsp; info@caisgroup.com<br/>Call Us:&nbsp;&nbsp; +1 855 844 2247", "OK");
    	        return;
    	    }
	    	
	        var check = $(this);
	        var grid = $("#products .main-column-content .grid-wrapper").data("kendoGrid");
	    	var product = grid.dataItem($(this).parents("tr"));
	        var statusType = $(this).attr("data-statusType");
	
	        if(check.hasClass("disabled-check")) {
	            return;
	        }
	
	
	        // if (cannotSelectFunds && product.fundId !== selectedProducts[0].fundId) {
	        	// return;
	        // }
	
	        switch (statusType) {
	            case "Pending":
	                break;
	            case "Watch":
	                break;
	            case "Request Documents":
	                break;
	            case "Wait List":
		            check.toggleClass("check-on");
			        if (check.hasClass("check-on")) {
		            	new Alert('The fund you selected is in a wait list status. If you have selected other funds they will be removed.', 'OK', 'CANCEL');
		            	$(document).bind("alertConfirm", function() {
			                removeAllProducts();
		                    addProductToCart(product);
		                    check.parents("td").addClass("added");
		                    cannotSelectFunds = true;
		            	});
		            	$(document).bind("alertCancel", function() {
			                check.toggleClass("check-on");
		            	});
		            	
		            	break;
		            } else {
		            	removeProductFromCart(product);
		            	cannotSelectFunds = false;
		            	break;
		            }
		            
	            default:
	            	if (cannotSelectFunds) 
	            		break;
	            
	            	check.toggleClass("check-on");
	                if (check.hasClass("check-on")) {
	                    addProductToCart(product);
	                    check.parents("td").addClass("added");
	                } else {
	                    removeProductFromCart(product);
	                }
	                break;
	        }
	    });
	    
	    $("#products .main-column-content").on("click", ".grid-wrapper.selected-products tbody .delete-button", function() {
	    	var fundId = $(this).parents("tr").find(".product-info").attr("data-fundid");
	    	var fundRow = $("#products .main-column-content .grid-wrapper.available-products tbody").find(".product-info[data-fundid=" + fundId + "]").parents("tr");
	    	fundRow.find(".nolabel_check").trigger("click");
	    });
		
		checkForSelectedProducts();
		
	});
}

function initProductInfoClickHandler() {
	$("#products").on("click", ".grid-wrapper.available-products tbody .product-info", function() {
		var grid = $("#products .main-column-content .grid-wrapper.available-products").data("kendoGrid");
		var selectedProduct = grid.dataItem($(this).parents("tr"));
		var options = {};
		options.viewArray = filteredProductData;
		options.selectedProduct = selectedProduct;
		options.allowNavigation = true;
		options.dialogAddRemove = true;
		var dialog = new Dialog("fund-info", options);
	});
	
	$("#products").on("click", ".grid-wrapper.selected-products tbody .product-info", function() {
		var grid = $("#products .main-column-content .grid-wrapper.selected-products").data("kendoGrid");
		var selectedProduct = grid.dataItem($(this).parents("tr"));
		var options = {};
		options.viewArray = filteredProductData;
		options.selectedProduct = selectedProduct;
		options.allowNavigation = true;
		options.dialogAddRemove = true;
		var dialog = new Dialog("fund-info", options);
	});
}

$(document).bind("resizeProductsSplitter", function() {
	resizeProductsSplitter();
});

function resizeProductsSplitter() {
	var splitter = $("#products .main-column-content").data("kendoSplitter");
	if(splitter) {
		var bottomPaneHeight = splitter.options.panes[1].size.replace(/[^-\d\.]/g, '');
		splitter.size(".grid-wrapper.available-products", $("#products .main-column-content").height() - bottomPaneHeight - 47 + "px");
		
		var gridHeight = $(".grid-wrapper.available-products").height();		
		$(".grid-wrapper.available-products .k-grid-content").height(gridHeight);
	}
}
function setMainContentHeight(){
	var $mainPanel = $("#products .main-column-content"),
    	offset = $mainPanel.offset();
	   	if(offset){
	        var mainPanelPosY = offset.top,
				viewportHeight = $(window).height();
		$mainPanel.height(viewportHeight-mainPanelPosY -33 -40);
	}
}
function onSplitterResize() {
	setMainContentHeight();
    var splitter = $(".main-column-content").data("kendoSplitter");

    resizeGrid(".available-products");
    if (splitter) {
        if (splitter.options.panes[0].size != undefined) {
            var availableDiff = splitter.options.panes[0].size.replace(/[^-\d\.]/g, '') - $(".available-products .k-grid-header").innerHeight();
            $(".available-products .k-grid-content").height(availableDiff);
        }
    }
    
    resizeGrid(".selected-products");
    if (splitter) {
        if (splitter.options.panes[1].size != undefined) {
            var selectedDiff = splitter.options.panes[1].size.replace(/[^-\d\.]/g, '') - $(".selected-products .k-grid-header").innerHeight();
            $(".selected-products .k-grid-content").height(selectedDiff);
        }
    }
    
    var scroller = $(".filter-list").data("jsp");
    if (scroller) {
        scroller.reinitialise();
    }
}

function resizeProductGrid() {
    resizeGrid(".available-products");
    var scroller = $(".filter-list").data("jsp");
    if (scroller) {
        scroller.reinitialise();
    }
}

$(document).bind("addProductToCart", function(e, product) {
	addProductToCart(product);
});
function addProductToCart(selectedProduct) {
	selectedProducts.push(selectedProduct);
	var grid = $("#products .main-column-content .grid-wrapper.selected-products").data("kendoGrid");
	if(grid)grid.dataSource.data(selectedProducts);	

	checkForSelectedProducts();
	checkForSelectionComplete()
}

$(document).bind("removeProductFromCart", function(e, product) {
	removeProductFromCart(product);
});

function removeProductFromCart(selectedProduct) {
	var grid = $("#products .main-column-content .grid-wrapper.selected-products").data("kendoGrid");
	var selectedProductIndex = false;
	for(var i in selectedProducts) {
		if(selectedProduct.fundId == selectedProducts[i].fundId) {
			selectedProductIndex = i;
			break;	
		}
	}
	selectedProducts.splice(selectedProductIndex, 1);
	if(grid)grid.dataSource.data(selectedProducts);

	var selectedRowId = selectedProduct.fundId;
	var selectedRow = $("#products .main-column-content .grid-wrapper").find("div[data-fundId=" + selectedRowId + "]").parents("tr");
	selectedRow.find("label").parents("td").removeClass("added");
	var selectedRowCheckBox = $(selectedRow).find(".nolabel_check");
	selectedRowCheckBox.removeClass("check-on");
	
	checkForSelectedProducts();
	checkForSelectionComplete();
}

function removeAllProducts() {
	var grid = $("#products .main-column-content .grid-wrapper.selected-products").data("kendoGrid");
	selectedProducts = [];
	if(grid)grid.dataSource.data(selectedProducts);
	$("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check").removeClass("check-on").parents("td").removeClass("added");
}

function initializeFilterReset() {
	$("#products .filter-reset").on("click", function() {
		$("#products .filter-list .label_check").addClass("check-on");
		subFilters = [];
		filterResults();
	});
}

function initializeViewMenu() {
	var myMenu = new MenuList("#view-select", setProductViewColumns, 90);
}

/* enable or disable the subscribe button to continue workflow */
function checkForSelectionComplete() {
	var count = selectedProducts.length;
	if(count > 0) {
		$("#products .control-bar .command-button-disabled").removeClass("command-button-disabled").addClass("command-button");
	} else if (count == 0 ){
		$("#products .control-bar .command-button").removeClass("command-button").addClass("command-button-disabled");
	}
}

function createProductList() {			
	if(products.length == 0) {
		$("#performance-summaries").remove();
		$("#analytics").remove();
	}	
}

function selectProduct(product) {
	if (!product){
		setTitle("Hedge Fund ");
		return;
	} 
    $("#gridoverlay").remove();
    
    switch (product) {
        case "precious-metals":
        	setTitle("Precious Metals ");
        	$("#products .table-records").html("<span class='bracket'></span>");
        	$(".products-columns-wrapper").hide(); 
        	loadPreciousMetalsButton();
            break;

        case "structured-solutions":
	        window.location = '/products/structured-solutions';
            break;

        case "hedge-funds":

            $(".products-columns-wrapper").show();
            $(".performance-summary").show();
            $("#analytics").show();
            setTitle("Hedge Fund ");
            filterSections = [{ field: "strategy", title: "Strategy" }, { field: "investorLevel", title: "Investor Level" }, { field: "investorType", title: "Investor Type" }];
            if (previousColumns != undefined) {
                selectedColumns = previousColumns;
            } else {
                selectedColumns = overviewColumns;
            }

            selectedProductTypeId = 1;
            Server.getProductsByType({ productTypeId: selectedProductTypeId }, function (response) {
                filteredProductData = products;
                selectedProductData = response;


                reloadGridViewColumns();

                //var productGrid = $("#products .main-column-content .grid-wrapper").data("kendoGrid");
                //productGrid.dataSource.data(selectedProductData);
                createFilters();
                $("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check:not([data-statustype='Open']):not([data-statustype='Limited Capacity']):not([data-statustype='Wait List'])").each(function () {
                    $(this).addClass("disabled-check");
                });
                // set default filters

                subFilters = checkForFilters();
                filterResults();

                $("#view-select .itemsList").empty();
                for (var i in hedgeFundLenses) {
                    $("#view-select .itemsList").append("<li>" + hedgeFundLenses[i] + "</li");
                }

//                setProductViewColumns("Performance");
//                $("#view-select .selected div").text("Performance");
                // change the default lens of Hedge Fund to be Overview lens
                setProductViewColumns("Overview");
                $("#view-select .selected div").text("Overview");
            });
			
            break;

        case "RIC":
            $(".products-columns-wrapper").show();
            $(".performance-summary").show();
            $("#analytics").show();
            setTitle("RIC ");
            filterSections = [{ field: "strategy", title: "Strategy" }, { field: "investorLevel", title: "Investor Level" }, { field: "investorType", title: "Investor Type" }];
            if (previousColumns != undefined) {
                selectedColumns = previousColumns;
            } else {
                selectedColumns = overviewColumns;
            }

            selectedProductTypeId = 2;

            Server.getProductsByType({ productTypeId: selectedProductTypeId }, function (response) {
                filteredProductData = products;
                selectedProductData = response;

                reloadGridViewColumns();
                createFilters();
                $("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check:not([data-statustype='Open']):not([data-statustype='Limited Capacity']):not([data-statustype='Wait List'])").each(function () {
                    $(this).addClass("disabled-check");
                });

                subFilters = checkForFilters();
                filterResults();

                $("#view-select .itemsList").empty();
                for (var i in hedgeFundLenses) {
                    $("#view-select .itemsList").append("<li>" + hedgeFundLenses[i] + "</li");
                }

//                setProductViewColumns("Performance");
//                $("#view-select .selected div").text("Performance");
                // change the default lens of Hedge Fund to be Overview lens
                setProductViewColumns("Overview");
                $("#view-select .selected div").text("Overview");
            });
            break;

        case "private-equity":
            $("#view-select .itemsList").empty();
            for (var i in privateEquityLenses) {
                $("#view-select .itemsList").append("<li>" + privateEquityLenses[i] + "</li");
            }
            setTitle("Private Equity ");
            $(".products-columns-wrapper").show();           
            $("#view-select .selected div").text("Overview");
            selectedProductTypeId = 3;
            Server.getProductsByType({ productTypeId: selectedProductTypeId }, function (response) {
                filteredProductData = response;
                selectedProductData = response;
                setProductViewColumns("Overview");
                filterSections = [{ field: "strategy", title: "Strategy" }, { field: "investorLevel", title: "Investor Level" }, { field: "investorType", title: "Investor Type" }];
                createFilters();
                $("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check:not([data-statustype='Open']):not([data-statustype='Limited Capacity']):not([data-statustype='Wait List'])").each(function () {
                    $(this).addClass("disabled-check");
                });

                subFilters = checkForFilters();
                filterResults();
            });
            break;
        case "Syndicate":
        	window.location = '/products/syndicate';
        	break;
        default:
        	$("#products").find(".product-info[data-fundid='"+product+"']").click();
        	break;

    }
}

function openPreciousMetalsWindow() {
    $("body").append("<div class='dialog-wrapper'/>");
	$(".dialog-wrapper").append("<div class='iframeWrapper precious-metals'/>");
	$(".iframeWrapper").append("<img src='./resources/assets/page-dialog/dialog-close-icon.png' alt='close' class='close-icon'/>");

	$("<div/>").load("resources/views/cais-alternatives/precious-metals.html", function(response) {
		$(".iframeWrapper").append(response);
		
		Server.getGBIParameters(null, function(response) {
		   	var gbiURL=response.gbiURL;
		    var t1 = response.t1;
		    var t2 = response.t2;
		    var un = response.userName;
		    var ad = response.advisor;
		    var em = response.email;
		    var af = response.firmName
		    var caisURL = response.caisURL;
		    var canOpenGBIAccounts = response.canOpenGBIAccounts;
		    var url = response.gbiURL+"PortalSignIn/SignOn?un="+un+"&ad="+ad+"&em="+em+"&af="+af+"&t1="+t1+"&t2="+t2+"&url="+caisURL+"precious-metals-landing";
		    //var url = gbiURL+"PortalSignIn/SignOn?un="+un+"&ad="+un+"&em="+un+"&t1="+t1+"&t2="+t2+"&url=https://www.caisgroup.com/CAISmetals.php";
		    
		    //var url = "http://localhost:8080/precious-metals-landing";
		    $(".precious-metals-loaded-content").append("<iframe src='"+url+"' frameborder='0' marginheight='0' marginwidth='0' width='100%' height='100%' scrolling='auto'/>");
		    
		    /***********  Session Sync *************/
		    
		    var link = gbiURL+"Content/images/SessionImage.png";
		    $(".precious-metals-loaded-content").append("<img style='display:none' id='SessionImage' src=''/>");
		    document.getElementById("SessionImage").setAttribute("src", link + "?Guid=" + new Date().getTime());
		    
		    /***********  End *************/
		    
		    initializePreciousMetalsButtons(gbiURL, t1, t2, un, ad, em, af, caisURL,canOpenGBIAccounts);
		});
	});
	
	$(".dialog-wrapper .close-icon").click(function() {
		$(".iframeWrapper").remove();
		$(".dialog-wrapper").remove();
	});	
}

function initializePreciousMetalsButtons(gbiURL, t1, t2, un, ad, em, af, caisURL,canOpenGBIAccounts) {
	
	if(canOpenGBIAccounts) {
		$('#new-account').click(function() {
			var url = gbiURL+"Registration/StartRegistrationWithAdvisor?un="+un+"&ad="+ad+"&em="+em+"&af="+af+"&t1="+t1+"&t2="+t2+"&url="+caisURL+"/precious-metals-landing";
			$(".precious-metals-loaded-content").empty();
			$(".precious-metals-loaded-content").append("<iframe src='"+url+"' frameborder='0' marginheight='0' marginwidth='0' width='100%' height='100%' scrolling='auto'/>"); 
		});
	} else{
		$('#new-account').hide();
	}
	$('#trading').click(function() {
		 var url = gbiURL+"PortalSignIn/SignOn?un="+un+"&ad="+ad+"&em="+em+"&af="+af+"&t1="+t1+"&t2="+t2+"&url="+caisURL+"/precious-metals-landing";
		 $(".precious-metals-loaded-content").empty();
		 $(".precious-metals-loaded-content").append("<iframe src='"+url+"' frameborder='0' marginheight='0' marginwidth='0' width='100%' height='100%' scrolling='auto'/>"); 
	});
	$('#pricing').click(function() {
		 var url = gbiURL+"launch/productsiframe?un="+un+"&ad="+ad+"&em="+em+"&af="+af+"&t1="+t1+"&t2="+t2+"&url="+caisURL+"/precious-metals-landing";
		 $(".precious-metals-loaded-content").empty();
		 $(".precious-metals-loaded-content").append("<iframe src='"+url+"' frameborder='0' marginheight='0' marginwidth='0' width='100%' height='100%' scrolling='auto'/>"); 
	});
}
function loadStructuredProducts() {
    $("#gridoverlay").remove();
    $(".products-columns-wrapper").hide();
    $(".performance-summary").hide();
     setTitle("Structured Solutions ");
    $("#analytics").hide();

    filterSections = [{ field: "offering", title: "Offering" }, { field: "assetClass", title: "Asset Class" }, { field: "type", title: "Type" }, { field: "spissuer.issuerName", title: "Issuer" }, { field: "payment", title: "Payment" }, { field: "state", title: "Status" }];
	selectedColumns = structuredProductsColumns;

	$.getJSON("/getStructuredProducts", {}, function (response) {
	    filteredProductData = response.msg;
	    selectedProductData = response.msg;
	    controlBar = $("#products .control-bar.new-sticky-control-bar");
	    $("#products .main-column-content").replaceWith("<div class='main-column-content'/>");
	    $("#products .main-column-content").append("<div class='grid-wrapper available-products'/>");
	    loadProductGrid();

	    initProductCheckBoxes();
	    createFilters();
	    $("#state").find("span.label").each(function () {
	        if ($(this).text() == "Closed") {
	            $(this).click();
	        }
	    });
	    subFilters = checkForFilters();
	    filterResults();
	    $("#products .grid-wrapper").on("click", ".sp-document", function (e) {
	        var docId = $(e.currentTarget).attr("data-docid");
	        window.open('/api/document/download?docId=' + docId);
	    });
	});
}

function createFilters() {
	$(".check-list").remove();
	$(".select-options").remove();
	$(".left-column .column-sub-title:not(#productSelector)").remove();
	for ( var i in filterSections ) {
		var filterSection = filterSections[i];
		//create the title for this filter, and the following UL
		var sectionTitle = $("<div class='column-sub-title'/>");
		sectionTitle.append(filterSection.title);
		var sectionFilters = $("<ul class='check-list' id='" + filterSection.field + "'/>");
		$(".filter-list .jspPane").append(sectionTitle);
		$(".filter-list .jspPane").append(sectionFilters);
		
		//Create array of filters for each section
		var filterArray = [];
		for ( var j in selectedProductData ) {
			var filterName = selectedProductData[j][filterSections[i].field];
			if ($.inArray(filterName, filterArray) === -1 )
				// do not show this filter in list
				if (filterName != 'U.S. Tax Exempt & U.S. Taxable') filterArray.push(filterName);
		}
		
		if ( filterArray.length > 3 ) {
			var selectAll = $("<li><label class='label_check'>All</label></li>");
			selectAll.click(function() {
			    if($(this).find("label").hasClass("check-on")) {
			        $(this).parents("ul").children().each(function() {
			            $(this).find("label").addClass("check-on");
			        });
			    } else {
			        $(this).parents("ul").children().each(function() {
			            $(this).find("label").removeClass("check-on");
			        });
			    }		
				subFilters = checkForFilters();
				filterResults();
			});

			selectAll.appendTo($("#" + filterSection.field));
		}

		// sort alphabetically
		if (filterSections[i].field === 'investorLevel') {
			filterArray.sort();
		}
		
		for ( var k in filterArray ) {
			var filter = $("<li><label class='label_check'><span class='label'/><span class='results'/></label></li>");
			
			//Calculate the number of results for this filter
			var numberOfResults = 0;
			for ( var m in selectedProductData ) {
				if ( selectedProductData[m][filterSection.field] == filterArray[k] ) {
					numberOfResults++;
				}
			}
			
			$(filter).find(".label").append(filterArray[k]);
			$(filter).find(".results").append(" (" + numberOfResults + ")");
			$("#" + filterSection.field).append(filter);
		}					
	}
	initializeFilterCheckboxes();
	setTableRecords();
	var pane = $(".filter-list").data("jsp");
	if(pane) {
		pane.reinitialise();
	}
}
function setTableRecords(){
	if(filteredProductData != null && selectedProductData != null) {
		var $products = $("#products"),
			grid = $products.find(".main-column-content .grid-wrapper.available-products").data("kendoGrid");
		if(grid){
			var dataSource = grid.dataSource,
		    	allData = dataSource.data(),
		    	filters = dataSource.filter(),
		    	query = new kendo.data.Query(allData),
		    	data = query.filter(filters).data;
		    $products.find(".table-records").html("<span class='bracket'>(</span>" + data.length + "/" + selectedProductData.length + "<span class='bracket'>)</span>");
		}
	}
}

function checkForFilters() {
	var array = [];
	$(".filter-list .label_check").each(function() {
		if (!$(this).hasClass("check-on")) {
			var filter = [];
			filter.value = $(this).find(".label").text();
			filter.label = $(this).parents("ul").attr("id");
			array.push(filter);
		}
	});
	
	return array;
}

function initializeFilterCheckboxes() {
	$(".filter-list .label_check").addClass("check-on");
	$(".filter-list .label_check").on("click", function() {
		$(this).toggleClass("check-on")
		var selectedFilter = {};
		selectedFilter.value = $(this).find(".label").text();
		selectedFilter.label = $(this).parents("ul").attr("id");
		if ( $(this).hasClass("check-on") ) {
			removeFilter(selectedFilter);
		} else {
			addFilter(selectedFilter);
		}
	});   
}

function addFilter(selectedFilter) {
	subFilters.push(selectedFilter);
	filterResults();
}

function removeFilter(selectedFilter) {
	var indexToRemove;
	for ( var i in subFilters) {
	    if (selectedFilter.value == subFilters[i].value) {
	        indexToRemove = i;
	    }
	}
	subFilters.splice(indexToRemove, 1);
	filterResults();
}

function filterResults() {
	var productGrid = $("#products .main-column-content .grid-wrapper").data("kendoGrid");

	if(productGrid){
		var filteredFunds = [];
			
		for ( var i in selectedProductData ) {
			if( doesMatchSubFilter(selectedProductData[i]) ) {
				filteredFunds.push(selectedProductData[i]);
			}
		}
			
		filteredProductData = filteredFunds;
		
		productGrid.dataSource.data(filteredProductData);	
		
	}
	setTableRecords();
	$("#products .main-column-content .grid-wrapper.available-products tbody .nolabel_check:not([data-statustype='Open']):not([data-statustype='Limited Capacity']):not([data-statustype='Wait List'])").each(function(){
		$(this).addClass("disabled-check");
	});
}

function doesMatchSubFilter(row) {
	for (var j in subFilters) {
		if( subFilters[j].value == row[subFilters[j].label] ) {
			return false;
		}
	}
	
	return true;
}

function loadPreciousMetalsButton() {
	$(".left-column .column-sub-title:not(#productSelector)").remove();
	$(".left-column .check-list").remove();
	var grid = $("#products .main-column-content .grid-wrapper").data("kendoGrid").dataSource.data([]);
	
	$(".left-column .jspPane").append("<div class='column-sub-title'><ul class='command-buttons' style='margin-left:38px; float: left;'><li id='launchPreciousMetals'><div class='command-button'><div class='inner'>LAUNCH</div></div></li></div><ul>");
	$(".left-column #launchPreciousMetals").click(openPreciousMetalsWindow);

	$(".workspace").append("<div id='gridoverlay' style='z-index: 1; position: absolute; left: 230px; right: 0; top: 0; bottom: 0; background: black; opacity: .5;'/>");
}


function checkForSelectedProducts() {
	for(var i in selectedProducts) {
		var id = selectedProducts[i].fundId;
		var availableRow = $("#products .main-column-content .grid-wrapper.available-products").find("div[data-fundId=" + id + "]").parents("tr");
		availableRow.find("label").addClass("check-on").parents("td").addClass("added");
		var selectedRow = $("#products .main-column-content .grid-wrapper.selected-products").find("div[data-fundId=" + id + "]").parents("tr");
		selectedRow.find("label").addClass("check-on").parents("td").addClass("added");
	}

}

function initializeRequestDocumentsHandler() {
	$("#products .main-column-content").on("click", ".request-documents", function() {
		var options = {};
		var grid = $("#products .main-column-content .grid-wrapper").data("kendoGrid");
		options.selectedFund = grid.dataItem($(this).parents("tr"));
		var alert = new Alert("Are you sure you want to request these documents?", "YES", "NO");
		$(document).bind("alertConfirm", function(){
			Server.requestFundDocs( {fundName :options.selectedFund.legalName}, function(response) {
	    		var alert = new Alert("Document Request has been received.", "OK");
	    	});
		});
	});
}

function initializeAnalytics() {
    $("#analytics").click(function () {
    	Server.caisUser.getLocalSessionInfo(function(response) {
	        var user = response;
			if(user.hasAnalyticsAccess) {
				Server.getFundSpireParameters(null, function(response) {			
					var milliseconds = response.time;
					var hash = response.hash;
					var url = response.fundspireURL+response.authorizingUser+"&user="+response.userEmail+"&timestamp="+milliseconds+"&hash="+hash;
					$("body").append("<div class='dialog-wrapper'/>");
					$("body").append("<div class='iframeWrapper'/>");
					$(".iframeWrapper").append("<img src='./resources/assets/page-dialog/dialog-close-icon.png' alt='close' class='close-icon'/>");
					$(".iframeWrapper").append("<iframe src='"+url+"' frameborder='0' marginheight='0' marginwidth='0' width='100%' height='100%' scrolling='auto'/>");	
					$(".iframeWrapper .close-icon").click(function() {
						$(".iframeWrapper").remove();
						$(".dialog-wrapper").remove();
					});
					
				});
			} else {
				var alert = new Alert("You do not have access to Analytics. Would you like to request access?", "YES", "NO");
				var investorsToDelete = [];
				$(document).bind("alertConfirm", function(){
					$.getJSON('/requestFundspireAccess', {}, function(response)
					{
						var confirmAlert = new Alert("An request has been sent to CAIS, someone will get back to you shortly.", "OK");
					});
				});	
			}
		});
	});
}


/*function initializeExcelExport() {
	$(".export-to-excel").click(function() {
		exportPerformanceToExcel(filteredProductData);
	});
}*/

function initFundAnnualChartData(fundId) {
	Server.getFundAnnualsChart( {fundId :fundId}, function(response) { 
			annualChartData = response;
	});
}

/*function getOnOffShorePerformDocuments(){
	Server.getOnOffShorePerformDocuments( {}, function(response) { 
		var performDocuments = response;
		jQuery.each(performDocuments, function(i, val){
			if(val.categoryId == 12){
				$("#performance-summaries").find("div[data-docName=onshore]").attr("data-docId", val.documentId);
			}else if(val.categoryId == 13){
				$("#performance-summaries").find("div[data-docName=offshore]").attr("data-docId", val.documentId);
			}
		});
		
	});
}*/

function downloadPerformanceDocument(selectedDocument) {
	/*var documentId = $(selectedDocument).find("div").attr("data-docId");
	getFundDocuments(documentId);*/
}

$(document).bind("dialogs/confirm-requestLoaded", function(e, options) {
    $(".cancel").click(function() {
    	$(document).trigger("dialogClose");
    });

    $(".confirm").click(function() {
    	
    	Server.requestFundDocs( {fundName :options.selectedFund.legalName}, function(response) {
    		var alert = new Alert("Document Request has been received.", "OK");
    	});

    	$(document).trigger("dialogClose");
    });
});

function exportPerformanceToExcel(data){
	var params = {
		data: JSON.stringify(data),
		productLine: selectedProductTypeId
	};
	$.download('/exportPerformanceToExcel', params, 'POST');
}
/*
//Local search
<input id="local-search" style="position:absolute; z-index:99999" />
$("#local-search").on("keypress blur change", function () {
    var filter = { logic: "or", filters: [] };
    searchValue = $(this).val();
    if (searchValue && searchValue!=='') {
        $.each($("#products .main-column-content .grid-wrapper.available-products").data("kendoGrid").columns, function( key, column ) {
            if(column.filterable) {
                filter.filters.push({ field: column.field, operator:"contains", value:searchValue});
            }
        });
    }
    $("#products .main-column-content .grid-wrapper.available-products").data("kendoGrid").dataSource.query({ filter: filter });
});
*/


}).call();