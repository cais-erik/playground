function BindingFactory(){}

BindingFactory.bindAll = function (rootContainer) {
    $(rootContainer).on("updateBinding", "input[type=text][data-binding]", function (event, eventData)
    {
        BindingFactory.updateTextInputBindings(this, eventData);
    });

    $(rootContainer).on("updateBinding", "input[type=radio][data-binding]", function (event, eventData)
    {
        BindingFactory.updateRadioButtonBindings(this, eventData);
    });

    $(rootContainer).on("updateBinding", "input[type=checkbox][data-binding]", function (event, eventData)
    {
        BindingFactory.updateCheckBoxBindings(this, eventData);
    });

    $(rootContainer).on("updateBinding", "select[data-binding]", function (event, eventData)
    {
        BindingFactory.updateSelectBindings(this, eventData);
    });

    $(rootContainer).on("updateBinding", ".white-dropdown-menu[data-binding]", function (event, eventData)
    {
        BindingFactory.updateCustomSelectBindings(this, eventData);
    });

    $(rootContainer).on("updateBinding", ".narrow-white-dropdown-menu[data-binding]", function (event, eventData)
    {
        BindingFactory.updateNarrowCustomSelectBindings(this, eventData);
    });
}

BindingFactory.triggerBinding = function (eventData, bindingGroup) {
	if(eventData == null)
		return;

    $("input[data-group=" + bindingGroup + "]").trigger("updateBinding", eventData);
    $("select[data-group=" + bindingGroup + "]").trigger("updateBinding", eventData);
    $(".white-dropdown-menu[data-group=" + bindingGroup + "]").trigger("updateBinding", eventData);
    $(".narrow-white-dropdown-menu[data-group=" + bindingGroup + "]").trigger("updateBinding", eventData);
}

BindingFactory.updateTextInputBindings = function(element, data) {
	var property = $(element).attr("data-binding");
	if(data[property] == null)
	    return;

	var datePicker = $(element).data("kendoDatePicker");
	if (datePicker) {
	    datePicker.value(data[property]);
	} else {
	    $(element).val(data[property]);
	}
}

BindingFactory.updateRadioButtonBindings = function (element, data) {
    var property = $(element).attr("data-binding");

    if (data[property] == null)
        return;

    if (element.value.toString() == data[property].toString())
        element.checked = true;
}

BindingFactory.updateCheckBoxBindings = function (element, data) {
    var property = $(element).attr("data-binding");

    if (data[property] == null)
        return

    if (data[property] == "true" || data[property] == "1")
        element.checked = true;
    else
        element.checked = false;
}

BindingFactory.updateSelectBindings = function (element, data) {
    var property = $(element).attr("data-binding");

    if (data[property] == null)
        return;

    $(element).val(data[property]);
}

BindingFactory.updateCustomSelectBindings = function(element, data) {
    var property = $(element).attr("data-binding");

    if (data[property] == null)
        return;

    if($(element).attr("data-actualValue") == "true")
        $(element).find(".selected div").text(data[property]).data(data[property]);
    else
	{
	$(element).find(".itemsList li").each(function(){
    	if($(this).data().id == data[property])
    		$(element).find(".selected div").text($(this).text());
    		$(element).find(".selected div").data().id = data[property];
	    });
	}
}

BindingFactory.updateNarrowCustomSelectBindings = function (element, data) {
    var property = $(element).attr("data-binding");

    if (data[property] == null)
        return;

    $(element).find(".selected div").text(data[property]);
}
