(function(){

var caisUserColumns =
[
    { title: "", template: "<label class='nolabel_check' data-userId='${ userId }' onclick=''></label>", width: 35, sortable: false },
    { title: "Last Name", field: "lastName" },
    { title: "First Name", field: "firstName" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Last Login", field: "lastLogin" }
]

$(document).ready(function() {
    loadCaisUserList();
    initializeAddButton();
    initializeCloseButton();
    initializeDetailsButton();
});

$(document).bind("loadCaisUserList", loadCaisUserList);
function loadCaisUserList() {
	Server.getCAISUserList( {}, function(response) {
		caisUserList = response;
		loadCaisUserListData(caisUserList);
	});
}

function loadCaisUserListData(caisUserList) {
	var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
	if(grid){
	    grid.dataSource.data(caisUserList);
	}
	else{
		$(".main-column-content .grid-wrapper").kendoGrid({
	        dataSource: {
	            data: caisUserList
	        },
	        sortable: true,
	        groupable: false,
	        columns: caisUserColumns
		});
	}
	
    $(".grid-wrapper").on("click", ".nolabel_check", function() {
        $(this).toggleClass("check-on").parents("td").toggleClass("added");
    });
}

function initializeDetailsButton() {
	$(".command-button.details").click(function() {
    	if($("#clientList .nolabel_check.check-on").length == 1)
		{
    		var userId = $(".nolabel_check.check-on").attr("data-userid")
			var options = {};
	    	options.selection = userId;
	    	var dialog = new Dialog("admin-cais-detail", options);
		}
    });	
}

function initializeAddButton() {
    $(".command-button.add").click(function () {
        var dialog = new Dialog("add-cais-user");
    });
}

function initializeCloseButton() {
    $(".command-button.remove").click(function () {
        $(".nolabel_check.check-on").each(function () {
            var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
            var user = grid.dataItem($(this).parents("tr"));
            //Do some server call here to remove the selected users
        });
    });
}

function hideUserManagement() {
    $(".command-button.remove").hide();
    $(".command-button.add").hide();
}
}).call();