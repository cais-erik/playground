(function () {
var user;
Server.caisUser.getLocalSessionInfo(function(response) {
    user = response;
    init();
});    

function init() {
    var hierarchy;
    var clientsListData;
    var clientHierarchy;
    var clients;
    var hierarchyLoaded = false;
    var clientPageLoaded = false;
    var clients_selectedColumns = 
    [
    	{ title: "", template: "<label class='nolabel_check'></label>", width: 35, sortable: false },
    	{ title: "Name", field: "name", template: "<div class='pointer client-info' data-entityId='${ id }'>${ name }</div>" },
    	{ title: "Account Number", field:"accountNumber"},
    	{ title: "SSN / TIN / EIN", field: "ssnTin" }
    ]

    $(document).bind("clientsLoaded", function () {
        loadSelectedClientsGrid();
        initClientInfoClickHandler();
        initializeScroller();
        initializeSelectedClientsDialog();
    });

    $(document).bind("clientHierarchyEvent", function () {
    	loadClientHierarchy();
    });

    $(window).bind("resize", function() {
        resizeScroller();
        resizeClientSplitter();
    });

    function loadClientHierarchy() {
    	
        var investmentEntities = {
            transport: {
                read: function (options) {
                    $.ajax({
                        url: "/getInvestmentEntitiesHierarchy",
                        dataType: "json",
                        data: {
                            investorId: options.data.investorId
                        },
                        success: function (result) {
                            options.success(result.msg);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "investmentEntityId",
                    hasChildren: false
                }
            }
        };


        var investors = {
            transport: {
                read: function (options) {
                    var item = dataSource.get(options.data.advisorUniqueID);
                    $.ajax({
                        url: "/getInvestorHierarchy",
                        dataType: "json",
                        data: {
                            userId: item.userId,
                            advisorTeamId: item.advisorTeamId
                        },
                        success: function (result) {
                            options.success(result.msg);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "investorId",
                    children: investmentEntities,
                    hasChildren: "hasChildren"
                }
            }
        };

        var advisors = {
            transport: {
                read: function (options) {
                    $.ajax({
                        url: "/getHierarchyWealthAdvisorList",
                        dataType: "json",
                        data: {
                            advisorTeamId: options.data.advisorTeamId
                        },
                        success: function (result) {
                            for (var i = 0; i < result.msg.length; i++) {
                                result.msg[i].advisorUniqueID = parseInt(result.msg[i].advisorTeamId.toString() + result.msg[i].userId.toString());
                            }
                            options.success(result.msg);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "advisorUniqueID",
                    children: investors,
                    hasChildren: "hasChildren"
                }
            }
        };

        var teams = {
            transport: {
                read: function (options) {
                    $.ajax({
                        url: "/getHierarchyAdvisorTeams",
                        dataType: "json",
                        data: {
                            id: options.data.clientId,
                            isCAISAccountHierarchy: "true"
                        },
                        success: function (result) {
                            options.success(result.msg);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: "advisorTeamId",
                    children: advisors,
                    hasChildren: "hasChildren"
                }
            }
        };

        var clients = {
            transport: {
                read: function (options) {
                    $.ajax({
                        url: "/constructCAISAccountHierarchy",
                        dataType: "json",
                        data: {
                            isCAISAccountHierarchy: "true"
                        },
                        success: function (result) {
                            options.success(result.msg);
                        }
                    });
                }
            },
            change: function (e) {
                var timer = setInterval(function () {

                    if (hierarchy.select().length == 0) {
                        $("#group-tree").find("li:first .k-icon").click();
                    }

                    resizeScroller();
                    clearTimeout(timer);
                }, 50);
            },
            schema: {
                model: {
                    id: "clientId",
                    children: teams,
                    hasChildren: "hasChildren"
                }
            }
        };

        var caisNode = {
            data: [{ name: "CAIS", type: "CAIS" }],
            schema: {
                model: {
                    children: clients,
                    hasChildren: true
                }
            },
            change: function (e) {
                var timer = setInterval(function () {

                    if (hierarchy.select().length == 0) {
                        $("#group-tree").find("li:first .k-icon").click();
                    }
                    clearTimeout(timer);
                }, 50);
            }
        };

        var dataSource;

        if (user.caisemployee) {
            dataSource = new kendo.data.HierarchicalDataSource(caisNode);
        } else {
            dataSource = new kendo.data.HierarchicalDataSource(clients);
        }

        var isTreeLoaded = false;

        hierarchy = $("#group-tree").kendoTreeView({
            template: function (e) {
                var item = e.item;
                if (item.type == "CAIS") {
                    return item.name;
                } else if (item.hasOwnProperty("clientId")) {
                    return item.clientName;
                } else if (item.hasOwnProperty("teamName")) {
                    return item.teamName;
                } else if (item.hasOwnProperty("userId")) {
                    return item.name;
                } else if (item.hasOwnProperty("investorId")) {
                    return item.investorName;
                } else if (item.hasOwnProperty("investmentEntityId")) {
                    if (!item.isCompleted) {
                        return "<div class='incomplete'>" + item.investmentEntityName + "</div>";
                    } else {
                        return item.investmentEntityName;
                    }
                }
            },
            dataSource: dataSource,
            collapse: onHierarchyCollapse,
            expand: onHierarchyExpand,
            select: onHierarchySelect
        }).data("kendoTreeView");
        
        $("#group-tree").on("click", "li", function (e) {

        });
    }

    function onHierarchySelect(e) {
        var selectedItem = hierarchy.dataItem(e.node);
        showClients(selectedItem);
        return false;
    }

    function onHierarchyExpand(e) {
        if (!hierarchy) {
            return;
        }
        var openedNode = hierarchy.dataItem(e.node);

        hierarchy.select(e.node);
        onHierarchySelect(e);
    }

    function onHierarchyCollapse(e) {
        if (!hierarchy) {
            return;
        }
        var openedNode = hierarchy.dataItem(e.node);

        hierarchy.select(e.node);
        onHierarchySelect(e);
    }

    $(document).bind("resizeTreeView", function() {
    	resizeTreeView();
    });

    function resizeTreeView() {
    	var timer = setTimeout(function() {
        	resizeScroller();    	
        }, 300);
    }

    function initializeScroller() {
        $("#group-tree-wrapper").jScrollPane();
    }

    function resizeScroller() {    
    	var scroller = $("#group-tree-wrapper").data("jsp");
    	if(scroller) {
    		scroller.reinitialise(); 
    	}
    } 

    function showClients(selectedItem) {
        var param = {};

        if (selectedItem.clientId) {
            param.type = "client";
            param.id = selectedItem.clientId;
        } else if (selectedItem.investmentEntityId) {
            param.type = "entity";
            param.id = selectedItem.investmentEntityId;
        } else if (selectedItem.userId) {
            param.type = "advisor";
            param.id = selectedItem.userId;
        } else if (selectedItem.advisorTeamId) {
            param.type = "team";
            param.id = selectedItem.advisorTeamId;
        } else if (selectedItem.investorId) {
            param.type = "investor";
            param.id = selectedItem.investorId;
        } else if (selectedItem.type == "CAIS") {
            param.type = "cais";
            param.id = 0;
        }
    	populateClientList(param);
    }

    function createSplitter() {	
    	var totalHeight = $("#clients .main-column").height();
        setMainContentHeight();


    	var remainder = $("#clients .main-column-content").height() % 4;	
    	var paneHeight = ( $("#clients .main-column-content").height() - remainder ) / 4;
    	
    	$("#clients .main-column-content").kendoSplitter({
            panes: [
                { collapsible: false, size: paneHeight * 3 + remainder + "px", min: "200px" },
                { collapsible: false, size: (paneHeight - 10) + "px", min: "50px" }
            ],
            orientation: "vertical",
            resize: onSplitterResize
    	});
    }

    $(document).bind("resizeClientSplitter", function() {
    	resizeClientSplitter();
    });

    function resizeClientSplitter() {
    	var splitter = $("#clients .main-column-content").data("kendoSplitter");
    	if(splitter) {
    		var bottomPaneHeight = splitter.options.panes[1].size.replace(/[^-\d\.]/g, '');
    		splitter.size(".grid-wrapper.available-clients", $("#clients .main-column-content").height() - bottomPaneHeight - 47 + "px");
    		
    		var gridHeight = $(".grid-wrapper.available-clients").height();		
    		$(".grid-wrapper.available-clients .k-grid-content").height(gridHeight - 60);
    	}
    }
    function setMainContentHeight(){
        var $mainPanel = $("#clients .main-column-content"),
        offset = $mainPanel.offset();
        if(offset){
            var mainPanelPosY = offset.top,
                viewportHeight = $(window).height();
            $mainPanel.height(viewportHeight-mainPanelPosY -33 -40);
        }
    }
    function onSplitterResize() {
    	setMainContentHeight();
        var splitter = $("#clients .main-column-content").data("kendoSplitter");
        
        var availableGrid = $("#clients .grid-wrapper.available-clients");
        var availableDataArea = availableGrid.find(".k-grid-content");
        var availableHeaderArea = availableGrid.find(".k-grid-header");
        if (splitter) {
            var availableDiff = splitter.options.panes[0].size.replace(/[^-\d\.]/g, '') - availableHeaderArea.innerHeight();
            availableDataArea.height(availableDiff);
        }
        
        var selectedGrid = $("#clients .grid-wrapper.selected-clients");
        var selectedDataArea = selectedGrid.find(".k-grid-content");
        var selectedHeaderArea = selectedGrid.find(".k-grid-header");
        if (splitter) {
            var selectedDiff = splitter.options.panes[1].size.replace(/[^-\d\.]/g, '') - selectedHeaderArea.innerHeight();
            selectedDataArea.height(selectedDiff);
        }
    }

    $(document).bind("loadClientPage", loadClientPage);
    function loadClientPage(e, data) {
    	if(clientPageLoaded == false) {
    		clientPageLoaded = true;
    		$("#clients .main-column-content").replaceWith("<div class='main-column-content'/>");
    		$("#clients .main-column-content").append("<div class='grid-wrapper available-clients'/>");
    		$("#clients .main-column-content").append("<div class='grid-wrapper selected-clients'/>");
    		loadClientGrid();
    		loadSelectedClientsGrid();
    		createSplitter();
    		initClientCheckBoxes();
    		initSelectedClientsDeleteButtons();
    		$(document).trigger("initializeSubmitButton");
    		if (data) {
    		    $("#select-products").addClass("second").removeClass("progress");
    		    $("#select-clients").addClass("first").addClass("active").removeClass("progress");
    		    $(".workspace-workflow").prepend($("#select-clients"));
    		    showLoadingDialog();
    		   /* var typeId;
    		    switch (data.parameter) {
    		        case "Account Number": typeId = 1; break;
    		        case "SSN / TIN / EIN": typeId = 2; break;
    		        case "Custodian Account Short Name": typeId = 3; break;
    		        case "Last Name": typeId = 4; break;
    		    }*/

    		    //Server.searchEntities({ value: data.value, typeId: typeId }, function(response) {
                Server.searchEntities({ value: data}, function(response) {
    		        removeLoadingDialog();
    		        var grid = $("#clients .main-column-content .grid-wrapper.available-clients").data("kendoGrid");
    		        clients = response;
    		        grid.dataSource.data(clients);
    		        $("#clients .table-records").html("<span class='bracket'>(</span>" + clients.length + "<span class='bracket'>)</span>");
    		    });
    		} else {
    		    if (hierarchyLoaded == false) {
    		        Server.getHighestHierarchy(null, function(response) {
    		            highestHierarchyArray = response;
    		            hierarchyLoaded = true;
    		            initializeClientList(highestHierarchyArray[0].clientId, highestHierarchyArray[0].clientName);
    		        });
    		    }
    		}
    	} else {
    		$(window).trigger("resize");
    	}
    }

    function initializeClientList(clientId, clientName) {
    	$('#selected-advisor').text(clientName);
    	
    	if (clientId == 0 || clientName == "CAIS") {
    		var param = {};
    		param.id = 0;
    		param.type = "cais";
    		populateClientList(param);
    	} else {
    		var param = {};
    		param.id = clientId;
    		param.type = "client";
    		populateClientList(param);
    	}
    }

    function loadClientGrid() {
    	$("#clients .main-column-content .grid-wrapper.available-clients").kendoGrid({
    		dataSource: {
    			data: clientsListData
    		},
    		sortable: {
    			mode: "single",
    			allowUnsort: false
    		},
    		scrollable: true,
    		columns: clients_selectedColumns,
    		dataBound: checkForSelectedClients
            });
    }

    function loadSelectedClientsGrid() {
        $("#clients .main-column-content .grid-wrapper.selected-clients").kendoGrid({
            dataSource: {
                data: selectedClients
            },
            columns: [
    			{ title: "", width: 35, template: "<span class='delete-button'><img src='resources/assets/icons/delete.png'></span>", sortable: false, filterable: false },
    			{ title: "Selected Clients", field: "name" }
    		],
            scrollable: true
        });
    }

    function initClientCheckBoxes() {
        $("#clients .main-column-content").on("click", ".grid-wrapper.available-clients tbody .nolabel_check", function () {
            var grid = $("#clients .main-column-content .grid-wrapper").data("kendoGrid");
    		$(this).toggleClass("check-on");
            if ($(this).hasClass("check-on")) {
                addClientToCart(grid.dataItem($(this).parents("tr")));
                $(this).parents("td").addClass("added");
            }
            else {
                removeClientFromCart(grid.dataItem($(this).parents("tr")));
            }
        });

        $("#clients .main-column-content").on("click", ".grid-wrapper.available-clients thead .nolabel_check", function () {
            //If the user was unfortunate enough to click this with all entities visible, it takes around 10 seconds
            //to complete. This is a highly unlikely use case, but a 'loading' spinner may be appropriate here
            $(this).toggleClass("check-on");
            var grid = $("#clients .main-column-content .grid-wrapper").data("kendoGrid");
            $("#clients .main-column-content .grid-wrapper.available-clients tbody .nolabel_check").each(function ()
            {
                if (!$(this).hasClass("check-on"))
                {
                    var client = grid.dataItem($(this).parents("tr"));
                    if ($.inArray(client, selectedClients) == -1) {
                        addClientToCart(client);
                        $(this).parents("td").addClass("added");
                        $(this).addClass("check-on");
                    }
                }
                else {
                    removeClientFromCart(grid.dataItem($(this).parents("tr")));
                }
            });
        });
    }

    function initSelectedClientsDeleteButtons() {
        $("#clients .main-column-content .grid-wrapper.selected-clients").on("click", "tbody .delete-button", function () {
            var grid = $("#clients .main-column-content .grid-wrapper.selected-clients").data("kendoGrid");
            removeClientFromCart(grid.dataItem($(this).parents("tr")));
        });

        $("#dclients .main-column-content .grid-wrapper.selected-clients").on("click", "thead .delete-button", function () {
    		removeAllClients()
        });
    }

    function initClientInfoClickHandler() {
        $("#clients").on("click", "tbody .client-info", function () {
            var permissions = user;
    	    if (permissions.menuPermissions.investorAccess) {
    	        var grid = $("#clients .main-column-content .grid-wrapper").data("kendoGrid");
    	        var selectedClient = grid.dataItem($(this).parents("tr"));
    	        var options = {};
    	        options.viewArray = clientsListData;
    	        options.selectedClient = selectedClient;
    	        options.allowNavigation = true;

    	        var dialog = new Dialog("client-detail", options);
    	    }
    	});
    }

    function doAfterClientsHierarchyLoad() {
    	$("#group-tree span.k-in").each(function() {
    		$(this).attr("title", $(this).text());
    	});
    }

    function populateClientList(param) {
        //showLoadingDialog();
        var grid = $("#clients .main-column-content .grid-wrapper.available-clients").data("kendoGrid");
        if (!grid) { return; }
    	switch(param.type) {
    		case "cais":
    		    Server.getAllEntities({ id: param.id }, function(response) {
    		        removeLoadingDialog();
    				clients = response;
    				grid.dataSource.data(clients);
    				$("#clients .table-records").html("<span class='bracket'>(</span>" + clients.length + "<span class='bracket'>)</span>");

    			});
    			break;
    		
    		case "client":
    		    Server.getEntitiesByClient({ id: param.id }, function(response) {
    		        removeLoadingDialog();
    				grid.dataSource.data(response);
    					
    				$("#clients .table-records").html("<span class='bracket'>(</span>" + response.length + "<span class='bracket'>)</span>");
    			});
    			
    			break;
    			
    		case "team":
    		    Server.getEntitiesByTeam({ advisorTeamId: param.id }, function(response) {
    		        removeLoadingDialog();
    				grid.dataSource.data(response);
    				$("#clients .table-records").html("<span class='bracket'>(</span>" + response.length + "<span class='bracket'>)</span>");
    			});
    			break;
    			
    		case "investor":
    		    Server.getEntitiesByInvestor({ investorId: param.id }, function(response) {
    		        removeLoadingDialog();
    				grid.dataSource.data(response);
    				$("#clients .table-records").html("<span class='bracket'>(</span>" + response.length + "<span class='bracket'>)</span>");
    			});
    		    break;

    	    case "advisor":
    	        Server.getEntitiesByAdvisor({ userId: param.id }, function (response) {
    	            removeLoadingDialog();
    	            grid.dataSource.data(response);
    	            $("#clients .table-records").html("<span class='bracket'>(</span>" + response.length + "<span class='bracket'>)</span>");
    	        });
    	        break;

    	    case "entity":
    	        Server.getEntityById({ investmentEntityId: param.id }, function (response) {
    	            removeLoadingDialog();
    	            grid.dataSource.data(response);
    	            $("#clients .table-records").html("<span class='bracket'>(</span>" + response.length + "<span class='bracket'>)</span>");
    	        });
    	        break;
    	}	
    }

    function addClientToCart(selectedClient) {
        selectedClients.push(selectedClient);
        var grid = $("#clients .grid-wrapper.selected-clients").data("kendoGrid");
        grid.dataSource.data(selectedClients);
        checkForSelectionComplete();
    }

    function removeClientFromCart(selectedClient) {
        var grid = $("#clients .grid-wrapper.selected-clients").data("kendoGrid");
        var clientIndex;
        for(var i in selectedClients) {
        	if(selectedClient.id == selectedClients[i].id) {
    			clientIndex = i;
    			break;
    		}
    	}
        selectedClients.splice(clientIndex, 1);
        grid.dataSource.data(selectedClients);

        var selectedRowId = selectedClient.id;
        var selectedRow = $("#clients .main-column-content .grid-wrapper.available-clients").find("div[data-entityId=" + selectedRowId + "]").parents("tr");
        selectedRow.find("label").parents("td").removeClass("added");
        var selectedRowCheckBox = $(selectedRow).find(".nolabel_check");
        selectedRowCheckBox.removeClass("check-on");
        checkForSelectionComplete();
    }

    function removeAllClients() {
    	var grid = $("#clients .main-column-content .grid-wrapper.selected-clients").data("kendoGrid");
    	selectedClients = [];
    	grid.dataSource.data(selectedClients);
    	$("#clients .main-column-content .grid-wrapper.available-clients thead .nolabel_check").removeClass("check-on");
    	$("#clients .main-column-content .grid-wrapper.available-clients tbody .nolabel_check").removeClass("check-on").parents("td").removeClass("added");
    	checkForSelectionComplete();
    }

    /* enable or disable the submit button to continue workflow */
    function checkForSelectionComplete() {
    	var count = selectedClients.length;
    	if(count > 0) {
    		$("#clients .control-bar .command-button-disabled").removeClass("command-button-disabled").addClass("command-button");
    	} else if (count == 0 ){
    		$("#clients .control-bar .command-button").removeClass("command-button").addClass("command-button-disabled");
    	}
    }

    /* initialize selected clients dropdown */
    function initializeSelectedClientsDialog() {
    	$("#button-selected-clients").click(function(){
    		$("#dialog-selected-clients").toggle();
    	});
    }

    function showClientDialog() {
    	$("<div>").load("resources/views/dialogs/client-detail.html", function(response) {
    		if(response.status=="success") {
    			$("#dialog-wrapper").append(response.msg);
    		}
    		$("#dialog-wrapper").show();
    		$(document).trigger("clientDetailsLoaded");
    		$(".left-icon").hide();
    		$(".right-icon").hide();
    		$("#client-details .subscription-details").css("margin-right", 30);
    		$("#client-details #subscription").css("margin-left", 30);
    	});
    }

    function checkForSelectedClients() {
    	for(var i in selectedClients)
    	{
    		var id = selectedClients[i].id;
    		var selectedRow = $("#clients .main-column-content .grid-wrapper").find("div[data-entityid=" + id + "]").parents("tr");
    		selectedRow.find("label").addClass("check-on").parents("td").addClass("added");
    	}
    }
}
}).call();