(function(){
	
var user;
var isCais;
var hierarchy;

var holdings;
var holdingsColumns = 
[
	{ title: "Transaction ID", field: "caisId", width: 110 },
	{ title: "Fund", field: "fund" },
	{ title: "Advisor Name", field: "advisorName", hidden: true },
	{ title: "Investor Name", field: "investorName", hidden: true },
	{ title: "Investment Entity", field: "entityName" },
	{ title: "Custodian Account Num", field: "custodianAccountNumber", hidden: true},
	{ title: "Purchase Date", field: "purchaseDate", width: 110, attributes: { style: "text-align: center;" } },
	{ title: "Purchase Price", field: "purchasePrice", format: "{0:C2}", width: 130 },
	{ title: "Value", field: "value", format: "{0:C2}", width: 130, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C') #", groupFooterTemplate: "#= kendo.toString(sum, 'C') #" },
	{ title: "Change", field: "change", format: "{0:C2}", width: 110 },
	{ title: "Nav", field: "nav", format: "{0:C4}", width: 80},
    { title: "Shares", field: "closingShareBalance", format: "{0:N4}", width: 80 },
	{ title: "NAV Date", field: "navDate", hidden: true, width: 100 },
	{ title: "Class", field: "className", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, hidden: true },
	{ title: "MTD", field: "mtdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 },
	{ title: "YTD", field: "ytdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 },
	{ title: "ITD", field: "itdReturns", attributes: { style: "text-align: center;" }, headerAttributes: { style: "text-align: center;" }, width: 70 }
]

var rebatesColumns = 
[
	{ title: "Transaction ID", field: "caisId" },
	{ title: "Fund", field: "fund" },
	{ title: "Advisor Name", field: "advisorName" },
	{ title: "Investor Name", field: "investorName" },
	{ title: "Investment Entity", field: "entityName" },
	{ title: "Value", field: "value", format: "{0:C2}", aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C') #", groupFooterTemplate: "#= kendo.toString(sum, 'C') #" },
	{ title: "NAV Date", field: "navDate" },
	{ title: "Class", field: "className", template: "<div style='text-align: center'>#= className #</div>" },
	{ title: "Q1", field: "rebatesQ1", template: "<div style='text-align: right'>#= kendo.toString(rebatesQ1, 'C') #</div>" },
	{ title: "Q2", field: "rebatesQ2", template: "<div style='text-align: right'>#= kendo.toString(rebatesQ2, 'C') #</div>" },
	{ title: "Q3", field: "rebatesQ3", template: "<div style='text-align: right'>#= kendo.toString(rebatesQ3, 'C') #</div>" },
	{ title: "Q4", field: "rebatesQ4", template: "<div style='text-align: right'>#= kendo.toString(rebatesQ4, 'C') #</div>" },
	{ title: "Total", field: "rebatesAnnual", template: "<div style='text-align: right'>#= kendo.toString(rebatesAnnual, 'C') #</div>", aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C') #", groupFooterTemplate: "#= kendo.toString(sum, 'C') #" }
]

var labels = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var chartColors = {
		bar: [ "#74a1ab" ],
		pie: [ "#503c63", "#6f6aa5", "#5f4775", "#896aa5", "#6a98a5"]
};

var selectedEntity=new Object();

$(document).ready(function () {
    Server.caisUser.getLocalSessionInfo(function(response) {
        user = response;
        if (!user.menuPermissions.accessRebates) {
            $("#rebates").remove();
            $("div.tab-section[data-tab=rebates]").remove();
        }
    
        loadClientHierarchy();
        initAccountTabs();
        initializeScroller();
        isWealthAdvisor();

        initializeChartExpand();
        $("#print-holdings").click(function () {
            var wrapper = $("<div id='grid-print-wrapper'/>");
            var tableHeader = $("#holdings .k-grid-header").clone();
            var tableBody = $("#holdings .k-grid-content").clone();
            tableHeader.find("th").css("padding", "4px");
            tableBody.find("td").css("padding", "4px");
            tableBody.find("tr").first().prepend(tableHeader.find("tr").first());
            wrapper.append(tableBody.removeAttr("style").css("font-size", "10px").css("overflow", "visible"));
            wrapper.printArea();
        });
        $("#print-rebates").click(function () {
            var wrapper = $("<div id='grid-print-wrapper'/>");
            var tableHeader = $("#rebates .k-grid-header").clone();
            var tableBody = $("#rebates .k-grid-content").clone();
            tableHeader.find("th").css("padding", "4px");
            tableBody.find("td").css("padding", "4px");
            tableBody.find("tr").first().prepend(tableHeader.find("tr").first());
            wrapper.append(tableBody.removeAttr("style").css("font-size", "10px").css("overflow", "visible"));
            wrapper.printArea();
        });

        $("#export-holdings-excel").click(function () {
            exportJsonToExcel();
        });		
    });
});

function initTabs() {
    $(".tabs").on("click", ".tab-section", function() {
        setActiveAccountTab(this);
    });
}

$(window).resize(function() {
	var activeTab = $(".tab-section.active").attr("data-tab");
	// check to see which is active
	
	if(activeTab == "holdings") {
		resizeHoldingsGrid();
	} else if (activeTab == "rebates") {
		resizeRebatesGrid();		
	}
	resizeScroller;
	
	if(activeTab == "clientPerformance") {
		$(".chart").each(function() {
			var chart = $(this).data("kendoChart");
			if (chart) {
				chart.refresh();
			}
		});
	}
	
});

function setActiveAccountTab(event) {
    $(".main-column .tabs").find(".tab-section.active").removeClass("active");
    $(".main-column").find(".content-page.active").removeClass("active");
    $(event).addClass("active");
    $("#" + $(event).attr("data-tab")).addClass("active");
    $(window).trigger("resize");
}

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
}

function onHierarchySelect(e) {
    $(".chart-panel.full").remove();

    var selectedItem = $("#group-tree").data("kendoTreeView").dataItem(e.node);
    if (selectedItem) {
        var selectedNodeType;
        var selectedNodeId;
        var clientId;
        if (selectedItem.clientId) {
            selectedNodeType = "client";
            selectedNodeId = selectedItem.clientId;
            clientId = null;
            $(".hierarchy-selection").text(selectedItem.clientName);
        } else if (selectedItem.investmentEntityId) {
            selectedNodeType = "entity";
            selectedNodeId = selectedItem.investmentEntityId;
            clientId = null;
        } else if (selectedItem.userId) {
            selectedNodeType = "advisor";
            selectedNodeId = selectedItem.userId;
            clientId = null;
        } else if (selectedItem.advisorTeamId) {
            selectedNodeType = "team";
            selectedNodeId = selectedItem.advisorTeamId;
            clientId = null;
            $(".hierarchy-selection").text(selectedItem.teamName);
        } else if (selectedItem.investorId) {
            selectedNodeType = "investor";
            selectedNodeId = selectedItem.investorId;
            var clientObject = $("#group-tree").data("kendoTreeView").dataItem($(e.node).parents("li").first().parents("li").first());
            clientId = clientObject.id;
            $(".hierarchy-selection").text(selectedItem.investorName);
        } else {
            selectedNodeType = "cais";
            $(".hierarchy-selection").text("CAIS");
        }

        loadHoldingsData(selectedNodeType, selectedNodeId, clientId);
        loadRebatesData(selectedNodeType, selectedNodeId);
        getChartData(selectedNodeType, selectedNodeId);

        if (selectedNodeType == "investor" || selectedNodeType == "entity") {
            // hide the performance tab, and select the Holdings tab
            $("div.tab-section[data-tab=clientPerformance]").removeClass("active").hide();
            $("div.content-page.active").removeClass("active");
            $("#holdings").addClass("active");
            $("div.tab-section[data-tab=holdings]").addClass("active");
        } else {
            // show the performance tab again, but keep whatever tab they are viewing as active
            $("div.tab-section[data-tab=clientPerformance]").show();
        }
        return false;
    }
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

function initializeChartExpand() {
	$(".chart-panel .header .expand").click(function(e) {
		var selectedChartCategory = $(this).parents(".chart-panel").find(".chart").attr("data-chartcategory");
		var selectedChartData = $(this).parents(".chart-panel").find(".chart").attr("data-chartdata");
		var selectedChartType = $(this).parents(".chart-panel").find(".chart").attr("data-charttype");
		var selectedChartTitle = $(this).parents(".chart-panel").find(".header").text();
		
		var chartPanel = $("<div class='chart-panel full'/>");
		var chartHeader = $("<div class='header'/>");
		var chartHeaderIcon = $("<div class='shrink'/>");
		var chartWrapper = $("<div class='chart-wrapper'/>");
		var chart = $("<div class='chart'/>");
		chart.attr("data-chartcategory", selectedChartCategory);
		chart.attr("data-chartdata", selectedChartData);
		
		chartHeader.text(selectedChartTitle);
		chartHeader.append(chartHeaderIcon);
		chartHeaderIcon.click(function(){
			chartPanel.remove();
		});
		
		chartWrapper.append(chart);
	
		chartPanel.append(chartHeader);
		chartPanel.append(chartWrapper);
		
		chartPanel.appendTo("#clientPerformance .main-column-content");
		
		switch(selectedChartType) {
			case "pie":
				renderPieChart(0, chart);
				break;
			case "column":
				renderColumnChart(0, chart);
				break;
			case "line":
				renderLineChart(0, chart)
				break;
			case "stackedcolumn":
				renderStackedColumnChart(0, chart)
				break;
			default:
				break;
		}
	});
}
    
function isWealthAdvisor() {
	Server.getCAISAccountRole(null, function(response) {
			caisUserRole = response;
	});
}

function doAfterDataLoad() {
}

function populateClientList(type, id, teamId) {
    switch (type) {
        case "cais":
            Server.getAllInvestors({}, function(response) {
    			clientsListData = response;
	            var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
	            $(".table-records").html("<span class='bracket'>(</span>" + clientsListData.length + "<span class='bracket'>)</span>");
	            if (grid) {
	            	grid.dataSource.data(clientsListData);
	            }
	            if ($(".grid-wrapper tbody .nolabel_check.check-on").length > 0) {
	            	$("#clientList .command-buttons").show();
	            } else {
	            	$("#clientList .command-buttons").hide();
	            }
        	});
	        break;
	          
        case "client":
            Server.getAllInvestorsByClient({ id: id }, function(response) {
    			clientsListData = response;
	            var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
	            $(".table-records").html("<span class='bracket'>(</span>" + clientsListData.length + "<span class='bracket'>)</span>");
	            if (grid) {
	            	grid.dataSource.data(clientsListData);
	            }
	            
	            if ($(".grid-wrapper tbody .nolabel_check.check-on").length > 0) {
	            	$("#clientList .command-buttons").show();
	            } else {
	            	$("#clientList .command-buttons").hide();
	            }
        	});
	        break;

        case "team":
            Server.getAllInvestorsByTeam({ teamId: id }, function(response) {
    			clientsListData = response;
 	            var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
 	            $(".table-records").html("<span class='bracket'>(</span>" + clientsListData.length + "<span class='bracket'>)</span>");
 	            if(grid) {
 	            	grid.dataSource.data(clientsListData);
 	            }
            	if($(".grid-wrapper tbody .nolabel_check.check-on").length > 0) {
            		$("#clientList .command-buttons").show();
            	} else {
            		$("#clientList .command-buttons").hide();
            	}
        	});
            break;

        case "advisor":
            Server.getAllInvestorsByUser({ selectedId: id, advisorTeamId: teamId }, function(response) {
    			clientsListData = response;
	            var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
	            $(".table-records").html("<span class='bracket'>(</span>" + clientsListData.length + "<span class='bracket'>)</span>");
	            if(grid) {
	            	grid.dataSource.data(clientsListData);
	            }
	            if($(".grid-wrapper tbody .nolabel_check.check-on").length > 0) {
	            	$("#clientList .command-buttons").show();
	            } else {
	            	$("#clientList .command-buttons").hide();
	            }
        	});
        	break;
    }
}

function getChartData(type, id) {
	switch (type) {
        case "cais":
        	Server.getPositionChartData( {}, function(response) {
				graphData = parseGraphData(response);
			    reloadCharts();
	        });
	        break;
	          
       case "client":
        	Server.getPositionChartDataByClient( { id: id }, function(response) {
    			graphData = parseGraphData(response);
    		    reloadCharts();
        	});
	        break;

        case "team":
        	Server.getPositionChartDataByTeam( { teamId: id}, function(response) {
    			graphData = parseGraphData(response);
    		    reloadCharts();
        	});
            break;

        case "advisor":
        	Server.getPositionChartDataByUser( { advisorId: id }, function(response) {
    			graphData = parseGraphData(response);
    		    reloadCharts();
        	});
        	break;
    }
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

function parseGraphData(graphData) {
	for(var i in graphData.byFunds) {
		for(var j in graphData.byFunds[i].data) {
			if(graphData.byFunds[i].data[j] == 0) {
				graphData.byFunds[i].data[j] = null;
			}
		}
	}
	graphData.totalHoldings = $.parseHoldingChartData(graphData.totalHoldings);

	/*for(var i in graphData.totalGainLoss) {
		graphData.totalGainLoss[i].total = graphData.totalGainLoss[i].total / 1000;
	}*/
	
    
	
	/*for(var i in graphData.byFundsTotal) {
		graphData.byFundsTotal[i].totalValue = graphData.byFundsTotal[i].totalValue / 1000;
	}*/
	
	return graphData;
}

function initAccountTabs() {
    $(".tabs").on("click", ".tab-section", function() {
        setActiveAccountTab(this);
    });
}

function reloadCharts() {
	$(".chart").each(function() {
		$(this).empty();
	});
	
	populateCharts();
}

function populateCharts() {		
	$(".chart[data-chartType=stackedcolumn]").each(renderStackedColumnChart);
	$(".chart[data-chartType=line]").each(renderLineChart);
	$(".chart[data-chartType=column]").each(renderColumnChart);	
	$(".chart[data-chartType=pie]").each(renderPieChart);
}

function renderColumnChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
	dataSource: {
		data: graphData[chartData]
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
        	format: "{0:C0}"
        }
    },
    series: graphData[chartData],
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

function renderPieChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
	var chartCategory = $(chartWrapper).attr("data-chartCategory");
	var titleObject = {};
	if (chartData == "byFundsTotal") {
	    var totalFundsValue = 0;
	    for (var i in graphData.byFundsTotal) {
	        totalFundsValue += graphData.byFundsTotal[i].totalValue;
	    }

	    titleObject.position = "bottom";
	    titleObject.text = "Total Holdings : " + kendo.format("{0:C0}", totalFundsValue);
	}

	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
	dataSource: {
		data: graphData[chartData]
	},
	title: titleObject,
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
	series: [{ field: "totalValue"}],
    valueAxis: {
        labels: {
            format: "{0:C0}"
        }
    },
    tooltip: {
        visible: true,
        template: valueFormatSelector
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

function renderLineChart(i, chartWrapper) {
	var chartData = $(chartWrapper).attr("data-chartData");
    console.log(chartData);
	$(chartWrapper).kendoChart({
		theme: "BlueOpal",
    seriesDefaults: {
        type: "line",
        labels: {
        	visible: false
        }
    },   
	series: [{
		data: graphData[chartData]
	}],
    categoryAxis: {
    	categories: labels,
    	title: {
    		text: (new Date).getFullYear(),
    		font: "14px Arial,Helvetica,sans-serif",
    		margin: 10
    	}
    },
    valueAxis: {
        labels: {
            template: valueFormatSelector
        },
        title: {
            text: "Millions US$",
            font: "14px Arial,Helvetica,sans-serif",
            margin: 10

        }
    },
    tooltip: {
        visible: true,
        template: valueFormatSelector
    },
    legend: {
    	visible: false
    },
    chartArea: {
    	margin: 20
    },
    seriesColors: chartColors.pie
	});	
}

function valueFormatSelector(e) {
    if (e.value < 1000000 && e.value != 0) {
        return kendo.format('{0:C1}', e.value / 1000000) + "M"
    } else {
        return kendo.format('{0:C0}', e.value / 1000000) + "M"
    }
}

function showClients(selectedItem) {
    var type = $(selectedItem).parents("li").attr("data-type");
    var id = $(selectedItem).parents("li").attr("data-id");
    var name = $(selectedItem).text();
    $('#selected-filter').text(name);

	populateClientList(type, id, teamId);
	getChartData(type, id);
}

function chartPrintView() {
	$("#clientPerformance .main-column-content").printArea();
}

function loadHoldingsData(type, id, clientId) {
	// set properties of selected entity
	selectedEntity.type =type;
	selectedEntity.id = id;
	selectedEntity.clientId=clientId;
	
	var grid = $("#holdings .grid-wrapper").data("kendoGrid");
	switch (type) {
		case "cais" :
			Server.getHoldings(null, function(response) {
				holdings = response;
				if(grid) {
					reloadHoldingsData();
				} else {
					doAfterInitialHoldingsLoadData();
				}
			});
			break;
		case "client" :
			Server.getHoldingsByClient({ selectedId: id }, function(response) {
				holdings = response;
				if(grid) {
					reloadHoldingsData();
				} else {
					doAfterInitialHoldingsLoadData();
				}
			});
			break;
		case "team" :
			Server.getHoldingsByTeam({ selectedId: id }, function(response) {
				holdings = response;
				if(grid) {
					reloadHoldingsData();
				} else {
					doAfterInitialHoldingsLoadData();
				}
			});
			break;
		case "investor" :
			Server.getHoldingsByInvestorForPerformance({ selectedId: id, clientId :clientId}, function(response) {
				holdings = response;
				if(grid) {
					reloadHoldingsData();
				} else {
					doAfterInitialHoldingsLoadData();
				}
			});
			break;
	    case "advisor":
	        Server.getHoldingsByAdvisor({ selectedId: id }, function (response) {
	            holdings = response;
	            if (grid) {
	                reloadHoldingsData();
	            } else {
	                doAfterInitialHoldingsLoadData();
	            }
	        });
	        break;
	    case "entity":
	        Server.getHoldingsByInvestmentEntity({ selectedId: id }, function (response) {
	            holdings = response;
	            if (grid) {
	                reloadHoldingsData();
	            } else {
	                doAfterInitialHoldingsLoadData();
	            }
	        });
	        break;
	}
}

function loadRebatesData(type, id) {
	var grid = $("#rebates .grid-wrapper").data("kendoGrid");
	switch (type) {
	    case "cais" :
		    Server.getRebates(null, function(response) {
			    rebates = response;
			    if(grid) {
				    reloadRebatesData();
			    } else {
				    doAfterInitialRebatesLoadData();
			    }
		    });
		    break;
	    case "client" :
		    Server.getRebatesByClient({ selectedId: id }, function(response) {
			    rebates = response;
			    if(grid) {
				    reloadRebatesData();
			    } else {
				    doAfterInitialRebatesLoadData();
			    }
		    });
		    break;
	    case "team" :
		    Server.getRebatesByTeam({ selectedId: id }, function(response) {
			    rebates = response;
			    if(grid) {
				    reloadRebatesData();
			    } else {
				    doAfterInitialRebatesLoadData();
			    }
		    });
		    break;
	    case "investor" :
		    Server.getRebatesByInvestorForPerformance({ selectedId: id }, function(response) {
			    rebates = response;
			    if(grid) {
				    reloadRebatesData();
			    } else {
				    doAfterInitialRebatesLoadData();
			    }
		    });
		    break;
	    case "advisor":
	        Server.getRebatesByAdvisor({ selectedId: id }, function (response) {
	            rebates = response;
	            if (grid) {
	                reloadRebatesData();
	            } else {
	                doAfterInitialRebatesLoadData();
	            }
	        });
	        break;

	    case "entity":
	        Server.getRebatesByInvestmentEntity({ selectedId: id }, function (response) {
	            rebates = response;
	            if (grid) {
	                reloadRebatesData();
	            } else {
	                doAfterInitialRebatesLoadData();
	            }
	        });
	        break;
            
	}
}

function reloadHoldingsData() {
	$("#holdings .grid-wrapper tbody").show();
	var grid = $("#holdings .grid-wrapper").data("kendoGrid");
	if(holdings.length > 0) {
		grid.dataSource.data(holdings);
		grid.refresh();
		resizeHoldingsGrid();
	} else {
		$("#holdings .grid-wrapper tbody").hide();
	}
}

function doAfterInitialHoldingsLoadData() {	
	$("#holdings .grid-wrapper").kendoGrid({
		dataSource: {
			data: holdings,
	        aggregate: [ { field: "value", aggregate: "sum" } ]
		},
		groupable: true,
        sortable: true,
		columns: holdingsColumns,
		columnMenu: {
		    columns: true,
		    filterable: false,
            sortable: true
		}
	});
	resizeHoldingsGrid();
}

function doAfterInitialRebatesLoadData() {
	$("#rebates .grid-wrapper").kendoGrid({
		dataSource: {
			data: rebates,
	        aggregate: [ { field: "value", aggregate: "sum" },
	                     { field: "rebatesAnnual", aggregate: "sum" } ]
		},
		columns: rebatesColumns,
		groupable: true
	});
	resizeRebatesGrid();
}

function reloadRebatesData() {
	$("#rebates .grid-wrapper tbody").show();
	var grid = $("#rebates .grid-wrapper").data("kendoGrid");
	if(rebates.length > 0){
		grid.dataSource.data(rebates);
		grid.refresh();
		resizeRebatesGrid();
	} else {
		$("#rebates .grid-wrapper tbody").hide();
	}
}

function resizeHoldingsGrid() {
    var gridElement = $("#holdings .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight);
    dataArea.height(newHeight - 93);
}

function resizeRebatesGrid() {
    var gridElement = $("#rebates .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight);
    dataArea.height(newHeight - 93);
}

// export holdings to excel file by exporting json object to excel file directly 
function exportJsonToExcel(){
	var param = {};
	param.fileName="holdings.xlsx";
	param.sheetName="sheet1";
	param.builderName="holdingsSheetBuilder";
	
	param.data=JSON.stringify(holdings);
	$.download('/exportJsonToExcel', param, 'POST');
}
	
}).call();