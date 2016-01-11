(function(){
var selectedClient;
var selectedClientArray;
var holdings;
var holdingsList;
var entitiesList;
var allowClientNavigation;
var liquidityData;
var selectedEntity;
var action = "load";
var isInvestmentEntity = false;
var isDocumentSectionReady;

var holdingsColumns = 
[
	"transactionId", "trade", "fund", "purchaseDate", "value", "purchasePrice", "change", "navDate", "className", "mtdReturns", "ytdReturns", "itdReturns"
]

var entityColumns = 
[
	{ title: "<label class='nolabel_check column_check' onclick=''></label>", template: "<label class='nolabel_check' onclick=''></label>", width: 35, sortable: false },
	{ title: "Investment Entity Name", field: "displayName" }
]

var holdingsHeaders = {
	"transactionId" : "Transaction Id",
	"trade" : "Trade",
	"fund" : "Fund",
	"purchaseDate" : "Purchase Date",
	"value" : "Value",
	"purchasePrice" : "Purchase Price",
	"change" : "Change (USD)",
	"navDate" : "As of Nav Date",
	"className" : "Share Class",
	"mtdReturns" : "MTD Return",
	"ytdReturns" : "YTD Return",
	"itdReturns" : "ITD Return"	
}

//hardcoded data, will change once server returns data
var chartDataEntitiesList;
var entityGraphData = {};

$(document).bind("dialogs/client-detailLoaded", function (event, options) {
	selectedClient = options.selectedClient;
	
	var investorName = selectedClient.investorName;
	var firmName = selectedClient.firmName;
	var advisorName = selectedClient.advisorName;

	investorName = (typeof investorName != 'undefined' && investorName.length > 32) ? investorName.substring(0, 32) + "..." : investorName;
	firmName = (typeof firmName != 'undefined' && firmName.length > 32) ? firmName.substring(0, 32) + "..." : firmName;
	advisorName = (typeof advisorName != 'undefined' && advisorName.length > 32) ? advisorName.substring(0, 32) + "..." : advisorName;
	
	$("#clientName").text(investorName);	
	$("#firmName").text(firmName);
	$("#advisorTeam").text(advisorName);
	if(options.isInvestmentEntity == undefined) {
		isInvestmentEntity = false;
	} else {
		isInvestmentEntity = true;
	}
	
	/***selectedClient is passes as an array from investment pipeline and as an Object from cais-alternatives. 
	 	Since client-details.js is a common file used across both tabs, we determine the value of the selectedClient here.	***/

	if (selectedClient instanceof Array) {
		selectedClient = options.selectedClient[0];
	}
	
	/*******     End    ********/
	
	selectedClientArray = options.viewArray;
	allowClientNavigation = options.allowNavigation;	


	clientDetails_onReady();
	// move doAfterLiquidityLoad into getDataWithEntities(), so Liquidity can be refreshed after modifying the investment entity
	//* doAfterLiquidityLoad();  
	
	initBindings();
	initInvestorDetailsBinding();
	initializeChartExpand();
	
	isDocumentSectionReady = false;
	
    // check to see if this person can add investors
	Server.caisUser.getLocalSessionInfo(function(response) {
		if (!response.contextMenuPermissions.addInvestors)
			$(".command-button.add-new").remove();
	});
});

$(window).resize(function() {
    resizeHoldingsGrid();
    resizeLiquidityGrid();

    resizeGrid("#documents .grid-wrapper");
    resizeGrid("#entities .grid-wrapper");
    
    if($("#performance").hasClass("active"))
    	resizeCharts();
});

function clientDetails_onReady() {
	if(!isInvestmentEntity) {
    	getInvestorData();
     }else {
    	getInvestmentEntityData();
    }
    initClientTabs();
	initClientNavigators();
	initRedeemButtons();
	initSameAddressCheckbox();
	initIsAustralianCheckbox();

    var entityMenu = new MenuList($("#entity-selector"), selectEntityChart, 240);

	$("#entity-fund-selector").each(function() {
	    var fundMenu = new MenuList($(this), null, 270);
	    $(this).find("ul").off("click", "li");
	    $(this).find("ul").on("click", "li", function(evt) {
	        $(this).find(".label_check").toggleClass("check-on");
	        evt.stopPropagation();
	        if ($(this).find(".label_check").hasClass("all")) {
	            if ($(this).find(".label_check").hasClass("check-on"))
	                $("#performance .white-dropdown-menu .label_check").addClass("check-on");
	            else
	                $("#performance .white-dropdown-menu .label_check").removeClass("check-on");
	        }
	        updateSelectedEntityFunds();
	    });
	});

	$(".add-new").click(function() {
	    $(".existing-entity").removeClass("active");
	    $(".new-entity").addClass("active");
	    $(".new-entity .save").show();
	    copyInvestorAddressInformation();	    
	});

	$(".new-entity .cancel").click(function() {
	    $(".new-entity input").val("");

	    $(".existing-entity").addClass("active");
	    $(".new-entity").removeClass("active");
	});

	$(".new-entity .save").click(function() {
		$(this).hide();
		$("#new-entity .entity-navigation .section-alert").remove(); // remove all alerts and then re-validate
		if(ValidatorFactory.validate($(".new-entity"))) {
			var entityDetailsList = new Array();
			var newEntityData = {};
			var permAddressData = {};
			var mailingAddressData = {};
			var standingInstructionsData = {};
			var custodianAddressData = {};
		
		    $("input[type=text][data-binding]").each(function() {
		    	if ($(this).is('.new-entity .permAddress')) {
		    		var propertyName = $(this).attr("data-binding");
					permAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.new-entity .custodianAddress')) {
			    	 var propertyName = $(this).attr("data-field");
			    	 custodianAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.new-entity .mailingAddress')) {
			    	 var propertyName = $(this).attr("data-binding");
			    	 mailingAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.new-entity .standingInstructions')) {
			    	 var propertyName = $(this).attr("data-binding");
			    	 standingInstructionsData[propertyName] = $(this).val();
			    } else {
			    	if ($(this).is('.new-entity .userInfo')) {
			    		var propertyName = $(this).attr("data-binding");
			    		newEntityData[propertyName] = $(this).val();
			    	}
			    }
		    });
	
		    $("input[type=radio][data-binding]").each(function() {
		    	if ($(this).is('.new-entity .userInfo')){
		    		var propertyName = $(this).attr("data-binding");
		    		if (this.checked)
		    			newEntityData[propertyName] = $(this).val();
		    	}
		    });
	
		    $("select[data-binding]").each(function() {
		    	if ($(this).is('.new-entity .userInfo')){	
		    		var propertyName = $(this).attr("data-binding");
		    		newEntityData[propertyName] = $(this).val();
		    	}
		    });
	
		    $(".new-entity .white-dropdown-menu[data-binding]").each(function() {
		    	var propertyName = $(this).attr("data-binding");
		    	if(propertyName=="custodianName") {
		    	   	newEntityData[propertyName] = $(this).find(".selected div").text();
		        	if($(this).find(".selected div").text() == "Other") {
		        		var otherCustodianName = $("input[type=text][data-other=custodianName]").val();
		        		newEntityData[propertyName] = otherCustodianName;
		        		Server.insertNewCustodian( otherCustodianName, function(response) {
		        	    });
		        	}
		        } else {
		        	newEntityData[propertyName] = $(this).find(".selected div").data().id;
		        }
		    });
		    
		    //newEntityData.foregoingBox = $(".nolabel_check.foregoing.new").hasClass("check-on") ? true : false;
		    newEntityData.residenceAddress = permAddressData;
		    newEntityData.mailingAddress = mailingAddressData;
		    newEntityData.custodianAddress = custodianAddressData;
		    newEntityData.standingInstructionsData = standingInstructionsData;
		    newEntityData.investorId = selectedClient.investorId;
		    newEntityData.foregoingBox = false;
		    newEntityData.advisorTeamId = selectedClient.advisorTeamId;
		    newEntityData.clientId = selectedClient.clientId;
		    var entityDataString = JSON.stringify(newEntityData);
			   
		    Server.insertInvestmentEntityList( entityDataString, function(response) {
				action ="save";
				if(!isInvestmentEntity) {
					getInvestorData();
			    } else {
			    	getInvestmentEntityData();
			    }
				
				$(".new-entity .entity-saved div").text("New Entity added successfully.");
				$(".new-entity .entity-saved").show();
				$(".new-entity .scrollable-content").css("top", 88);
				$(".new-entity .entity-saved").fadeOut(4000, function(){
				$(".new-entity .scrollable-content").css("top", 41);
				$(".new-entity").removeClass("active");
				$(".existing-entity").addClass("active");
				$(".new-entity input").val("");
				});
	    	},
	    	function(response) {
	    		ValidatorFactory.processServerValidationError(response, "#new-entity");
	    		$(".new-entity .save").show();
	    	});		
		} else {
			 $(".new-entity .details-warning div").text("Please fill in all required fields.");
	    	 $(".new-entity .details-warning").show();
	    	 $(".new-entity .scrollable-content").css("top", 88);
	    	 $(".new-entity .save").show();
	    	 
	    	 // Add an alert icon to each section navigation that contains a missing required field
	    	 $("#new-entity .field-alert").each(function() {
	    		 var section = $(this).parents(".subscription-section").attr("data-section");
	    		 if($("#new-entity .entity-navigation").find("li[data-section=" + section + "] .section-alert").length == 0) {
	    			 $("#new-entity .entity-navigation").find("li[data-section=" + section + "]").append("<span class='section-alert'></span>");
	    		 }
	    	 });
		}			
	});
	
	$("#investor-save").click(function() {
		var address = {};
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var addressData = {};
		var saveButton = $("#investor-save");
		notifySaveStarted(saveButton);
		var investorName = $("input[type=text][data-binding=name]").val();
		addressData.investorId = selectedClient.investorId;
		addressData.name = investorName;
		$("input[type=text][data-binding]").each(function() {
			if ($(this).is('.investorDetails')) {
				address[$(this).attr("data-field")] = $(this).val();
			}
		});
		
		addressData.address = address;
		if (!emailRegex.test(addressData.address.email)) {
			new Alert('Please provide a valid email address.','OK');
			notifySaveComplete(saveButton);
			return;
		}
		if (!investorName.length) {
			new Alert('Please provide a client name.','OK');
			notifySaveComplete(saveButton);
			return;
		}

		Server.updateInvestorDetails(addressData, function(response) {
			notifySaveComplete(saveButton);
		});
	});

	initializeSaveButton();
	initEntityNavigation();
}

function initEntityNavigation() {
	$("#existing-entity .entity-navigation li").click(function() {
		$("#existing-entity .entity-navigation li.active").removeClass("active");
		$(this).addClass("active");
		var section = $(this).attr("data-section");
		$("#existing-entity .subscription-section.active").removeClass("active");
		$("#existing-entity .subscription-section[data-section=" + section + "]").addClass("active");
	});
	
	$("#new-entity .entity-navigation li").click(function() {
		$("#new-entity .entity-navigation li.active").removeClass("active");
		$(this).addClass("active");
		var section = $(this).attr("data-section");
		$("#new-entity .subscription-section.active").removeClass("active");
		$("#new-entity .subscription-section[data-section=" + section + "]").addClass("active");
	});
}

function initializeSaveButton() {
	$("#saveEntity").click(function() {
		$("#existing-entity .entity-navigation .section-alert").remove(); // remove all alerts and then re-validate
		if(ValidatorFactory.validate($(".existing-entity"))) {
			$(".details-warning").hide();
			var entityDetailsList = new Array();
			var existingEntityData = {};
			var permAddressData = {};
			var mailingAddressData = {};
			var standingInstructionsData = {};
			var custodianAddressData = {};
		
		    $("input[type=text][data-binding]").each(function () {
		    	if ($(this).is('.existing-entity .permAddress')) {
			    	 var propertyName = $(this).attr("data-binding");
					  permAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.existing-entity .custodianAddress')) {
			    	 var propertyName = $(this).attr("data-field");
			    	 custodianAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.existing-entity .mailingAddress')) {
			    	 var propertyName = $(this).attr("data-binding");
			    	 mailingAddressData[propertyName] = $(this).val();
			    } else if ($(this).is('.existing-entity .standingInstructions')) {
			    	 var propertyName = $(this).attr("data-binding");
			    	 standingInstructionsData[propertyName] = $(this).val();
			    } else if ($(this).is('.existing-entity .userInfo')) {
			    	 var propertyName = $(this).attr("data-binding");
			    	 existingEntityData[propertyName] = $(this).val();
			    }		    	
		    });
	
		    $("input[type=radio][data-binding]").each(function() {
		    	var propertyNameB = $(this).attr("data-binding")
		    	if ($(this).is('.existing-entity .userInfo')){
		    		var propertyName = $(this).attr("data-binding");
		    	    if (this.checked)
		    	    	existingEntityData[propertyName] = $(this).val();
		    	}
		    });
	
		    $("select[data-binding]").each(function() {
		    	if ($(this).is('.existing-entity .userInfo')) {
			        var propertyName = $(this).attr("data-binding");
			        existingEntityData[propertyName] = $(this).val();
		    	}
		    });
	
		    $(".existing-entity .white-dropdown-menu[data-binding]").each(function() {
		        var propertyName = $(this).attr("data-binding");
		        if(propertyName == "custodianName") {
		        	existingEntityData[propertyName] = $(this).find(".selected div").text();
		        	if($(this).find(".selected div").text() == "Other") {
		        		var otherCustodianName = $("input[type=text][data-other=custodianName]").val();
		        		existingEntityData[propertyName] = otherCustodianName;
		        		Server.insertNewCustodian( otherCustodianName, function(response) {
		        	    });
		        	}
		        } else {
		        	existingEntityData[propertyName] = $(this).find(".selected div").data().id;
		        }
		    });
		    
		   // existingEntityData.foregoingBox = $(".nolabel_check.foregoing.existing").hasClass("check-on") ? true : false;
		    existingEntityData.residenceAddress = permAddressData;
		    existingEntityData.mailingAddress = mailingAddressData;
		    existingEntityData.custodianAddress = custodianAddressData;
		    existingEntityData.standingInstructionsData = standingInstructionsData;
		    existingEntityData.foregoingBox = false;
		    existingEntityData.advisorTeamId = selectedClient.advisorTeamId;
		    existingEntityData.clientId = selectedClient.clientId;
		    
		    var entityDataString = JSON.stringify(existingEntityData);
			
		    Server.updateInvestmentEntityList( entityDataString, function(response) {
	    		action="save";
		    	if(!isInvestmentEntity){
	    	    	getInvestorData();
	    	    } else {
	    	    	getInvestmentEntityData();
	    	    }
				$(".existing-entity .entity-saved div").text("Entity saved successfully.");
				$(".existing-entity .entity-saved").show();
				$(".existing-entity .scrollable-content").css("top", 88);
				$(".existing-entity .entity-saved").fadeOut(4000, function() {
					$(".existing-entity .scrollable-content").css("top", 41);	    		 
				});
	    	},
	    	function(response) {
	    		ValidatorFactory.processServerValidationError(response, "#existing-entity");
	    	});		    
		} else {
			 $(".new-entity .details-warning div").text("Please fill in all required fields.");
	    	 $(".new-entity .details-warning").show();
	    	 $(".new-entity .scrollable-content").css("top", 88);
	    	 
	    	 // Add an alert icon to each section navigation that contains a missing required field
	    	 $("#existing-entity .field-alert").each(function() {
	    		 var section = $(this).parents(".subscription-section").attr("data-section");
	    		 if($("#existing-entity .entity-navigation").find("li[data-section=" + section + "] .section-alert").length == 0) {
	    			 $("#existing-entity .entity-navigation").find("li[data-section=" + section + "]").append("<span class='section-alert'></span>");
	    		 }
	    	 });
		}
	});
}

function showOtherInvestorInput_existing(evt) {
	if($(evt).text() == "Other") {
		$("#existing-entity #otherInvestorType").show();
		$("#existing-entity #otherInvestorType").attr("required", "required");
		$("#existing-entity input[data-other=investorTypeText]").removeAttr("disabled");
	} else {
	    $("#existing-entity #otherInvestorType").hide();
	    $("#existing-entity #otherInvestorType input").val("");
		$("#existing-entity #otherInvestorType").removeAttr("required");
		$("#existing-entity input[data-other=investorTypeText]").attr("disabled", "disabled");
	}
	
	if($(evt).text() == "Individual") {
		$("#existing-entity #individualInvestorDetails_existing").show();
		$("#existing-entity #nonIndividualInvestorDetails_existing").hide();
	} else {
	    $("#existing-entity #individualInvestorDetails_existing").hide();
		$("#existing-entity #nonIndividualInvestorDetails_existing").show();
	}
}

function showOtherInvestorInput_new(evt) {
	if($(evt).text() == "Other") {
		$("#new-entity #otherInvestorType").show();
		$("#new-entity #otherInvestorType").attr("required", "required");
		$("#new-entity input[data-other=investorTypeText]").removeAttr("disabled");
	} else {
		$("#new-entity #otherInvestorType").hide();
		$("#new-entity #otherInvestorType").removeAttr("required");
		$("#new-entity input[data-other=investorTypeText]").attr("disabled", "disabled");
	}
	
	if($(evt).text() == "Individual") {
		$("#new-entity #individualInvestorDetails_new").show();
		$("#new-entity #nonIndividualInvestorDetails_new").hide();
		$("#new-entity #nonIndividualInvestorDetails_new input").val("");
	} else {
	    $("#new-entity #individualInvestorDetails_new").hide();
	    $("#new-entity #individualInvestorDetails_new input").val("");
		$("#new-entity #nonIndividualInvestorDetails_new").show();
	}
}

function initSameAddressCheckbox() {
	$(".new-entity .nolabel_check.same-address").click(function() {
		if($(this).hasClass("check-on")) {
			$(this).removeClass("check-on");
			$(".new-entity input.mailingAddress").val("");
		} else {
			$(this).addClass("check-on");
			$(".new-entity input.mailingAddress").each(function() {
				var addressField = $(this).attr("data-binding");
				var permanentAddressFieldValue = $(".new-entity input.permAddress[data-binding=" + addressField + "]").val();
				$(this).val(permanentAddressFieldValue);
			});
		}
		
	});
	
	$(".existing-entity .nolabel_check.same-address").click(function() {
		if($(this).hasClass("check-on")) {
			$(this).removeClass("check-on");
			$(".existing-entity input.mailingAddress").val("");
		} else {
			$(this).addClass("check-on");
			$(".existing-entity input.mailingAddress").each(function() {
				var addressField = $(this).attr("data-binding");
				var permanentAddressFieldValue = $(".existing-entity input.permAddress[data-binding=" + addressField + "]").val();
				$(this).val(permanentAddressFieldValue);
			});
		}		
	});
}

function initIsAustralianCheckbox() {
	$(".forAustralia").hide();
	$('input[name=wholeSaleClient][type=radio]').attr('checked', true);
	$('input[name=netAsset][type=radio]').attr('checked', true);
	$('input[name=income][type=radio]').attr('checked', true);
	$('input[name=subAmount][type=radio]').attr('checked', true);
	$(".label_check.isAustralian").click(function() {
		$(this).toggleClass("check-on");
		$(".forAustralia").slideToggle("slow");
	});
}

function getChartDataForPerformance() {
	getChartDataForPerformanceByFunds();	
}

function getChartDataForPerformanceByFunds() {
	Server.getChartDataForClientDetailsPerformance( {investorId: selectedClient.investorId}, function(response) {
	
		chartDataEntitiesList = response;
		
		for(var i in chartDataEntitiesList) {
			chartDataEntitiesList[i] = parseGraphData(chartDataEntitiesList[i]);
		}		

		populateEntityFunds(chartDataEntitiesList[0]);
		populateEntitySelector();
		if(response[0] != undefined) {
		    entityGraphData.totalHoldingsByFunds = response[0].totalHoldingsByFunds;
			entityGraphData.byFundsTotal = response[0].byFundsTotal;
			entityGraphData.totalHoldings = response[0].totalHoldings;
			//entityGraphData.totalGainLoss = response[0].totalGainLoss;
			//entityGraphData.byFunds = response[0].byFunds;
		}		
		reloadCharts();
	});
}

function getInvestorData(){
	Server.getEntitiesDetailsByInvestorId( {investorId: selectedClient.investorId}, function(response) {		
		var entities = response;
		
		if(entities.length > 0) {
			$("#entitiesCount").text(entities.length);
			var updateDate = entities[0].updateDate;
			if(updateDate != null) {
				var dateBits = updateDate.split('-'); 
				updateDate = dateBits[1]+"/"+dateBits[2]+"/"+dateBits[0];
			} else {
				if(entities[0].createDate != null) {
					var createDate = entities[0].createDate;
					dateBits = createDate.split('-');
					updateDate = dateBits[1]+"/"+dateBits[2]+"/"+dateBits[0];
				}
			}
			$("#entityUpdateDate").text(updateDate);
			$("#existing-entity").addClass("active");
			$("#new-entity").removeClass("active");
		}
		
		getDataWithEntities(entities);
		getOpportunitiesCount(selectedClient.investorId);
	    initDocumentSection();
	});
}

function getInvestmentEntityData(){
	Server.getEntitiesDetailsByEntityId( {investorEntityId: selectedClient.investmentEntityId}, function(response) {
		var entities = response;
		if(entities == null) {
			//do nothing
		} else if (entities.length > 0) {
			$("#entitiesCount").text(entities.length);
			var updateDate = entities[0].updateDate;
			if(updateDate != null) {
				var dateBits = updateDate.split('-'); 
				updateDate = dateBits[1]+"/"+dateBits[2]+"/"+dateBits[0];
			} else {
				if(entities[0].createDate != null) {
					var createDate = entities[0].createDate;
					dateBits = createDate.split('-');
					updateDate = dateBits[1]+"/"+dateBits[2]+"/"+dateBits[0];
				}
			}
			$("#entityUpdateDate").text(updateDate);
		}
		getDataWithEntities(entities);
		getOpportunitiesCount(selectedClient.investmentEntityId);
	    initDocumentSection();
	});
}

function getOpportunitiesCount(investorEntityId) {
	Server.getOpportunitiesCount( {investmentEntityId: investorEntityId}, function(response) {
		var opportunityCount = response;
		$("#opportunitiesCount").text(" "+response[0].totalOpportunities);
	});
}

function getDataWithEntities(entities) {
	holdingsList = holdings;
	doAfterHoldingsLoad();
	entitiesList = entities;
	doAfterEntitiesLoad();	
	// Refresh Liquidity after modifying the investment entity
	doAfterLiquidityLoad();
	loadClientInfo();
}

function copyInvestorAddressInformation() {
	$("#new-entity input[data-field=permanentCountry]").val($("#investor-detail input[data-field=country]").val());
    $("#new-entity input[data-field=permanentStreet1]").val($("#investor-detail input[data-field=street1]").val());
    $("#new-entity input[data-field=permanentStreet2]").val($("#investor-detail input[data-field=street2]").val());
    $("#new-entity input[data-field=permanentCity]").val($("#investor-detail input[data-field=city]").val());
    $("#new-entity input[data-field=permanentState]").val($("#investor-detail input[data-field=state]").val());
    $("#new-entity input[data-field=permanentPostalCode]").val($("#investor-detail input[data-field=postalCode]").val());
    $("#new-entity input[data-field=permanentEmail]").val($("#investor-detail input[data-field=email]").val());
    $("#new-entity input[data-field=permanentAlternateEmail]").val($("#investor-detail input[data-field=alternateEmail]").val());
    $("#new-entity input[data-field=permanentPhone]").val($("#investor-detail input[data-field=phone]").val());
    $("#new-entity input[data-field=permanentFax]").val($("#investor-detail input[data-field=fax]").val());
}

function initClientTabs() {
    $("#client-details").find(".tab-section").bind("click", function() {
        setActiveClientTab(this);
    });
    $(window).trigger("resize");
}

function initBindings() {
	BindingFactory.bindAll("#existing-entity");
}

function loadClientInfo() {
    if(selectedClient) {
    	//Only allow 32 chars to be showed
    	var name = selectedClient.name;
    	var firmName = selectedClient.firmName;
    	var advisorName = selectedClient.advisorName;

    	name = (typeof name != 'undefined' && name.length > 32) ? name.substring(0, 32) + "..." : name;
    	firmName = (typeof firmName != 'undefined' && firmName.length > 32) ? firmName.substring(0, 32) + "..." : firmName;
    	advisorName = (typeof advisorName != 'undefined' && advisorName.length > 32) ? advisorName.substring(0, 32) + "..." : advisorName;
    	
        $("#subscription span#clientName").text(name);
        $("#subscription span#firmName").text(firmName);
        $("#subscription span#advisorTeamName").text(advisorName);        
    }
}

function selectEntity(selectedEntity) {
	if($(".new-entity").hasClass("active")) {
		$(".existing-entity").addClass("active");
		$(".new-entity").removeClass("active");
	}
	BindingFactory.triggerBinding(selectedEntity, "selectedEntity");
	BindingFactory.triggerBinding(selectedEntity.standingInstructionsData, "standingInstructionsData");
	BindingFactory.triggerBinding(selectedEntity.mailingAddress, "mailingAddress");
	BindingFactory.triggerBinding(selectedEntity.residenceAddress, "residenceAddress");
	BindingFactory.triggerBinding(selectedEntity.custodianAddress, "custodianAddress");
	
	if($("#existing-entity ul.white-dropdown-menu[data-field=investorTypeId]").find(".selected div").text() == "Individual") {
		$("#individualInvestorDetails_existing").show();
		$("#nonIndividualInvestorDetails_existing").hide();
	} else {
		$("#individualInvestorDetails_existing").hide();
		$("#nonIndividualInvestorDetails_existing").show();
	}
	
}

function setActiveClientTab(event) {
    $("#client-details").find(".tab-section.active").removeClass("active");
    $("#client-details").find(".content-page.active").removeClass("active");
    $(event).addClass("active");
    $("#" + $(event).attr("data-tab")).addClass("active");
    $(window).trigger("resize");
    
    //select the first entity
    if($(event).attr("data-tab") == "entities") {
    	if($("#entities-list-grid tr.k-state-selected").length != 1) {
    		$("#entities-list-grid tbody").find("tr").first().click().addClass("k-state-selected");
    	}
    	
    	copyInvestorAddressInformation();
    }

    if ($(event).attr("data-tab") == "performance") {
        getChartDataForPerformance();
    } else {
        $("#performance .chart").each(function() {
            $(this).empty();
        });
    }

    $(window).trigger("resize");
}

function doAfterHoldingsLoad() {
	if (!isInvestmentEntity) {
		getHoldingsByInvestorId();
	} else {
		getHoldingsByInvestmentEntityId();
	}
}

function getHoldingsByInvestmentEntityId() {
	Server.getHoldingsByEntity( {investorEntityId: selectedClient.investmentEntityId}, function(response) {
		holdings = response;
		doAfterHoldingsLoadData();
	});
}

function getHoldingsByInvestorId() {
	Server.getHoldingsByInvestor( {investorId: selectedClient.investorId}, function(response) {
		holdings = response;
		doAfterHoldingsLoadData();
	});
}

function doAfterHoldingsLoadData() {
	var holdingsGrid = holdingsGrid_create(holdingsColumns, holdingsHeaders, holdings, "holdings-table");
	//* 
	$("#client-details #holdings .grid-wrapper").empty();
	$("#client-details #holdings .grid-wrapper").append(holdingsGrid);
	
	$("#holdings-table").kendoGrid();
	resizeHoldingsGrid();	
	
	//KendoGrid removes all the classes during it's creation, so we need to re-add them.
	$("#holdings .entity-name").each(function() {
	    var productId = $(this).attr("data-productId");
	    $(this).parents("tr").addClass("entityRow").attr("data-productId", productId);
	    $(this).parents("td").addClass("relative");
	});
	
	$("#holdings .fund").each(function() {
		var productId = $(this).attr("data-productId");
		$(this).parents("tr").addClass("fund").addClass(productId);
	});
	
	$("#holdings").on("click", ".entity-open", function() {
		openEntityDetail($(this));
	});
	
	$("#holdings").on("click", ".trade-info", function() {
		var transactionId = $(this).attr("data-transactionid")
		if( transactionId != undefined) {
			Server.getTransactionTasks( {transactionId: transactionId}, function(response) {
				var options = {};
				options.selectedTrade = response;
				options.selectedTransactionId = transactionId;
				options.allowNavigation = false;
				options.numTasks = response.length;
				options.tasks = response;
				var dialog = new Dialog("trade-info", options);
	    });
		}
	});
}

function doAfterLiquidityLoad() {
	if(!isInvestmentEntity) {
		getLiquidityByInvestorId();
	} else {
		getLiquidityByInvestmentEntityId();
	}
}

function getLiquidityByInvestorId() {
	Server.getLiquidityByInvestor( {investorId: selectedClient.investorId}, function(response) {
		liquidityData = response;
		doAfterLiquidityLoadData(liquidityData);
	});
}

function getLiquidityByInvestmentEntityId() {
	Server.getLiquidityByEntity( {investorEntityId: selectedClient.investmentEntityId}, function(response) {
		liquidityData = response;
		doAfterLiquidityLoadData(liquidityData);
	});
}

function doAfterLiquidityLoadData() {
	 var liquidityGrid = liquidityGrid_create(liquidityData, "liquidity-table");
	 //*
	 $("#client-details #liquidity .grid-wrapper").empty();
	    $("#client-details #liquidity .grid-wrapper").append(liquidityGrid);

	    $("#liquidity-table").kendoGrid();
	    resizeLiquidityGrid();

	    $("#liquidity th[data-field=product]").css("width", 300);
	    $("#liquidity-table tr:first-child td:first-child").css("width", 300);

	    $("#liquidity .label_check").click(function() {
	        $(this).toggleClass("check-on");
	        if ($("#liquidity .label_check.check-on[data-entityid=" + $(this).attr("data-entityId") + "]").length > 0) {
	            $(".command-button-disabled[data-entityid=" + $(this).attr("data-entityid") + "]").addClass("command-button").removeClass('command-button-disabled');
	        } else {
	            $(".command-button[data-entityid=" + $(this).attr("data-entityid") + "]").removeClass("command-button").addClass('command-button-disabled');
	        }
	    });

	    //KendoGrid removes all the classes during it's creation, so we need to re-add them.
	    $("#liquidity-table .entity-name").each(function() {
	        var entityId = $(this).attr("data-entityId");
	        $(this).parents("tr").addClass("entityRow").attr("data-entityId", entityId);
	        $(this).parents("td").addClass("relative");
	    });

	    $("#liquidity-table .entity").each(function() {
	        var entityId = $(this).attr("data-entityId");
	        $(this).parents("tr").addClass("entity").addClass(entityId);
	    });

	    $(".entityRow").prev().addClass("total-row");
	    $("#liquidity-table tbody tr:last-child").addClass("total-row");

	    $("#liquidity-table").on("click", ".entity-open", function() {
	        openLiquidityDetail($(this));
	    });
}

function doAfterEntitiesLoad() {
	if(action == "load") {
	    $("#client-details #entities .grid-wrapper").kendoGrid({
			dataSource: {
				data: entitiesList
			},
			sortable: {
				mode: "single",
				allowUnsort: false
			},
			selectable: true,
			columns: entityColumns
		});
	    
	    $("#entities").on("click", "tbody .nolabel_check", function() {
			$(this).toggleClass("check-on");
			$(this).parents("td").toggleClass("added");	
	    });

	    $("#entities").on("click", "thead .column_check", function() {		
			$(this).toggleClass("check-on");
			if($(this).hasClass("check-on"))
			    $("#entities tbody .nolabel_check").addClass("check-on").parents("td").addClass("added");
			else
			    $("#entities tbody .nolabel_check").removeClass("check-on").parents("td").removeClass("added");
	    });
	    
    } else {
	    var grid = $("#client-details #entities .grid-wrapper").data("kendoGrid");
		grid.dataSource.data(entitiesList);
    }
	action = "load";
    $("#entities-list-grid").on("click", "tbody tr", function() {
    	$("#existing-entity .save").show();
        var grid = $("#client-details #entities .grid-wrapper").data("kendoGrid");
        selectedEntity = grid.dataItem($(this)); 
        if (selectedEntity != undefined && selectedEntity != null) {
        	/*if(selectedEntity.foregoingBox==true){
        		$(".nolabel_check.foregoing.existing").addClass("check-on");
        	}else{
        		$(".nolabel_check.foregoing.existing").removeClass("check-on");
        	}*/
        	if(selectedEntity.isWholeSaleClient == false && selectedEntity.isSubscriptionAmtGreaterThen500k == false) {
        		$(".forAustraliaExisting").hide();
        	} else {
        		$(".forAustraliaExisting").show();
        	}
        	if(selectedEntity.investorTypeId==18) {
        		$("input[data-other=investorTypeText]").removeAttr("disabled");
    		} else {
    			$("input[data-other=investorTypeText]").val(" ");
    			$("input[data-other=investorTypeText]").attr("disabled", "disabled");    			
    		}
        }
    	selectEntity(selectedEntity);
	});    
}

function initClientNavigators() {
	if(allowClientNavigation)
	{
		$("#client-details .left-icon").show().click(toPreviousClient);
		$("#client-details .right-icon").show().click(toNextClient);
	}
}

function initRedeemButtons() {
    $("#liquidity").on("click", ".redeem", function (e) {
        if ($(this).hasClass("command-button") != true) {
            return;
        }
        var selectedTrades = [],
            selectedTradeBoxes = [],
            entityString;

        entityString = $(e.currentTarget).attr("data-entityid");
        selectedTradeBoxes = $("." + entityString).find(".label_check.check-on");
        
        for (var i = 0; i < selectedTradeBoxes.length; i++) {
            var tradeData = {};
            
            tradeData.initialDate = $(selectedTradeBoxes[i]).attr("data-initialDate");
            tradeData.productId = $(selectedTradeBoxes[i]).attr("data-productId");
            tradeData.investmentEntity = $(selectedTradeBoxes[i]).attr("data-entityId");
            tradeData.fundId = $(selectedTradeBoxes[i]).attr("data-fundId");
            tradeData.fundType = $(selectedTradeBoxes[i]).attr("data-fundType");
            tradeData.adminTypeId = $(selectedTradeBoxes[i]).attr("data-adminTypeId");
            tradeData.productName= $(selectedTradeBoxes[i]).attr("data-productName");
            tradeData.processAutoRedemptions = $(selectedTradeBoxes[i]).attr("data-processAutoRedemptions"); 
            tradeData.entityName = $(selectedTradeBoxes[i]).attr("data-entityName");
            tradeData.ifsInvestorName = $(selectedTradeBoxes[i]).attr("data-ifsInvestorName");
            tradeData.packetName = $(selectedTradeBoxes[i]).attr("data-packetName");
            var initialInvestment = kendo.toString(parseFloat($(selectedTradeBoxes[i]).attr("data-initialInvestment")), 'c');
            tradeData.initialInvestment = initialInvestment;
            tradeData.redemption = $(selectedTradeBoxes[i]).attr("data-redemption");
            tradeData.notice = $(selectedTradeBoxes[i]).attr("data-notice");
            tradeData.lockup = $(selectedTradeBoxes[i]).attr("data-lockup");
            tradeData.exitFee = $(selectedTradeBoxes[i]).attr("data-exitFee");
            tradeData.navDate = $(selectedTradeBoxes[i]).attr("data-navDate");
            tradeData.shareClass = $(selectedTradeBoxes[i]).attr("data-shareClass");
            tradeData.endingCapital = parseFloat($(selectedTradeBoxes[i]).attr("data-endingCapital"));
            tradeData.firmName = selectedClient.firmName;
            tradeData.advisorName = selectedClient.advisorName;
            tradeData.investorName = selectedClient.name;
            if(tradeData.processAutoRedemptions!=1)
            {
            	var alert = new Alert("The redemption process for "+tradeData.productName+ " is currently a manual process.  Please contact your CAIS account team to obtain the necessary documents","OK");
            	return false;
            }
            selectedTrades.push(tradeData);
        }
        var alert = new Alert("By Clicking Yes you are confirming you would like to generate redemption forms for the selected positions.  Would you like to continue with this request?", "YES", "NO");
        $(document).bind("alertConfirm", function() {	
		    $.download('/generateRedemptionRequest', {data: JSON.stringify(selectedTrades)}, 'POST');
        });
    });
}

function toNextClient() {
	var currentIndex;
	for(var i in selectedClientArray) {
		if(selectedClient.investmentEntityId == selectedClientArray[i].investmentEntityId) {
			currentIndex = i;
			break;	
		}
	}
	currentIndex++;
	if(currentIndex > selectedClientArray.length - 1)
		currentIndex = 0;
		
	selectedClient = selectedClientArray[currentIndex];
	loadClientInfo();
}

function toPreviousClient() {
	var currentIndex;
	for(var i in selectedClientArray) {
		if(selectedClient.id == selectedClientArray[i].id) {
			currentIndex = i;
			break;	
		}
	}
	currentIndex--;
	if(currentIndex < 0)
		currentIndex = selectedClientArray.length - 1;
		
	selectedClient = selectedClientArray[currentIndex];
	loadClientInfo();
}

function resizeHoldingsGrid() {
    var gridElement = $("#client-details #holdings .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight - 50);
    dataArea.height(newHeight - 73);
}

function resizeLiquidityGrid() {
    var gridElement = $("#client-details #liquidity .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight - 50);
    dataArea.height(newHeight - 73);
}

function getInvestorDetails() {
	Server.getInvestorDetails( {investorId: selectedClient.investorId}, function(response) {
		investorDetails = response[0];
		if(selectedClient.firmName == undefined)
		{
			$("#clientName").text(investorDetails.name);	
			$("#firmName").text(investorDetails.fullName);
			$("#advisorTeam").text(investorDetails.advisorName);	
		}
		triggerInvestorDetailsBindings(investorDetails);		
	});
}

function initInvestorDetailsBinding() {
	getInvestorDetails();
	initializeInvestorDetailsBindings();
}

function initializeInvestorDetailsBindings() {
    BindingFactory.bindAll("#investor-detail");
}

function triggerInvestorDetailsBindings(investorDetails) {
    BindingFactory.triggerBinding(investorDetails, "investorDetails");
}

var savingRecord = $("<span style='margin-right: 10px;'>Saving Record ...</span>");
var recordSaved = $("<span style='margin-right: 10px;'>Save Successful</span>");

function notifySaveStarted(saveButton) {
	$(saveButton).hide();
	$(saveButton).parent().append(savingRecord);	
}

function notifySaveComplete(saveButton) {
	savingRecord.replaceWith(recordSaved);
	window.setTimeout(function() {
		recordSaved.remove();
		$(saveButton).show();
	}, 2000);
}

function populateCharts() {		
	$("#performance .chart[data-chartType=line]").each(renderLineChart);
//	$("#performance .chart[data-chartType=column]").each(renderColumnChart);	
	$("#performance .chart[data-chartType=pie]").each(renderPieChart);	
//	$("#performance .chart[data-chartType=stackedcolumn]").each(renderStackedColumnChart);
}
/*
function renderStackedColumnChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
    seriesDefaults: {
        type: "column",
        stack: true,
        labels: {
        	visible: false,
        	format: "{0:C0}k"
        }
    },
    series: entityGraphData[chartData],
    categoryAxis: {
    	categories: labels,
    	title: {
    		text: (new Date).getFullYear(),
    		font: "12px Arial,Helvetica,sans-serif",
    		margin: 0
    	}
    },
    valueAxis: {
    	labels: {
        	format: "{0:C0}k"        		
    	}
    },
    tooltip: {
        visible: true,
        template: "#= series.name #"
    },
    chartArea: {
    	margin: 20
    },
    legend: {
    	visible: false
    },
    seriesColors: chartColors.pie
	});
}
*/
/*
function renderColumnChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
	dataSource: {
		data: entityGraphData[chartData]
	},
    seriesDefaults: {
        type: "column",
        labels: {
        	visible: false,
        	format: "{0:C0}k"
        }
    },   
	series: [{ field: "total"}],
    categoryAxis: {
    	categories: labels,
    	title: {
    		text: (new Date).getFullYear(),
    		font: "12px Arial,Helvetica,sans-serif",
    		margin: 0
    	}
    },
    valueAxis: {
    	labels: {
        	format: "{0:C0}"        		
    	}
    },
    tooltip: {
        visible: true,
        format: "{0:C0}"
    },
    chartArea: {
    	margin: 20
    },
    legend: {
    	visible: false
    },
    seriesColors: chartColors.bar
	});
}
*/
function renderPieChart(i, chartWrapper) {
	kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
		dataSource: {
			data: entityGraphData[chartData]
		},
	    seriesDefaults: {
	        type: "pie",
	        labels: {
	        	visible: true
	        },
			pie: {
				categoryField: chartCategory,
				labels: {
					template: "#= category #"
				}
			}
	    },   
		series: [{ field: "totalValue", overlay: {gradient: 'none'}}],
	    valueAxis: {
	        labels: {
	            format: "{0:C0}k"
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
	    	visible: false
	    },
	});	
}

function renderLineChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#189ad1', '#14b8e4', '#78caee', '#94a0a9'];

	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
		dataSource: {
			data: entityGraphData[chartData]
		},
	    seriesDefaults: {
	        type: "line",
	        labels: {
	        	visible: false
	        }
	    },   
	    series: [{ field: 'value', categoryField: 'date'}],
	    categoryAxis: {
	    	labels: {
	    		template: function(data) {
	    			return kendo.toString(new Date(data.value), 'M/yy')
	    		}
	    	}
	    },
	    valueAxis: {
	    	labels: {
	    		format: "{0:C0}k"
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
	    	visible: false
	    }	
	});	
}

function reloadCharts() {
	$("#performance .chart").each(function(){
		$(this).empty();
	});
	
	populateCharts();
}

function resizeCharts() {
	$("#performance .chart").each(function(){
		if($(this).data("kendoChart"))
			$(this).data("kendoChart").redraw();
	});
}

function initializeChartExpand() {
	$("#performance .chart-panel .header .expand").click(function(e) {
		var selectedChartCategory = $(this).parents(".chart-panel").find(".chart").attr("data-chartcategory");
		var selectedChartData = $(this).parents(".chart-panel").find(".chart").attr("data-chartdata");
		var selectedChartType = $(this).parents(".chart-panel").find(".chart").attr("data-charttype");
		
		var chartPanel = $("<div class='chart-panel full'/>");
		var chartHeader = $("<div class='header'/>");
		var chartHeaderIcon = $("<div class='shrink'/>");
		var chartWrapper = $("<div class='chart-wrapper'/>");
		var chart = $("<div class='chart'/>");
		chart.attr("data-chartcategory", selectedChartCategory);
		chart.attr("data-chartdata", selectedChartData);
		
		chartHeader.text("Expanded Chart Name");
		chartHeader.append(chartHeaderIcon);
		chartHeaderIcon.click(function(){
			chartPanel.remove();
		});
		
		chartWrapper.append(chart);
	
		chartPanel.append(chartHeader);
		chartPanel.append(chartWrapper);
		
		chartPanel.appendTo("#performance .main-column-content");
		
		switch(selectedChartType) {
			case "pie":
				renderPieChart(0, chart);
				break;
//			case "column":
//				renderColumnChart(0, chart);
//				break;
			case "line":
				renderLineChart(0, chart)
				break;
//			case "stackedcolumn":
//				renderStackedColumnChart(0, chart);
//				break;
			default:
				break;
		}
	});
}


function populateEntitySelector() {
	$("#entity-selector .itemsList").empty();
	for(var i in chartDataEntitiesList) {	
		var entity = $("<li/>");
		entity.data(chartDataEntitiesList[i]);
		entity.append(chartDataEntitiesList[i].entityName);
		
		entity.appendTo("#entity-selector ul");
	}
	
	if(chartDataEntitiesList[0]) {
		$("#entity-selector .selected div").text(chartDataEntitiesList[0].entityName);
	}
}

function selectEntityChart(e) {
	var entity = $(e).data();
	//entityGraphData.byFunds = entity.byFunds;
	entityGraphData.totalHoldingsByFunds = entity.totalHoldingsByFunds;
	entityGraphData.byFundsTotal = entity.byFundsTotal;
	entityGraphData.totalHoldings = entity.totalHoldings;
	//entityGraphData.totalGainLoss = entity.totalGainLoss;	
	reloadCharts();
	populateEntityFunds(entity);
}

function populateEntityFunds(selectedEntity) {
	$("#entity-fund-selector ul").empty();
	$("#entity-fund-selector ul").append("<li><label class='label_check all check-on'>Select All</label></li>")
	if(selectedEntity != undefined) {
		for(var i in selectedEntity.byFundsTotal) {
			var fund = $("<li/>");
			var fundLabel = $("<label class='label_check check-on'/>");
			fundLabel.data(selectedEntity.byFundsTotal[i]);
			fundLabel.append(selectedEntity.byFundsTotal[i].fund);
			fundLabel.appendTo(fund);
			
			fund.appendTo("#entity-fund-selector ul");
		}	
	}
}

function updateSelectedEntityFunds() {
	var newEntityGraphData = {};
	newEntityGraphData.byFundsTotal = [];
	
	$("#entity-fund-selector label.check-on").each(function() {
		if($(this).data().fund)
			newEntityGraphData.byFundsTotal.push($(this).data());
	});
	
	entityGraphData.byFundsTotal = newEntityGraphData.byFundsTotal;
	reloadCharts();	
}

function parseGraphData(graphData) {
/*	for(var i in graphData.byFunds) {
		for(var j in graphData.byFunds[i].data) {
			if(graphData.byFunds[i].data[j] == 0)
				graphData.byFunds[i].data[j] = null;
			else
				graphData.byFunds[i].data[j] = graphData.byFunds[i].data[j] / 1000;
		}
	}
	
	for(var i in graphData.totalGainLoss) {
		graphData.totalGainLoss[i].total = graphData.totalGainLoss[i].total / 1000;
	}*/
	
	/*for(var i in graphData.totalHoldings) {
		if(graphData.totalHoldings[i].value == 0 || graphData.totalHoldings[i].value == null)
			graphData.totalHoldings[i].value = null;
		else
			graphData.totalHoldings[i].value = graphData.totalHoldings[i].value / 1000;
	}*/
	
	for(var i in graphData.byFundsTotal) {
		graphData.byFundsTotal[i].totalValue = graphData.byFundsTotal[i].totalValue / 1000;
	}
	
	return graphData;
}

function initDocumentSection() {
    if (isDocumentSectionReady == false) {
        Server.getClientEntityDocuments({ investorId: JSON.stringify(selectedClient.investorId) }, function (response) {
            var investmentEntityDocList = response.documentsList;
            var productsList = response.productsList;
            var documentTypeList = response.documentTypeList;

            $("#documents .grid-wrapper").data("kendoGrid").dataSource.data(investmentEntityDocList);

            for (var i in productsList) {
                var product = $("<li/>");
                product.data(productsList[i]);
                product.append(productsList[i].legalName);

                product.appendTo("#documents .availableProductList");
            }

            for (var j in documentTypeList) {
                var documentType = $("<li/>");
                documentType.data(documentTypeList[j]);
                documentType.append(documentTypeList[j].categoryName);

                documentType.appendTo("#documents .availableCategoryList");
            }
        });

        $("#documents .entity-navigation li").click(function () {
            $("#documents .entity-navigation li.active").removeClass("active");
            $(this).addClass("active");
            var section = $(this).attr("data-section");
            $("#documents .subscription-section.active").removeClass("active");
            $("#documents .subscription-section[data-section=" + section + "]").addClass("active");
            $(window).trigger("resize");
        });

        var entityMenu = new MenuList($("#documents .availableEntities"), null, 110);
        $("#documents .availableEntities ul").empty();

        for (var i in entitiesList) {
            var entity = $("<li/>");
            entity.data(entitiesList[i]);
            entity.append(entitiesList[i].displayName);

            entity.appendTo("#documents .availableEntityList");
        }

        var productMenu = new MenuList($("#documents .availableProducts"), null, 110);
        var categoryMenu = new MenuList($("#documents .availableCategories"), null, 110);

        $("#documents input[data-field=documentDate]").kendoDatePicker();

        $("#documents .grid-wrapper").kendoGrid({
            columns: [
                { title: "Document Name", field: "documentName", template: "<div class='entityDocumentLink'>${ documentName }</div>" },
                { title: "Description", field: "documentDescription" },
                { title: "Account Number", field: "accountNumber" },
                { title: "Entity", field: "entityName" },
                { title: "Transaction ID", field: "transactionId" },
                { title: "Product", field: "productName", template: "# if (productName == null || productName == '') {# N/A #} else {# ${productName }#}#" },
                { title: "Document Type", field: "categoryName" },
                { title: "Document Date", field: "fileDate" },
                { title: "Upload Date", field: "createDate" }
            ],
            editable: false,
            groupable: true,
            sortable: true,
            dataSource: {
                data: [],
                schema: {
                    model: {
                        id: "documentId",
                        fields: {
                            documentId: { editable: false, nullable: false },
                            transactionId: { editable: false, nullable: false },
                            categoryId: { editable: false, nullable: false },
                            documentDescription: { editable: false, nullable: true },
                            investmentEntityId: { editable: false, nullable: false },
                            entityName: { editable: false, nullable: false },
                            productId: { editable: false, nullable: false },
                            categoryName: { editable: false, nullable: false },
                            fileDate: { editable: false, nullable: false },
                            accountNumber: { editable: false, nullable: false },
                            documentName: { editable: false, nullable: false },
                            createDate: { editable: false, nullable: false },
                            productName: { editable: false, nullable: false }
                        }
                    }
                }
            }
        });

        $("#documents .grid-wrapper").on("click", ".entityDocumentLink", function (e) {
            var grid = $("#documents .grid-wrapper").data("kendoGrid");
            var selectedDocument = grid.dataItem($(this).parents("tr"));
            window.open('/api/document/download?docId=' + selectedDocument.documentId);
        });

        $("#documents #docs").kendoUpload({
            multiple: false,
            select: function (e) {
                var files = e.files;
                $.each(files, function () {
                    if (this.size > 10240000) {
                        var alert = new Alert("Uploaded File Cannot Exceed 10mb", "OK");
                        this.preventDefault();
                    } else if (this.extension.toLowerCase() != ".pdf" && this.extension.toLowerCase() != ".doc" && this.extension.toLowerCase() != ".docx") {
                        var alert = new Alert("The only acceptable file extensions are .pdf, .doc or .docx", "OK");
                        this.preventDefault();
                    }
                });
            },
            async: {
                saveUrl: "/uploadInvestmentEntityDocs",
                autoUpload: false
            },
            complete: function (e) {
            },
            success: function (e) {
                removeLoadingDialog();
                $("#documents .grid-wrapper").data("kendoGrid").dataSource.data(e.response.msg.documentsList);
                $("#documents li[data-section=document-list]").click();
            },
            remove: function (e) {
                var allFiles = $("#documents .k-file");
                if (allFiles.length = 2) {
                    $("#documents .document-details input").each(function () {
                        $(this).removeAttr("disabled");
                    });
                }
            },
            upload: function (e) {
                showLoadingDialog();
                var entityId = $("#documents .availableEntities .selected div").data().investmentEntityId;
                var productId = $("#documents .availableProducts .selected div").data().productId;
                var categoryId = $("#documents .availableCategories .selected div").data().categoryId;

                if (entityId == undefined || categoryId == undefined) {
                    e.preventDefault();
                    var alert = new Alert("You must select an entity and a category to associate this file(s) with", "OK");
                }

                e.data = {
                    categoryId: categoryId,
                    documentDescription: $("#documents textarea[data-field=description]").val(),
                    productId: productId,
                    documentDate: $("#documents input[data-field=documentDate]").val(),
                    investmentEntityId: entityId,
                    transactionId: $("#documents input[data-field=transactionId]").val(),
                    investorId: selectedClient.investorId
                };
            }
        });

        $("#documents div.k-upload-button span").text("SELECT");

        $("#submit-documents").click(function () {
            // click the hidden file upload submit button	        
            $("#documents .k-button.k-upload-selected").click();
        });
        isDocumentSectionReady = true;
    }
}

}).call();