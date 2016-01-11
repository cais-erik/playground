// Converts json data to HTML table
function liquidityGrid_create(data, gridId)
{
    var today = new Date();
    var columns = ["product", "initialDate", "initialValue", "navDate", "currentDate", "gainLoss", "holdbackAmount", "redemption", /*"redemptionDate", "noticeDate",*/ "lockup", "exitFee"];
    var headers = ["Product", "Initial Date", "Initial Value", "As Of Nav Date", "Current Value", "Gain/Loss", "Audit Holdback", "Redemption Schedule", /*"Red Date", "Notice Date",*/ "Lockup", "Exit Fee"];
    var formatMoney = function(val, c, d, t) {
        return kendo.toString(val, 'c');
        // console.log(arguments);
        // var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        // return "$" + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    var formatDate = function(val) {
        if(val){
            return kendo.toString(new Date(val), "d");
        }else{
            return '';
        }        
    };

    // Create the table that will hold our data.
    var grid = $("<table class='datatable' id='" + gridId + "'/>");
    var thead = $("<thead/>");
    var theadrow = $("<tr/>");
    theadrow.appendTo(thead);
    thead.appendTo(grid);

    // Create the header columns, includes width and alignment attributes.
    for (var i in headers)
    {
        var header = headers[i];

        var thd = $("<th data-field='" + columns[i] + "'/>");
        thd.text(header);
        thd.appendTo(theadrow);
    }

    // Create each row of data.
    for (var i in data)
    {

        var initialValueAggregate = 0;
        var currentDateAggregate = 0;
        var gainLossAggregate = 0;
        var holdbackAggregate = 0;

        var tr = $("<tr/>");
        tr.appendTo(grid);

        var row = data[i];
        for (var r = 0; r <= columns.length; r++)
        {
            var td = $("<td/>");
            if (r == 0)
            {
                td.attr("colspan", "2");
                var openIcon = $("<div class='entity-open open'></div>");
                openIcon.click(function ()
                {
                    openEntityDetail(this);
                });
                td.append(openIcon);
                td.append("<div class='entity-name' data-entityId='entity_" + row.id + "' title='" + row.entity + "'>" + row.entity + "</div>");
            }
            td.appendTo(tr);
        }


        for (var j in data[i].holdings)
        {
            var index = data[i].id;
            var productRow = $("<tr class='entity_" + index + "'/>");

            initialValueAggregate += data[i].holdings[j].initialValue;
            currentDateAggregate += data[i].holdings[j].currentDate;
            gainLossAggregate += data[i].holdings[j].gainLoss;
            holdbackAggregate += data[i].holdings[j].holdbackAmount;

            for (var k = 0; k < columns.length; k++)
            {
                var entityTd = $("<td/>");
                var columnData = columns[k];
                if (k == 0) {
                    entityTd.html("<label class='label_check' data-entityName='"  + data[i].entity + "' data-endingCapital='"  + data[i].holdings[j].endingCapital + "' data-endingCapital='"  + data[i].holdings[j].endingCapital + "' data-shareClass='"  + data[i].holdings[j].shareClass + "' data-navDate='"  + data[i].holdings[j].navDate +  "' data-exitFee='"  + data[i].holdings[j].exitFee + "' data-noticeDate='"  + data[i].holdings[j].noticeDate + "' data-redemptionDate='"  + data[i].holdings[j].redemptionDate + "' data-lockup='"  + data[i].holdings[j].lockup + "' data-notice='"  + data[i].holdings[j].notice + "' data-redemption='"  + data[i].holdings[j].redemption + "' data-initialInvestment='"  + data[i].holdings[j].initialInvestment + "' data-packetName='"  + data[i].holdings[j].redemptionPacketName + "'  data-processAutoRedemptions='"  + data[i].holdings[j].processAutoRedemptions + "' data-productName='" + data[i].holdings[j].product + "' data-ifsInvestorName='" + data[i].holdings[j].ifsInvestorName + "' data-initialDate='" + data[i].holdings[j].initialDate + "' data-entityId='entity_" + index + "' data-productid='" + data[i].holdings[j].productId + "' data-fundId='" + data[i].holdings[j].fundId + "' data-fundType='" + data[i].holdings[j].fundType + "' data-adminTypeId='" + data[i].holdings[j].adminTypeId + "'><span class='entity'>" + data[i].holdings[j][columnData] + "</span></label>");
                } else if (k == 2 || k == 4 || k == 5 || k == 6) {
                    var currencyFormattedString = formatMoney(data[i].holdings[j][columnData], 2, ".", ",");
                    entityTd.html("<span class='entity' data-entityId='entity_" + index + "'>" + currencyFormattedString + "</span>");
                /*} else if(k == 8 || k == 9){
                    var dateFormattedString = formatDate(data[i].holdings[j][columnData]);
                    entityTd.html("<span class='entity' data-entityId='entity_" + index + "'>" + dateFormattedString + "</span>");
                    */
                }else{
                    entityTd.html("<span class='entity' data-entityId='entity_" + index + "'>" + data[i].holdings[j][columnData] + "</span>");
                }
                
                productRow.append(entityTd);
            }
            productRow.appendTo(grid);
        }

        var aggregateRow = $("<tr class='total-row'/>");
        aggregateRow.append("<td>TOTAL<div data-entityid='entity_" + index + "' class='command-button-disabled redeem'><a><div class='inner'>REDEEM</div></a></div></td>");
        aggregateRow.append("<td/>");
        aggregateRow.append("<td>" + formatMoney(initialValueAggregate,2, ".", ",") + "</td>");
        aggregateRow.append("<td/>");
        aggregateRow.append("<td>" + formatMoney(currentDateAggregate,2, ".", ",") + "</td>");
        aggregateRow.append("<td>" + formatMoney(gainLossAggregate,2, ".", ",") + "</td>");
        aggregateRow.append("<td>" + formatMoney(holdbackAggregate,2, ".", ",") + "</td>");
       /* aggregateRow.append("<td/>");
        aggregateRow.append("<td/>");*/
        aggregateRow.append("<td/>");
        aggregateRow.append("<td/>");
        aggregateRow.append("<td/>");


        aggregateRow.append("<td/>");

        aggregateRow.appendTo(grid);
    }

    return grid;
}

function openLiquidityDetail(selection)
{
    var index = $(selection).parents("tr").attr("data-entityId");
    if ($(selection).hasClass("open"))
    {
        $(selection).removeClass("open");
        $("#liquidity-table").find("." + index).hide();
    }
    else
    {
        /* Open this row */
        $(selection).addClass("open");
        $("#liquidity-table").find("." + index).show();
    }
}

function getDaysInMonth(month)
{
    switch(month)
    {
        case 0: return "31";
        case 1: return "28";
        case 2: return "31";
        case 3: return "30";
        case 4: return "31";
        case 5: return "30";
        case 6: return "31";
        case 7: return "31";
        case 8: return "30";
        case 9: return "31";
        case 10: return "30";
        case 11: return "31";
    }
}