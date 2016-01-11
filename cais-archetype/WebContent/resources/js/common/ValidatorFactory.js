function ValidatorFactory() { }

ValidatorFactory.validate = function (rootElement) {
    $(rootElement).find(".field-tooltip-icon").remove();
    $(rootElement).find("label").removeClass("field-alert");
    $(rootElement).find(".details-warning").hide();
    $(rootElement).find(".scrollable-content").css("top", 41);
	$(rootElement).find(".server-error-list").hide();
	
    var validateTracker = {};

    $(rootElement).find("input[type=text][required=required]").each(function () {
    	var value = $.trim($(this).val());
        if (value == "") {
            validateTracker.text = false;
            $(rootElement).find("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
            return;
        }
        
        if ($(this).attr("data-type") == "email") {
        	if(!validateEmail(value)) {
    			validateTracker.email = false;
    			$(rootElement).find("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
    		}
    	}
    });

    $(rootElement).find("input[type=password][required=required]").each(function () {
        if ($.trim($(this).val()) == "") {
            validateTracker.text = false;
            $(rootElement).find("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
        }
    });

    var radioSelection = {};
    $(rootElement).find("input[type=radio][required=required]").each(function () {
        var radioGroup = $(this).attr("name");
        if (this.checked == true || radioSelection[radioGroup] == "valid") {
            validateTracker.radio = true;
            radioSelection[radioGroup] = "valid";
        } else {
            validateTracker.radio = false;
            radioSelection[radioGroup] = "invalid";
        }
    });

    $.each(radioSelection, function (key, value) {
        if (value != undefined && value == "invalid") {
            $(rootElement).find("label[data-field=" + key + "]").addClass("field-alert");
        }
    });

    $(rootElement).find(".white-dropdown-menu[data-required=required]").each(function () {
        if ($.trim($(this).find("div.selected").text()) == "--") {
            validateTracker.dropdown = false;
            $(rootElement).find("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
        }
    });

    var isValidated = true;

    $.each(validateTracker, function (key, value) {
        if (!value) {
            $(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            $(rootElement).find(".details-warning div").text("Please fill in all the required fields before progressing.");
        	$(rootElement).find(".details-warning").show();
        	$(rootElement).find(".scrollable-content").css("top", 88);
            isValidated = false;
        }
        
        if (key == "email" && !value) {
            $(rootElement).find(".wizard-action-description").text("Please enter a valid email address before progressing.");
            $(rootElement).find(".details-warning div").text("Please enter a valid email address before progressing.");
    	}
    });

    return isValidated;
}

ValidatorFactory.processServerValidationError = function (serverError, root) {
    //formError object should have a reference to the field that produced the error, my instinct is just the property of the object which matches up to the data-field attributes
    //it should also have the error that should be displayed in the tooltip
	
	$(".server-error-list").hide();

    var showErrorTooltip = function (e) {
        var tooltip = $("<div class='form-validation-error-tooltip'/>");
        tooltip.text($(this).attr("data-error"));
        tooltip.css("top", e.pageY - 36).css("left", e.pageX + 20);
        tooltip.appendTo("body");
    }

    var hideErrorTooltip = function (e) {
        $("div.form-validation-error-tooltip").remove();
    }

    //Handle the field level errors from the server
    for (var i in serverError.fieldErrors) {
        for (var key in serverError.fieldErrors[i]) {
            var fieldError = $("label[data-field=" + key + "]");
            fieldError.addClass("field-alert");
            fieldError.attr("data-error", serverError.fieldErrors[i][key]);

            fieldError.on("mouseenter", showErrorTooltip);
            fieldError.on("mouseleave", hideErrorTooltip);
        }
    }

    //Handle the global level errors from the server
    if (serverError.globalErrors.length > 0) {
        var serverErrorList =  $(root).find(".server-error-list");
        
        var validatorFields = $(root).find(".validator-fields");
        
        //if this is the second check, remove the previous top style setting so
        validatorFields.removeAttr("style");
        
        var validatorFieldTop = parseInt(validatorFields.css("top").replace("px", ""));
        var errorList = $(root).find(".server-error-list ul");

    	errorList.empty();
    	
        for (var k in serverError.globalErrors) {
            var error = $("<li/>");
            error.append(serverError.globalErrors[k]);
            errorList.append(error);
        }
        
        
        serverErrorList.show();

        if(validatorFields.parent(".scrollable-content").length != 1) {
        	validatorFields.css("top", serverErrorList.height() + validatorFieldTop + 21);
        } else {
        	var scrollableContentTop = parseInt(validatorFields.parent(".scrollable-content").css("top").replace("px", ""));
        	validatorFields.parent(".scrollable-content").css("top", serverErrorList.height() + scrollableContentTop + 21);
        }
        //extra 21px to height is for padding of error list

        //testing that the errors can be hidden properly after addressing and sending to server again
        //serverError.globalErrors = [];
    } else {
        errorList.empty().hide();
        $(root).find(".validator-fields").removeAttr("style");
        validatorFields.parent(".scrollable-content").removeAttr("style");
    }
}

ValidatorFactory.processServerError = function(serverError) {
	var dialog = new Alert(serverError, "OK");
	$(document).bind("dialogs/server-errorLoaded", function() {
	});
}

ValidatorFactory.validateEmail = function(email) {
	var atpos=email.indexOf("@");
	var dotpos=email.lastIndexOf(".");
	var ret = true;
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		ret = false;
	}
	return ret;
}