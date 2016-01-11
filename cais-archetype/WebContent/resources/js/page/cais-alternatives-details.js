function validateInvestmentDate(e) {
	var $selectedItem = $(e.sender.element),
		todayDate = new Date(),
		$rootTD = $selectedItem.parents("td"),
		$rootTR = $selectedItem.parents("tr"),
		selectedMonth = $rootTR.find("select.month").data("kendoDropDownList").value(),
		currentMonth = todayDate.getMonth() + 1,
		selectedYear = $rootTR.find("select.year").data("kendoDropDownList").value(),
		currentYear = todayDate.getFullYear();
	if(selectedYear != currentYear || isNaN(selectedYear) || selectedMonth > currentMonth) {
		$rootTD.removeClass("incorrect-area");
		$rootTR.find("select.year").find(".selected").removeClass("incorrect-date");
	}else if(selectedMonth <= currentMonth) {
		$rootTD.addClass("incorrect-area");
	}
	$selectedItem.parents(".client-entity-content").find(".date-error").remove();
	if($selectedItem.parents('.client-entity-content').find('.incorrect-area').length>0){
		$selectedItem.parents(".client-entity-content").prepend("<div class='date-error'><span>*Investment date must be in the future</span></div>");
	}
}
(function(){
var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var productClass;
var custodiansDatasource = {};
$(document).bind("fundDetailsLoaded", function() {
	viewLoaded();
});

function viewLoaded() {
	resizeContentHeight();
	prepareToggleButton();
	createSplitter();
	$(document).trigger("initializeSubmitDetailsButton");
}

$(window).resize(function() {
	onSplitterResize();
});


$(document).bind("createEntityDetails", createEntityDetails);
function createEntityDetails() {
	$(".client-entity-list").empty();

	var counter = 0;
	$.each(selectedProducts, function(i, product) {
		$.getJSON('/api/products/ai/' + product.fundId + '/share_class', function(response) {
			product.shareClass = response.sort();
			counter++;
			if (counter === selectedProducts.length) {
				for ( var i in selectedClients ) {
					var client = selectedClients[i];
					Server.getEntityDetail({ id: client.id }, function(response) {
						createEntityDetailsSub(response);
					});
				}
			}
		}).error(function() {
			Alert('There was a problem loading the share class for these funds. Please contact CAIS Support.', 'OK');
		});	
	});
}
function validateCapacityAnswers($formParent){
	var validated = true,
		$allQuestions = $formParent.find(".adv-cap-question");
	$allQuestions.removeClass("incorrect-area");
	$allQuestions.filter(":visible").each(function(){
		var $validationArea = $(this),
			isValidated = false;
		$validationArea.find('select.micro-dropdown').each(function(){
			var currentValue = $(this).data("kendoDropDownList").value();
			if (typeof currentValue !== "undefined" && currentValue != 0){
				isValidated = true;
			}
		});
		$validationArea.find('input[type="radio"]:checked').each(function(){
			var currentValue = $(this).val();
			if (typeof currentValue !== "undefined"){
				isValidated = true;
			}
		});
		if(!isValidated){
			$validationArea.addClass("incorrect-area");
		}
		validated = validated && isValidated;
	});
	return validated;
}
function setAnswerAdvCap($formParent, hideAndShow){
	for (var key in hideAndShow) {
		if (hideAndShow.hasOwnProperty(key)) {
			var $area= $formParent.find("."+key),
				resetMe = false;
			switch(hideAndShow[key]){
				case 'reset':
					resetMe = true;
				case 'show':
					$area.addClass("show");
					break;
				case 'hide':
					resetMe = true;
					$area.removeClass("show");
					break;
			}
			if(resetMe){
				$area.find("input:radio").attr("checked", false);
				$area.find("select.micro-dropdown").each(function(){
					var kendoDropdown = $(this).data("kendoDropDownList");
					if(kendoDropdown){
						kendoDropdown.value(-1);
						$(kendoDropdown.span[0]).addClass('unrelevant-data');
					}
					

				});
				$area.removeClass("incorrect-area");
			}
		}
	}
}
function smallDropdownOpen(e){
	e.sender.popup.element.addClass('small-dropdown');
}
function setDropdownStyle(e){
	var $selectedItem = $(e.sender.element),
		$selectedData = $(e.sender.span[0]),
		kendoInstance = $selectedItem.data("kendoDropDownList");
	if(kendoInstance){
		var currentValue = kendoInstance.value();
		if(!currentValue || currentValue==0){
			$selectedData.addClass('unrelevant-data');
		}else{
			$selectedData.removeClass('unrelevant-data');
		}
	}
}
function createEntityDetailsSub(entityDetail) {
	var today = new Date();
	var nextMonth = today.getMonth() + 1;
	
	var client = entityDetail[0];
	
	nextMonth = nextMonth + 1;

    if(nextMonth == 13) {
    	nextMonth = 1;
    }

    if(!custodiansDatasource[client.id]){
    	custodiansDatasource[client.id] = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: 'json',
                     url: "/getCustodianInfo",
	     			 data:{investmentEntityId:client.id},
                }
            },
            schema: {
                data: "msg"
            }
        });
    }
	
	var year = (today.getMonth() < 11) ? today.getFullYear() : today.getFullYear() + 1;
	
	var newEntity = $("<li class='client-entity' data-clientid='" + client.id + "'/>");
	var newEntityHeader = $("<div class='client-entity-header'/>");
	newEntityHeader.append("<img src='resources/assets/icons/drop-down-arrow.png' alt='toggle' class='drop-down-arrow'/>");		
	newEntityHeader.append("<div class='client-name'> " + client.clientName + " - " + client.name + "</div>");
	newEntityHeader.append("<div class='client-firmName'> " + client.firmName + "</div>");
	if(client.pendingInvestment==null){client.pendingInvestment=0;}
	newEntityHeader.append("<div class='pending-investments'>Pending Investments: <span class='investments'>"+client.pendingInvestment+"</span></div>");
	if(client.totalInvestment==null){client.totalInvestment=0;}
	newEntityHeader.append("<div class='total-investments'>Total Investments: <span class='investments'>"+client.totalInvestment+"</span></div>");
	var deleteEntityButton = $("<img src='resources/assets/icons/delete.png' alt='remove-entity' class='delete-entity-button'/>");
	deleteEntityButton.click(function() {
		$(this).parents("li").remove();
		if($(".client-entity").length < 1) {
			$("#submit-details").hide();
		} else {
			$("#submit-details").show();
		}
	});
	newEntityHeader.append(deleteEntityButton);
	
	var $newEntityContent = $("<div class='client-entity-content'/>");
	var table = $("<table/>");
	var tableHeader = $("<thead><tr><td>FUND</td><td class='center'>AMOUNT (USD)</td><td class='center'>CLASS</td><td class='center' style='width: 110px'>PLACEMENT FEE</td>" +
			"<td class='center' style='width: 195px'><label data-field='investmentDate'>INVESTMENT DATE</label></td><td class='center' style='width: 120px'><label data-field='advisor'>ADVISOR</label></td></tr></thead>");
	table.append(tableHeader);
	var tableBody = $("<tbody/>");

	var onPopulationComplete = function() {
		tableBody.appendTo(table);
		table.appendTo($newEntityContent);
			
		newEntityHeader.appendTo(newEntity);
		$newEntityContent.appendTo(newEntity);
		newEntity.appendTo($(".client-entity-list"));
			
		$('.investments').formatCurrency();
		$newEntityContent.find('.currency').blur(function() {
		  var num = $(this).val().toString().replace(/\$|\,/g,'');
		  if(isNaN(parseFloat(num)) == false) {
		   $(this).formatCurrency();
		   $(this).removeClass("invalid-amount");
		  } else {
		   $(this).addClass("invalid-amount");
		  }
		});
		kendo.init($newEntityContent);
		
		$newEntityContent.find("select.capacity").kendoDropDownList({
			dataBound: setDropdownStyle,
	        change: function(e){
	        	var $selectedItem = $(e.sender.element),
	        		$singleContainer = $selectedItem.parents(".adv-cap-question"),
	        		$questionsContainer = $selectedItem.parents(".advisor-capacity-questions"),
	        		currentValue = parseInt($selectedItem.data("kendoDropDownList").value());
	        	setDropdownStyle(e);
	        	
	        	switch(currentValue){
	        		case 0:
	        			//hide everything
	        			setAnswerAdvCap($questionsContainer, {'adv-cap-1-1':'hide', 'adv-cap-2':'hide', 'adv-cap-2-1':'hide', 'adv-cap-2-2':'hide'});
	        			break;
	        		case 1:
	        		case 2:
	        		case 3:
	        		case 4:
	        			$singleContainer.removeClass("incorrect-area");
	        			setAnswerAdvCap($questionsContainer, {'adv-cap-1-1':'reset', 'adv-cap-2':'hide', 'adv-cap-2-1':'hide', 'adv-cap-2-2':'hide'});
	        			break;	
	        		case 5:
	        			$singleContainer.removeClass("incorrect-area");
	        			setAnswerAdvCap($questionsContainer, {'adv-cap-1-1':'hide', 'adv-cap-2':'show', 'adv-cap-2-1':'hide', 'adv-cap-2-2':'hide'});
	        			break;
	        	}
	        },
	        open:smallDropdownOpen
	    });
		var $amounts = $newEntityContent.find('.dollarAmount');
		$amounts.mask('000,000,000,000,000.00', {reverse: true});
		$amounts.blur();



	    $newEntityContent.find("select.custodian").kendoDropDownList({
			optionLabel: "Select security’s Custodian...",
	        dataTextField: "custodianNames",
	        dataValueField: "idCustodianNames",
	        dataBound: setDropdownStyle,
	        dataSource: custodiansDatasource[client.id],
	        change: function(e){
	        	var $selectedItem = $(e.sender.element),
	        		$singleContainer = $selectedItem.parents(".adv-cap-question"),
	        		$questionsContainer = $selectedItem.parents(".advisor-capacity-questions"),
	        		$investmentDetails = $questionsContainer.prev(),
	        		advisorDetails =JSON.parse($investmentDetails.find('select.advisor').data("kendoDropDownList").value()),
	        		currentValue = parseInt($selectedItem.data("kendoDropDownList").value());
	        	setDropdownStyle(e);
	        	switch(currentValue){
	        		case 1:
	        			setAnswerAdvCap($questionsContainer, {'adv-cap-2-1':'reset', 'adv-cap-2-2':'hide'});
	        			break;
	        		default:
	        			setAnswerAdvCap($questionsContainer, {'adv-cap-2-1':'hide', 'adv-cap-2-2':'hide'});
	        			break;
	        	}
	        	if (typeof currentValue !== "undefined" && currentValue != 0){
	        		$singleContainer.removeClass("incorrect-area");
	        	}
	        },
	        open:smallDropdownOpen
	    });
		var advisorList = entityDetail[1].advisorteamList;
		$newEntityContent.find("select.placement.populate").each(function(){
			var $currentItem = $(this),
				currentFundId = $currentItem.data("fund"),
				kendoInstance = $currentItem.data("kendoDropDownList");
			if(kendoInstance)kendoInstance.destroy();
			$currentItem.kendoDropDownList({
		        dataTextField:"placementFeePrct",
		        dataValueField:"placementFeePrct",
		        dataSource:{
		            transport: {
		                read: {
		                    dataType: 'json',
		                    url: '/api/transaction/ai/' + advisorList[0].firmId +'/'+currentFundId+'/placement_fee'
		                }
		            }
		        }
		    });
		});
	    $newEntityContent.find("select.advisor").each(function(e){
	    	$(this).data("kendoDropDownList").bind("change", function(e){
			    var $selectedItem = $(e.sender.element),
	        		$questionsContainer = $selectedItem.parents(".fund-row").next();
	        	setAnswerAdvCap($questionsContainer, {'adv-cap-1':'reset','adv-cap-1-1':'hide', 'adv-cap-2':'hide', 'adv-cap-2-1':'hide', 'adv-cap-2-2':'hide'});
			});
	    });
	    $newEntityContent.find("input[type='radio']").change(function(e){
	    	var $selectedItem = $(e.currentTarget),
	    		$singleContainer = $selectedItem.parents(".adv-cap-question"),
	    		$questionsContainer = $selectedItem.parents(".advisor-capacity-questions"),
	    		currentValue = $selectedItem.val() === "true",
	    		currentName = $selectedItem.attr('name').split("_")[0];
	    	switch(currentName){
	    		//discretionary basis
	    		case "isActingOnDiscretionaryBasis":
	    			setAnswerAdvCap($questionsContainer, {'adv-cap-2':'show'});
	    			break;
	    		//fidelity first investment
	    		case "isInvestorsFirstAltInvestmentWithFidelity":
		    		if(currentValue){
			    		setAnswerAdvCap($questionsContainer, {'adv-cap-2-2':'show'});
			    	}else{
			    		setAnswerAdvCap($questionsContainer, {'adv-cap-2-2':'hide'});
			    	}
			    	break;
	    	}
	    	if (typeof currentValue !== "undefined"){
        		$singleContainer.removeClass("incorrect-area");
        	}
	    });
	    $(".client-entity-list").find('.dollarAmount').first().select();
		initializeCheckBoxes();
		initializeDateSelectors();
		resizeContentHeight();
		prepareToggleButton();
	}

	for ( var j in selectedProducts ) {		
		createFundRow(selectedProducts[j]);
	}

	onPopulationComplete();

	function createFundRow(product) {
		var row = $("<tr class='fund-row' data-productId='" + product.fundId + "' data-adminTypeId='" + product.admintypeid + "' />");
		var productName = $("<td class='productName' data-id="+product.isCAISFund +">" + product.legalName + "</td>");


		//
		var dollarAmount = $("<td><input type='text' class='dollarAmount textInput currency' value='100,000.00' id='dollarAmount_" + client.id + "_" + product.fundId + "'/></td>");
		var $classSelect = $("<select style='width:80px;' class='share-class' data-role='dropdownlist' id='class_" + client.id + "_" + j + "'/>");
		for ( var k in product.shareClass ) {
			var newClass = $("<option/>");
			newClass.append(product.shareClass[k]);
			newClass.appendTo($classSelect);
		}
		var $placementFee;
		var $investmentDateMonth = $("<select style='width:113px;margin-right:12px;' name='month' class='month' data-role='dropdownlist' data-change='validateInvestmentDate' id='investmentDateMonth_" + client.id + "_" + j + "'/>");
		var $investmentDateYear = $("<select style='width:70px;' name='year' class='year' data-role='dropdownlist' data-change='validateInvestmentDate' id='investmentDateYear_" + client.id + "_" + j + "'/>");
		var advisorList = entityDetail[1].advisorteamList;
		var $advisorSelect = $("<select style='width:180px;' class='advisor' data-role='dropdownlist' data-required='required' id='advisor_" + client.id + "_" + product.fundId + "'/>");
		for ( var m in advisorList ) {
			if(!advisorList[m].homeOfficeAffiliationClientId) advisorList[m].homeOfficeAffiliationClientId = -1;
			var $newAdvisor = $("<option value='{\"userId\":"+advisorList[m].userId+",\"affiliation\":"+advisorList[m].homeOfficeAffiliationClientId+"}' >"+advisorList[m].name+"</option>");
			$newAdvisor.appendTo($advisorSelect);
		}
		
		// only show placement fee of 0% for non-cais funds
		if (product.isPlacementFeeApplicable) {
			$placementFee = $("<select style='width:93px;' data-fund='"+product.fundId+"' class='placement populate' id='placementFee" + client.id + "_" + j + "'/>");
		}else{
			$placementFee = $("<select style='width:93px;' data-fund='"+product.fundId+"' data-role='dropdownlist' class='placement' id='placementFee" + client.id + "_" + j + "'><option value='0%'>0%</option></select>");
		}
		var todayDate = new Date(),
			currentMonth = todayDate.getMonth(),
			currentYear = todayDate.getFullYear(),
			selectedYear = 0;
		if(currentMonth === 11){
			currentMonth = 0;
			selectedYear = 1;

		}else{
			currentMonth++;
		}
		for (var n in months) {
			var selection = (currentMonth == n) ? " selected='selected'" : "",
				monthNumber = parseInt(n)+1,
				month = $("<option value='"+monthNumber+"'"+selection+">"+months[n]+"</option>");
			month.appendTo($investmentDateMonth);
		}
		for (var i=0; i<2; i++) {
			var yearCounter = currentYear+i,
				selection = (selectedYear == i) ? " selected='selected'" : "",
				year = $("<option value='"+yearCounter+"'"+selection+">"+yearCounter+"</option>");
			year.appendTo($investmentDateYear);
		}
		var classSelectCell = $("<td class='center-me'/>");
		classSelectCell.append($classSelect);
		var placementFeeCell = $("<td class='center-me'/>");
		placementFeeCell.append($placementFee);
		var advisorSelectCell = $("<td class='center-me'/>");
		advisorSelectCell.append($advisorSelect);
		var investmentDateSelectCell = $("<td class='center-me'/>");
		investmentDateSelectCell.append($investmentDateMonth);
		investmentDateSelectCell.append($investmentDateYear);
		row.append(productName);
		row.append(dollarAmount);
		row.append(classSelectCell);
		row.append(placementFeeCell);
		row.append(investmentDateSelectCell);
		row.append(advisorSelectCell);
		row.appendTo(tableBody);
		var advCapacityQuestions = getAdvisorCapacityQuestions(client, product);
		advCapacityQuestions.appendTo(tableBody);
	}		
}

$(document).bind("submitDetails", submitDetails);
function getAdvisorCapacityQuestions(client, product){
	var advCapacityQuestions = [];
	advCapacityQuestions.push('<tr class="advisor-capacity-questions"><td colspan="6">');
	advCapacityQuestions.push('<div class="sub-section">');
	advCapacityQuestions.push('<div class="adv-cap-question adv-cap-1">');
	advCapacityQuestions.push('<label class="question-label">In what capacity are you acting with respect to this investment and in what type of account will it be held?</label>');
	advCapacityQuestions.push('<select class="capacity micro-dropdown" style="width:295px;font-size:12px">');
	advCapacityQuestions.push('<option value="0">Select an investment capacity...</option>');
	advCapacityQuestions.push('<option value="1">Broker Dealer – Broker Dealer Account</option>');
	advCapacityQuestions.push('<option value="2">Broker Dealer / RIA Hybrid – Advisory Account</option>');
	advCapacityQuestions.push('<option value="3">Registered Investment Advisor – Advisory Account</option>');
	advCapacityQuestions.push('<option value="4">Foreign Financial Services Intermediary</option>');
	advCapacityQuestions.push('<option value="5">Investor</option>');
	advCapacityQuestions.push('</select>');
	advCapacityQuestions.push('</div>');
	advCapacityQuestions.push('<div class="adv-cap-question adv-cap-1-1"><label class="question-label">Are you acting on a...</label><label class="radio-label"><input type="radio" name="isActingOnDiscretionaryBasis_'+client.id + '_' + product.fundId+'" value="false">Non-discretionary basis</label><label class="radio-label"><input type="radio" name="isActingOnDiscretionaryBasis_'+client.id + '_' + product.fundId+'" value="true">Discretionary basis with investment authority</label></div>');
	advCapacityQuestions.push('<div style="overflow:hidden">');
	advCapacityQuestions.push('<div class="adv-cap-question adv-cap-2 security-custodian-area"><label class="question-label multiline">Where will this security be custodied?</label>');
	advCapacityQuestions.push('<select class="custodian  micro-dropdown first-line-indent" style="width:295px;"></select></div>');
	advCapacityQuestions.push('<div class="adv-cap-question adv-cap-2-1"><label class="question-label multiline radio-description">Is this the investor’s first alternative investment transaction affiliated with Fidelity?</label><label class="radio-label first-line-indent"><input type="radio" name="isInvestorsFirstAltInvestmentWithFidelity_'+client.id + '_' + product.fundId+'" value="true">Yes</label><label class="radio-label"><input type="radio" name="isInvestorsFirstAltInvestmentWithFidelity_'+client.id + '_' + product.fundId+'" value="false">No</label></div>');
	advCapacityQuestions.push('</div>');
	advCapacityQuestions.push('<div class="adv-cap-question adv-cap-2-2"><label class="question-label multiline radio-description">Has the investor filed with Fidelity their “Alternative Investments Addendum and Custodian Agreement”?</label><label class="radio-label first-line-indent"><input type="radio" name="hasInvestorFiledCustodianAgreement_'+client.id + '_' + product.fundId+'" value="true">Yes</label><label class="radio-label"><input type="radio" name="hasInvestorFiledCustodianAgreement_'+client.id + '_' + product.fundId+'" value="false">No</label></div>');
	advCapacityQuestions.push('</div>');
	advCapacityQuestions.push('</td></tr>');
	return $(advCapacityQuestions.join(''));
}
function submitDetails() {
	var $formToValidate = $(".client-entity");
	if (IndividualValidatorFactory.validate($formToValidate) && validateCapacityAnswers($formToValidate)) {
		var opportunityList = [];
		$(".client-entity-list li.client-entity").each(function() {
			var clientId = $(this).attr("data-clientid");
			var clientName = $(this).find(".client-name").text();
			var firmName = $(this).find(".client-firmName").text();
			var clientResults = jQuery.map(selectedClients, function(value) {
				if(value.id == clientId) {
					return value;
				}
				return null;
			});
			var clientEntity = clientResults[0];
			var emailObjList = [];
			
			$(this).find("tbody tr.fund-row").each(function() {
				var $this = $(this),
					$capcityInfo = $this.next(),
					productId = $this.attr("data-productid"),
					adminTypeId = $this.attr("data-adminTypeId"),
					productName = $this.find(".productName").text(),
					isCAISFund = $this.find(".productName").attr("data-id"),
					productResults = jQuery.map(selectedProducts, function(value) {
						if(value.fundId.toString() == productId) {
							return value;
						}
						return null;
					}),
					investmentDateOrig = new Date($this.find("input.calendarInput").val()),
					month = $this.find('select.month').data("kendoDropDownList").value(),
					year = $this.find('select.year').data("kendoDropDownList").value(),
					investmentDateVar = year + "-" + month + "-" + 1,
					advisorInfo=JSON.parse($(this).find('select.advisor').data("kendoDropDownList").value()),
					userId=advisorInfo.userId,
					isActingOnDiscretionaryBasis=$capcityInfo.find('input[name=isActingOnDiscretionaryBasis_'+clientId+'_'+productId+']:checked').val(),
					isInvestorsFirstAltInvestmentWithFidelity=$capcityInfo.find('input[name=isInvestorsFirstAltInvestmentWithFidelity_'+clientId+'_'+productId+']:checked').val(),
					hasInvestorFiledCustodianAgreement=$capcityInfo.find('input[name=hasInvestorFiledCustodianAgreement_'+clientId+'_'+productId+']:checked').val(),
					opportunity = {
						productId:productId,
						adminTypeId:adminTypeId,
						investmentEntityId:clientId,
						userId:userId,
						productTypeId:productResults[0].fundType,
						amount:$this.find("input.dollarAmount").asNumber(),
						shareClass:$this.find('select.share-class').data("kendoDropDownList").value(),
						placementFee:$this.find('select.placement').data("kendoDropDownList").value(),
						investmentDate:investmentDateVar,
						isCAISFund:isCAISFund,
						advisorCapacityInfo:{
							capacity:$capcityInfo.find('select.capacity').data("kendoDropDownList").value(),
							custodian:$capcityInfo.find('select.custodian').data("kendoDropDownList").value()
						}
					};
				if (typeof isActingOnDiscretionaryBasis !== "undefined")opportunity.advisorCapacityInfo.isActingOnDiscretionaryBasis = isActingOnDiscretionaryBasis;
				if (typeof isInvestorsFirstAltInvestmentWithFidelity !== "undefined")opportunity.advisorCapacityInfo.isInvestorsFirstAltInvestmentWithFidelity = isInvestorsFirstAltInvestmentWithFidelity;
				if (typeof hasInvestorFiledCustodianAgreement !== "undefined")opportunity.advisorCapacityInfo.hasInvestorFiledCustodianAgreement = hasInvestorFiledCustodianAgreement;
				opportunityList.push(opportunity);

			});
		});
		showGeneratingDialog();
		
		$.postJSON("/enterTransaction",JSON.stringify(opportunityList),function(response) {
		    $(".page-dialog.docs-generating").remove();

		    if (response.status == "success") {
		        var options = {};
		        options.idList = [];
		        options.errorMessages = [];
		        for (var i in response.msg) {
		            var responseObject = response.msg[i];
		            if (responseObject.success) {
		                // we have a successful transaction creation
	                    // add this caisID to the idList
	                    var message = response.msg[i].transaction.caisId;
	                    if (responseObject.responseMessage) message = message + '<br/><strong style="padding: 0 50px; display:block;">' + responseObject.responseMessage + '</strong>';
		                options.idList.push(message);
		            } else if (responseObject.success == false) {
		                // we have an unsuccessful transaction creation
		                options.errorMessages.push(response.msg[i].responseMessage);
		            }
		        }
	            // bind the handler for when the dialog is loaded
		        $(document).bind("dialogs/transactionsGeneratedLoaded", function (e, options) {
		            $(document).off("dialogs/transactionsGeneratedLoaded");
		            var transactions = [];
		            for (var j in options.idList) {
		                var id = $("<div/>");
		                id.append(options.idList[j]);
		                id.appendTo($(".transactions"));
		                transactions.push(options.idList[j]);

		                // unhide the message
		                $(".transactions-generated .alert-message").show();
		            }
		            for (var k in options.errorMessages) {
		                var message = $("<div/>");
		                message.append(options.errorMessages[k]);
		                message.appendTo($(".errors"));

		                //unhide the errors div
		                $(".transactions-generated .errors").show();
		            }
		            $(".page-dialog.transactions-generated").height($("#wrapper").height() + 70);
		            localStorage["transactions"] = JSON.stringify(transactions);
		            $(".confirm").click(function () {
		                if (options.idList.length > 0) {
		                    window.location.href = "/investment-pipeline";
		                } else {
		                    $(".page-dialog.transactions-generated").remove();
		                    $(".dialog-wrapper").remove();
		                }
		            });
		        });

	            // trigger loading the dialog
		        var dialog = new Dialog("transactionsGenerated", options),
		        	quickInvestClicked = localStorage["lastQuickInvestClicked"];
		        if(quickInvestClicked){
		        	ga('send', 'event', 'quick-invest', 'end', quickInvestClicked);
		        	localStorage.removeItem("lastQuickInvestClicked");
		        }
		        
		    } else {
		        $(document).trigger("dialogClose");
		        if (response.errorType == "form")
		            ValidatorFactory.processServerValidationError(response.msg, "#subscription-data");
		        else
		            ValidatorFactory.processServerError(response.msg);
		    }
		});
	}
}

// @Deprecated
function sendSubscriptionEmail(emailObjList) {
	var messageObj = {};
	var emailBody = "<p>";
	
	for(var i=0; i<emailObjList.length; i++) {
		if(emailObjList[i].hasExistingInvestment) {
			emailBody += "Additional Subscription created by"+ emailObjList[i].firmName+ " - "  + emailObjList[i].advisorName + ": " + emailObjList[i].clientName+" with the following details:<br><br>" +
			"Product:&nbsp;"+emailObjList[i].productName+"<br>" +
			"Investor:&nbsp;"+emailObjList[i].clientName+"<br>" +
			"Amount:&nbsp;"+emailObjList[i].amount+"<br>" +
			"Share Class:&nbsp;"+emailObjList[i].shareClass+"<br>" +
			"Type:&nbsp;Additional&nbsp;<br>" +
			"Placement Fee:&nbsp;"+emailObjList[i].placementFee+"<br>" +
			"Investment Date:&nbsp;"+emailObjList[i].investmentDate+"<br><br>";
		}
		else{
			emailBody += "New Subscription created by" + emailObjList[i].firmName+ " - "  + emailObjList[i].advisorName + ": " + emailObjList[i].clientName+" with the following details:<br><br>" +
			"Product:&nbsp;"+emailObjList[i].productName+"<br>" +
			"Investor:&nbsp;" + emailObjList[i].clientName + "<br>" +
			"Amount:&nbsp;"+emailObjList[i].amount+"<br>" +
			"Share Class:&nbsp;"+emailObjList[i].shareClass+"<br>" +
			"Type:&nbsp;New&nbsp;<br>" +
			"Placement Fee:&nbsp;"+emailObjList[i].placementFee+"<br>" +
			"Investment Date:&nbsp;"+emailObjList[i].investmentDate+"<br><br>";
		}
	}
	
	emailBody += "</p>";
	
	messageObj.internetAddressesToList = "CAIS-XNotifications@caisgroup.com";
	messageObj.internetAddressesCCList = "";
	messageObj.internetAddressesFromList = "cais-it@caisgroup.com";
	
	if(emailObjList[0].hasExistingInvestment){
		messageObj.subject = "Additional Subscription created by" + emailObjList[0].firmName+ " - "  + emailObjList[0].advisorName + ": " + emailObjList[0].clientName + " - " + emailObjList[0].investmentDate;
	}else{
		messageObj.subject = "New Subscription created by" + emailObjList[0].firmName+ " - "  + emailObjList[0].advisorName + ": " + emailObjList[0].clientName  + " - "+emailObjList[0].investmentDate;
	}
	messageObj.body = emailBody;
	messageObj.clientId = 0;
	var subDataString = JSON.stringify(messageObj);
	Server.sendMailWithAttachment( subDataString, function() {				
	});
}

function showGeneratingDialog() {
    var dialog = new Dialog("docs-generating", null);
}

function resizeContentHeight() {
	var sectionHeight = $("#fund-details .main-column").height();
	$("#fund-details .main-column-content").css({ "height" : sectionHeight - 58 });
}

function resizeDetailScroller() {
    var scroller = $("#trade-details .main-column-content").data("jsp");
    if(scroller) {
    	scroller.reinitialise();
    }
}

function initializeCheckBoxes() {
	$(".label_check input").change(function() {
		toggleCheckBox($(this));
    });
}

function initializeDateSelectors() {
    $(".calendarInput").kendoDatePicker();
}

function prepareToggleButton() {
	$(".drop-down-arrow").click(function ()	{
		var header = $(this).parent();
		header.next().toggle();
		header.toggleClass("minimized");
	});
}
function setMainContentHeight(){
    var $mainPanel = $("#trade-details .main-column-content"),
    	offset = $mainPanel.offset();
   	if(offset){
        var mainPanelPosY = offset.top,
	        viewportHeight = $(window).height();
	    $mainPanel.height(viewportHeight-mainPanelPosY -33 -40);
	}
}

function createSplitter() {	
	var totalHeight = $("#trade-details .main-column").height();
	setMainContentHeight();
}

function onSplitterResize() {
	setMainContentHeight();
}

function getMonthIndex(month) {
	switch(month) {
		case "January": return 1; break;
		case "February": return 2; break;
		case "March": return 3; break;
		case "April": return 4; break;
		case "May": return 5; break;
		case "June": return 6; break;
		case "July": return 7; break;
		case "August": return 8; break;
		case "September": return 9; break;
		case "October": return 10; break;
		case "November": return 11; break;
		case "December": return 12; break;
	}
}

function getMonthName(index) {
	switch (index) {
		case 1: return "January";
		case 2: return "February";
		case 3: return "March";
		case 4: return "April";
		case 5: return "May";
		case 6: return "June";
		case 7: return "July";
		case 8: return "August";
		case 9: return "September";
		case 10: return "October";
		case 11: return "November";
		case 12: return "December";
	}
}
}).call();