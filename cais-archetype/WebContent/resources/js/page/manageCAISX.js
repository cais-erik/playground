(function(){
var selectedProducts;
var currentView;
var exportToExcel = {
	testTypes:{
		"tradeId": {type:"String", width:100},
		"shareClass":  {type:"String", width:100},
		"totalFee": {type:"FeeFormat", width:100},
		"caisShare":{type:"FeeFormat", width:100},
		"advisorShare":{type:"FeeFormat", width:100},
		"investmentDate":{type:"DateTime", width:100},
		"investmentAmount":{type:"Currency", width:100},
		"totalRevenue":{type:"Currency", width:100},
		"caisRevenue":{type:"Currency", width:100},
		"advisorRebate":{type:"Currency", width:100},
		"fundType": {type:"String", width:100},
		"fund": {type:"String", width:300},
		"salesPerson": {type:"String", width:100},
		"advisor": {type:"String", width:100},
		"firm": {type:"String", width:100},
		"comment":{type:"String", width:100},
		"revenueDate":{type:"DateTime", width:100},
		"endingCapital":{type:"Currency", width:100},
		"grossPlatformFee":{type:"Currency", width:100},
		"membersShareFee":{type:"Currency", width:100},
		"netPlatFormFee":{type:"Currency", width:100},
		"revenue":{type:"Currency", width:100},
		"entityName":{type:"String", width:250}
	},
	emitXmlHeader: function(data) {
		var that = this,
			borders = [],
			headerRow = [],
			tableHeader = [];
		borders.push('<ss:Borders>');
	   	borders.push('<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>');
	   	borders.push('<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>');
	   	borders.push('<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>');
	   	borders.push('<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>');
	  	borders.push('</ss:Borders>');
		headerRow.push('<?xml version="1.0"?><ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">');
		headerRow.push('<ss:Styles>');
		headerRow.push('<ss:Style ss:ID="Header">'+borders.join('')+'<ss:Font ss:Bold="1" /><ss:Alignment ss:Horizontal="Center" /><ss:Interior ss:Color="#a1bc93" ss:Pattern="Solid"  /></ss:Style>');
		headerRow.push('<ss:Style ss:ID="Currency">'+borders.join('')+'<ss:NumberFormat ss:Format="&quot;$&quot;#,##0.00"/><ss:Alignment ss:Horizontal="Right"/></ss:Style>');
		headerRow.push('<ss:Style ss:ID="DateTime">'+borders.join('')+'<ss:NumberFormat ss:Format="mm/dd/yyyy;@"/></ss:Style>');
		headerRow.push('<ss:Style ss:ID="Percentage">'+borders.join('')+'<ss:NumberFormat ss:Format="0.00%"/></ss:Style>');
		headerRow.push('<ss:Style ss:ID="Fee">'+borders.join('')+'<ss:NumberFormat ss:Format="0.0000"/></ss:Style>');
		headerRow.push('<ss:Style ss:ID="General">'+borders.join('')+'</ss:Style>');
		headerRow.push('</ss:Styles>');
		headerRow.push('<ss:Worksheet ss:Name="Sheet1"><ss:Table>');
	    tableHeader.push('<ss:Row>');
	    for (var colName in data) {
	    	var field = data[colName].field,
	    		currentData = that.testTypes[field];
	        	currentType = currentData ? currentData.type : 'String',
	        	currentSize = currentData ? currentData.width : 100;
	        switch(currentType){
	        	case "Currency":
	        		headerRow.push('<ss:Column ss:AutoFitWidth="1" ss:Width="2" />');
	        		break;
	        	default:
	        		headerRow.push('<ss:Column ss:AutoFitWidth="0" ss:Width="'+currentSize+'" />');
	        		break;
	        }
	    	tableHeader.push('<ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">');
	        tableHeader.push(data[colName].title);
	        tableHeader.push('</ss:Data></ss:Cell>'); 
	    }
	    tableHeader.push('</ss:Row>');   
	    headerRow.push(tableHeader.join(''));
	    return  headerRow.join('');
	},
	emitXmlFooter:function() {
	    return '</ss:Table></ss:Worksheet></ss:Workbook>';
	},
	jsonToSsXml:function(columns, data) {
	    var row,
	    	col,
	    	xml = [],
	    	that = this;
	    xml.push(this.emitXmlHeader(columns));
	    for (row = 0; row < data.length; row++) {
	    	xml.push('<ss:Row>');
	        for (var col in columns) {
	        	var field = columns[col].field,
	        		currentType = that.testTypes[field] ? that.testTypes[field].type : 'String',
	        		styleId = 'General',
	        		value = data[row][field];

	        	switch(currentType){
	        		case 'Currency':
	        			currentType = 'Number'; 
	        			styleId = 'Currency';
	        			break;
	        		case 'DateTime':
	        			styleId = 'DateTime';
	        			currentType = 'DateTime';
	        			momentDate = moment(value);
	        			if(!momentDate.isValid() || momentDate.year() < 1900){
	        				value = '';
	        				currentType = 'String';
	        			}else{
	        				value = momentDate.tz('America/New_York').format('YYYY-MM-DDT00:00:00.000');	
	        			}
	        			break;
	        		case 'Percentage':
	        				currentType = 'Number'; 
	        				styleId = 'Percentage';
	        				break;
	        		case 'FeeFormat':
	        				currentType = 'Number'; 
	        				styleId = 'Fee';
	        				break;	        			
	        		default:
						value= encodeHtmlEntity(value);
	        			break;
	        	}
	    		xml.push('<ss:Cell ss:StyleID="'+styleId+'"><ss:Data ss:Type="'+currentType+'">');
	    		xml.push(value);
	    		xml.push('</ss:Data></ss:Cell>');
	        }
	        xml.push('</ss:Row>');
	    }
	    xml.push(this.emitXmlFooter());
	    return xml.join('');  
	},
	downloadExcel:function(columns, data, fileName, $link) {
		var content = this.jsonToSsXml(columns, data),
			blob,
			extension = ".xls";

	    if (window.MSBlobBuilder){
			var msBlob = new window.MSBlobBuilder();
		 	msBlob.append(content);
		 	blob = msBlob.getBlob('application/vnd.ms-excel');
		 	return window.navigator.msSaveBlob(blob, fileName+extension);
		}else if (typeof Blob !== "undefined") {
		 	blob = new Blob([content], {
	        	'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	    	});
	    	$link.href = window.URL.createObjectURL(blob);
	    	$link.download = fileName+extension;
	    	
		}else{
			var alert = new Alert("Export to Excel is not supported in this browser", "OK");
		}
		
	}
};
$(document).ready(function() {
	loadDtccManager();
	loadNotificationTypes();
	loadExistingGroups();
	loadContentManager();
	loadTransactionReconciliation();
	loadAdminListForPositionRetrieval();
	loadProductManagement();
	loadDocumentWatermarking();
	loadCommissionsModel();
	loadEmailCampaigns();
	initMercerMonthlyDocuments();
	
	$(".workspace").on("click", ".manager-dashboard", function() {
		$(".selected-action-content").hide();
		$(currentView).show();
		$(window).trigger("resize");
	});

	$(window).trigger("hashchange");

	$(".manage-menu a").click(function () {
		var menuLink = $(this).attr("href");
		if (menuLink == window.location.hash) {
			$(".selected-action-content").empty();
			$(".selected-action-content").hide();
			$(".main-content").hide();
			$(currentView).show();
			$(window).trigger("resize");
		}
	});
});

$(window).resize(function() {
	$(".activity-list").each(function() {
		var pane = $(this).data("jsp");
		if(pane) {
			pane.reinitialise();
		}
	});
	if($(".product-permissions").hasClass("active")) {
		resizePermissionsGrid();
	}
	if($(".commission-content").length>0){
		resizeCommissions();
	}
});

$(window).bind("hashchange", function() {
	currentView = window.location.hash || "#sales";

	$(".selected-action-content").empty();
	$(".selected-action-content").hide();
	$(".main-content").hide();
	$(currentView).show();
	$(window).trigger("resize");
	
	$(".manage-menu a.active").removeClass("active");
	$(".manage-menu a[href='" + currentView + "']").addClass("active");
});

var secGenColumns =
[
	{ title: "", template: "<label class='nolabel_check' data-id='${ secGenId }' onclick=''></label>", width: 35, sortable: false, filterable : false },
	{ title: "Firm#", field: "recipientNumber",width: 80 },
	{ title: "Fund Name", field: "securityIssuedName",width: 130 },
	{ title: "Class", field: "shareClass" ,width: 50 },
	{ title: "Record Type", field: "recordType" ,width: 100 },
	{ title: "Security#", field: "securityIssuedId",width: 130 },
	{ title: "Submission Date", field: "submissionDate" ,width: 120 },
	{ title: "Effective Date", field: "effectiveDate" ,width: 100 },
	{ title: "Ownership Structure", field: "ownershipStructure" ,width: 110 }
]

var secConColumns =
[
	{ title: "", template: "<label class='nolabel_check' data-id='${ conId }' onclick=''></label>", width: 35, sortable: false , filterable : false},
	{ title: "Firm#", field: "recipientNumber" ,width: 80},
	{ title: "Fund Name", field: "fundName" ,width: 100},
	{ title: "Class", field: "shareClass" ,width: 50},
	{ title: "NSCC#", field: "nsccSecurityIssueNumber" ,width: 120},
	{ title: "Submission Date", field: "submissionDate",width: 120 },
	{ title: "Effective Date", field: "effectiveDate",width: 120 },
	{ title: "Contact Name", field: "contactName" ,width: 150},
	{ title: "Security Contact Type", field: "securityContactTypeRecord1" ,width: 160}
]

var activColumns =
[
	{ title: "", template: "<label class='nolabel_check' data-id='${ actiId }' onclick=''></label>", width: 35, sortable: false, filterable : false },
	{ title: "Type", field: "type", width: 70},
	{ title: "Firm#", field: "firmNumber" ,width: 70},
	{ title: "Fund Name", field: "fundName" ,width: 180},
	{ title: "Class", field: "shareClass" ,width: 50},
	{ title: "Investor Name", field: "investorName" ,width: 180},
	{ title: "NSCC#", field: "nsccSecurityIssueNumber" ,width: 120},
	{ title: "Control#", field: "controlNumber" ,width: 140},
	{ title: "Account#", field: "firmAccountNumber",width: 100 },
	{ title: "Share Qty", field: "shareQuantity" ,width: 100},
	{ title: "Effective Date", field: "effectiveDate" ,width: 100}
]

var posnColumns =
[
	{ title: "", template: "<label class='nolabel_check' data-id='${ posId }' onclick=''></label>", width: 35, sortable: false, filterable : false },
	{ title: "Firm#", field: "firmNumber" ,width: 70},
	{ title: "Fund Name", field: "fundName" ,width: 180},
	{ title: "Class", field: "shareClass" ,width: 50},
	{ title: "Investor Name", field: "investorName" ,width: 200},
	{ title: "NSCC#", field: "nsccSecurityIssueNumber" ,width: 120},
	{ title: "Account#", field: "firmAccountNumber" ,width: 100},
	{ title: "Closing Value", field: "closingMoneyValue" ,width: 100},
	{ title: "Closing  Date", field: "closingBalanceDate" ,width: 90},
	{ title: "Investments", field: "investmentValue" ,width: 90}
]

var reconColumns =
	[
		{ title: "CAIS ID", field: "investmentEntityId", width: 20, sortable: false, editable: false},
		{ title: "Investor Name", field: "investorName" ,width: 30	, editable: false},
		{ title: "Admin Investor Id", field: "investorId" ,width: 20, editable: true},
		{command: ["edit"], title:"Edit Record",width: 30}
	]

var advisorTeamReconColumns =
	[
		{ title: "Advisor Team Name", field: "advisorTeamName" ,width: 30},
		{ title: "Advisor Team ID", field: "advisorTeamId", width: 20, sortable: false, editable: true},
		{ title: "Admin Advisor Team Id", field: "adminId" ,width: 20, editable: true},
		{command: ["edit"], title:"&nbsp",width: 30},
	]

var annualizedRevenueColumns = 
	[
		{title: 'Trade Id', field: "tradeID", template: "# if(typeof tradeID !== 'undefined'){ # <div title='#= encodeHtmlEntity(tradeID)#'>#= encodeHtmlEntity(tradeID) # </div># } #", type:"string"},
		{title: 'Share Class',  width:84, field: "shareClass", template: "# if(typeof shareClass !== 'undefined'){ # <div title='#= encodeHtmlEntity(shareClass) #'>#= encodeHtmlEntity(shareClass) # </div># } #", type:"string"},
		{title: 'Total Fee', width:60,field: "totalFee", format: "{0:N4}", attributes: { style: "text-align: right;" }, type:"number"},
		{title: 'CAIS Share', width:60,field: "caisShare", format: "{0:N4}", attributes: { style: "text-align: right;" }, type:"number"},
		{title: 'Advisor Share', width:60,field: "advisorShare", format: "{0:N4}", attributes: { style: "text-align: right;" }, type:"number"},
		{title: 'Investment Date', width:90, field: "investmentDate", template: "#if(typeof investmentDate !== 'undefined'){ #<div title='#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #'>#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #</div> # } #", type: 'date',attributes: { style: "text-align: center;" },footerAttributes: { style: "text-align: right;"}, footerTemplate:"TOTAL:"},		
		{title: 'Investment Amount', width:120, field: "investmentAmount", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Total Revenue', width:120, field: "totalRevenue", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'CAIS Revenue', width:120, field: "caisRevenue", format: "{0:C0}",  attributes: { style: "text-align: right;" },footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Advisor Rebate', width:120, field: "advisorRebate", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Fund Type', field: "fundType", template: "# if(typeof fundType !== 'undefined'){ # <div title='#= encodeHtmlEntity(fundType) #'>#= encodeHtmlEntity(fundType) # </div># } #", type:"string"},
		{title: 'Fund', field: "fund", template: "# if(typeof fund !== 'undefined'){ # <div title='#= encodeHtmlEntity(fund) #'>#= encodeHtmlEntity(fund) # </div># } #", type:"string"},
		{title: 'Sales Rep', field: "salesPerson", template: "# if(typeof salesPerson !== 'undefined'){ # <div title='#= encodeHtmlEntity(salesPerson) #'>#= encodeHtmlEntity(salesPerson) #</div># } else {} #", type:"string"},
		{title: 'Advisor', field: "advisor", template: "# if(typeof advisor !== 'undefined'){ # <div title='#= encodeHtmlEntity(advisor) #'>#= encodeHtmlEntity(advisor) # </div># } #", type:"string"},
		{title: 'Firm', field: "firm", template: "# if(typeof firm !== 'undefined'){ # <div title='#= encodeHtmlEntity(firm) #'>#= encodeHtmlEntity(firm) # </div># } #", type:"string"},
		{title: 'Comment', field: "comment", template: "# if(typeof comment !== 'undefined'){ # <div title='#= encodeHtmlEntity(comment) #'>#= encodeHtmlEntity(comment) # </div># } #", type:"string"},
		{title: 'Entity', field:"entityName", template: "# if(typeof entityName !== 'undefined'){ # <div title='#= encodeHtmlEntity(entityName) #'>#= encodeHtmlEntity(entityName) # </div># } #",  type:"string"}
	]
var feedersActualRevenueColumns = 
	[
		{title: 'Firm', field: "firm", template: "# if(typeof firm !== 'undefined'){ # <div title='#= encodeHtmlEntity(firm) #'>#= encodeHtmlEntity(firm) # </div># } #", type:"string"},
		{title: 'Team', field: "advisorTeam", template: "# if(typeof advisorTeam !== 'undefined'){ # <div title='#= encodeHtmlEntity(advisorTeam) #'>#= encodeHtmlEntity(advisorTeam) # </div># } #", type:"string"},
		{title: 'Custodian', field: "custodian", template: "# if(typeof custodian !== 'undefined'){ # <div title='#= encodeHtmlEntity(custodian) #'>#= encodeHtmlEntity(custodian) # </div># } #", type:"string"},
		{title: 'Fund', field: "fund", template: "# if(typeof fund !== 'undefined'){ # <div title='#= encodeHtmlEntity(fund) #'>#= encodeHtmlEntity(fund) # </div># } #", type:"string"},
		{title: 'Share Class', width:84, field: "shareClass", template: "# if(typeof shareClass !== 'undefined'){ # <div title='#= encodeHtmlEntity(shareClass) #'>#= encodeHtmlEntity(shareClass) # </div># } #", type:"string"},
		{title: 'Investment Date', width:90, field: "investmentDate", template: "#if(typeof investmentDate !== 'undefined'){ #<div title='#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #'>#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #</div> # } #", type: 'date',attributes: { style: "text-align: center;" },footerAttributes: { style: "text-align: right;"}, footerTemplate:"TOTAL:"},
		{title: 'Ending Capital', width:130, field: "endingCapital", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Gross Revenue', width:120, field: "grossPlatformFee", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Advisor Rebate', width:120,field: "membersShareFee", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Revenue', width:120,field: "netPlatFormFee", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Revenue Date', width:90, field: "revenueDate", template: "# if (typeof revenueDate !== 'undefined')  { # <div title='#= moment(revenueDate).tz('America/New_York').format('MM/DD/YYYY') #'>#= moment(revenueDate).tz('America/New_York').format('MM/DD/YYYY') # </div># } #", type: 'date', attributes: { style: "text-align: center;" }},
		{title: 'Sales Rep', field: "salesRep", template: "# if (typeof salesRep !== 'undefined')  { # <div title='#= encodeHtmlEntity(salesRep) #'>#= encodeHtmlEntity(salesRep) # </div># } #", type:"string"},
		{title: 'Advisor', field: "advisorName", template: "# if (typeof advisorName !== 'undefined')  { # <div title='#= encodeHtmlEntity(advisorName) #'>#= encodeHtmlEntity(advisorName) # </div># } #", type:"string"},
		{title: 'Entity', field:"entityName", template: "# if(typeof entityName !== 'undefined'){ # <div title='#= encodeHtmlEntity(entityName) #'>#= encodeHtmlEntity(entityName) # </div># } #",  type:"string"},
		{title: 'Trade ID', field:"tradeID", template: "# if(typeof tradeID !== 'undefined'){ # <div title='#= encodeHtmlEntity(tradeID) #'>#= encodeHtmlEntity(tradeID) # </div># } #", type:"string"}
		
	]

var dsaActualRevenueColumns = 
	[
		{title: 'Firm', field: "firm", template: "# if(typeof firm !== 'undefined'){ # <div title='#= encodeHtmlEntity(firm) #'>#= encodeHtmlEntity(firm) # </div># } #", type:"string"},
		{title: 'Team', field: "advisorTeam", template: "# if(typeof advisorTeam !== 'undefined'){ # <div title='#= encodeHtmlEntity(advisorTeam) #'>#= encodeHtmlEntity(advisorTeam) # </div># } #", type:"string"},
		{title: 'Custodian', field: "custodian", template: "# if(typeof custodian !== 'undefined'){ # <div title='#= encodeHtmlEntity(custodian) #'>#= encodeHtmlEntity(custodian) # </div># } #", type:"string"},
		{title: 'Fund', field: "fund", template: "# if(typeof fund !== 'undefined'){ # <div title='#= encodeHtmlEntity(fund) #'>#= encodeHtmlEntity(fund) # </div># } #", type:"string"},
		{title: 'Investment Date', width:90, field: "investmentDate", template: "#if(typeof investmentDate !== 'undefined'){ #<div title='#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #'>#= moment(investmentDate).tz('America/New_York').format('MM/DD/YYYY') #</div> # } #", type: 'date',attributes: { style: "text-align: center;" },footerAttributes: { style: "text-align: right;"}, footerTemplate:"TOTAL:"},
		{title: 'Ending Capital', field: "endingCapital", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Revenue', field: "revenue", format: "{0:C0}", attributes: { style: "text-align: right;"},footerAttributes: { style: "text-align: right;"}, aggregates: "sum", footerTemplate: "#= kendo.toString(sum, 'C0') #", type:"number"},
		{title: 'Revenue Date', width:90, field: "revenueDate", template: "# if (typeof revenueDate !== 'undefined')  { # <div title='#= moment(revenueDate).tz('America/New_York').format('MM/DD/YYYY') #'>#= moment(revenueDate).tz('America/New_York').format('MM/DD/YYYY') # </div># } #", type: 'date', attributes: { style: "text-align: center;" }},
		{title: 'Sales Rep', field: "salesRep", template: "# if (typeof salesRep !== 'undefined')  { # <div title='#= encodeHtmlEntity(salesRep) #'>#= encodeHtmlEntity(salesRep) # </div># } #", type:"string"},
		{title: 'Advisor', field: "advisorName", template: "# if (typeof advisorName !== 'undefined')  { # <div title='#= encodeHtmlEntity(advisorName) #'>#= encodeHtmlEntity(advisorName) # </div># } #", type:"string"},
		{title: 'Entity', field:"entityName", template: "# if(typeof entityName !== 'undefined'){ # <div title='#= encodeHtmlEntity(entityName) #'>#= encodeHtmlEntity(entityName) # </div># } #",  type:"string"},
		{title: 'Trade ID', field:"tradeID", template: "# if(typeof tradeID !== 'undefined'){ # <div title='#= encodeHtmlEntity(tradeID) #'>#= encodeHtmlEntity(tradeID) # </div># } #", type:"string"}
	]

function loadNotificationTypes() {
	$.getJSON('/getNotifictationTypesForCAISManager', {}, function(response) {
		if(response.status=="success"){
			var notificationTypeList = response.msg;
			loadNotificationTypesData(notificationTypeList);
		}else{
			
		}
	});
}

function loadNotificationTypesData(items) {
	for(var i in items) {
		var notificationType = $("<li/>");
		notificationType.append(items[i].Title);
		notificationType.attr("data-id", items[i].Id);
		notificationType.appendTo("#email-notifications ul");
	}
	/*$("#notificationDropDownList").kendoDropDownList({
		dataSource: items,
		dataTextField: "Title",
		dataValueField: "Id"
	});*/
	initialDownloadEmailListButton();
	$("#email-notifications .activity-list").jScrollPane();
}

function loadExistingGroups() {
	// hit the server for the list of groups and then parse
	Server.getGroupManagerDetails(null, function(response) {
		var groupsList = response;
		for(var i in groupsList) {
			var group = $("<li/>");
			group.data(groupsList[i]);
			group.text(groupsList[i].groupName);
			group.clone(true).appendTo($(".group-manager ul"));
		}
		$(".group-manager .activity-list").jScrollPane();	
		
		$(".group-manager li").click(function() {
			if($(this).attr("data-id") == "newGroup") {
				initializeAddNewGroup();		
			} else {
				var selectedGroup = $(this).data();
				loadExistingPermissionsGroup(selectedGroup);
			}
		});
	});	
}

function initialDownloadEmailListButton() {
	$("#email-notifications li").click(function() {
		var notificationType = $(this).attr("data-id");
		var paramString= "emailNotificationId=" + notificationType;
		$.downloadForManager('/generateEmailListFile', paramString, 'POST');
	});
}

function loadContentManager() {
	$(".contentVisibility .activity-list").jScrollPane();
	
	//get the list of content sections from the db then set the checks based on results
	Server.getContentVisibility({},function(response) {
		if(response.aboutUsModule == 1) {	
			$(".contentVisibility li[data-section=aboutUsModule] .label_check").addClass("check-on");
		}
		if(response.advisorResources == 1) {
			$(".contentVisibility li[data-section=advisorResources] .label_check").addClass("check-on");
		}
		if(response.aggregateExposureModule == 1) {
			$(".contentVisibility li[data-section=aggregateExposureModule] .label_check").addClass("check-on");
		}
		if(response.eventsModule == 1) {
			$(".contentVisibility li[data-section=eventsModule] .label_check").addClass("check-on");
		}
		if(response.mediaModule == 1) {
			$(".contentVisibility li[data-section=mediaModule] .label_check").addClass("check-on");
		}
		if(response.welcomeModule == 1) {
			$(".contentVisibility li[data-section=welcomeModule] .label_check").addClass("check-on");
		}
		if(response.quickStartModule == 1) {
			$(".contentVisibility li[data-section=quickStartModule] .label_check").addClass("check-on");
		}
	});
	
	$(".contentVisibility li").click(function() {
		$(this).find(".label_check").toggleClass("check-on");
		var updateObj = {};
		updateObj.moduleName = $(this).data().section;	
		if($(this).find(".label_check").hasClass("check-on")) {
			updateObj.isVisible = 1;
		} else {
			updateObj.isVisible = 0;
		}		
		
		var jsonifiedString = JSON.stringify(updateObj);
		
		Server.updateContentVisibility(jsonifiedString, function(response) {
			var alert = new Alert("Content Visibility has been updated", "OK");
		});
		// make a call to the server submitting the latest change
	});
}

function loadDtccManager(){
	$(".dtccManager .activity-list").jScrollPane();	

	$(".dtccManager li").click(function() {
		var id = $(this).attr("data-id");
		var name = $(this).text();
		initDtccManager(id, name);
	});
}

function initDtccManager(id, name) {
	$(".selected-action-content").empty();
	$(".selected-action-content").load("./resources/views/manage/dtccManager.html?" + caisVersion, function() {
		setDashboardLink();
		$(".main-content").hide();
		$(".selected-action-content").show();
		$(".title-header").append(name);
		initialChecksForTab(id);
		initializeRunButton(id);
		initializeAllSelectButton(id);
		initializeCancelButton(id);
		initializeInitialButton(id);
		loadDtccListById(id);
	});
}

function loadTransactionReconciliation(){
	Server.getAminTypeList(null, function(response) {
		var adminTypeList = response;
		for(var i in adminTypeList) {
			var adminType = $("<li/>");
			adminType.text(adminTypeList[i].adminType);
			adminType.attr("adminType", adminTypeList[i].adminType);
			adminType.attr("adminTypeId", adminTypeList[i].adminTypeId);
			adminType.clone().appendTo($(".transactionReconciliation ul"));
			adminType.clone().appendTo($(".advisorTeamReconciliation ul"));

		}
		$(".transactionReconciliation .activity-list").jScrollPane();	
		
		$(".transactionReconciliation li").click(function() {
			var adminType = $(this).attr("adminType");
			var adminTypeId = $(this).attr("adminTypeId");
			initReconManagerByAdminTypeId(adminType, adminTypeId);
		});
		
		$(".transactionReconciliation .activity-list").jScrollPane();	
		$(".advisorTeamReconciliation .activity-list").jScrollPane();	

		
		$(".transactionReconciliation li").click(function() {
			var adminType = $(this).attr("adminType");
			var adminTypeId = $(this).attr("adminTypeId");
			initReconManagerByAdminTypeId(adminType, adminTypeId);
		});
		
		$(".advisorTeamReconciliation li").click(function() {
			var adminType = $(this).attr("adminType");
			var adminTypeId = $(this).attr("adminTypeId");
			initadvisorReconByAdminTypeId(adminType, adminTypeId);
		});
	});	
}


function loadAdminListForPositionRetrieval(){
	Server.getAminTypeList(null, function(response) {
		var adminTypeList = response;
		var adminType = $("<li/>");
		adminType.text("ALL");
		adminType.attr("adminType", "ALL");
		adminType.attr("adminTypeId", 0);
		adminType.clone().appendTo($(".positionFilesRetrieval ul"));
		for(var i in adminTypeList) {
			var adminType = $("<li/>");
			adminType.text(adminTypeList[i].adminType);
			adminType.attr("adminType", adminTypeList[i].adminType);
			adminType.attr("adminTypeId", adminTypeList[i].adminTypeId);
			adminType.clone().appendTo($(".positionFilesRetrieval ul"));
		}
		$(".positionFilesRetrieval .activity-list").jScrollPane();	
		
		$(".positionFilesRetrieval li").click(function() {
			var adminType = $(this).attr("adminType");
			var adminTypeId = $(this).attr("adminTypeId");
			retrievePositionFiles(adminType, adminTypeId);
		});
	});	
}

function retrievePositionFiles(adminType, adminTypeId){
	$.getJSON('/finops/retrievePositionFiles', {adminTypeId:adminTypeId, adminType: adminType}, function() {
		var alert = new Alert("The requested Position Report will send to your email shortly. Thanks for using CAIS portal!","OK");
	});
}


function initReconManagerByAdminTypeId(adminType, adminTypeId){
	$(".selected-action-content").empty();
	$(".selected-action-content").load("./resources/views/manage/transactionReconciliation.html?" + caisVersion, function() {
		setDashboardLink();
		$(".main-content").hide();
		$(".selected-action-content").show();
		$(".title-header").append(adminType);
		loadReconTransList(adminTypeId);
	});
}

function initadvisorReconByAdminTypeId(adminType, adminTypeId){
	$(".selected-action-content").empty();
	$(".selected-action-content").load("./resources/views/manage/advisorTeamReconciliation.html?" + caisVersion, function() {
		setDashboardLink();
		$(".main-content").hide();
		$(".selected-action-content").show();
		$(".title-header").append(adminType);
		loadAdvisorReconList(adminTypeId);
	});
}

function loadDtccListById(id){
	if (id == 0){
		loadSecList();
	} else if (id ==1 ) {
		loadActiList();
	} else if (id ==2 ) {
		loadPosnList();
	} else if (id ==3 ) {
		loadSecConList();
	} else{
		
	}
}

function loadGenericData(fileName, service, method, params, columns, aggregates, filter){
	$(".sales-representative-container").css('display', 'none');
	var $excelButton = $("#export-excel");
	fileName = fileName.replace(' ', '_');
	$excelButton.off('click');
	$(".main-column-content .grid-wrapper").html('').addClass("k-loading-image");
	$.ajax({
		url:service,
		data: params,
		method:method,
		dataType:'json',
		success: function(response) {
			$(".main-column-content .grid-wrapper").removeClass("k-loading-image");
			if(response.status=="success") {
				var data = response.msg;
				for(var i = 0; i< data.length; i++){
					if(data[i].salesRep){
						data[i].salesRep = data[i].salesRep.replace(/\s\s+/g, ' ');
					}
					if(data[i].salesPerson){
						data[i].salesPerson = data[i].salesPerson.replace(/\s\s+/g, ' ');
					}
				}
				$excelButton.on('click', function(e){
					if((window.MSBlobBuilder || typeof Blob !== "undefined")&&!(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0)){
						var kendoTable = $(".main-column-content .grid-wrapper").data("kendoGrid"),
							kendoDataSource = kendoTable.dataSource,
							kendoColumns = kendoTable.columns,
							kendoFilters = kendoDataSource.filter(),
							kendoData = kendoDataSource.data(),
							query = new kendo.data.Query(kendoData),
							kendoFilteredData = query.filter(kendoFilters).data,
							kendoAllData = kendoData.toJSON();
						exportToExcel.downloadExcel(kendoColumns, kendoFilteredData, fileName, document.getElementById('export-excel'));

					}else{
						var alert = new Alert("Export to Excel is not supported in this browser", "OK");
					}
				});
				loadExportableDataForTab(data, columns, aggregates, filter);

			} else {
				//new Alert('There was an error consuming the service, please try again later', 'OK');
			}
		},
		error:function(response) {
			$(".main-column-content .grid-wrapper").removeClass("k-loading-image");
			new Alert('There was an error consuming the service, please try again later', 'OK');
		}
	});


}

function formatKendoDate(date){
	return kendo.toString(date, "yyyy-MM-dd");
}
function loadAnnualizedRevenue(fromDate, toDate) {
	var aggregates = [
					{ field: "investmentAmount", aggregate: "sum" },
					{ field: "totalRevenue", aggregate: "sum" },
					{ field: "caisRevenue", aggregate: "sum" },
					{ field: "advisorRebate", aggregate: "sum" }
				];
	loadGenericData('CAIS_annualizedRevenue_'+fromDate+'-to-'+toDate, '/admin/getTransactionsRevenue', 'POST', {startingDate: fromDate,endingDate:toDate}, annualizedRevenueColumns, aggregates, 'salesPerson');
}
function loadFeedersActualRevenue(date) {
	var aggregates = [
					{ field: "endingCapital", aggregate: "sum" },
					{ field: "grossPlatformFee", aggregate: "sum" },
					{ field: "membersShareFee", aggregate: "sum" },
					{ field: "netPlatFormFee", aggregate: "sum" }
				];
	loadGenericData('CAIS_feedersActualRevenue_'+date, '/admin/getFeedersRevenue', 'POST', {endingDate:date}, feedersActualRevenueColumns, aggregates, 'salesRep');
}
function loadDSAActualRevenue(date) {
	var aggregates = [
					{ field: "endingCapital", aggregate: "sum" },
					{ field: "revenue", aggregate: "sum" }
				];
	loadGenericData('CAIS_DSActualRevenue_'+date, '/admin/getDirectsRevenue', 'POST', {endingDate:date}, dsaActualRevenueColumns, aggregates, 'salesRep');
}


function loadSecList() {
	$.getJSON('/getSecList', {}, function(response) {
		if(response.status=="success") {
			var secGenList = response.msg;
			loadDataForTab(secGenList, secGenColumns);
		} else {
			
		}
	});
}

function loadActiList() {
	$.getJSON('/getActiList', {}, function(response) {
		if(response.status=="success") {
			var actiList = response.msg;
			loadDataForTab(actiList, activColumns);
		} else {
			
		}
	});
}

function loadPosnList() {
	$.getJSON('/getPosnList', {}, function(response) {
		if(response.status=="success"){
			var posnList = response.msg;
			loadDataForTab(posnList, posnColumns);
		} else {
			
		}
	});
}

function loadSecConList() {
	$.getJSON('/getSecConList', {}, function(response) {
		if(response.status=="success"){
			var secConList = response.msg;
			loadDataForTab(secConList, secConColumns);
		}else{
			
		}
	});
}

function loadReconTransList(adminTypeId) {
	Server.getReconTransList({adminTypeId: adminTypeId} , function(response) {
		var reconList = response;
		loadDataForReconGrid(reconList, reconColumns, adminTypeId);
	});
}

function loadAdvisorReconList(adminTypeId) {
	Server.loadAdvisorReconList({adminTypeId: adminTypeId} , function(response) {
		var reconList = response;
		loadDataForAdvisorTeamReconGrid(reconList, advisorTeamReconColumns, adminTypeId);
	});
}

function loadDataForAdvisorTeamReconGrid(list, colums, adminTypeId) {
	 $(".main-column-content .grid-wrapper").kendoGrid({
		dataSource: {
			data: list,
			schema: {
				model: {
					id: "adminAdvisorTeamId",
					fields: {
						adminAdvisorTeamId: {editable: false },
						advisorTeamName: { editable: false},
						advisorTeamId: { editable: true, nullable: false },
						adminId: { editable: true, nullable: false }
					}
				}
			},
		},
        toolbar: ["create"],
		editable: "inline",
		sortable: true,
		filterable: false,
		groupable: false,
		save: function(e){
			var params = {};
			params.adminAdvisorTeamId = e.model.adminAdvisorTeamId;
			params.advisorTeamId = e.model.advisorTeamId;
			params.adminId = e.model.adminId;
			params.adminTypeId = adminTypeId;
			var grid = $(".main-column-content .grid-wrapper").data("kendoGrid");
			Server.saveOrUpdateAdminAdvisorTeam( JSON.stringify(params) , function(response) {
				grid.dataSource.data(response);
			}, function(response) {
				var alert = new Alert("Please input a valid Admin Advisor Team Id.","OK")
			}
			);
			grid.refresh();
		},
		create: function(e) {
			
		},
		columns: colums
	});
}


function loadDataForReconGrid(list, colums, adminTypeId) {
	 $(".main-column-content .grid-wrapper").kendoGrid({
		dataSource: {
			data: list,
			schema: {
				model: {
					id: "investmentEntityId",
					fields: {
						investmentEntityId: { editable: false },
						investorName: { editable: false },
						investorId: { editable: true }
					}
				}
			},
		},
		editable: "inline",
		sortable: true,
		filterable: true,
		groupable: false,
		save: function(e){
			var investmentEntityId = e.model.investmentEntityId;
			var adminInvestorId = e.model.investorId;
			var adminAdvisorId = e.model.adminAdvisorId;
			var advisorTeamId = e.model.advisorTeamId;
			
			if (adminAdvisorId == null) {
				adminAdvisorId = "undefined";
			}
			
			if($.trim(adminInvestorId) != "TBA" && $.trim(adminInvestorId) != "") {
				var grid = $(".main-column-content .grid-wrapper").data("kendoGrid")
	
				Server.saveAdminInvestmentEntity({investmentEntityId:investmentEntityId, adminInvestorId:adminInvestorId, adminTypeId: adminTypeId,
					adminAdvisorId:adminAdvisorId, advisorTeamId:advisorTeamId} , function(response) {
					 grid.dataSource.data(response);
				}, function(response) {
					var alert = new Alert("Please input a valid Admin Investor Id.","OK")
					}
				);
				grid.refresh();
			} else {
				var alert = new Alert("Please input a valid Admin Investor Id.","OK");
			}
		},
		columns: colums
	});
}

function getCsvDocument(data, selectedIndex) {
	var paramString= "dataIds="+data;
	$.downloadForManager('/generateFileType'+selectedIndex, paramString, 'GET');	
}

jQuery.downloadForManager = function(url, data, method) {
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ method +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};

function initializeRunButton(selectedIndex) {
	$(".command-button.run").click(function() {
		var checkOn = "check-on"+selectedIndex;
		var dataIds = [];
		 $(".nolabel_check."+checkOn).each(function() {
			 var id = $(this).attr("data-id");
			 dataIds.push(id);
		 });
		 if (dataIds.length != 0 ) {
			 getCsvDocument(dataIds, selectedIndex);
		 } else {
			 var alert = new Alert("Please select at least 1 record.", "OK");
		 }
	});
}

function initializeAllSelectButton(selectedIndex) {
	$(".command-button.selectAll").click(function() {
		var checkOn = "check-on"+selectedIndex;
		$(".nolabel_check").each(function() {
			 $(this).toggleClass(checkOn).parents("td").toggleClass("added");
		});
	});
}

function initializeCancelButton(selectedIndex) {
	$(".command-button.remove").click(function() {
		var checkOn = "check-on"+selectedIndex;
		$(".nolabel_check." + checkOn).each(function() {
			 $(this).toggleClass(checkOn).parents("td").removeClass("added");
		});
	});
}

function initializeInitialButton(selectedIndex) {
	$(".command-button.initial").click(function() {
		showLoadingDialog();
		if(selectedIndex == 0){
			$.getJSON('/initialRun1', {}, function(response) {
				if(response.status=="success") {
					location.reload();
				}
				removeLoadingDialog();
			});
		} else if(selectedIndex == 1) {
			$.getJSON('/initialRun2', {}, function(response) {
				if(response.status=="success") {
					location.reload();
				}
				removeLoadingDialog();
			});
		} else if(selectedIndex == 2) {
			$.getJSON('/initialRun4', {}, function(response) {
				if(response.status=="success") {
					location.reload();
				}
				removeLoadingDialog();
			});
		} else {
			$.getJSON('/initialRun3', {}, function(response) {
				if(response.status=="success") {
					location.reload();
				}
				removeLoadingDialog();
			});
		}
	});
}

function loadExportableDataForTab(list, columns, aggregate, filter) {
	var $salesRepSelector = $("#sales-rep-selector"),
		$kendoObj = $(".main-column-content .grid-wrapper"),
		respresentativesList = [],
		newList = {items:list, total:list.length},
		dataGrid,
		salesRepDropDown = $salesRepSelector.data("kendoDropDownList"),
		o = {}, 
		i, 
		l = list.length;
    
    for(i=0; i<l;i++){
    	var currentLabel = list[i][filter];
    	if(currentLabel){
    		currentLabel = encodeHtmlEntity(currentLabel);
    		o[currentLabel] = {currentFilterLabel:currentLabel, currentFilterId:''};
    	}	
    } 
    for(i in o){
    	respresentativesList.push(o[i]);	
    } 
   	respresentativesList = respresentativesList.sort(function(a, b){
    	  if (a.currentFilterLabel < b.currentFilterLabel)
		    return -1;
		  if (a.currentFilterLabel > b.currentFilterLabel)
		    return 1;
		  return 0;
    });
    //Update kendo dropdown 
	if(!salesRepDropDown){
		salesRepDropDown = $salesRepSelector.kendoDropDownList({
	        dataTextField: "currentFilterLabel",
	        dataValueField: "currentFilterLabel",
	        autoBind: false,
	        optionLabel: "All",
	        dataSource: respresentativesList,
	        change: function() {
	        	var tempDataGrid = $(".main-column-content .grid-wrapper").data("kendoGrid");
	        	if(tempDataGrid){
		            var value = this.value();
		            if (value && value !== 'All') {
		                tempDataGrid.dataSource.filter({ field: filter, operator: "eq", value:value });
		            } else {
		                tempDataGrid.dataSource.filter({});
		            }
	            }
	        }
	    }).data("kendoDropDownList");
	}else{
		salesRepDropDown.dataSource.data(respresentativesList);
		salesRepDropDown.select(0);
	}
	
	if(respresentativesList.length>0) $(".sales-representative-container").css('display', 'inline');

	if($kendoObj.data().kendoGrid){
		$kendoObj.data().kendoGrid.destroy();
		$kendoObj.empty();
	}

	dataGrid = $(".main-column-content .grid-wrapper").kendoGrid({
			dataSource: {
				data: newList,
				schema: {
					data: 'items',
					total:'total'
				},
				aggregate: aggregate,
			},
			ignoreCase: false,
			sortable: true,
			filterable: true,
			pageable: {
				pageSize: 50,
				pageSizes: [50, 100, 200]
			},
			columns: columns,
			dataBound: function(){
				//Get the number of Columns in the grid
				var colCount = $(".k-grid").find('.k-grid-header colgroup > col').length;
				//If There are no results place an indicator row
				if (this.dataSource._view.length == 0) {
					var row = $('<tr class="kendo-data-row"><td colspan="' +
							colCount +
							'" style="text-align:center; padding: 25px 0"><b>No Data found.</b></td></tr>');
					$(".k-grid").find('.k-grid-content tbody').append(row);
					row.hide().fadeIn('500');
				}
				
				$(window).trigger("resize");
			}
		}).data("kendoGrid");

	
	$(window).trigger("resize");
}
function loadDataForTab(list, colums) {
	$(".main-column-content .grid-wrapper").kendoGrid({
		dataSource: {
			data: list
		},
		sortable: true,
		filterable: true,
		groupable: true,
		columns: colums
	});
}

function initialChecksForTab(selectedIndex) {
	var checkOn = "check-on" + selectedIndex;
	$(".main-column-content").on("click", ".nolabel_check", function() {
		$(this).toggleClass(checkOn).parents("td").toggleClass("added");
	});
}

function initializeAddNewGroup() {
	var selectedSection = 1;
	var productPermissionsCreated = false;
	var functionsCreated = false;
	$(".selected-action-content").empty();
	$(".selected-action-content").load("./resources/views/manage/addGroup.html?" + caisVersion, function() {
		setDashboardLink();
		$(".main-content").hide();
		$(".selected-action-content").show();
		createPermissionsList();
		createAvailableProductsList();
		
		$("#groupTypeSelector").kendoDropDownList();
		
		$(".next").click(function() {
			selectedSection += 1;
			$(".wizard-navigation li.active").removeClass("active");
			$(".wizard-content.active").removeClass("active");
			
			$(".wizard-navigation li[data-section=" + selectedSection + "]").addClass("active");
			$(".wizard-content[data-section=" + selectedSection + "]").addClass("active");
			
			$(".selected-action-content").find(".selection-section-list").each(function() {
				var scrollPane = $(this).data("jsp");
				scrollPane.reinitialise();
			});
			
			if(selectedSection == 3) {
				// populate the product access list
				if(!productPermissionsCreated) {
					createProductPermissionList("create");
					productPermissionsCreated = true;
				} else {
					createProductPermissionList("update");
				}
			}
			
			if(selectedSection == 4) {
				if(!functionsCreated) {
					// populate functions list
					functionsCreated = true;
				}
			}		    
		});
		
		$(".save").click(function() {
			// create the group object and send to server
			
			var newGroup = {};
			var firmTypeList = $("#groupTypeSelector").data("kendoDropDownList");	
			var selectedPermissionsString =  JSON.stringify(selectedProducts);
			
			newGroup.name = $("#newGroupName").val();
			newGroup.products = selectedPermissionsString;
			newGroup.functions = [];		    		    	
			newGroup.typeOfFirm = firmTypeList.value();
			// internal - 1, client - 2, prospect - 3, fundManager - 4
			$(".permList").find("label.check-on").each(function() {
				newGroup.functions.push($(this).attr("data-id"));
			});
			
			var jsonifiedString = JSON.stringify(newGroup);
			// send object to the server, and return with a message that the group has been created 
			Server.submitGroupAccess( jsonifiedString, function(response) {
				 var alert = new Alert("Your permissions group has been created", "OK");
				 $(document).bind("alertConfirm", function() {
					 window.location = "/manageCAISX";
				 });
			});		       
		});
		
		$(".prev").click(function() {
			selectedSection -= 1;
			$(".wizard-navigation li.active").removeClass("active");
			$(".wizard-content.active").removeClass("active");
			
			$(".wizard-navigation li[data-section=" + selectedSection + "]").addClass("active");
			$(".wizard-content[data-section=" + selectedSection + "]").addClass("active");
			
			$(".selected-action-content").find(".selection-section-list").each(function() {
				var scrollPane = $(this).data("jsp");
				scrollPane.reinitialise();
			});
		});		
	});
}

function createPermissionsList(permissions) {
	Server.getPermissions( {}, function(response) {
		var permList = response;
		for(var k in permList)
		{
			var permId = permList[k].permissionId;
			var permStr = getPermissionStrForId(permId);
			var label = "<label data-id="+permId+" class='label_check'>"+permStr+"</label>";
			$(".wizard-content-area.permList").append(label);
		}
		$(".permList .label_check").click(function() {
			$(this).toggleClass("check-on");
		});	
		
		if(permissions) {
			for(var i in permissions) {
				var permissionId = permissions[i].permissionId;
				$(".permList label[data-id=" + permissionId + "]").addClass("check-on");
			}
		}
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
	else if(id ==11)
		return "View Rebates";
	else if(id ==12)
        return "Commissions Model";
}

function loadExistingPermissionsGroup(group) {	
	var selectedSection = 1;
	var productPermissionsCreated = false;
	var functionsCreated = false;
	createPermissionsList(group.permissions);
	$(".selected-action-content").empty();
	$(".selected-action-content").load("./resources/views/manage/editGroup.html?" + caisVersion, function() {
		setDashboardLink();
		$(".main-content").hide();
		$(".selected-action-content").show();
		var groupTypeSelector = $("#groupTypeSelector").kendoDropDownList().data("kendoDropDownList");
		groupTypeSelector.select(group.typeOfGroup - 1);
		
		createAvailableProductsList();
		
		$(document).bind("availableProductsCreated", function() {
			// now that the available products list is created, parse through the selected products and make sure they are added to the selected list
			for(var i in group.productPermissions) {
				var product = group.productPermissions[i];
				$(".available-products li").each(function() {
					if($(this).data().productId == product.productId) {
						$(this).data(product);
						$(this).appendTo(".selected-products .selection-list");
						$(".selected-products .selection-list li").tsort();

						$(".selected-action-content").find(".selection-section-list").each(function() {
							var scrollPane = $(this).data("jsp");
							scrollPane.reinitialise();
						});
					}
				});
			}
			createProductPermissionList("create");
		});
		
		$("#delete-group").click(group, deletePermissionsGroup);
		
		$("#newGroupName").val(group.groupName);
		var groupId = group.groupId;
				
		// internal - 1, client - 2, prospect - 3, fundManager - 4
		
		// wire up navigation click handlers
		$(".wizard-navigation li").click(function() {
			var dataSection = $(this).attr("data-section");
			$(".wizard-navigation li.active").removeClass("active");
			$(".wizard-content.active").removeClass("active");
			$(".wizard-navigation li[data-section=" + dataSection + "]").addClass("active");
			$(".wizard-content[data-section=" + dataSection + "]").addClass("active");
			if(dataSection == 3) {
				resizePermissionsGrid();				
				createProductPermissionList("update");
			}
			$(".selected-action-content").find(".selection-section-list").each(function() {
				var scrollPane = $(this).data("jsp");
				scrollPane.reinitialise();
			});
		});	
		
		$(".saveGroupName").click(function() {
			var group = {};
			group.name = $("#newGroupName").val();
			group.id = groupId;
			var firmTypeList = $("#groupTypeSelector").data("kendoDropDownList");	
			group.typeOfFirm = firmTypeList.value();
			var jsonifiedString = JSON.stringify(group);
			
			Server.updateGroupName( jsonifiedString, function(response) {
				var alert = new Alert("Your group name has been updated", "OK");
			});
		});
		 
		 $(".showProductPermissions").click(function() {
			 $(".wizard-navigation li.active").removeClass("active");
			 $(".wizard-navigation [data-section=3]").addClass("active");
			 $(".wizard-content.active").removeClass("active");
			 $(".wizard-content[data-section=3]").addClass("active");
			 if (!selectedProducts) {
				 createProductPermissionList("create");
			 } else {
				 createProductPermissionList("update");
			 } 
		});
			
		$("li[data-section=3]").click(function() {
			if (!selectedProducts) {
				createProductPermissionList("create");
			} else {
				createProductPermissionList("update");
			}
		});
	  
		$(".saveProductAccess").click(function() {
			var group = {};
			group.id = groupId;			
			var selectedPermissionsString =  JSON.stringify(selectedProducts);
			group.products = selectedPermissionsString;
			var jsonifiedString = JSON.stringify(group);
			
			Server.updateProductAccess( jsonifiedString, function(response) {
				var alert = new Alert("Your product access has been updated", "OK");
			});
		});
		
		$(".saveFunctions").click(function() {
			var group = {};
			group.id = groupId;			
			group.functions = [];
			$(".permList").find("label.check-on").each(function() {
				group.functions.push($(this).attr("data-id"));
			});
			var jsonifiedString = JSON.stringify(group);
			Server.updateFunctions( jsonifiedString, function(response) {
				var alert = new Alert("Your functions have been updated", "OK");
			});
		});    	
	});
}

function deletePermissionsGroup(e) {
	var group = e.data;
	// server call to delete a group
	Server.deleteGroup(group.groupId, function() {
		var alert = new Alert(group.groupName + " has been deleted.", "OK");
		$(document).bind("alertConfirm", function() {
			document.location = "/manageCAISX";
		});
	});	
}

function createProductPermissionList(action) {
	switch(action) {
		case "create":
			selectedProducts = [];
			$(".selected-products .selection-list li").each(function() {
				var product = $(this).data();
				product.legalName = $(this).text();
				if($(this).data().overview == undefined) {
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
				width: 500,
				autoSync: true,
				schema: {
					model: {
						id: "productId",
						fields: {
							productId: { editable: false, nullable: false },
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
					{ field: "document", title: "Document", width: 80 },
					{ command: [ "edit" ], width: 180, title: "" }
				],
				editable: "inline"
			});
			break;
		case "update":
			$(".selected-products .selection-list li").each(function() {
				var product = $(this).data();

				if ($.inArray(product, selectedProducts) == -1) {
					if($(this).data().overview == undefined) {
						product.overview = true;               
						product.performances = true;
						product.mercer = true;
						product.document = true;
					   selectedProducts.push($(this).data());
					} else {
						product.overview = $(this).data().overview;               
						product.performances = $(this).data().performances;
						product.mercer = $(this).data().mercer;
						product.document = $(this).data().document;	
						selectedProducts.push($(this).data());
					}
					//selectedProducts.push($(this).data());
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

function addProductToSelectedList(e) {
	$(e.currentTarget).appendTo(".selected-products .selection-list");
	$(".selected-products .selection-list li").tsort();

	$(".selected-action-content").find(".selection-section-list").each(function() {
		var scrollPane = $(this).data("jsp");
		scrollPane.reinitialise();
	});
}

function removeProductFromSelectedList(e) {    
	$(e.currentTarget).appendTo(".available-products .selection-list");
	$(".available-products .selection-list li").tsort();

	$(".selected-action-content").find(".selection-section-list").each(function() {
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

function createAvailableProductsList() {
	
	$(".product-access .select-all").click(function() {
		addAllProducts();
	});

	$(".product-access .remove-all").click(function() {
		removeAllProducts();
	});
	
	Server.getAllProducts( {}, function(response) {
		products = response;
		populateAvailableProductsList();		
	});
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
	
	$(".selection-section-list").each(function() {
		$(this).jScrollPane();
	})
	
	$(document).trigger("availableProductsCreated");
}

function resizePermissionsGrid() {
	var gridElement = $(".product-permissions .grid-wrapper");
	gridElement.css('width','100%');
	var dataArea = gridElement.find(".k-grid-content");
	var newHeight = gridElement.parent().innerHeight() - 33;
	var diff = gridElement.innerHeight() - dataArea.innerHeight();
	gridElement.height(newHeight);
	dataArea.height(newHeight - 25);
}

function resizeCommissions() {
	var gridElement = $(".commission-content .grid-wrapper");
	var dataArea = gridElement.find(".k-grid-content");
	var newHeight = gridElement.parent().innerHeight();
	var diff = gridElement.innerHeight() - dataArea.innerHeight();
	dataArea.height(newHeight- 149);
	gridElement.height(newHeight);
}

function addAllProducts() {
	$(".available-products .selection-list li").each(function() {
		$(this).appendTo(".selected-products .selection-list");
		$(".available-products .selection-list li").tsort();
	});

	$(".product-access .selection-section-list").each(function() {
		var scrollPane = $(this).data("jsp");
		scrollPane.reinitialise();
	});
}

function removeAllProducts() {
	$(".selected-products .selection-list li").each(function() {
		$(this).appendTo(".available-products .selection-list");
		$(".available-products .selection-list li").tsort();
	});

	$(".product-access .selection-section-list").each(function() {
		var scrollPane = $(this).data("jsp");
		scrollPane.reinitialise();
	});
}

function loadProductManagement() {
	$(".productManagement li").click(function(e) {
		showLoadingDialog();
		var section = $(e.currentTarget).attr("data-section");
		var selectedList = $(e.currentTarget).attr("data-list");

		$(".selected-action-content").empty();
		$(".selected-action-content").load("./resources/views/manage/" + section + ".html?" + caisVersion, function() {
			setDashboardLink();
			$(".main-content").hide();
			$(".selected-action-content").show();

			$(document).trigger(section + "_loaded", selectedList);
		});
	});
}

function loadDocumentWatermarking() {
	$(".documentWatermarking li").click(function(e) {
		$(".selected-action-content").empty();
		$(".selected-action-content").load("./resources/views/manage/documentWatermarking.html?" + caisVersion, function() {
			setDashboardLink();
			$(".main-content").hide();
			$(".selected-action-content").show();
			$(document).trigger("documentWatermarking_loaded");
		});
	});
}
function spEmailPreview(){
	//require(['/resources/js/apps/common.js?'+caisVersion], function (common) {
		var products = getSelectedItems($("#product-list")),
			errorString = '';
		if(products.length<1){
			if(errorString !== ""){
				errorString = errorString.replace(".", " and at least 1 product.");
			}else{
				errorString += "You need to select at least 1 product.";
			}
		}
		if(errorString !== ""){
			new Alert(errorString, "OK");
		}else{
			showLoadingDialog();
			$.ajax({
				'type': 'POST',
				'url': '/api/products/previewStructuredProductsEmail',
				'contentType': 'application/json',
				'data': JSON.stringify({productId:products}),
				'dataType': 'html',
				'success': function(htmlTemplate){
					removeLoadingDialog();
					function closeDialog() {
						$("#general-preview").removeClass("show");
						$(document).off("alertConfirm", closeDialog);
					};
					$(document).on("alertConfirm", closeDialog);
					var $preview = $("#general-preview");
					$preview.find(".content iframe").first().contents().find('html').html(htmlTemplate);
					$preview.addClass("show");
					$preview.on('click', '.k-i-close', function(e){
						$preview.removeClass('show');
						e.preventDefault();
					});
				},
				'error':function(response) {
					removeLoadingDialog();
					function closeDialog() {
						$("#general-preview").removeClass("show");
						$(document).off("alertConfirm", closeDialog);
					};
					$(document).on("alertConfirm", closeDialog);
					new Alert("There was a problem generating this preview.", "OK");
				}
			});

		}
	//});

}
function getSelectedItems($grid){
	return $grid.find(".item-selected.check-on").map(function() {
		var item = $(this).data("id");
	    return item;
	}).get();
};
function loadEmailCampaigns() {
	$(".email-campaigns-options li").click(function(e) {
		var section = $(e.currentTarget).attr("data-section");
		$(".selected-action-content").empty();
		$(".selected-action-content").load("./resources/views/manage/"+section+".html?" + caisVersion, function() {
			setDashboardLink();
			$(".main-content").hide();
			$(".selected-action-content").show();
			$(document).trigger(section + "_loaded");
			switch(section){
				case 'spEmailCampaigns':
					var emailListServices = [
						{
							url:'/api/sfdata/test_distribution',
							selector:'.email-list-test',
							mainSelector:'.test'
						},
						{
							url:'/api/sfdata/sp_distribution',
							selector:'.email-list',
							mainSelector:'.live'
						}
					];
					
					$('.selected-action-content .tabs').kendoTabStrip({
						animation: false
					}).data("kendoTabStrip").select(0);



					for(var i=0; i<emailListServices.length; i++){

						var currentList = emailListServices[i],
							dataSource = new kendo.data.DataSource({
							    transport: {
							        read: {
							            url: currentList.url,
							            dataType: "json"
							            
							        }
							        
							    },
							    schema: {
							    	parse: function(data){
								    	$.each(data, function(index, item){
									    	item.id = item.emailAddress;
									    });
	            						return data;
	            					},
						        	model:{
							        	firmName:{
							        		type:"string"
							        	},
							        	name:{
							        		type:"string"
							        	},
							        	emailAddress:{
							        		type:"string"
							        	},
							        	selected:1,
							        	count:{
							        		type:'number'
							        	}
							        }
						        },
				        		aggregate: [
									{ field: "emailAddress", aggregate: "count" },
									{ field: "selected", aggregate: "sum" }
								]
						    });
						var emailListGrid = $(".selected-action-content "+currentList.selector).kendoGrid({
							columns: [
								{field: "selected", width: "33px", attributes: {style:'text-align:center; padding:.4em 0;'}, template: true, headerTemplate: '<label class="header-selected nolabel_check check-on"></label>',template: '<label data-id="#= id #" class="item-selected nolabel_check #= selected ? "check-on" : "" #"></label>'},
								{title: "Firm", field: "firmName"},
								{title: "Name", field: "name"},
								{title: "Email", field: "emailAddress", width: '275px', footerTemplate: "<div style='float:right'>#= kendo.toString(count, 'n0') # clients, <span class='selected-count'>#= data.selected.sum #</span> selected</div>"}
							],
							toolbar: $(".selected-action-content "+currentList.mainSelector+' .filter').html(),
							dataSource: dataSource,
							groupable: false
						}).data('kendoGrid');
					}
					$(document).on("keyup", "input[name=name-filter]", function(){
						var $this = $(this),
							$grid = $this.closest(".k-grid"),
							grid = $grid.data("kendoGrid"),
							dataSource = grid.dataSource,
							val = $this.val(),
							filter = {
								logic: 'or',
								filters: [
									{field:"name", operator:"contains", value: val},
									{field:"firmName", operator:"contains", value: val},
									{field:"emailAddress", operator:"contains", value: val}
								]
							};
						dataSource.filter(filter);
					});
					var productListDataSource = new kendo.data.DataSource({
					    transport: {
					        read: {
					            url: "/api/products/structured_solutions",
					            dataType: "json"
					        }
					    },
				        schema: {
				        	model:{
					        	issuerName:{
					        		type:"string"
					        	},
					        	title:{
					        		type:"string"
					        	},
					        	settleDate:{
					        		type:"date"
					        	},
					        	maturityDate:{
					        		type:"string"
					        	},
					        	cusip:{
					        		type:"number"
					        	},
					        	closingDate:{
					        		type:'date'
					        	},
					        	selected:1,
					        	count:{
					        		type:'number'
					        	}
					        }
				        },
				        aggregate: [
							{ field: "closingDate", aggregate: "count" },
							{ field: "selected", aggregate: "sum" }
						]
					});
					var productsGrid = $("#product-list").kendoGrid({
					    dataSource: productListDataSource,
					    scrollable: false,
					    sortable: true,
						columns: [{
									headerTemplate: '<label class="header-selected nolabel_check check-on"></label>',
						    		sortable:false,
						    		template: '<label data-id="#= id #" class="item-selected nolabel_check #= selected ? "check-on" : "" #"></label>',
						    		width:33
								  },
								  {
						    		field: "issuerName",
						    		title: "Issuer"
								  },
								  {
						    		field: "title",
						    		title: "Product Description"
								  },
								  {
						    		field: "settleDate",
						    		title: "Trade Date",
						    		template: '#= moment.utc(settleDate).format("MM/DD/YYYY") #',
						    		width:100
								  },
								  {
						    		field: "maturityDate",
						    		title: "Maturity Date",
						    		template: '#= moment.utc(maturityDate).format("MM/DD/YYYY") #',
						    		width:113
								  },
								  {
						    		field: "cusip",
						    		title: "CUSIP",
						    		width:100
								  },
								  {
						    		field: "closingDate",
						    		title: "Orders Due",
						    		template: '#= moment.utc(closingDate).format("MM/DD/YYYY hh:mm A") # EST',
						    		width:180,
						    		footerTemplate: "<div style='float:right'>#= kendo.toString(count, 'n0') # products, <span class='selected-count'>#= data.selected.sum #</span> selected</div>"
								  }]
					}).data("kendoGrid");


					$(".sp-email-main-content").on("click", ".item-selected, .header-selected", function (e) {
						var $target = $(e.target),
							$parentGrid = $target.closest(".k-grid"),
							grid = $parentGrid.data("kendoGrid"),
							dataSource = grid.dataSource;
						$target.toggleClass('check-on');
						var isSelected = $target.hasClass('check-on');
						if($target.hasClass('header-selected')){
							$parentGrid.find(".item-selected").each(function(){
								var $this = $(this);
								if(isSelected){
									$this.addClass("check-on");
								}else{
									$this.removeClass("check-on");
								}
								var item = dataSource.get($this.data("id"));
								item.set("selected", isSelected ? 1 : 0);
							});
						}else{
							var	row = $target.closest("tr"),
								item = grid.dataItem(row);
							if(!isSelected) $parentGrid.find(".header-selected").removeClass("check-on");
						    item.set("selected", (isSelected ? 1 : 0));
					    }
					});
					
					$("#sp-email-preview").on('click', function(){
						spEmailPreview();
					});

					$(".sp-email-send").on('click', function(){

						var products = getSelectedItems($("#product-list")),
							emails= getSelectedItems($(".email-notifier .k-state-active .k-grid")),
							errorString = '';
						if(emails.length<1){
							errorString = "You need to select at least 1 email.";
						}
						if(products.length<1){
							if(errorString !== ""){
								errorString = errorString.replace(".", " and at least 1 product.");
							}else{
								errorString += "You need to select at least 1 product.";
							}
						}
						if(errorString !== ""){
							new Alert(errorString, "OK");
						}else{
							showLoadingDialog();
							
							$.postJSON('/api/products/sendStructuredProductsEmail', {productId:products,emails:emails}, function (result) {
								removeLoadingDialog();
								function closeDialog() {
									$("#general-preview").removeClass("show");
									$(document).off("alertConfirm", closeDialog);
								};
								$(document).on("alertConfirm", closeDialog);
								new Alert("Your email has been sent successfully.", "OK");
							}).error(function(e) {
								removeLoadingDialog();
								function closeDialog() {
									$("#general-preview").removeClass("show");
									$(document).off("alertConfirm", closeDialog);
								};
								$(document).on("alertConfirm", closeDialog);

								var errorMessage = "There was a problem sending this email.";
								if(e.XMLHttpRequest && e.XMLHttpRequest.statusText){
									errorMessage = errorMessage+="Error: " + e.XMLHttpRequest.statusText;
								}
								new Alert(errorMessage, "OK");
							});
						}
						
					});
					break;
			}
		});
	});
}
function loadCommissionsModel() {
	$(".commissions-model li").click(function(e) {
		var section = $(e.currentTarget).attr("data-section");
		$(".selected-action-content").empty();
		$(".selected-action-content").load("./resources/views/manage/"+section+".html?" + caisVersion, function() {
			setDashboardLink();
			$(".main-content").hide();
			$(".selected-action-content").show();
			$(document).trigger(section + "_loaded");
			var now = new Date(),
				past = new Date(now.setMonth(now.getMonth() - 1));
			switch(section){
				case 'annualizedRevenue':
					var pastStartDay = new Date(past.getFullYear(), past.getMonth(), 1),
						pastEndDay = new Date(past.getFullYear(), past.getMonth() + 1, 0),
						setMax = function(){
							datePickerFrom.max(datePickerTo.value());
						},
						setMin = function(){
							datePickerTo.min(datePickerFrom.value());
						},
						loadGrid = function(){
							loadAnnualizedRevenue(formatKendoDate(datePickerFrom.value()), formatKendoDate(datePickerTo.value()));
						},
						datePickerFrom = $("#rev-date-from").kendoDatePicker({
							value:pastStartDay,
							format: "MM/dd/yyyy",
					    	change: function() {
					    		var val = this.value();
					    		setMin();
					    		loadGrid();
					   		}
						}).data("kendoDatePicker"),
						datePickerTo = $("#rev-date-to").kendoDatePicker({
							value:pastEndDay,
							format: "MM/dd/yyyy",
					    	change: function() {
					    		var val = this.value();
					    		setMax();
					    		loadGrid();
					   		}
						}).data("kendoDatePicker");

					$("#rev-date-from").attr("readonly","readonly");
					$("#rev-date-to").attr("readonly","readonly");
					setMin();
					setMax();
					loadGrid();
					break;
				case 'feedersActualRevenue':
					var kendoDate = $("#feeders-month-picker").kendoDatePicker({
							value:past,
							start: "year",
							depth: "year",
					    	format: "MMMM yyyy",
					    	depth:'year',
					    	change: function() {
					        	selectFunction();
					   		}
						}).data("kendoDatePicker"),
						selectFunction = function(){
							var date = kendoDate.value()
								y = date.getFullYear(), 
								m = date.getMonth(),
								lastDay = new Date(y, m + 1, 0);
							loadFeedersActualRevenue(formatKendoDate(lastDay));
						};
					$("#feeders-month-picker").attr("readonly","readonly");
					selectFunction();
					break;
				case 'dsaActualRevenue':
					var kendoDate = $("#dsa-month-picker").kendoDatePicker({
							value:past,
							start: "year",
							depth: "year",
					    	format: "MMMM yyyy",
					    	depth:'year',
					    	change: function() {
					        	selectFunction();
					   		}
						}).data("kendoDatePicker"),
						selectFunction = function(){
							var date = kendoDate.value()
								y = date.getFullYear(), 
								m = date.getMonth(),
								lastDay = new Date(y, m + 1, 0);
							loadDSAActualRevenue(formatKendoDate(lastDay));
						};
					$("#dsa-month-picker").attr("readonly","readonly");
					selectFunction();
					break;
			}
		});
	});	
}

function setDashboardLink() {	
	$(".manager-dashboard").text($(currentView).attr("data-section"));
}

function initMercerMonthlyDocuments() {
	$(".mercerMonthlyFiles li").click(function(e) {
		showLoadingDialog();
		var section = $(e.currentTarget).attr("data-section");
		var selectedList = $(e.currentTarget).attr("data-list");

		$(".selected-action-content").empty();
		$(".selected-action-content").load("./resources/views/manage/" + section + ".html?" + caisVersion, function() {
			setDashboardLink();
			$(".main-content").hide();
			$(".selected-action-content").show();
			removeLoadingDialog();
			$(document).trigger(section + "_loaded", selectedList);

			$("#mercer-docs").kendoUpload({
				select: verifySize,
				async: {
					saveUrl: '/uploadMercerMonthlyDocs',
					autoUpload: true
				},
				//complete: removeUploadedFilesList,
				success: function (e) {
					if (e.response.status == 'success') {
						$('#upload-docs .k-progress').hide();
					} else {
						new Alert("Uploaded File Cannot Exceed 10mb", "OK");
					}
				},
				error: function(e) {
					if (e.XMLHttpRequest.status === 400) {
						new Alert("Please verify this Mercer document meets the upload filename criteria.", "OK");
					}
					else {
						new Alert("There was a problem uploading this file. Error: " + e.XMLHttpRequest.statusText, "OK");
					}
				}
			});

			function verifySize(e) {
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
			}
		});
	});
}
}).call();