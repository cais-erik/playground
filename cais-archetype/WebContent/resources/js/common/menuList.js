// Create a drop down menu list from a ul, with a sub ul

function MenuList(rootElement, clickFunction, width, isSelect) {
	var root;
	var items;
	var isOpen;

	root = $(rootElement);
	items = root.find("ul");

	var widthToSet = width ? width : 200;

	root.find(".selected div").css("width", widthToSet);

	root.children("li").click(function (evt) {
	    showMenuList(evt);
	});

	items.addClass("itemsList").css("min-width", widthToSet + 41).css("max-width", widthToSet - 20);
	
	if(isSelect == true) {
		// don't setup the menuItemSelected event
		items.on("click", "li", function(evt) {
			if (clickFunction != null)
		        clickFunction(evt.currentTarget);
		});
	} else {
		items.on("click", "li", function(evt) {
			evt.selectedItem = $(this);
			menuItemSelected(evt);
		});
	}

	var showMenuList = function (evt) {
	    evt.stopPropagation();
	    if (isOpen) {
	        hideMenuList();
	        return;
	    }
	    isOpen = true;

	    if (root.offset().top + 240 > $(window).height()) {
	        items.css("top", -(items.height() + 8));
            items.show();
	    } else {
	        items.slideDown("fast").show();
	        items.css("top", 30);
	    }

	    $(root).addClass("open");
	    $(document).bind("click", hideMenuList);
	}

	var hideMenuList = function () {
	    $(document).unbind("click", hideMenuList);
	    items.hide();
	    $(root).removeClass("open");
	    isOpen = false;
	}

	var menuItemSelected = function (evt) {
	    var div = $("<div/>");
	    div.css("width", widthToSet);
	    if (evt.selectedItem.data())
	        div.data(evt.selectedItem.data());
	    div.html(evt.selectedItem.html());
	    $(root).find(".selected").html(div);
	    evt.stopPropagation();
	    hideMenuList();
	    if (clickFunction != null)
	        clickFunction(evt.currentTarget);
	    else
	    	root.trigger("itemSelected");
	}	
}