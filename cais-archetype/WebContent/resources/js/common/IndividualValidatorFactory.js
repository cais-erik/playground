function IndividualValidatorFactory() { }

IndividualValidatorFactory.validate = function (rootElement)
{
    $(".field-tooltip-icon").remove();
    $("label").removeClass("field-alert");
    var validateTracker = {};

    $(rootElement).find("input[type=text][required=required]").each(function ()
    {
    	var jsTagsRegex = /\<|\>|\;|\$/g;
    	var inputVal = $.trim($(this).val());
        if ($.trim($(this).val()) == "" || jsTagsRegex.test(inputVal))  
        {
            validateTracker.text = false;
            $("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
            var alertField = $("label[data-field=" + $(this).attr("data-field") + "]").text();
            var alertMsg = alertField + " is not valid. Please enter a valid value before progressing."
            
            if($(rootElement).find(".wizard-action-description").length!=0){
            	$("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
                $(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            }else { //if($(rootElement).find(".details-warning").length!=0){
            	$("label[data-field=" + $(this).attr("data-binding") + "]").addClass("field-alert");
                $(rootElement).find(".details-warning div").text("Please fill in all the required fields before progressing.");
            	$(rootElement).find(".details-warning").show();
            	$(rootElement).find(".scrollable-content").css("top", 96);
            }
            /*else{
            	$("label[data-field=" + $(this).attr("data-binding") + "]").addClass("field-alert");
                $(".existing-entity .details-warning-existing div").text("Please fill in all the required fields before progressing.");
            	$(".exisitng-entity .details-warning-existing").show();
            	$(".existing-entity .scrollable-content").css("top", 88);
            	$(".existing-entity .details-warning-existing").fadeOut(4000, function(){
            		$(".existing-entity .scrollable-content").css("top", 41);	    		 
            	});
            }*/
            
            if(inputVal!=""){
            	$(rootElement).find(".wizard-action-description").text(alertMsg);
            	return false;
            }
        }
    });

    $(rootElement).find("input[type=text][required=email],input[type=email][required=required]").each(function ()
    {
        var $this = $(this);
    	if ($.trim($this.val()) == "")
    	{

    		validateTracker.text = false;
           // $("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
    		var alertField = $("label[data-field=" + $this.attr("data-field") + "]").text();
    		var alertMsg = alertField + " is not valid. Please enter a valid value before progressing."
    		if($(rootElement).find(".wizard-action-description").length!=0){
            	$("label[data-field=" + $this.attr("data-field") + "]").addClass("field-alert");
                $(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            }else { //if($(rootElement).find(".details-warning").length!=0){
            	$("label[data-field=" + $this.attr("data-binding") + "]").addClass("field-alert");
                $(rootElement).find(".details-warning div").text("Please fill in all the required fields before progressing.");
            	$(rootElement).find(".details-warning").show();
            	$(rootElement).find(".scrollable-content").css("top", 96);
            }
            if($this.filter("[required=required]").length>0){
                $this.blur();
                return false;
            }
       }else{
    		var email = $.trim($(this).val());
    		
    		if(!validateEmail(email)){
    			validateTracker.text = false;
    			$("label[data-field=" + $this.attr("data-field") + "]").addClass("field-alert");
    			if($(rootElement).find(".wizard-action-description").length!=0){
                	$("label[data-field=" + $this.attr("data-field") + "]").addClass("field-alert");
                    $(rootElement).find(".wizard-action-description").text("Please enter a valid email address before progressing.");
                }else { //if($(rootElement).find(".details-warning").length!=0){
                	$("label[data-field=" + $this.attr("data-binding") + "]").addClass("field-alert");
                    $(rootElement).find(".details-warning div").text("Please enter a valid email address before progressing.");
                	$(rootElement).find(".details-warning").show();
                	$(rootElement).find(".scrollable-content").css("top", 96);
                }
    			return false;
    		}
    	}
    });
    
    $(rootElement).find("input[type=text][required=altEmail]").each(function ()
    {
    	var alternateEmail = $.trim($(this).val());
    	if(alternateEmail.length>0 && !validateEmail(alternateEmail)){
			validateTracker.text = false;
			$("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
			if($(rootElement).find(".wizard-action-description").length!=0){
            	$("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
                $(rootElement).find(".wizard-action-description").text("Please enter a valid email address before progressing.");
            }else { //if($(rootElement).find(".details-warning").length!=0){
            	$("label[data-field=" + $(this).attr("data-binding") + "]").addClass("field-alert");
                $(rootElement).find(".details-warning div").text("Please enter a valid email address before progressing.");
            	$(rootElement).find(".details-warning").show();
            	$(rootElement).find(".scrollable-content").css("top", 96);
            }
			return false;
	    }
    });
    
    $(rootElement).find("input[type=password][required=required]").each(function ()
    {
        if ($.trim($(this).val()) == "")
        {
            validateTracker.text = false;
            $("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
        }
    });

    var radioSelection = {};
    $(rootElement).find("input[type=radio][required=required]").each(function ()
    {
        var radioGroup = $(this).attr("name");
        if (this.checked == true || radioSelection[radioGroup] == "valid")
        {
            validateTracker.radio = true;
            radioSelection[radioGroup] = "valid";
        }
        else
        {
            validateTracker.radio = false;
            radioSelection[radioGroup] = "invalid";
        }
    });

    $.each(radioSelection, function (key, value)
    {
        if (value != undefined && value == "invalid")
        {
            $(rootElement).find("label[data-field=" + key + "]").addClass("field-alert");
            if($(rootElement).find(".wizard-action-description").length!=0){
            	$(rootElement).find("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
                $(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            }else { //if($(rootElement).find(".details-warning").length!=0){
            	$(rootElement).find("label[data-field=" + $(this).attr("data-binding") + "]").addClass("field-alert");
                $(rootElement).find(".details-warning div").text("Please fill in all the required fields before progressing.");
            	$(rootElement).find(".details-warning").show();
            	$(rootElement).find(".scrollable-content").css("top", 96);
            }
        }
    });

    $(rootElement).find(".white-dropdown-menu[data-required=required]").each(function ()
    {
        if (($.trim($(this).find("div.selected").text()) == "--") || ($.trim($(this).find("span.selected").text()) == "--"))
        {
            validateTracker.dropdown = false;
            if($(rootElement).find(".wizard-action-description").length!=0){
            	$("label[data-field=" + $(this).attr("data-field") + "]").addClass("field-alert");
                $(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            }else { //if($(rootElement).find(".details-warning").length!=0){
            	$("label[data-field=" + $(this).attr("data-binding") + "]").addClass("field-alert");
                $(rootElement).find(".details-warning div").text("Please fill in all the required fields before progressing.");
            	$(rootElement).find(".details-warning").show();
            	$(rootElement).find(".scrollable-content").css("top", 96);
            	$(rootElement).find(".details-warning").hide();
            	$(rootElement).find(".scrollable-content").css("top", 51);
            }
			return false;
        }
    });

    var isValidated = true;

    $.each(validateTracker, function (key, value)
    {
        if (!value)
        {
        	//$(rootElement).find(".wizard-action-description").text("Please fill in all the required fields before progressing.");
            isValidated = false;
        }
    });
    
    if(isValidated)
	{
    	$(rootElement).find(".details-warning").hide();
    	$(rootElement).find(".scrollable-content").css("top", 51);
	}    

    return isValidated;
}

//should probably change the name of this to something more fitting
IndividualValidatorFactory.validateServerResponse = function (formError)
{
	//formError object should have a reference to the field that produced the error, my instinct is just the property of the object which matches up to the data-field attributes
	//it should also have the error that should be displayed in the tooltip
	
    var showErrorTooltip = function (e)
    {
        var tooltip = $("<div class='form-validation-error-tooltip'/>");
        tooltip.text($(this).attr("data-error"));
        tooltip.css("top", e.pageY - 36).css("left", e.pageX + 20);
        tooltip.appendTo("body");
    }

    var hideErrorTooltip = function (e)
    {
        $("div.form-validation-error-tooltip").remove();
    }
    
	var fieldError = $("label[data-field=" + formError.dataField + "]");
	fieldError.addClass("field-alert");
	fieldError.attr("data-error", formError.error);
	
	fieldError.on("mouseenter", showErrorTooltip);
	fieldError.on("mouseleave", hideErrorTooltip);
}


function validateEmail(email)
{
	var atpos=email.indexOf("@");
	var dotpos=email.lastIndexOf(".");
	var ret = true;
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length)
	{
		ret = false;
	}
	return ret;
}