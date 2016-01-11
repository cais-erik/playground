(function() {
var thisDialogBody;
var selectedFund;
var selectedProductArray;
var allowProductNavigation;
var underlyingData;
var fundPerformanceGraphData = {};
var factSheetId;
var isCAISFund = false;
var factSheetName;
var lastFactSheetObtained;
var fundContainsFactSheet;
var dialogAddRemove;
var quickInvest = false;
var pageAction = false;
var underlyingColumns =
[
    { title: "Year", headerAttributes:{'class':'right-separator'}  },
    { title: "Jan" },
    { title: "Feb" },
    { title: "Mar" },
    { title: "Apr" },
    { title: "May" },
    { title: "Jun" },
    { title: "Jul" },
    { title: "Aug" },
    { title: "Sep" },
    { title: "Oct" },
    { title: "Nov" },
    { title: "Dec" },
    { title: "Annual Return", headerAttributes:{'class':'left-separator'}}
]

function mysqlDateToJsDate(string) {
    var date = string.split('-');
    return new Date(date[0], parseInt(date[1] - 1), date[2]);
}

function sortDocumentByFileDate(doc1, doc2 ){
	doc1.jsDate = mysqlDateToJsDate(doc1.date);
	doc2.jsDate = mysqlDateToJsDate(doc2.date);
	return doc1.jsDate>doc2.jsDate ? -1 : doc1.jsDate<doc2.jsDate ? 1 : 0;
}

$(document).bind("dialogs/fund-infoLoaded", function (event, options) {
    thisDialogHeader = $("#fund-info-header");
    thisDialogBody = $(".dialog-body");
    selectedFund = options.selectedProduct;
    localStorage.fundMgrName = selectedFund.mgrName;
    selectedProductArray = options.viewArray;
    allowProductNavigation = options.allowNavigation;
    dialogAddRemove = options.dialogAddRemove;
    if (selectedFund.productTypeId == 3) {
        quickInvest = false;
        $(".dialog-side-column .performance-icon").closest("li").remove();
        // $(".dialog-side-column .risk-metrics").closest("li").remove();
    }
    if (options.quickInvest) {
        quickInvest = true;
        pageAction = options.pageAction;
    }
    if (options.pageAction) {
        pageAction = options.pageAction;
        $(".close-icon").addClass("directPage");
        $(".close-icon.directPage").click(function(){
        	document.location = "/cais-alternatives";
        });
        switch (pageAction) {
            case "events":
                $(thisDialogBody).load("/resources/views/fund-info-dialog/events.html?" + caisVersion, fundInfoInitializeBody);
                break;
            case "performance":
                $(thisDialogBody).load("/resources/views/fund-info-dialog/performance.html?" + caisVersion, function () {
                    fundInfoInitializeBody();
                    $(document).trigger("performance.html");
                });
                break;
            case "mercer":
                $(thisDialogBody).load("/resources/views/fund-info-dialog/mercer.html?" + caisVersion, function () {
                    fundInfoInitializeBody();
                    $(document).trigger("mercer.html");
                });
                break;
            case "fundInfo":
                $(thisDialogBody).load("/resources/views/fund-info-dialog/fund-information.html?" + caisVersion, function () {
                    fundInfoInitializeBody();
                    $(document).trigger("mercer.html");
                });
                break;

        }
    } else {
        $(thisDialogBody).load("/resources/views/fund-info-dialog/fund-information.html?" + caisVersion, fundInfoInitializeBody);
    }

});

$(document).bind("fund-information.html", function() {
	loadFundInfo();
});

$(document).bind("performance.html", function() {
	Server.getUnderlyingFundDataById( {fundId:selectedFund.fundId}, function(response) {
		underlyingData = response;
		$("#underlying-fund-table").kendoGrid({
			dataSource: {
				data: underlyingData
				},
			sortable: false,
			groupable: false,
			scrollable: false,
			columns: underlyingColumns,
			rowTemplate: underlyingFundTemplate
		});
		var pane = $(".dialog-body").data("jsp");
		pane.reinitialise();
	 });                    
	 populateFundPerformanceStats();
	 initFundAnnualChartData(selectedFund.fundId);
});

$(document).bind("mercer.html", function() {
	populateMercer();
	// CAIS-1591... fund info dialog text is cut off, revisit if fund info CSS is ever refectored
	setTimeout(function() {
		$(window).trigger("resize");
	}, 500);
});
$(document).on('click', '.current-fund-fact-card-link', function(){
	getFundDocuments(factSheetId);
});
$(document).bind("fund-multimedia.html", function () {
	populateMultimedia();
	$(window).trigger("resize");
});


function fundInfoInitializeBody() {
    initializeProductNavigation();
    initializeTabs();

	/* initialize content link events */
	$("#fund-info-dialog").on("click", ".popup-load-view", function ()
	{
	    var pane = $(".dialog-body").data("jsp");
	    var view = $(this).attr("href");
	    pane.getContentPane().load("/resources//views/fund-info-dialog/" + view + "?" + caisVersion, function () {
            $(document).trigger(view);
            initializeTabs();
            $(window).trigger("resize");
            if (selectedFund.productTypeId == 3) {
                quickInvest = false;
                $(".dialog-side-column .performance-icon").closest("li").remove();
                // $(".dialog-side-column .risk-metrics").closest("li").remove();
            }
        });
	    return false;
	});
	if (selectedFund.productTypeId == 3) {
	    $(".dialog-side-column .performance-icon").closest("li").remove();
	    // $(".dialog-side-column .risk-metrics").closest("li").remove();
	}
    loadFundInfo();
    $(".dialog-body").jScrollPane({
    	verticalGutter: 0
    });

}

$(window).resize(function () {
	//$("#fund-info-dialog .dialog-main-column").width($("#fund-info-dialog .dialog-body").width() - 381);

    var pane = $("#fund-info-dialog .dialog-body").data("jsp");
    if(pane)
    	pane.reinitialise();

    $(".chart").each(function(){
    	var chart = $(this).data("kendoChart");
    	if(chart)
    		chart.redraw();
    });

    var notesScroller = $(".end-notes-scroller").data("jsp");
    if(notesScroller)
    	notesScroller.reinitialise();

    if($("#fund-info-dialog .dialog-body").height() > $("#fund-info-dialog .dialog-body .jspPane").height())
    	$("#fund-info-dialog .dialog-side-column").height($("#fund-info-dialog .dialog-body").height() - 50);
    else
    	$("#fund-info-dialog .dialog-side-column").height($("#fund-info-dialog .dialog-body .jspPane").height() - 50);
});

function loadFundInfo() {
	loadFundFunctions();
	//loadSpud();
	populateFundInfo();
}

function initializeProductNavigation() {
	// shamelessly stolen from underscore.js
	var debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;
		var getTime = (Date.now || function() {
			return new Date().getTime();
		});
		return function() {
			context = this;
			args = arguments;
			timestamp = getTime();
			var later = function() {
				var last = getTime() - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						context = args = null;
					}
				}
			};
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}
			return result;
		};
	};
	/* initialize next, previous events */
	if(allowProductNavigation) {
		// debounce these two functions to prevent multiple requests to the server
		$("#fund-info-dialog .fund-info-left").show().click(debounce(toPreviousProduct, 600, true));
		$("#fund-info-dialog .fund-info-right").show().click(debounce(toNextProduct, 600, true));
	}
}

function toPreviousProduct() {
	var currentIndex;
	for(var i in selectedProductArray)
	{
		if(selectedFund.fundId == selectedProductArray[i].fundId)
		{
			currentIndex = i;
			break;
		}
	}
	currentIndex--;
	if(currentIndex < 0)
		currentIndex = selectedProductArray.length - 1;

	selectedFund = selectedProductArray[currentIndex];
	localStorage.fundMgrName = selectedFund.mgrName;
	$("#trumbaCalendarContainer").attr( 'src', function ( i, val ) { return val; });
	$("#mainTrumbaCalendarContainer").attr( 'src', function ( i, val ) { return val; });
	loadFundInfo(selectedFund.fundid);
	populateFundPerformanceStats();
	populateMercer();
	populateUnderlyingFundTable();
	populateMultimedia();
	initFundAnnualChartData(selectedFund.fundId);
	//initValueSinceInceptionChartData(selectedFund.fundId);
}

function populateEndNotes(){
	if(fundContainsFactSheet || isCAISFund){
		var riders = '',
			disclaimer = (selectedFund.perfDisclaimer) ? "<br/><br/> <strong>Performance Disclaimer:</strong> " + selectedFund.perfDisclaimer : "";
		if(isCAISFund){
			riders='<ul class="footnotes"><li id="footnote1"><sup class="footnote-notation">1</sup> The information presented reflects data of the Fund for the period after its inception, as well as data of the Underlying Fund for the period preceding the Fund’s inception.</li><li id="footnote2"><sup class="footnote-notation">2</sup>Estimated return data is net of Sponsor Fees, but not Expenses.</li><li id="footnote3"><sup class="footnote-notation">3</sup> Fund return data is representative of an investment in Fund Share Class D, net of Sponsor Fees and Expenses (each as defined in the Conduit Fund Program Document) accruing to the Fund. The data does not reflect any additional fees paid by an investor to a placement agent associated with that investor’s purchase of the Fund, which will reduce returns. Return data may be based on unaudited information and materially differ from audited information.</li><li id="footnote4"><sup class="footnote-notation">4</sup> Underlying Fund return data reflects a specific series and class of the Underlying Fund which has been selected by the investment manager of such Underlying Fund as a representation of that fund’s performance. This data is not representative of the performance expected to be achieved by an investor in the Fund, as it does not reflect the fees and expenses of the Fund or reflect any additional fees paid by an investor to a placement agent associated with that investor’s purchase of the Fund, which will reduce returns. This data may also reflect investments in new issues, side pockets, and other elements that can result in returns that are higher than returns earned by investors, such as the Fund, that do not participate in those investment categories of the Underlying Fund. The return data presented with respect to Underlying Funds and any related notes are based on information provided to the Fund program administrator by the relevant investment manager and may be relevant to periods beyond the scope of information provided herein. Return data may also be based on unaudited information and materially differ from audited information.</li></ul><div>PLEASE SEE THE <a href="#" class="current-fund-fact-card-link cais-link">FUND FACT CARD RELEVANT TO THIS FUND</a> FOR IMPORTANT RISK INFORMATION AND OTHER DISCLOSURES. PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS. NEITHER CAIS, NOR ANY OF ITS AFFILIATES, HAS INDEPENDENTLY VERIFIED THE ACCURACY OF THE INFORMATION CONTAINED HEREIN AND CAIS PROVIDES NO REPRESENTATION OR WARRANTY, EXPRESS OR IMPLIED, IN CONNECTION THEREWITH.</div>';
		}else{
			riders="<div class='underlying-fund-information-only'>Please see Fact Sheet for further explanation and disclaimers for terms and figures presented above: <a class=\"current-fund-fact-card-link cais-link\" href=\"#\">"+factSheetName+"</a>"+disclaimer+"</div>";
		}
		$(".end-notes-scroller.factSheetInfo").replaceWith("<div class=\"end-notes-scroller factSheetInfo\">"+riders+"</div>");
		$(".end-notes-content").css('display', 'block');
	}else{
		$(".end-notes-scroller.factSheetInfo").text("");
		$(".end-notes-content").css('display', 'none');
	}
}

function toNextProduct() {
	var currentIndex;
	for(var i in selectedProductArray)
	{
		if(selectedFund.fundId == selectedProductArray[i].fundId)
		{
			currentIndex = i;
			break;
		}
	}
	currentIndex++;
	if(currentIndex > selectedProductArray.length - 1)
		currentIndex = 0;

	selectedFund = selectedProductArray[currentIndex];
	localStorage.fundMgrName = selectedFund.mgrName;
	$("#trumbaCalendarContainer").attr( 'src', function ( i, val ) { return val; });
	$("#mainTrumbaCalendarContainer").attr( 'src', function ( i, val ) { return val; });
	loadFundInfo(selectedFund.fundId);
	populateFundPerformanceStats();
	populateUnderlyingFundTable();

	populateMercer();
	populateMultimedia();
	initFundAnnualChartData(selectedFund.fundId);
}

function initializeTabs() {
	/* initialize tabs */
	$(".tabs", thisDialogBody).each(function(){

		/* initialize tab with interval (performance) */
		if($(this).attr("tab-interval") != undefined) {

		$("#" + $(this).attr("rel") + " > li").hide();

		$(this).children().click(function(){
		   if(!$(this).hasClass("active"))
		   {
			  $("#" + $(this).parent().attr("rel") + " > li:nth-child(" + ($("li.active", $(this).parent()).index() + 1) + ")").fadeOut();
			  $("#" + $(this).parent().attr("rel") + " > li:nth-child(" + ($(this).index() + 1) + ")").fadeIn();
			  $(this).parent().children().removeClass("active");
			  $(this).addClass("active");
		   }
		});

		var that = this;

		this.tabInterval = setInterval(function(){

		   if($("li.active", that).next().length)
			  $("li.active", that).next().click()
		   else
			  $("li:first", that).click()

		}, $(this).attr("tab-interval") * 1000);


		/* initialize normal tabs */
		}
		else
		{
			$(this).children().click(function(){
			   $(this).parent().children().removeClass("active");
			   $(this).addClass("active");
			   $("#" + $(this).parent().attr("rel") + " > li").hide();
			   $("#" + $(this).parent().attr("rel") + " > li:nth-child(" + ($(this).index() + 1) + ")").show();

			   $(window).trigger("resize");
			});
		}

		/* show active, if no active show first */
		var anyActive = false;
		$(this).children().each(function(){
			if($(this).hasClass("active"))
			{
			   anyActive = true;
			   $(this).click();
			}
		});
		if(!anyActive)
			$(this).children().first().click();
	});
}

function loadFundFunctions() {
	
	Server.caisUser.getLocalSessionInfo(function(response) {
	    var user = response;
	    var hasGenerateRecommendationPermission = false;
	    $.each(user.userPermissions, function(i, permission) {
	    	if (permission.permissionId === 2){
	    		hasGenerateRecommendationPermission = true;
	    	}
	    });
	
	    $(".fund-info-button", thisDialogHeader).remove();
	    /* initialize dialog remove / add button click */
		if(dialogAddRemove == true && hasGenerateRecommendationPermission) {
			var thisDialogRemove = $('<div class="fund-info-button" title="Remove from Recommendation"><div class="command-button-black"><div class="inner">REMOVE</div></div></div>');
			var thisDialogAdd = $('<div class="fund-info-button" title="Add to Recommendation"><div class="command-button"><div class="inner">QUICK INVEST</div></div></div>');
	
			var showRemove = false;
			for(var i in selectedProducts) {
				if(selectedFund.fundId == selectedProducts[i].fundId) {
					showRemove = true;
					break;
				}
			}
	
		    if(selectedFund.capacity == "Watch" || selectedFund.capacity == "Wait List" || selectedFund.capacity == "Pending" || selectedFund.capacity == "Request Documents")
		    	return;
	
			if(showRemove) {
				$(".relative-wrap", thisDialogHeader).append(thisDialogRemove);
				$(thisDialogRemove).click(dialogRemoveEvent);
			} else {
				$(".relative-wrap", thisDialogHeader).append(thisDialogAdd);
				$(thisDialogAdd).click(dialogAddEvent);
			}
		}
	
		if (quickInvest && hasGenerateRecommendationPermission) {
		    var quickInvestButton = $('<div data-fundId="' + selectedFund.fundId + '" class="fund-info-button" title="Quick Invest"><div class="command-button"><div class="inner">QUICK INVEST</div></div></div>');
	
		    var statusType = selectedFund.statusType;
		    if (statusType == "Open") {
		        $(".relative-wrap", thisDialogHeader).append(quickInvestButton);
		    }
		    quickInvestButton.click(function() {
		        localStorage["quickInvestFundId"] = $(this).attr("data-fundId");
		        document.location = "/cais-alternatives";
		    });
		    if(pageAction=="events"){
				/* Please add code to display the Events Tab on Load */
		    }
		}
	});
}

function dialogAddEvent() {
	$(document).trigger("addProductToCart", selectedFund);
	loadFundFunctions();
}

function dialogRemoveEvent() {
	$(document).trigger("removeProductFromCart", selectedFund);
	loadFundFunctions();
}

function populateFundInfo() {
	Server.interceptFundDetails( { fundId: selectedFund.fundId }, function(response){
		$("#areSlotsRequired").hide();
		$(".fund-title").html(selectedFund.legalName);
		$(".underlying-fund").html(selectedFund.shortName);
		$(".fund-manager").html(selectedFund.mgrName);
		$(".fund-strategy").html(selectedFund.strategy);

	    $("#fundSummary").html(selectedFund.fundDescription);
	    $("#firmBackground").html(selectedFund.managerDescription);

	    $("#fundName").text(selectedFund.shortName);
	    $("#fundManager").text(selectedFund.mgrName);
	    var fundInceptionDate = moment(selectedFund.fundInception, "YYYY-MM-DD");
	    $("#underlyingFundInception").text(fundInceptionDate.format("MMMM YYYY"));
	    

	    $("#underlyingFundDomicile").text(selectedFund.underlyingFundDomicile);
	    $("#fundStrategy").text(selectedFund.strategy);
	    $("#fundSubStrategy").text(selectedFund.subStrategy);
	    $("#firmAUM").text(selectedFund.firmAUM).formatCurrency({roundToDecimalPlace:0});

	    var strategyAUM = "";
	    var underlyingFundInception = "";

	    if (selectedFund.fundInception != null) {
	   	    var underlyingFundInceptionDate = moment(selectedFund.fundInception, "YYYY-MM-DD");
	   	    $("#underlyingFundInception").text(underlyingFundInceptionDate.format("MMMM YYYY"));
	    }else{
	    	$("#underlyingFundInception").text("");
	    }

	    $("#strategyAUM").text(strategyAUM);

	    if (selectedFund.strategyAUM != null) {
		    $("#strategyAUM").text(selectedFund.strategyAUM).formatCurrency({roundToDecimalPlace:0});
	    }
	    
	    isCAISFund = selectedFund.isCAISFund;
	    if(!selectedFund.isCAISFund) {
	    	$("#caisFundInception").parents("tr").hide();
	    	$("#caisFundDomicile").parents("tr").hide();
	    	$("#underlyingFundInception").parents("tr").hide();
	    	$("#underlyingFundDomicile").parents("tr").hide();
	    	$("#fundInformationTitle").text("Fund Information");
	    } else {
	    	$("#caisFundInception").parents("tr").show();
	    	$("#caisFundDomicile").parents("tr").show();
	    	$("#underlyingFundInception").parents("tr").show();
	    	$("#underlyingFundDomicile").parents("tr").show();
	    	$("#fundInformationTitle").text("Underlying Fund Information");
	    }
	    $("#caisFundName").text(selectedFund.legalName);

	    // TODO: Fix this on the java end so we aren't comparing to a string

	    
        if(selectedFund.caisFundInception) {
        	var caisFundInceptionDate = moment(selectedFund.caisFundInception, "YYYY-MM-DD");
        	$("#caisFundInception").text(caisFundInceptionDate.format("MMMM YYYY"));
        }else{
        	$("#caisFundInception").text("N/A");
        }

	    $("#caisFundExitFee").text(selectedFund.exitfee);
	    $("#caisFundInvestorLevel").text(selectedFund.investorLevel);
	    $("#caisFundTaxReporting").text(selectedFund.taxReporting);
	    $("#caisFundmanagementfee").text(selectedFund.managementfee);
	    $("#caisFundincentivefee").text(selectedFund.incentivefee);

	    var minimum = "";
	    $("#caisFundMinInvestment").text(minimum);

	    if(selectedFund.minimum != null) {
		    $("#caisFundMinInvestment").text(selectedFund.minimum).formatCurrency({roundToDecimalPlace:0});
	    }


	    if(selectedFund.auditHoldback != null) {
	    	$("#auditHoldback").text(selectedFund.auditHoldback+"%");
	    }

	    if(selectedFund.areSlotsRequired==1){
	    	$("#areSlotsRequired").show();
	    	$("#numberOfAvailableSlots").text(selectedFund.numberOfAvailableSlots);
	    }
	    $("#caisFundDomicile").text(selectedFund.underlyingFundDomicile);
	    $("#caisFundSubscriptions").text(selectedFund.subscription);
	    $("#caisFundRedemptions").text(selectedFund.redemption);
	    $("#caisFundNotice").text(selectedFund.notice);
	    $("#caisFundLockup").text(selectedFund.lockup);

	    /*
	     * Performance Values
	     * */
	    $("#mtd").text(selectedFund.mtd+"%");
	    $("#cumulativeYtd").text(selectedFund.cumulativeYearToDate+"%");
	    $("#cumulativeInception").text(selectedFund.cumulativeInception+"%");
	    $("#last12Months").text(selectedFund.oneYear+"%");
	    $("#last3Years").text(selectedFund.threeYearReturn+"%");
	    $("#last5Years").text(selectedFund.fiveYearReturn+"%");
	    $("#annVolatility").text(selectedFund.annualizedVolatility+"%");
	    $("#annDownsideDeviation").text(selectedFund.annDownSideDeviation+"%");
	    $("#annInception").text(selectedFund.annualizedInception + "%");
	    $(window).trigger("resize");
	});

	if(selectedFund.accessToDocuments=="true") {
	    Server.getDocumentsByFundId( { fundId:selectedFund.fundId, fundType:selectedFund.fundType }, function(response) {
  //Presentation Documents - 5 & 1
	        //Legal Documents - 4 & 7 & 10
            //Manager Letters - ??
 			var fundDocs="<div id=\"fundDocs\">";
			fundDocs = fundDocs+ "<div class=\"list-title\">Presentation Documents</div>";
			var counter = 0;
			fundContainsFactSheet = false;
			var hasOfferingDocuments = false;
			var hasPresentationDocs = false;
			    $("#presentationDocs").empty();
			    $("#legalDocs").empty();
			    $('.file-open-docs').remove();

			var withoutDateDocs = [];

			for (var i in response) {
			    doc = response[i];

			    if (doc.categoryId == 5 || doc.categoryId == 1) {
			    hasPresentationDocs = true;
			    	$("#presentationDocs").append("<li><a href=\"#\" onclick=\"getFundDocuments(" + doc.documentId + ")" + "\">" + doc.documentName + "</a></li>");
			    } else if (doc.categoryId == 4 || doc.categoryId == 7 || doc.categoryId == 10) {
			    	if (!selectedFund.isCAISFund && (doc.categoryId == 7 || doc.categoryId == 10))  continue;
			    	hasOfferingDocuments = true;
			        $("#legalDocs").append("<li><a href=\"#\" onclick=\"getFundDocuments(" + doc.documentId + ")" + "\">" + doc.documentName + "</a></li>");
			    }
			}


			if(!hasPresentationDocs)
				$("#presentationDocs").append("<li>Presentation Documents Coming Soon.</li>");
			if(!hasOfferingDocuments)
				$("#legalDocs").append("<li>Offering Documents Coming Soon.</li>");

                //0: Object
                //categoryId: 5
                //date: null
                //documentId: 1673
                //documentName: "CAIS AllBlue - Presentation"


			/*Query.each(fundDocuments, function(i, val) {
				if(val.categoryId==1)
				{
					factSheetId = val.documentId;
					factSheetName = val.documentName;
					lastFactSheetObtained = selectedFund.legalName;
					fundContainsFactSheet = true;
				}


				counter = counter + 1;
				if(selectedFund.isCAISFund){
					fundDocs = fundDocs+"<li><a href=\"#\" onclick=\"getFundDocuments("+val.documentId+")"+"\">"+val.documentName+"</a></li>";
				}else if(val.documentName.indexOf("Platform Document") < 0 && val.documentName.indexOf("PPM") < 0 && val.documentName.indexOf("Subscription Document") < 0){
					fundDocs = fundDocs+"<li><a href=\"#\" onclick=\"getFundDocuments("+val.documentId+")"+"\">"+val.documentName+"</a></li>";
				}
			});*/

			var mgrId = selectedFund.mgrId;
	    	if(mgrId == 7 || mgrId == 81) { // put logic here for paulson docs
	    		var fileOpenInstructions = $("<div class='file-open-docs'>Instructions on How to View Paulson & Co. Documents</div>");
	    		fileOpenInstructions.click(function() {
	    	        var fileOpenOptions = {};
	    	        Server.getFileOpenCredentials( null, function(response) {
	    	        	var fileOpenOptions = response;
		    			var dialog = new Dialog("file-open-instructions",fileOpenOptions);
	    	        });
	    		});

	    		$("#fundDocs").append(fileOpenInstructions);
	    	}
	    	$(window).trigger("resize");
	    	var pane = $(".dialog-body").data("jsp");
	    	if(pane) {
	    		pane.reinitialise();
	    	}
	    });
    } else {
		var fundDocs = $("<div id=\"fundDocs\"/>");
		var ulNoAccess = $("<ul/>");
		var noAccessToFundDocs= $("<div class=\"list-title\"/>");
		var message= $("<li>You do not have access to Documents, Please contact your CAIS Administrator for information about how to obtain access.</li>");
		message.appendTo(noAccessToFundDocs);
		noAccessToFundDocs.appendTo(ulNoAccess);
		ulNoAccess.appendTo(fundDocs);
		$("#fundDocs").replaceWith(fundDocs);
    }
}


function populateMultimedia(){
	// console.log('change');
	$('video,audio').attr('src', '');

	Server.getMultimediaDocuments({fundId:selectedFund.fundId}, function(response){
		var currentYear="";
		var mediaDocs="<div id=\"multimediaDocs\">";
		var needClose = false;
		var mediaDocsResp = response;
		if(mediaDocsResp!="NoAccess")
		{
			var withoutDateDocs = [];
			jQuery.each(mediaDocsResp, function(i, val){
				if(typeof val.date === "undefined"){
					withoutDateDocs.push(val);
				}
				else{

					var currentDate = mysqlDateToJsDate(val.date);
					if(currentYear=="" || currentYear!=currentDate.getFullYear()) {
						if(currentYear!="") {
							mediaDocs= mediaDocs+"</ul><hr />";
						}
						mediaDocs = mediaDocs+ "<div class=\"list-title\">"+currentDate.getFullYear()+"</div> <ul class=\"video-list\">";
						needClose=true;
					}

					var iconMarkup = '<i class="icon-video"></i> '
					if (val.contentType.indexOf('video') === -1) iconMarkup = '<i class="icon-headphones"></i> ';

					mediaDocs = mediaDocs+"<li><a href='#' onclick=\"play('"+ val.downloadUrl+"','"+val.contentType+"','"+val.documentName+"')\">" + iconMarkup + kendo.toString(currentDate, 'MMMM')+" : "+val.documentName +"</a></li>";
					currentYear = currentDate.getFullYear();
				}
			});

			if(needClose){
				mediaDocs = mediaDocs+"</ul><hr />";
			}
			if(withoutDateDocs.length>0){
				mediaDocs = mediaDocs+ "<div><ul class=\"video-list\">";
				jQuery.each(withoutDateDocs, function(i, val){
					var iconMarkup = '<i class="icon-video"></i> '
					if (val.contentType.indexOf('video') === -1) iconMarkup = '<i class="icon-headphones"></i> ';
					mediaDocs=mediaDocs+"<li><a href=\"#\" onclick=\"play('"+ val.downloadUrl+"','"+val.contentType+"','"+val.documentName+"')\">" + iconMarkup+val.documentName+"</a></li>";
				});
				mediaDocs = mediaDocs + "</ul></div>";
			}
		}
		mediaDocs=mediaDocs+"</div>";
		$("#multimediaDocs").replaceWith(mediaDocs);
	});
}


function populateMercer() {
	/*
     * Mercer
     * */
    var accessToMercer = selectedFund.accessToMercer;
    if(accessToMercer == "true")
    {
	    Server.getMercerDocuments( {fundId:selectedFund.fundId}, function(response) {
    		var currentYear="";
    	  	var mercerDocs="<div id=\"mercerDocs\">";
    	  	var mercerDocsResp = response.mercerDocsList;
    	  	var mercerInfo = response.mercerInfo;

			jQuery.each(mercerDocsResp, function(i, val){
				var currentDate = mysqlDateToJsDate(val.date);
				if(currentYear=="" || currentYear!=currentDate.getFullYear()) {
					if(currentYear!="") {
						mercerDocs= mercerDocs+"</ul><hr />";
					}
					mercerDocs = mercerDocs+ "<div class=\"list-title\">"+currentDate.getFullYear()+"</div>" +
					" <ul class=\"pdf-list\">";
					mercerDocs = mercerDocs+"<li><a href=\"#\" onclick=\"getFundDocuments("+val.documentId+")"+"\">"+ kendo.toString(currentDate, 'MMMM') +"</a></li>";
				} else {
					mercerDocs = mercerDocs+"<li><a href=\""+"#\" onclick=\"getFundDocuments("+val.documentId+")"+"\">"+ kendo.toString(currentDate, 'MMMM') +"</a></li>";
				}
				currentYear = currentDate.getFullYear();
			});

		   	mercerDocs = mercerDocs+"</ul></div>";
		   	$("#ideaGen").html(mercerInfo.ideaGen);
		    $("#portfolioConstant").html(mercerInfo.portfolioConstant);
		    $("#implementation").html(mercerInfo.implementation);
		    $("#businessManagement").html(mercerInfo.businessManagement);
		    $("#rating").html(mercerInfo.rating);
		    $("#overallRating").html(mercerInfo.overallRating);
		    $("#additionalObs").html(mercerInfo.additionalObs);
		    $("#issuesToWatch").html("<p id=\"issuesToWatch\">"+mercerInfo.issuesToWatch+"</p");
		    $("#opsSummary").html("<p id=\"opsSummary\">"+mercerInfo.opsSummary+"</p>");
		    $("#investorAware").html("<p id=\"investorAware\">"+mercerInfo.investorAware+"</p>");
		   	$("#mercerInvestDueDiligence").show();
	 		$("#mercerOperationDueDiligence").show();
	 		$("#mercerInvestNoAccess").hide();
	 		$("#mercerOperationNoAccess").hide();
	 		$("#mercerDocs").replaceWith(mercerDocs);
	    });

    } else {
		$("#mercerInvestDueDiligence").hide();
		$("#mercerOperationDueDiligence").hide();
		var mercerDocsNoAccess = "<div id=\"mercerDocs\"></br><ul><div class=\"list-title\">You do not have access to Mercer Due Diligence, Please contact your CAIS Administrator for information about how to obtain access.</div></ul></div>";
		$("#mercerDocs").replaceWith(mercerDocsNoAccess);
		var mercerDocsInvestNoAccess = "<div id=\"mercerInvestNoAccess\"></br><ul><div class=\"list-title\">You do not have access to Mercer Due Diligence, Please contact your CAIS Administrator for information about how to obtain access.</div></ul></div>";
		$("#mercerInvestNoAccess").replaceWith(mercerDocsInvestNoAccess);
		var mercerDocsOperationNoAccess = "<div id=\"mercerOperationNoAccess\"></br><ul><div class=\"list-title\">You do not have access to Mercer Due Diligence, Please contact your CAIS Administrator for information about how to obtain access.</div></ul></div>";
		$("#mercerOperationNoAccess").replaceWith(mercerDocsOperationNoAccess);
    }
}

getFundDocuments = function(documentId) {
	var paramString= "docId="+documentId;
	window.open('/api/document/download?docId=' + documentId);
};

play = function (url, contentType, desc){
	// if (event) event.preventDefault();

    $('video, audio').each(function() {
    	this.pause();
    	this.src=""; // this will stop downloading
    });

	if (contentType.match("^audio")) {
		$("#video-player").fadeOut('fast', function() {
			$("#audio-player").fadeIn();
		});

		$("#audio-player")[0].src=url;
		$("#audio-player")[0].play();
	}
	else{
		$("#audio-player").fadeOut('fast', function() {
			$("#video-player").fadeIn();
		});
		$("#video-player")[0].src=url;
		$("#video-player")[0].play();
	}

//	$('video,audio').mediaelementplayer({
//		alwaysShowControls: true,
//	});

	$("#media-description").html(desc);
}

function populateFundPerformanceStats() {

    if (selectedFund.productTypeId == 3) {
        return;
    }

	if(selectedFund.accessToDocuments=="true") {
		if(lastFactSheetObtained == selectedFund.legalName)
		{
			fundContainsFactSheet=true;
			populateEndNotes();
		}else
		{
			 Server.getDocumentsByFundId( { fundId:selectedFund.fundId, fundType:selectedFund.fundType }, function(response) {
				 var fundDocuments = response;
				 fundContainsFactSheet = false;
					jQuery.each(fundDocuments, function(i, val){
						if(val.categoryId==1)
						{
								factSheetId = val.documentId;
								factSheetName = val.documentName;
								lastFactSheetObtained = selectedFund.legalName;
								fundContainsFactSheet = true;
								populateEndNotes();
						}

					});
					if(!fundContainsFactSheet)
						populateEndNotes();
			 });

		}
	}
	//dynamically populate the values for performance.html
	// populating return list
	if(selectedFund.isCAISFund){
		var fundNameNoDot = selectedFund.legalName;
		fundNameNoDot = fundNameNoDot.replace(/\.$/, "");
		$(".fund-legal-name").text(fundNameNoDot);
		$("#fund-info-dialog").addClass("cais-fund-data");

    }else{
    	$("#fund-info-dialog").removeClass("cais-fund-data");
	}

    $("#pMonthToDate").replaceWith("<div  id='pMonthToDate' style='font-style:italic;'>"+selectedFund.mtd+"%</div>");

    if (typeof selectedFund.cumulativeYearToDate == 'undefined' || selectedFund.cumulativeYearToDate == -9999){
    	$("#pCumYearToDate").replaceWith("<div id='pCumYearToDate'>N/A</div>");
    }
    else{
    	$("#pCumYearToDate").replaceWith("<div id='pCumYearToDate'  style='font-style:italic;'>"+selectedFund.cumulativeYearToDate+"%</div>");
    }

    $("#pCumInception").replaceWith("<div id='pCumInception'>"+selectedFund.cumulativeInception+"%</div>");
    $("#pPosMonth").replaceWith("<div id='pPosMonth'>"+selectedFund.percentagePosMonths+"%</div>");
    $("#pMaxDrawDown").replaceWith("<div id='pMaxDrawDown'>"+selectedFund.maximumDrawdown+"%</div>");

    //populating annualized return list
    if(selectedFund.threeYearReturn!=-9999){
    	$("#pThreeYearReturn").replaceWith("<div  id='pThreeYearReturn'>"+selectedFund.threeYearReturn+"%</div>");
	}else{
    	$("#pThreeYearReturn").replaceWith("<div  id='pThreeYearReturn'>N/A</div>");
    }
    if(selectedFund.fiveYearReturn!=-9999){
    	$("#pFiveYearReturn").replaceWith("<div id='pFiveYearReturn'>"+selectedFund.fiveYearReturn+"%</div>");
    }else{
    	$("#pFiveYearReturn").replaceWith("<div id='pFiveYearReturn'>N/A</div>");
    }
    if(selectedFund.tenYears!=-9999){
    	$("#pTenYears").replaceWith("<div id='pTenYears'>"+selectedFund.tenYears+"%</div>");
    }else{
    	$("#pTenYears").replaceWith("<div id='pTenYears'>N/A</div>");
    }



    $("#pAnnualizedInception").replaceWith("<div id='pAnnualizedInception'>"+selectedFund.annualizedInception+"%</div>");

    //populating risk list
    $("#pAnnualizedVolatility").replaceWith("<div  id='pAnnualizedVolatility'>"+selectedFund.annualizedVolatility+"%</div>");
    $("#pAnnDownSideDeviation").replaceWith("<div id='pAnnDownSideDeviation'>"+selectedFund.annDownSideDeviation+"%</div>");
    $("#pSharpeRatio").replaceWith("<div id='pSharpeRatio'>"+selectedFund.sharpeRatio+"</div>");
    $("#pSortinoRatio").replaceWith("<div id='pSortinoRatio'>"+selectedFund.sortinoRatio+"</div>");
    $("#pBestMonth").replaceWith("<div id='pBestMonth'>"+selectedFund.bestMonth+"%</div>");
    $("#pWorstMonth").replaceWith("<div id='pWorstMonth'>"+selectedFund.worstMonth+"%</div>");


    //populating Correlation list
    $("#pBarCapAgg").replaceWith("<div id='pBarCapAgg'>"+selectedFund.barCapAgg+"</div>");
    $("#pSandp500").replaceWith("<div id='pSandp500'>"+selectedFund.sandp500+"</div>");
    $("#pMsciWorldTRLC").replaceWith("<div id='pMsciWorldTRLC'>"+selectedFund.msciWorldTRLC+"</div>");
    $("#pHfrihfCompIndex").replaceWith("<div id='pHfrihfCompIndex'>"+selectedFund.hfrihfCompIndex+"</div>");
    $("#pHfrifofCompIndex").replaceWith("<div id='pHfrifofCompIndex'>"+selectedFund.hfrifofCompIndex+"</div>");

    //$(".end-notes-scroller").jScrollPane();

    if(!selectedFund.isCAISFund){
    	$(".legal-language-performance-analysis").hide();
    }
    else{
    	$(".legal-language-performance-analysis").show();
    }
    var toCheck = [
    	"pMonthToDate",
    	"pCumYearToDate",
    	"pCumInception",
    	"pPosMonth",
    	"pMaxDrawDown",
    	"pThreeYearReturn",
    	"pFiveYearReturn",
    	"pTenYears",
    	"pAnnualizedInception",
    	"pAnnualizedVolatility",
    	"pAnnDownSideDeviation",
    	"pSharpeRatio",
    	"pSortinoRatio",
    	"pBestMonth",
    	"pWorstMonth",
    	"pBarCapAgg",
    	"pSandp500",
    	"pMsciWorldTRLC",
    	"pHfrihfCompIndex",
    	"pHfrifofCompIndex"
    ];
	for(var i=0; i<toCheck.length; i++){
		$("#"+toCheck[i]+":contains('-')").addClass('red');
	}
}

function populateUnderlyingFundTable() {
	Server.getUnderlyingFundDataById({ fundId: selectedFund.fundId }, function(response) {
		 var grid = $("#underlying-fund-table").data("kendoGrid");
		 if(grid) {
			 grid.dataSource.data(response);
		 }
		 var pane = $(".dialog-body").data("jsp");
		 pane.reinitialise();
	 });
}

function underlyingFundTemplate(data) {
    var date = moment(),
    	columns = ["year", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "annual"],
    	wrapper = $("<div/>"),
    	tr = $("<tr/>"),
    	feederFundDate = moment(selectedFund.caisFundInception, "YYYY-MM-DD");
   	if(selectedFund.caisFundInception) feederFundDate.date(1);
    for (var i = 0; i < columns.length; i++){
    	var td;
    	if(columns[i]=="year"){
    		var cell = $("<td class='year-align right-separator' />"),
    			dataString = data.year.toString();
    		cell.append(dataString);
    		td = cell;
    	}else{
    		var value = data[columns[i]];
    		td = underlyingFundFormatter(value);	
    	    if (i == 13){
    	    	if(tr.find(".estimate").length>0 || parseInt(data.year) === parseInt(date.format("YYYY"))){
    	    		td.addClass("estimate");	
    	    	}
    	    	td.addClass("annual").addClass("left-separator");
    	    	if(!td.hasClass("estimate") && (selectedFund.isCAISFund && selectedFund.caisFundInception)){
    	    		var currentYearDate = moment(data.year+"-1-1", "YYYY-MM-DD");
	    	    	if(currentYearDate.isAfter(feederFundDate) || (currentYearDate.isSame(feederFundDate)&& parseInt(feederFundDate.format("M")) === 1)){
	    	    		td.addClass("feeder-highlighted");
	    	    	}
    	    	}
    	    }else{
    	    	if(!td.hasClass("estimate") && (selectedFund.isCAISFund && selectedFund.caisFundInception)){
	    	    	var currentDate = moment(data.year+"-"+i+"-1", "YYYY-MM-DD");
	    	    	if((currentDate.isAfter(feederFundDate) || currentDate.isSame(feederFundDate)) && value){
	    	    		td.addClass("feeder-highlighted");
	    	    	}
	    	    }
    	    }
    	}
        td.appendTo(tr);
    }
    tr.appendTo(wrapper);
    return wrapper.html();
}
function underlyingFundFormatter(data) {
	var dataString;
	if(data!=undefined)
		dataString = data.toString();
	else
		dataString = '';
    var cell = $("<td class='money-align' />");

    if (dataString.indexOf("E") != -1)
    {
        cell.addClass("estimate");
        dataString = dataString.replace("E","");
    }

    if (dataString.indexOf("-") != -1)
    {
        cell.addClass("negative");
    }

    var periodIndex = dataString.indexOf(".");

    if(periodIndex != -1){
    	var floatString = parseFloat(dataString).toFixed(2);
    	dataString = floatString.toString();
    	cell.append(dataString.slice(0, periodIndex + 3));
    }else{
    	if(!isNaN(parseFloat(dataString)))
    	{
    		var floatString = parseFloat(dataString).toFixed(2);
    		dataString = floatString.toString();
    		cell.append(dataString);
    	}else{
    		cell.append(dataString);
    	}
    }

    return cell;
}

function populateCharts() {
	$("#fund-info-dialog .chart[data-chartType=line]").each(renderLineChart);
	$("#fund-info-dialog .chart[data-chartType=column]").each(renderColumnChart);
	var pane = $(".dialog-body").data("jsp");
	if (pane) {
	    pane.reinitialise();
	}
}

function renderColumnChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	$(chartWrapper).kendoChart({
		theme: "blueOpal",
    seriesDefaults: {
        type: "column",
        labels: {
        	visible: false,
        	format: "{0}%"
        }
    },
	series: fundPerformanceGraphData[chartData],
    categoryAxis: {
    	categories: fundPerformanceGraphData.annualPerformanceCategories,
    	color: "#46637E",
    	majorGridLines: {
    		color:"#e6ebf2"
    	}
    },
    valueAxis: {
    	labels: {
        	format: "{0}%"
    	},
    	color: "#46637E",
    	majorGridLines: {
    		color:"#e6ebf2"
    	}
    },
    tooltip: {
        visible: true,
        format: "{0:n2}%"
    },
    chartArea: {
    	margin: 20
    },
    legend: {
    	visible: true,
    	position: "top"
    }
	});
	$(window).trigger("resize"); //need to resize for the side column height after graphs have drawn
}

function renderLineChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	$(chartWrapper).kendoChart({
		theme: "blueOpal",
    seriesDefaults: {
        type: "line",
        line: {
        	markers: {
        		visible: false
        	}
        }
    },
	series: fundPerformanceGraphData[chartData],
	categoryAxis: {
		majorGridLines: {
    		color:"#e6ebf2"
    	}
	},
    valueAxis: {
    	labels: {
    		format: "{0:C0}k"
    	},
    	color: "#46637E",
    	majorGridLines: {
    		color:"#e6ebf2"
    	}
    },
    tooltip: {
        visible: true,
        format: "{0:C0}k"
    },
    chartArea: {
    	margin: 20
    },
    legend: {
    	visible: true,
    	position: "top"
    }
	});
	$(window).trigger("resize"); //need to resize for the side column height after graphs have drawn
}

function resizeCharts() {
	$("#fund-info-dialog .chart").each(function(){
		if($(this).data("kendoChart"))
			$(this).data("kendoChart").redraw();
	});
}

function initFundAnnualChartData(fundId) {
	Server.getFundAnnualsChart( {fundId: fundId}, function(response) {
		fundPerformanceGraphData.annualPerformance = response[0].annualPerformance;
		fundPerformanceGraphData.valueSinceInception = response[0].valueSinceInception;
		var inceptionYear;
		var benchmarkPlotSize;
		if(fundPerformanceGraphData.annualPerformance.length > 0)
		{
			var d = new Date();
			inceptionYear = (d.getFullYear() - fundPerformanceGraphData.annualPerformance[0].data.length) +1;
			var actualFundDataLength = fundPerformanceGraphData.annualPerformance[0].data.length;
			var benchmarkFundDataLength = fundPerformanceGraphData.annualPerformance[1].data.length;
			benchmarkPlotSize = actualFundDataLength - benchmarkFundDataLength;
		}

		if(benchmarkPlotSize>0){
			for (j = 0; j < benchmarkPlotSize; j++)
			{
				fundPerformanceGraphData.annualPerformance[1].data.unshift(null);
			}
		}

		fundPerformanceGraphData.annualPerformanceCategories = [ ];
		fundPerformanceGraphData.annualPerformanceCategories.push(inceptionYear);

		$.each(fundPerformanceGraphData.annualPerformance, function(i, val) {
			$.each(val.data, function(i, data) {
				val.data[i] = (data * 100);
			});
		});

		for (i = 1; i < fundPerformanceGraphData.annualPerformance[0].data.length; i++)
		{
			fundPerformanceGraphData.annualPerformanceCategories.push(inceptionYear + i);
		}

		if(fundPerformanceGraphData.valueSinceInception != null)
			populateCharts();
	});
}
}).call();
