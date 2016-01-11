(function(){
var allowRedemptionNavigation;
var selectedRedemption;
var selectedRedemptionArray;

//var redemptionTasks = redemptionTasksList;
var redemptionTasksColumns =
[
	{ title: "", template: "<div class='task-status ${ status }'></div>", width: 30 },
	{ title: "Assignee", field: "assignee", width: 80 },
	{ title: "Task", field: "description" },
	{ title: "Due Date", field: "dueDate", width: 120 },
	{ title: "Marked Complete", field: "completeDate", width: 150 },
	{ title: "Docs", field: "documents", width: 60 },
	{ title: "Open Tasks", field: "tasks", width: 100 }
]

//var events = eventLog;
var eventRedemColumns =
[
    { title: "Date", field: "date", width: 120 },
    { title: "Assignee", field: "assignee", width: 150 },
    { title: "Name", field: "name", width: 100 },
    { title: "Event", field: "event", width: 200 },
    { title: "Details", field: "details" }
]

$(document).bind("dialogs/redemption-infoLoaded", function (event, options) {
    allowRedemptionNavigation = options.allowNavigation;
    selectedRedemption = options.selectedRedemption;
    selectedRedemptionArray = options.selectedArray;

    $(window).on("resize", resizeRedemptionEventsGrid);
    redemptionInfo_onReady();
});

function redemptionInfo_onReady() {
    loadViews();
    initializeRedemptionNavigation();
    initializeRedemptionInfoTabs();
    createRedemptionTaskGrid();
    generateRedemptionData();
    createRedemptionEventLogGrid();

    $(".white-dropdown-menu").each(function () {
        var menu = new MenuList($(this), null, 110);
    });

    $("table .white-dropdown-menu").each(function () {
        var menu = new MenuList($(this), null, 20);
    });

    $("#redemption-tasks").kendoSplitter({
        panes: [
            { collapsible: false, size: "200px", min: "150px" },
            { collapsible: false, min: "300px" }
        ],
        orientation: "vertical",
        resize: onRedemptionSplitterResize
    });
}

function onRedemptionSplitterResize() {
    var splitter = $("#redemption-tasks").data("kendoSplitter");
    var gridElement = $("#redemption-tasks .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var headerArea = gridElement.find(".k-grid-header");
    if (splitter) {
        var diff = splitter.options.panes[0].size.replace(/[^-\d\.]/g, '') - headerArea.innerHeight();
        dataArea.height(diff);
    }
}

function generateRedemptionData() {
    var tableBody = $("#redemption-data table tbody");
    for (var j in redemptionData) {
        var product = redemptionData[j];
        var row = $("<tr data-productId='" + product.productId + "'/>");
        var productName = $("<td class='productName' style='text-align: left; padding-left: 30px;'>" + product.product + "</td>");
        var purchased = $("<td class='purchased center'>" + product.purchased + "</td>");
        var credits = $("<td class='credits center'>" + product.credits + "</td>");
        var current = $("<td class='current center'>" + product.current + "</td>");
        var gainLoss = $("<td class='gainLoss center'>" + product.gainLoss + "</td>");
        var redeem = $("<td class='center'><input type='text' class='textInput redeem currency' value='" + product.redeem + "' id='redeem" + product.id + "'/></td>");
        var redeemDate = $("<td class='center redeem-date-column'><input class='calendarInput' id='redeemDate" + product.id + "' value='" + product.redeemDate + "'/></td>");
        var fees = $("<td class='fees center'>" + product.fees + "</td>");
        var emptyCell = $("<td style='width:20%;'> </td>");
        row.append(productName);
        row.append(purchased);
        row.append(credits);
        row.append(current);
        row.append(gainLoss);
        row.append(redeem);
        row.append(redeemDate);
        row.append(fees);
        row.append(emptyCell);
        row.appendTo(tableBody);
    }

    $("#redemption-data .calendarInput").each(function () {
        $(this).kendoDatePicker();
    });
}

function createRedemptionTaskGrid() {
    $("#redemption-tasks .grid-wrapper").kendoGrid({
        dataSource:
			{
			    data: redemptionTasks
			},
        columns: tasksColumns,
        sortable: false,
        groupable: false,
        height: 200,
        selectable: "row"
    });
}

function resizeRedemptionEventsGrid() {
    var gridElement = $("#redemption-event-log .grid-wrapper");
    var dataArea = gridElement.find(".k-grid-content");
    var newHeight = gridElement.parent().innerHeight() - 2;
    var diff = gridElement.innerHeight() - dataArea.innerHeight();
    gridElement.height(newHeight);
    dataArea.height(newHeight - 25);
}

function createRedemptionEventLogGrid() {
    $("#redemption-event-log .grid-wrapper").kendoGrid({
        dataSource:
            {
                data: events
            },
        columns: eventRedemColumns,
        sortable: true,
        groupable: false,
        filterable: false
    });
}

function initializeRedemptionInfoTabs() {
    $("#redemption-info").find(".tab-section").bind("click", function ()
    {
        setActiveRedemptionTab(this);
    });
}

function setActiveRedemptionTab(event) {
    $("#redemption-info").find(".tab-section[data-tabgroup=redemption-sections].active").removeClass("active");
    $("#redemption-info").find(".content-page.active").removeClass("active");
    $(event).addClass("active");
    $("#" + $(event).attr("data-tab")).addClass("active");
    $(window).trigger("resize");
}

function initializeRedemptionNavigation() {
    if (allowTradeNavigation)     {
        $("#redemption-info .left-icon").show().click(toPreviousTrade);
        $("#redemption-info .right-icon").show().click(toNextTrade);
    }
}
}).call();