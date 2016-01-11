(function(){
var stepProgress = 1;
var userDetails;
$(document).ready(function ()
{	
	initializeUserDetails();	
    initializeMyProfileStepButtons();
    initializeWizardSectionNavigation();
    initializeBindings();
    initializeSecurityQuestions();
});

function initializeUserDetails() {
	Server.getNewLandingDetails( {}, function(response) {
		if(response.length > 0) {
			userDetails = response;
			triggerUserDetailsBindings(userDetails);
			$("#newUserName").val(userDetails[0].userName);
			var name =  userDetails[0].firstName + " " + userDetails[0].lastName
			$("#newName").val(name);
			$("#newEmail").val(userDetails[0].userEmail);
		} else {
			 $(".wizard-action-description").text("Unable to initiate your account. Please contact your CAIS Administrator");
			 $(".wizard-top-content").hide();
			 $(".wizard-bottom-content").hide();
			 $(".wizard-navigation").hide();
			 $(".next").hide();			
		}		
	});
}

function initializeSecurityQuestions() {
	Server.getLandingSecurityQuestions( {}, function(response) {
		var securityQuestions = response;
		$(".securityQuestionOne").empty();
		$(".securityQuestionTwo").empty();
		$(".securityQuestionThree").empty();
		for(var i in securityQuestions) {
			var secQuestion = securityQuestions[i];
			
			if(secQuestion.questionsId == 1) {
				var newList1 = $("<li data-id='" + secQuestion.securityquestionsId + "'>" + secQuestion.question + "</li>");
				$(".securityQuestionOne").append(newList1);
				
			} else if (secQuestion.questionsId == 2) {
				var newList2 = $("<li data-id='" + secQuestion.securityquestionsId + "'>" + secQuestion.question + "</li>");
				$(".securityQuestionTwo").append(newList2);
			} else {
				var newList3 = $("<li data-id='" + secQuestion.securityquestionsId + "'>" + secQuestion.question + "</li>");
				$(".securityQuestionThree").append(newList3);
			}				
		}
		$(".white-dropdown-menu").each(function () {
			var menu = new MenuList($(this), null, null);
		});
	});
}

function initializeBindings() {
    BindingFactory.bindAll("#user-details-data");
}


function initializeMyProfileStepButtons() {
    $(".credentials .next").click(function () {
    	var password = $("#password").val();
    	var passwordConfirm = $("#passwordConfirm").val();
    	
	 	if(password != passwordConfirm) {
	 		$(".active .wizard-action-description").text("The password do not match. Please retype the password.");
			$("label[data-field=password]").addClass("field-alert");
			$("label[data-field=passwordConfirm]").addClass("field-alert");
	 		return;
	 	}
	 	
        if (ValidatorFactory.validate($(".credentials"))) {
        	regex1 = /^(?=.*[A-Z])(?=.*\d).*$/;
      	  	if(password.length < 8) {
	      	  	$(".active .wizard-action-description").text("Password must be atleast 8 characters.");
				$("label[data-field=password]").addClass("field-alert");
				$("label[data-field=passwordConfirm]").addClass("field-alert");
		 		return;
      	  	} else if (!regex1.test(password)) {
	      	  	$(".active .wizard-action-description").text("Password must contain atleast one number and one uppercase letter.");
				$("label[data-field=password]").addClass("field-alert");
				$("label[data-field=passwordConfirm]").addClass("field-alert");
		 		return;
      	  	} else {
	            $(".credentials").removeClass("active");
	            $(".user-details").addClass("active");
	            $(".wizard-navigation li.active").removeClass("active");
	            $(".wizard-navigation li[data-section=2]").addClass("active");
	            initializeBindings();
	
	            if (stepProgress < 2)
	                stepProgress = 2;
      	  	}
        }
    });

    $(".user-details .prev").click(function () {
        $(".user-details").removeClass("active");
        $(".credentials").addClass("active");
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation li[data-section=1]").addClass("active");
    });

    $(".user-details .done").click(function ()
    {
        if (ValidatorFactory.validate($(".user-details")))
        {
        	var securityQuestions = {};
        	
        	$("input[type=text][data-field]").each(function () {
                var propertyName = $(this).attr("data-field");
                securityQuestions[propertyName] = $(this).val();
            });
        	
        	$("input[type=password][data-field]").each(function () {
                var propertyName = $(this).attr("data-field");
                securityQuestions[propertyName] = $(this).val();
            });
        	
        	$("input[type=text][data-binding]").each(function () {
                var propertyName = $(this).attr("data-binding");
                securityQuestions[propertyName] = $(this).val();
            });
        	
        	$(".white-dropdown-menu[data-field]").each(function ()
        	{
        		var propertyName = $(this).attr("data-field");
        		securityQuestions[propertyName] = $(this).find(".selected div").data().id;
        	});
        	securityQuestions["addressId"] = userDetails[0].addressId;
        	var securityQuestionsString = JSON.stringify(securityQuestions)
        	Server.updateProfileUserList(securityQuestionsString, function() {
        		   document.location.href = "/j_spring_security_logout";
        	}, function(response) {
                new Alert('Error: ' + response[0], 'OK');
            });
        	
        }
    });
}

function initializeWizardSectionNavigation()
{
    $(".wizard-navigation li").click(function ()
    {
        var selectedSectionStep = parseInt($(this).attr("data-section"));
        if (selectedSectionStep <= stepProgress)
        {
            $(".wizard-navigation li.active").removeClass("active");
            $(this).addClass("active");
            $(".wizard-content.active").removeClass("active");
            $(".wizard-content[data-section=" + selectedSectionStep + "]").addClass("active");
        }
    });
}

function triggerUserDetailsBindings(userDetails) {
    BindingFactory.triggerBinding(userDetails, "userDetails");
}

}).call();