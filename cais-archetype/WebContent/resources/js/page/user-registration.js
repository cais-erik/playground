(function() {
	$.jMaskGlobals.watchDataMask = true;
	if (!Modernizr.input.placeholder) $('label').show();
	var $regForm = $("#registration-form");
	$regForm.find("input:not(.readonly)").first().select();
	function dropdownChange(e){
		var $selectedItem = $(e.sender.element),
			$selectedData = $(e.sender.span[0]),
			kendoInstance = $selectedItem.data("kendoDropDownList"),
			specialShow = $selectedItem.data("special-show"),
			linkedField = $selectedItem.data("linked-field");
		if(kendoInstance){
			var currentValue = kendoInstance.value();
			if(!currentValue || currentValue==''){
				$selectedData.addClass('unrelevant-data');
			}else{
				$selectedData.removeClass('unrelevant-data');
			}
			if(linkedField){
				var $linkedField = $("#"+linkedField),
					linkedFieldDropdown =	$linkedField.data("kendoDropDownList"),
					$linkedFieldWithCondition = $("#"+linkedField+"-"+specialShow),
					linkedFieldWithConditionDropdown = $linkedFieldWithCondition.data("kendoDropDownList");
				if(specialShow === currentValue){
					$linkedField.prop("disabled", true);
					$linkedFieldWithCondition.prop("disabled", false);

					if(linkedFieldDropdown){
						linkedFieldDropdown.enable(false);
						$linkedField.closest(".k-widget").hide();
					}else{
						$linkedField.css('display', 'none');
					}
					if(linkedFieldWithConditionDropdown){
						linkedFieldWithConditionDropdown.enable(true);
						$linkedFieldWithCondition.closest(".k-widget").show();
					}else{
						$linkedFieldWithCondition.css('display', 'block');
					}
					$linkedField.removeAttr('required');
					$linkedFieldWithCondition.attr('required', '');
				}else{
					$linkedField.prop("disabled", false);
					$linkedFieldWithCondition.prop("disabled", true);
					if(linkedFieldDropdown){
						linkedFieldDropdown.enable(true);
						$linkedField.closest(".k-widget").show();
					}else{
						$linkedField.css('display', 'block');
					}
					if(linkedFieldWithConditionDropdown){
						linkedFieldWithConditionDropdown.enable(false);
						$linkedFieldWithCondition.closest(".k-widget").hide();
					}else{
						$linkedFieldWithCondition.css('display', 'none');
					}
					$linkedField.attr('required', '');
					$linkedFieldWithCondition.removeAttr('required');
				}
			}

		}

	}
	$dropdown = $regForm.find("[data-role=dropdownlist]");
	if($dropdown.length>0){
		$dropdown.kendoDropDownList({
		    dataBound:dropdownChange,
		    change:dropdownChange,
		    open:function(e){
				e.sender.popup.element.addClass('dropdown-with-placeholder');
			}
		});
		$dropdown.each(function(){
			var $this = $(this);
			if($this.data("hide"))$this.closest(".k-widget").hide();
		});
	}
	$regForm.on('click', ".disabled", function(e){
		var $this = $(e.currentTarget);
		e.preventDefault();
		if(e.stopPropagation)e.stopPropagation();
		$this.parents('.disabled-error-container').addClass("show-disabled-message");
	});
	$regForm.on('click', "[data-enable-on-click]", function(e){
		var $this = $(e.currentTarget);
		$("#"+$this.data("enable-on-click")).removeClass("disabled");
		$this.parents('.disabled-error-container').removeClass("show-disabled-message");
	});
	$regForm.on('submit', function(){
		$regForm.find("button[type=submit]").attr('disabled', 'disabled');
	});
	
	
})();