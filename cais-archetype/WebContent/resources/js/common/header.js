(function() {

var user;

$(document).ready(function () {
    $(document).on("click", ".user-help", function (e) {
    	e.preventDefault();
        var alert = new Alert("For assistance please send an email to <a href='mailto:support@caisgroup.com'>support@caisgroup.com</a> and someone will get back to you shortly", "OK");
        $(document).trigger("dialogClose");
    });

    Server.caisUser.getLocalSessionInfo(function(response){
    	user = response;
    	$(document).trigger("contentVisibilityLoaded", response);
		checkUserSwitchMenu();
        doAfterHeaderLoad();
    });
});

$(document).bind("dialogs/help-dialogLoaded", function() {
	$(".close").click(function(){
		$(document).trigger("dialogClose");
	});
});

function doAfterHeaderLoad() {
	$(document).trigger("headerLoaded");

	/*$(this).find('.user-mgmt .user-name ul').click(function(e) {
		e.stopPropagation();
	});

	$('.user-mgmt .user-name').click(function(e) {
		e.preventDefault();
		$(this).find('ul').slideDown('fast', function() {
			$('body').one('click', function() {
				$('.user-mgmt .user-name ul').slideUp('fast');
			});
		});
	});	*/

    var quickSearchMenu = new MenuList(".quick-search .white-dropdown-menu");

    $(".quick-search").click(function(e) {
    	e.stopPropagation();
    });

    $(".user-mgmt .search").click(function (e) {
    	e.preventDefault();
        $(".quick-search").css("right", $("#control-bar").width() + 10);
        $(".quick-search").fadeToggle(function() {
        	$(".quick-search").find("input").focus();
	        $('body').one('click', function() {
				$(".quick-search").fadeToggle();
				$(".user-mgmt .search").toggleClass("active");
			});
        });
        $(".user-mgmt .search").toggleClass("active");
    });

    $(".search-input").click(function () {
        var search = {};
        search.parameter = $(".quick-search-content").find(".selected div").text();
        search.value = $(".quick-search-content").find("input").val();
        //localStorage["search"] = JSON.stringify(search);
        //window.location = "/cais-alternatives?search="+$(this).val();
    });

    $(".quick-search").find("input").keydown(function(e) {
        if (e.keyCode == 13) {
            $(".find-entity").click();
        }
    });
}


function initializeSecurityQuestions() {
	Server.getLandingSecurityQuestions(null, function(response) {
		var securityQuestions = response;
		$(".securityQuestionOne").empty();
		$(".securityQuestionTwo").empty();
		$(".securityQuestionThree").empty();
		for(var i in securityQuestions){
			var secQuestion = securityQuestions[i];
			if(secQuestion.questionsId == 1){
				var newList1 = $("<li data-id='"+secQuestion.securityquestionsId+"'>"+secQuestion.question+"</li>")
				$(".securityQuestionOne").append(newList1);
				
			}else if(secQuestion.questionsId==2){
				var newList2 = $("<li data-id='"+secQuestion.securityquestionsId+"'>"+secQuestion.question+"</li>")
				$(".securityQuestionTwo").append(newList2);
			}else{
				var newList3 = $("<li data-id='"+secQuestion.securityquestionsId+"'>"+secQuestion.question+"</li>")
				$(".securityQuestionThree").append(newList3);
			}
			
		}
		$(".white-dropdown-menu").each(function() {
			var menu = new MenuList($(this), null, null);
		});
	});
}

function checkUserSwitchMenu() {

	var topNavigator = $(".user-details ul");
	
	Server.checkUserSwitchMenu(null, function(response) {
		// Success
		var userSwitchMenu = response;	 	
		
		var menuNavigator = $(".header .topnav");

		topNavigator.find('.switch-user').click(switchUser);
		
		 $(".user-profile").click(function() {
			var dialog = new Dialog("my-profile");
			initializeSecurityQuestions();
		 });

		 topNavigator.find('.exit-user').click(function () {
		     localStorage.removeItem("user");
		     window.location = "/j_spring_security_exit_user";
		 });
		 
		 //logout??
		 topNavigator.find('.logout-user').click(function () {
		     localStorage.removeItem("user");
			 Server.getGBIParameters(null,
			 	function(response) {
					var gbiURL=response.gbiURL;
					var un = response.userName;
					var url = response.gbiURL+"PortalSignIn/SignOff?un="+un;
					document.location.href = url;
					document.location.href='/j_spring_security_logout';
			   	},
			   	function(response) {
			   		
			   	});
		 });
	//added code to hide and show the switch and exit menu
	});
}

var switchUserDialog;

function switchUser(){
    switchUserDialog = new Dialog("switch-user");
    $(".context-menu").hide();
    $(".available-user-wizard").addClass("active");
    setTimeout(function() {
    	$('.search-input').focus();
    }, 500);
    
   	createAvailableUserList();
   	 
//	$(".available-user-wizard .done").click(function (){
//    });

}

$(document).bind("dialogs/switch-userLoaded", function (event, options)
{		
    var switchDialog = $(".page-dialog.switch-user-wizard");
    switchDialog.find(".command-button.done").click(function() {
        var userName = $('input[data-field="switchUserName"]').data().userName;

        // when we click another user to switch to, clear out the existing localStorage of user so it will repopulate on successful login to the switched in user
        localStorage.removeItem("user");

	   //* var userName = $('input[data-field="switchUserName"]').val();
		$('<form action="/j_spring_security_switch_user" method="post"><input type="j_username" name="j_username" value="'+userName+'"/></form>')
		.appendTo('body').submit();
	    $(document).trigger("dialogClose");
    });
    
    $(".available-users .search-input").keyup(function ()
    	    {
    	        var list = $(".available-users .selection-list");
    	        var filter = $(this).val();

    	        if (filter)
    	        {
    	            $(list).find("li:not(:Contains(" + filter + "))").hide();
    	            $(list).find("li:Contains(" + filter + ")").show();
    	        } else
    	        {
    	            $(list).find("li").show();
    	        }
    	    });
    switchDialog.find(".close-icon").click(function ()
    	    {
    	        $(document).trigger("dialogClose");
    	    });

		});

function createAvailableUserList() {
	Server.getCAISUserNames( {}, function(response) {
		var users = response;
		var list = $("<ul class='selection-list'/>");
	    for (var i in users) {
	        var li = $("<li/>");
	        li.data(users[i]);
	        li.html(users[i].fullName + ' <span class="email-address">' + users[i].email +"</span>");
	        li.appendTo(list);
	    }
	
	    list.appendTo(".available-users .selection-section-list");
	    $(".available-users .selection-list").on("click", "li", addUserNameToSelectedUser);
	});	
}

function addUserNameToSelectedUser(e) {
	$('input[data-field="switchUserName"]').val($(e.currentTarget).text());
	$('input[data-field="switchUserName"]').data($(e.currentTarget).data());
}
}).call();