$(document).ready(productOnReady);

function productOnReady() {
    var queryVars = $.getUrlVars();
    var fundId = queryVars.fundId;
    var pageAction = queryVars.pageAction || 'fundInfo';

    Server.getFundById({ fundId: fundId }, function(response) {
        var options = {};
        options.selectedProduct = response;
        options.allowNavigation = false;
        options.dialogAddRemove = false;
        options.quickInvest = true;
        options.pageAction = pageAction;
        var dialog = new Dialog("fund-info", options);
    });
}