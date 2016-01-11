(function() {	

jQuery.expr[':'].Contains = function (a, i, m)
{
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
var stepProgress;
var addDialog;
var wizardType;
var firmFlag = false;
var emailFlag = false;
var advisorFlag = false;
var investorGroupFlag = false;
var investorMemberFlag = false;
var selectedId;
var clientHierarchyData;
var selectedProducts = null;
var selectedMembers = [];
var advisorTeamOptionId;
var selectedFirmPermissionGroup;
var products;

$(document).bind("dialogs/add-cais-userLoaded", function (event, options) {
	Server.constructHierarchy(null, function(response) {
		clientHierarchyData = response;
	    addDialog = $(".page-dialog.wizard");
	    stepProgress = 1;
	    wizardType = "CAIS";
	    initializeCaisWizard();
	    createPermissionsList(addDialog);
	});
});


function initializeCaisWizard() {
    initializeRequiredFieldsBinding();
    initializeCaisWizardStepButtons();
    createAvailableProductsList();
    createAvailableFirmsList();
    initializeProductFilters();
    initializeAddRemoveAll();
    initializeFirmGroupFilters();
    //createUserPermissionsList();
    
    addDialog.find(".label_check").click(function() {
        $(this).toggleClass("check-on");
    });

    var notifyMenu = MenuList(addDialog.find(".cais-user-role"), null, 125); 
    initializeUserValidation();
}

function initializeUserValidation() {
	$("input#firmName").change(function() { 
		Server.doesFirmNameExists( {firmName:$("input#firmName").val()}, function(response) {
			var ret = true;
			firmFlag = response;
			if (firmFlag == "true") {
				$(".active .wizard-action-description").text("The Firm Name you entered already exists. Please enter a different Firm Name.");
				$("label[data-field=companyName]").addClass("field-alert");
				ret = false;
			 }else {
				 $("label[data-field=companyName]").removeClass("field-alert");
			 		if (emailFlag == "true") {
			 			$(".active .wizard-action-description").text("The Email Address you entered already exists. Please enter a different Email Address.");
						 $("label[data-field=clientName]").addClass("field-alert");
						 ret = false;
			 		} else if (advisorFlag == "true") {
						 $(".active .wizard-action-description").text("The Advisor Team Name you entered already exists for this firm. Please enter a different Advisor Team Name.");
						 $("label[data-field=advisorTeam]").addClass("field-alert");
						 ret = false;
					} else {
						 $(".active .wizard-action-description").text("Enter the required fields initiate adding a user.");
						 $("label[data-field=email]").removeClass("field-alert");
						 $("label[data-field=advisorTeam]").removeClass("field-alert");
						// ret = false;
					}
			 }
			
  		 	 return ret;
	 	});
	});
	
	$("input#emailAddress").change(function() { 
		 Server.doesEmailAddressExists( {emailAddress:$("input#emailAddress").val()}, function(response) {
	 		 var ret = true;
			 emailFlag = response;
			 if (emailFlag == "true") {
				 $(".active .wizard-action-description").text("The Email Address you entered already exists. Please enter a different Email Address.");
				 $("label[data-field=email]").addClass("field-alert");
				 ret = false;
			 } else {
				 $("label[data-field=email]").removeClass("field-alert");
				 if (firmFlag == "true") {
	  		 			$(".active .wizard-action-description").text("The Firm Name you entered already exists. Please enter a different Firm Name.");
						 $("label[data-field=companyName]").addClass("field-alert");
	  		 			ret = false;
	  		 		} else if (advisorFlag == "true") {
						 $(".active .wizard-action-description").text("The Advisor Team Name you entered already exists for this firm. Please enter a different Advisor Team Name.");
						 $("label[data-field=advisorTeam]").addClass("field-alert");
						 ret = false;
					} else {
						 $(".active .wizard-action-description").text("Enter the required fields initiate adding a user.");
						 $("label[data-field=clientName]").removeClass("field-alert");
						 $("label[data-field=advisorTeam]").removeClass("field-alert");
						// ret = false;
					}
			 }
			 
			 return ret;			 
		});
	});
	
	$("input#advisorTeamName").change(function() { 
	  	 Server.doesAdvisorTeamNameExists( {advisorTeamName:$("input#advisorTeamName").val(), clientId:selectedId}, function(response) {
			 advisorFlag = response;
			 
			 if (advisorFlag == "true") {
				 $(".active .wizard-action-description").text("The Advisor Team Name you entered already exists for this firm. Please enter a different Advisor Team Name.");
				 $("label[data-field=advisorTeam]").addClass("field-alert");
				 return;
			 } else {
				 $("label[data-field=advisorTeam]").removeClass("field-alert");
				 if (firmFlag == "true") {
	  		 			$(".active .wizard-action-description").text("The Firm Name you entered already exists. Please enter a different Firm Name.");
						 $("label[data-field=companyName]").addClass("field-alert");
	  		 			return;
	  		 		} else if(emailFlag == "true") {
						 $(".active .wizard-action-description").text("The Email Address you entered already exists. Please enter a different Email Address.");
						 $("label[data-field=email]").addClass("field-alert");
						 return;
					} else {
						 $(".active .wizard-action-description").text("Enter the required fields initiate adding a user.");
						 $("label[data-field=clientName]").removeClass("field-alert");
						 $("label[data-field=email]").removeClass("field-alert");
						 return;
					}
			 }
	  		 
	 	 });
	});
}

function createPermissionsList(addDialog) {
	Server.getPermissions( {}, function(response) {
		var permList = response;
		for(var k in permList)
	    {
			var permId = permList[k].permissionId;
			var permStr = getPermissionStrForId(permId);
            if(permId !== 12 && permId !== 13){
    			var label = "<label data-id="+permId+" class='label_check'>"+permStr+"</label>";
    			$(".wizard-content-area.permList").append(label);
            }
	    }
	    addDialog.find(".permList .label_check").click(function() {
	        $(this).toggleClass("check-on");
	    });		
	});
}

function getPermissionStrForId(id){
	if(id == 1)
		return "Access Funds";
	else if(id == 2)
		return "Generate Recommendataions";
	else if(id == 3)
		return "View Pipeline";
	else if(id == 4)
		return "View/ManageTransaction Details";
	else if(id == 5)
		return "View Investor Details";
	else if(id == 6)
		return "Add Investors";
	else if(id == 7)
		return "Add Users";
	else if(id == 8)
		return "Allow New User Setup";
	else if(id == 9)
		return "View CAIS Connect";
	else if(id == 10)
		return "View CAISAccounts";
	else if(id == 11)
		return "View Rebates";
    else if(id == 12)
        return "Commissions Model";
    else if(id == 13)
        return "Performance Management";
}

function addProductToSelectedList(e) {
    $(e.currentTarget).appendTo(".selected-products .selection-list");
    $(".selected-products .selection-list li").tsort();

    addDialog.find(".selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}
function initializeRequiredFieldsBinding() {
    addDialog.find("input[type=text]").each(function() {
        $(this).blur(function() {
            addDialog.find("input[data-field=" + $(this).attr("data-field") + "]").val($(this).val());
        });
    });
}

function initializeCaisWizardStepButtons() {
    $(".user-details .next").click(function() {
    	if(emailFlag == "true"){
    		$(".active .wizard-action-description").text("The Email Address you entered already exists. Please enter a different Email Address.");
			$("label[data-field=email]").addClass("field-alert");
			return;
    	} else if (IndividualValidatorFactory.validate($(".user-details"))) {    		
            $(".user-details").removeClass("active");
            $(".product-access").addClass("active");
            $(".wizard-navigation li.active").removeClass("active");
            $(".wizard-navigation li[data-section=2]").addClass("active");

            if (stepProgress < 2) {
                stepProgress = 2;
            }

            addDialog.find(".selection-section-list").jScrollPane();
        }
    });

    $(".product-access .prev").click(function() {
        $(".product-access").removeClass("active");
        $(".user-details").addClass("active");
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation li[data-section=1]").addClass("active");
    });

    $(".product-access .next").click(function() {
        if ($(".selected-products .selection-list li").length >= 1) {
            $(".product-access").removeClass("active");
            $(".firm-access").addClass("active");
            $(".wizard-navigation li.active").removeClass("active");
            $(".wizard-navigation li[data-section=3]").addClass("active");

            if (stepProgress < 3) {
                stepProgress = 3;
            }

            addDialog.find(".selection-section-list").each(function() {            	
                var scroller = $(this).data("jsp");
                scroller.reinitialise();
            });
            if (!selectedProducts) {
                createProductPermissionList("create");
            } else {
                createProductPermissionList("update");
            }
        } else {
            $(".product-access .wizard-action-description").text("Please select at least one product before continuing.");
        }
    });

    $(".firm-access .prev").click(function() {
        $(".firm-access").removeClass("active");
        $(".product-access").addClass("active");
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation li[data-section=2]").addClass("active");
    });

    $(".firm-access .next").click(function() {
        if ($(".selected-groups .selection-list li").length >= 1 || $(".firm-access .next").text() == "SKIP") {
            $(".firm-access").removeClass("active");
            $(".functions").addClass("active");
            $(".wizard-navigation li.active").removeClass("active");
            $(".wizard-navigation li[data-section=4]").addClass("active");

            if (stepProgress < 4) {
                stepProgress = 4;
            }
        }
    });

    $(".functions .prev").click(function() {
        $(".functions").removeClass("active");
        $(".firm-access").addClass("active");
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation li[data-section=3]").addClass("active");
    });

    $(".functions .done").click(function(e) {
        finalizeWizard();
        $(document).trigger("dialogClose");
        $(document).trigger("dialogClose/add-cais-user", e.currentTarget);

    });
}

function createAvailableProductsList() {
	Server.getAllProducts( {}, function(response) {
		products = response;
		populateAvailableProductsList();
	});
}

function createAvailableFirmsList() {
    var list = $("<ul class='selection-list'/>");
    for (var i in clientHierarchyData) {
        var li = $("<li/>");
        //doing the same thing here as we did with products above
        li.data(clientHierarchyData[i]);
        li.text(clientHierarchyData[i].clientName);
        li.click(populateGroupList);
        li.appendTo(list);
    }

    list.appendTo(".add-cais .available-firms .selection-section-list");
    $(".available-firms .selection-list li").tsort();
    $(".add-cais .selected-groups").on("click", "li", removeGroupFromSelectedList);
}

function removeGroupFromSelectedList(e) {
    $(this).remove();
}

function populateAvailableProductsList() {
	var list = $(".available-products .selection-list");
    for (var i in products) {
        var li = $("<li/>");
        //Storing the actual product data using the jQuery .data(), this way when we go
        //to create the wealth advisor we have a reference to the actual product object
        //better than just the name imo
        li.data(products[i]);
        li.text(products[i].legalName);
        li.appendTo(list);
    }    

    $(".available-products .selection-list").on("click", "li", addProductToSelectedList);
    $(".selected-products .selection-list").on("click", "li", removeProductFromSelectedList);
}
function initializeProductFilters() {
    $(".available-products .search-input").keyup(function() {
        var list = $(".available-products .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".selected-products .search-input").keyup(function() {
        var list = $(".selected-products .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });
}

function removeProductFromSelectedList(e) {    
    $(e.currentTarget).appendTo(".available-products .selection-list");
    $(".available-products .selection-list li").tsort();

    addDialog.find(".selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });

    if (selectedProducts) {
        var index = $.inArray($(e.currentTarget).data(), selectedProducts)
        selectedProducts.splice(index, 1);
    }
}

function initializeProductFilters() {
    $(".available-products .search-input").keyup(function() {
        var list = $(".available-products .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".selected-products .search-input").keyup(function() {
        var list = $(".selected-products .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });
}

function initializeAddRemoveAll() {
    addDialog.find(".product-access .select-all").click(function() {
        addAllProducts();
    });

    addDialog.find(".product-access .remove-all").click(function() {
        removeAllProducts();
    });

    addDialog.find(".investor-access .select-all").click(function() {
        addAllInvestors();
    });

    addDialog.find(".investor-access .remove-all").click(function() {
        removeAllInvestors();
    });

    addDialog.find(".firm-access .select-all").click(function() {
        addAllGroups();
    });

    addDialog.find(".firm-access .remove-all").click(function() {
        removeAllGroups();
    });
}

function initializeFirmGroupFilters() {
    $(".available-firms .search-input").keyup(function() {
        var list = $(".available-firms .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".available-groups .search-input").keyup(function() {
        var list = $(".available-groups .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".selected-groups .search-input").keyup(function() {
        var list = $(".selected-groups .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });
}

function createProductPermissionList(action) {
    switch(action) {
        case "create":
            selectedProducts = [];
            $(".selected-products .selection-list li").each(function() {
                var product = $(this).data();
                if(product.overview == undefined) {
                	product.overview = true;               
 	                product.performances = true;
 	                product.mercer = true;
 	                product.document = true;
 	                selectedProducts.push(product);
                } else {
	                selectedProducts.push(product);
                }
            });

            var dataSource = new kendo.data.DataSource({
                data: selectedProducts,
                autosync: true,
                schema: {
                    model: {
                        id: "productId",
                        fields: {
                            legalName: { editable: false },
                            overview: { editable: true, type: "boolean" },
                            performances: { editable: true, type: "boolean" },
                            mercer: { editable: true, type: "boolean" },
                            document: { editable: true, type: "boolean" }
                        }
                    }
                }
            });

            $(".product-permissions .grid-wrapper").kendoGrid({
                dataSource: dataSource,
                width: 500,
                columns: [
                    { field: "legalName", title: "Product Name" },
                    { field: "overview", title: "Overview", width: 80 },
                    { field: "performances", title: "Performances", width: 100 },
                    { field: "mercer", title: "Mercer", width: 80 },
                    { field: "document", title: "Document", width: 80 }
                ],
                editable: true
            });
            
            $(".product-permissions .grid-wrapper").height($(".product-permissions .grid-wrapper").height() + 23);
            break;
        case "update":
            $(".selected-products .selection-list li").each(function() {
                var product = $(this).data();

                if ($.inArray(product, selectedProducts) == -1) {
                    product.overview = true;
                    product.performances = true;
                    product.mercer = true;
                    product.document = true;

                    selectedProducts.push($(this).data());
                }
            });
            var ds = $(".product-permissions .grid-wrapper").data("kendoGrid").dataSource;
            ds.read(selectedProducts);
            //grid.refresh();
            break;
        default:
            break;
    }
}

function addAllGroups() {
    $(".available-groups .selection-list li").each(function()
    {
        $(this).appendTo(".selected-groups .selection-list");
        $(".selected-groups .selection-list li").tsort();
    });

    addDialog.find(".firm-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });

    addDialog.find(".firm-access .next span").text("NEXT");
}

function populateGroupList(e) {
    $("li.selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");
    $(".add-cais .available-groups .selection-section-list").remove();
    var list = $("<ul class='selection-list'/>");
    var listWrapper = $("<div class='selection-section-list'/>");
    var groupList = $(e.currentTarget).data().teams;
    var clientId= $(e.currentTarget).data().clientId;
    var isSelected;

    for (var i in groupList) {
        isSelected = false;
        $(".add-cais .selected-groups .selection-section-list .selection-list li").each(function() {
            if ($(this).text().indexOf(groupList[i].teamName) != -1 ) {
                isSelected = true;
                return;
            }
        });

        if (!isSelected) {
            var li = $("<li/>");
            groupList[i].clientId = clientId;
            li.data(groupList[i]);
          
            li.text(groupList[i].teamName);
            li.click(addGroupToSelectedList);
            li.appendTo(list);
        }
    }

    list.appendTo(listWrapper);
    listWrapper.appendTo(".add-cais .available-groups");
    $(".available-groups .selection-list li").tsort();

    addDialog.find(".firm-access .available-groups .selection-section-list").jScrollPane();
}

function finalizeWizard() {
	var caisUser = {};
	var userDetails = {};
	var clientIds = [];
	
	addDialog.find("input[type=text][data-field]").each(function() {
		userDetails[$(this).attr("data-field")] = $(this).val();
	});
	var myDataObject = $(".cais-user-role .selected div").data();
	//userDetails.role = $(this.attr("data-role"))
	caisUser.userDetails = userDetails;
	caisUser.clients = [];
	 caisUser.advisorTeams = [];
	    addDialog.find(".firm-access .selected-groups .selection-list li").each(function() {
	        var group = $(this).data();
	        caisUser.clients.push(group.clientId);
	        caisUser.advisorTeams.push(group.advisorTeamId);
	    });
	
	 
	for ( var i in caisUser.clients ) {
		var clientId = caisUser.clients[i];
		if ( $.inArray( clientId, clientIds ) === -1 ) {
			clientIds.push(clientId);
		}
	}
    
	caisUser.clients = clientIds;
	
	caisUser.userDetails = userDetails;
	caisUser.productAccess = selectedProducts;
	caisUser.permissionStrArr = [];
	addDialog.find(".functions label.check-on").each(function() {
		caisUser.permissionStrArr.push($(this).attr("data-id"));
	});
	
	var newCAISUser =  JSON.stringify(caisUser);
 	$(document).trigger("createHierarchyItemStart");
    Server.submitNewCAISUser( newCAISUser, function(response) {
    	$(document).trigger("loadCaisUserList");
    });
}

}).call();