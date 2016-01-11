// Converts json data to HTML table
function holdingsGrid_create(columns, headers, data, gridId) {
	// Create the table that will hold our data.
	var grid = $("<table class='datatable' id='" + gridId + "'/>");
	var thead = $("<thead/>");
	var theadrow = $("<tr/>");
	theadrow.appendTo(thead);
	thead.appendTo(grid);
	
	// Create the header columns, includes width and alignment attributes.
	for ( var i in columns ) {
		var column = columns[i];
		
		var thd = $("<th/>")
		thd.text(headers[column]);
		thd.appendTo(theadrow);
	}
	
	// Create each row of data.
	for ( var i in data ) {
		var tr = $("<tr/>");
		tr.appendTo(grid);
		
		var row = data[i];
		for ( var r = 0; r < columns.length; r++) {
			var td = $("<td/>");
			if(r == 0) {
				td.addClass("relative");
				var openIcon = $("<div class='entity-open open'></div>");
				openIcon.click(function() {
					openEntityDetail(this);
				});
				td.append(openIcon);
				td.append("<span class='entity-name' data-productId='fund_" + data[i].id + "' title='" + row.entity + "'>" + row.entity + "</span>");
			} else {
				var columnData = columns[r];
				td.text(row[columnData]);
			}
			
			td.appendTo(tr);
		}		
		
		for(var j in data[i].funds) {
			var fundRow = $("<tr class='fund fund_" + data[i].id + "'/>");

			for(var k = 0; k < columns.length; k++) {
				var fundTd = $("<td/>");
				var columnData = columns[k];
				if(columnData=="transactionId") {
					//fundTd.html("<div class='pointer trade-info' data-transactionid='"+data[i].funds[j][columnData]+"'>"+data[i].funds[j]["caisId"]+"</div>");
					fundTd.html("<div data-transactionid='"+data[i].funds[j][columnData]+"'>"+data[i].funds[j]["caisId"]+"</div>");
				} else {				
					fundTd.html("<span class='fund' data-productId='fund_" + data[i].id + "'>" + data[i].funds[j][columnData] + "</span>");
				}
				fundRow.append(fundTd);	
			}
			fundRow.appendTo(grid);
		}		
	}
	
	return grid;
}

function openEntityDetail(selection) {
	var index = $(selection).parents("tr").attr("data-productId");
	if ( $(selection).hasClass("open") ) {
		$(selection).removeClass("open");
		$("#holdings-table").find("." + index).hide();
	} else {
		/* Open this row */
		$(selection).addClass("open");
		$("#holdings-table").find("." + index).show();
	}
}