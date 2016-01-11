var selectedProducts = [];
var selectedClients = [];
var isCAIS;
var clientsActive = false;
var detailsActive = false;
var productsActive = false;
(function(){

$(document).ready(function() {
	loadViews();	
	Server.getIsCAISEmployee( null, function(response) {
		isCAIS = response;
	});
	
	initializeWorkflow();
});

$(window).resize(function () {
    $(document).trigger("resizeProductsSplitter");
});
    
var chartColors = {
		bar: [ "#74a1ab" ],
		pie: [ "#503c63", "#6f6aa5", "#5f4775", "#896aa5", "#6a98a5"]
};

function loadViews() {
	// using jquery.ajax api load the partial view.
	
	$("<div>").load("resources/views/cais-alternatives/products.html?" + caisVersion, function(response){
	    $(".workspace").append(response);
	    $(document).trigger("productsLoaded");
	});
	
	$("<div>").load("resources/views/cais-alternatives/clients.html?" + caisVersion, function(response){
	    $(".workspace").append(response);
	    $(document).trigger("clientsLoaded");
	});
	
	$("<div>").load("resources/views/cais-alternatives/details.html?" + caisVersion, function(response){
	    $(".workspace").append(response);
	    $(document).trigger("fundDetailsLoaded");
	});
}

function initializeWorkflow() {
    var searchParameter = getQueryVariable('q');
    if (!searchParameter) {

        $(document).bind("productsLoaded", function () {
            toProducts();
        });

        $("#select-clients").click(function () {
            if (clientsActive)
                toClients();
        });

        $("#select-products").click(function () {
            toProducts();
        });

        $("#enter-details").click(function () {
            if (detailsActive)
                toDetails();
        });

        $(document).bind("initializeSubscribeButton", function () {
            $("#subscribe").click(function () {
                if (selectedProducts.length > 0) {
                    if (clientsActive) {
                        toClients();
                    } else {
                        $(document).trigger("clientHierarchyEvent");
                        clientsActive = true;
                        toClients();
                    }
                }
            });
        });

        $(document).bind("initializeSubmitButton", function () {
            $("#submit").click(function () {
                if (selectedClients.length > 0) {

                    // validate the entity selections here before proceeding
                    var taxErrorList = [];
                    var incompleteErrorList = [];
                    var allowProgression = true;
                    var incompleteError = false;
                    for (var i in selectedClients) {
                        var selectedClient = selectedClients[i];

                        if (selectedClient.validTaxStatus == false) {
                            allowProgression = false;
                            taxErrorList.push(selectedClient.taxStatusMessage);
                        }

                        if (selectedClient.isCompleted == false) {
                            if (!incompleteError) {
                                incompleteError = true;
                                incompleteErrorList.push("The following entities are not complete in our database. If you proceed with this transaction you may generate an incomplete subscription document");
                            }

                            incompleteErrorList.push(selectedClient.name);
                        }
                    }

                    var messages = $("<div/>");

                    for (var j in taxErrorList) {
                        var errorMessage = $("<div/>");
                        errorMessage.append(taxErrorList[j]);
                        messages.append(errorMessage);

                        if (j == taxErrorList.length - 1) {
                            messages.append("<div style='height: 20px;'/>");
                        }
                    }
                    
                    for (var k in incompleteErrorList) {
                        var errorMessage = $("<div/>");
                        errorMessage.append(incompleteErrorList[k]);
                        messages.append(errorMessage);
                    }

                    if (taxErrorList.length > 0 || incompleteErrorList.length > 0) {

                        var newAlert = new Alert(messages, "OK", "CANCEL");


                        if (incompleteErrorList.length > 0) {
                            $(document).bind("alertLoaded", function () {
                                $(document).off("alertLoaded");
                                $(".page-dialog.alert").css("max-width", 800).css("width", 800).height($(".page-dialog.alert .alert-message").height());
                                $(".page-dialog.alert ul").css("width", 800);
                            });
                        }
                        
                        $(document).bind("alertConfirm", function () {                            

                            if (allowProgression) {
                                toDetails();
                                detailsActive = true;
                                $(document).trigger("createEntityDetails");
                                $("#submit-details").show();
                            }
                        });
                    } else {
                        toDetails();
                        detailsActive = true;
                        $(document).trigger("createEntityDetails");
                        $("#submit-details").show();
                    }
                }
            });
        });
    } else {
        //var search = JSON.parse(localStorage["search"]);
        //localStorage.removeItem("search");
        clientsActive = true;

        $(document).bind("clientsLoaded", function () {
            toClients(searchParameter);
            $("#clients").find(".left-column").hide();
            $(".workspace-header").css("left", 0);
            $("#clients .main-column").css("left", 0);
            $(document).trigger("resizeClientSplitter");
        });

        $("#select-clients").click(function() {
            toClients();
        });

        $("#select-products").click(function () {
            if (productsActive)
                toProducts();
        });

        $("#enter-details").click(function () {
            if (detailsActive)
                toDetails();
        });

        $(document).bind("initializeSubscribeButton", function () {
            $("#subscribe").click(function () {
                if (selectedProducts.length > 0) {
                    detailsActive = true;
                    $("#select-products").addClass("progress");
                    $(document).trigger("createEntityDetails");
                    toDetails();
                }
            });
        });

        $(document).bind("initializeSubmitButton", function () {
            $("#submit").click(function () {
                if (selectedClients.length > 0) {
                    $("#select-clients").addClass("progress");
                    toProducts();
                    productsActive = true;
                    $("#submit-details").show();
                }
            });
        });
    }
}
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}
function toProducts() {
    $(".workspace-header").addClass("products");
    $(".workspace-header").removeClass("clients");
	$(".workspace-content").hide();
	$("#products").show();
	$("#subscribe").show();
	$("#analytics").show();
	$("#submit").hide();
	$("#submit-details").hide();
	$("#select-products").addClass("active");
	$("#select-clients").removeClass("active");
	$("#enter-details").removeClass("active");
	$(document).trigger("loadProductsPage");
	$(window).trigger("resize");
	$(window).trigger("resize"); // need a second resize to get the splitter and grid resizing to work properly after switching views back to products
}

function toClients(isSearch) {

    isSearch = isSearch != undefined ? isSearch : null;

    $(".workspace-header").addClass("clients");
    $(".workspace-header").removeClass("products");
	$(".workspace-content").hide();
	$("#clients").show();
	$("#subscribe").hide();
	$("#submit").show();
	$("#submit-details").hide();
	$("#select-clients").addClass("progress");
	$("#select-products").removeClass("active");
	$("#select-clients").addClass("active");
	$("#enter-details").removeClass("active");
	$(document).trigger("loadClientPage", isSearch);
	$(document).trigger("resizeTreeView");
	$(window).trigger("resize");
}

function toDetails() {
    $(".workspace-header").addClass("clients");
    $(".workspace-header").removeClass("products");
    $(".workspace-content").hide();
	$("#trade-details").show();

	if($(".client-entity").length > 0)
		$("#submit-details").show();
	
	$("#subscribe").hide();
	$("#submit").hide();
	$("#enter-details").addClass("progress");
	$("#select-products").removeClass("active");
	$("#select-clients").removeClass("active");
	$("#enter-details").addClass("active");
	$(window).trigger("resize");
}

$(document).bind("initializeSubmitDetailsButton", initializeSubmitDetailsButton);
function initializeSubmitDetailsButton() {
	$("#submit-details").click(function() {
		$(document).trigger("submitDetails");
	});
}
}).call();