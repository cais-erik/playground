(function(){
var detailDialog;
var selectedProducts_detail;
var availableProducts_detail;
var selectedPermissions_detail;
var isSelected;
var isOverriddenGroup;
var isOverriddenMember;
var clientHierarchyData;
var firmDetails;

$(document).bind("dialogs/cais-firm-detailLoaded", function(event, options) {
    detailDialog = $(".page-dialog.wizard");
    selectedId = options.selection;
    var selectedProducts;
    initializeNavigation_detail();
    intitializeLabelButtons();
    initFirmDetailsBinding();
    initPopulateProductLists();
    initPopulateSelectedProductLists();
    initializeAddRemoveAll_detail();
    createAvailableCaisGroupList_detail();
    createSelectedCaisGroupList_detail();

    detailDialog.find(".close-icon").click(function() {
        $(document).trigger("dialogClose");
    });

    $("li[data-section=3]").click(function() {
        if (!selectedProducts) {
            createProductPermissionList_detail("create");
            selectedProducts = true;
        } else {
            createProductPermissionList_detail("update");
        }
    });

    $(".saveFirm").click(function() {
        saveFirmDetails(this);
    });

    $(".showProductPermissions").click(function() {
        /**TODO - Replace the below code by triggering click event of ("li[data-section=3]")**/
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation [data-section=3]").addClass("active");
        $(".wizard-content.active").removeClass("active");
        $(".wizard-content[data-section=3]").addClass("active");
        if (!selectedProducts) {
            createProductPermissionList_detail("create");
            selectedProducts = true;
        } else {
            createProductPermissionList_detail("update");
        }

    });

    $(".saveTeamMembers").click(function() {
        saveMembers(this);
    });

    $(".savePermissions").click(function() {
        savePermissions(this);
    });

});

$(document).bind("dialogs/supervisor-firm-detailLoaded", function(event, options) {
    detailDialog = $(".page-dialog.wizard");
    selectedId = options.selection;
    initializeNavigation_detail();
    initFirmDetailsBinding();
    initializeFirmDetailsBindings();
    initPopulateSelectedProductLists();
    initCaisTeamMembersByClientId();

    $(".save").click(function() {
        saveFirmDetails(this);
    });


    detailDialog.find(".close-icon").click(function() {
        $(document).trigger("dialogClose");
    });
});

$(document).bind("dialogs/cais-group-detailLoaded", function(event, options) {
    detailDialog = $(".page-dialog.wizard");
    var selectedProducts;
    selectedId = options.selection;
    initializeNavigation_detail();
    intitializeLabelButtons();
    initGroupDetailsBinding_detail();
    initPopulateProductGroup();
    initPopulateSelectedProductGroup();
    createAvailableCaisListForGroups_detail();
    createSelectedCaisListForGroups_detail();
    initMemberSaveButton();
    detailDialog.find(".close-icon").click(function() {
        $(document).trigger("dialogClose");
    });


    $(".showProductPermissions").click(function() {
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation [data-section=3]").addClass("active");
        $(".wizard-content.active").removeClass("active");
        $(".wizard-content[data-section=3]").addClass("active");
        if (!selectedProducts) {
            createProductPermissionList_detail("create");
            selectedProducts = true;
        } else {
            createProductPermissionList_detail("update");
        }
    });

    $("li[data-section=3]").click(function() {
        if (!selectedProducts) {
            createProductPermissionList_detail("create");
            selectedProducts = true;
        } else {
            createProductPermissionList_detail("update");
        }
    });

    $(".label_check.override").click(function() {
    if ($(this).hasClass("check-on") && isOverriddenGroup == 0) {
            $(".saveOverride").show();
            $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);
            $(".available-groups").on("click", "li", populateCaisMemberList_detail);
        } else if ((($(this).hasClass("check-on"))) && isOverriddenGroup == 1) {
            $(".saveOverride").show();
            $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);
            $(".available-groups").on("click", "li", populateCaisMemberList_detail);
        } else if ((!($(this).hasClass("check-on"))) && isOverriddenGroup == 1) {
            $(".saveOverride").show();
            $(".selected-members").unbind('click');
            $(".available-groups").unbind('click');
        }else {
            $(".saveOverride").hide();
            $(".selected-members").unbind('click');
            $(".available-groups").unbind('click');
        }
    });

    $(".saveGroup").click(function() {
        saveFirmDetails(this);
    });

    $(".saveOverride").click(function() {
        saveMembersForGroup(this);
    });
});

$(document).bind("dialogs/supervisor-group-detailLoaded", function(event, options)
{
    detailDialog = $(".page-dialog.wizard");
    selectedId = options.selection;
    initializeNavigation_detail();
    initGroupDetailsBinding_detail();
    initPopulateSelectedProductGroup();
    initCaisTeamMembersByAdvisorId();
    detailDialog.find(".close-icon").click(function()
    {
        $(document).trigger("dialogClose");
    });
    $(".saveGroup").click(function()
    {
        saveFirmDetails(this);
    });

});

$(document).bind("dialogs/cais-member-detailLoaded", function(event, options)
{
    detailDialog = $(".page-dialog.detail");
    var selectedProducts;
    selectedId = options.selection;
    //teamId = options.teamId;
    initializeNavigation_detail();
    initPopulateProductMember();
    initializeProductFilters_detail();
    initPopulateSelectedProductMember();
    initProductSaveButton();
    initUserDetailsBinding();

    $(".showProductPermissions").click(function() {
        $(".wizard-navigation li.active").removeClass("active");
        $(".wizard-navigation [data-section=3]").addClass("active");
        $(".wizard-content.active").removeClass("active");
        $(".wizard-content[data-section=3]").addClass("active");
        if (!selectedProducts){
            createProductPermissionList_detail("create");
            selectedProducts = true;
        }
        else{
            createProductPermissionList_detail("update");
        }
    });

    $("li[data-section=3]").click(function() {
        if (!selectedProducts){
            createProductPermissionList_detail("create");
            selectedProducts = true;
        }
        else {
            createProductPermissionList_detail("update");
        }
    });

    // Wire up checkboxes for user-details
    $(".user-details .label_check").click(function() {
        $(this).toggleClass("check-on");
    });

    $(".label_check.override").click(function() {
        $(this).toggleClass("check-on");
        if ($(this).hasClass("check-on") && isOverriddenMember==0){
            $(".saveOverride").show();
            $(".available-products .selection-list").on("click", "li", addProductToSelectedList_detail);
            $(".selected-products .selection-list").on("click", "li", removeProductFromSelectedList_detail);
            //isOverriddenMember=1;
        }else if ((($(this).hasClass("check-on"))) && isOverriddenMember==1){
            $(".saveOverride").show();
            $(".available-products .selection-list").on("click", "li", addProductToSelectedList_detail);
            $(".selected-products .selection-list").on("click", "li", removeProductFromSelectedList_detail);
            //isOverriddenMember=0;
        }else if ((!($(this).hasClass("check-on"))) && isOverriddenMember==1){
            $(".saveOverride").show();
            $(".available-products .selection-list").off("click", "li", addProductToSelectedList_detail);
            $(".selected-products .selection-list").off("click", "li", removeProductFromSelectedList_detail);
        }else{
            $(".saveOverride").hide();
            $(".available-products .selection-list").off("click", "li", addProductToSelectedList_detail);
            $(".selected-products .selection-list").off("click", "li", removeProductFromSelectedList_detail);
            //isOverriddenMember=0;
        }
    });
    initUserPermissions();
    //initCaisTeamMembersByUserId();

    detailDialog.find(".close-icon").click(function()
    {
        $(document).trigger("dialogClose");
    });

    $(".saveUserDetails").click(function()
    {
        updateUserRole(selectedId);
        saveFirmDetails(this);
    });

    $(".saveOverride").click(function()
    {
        savePermissionsForUser(this);
    });
    $(".saveFunctions").click(function()
    {
        updatePermissions(this);
    });


});

$(document).bind("dialogs/supervisor-member-detailLoaded", function(event, options)
{
     detailDialog = $(".page-dialog.detail");
     selectedId = options.selection;
     //teamId = options.teamId;
     initializeNavigation_detail();
     initUserDetailsBinding();
     initPopulateSelectedProductMember();
     initUserPermissions();
     //initCaisTeamMembersByUserId();
     detailDialog.find(".close-icon").click(function()
     {
         $(document).trigger("dialogClose");
     });
     $(".saveUserDetails").click(function()
     {
         updateUserRole(selectedId);
         saveFirmDetails(this);
     });
     $(".saveFunctions").click(function()
     {
         updatePermissions(this);
     });
});

$(document).bind("dialogs/member-detailLoaded", function(event, options)
{
    detailDialog = $(".page-dialog.detail");
     selectedId = options.selection;
     //teamId = options.teamId;
     initializeNavigation_detail();
     initUserDetailsBinding();
     initPopulateSelectedProductMember();
     initUserPermissions();
     //initCaisTeamMembersByUserId();
    detailDialog.find(".close-icon").click(function()
    {
     $(document).trigger("dialogClose");
    });
    $(".saveUserDetails").click(function()
    {
     saveFirmDetails(this);
    });

});

$(document).bind("dialogs/admin-cais-detailLoaded", function(event, options) {
    detailDialog = $(".page-dialog.detail");
    initializeNavigation_detail();
    selectedId = options.selection;
    initUserDetailsBinding();
    initPopulateProductCaisUser();
    initPopulateSelectedProductCaisUser();
    initUserPermissions();
    initInvestorAccess();
    initializeFirmGroupFilters_detail();
    $(".saveUserDetails").click(function()
    {
        saveUserDetails(this);
    });
    $(".saveFunctions").click(function()
    {
        updatePermissions(this);
    });
    $(".saveProducts").click(function()
    {
        savePermissionsForCaisUser(this);
    });
    $(".saveInvestors").click(function()
    {
        saveAdvisorTeam(this);
    });
    detailDialog.find(".close-icon").click(function()
    {
        $(document).trigger("dialogClose");
    });
    var notifyMenu = MenuList(detailDialog.find(".cais-user-role"), null, 110);

    //setup add and remove all in product selection
    initializeAddRemoveAll_detail();
});

$(document).bind("dialogs/my-profileLoaded", function(event, options) {
    detailDialog = $(".page-dialog.wizard");
    stepProgress = 1;

    initializeMyProfile();
    initUserNotifications();
});

function initializeMyProfile() {
    initializeMyProfileStepButtons();
    initializeNavigation_detail();
    initializeSecurityQuestions();

    detailDialog.find(".white-dropdown-menu").each(function() {
        var menu = new MenuList($(this), null, null);
    });

    detailDialog.find(".label_check").click(function() {
        $(this).toggleClass("check-on");
    });

    initializeMyProfileDetails();
    initializeBindings();
}

function initUserNotifications() {
    Server.getUserNotificationTypes( {}, function(response) {
        var noficationList = response;
        for(var k in noficationList) {
            var notiId = noficationList[k].emailNotificationId;
            var capacity = noficationList[k].notificationType;
            var description = noficationList[k].description;
            var label1 = "<label data-id="+notiId+" class='label_check'>"+ capacity +"</label>";
            var subLabel = "<div class='subLabel'>" + description + "</div>";
            $(".wizard-content-area.emailNotificationsList").append(label1);
            $(".wizard-content-area.emailNotificationsList").append(subLabel);
        }
        detailDialog.find(".label_check").click(function() {
                $(this).toggleClass("check-on");
        });


        Server.getCurrentUserNotifications( {}, function(response) {
            var notificationIds=response;
            populateUserNotifications_detail(notificationIds);
        });
    });
}

function populateUserNotifications_detail(notificationIds) {
    var notiIdList = [];
    for(var k in notificationIds) {
        var notiId = notificationIds[k].emailNotificationId;
        notiIdList.push(notiId.toString());
    }
    detailDialog.find(".notifications label").each(function() {
        var exists = $.inArray(($(this).attr("data-id")), notiIdList);
        if(exists>-1){
            $(this).toggleClass("check-on");
        }
    });
}

function initializeMyProfileDetails() {
    Server.myProfileDetails( {}, function(response) {
            myProfileDetails = response[0];
            if (myProfileDetails.questionsList.length > 0) {
                var questionOne = myProfileDetails.questionsList[0].question;
                var questionTwo = myProfileDetails.questionsList[1].question;
                var questionThree = myProfileDetails.questionsList[2].question;
                $("#questionOne").replaceWith($("<div style='width:200px;''>"+questionOne+"</div>").data("id", myProfileDetails.questionsList[0].questionId));
                $("#questionTwo").replaceWith($("<div style='width:200px;''>"+questionTwo+"</div>").data("id", myProfileDetails.questionsList[1].questionId));
                $("#questionThree").replaceWith($("<div style='width:200px;''>"+questionThree+"</div>").data("id", myProfileDetails.questionsList[2].questionId));
                $("#answerOne").val(myProfileDetails.questionsList[0].answer);
                $("#answerTwo").val(myProfileDetails.questionsList[1].answer);
                $("#answerThree").val(myProfileDetails.questionsList[2].answer);
            }
            triggerMyProfileDetailsBindings(myProfileDetails);
    });
}

function triggerMyProfileDetailsBindings(myProfileDetails) {
    BindingFactory.triggerBinding(myProfileDetails, "myProfileDetails");
}

function initializeBindings() {
    BindingFactory.bindAll("#my-profile-data");
}

function initializeMyProfileStepButtons() {
    $(".credentials .save").click(function() {
        var currentPassword = $("#currentPassword").val();
        var newPassword = $("#password").val();

        if(currentPassword == newPassword && !(currentPassword.length == 0)){
            $(".active .wizard-action-description").text("New password cannot be same as the current password.");
            $("label[data-field=currentPassword]").addClass("field-alert");
            return;
        }
        Server.currentPasswordMatch( {currPassword : currentPassword}, function(response) {
            if(response == "true") {
                var password = $("#password").val();
                var passwordConfirm = $("#passwordConfirm").val();
                if (password != passwordConfirm) {
                    $(".active .wizard-action-description").text("The password do not match. Please retype the password.");
                    $("label[data-field=password]").addClass("field-alert");
                    $("label[data-field=passwordConfirm]").addClass("field-alert");
                    return;
                } else if (IndividualValidatorFactory.validate($(".credentials"))) {
                    var regex1 = /[0-9]/;
                    if (password.length > 0 && password.length < 8) {
                        $(".active .wizard-action-description").text("Password must be atleast 8 characters.");
                        $("label[data-field=password]").addClass("field-alert");
                        $("label[data-field=passwordConfirm]").addClass("field-alert");
                        return;
                    } else if (password.length > 0 && password.length >= 8 && currentPassword.length==0) {
                        $(".active .wizard-action-description").text("Current Password cannot be blank.");
                        $("label[data-field=currentPassword]").addClass("field-alert");
                        return;
                    } else if (password.length > 0 && !regex1.test(password)) {
                        $(".active .wizard-action-description").text("Password must contain atleast one number.");
                        $("label[data-field=password]").addClass("field-alert");
                        $("label[data-field=passwordConfirm]").addClass("field-alert");
                        return;
                    } else {
                        $(".active .wizard-action-description").text("");
                        saveMyProfile($(".credentials .save"));
                    }
                }
            } else {
                $(".active .wizard-action-description").text("Current password does not match.");
                $("label[data-field=currentPassword]").addClass("field-alert");
            }
        });
    });

    $(".user-details .save").click(function() {
        if (IndividualValidatorFactory.validate($(".user-details"))) {
            saveMyProfile(this);
        }
    });

    $(".notifications .save").click(function() {
        saveUserNotifications(this);
    });
}

function saveMyProfile(saveButton) {
    var profileQuestions = {};

    $("input[type=text][data-field]").each(function() {
        var propertyName = $(this).attr("data-field");
        profileQuestions[propertyName] = $(this).val();
    });

    $("input[type=password][data-field]").each(function() {
        var propertyName = $(this).attr("data-field");
        profileQuestions[propertyName] = $(this).val();
    });

    $("input[type=text][data-binding]").each(function() {
        var propertyName = $(this).attr("data-binding");
        profileQuestions[propertyName] = $(this).val();
    });

    $(".white-dropdown-menu[data-field]").each(function() {
        var propertyName = $(this).attr("data-field");
        profileQuestions[propertyName] = $(this).find(".selected div").data().id;
    });
    profileQuestions["addressId"] = myProfileDetails.addressId;
    var profileQuestionsString = JSON.stringify(profileQuestions)

    Server.updateProfileUserList(profileQuestionsString, function() {
        notifySaveStarted(saveButton);
        notifySaveComplete(saveButton);
    }, function(e) {
        $(".active .wizard-action-description").text("Password must contain at least 1 uppercase letter, 1 lowcase letter and 1 number. Password must not match your recent ones.");
        $("label[data-field=password]").addClass("field-alert");
        $("label[data-field=passwordConfirm]").addClass("field-alert");
    });
}

function saveUserNotifications(saveButton){
    notifySaveStarted(saveButton);

    var notiList = [];
    $(".label_check.check-on").each(function() {
        var notiId = $(this).attr("data-id");
        notiList.push(notiId);
    });

    var notificationList = JSON.stringify(notiList)

    Server.updateUserNotifications( notificationList, function() {
        notifySaveComplete(saveButton);
    });
}


function initializeSecurityQuestions() {
    Server.getLandingSecurityQuestions( {}, function(response) {
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

function initFirmDetailsBindings() {
    Server.getFirmDetails( {clientId : selectedId}, function(response) {
        firmDetails = response[0];
        $(".firm-name").text(firmDetails.firmName);
        triggerFirmDetailsBindings(firmDetails);

        var canOpenGBI = firmDetails.canOpenGBIAccounts;
        if(canOpenGBI)
            $(".label_check.canOpenGBIAccounts").toggleClass("check-on");

    });
}

function initGroupDetailsBindings_detail() {
    Server.getGroupDetails( {advisorId : selectedId}, function(response) {
        groupDetails = response[0];
        $(".group-name").text(groupDetails.advisorName);
        triggerGroupDetailsBindings_detail(groupDetails);
    });
}

function initUserDetailsBindings()
{
    $('.update-email').click(updateEmail);
    $('.resend-activation').click(resendActivation);
    $('.reset-security-questions').click(resetSecurityQuestions);

    Server.getUserDetails( {selectedUserId : selectedId}, function(response) {
        userDetails = response[0];
        var userName = userDetails.firstName + " " + userDetails.lastName;
        $(".wizard-title.user-name").text(userName);
        triggerUserDetailsBindings(userDetails);
        var role = userDetails.role;
        if (role == "ROLE_SUPERVISOR") {
            $(".label_check.isSupervisor").toggleClass("check-on");
        }

        var isBlocked = userDetails.block;
        if(isBlocked)
            $(".label_check.isBlocked").toggleClass("check-on");

        var isActive = userDetails.isActive;
        if(!isActive)
            $(".label_check.isDeActivated").toggleClass("check-on");

        var canOpenGBIAccounts = userDetails.canOpenGBIAccounts;
        if(canOpenGBIAccounts)
            $(".label_check.userCanOpenGBIAccounts").toggleClass("check-on");

        var addFundspireAccess = $("<div class='command-button' data-thirdPartyAccess='fundspire'><a><div class='inner'>ADD ACCESS</div></a></div>");
        addFundspireAccess.click(addOrRemoveFundspireAccess);
        var removeFundspireAccess = $("<div class='command-button-black' data-thirdPartyAccess='fundspire'><a><div class='inner'>REMOVE ACCESS</div></a></div>");
        removeFundspireAccess.click(addOrRemoveFundspireAccess);

        var addGBIAccess = $("<div class='command-button' data-thirdPartyAccess='gbi' ><a><div class='inner'>ADD ACCESS</div></a></div>");
        addGBIAccess.click(addOrRemoveGBIAccess);
        var removeGBIAccess = $("<div class='command-button-black' data-thirdPartyAccess='gbi' ><a><div class='inner'>REMOVE ACCESS</div></a></div>");
        removeGBIAccess.click(addOrRemoveGBIAccess);


        //fundspire
        if (userDetails.fundspireAccountId > 0) {
            $("div[data-thirdPartyAccess=fundspire]").replaceWith(removeFundspireAccess);
        } else {
            $("div[data-thirdPartyAccess=fundspire]").replaceWith(addFundspireAccess);
        }
        //gbi
        if (userDetails.hasCAISPMAccess > 0) {
            $("div[data-thirdPartyAccess=gbi]").replaceWith(removeGBIAccess);
        } else {
            $("div[data-thirdPartyAccess=gbi]").replaceWith(addGBIAccess);
        }

        Server.caisUser.getLocalSessionInfo(function(user) {
            if (!user.caisemployee) { // TODO get var from the server for if the account has been activated
                $('#user-details .cais-employee-only').remove();
            }
        });

        var pointOfContactDataSource = new kendo.data.DataSource({
                                                   transport: {
                                                     read: {
                                                       url: "/api/user/pointOfContacts",
                                                       dataType: "json"
                                                     }
                                                   }
                                                 });

        var AIviewModel = kendo.observable({
          selectedContact: {
                shortName : userDetails.AIcontactName,
                userId : userDetails.AIcontactId
          },
          onChange: function() {
            var contactId = this.get("selectedContact").userId;
            Server.updatePointOfContact({ contactId : contactId, userId : userDetails.userId, businessLine :1}, function() {
            }, function(e) {                                                                                                      });
          },
          pointOfContacts: pointOfContactDataSource
        });

        var CMviewModel = kendo.observable({
          selectedContact: {
                shortName : userDetails.CMcontactName,
                userId : userDetails.CMcontactId
          },
           onChange: function() {
                      var contactId = this.get("selectedContact").userId;
                      Server.updatePointOfContact({ contactId : contactId, userId : userDetails.userId, businessLine :5}, function() {
                      }, function(e) {                                                                                                      });
                    },
          pointOfContacts: pointOfContactDataSource
        });

        var SPviewModel = kendo.observable({
          selectedContact: {
                shortName : userDetails.SPcontactName,
                userId : userDetails.SPcontactId
          },
           onChange: function() {
                      var contactId = this.get("selectedContact").userId;
                      Server.updatePointOfContact({ contactId : contactId, userId : userDetails.userId, businessLine :4}, function() {
                      }, function(e) {                                                                                                      });
                    },
          pointOfContacts: pointOfContactDataSource
        });

        kendo.bind($("#pointOfContactAI"), AIviewModel);
        kendo.bind($("#pointOfContactSP"), SPviewModel);
        kendo.bind($("#pointOfContactCM"), CMviewModel);
        kendo.bind($(".update-pointOfContact"), AIviewModel);

        kendo.init(detailDialog);
    });
}


function triggerFirmDetailsBindings(firmDetails) {
    BindingFactory.triggerBinding(firmDetails, "firmDetails");
}

function initializeFirmDetailsBindings() {
    BindingFactory.bindAll("#supervisor-firm-detail");
    BindingFactory.bindAll("#firm-details");
}

function triggerGroupDetailsBindings_detail(groupDetails) {
    BindingFactory.triggerBinding(groupDetails, "groupDetails");
}

function initializeGroupDetailsBindings_detail() {
    BindingFactory.bindAll("#group-details");
    BindingFactory.bindAll("#supervisor-group-details");
}

function triggerUserDetailsBindings(userDetails) {
    BindingFactory.triggerBinding(userDetails, "userDetails");
}

function initializeUserDetailsBindings() {
    BindingFactory.bindAll("#user-details");
    BindingFactory.bindAll("#supervisor-member-details");
    BindingFactory.bindAll("#member-details");
    BindingFactory.bindAll("#cais-user-details");
}

function saveUserDetails(saveButton) {
    if (IndividualValidatorFactory.validate($(".user-details"))) {
        notifySaveStarted(saveButton);
        var user = {};
        var address = {};

        $(".active .wizard-action-description").text("");
        detailDialog.find("input[type=text][data-field]").each(function() {
            if ($(this).is('.userDetails')) {
                user[$(this).attr("data-field")] = $(this).val();
            } else {
                address[$(this).attr("data-field")] = $(this).val();
            }
        });

        var newAddress =  JSON.stringify(address);
        Server.updateFirmDetails( newAddress, function(response) {
            updateUserDetails(user,saveButton);
        });
    }
}

function updateUserDetails(user,saveButton) {
    user.userId=selectedId;

    user.role = detailDialog.find('[name=role]').val();

    var newUser =  JSON.stringify(user);
    Server.updateUserDetails( newUser, function(response) {
        notifySaveComplete(saveButton);
        $(".active .wizard-action-description").text("Modify User Details");
    });
}

//TODO
//This actually save User Details and not Firm Details and needs to be reworked as it has other dependency

function saveFirmDetails(saveButton) {
    if (IndividualValidatorFactory.validate($(".user-details"))) {
        var address = {};
        notifySaveStarted(saveButton);
        $(".active .wizard-action-description").text("Modify User Details");
        detailDialog.find("input[type=text][data-field]").each(function() {
            if (!$(this).is('.non-editable')) {
                address[$(this).attr("data-field")] = $(this).val();
            }
        });

        var clientGBIAccess = {};
        clientGBIAccess.canOpenGBIAccounts = 0;
        if($(".label_check.canOpenGBIAccounts").length > 0) {
            $(".label_check.canOpenGBIAccounts.check-on").each(function() {
                clientGBIAccess.canOpenGBIAccounts = 1;
            });
            clientGBIAccess.clientId = firmDetails.clientId;
            var newClientGBIAccess =  JSON.stringify(clientGBIAccess);
            Server.updateOpenGBIAccounts(newClientGBIAccess,function(response) {
                //do nothing
            });
        }

        var newAddress =  JSON.stringify(address);
        Server.updateFirmDetails( newAddress, function(response) {
            notifySaveComplete(saveButton);
        });
    }
}

function initializeNavigation_detail() {
    $(".wizard-navigation li").click(function() {
    var selectedSectionStep = parseInt($(this).attr("data-section"));
        $(".wizard-navigation li.active").removeClass("active");
        $(this).addClass("active");
        $(".wizard-content.active").removeClass("active");
        $(".wizard-content[data-section=" + selectedSectionStep + "]").addClass("active");
        detailDialog.find(".selection-section-list").each(function() {
            var scroller = $(this).data("jsp");
            if (scroller) {
                scroller.reinitialise();
            }
        });
    });
}

function initPopulateProductLists() {
    Server.getAvailableProductDetailsForFirm( {clientId : selectedId}, function(response) {
        availableProducts_detail = response;
        populateProductLists_detail();
    });
}

function initPopulateSelectedProductLists() {
    Server.getSelectedProductDetailsForFirm( {clientId : selectedId}, function(response) {
        selectedProducts_detail = response;
        populateSelectedProductsList_detail();
    });
}

function initPopulateProductGroup() {
    Server.getAvailableProductDetailsForGroup( {advisorId : selectedId}, function(response) {
        availableProducts_detail = response;
        populateProductLists_detail();
    });
}

function initPopulateSelectedProductGroup() {
    Server.getSelectedProductDetailsForGroup( {advisorId : selectedId}, function(response) {
        selectedProducts_detail = response;
        populateSelectedProductsGroup_detail();
    });
}

function initPopulateProductMember() {
    Server.getAvailableProductDetailsForMember( {selectedId : selectedId}, function(response) {
        availableProducts_detail = response;
        populateProductLists_detail();
    });
}

function initPopulateSelectedProductMember() {
    Server.getSelectedProductDetailsForMember( {selectedId : selectedId}, function(response) {
        selectedProducts_detail = response;
        populateSelectedProductsGroup_detail();
    });
}


function initPopulateProductCaisUser() {
    Server.getAvailableProductDetailsForCaisUser( {selectedId : selectedId}, function(response) {
        availableProducts_detail = response;
        populateProductLists_detail();
    });
}

function initPopulateSelectedProductCaisUser() {
    Server.getSelectedProductDetailsForCaisUser( {selectedId : selectedId}, function(response) {
        selectedProducts_detail = response;
        populateSelectedProductsList_detail();
    });
}

function populateProductLists_detail() {
        $(".available-products .selection-section-list").empty();
        var list = $("<ul class='selection-list'/>");
        for (var i in availableProducts_detail) {
            var li = $("<li/>");
            li.data(availableProducts_detail[i]);
            li.text(availableProducts_detail[i].legalName);
            li.appendTo(list);
        }

        list.appendTo(".available-products .selection-section-list");
        detailDialog.find(".available-products .selection-section-list").jScrollPane();
}

function populateSelectedProductsList_detail() {
    var list = $("<ul class='selection-list'/>");
    for (var i in selectedProducts_detail) {
        var li = $("<li/>");
        li.data(selectedProducts_detail[i]);
        li.text(selectedProducts_detail[i].legalName);
        li.appendTo(list);
    }

    list.appendTo(".selected-products .selection-section-list");
    $(".available-products .selection-section-list").on("click", "li", addProductToSelectedList_detail);
    $(".selected-products .selection-section-list").on("click", "li", removeProductFromSelectedList_detail);
    detailDialog.find(".selected-products .selection-section-list").jScrollPane();
}

function populateSelectedProductsGroup_detail() {
    var list = $("<ul class='selection-list'/>");
    for (var i in selectedProducts_detail) {
        var li = $("<li/>");
        li.data(selectedProducts_detail[i]);
        li.text(selectedProducts_detail[i].legalName);
        li.appendTo(list);
    }

    list.appendTo(".selected-products .selection-section-list");
    detailDialog.find(".product-access .selection-section-list").jScrollPane();
}

function addProductToSelectedList_detail(e) {
    $(e.currentTarget).appendTo(".selected-products .selection-list");
    $(".selected-products .selection-list li").tsort();

    detailDialog.find(".selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        if(scrollPane)
            scrollPane.reinitialise();
    });
}

function removeProductFromSelectedList_detail(e) {
    $(e.currentTarget).appendTo(".available-products .selection-list");
    $(".available-products .selection-list li").tsort();

    detailDialog.find(".selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        if(scrollPane)
            scrollPane.reinitialise();
    });

    if (selectedProducts_detail) {
        var index = $.inArray($(e.currentTarget).data(), selectedProducts_detail)
        selectedProducts_detail.splice(index, 1);
    }
}

function initializeAddRemoveAll_detail() {
    detailDialog.find(".product-access .select-all").click(function() {
        addAllProducts_detail();
    });

    detailDialog.find(".product-access .remove-all").click(function() {
        removeAllProducts_detail();
    });

    detailDialog.find(".investor-access .select-all").click(function() {
        addAllInvestors_detail();
    });

    detailDialog.find(".investor-access .remove-all").click(function() {
        removeAllInvestors_detail();
    });
}

function addAllProducts_detail() {
    $(".available-products .selection-list li").each(function() {
        $(this).appendTo(".selected-products .selection-list");
        $(".available-products .selection-list li").tsort();
    });

    detailDialog.find(".product-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function removeAllProducts_detail() {
    $(".selected-products .selection-list li").each(function() {
        $(this).appendTo(".available-products .selection-list");
        $(".available-products .selection-list li").tsort();
    });

    detailDialog.find(".product-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function addAllInvestors_detail() {
    $(".available-investors .selection-list li").each(function() {
        $(this).appendTo(".selected-investors .selection-list");
        $(".selected-investors .selection-list li").tsort();
    });

    detailDialog.find(".investor-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function removeAllInvestors_detail() {
    $(".selected-investors .selection-list li").each(function() {
        $(this).appendTo(".available-investors .selection-list");
        $(".available-investors .selection-list li").tsort();
    });

    detailDialog.find(".investor-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function saveProducts() {
    var saveProducts=[];
    saveProducts.push(parseInt(selectedId));
    $(".selected-products .selection-list li").each(function() {
        saveProducts.push($(this).data().productId);
    });
    var products =  JSON.stringify(saveProducts);
    Server.updateProductsList( products, function(response) {
    });
}

function initCaisTeamMembersByClientId() {
    Server.getCAISTeamMembersByClientId( {clientId : selectedId}, function(response) {
        var teamMembers = response;
        populateTeamMemberList_detail(teamMembers);
    });
}

function initCaisTeamMembersByAdvisorId() {
    Server.getCAISTeamMembersByAdvisorId( {advisorId : selectedId}, function(response) {
        var teamMembers = response;
        populateTeamMemberList_detail(teamMembers);
    });
}

function initCaisTeamMembersByUserId() {
    Server.getCAISTeamMembersByUserrId( {selectedId : selectedId}, function(response) {
        var teamMembers = response;
        populateTeamMemberList_detail(teamMembers);
    });
}

function initUserPermissions() {
    Server.getPermissions( {}, function(response) {
        var permList = response;
        for(var k in permList) {
            var permId = permList[k].permissionId;
            var permStr = getPermissionStrForId(permId);
            if(permId !== 12 && permId !== 13){
                var label = "<label data-id="+permId+" class='label_check'>"+permStr+"</label>";
                $(".wizard-content-area.permList").append(label);
            }
        }
        detailDialog.find(".permList .label_check").click(function() {
            $(this).toggleClass("check-on");
        });

        Server.getUserPermissionsByUserId( {selectedId : selectedId}, function(response) {
            var permissionsId = response;
            populateUserPermissionList_detail(permissionsId);
        });
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
    else if(id == 11)
        return "View Rebates";
    else if(id == 12)
        return "Commissions Model";
    else if(id == 13)
        return "Performance Management";
}

function populateTeamMemberForUser_detail(teamMembers) {
    for (var i in teamMembers) {
        var member = $("<li/>");
        member.append("<div>" + teamMembers[i].memberName + "</div>");
        member.append("<div>" + teamMembers[i].phone + "</div>");
        member.append("<div>" + teamMembers[i].email + "</div>");

        if (teamMembers[i].primary == true) {
            member.addClass("primary");
            member.prependTo($("." + teamMembers[i].groupName + "-members"));
        } else {
            member.appendTo($("." + teamMembers[i].groupName + "-members"));
        }
    }
}

function populateTeamMemberList_detail(teamMembers) {
    for (var i in teamMembers) {
        var member = $("<li/>");
        var groupName = "";
        member.append("<div>" + teamMembers[i].memberName + "</div>");
        member.append("<div>" + teamMembers[i].phone + "</div>");
        member.append("<div>" + teamMembers[i].email + "</div>");

        if(teamMembers[i].role=="ROLE_ADMIN") {
            groupName="admin";
        }
        if(teamMembers[i].role=="ROLE_FINOPS") {
            groupName="financial";
        }
        if(teamMembers[i].role=="ROLE_SALES") {
            groupName="sales";
        }
        if (teamMembers[i].primary == true) {
            member.addClass("primary");
            member.prependTo($("." + groupName + "-members"));
        } else {
            member.appendTo($("." + groupName + "-members"));
        }
    }
}

function createAvailableCaisListForGroups_detail() {
    Server.getTeamMembersForWizard( {}, function(response) {
            var teamMembers = response;
            var groupLabel = "";
            var list = $("<ul class='selection-list'/>");
            for (var i in teamMembers) {
                var li = $("<li/>");
                //doing the same thing here as we did with products above
                if(teamMembers[i].groupLabel=="ROLE_ADMIN") {
                    groupLabel="Admin";
                } else if (teamMembers[i].groupLabel=="ROLE_FINOPS") {
                    groupLabel="Financial Operations";
                } else if (teamMembers[i].groupLabel=="ROLE_SALES") {
                    groupLabel="Sales";
                }
                li.data("roleName", teamMembers[i].roleName);
                li.data(teamMembers[i]);
                li.text(groupLabel);
                //li.click(populateCaisMemberList_detail);
                li.appendTo(list);
            }

            list.appendTo(".available-groups .selection-section-list");
            $(".available-groups .selection-list li").tsort();
            //$(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);

        detailDialog.find(".cais-team .available-groups .selection-section-list").jScrollPane();
    });
}

function createSelectedCaisListForGroups_detail() {
    Server.getSelectedTeamMembersForGroup( {advisorId : selectedId}, function(response) {
        var teamMembers = response;
        var list = $("<ul class='selection-list'/>");
        for (var i in teamMembers) {
            var labelCheck = $("<label class='label_check'>Primary</label>");
            var li = $("<li/>");
            li.data(teamMembers[i]);
            li.text(teamMembers[i].memberName);
            li.append(labelCheck);
            li.appendTo(list);

            if(teamMembers[i].isPrimary == "0" || teamMembers[i].isPrimary == true)
                labelCheck.addClass("check-on");

            labelCheck.attr("data-group", teamMembers[i].roleName);
            labelCheck.click(function(evt) {
                evt.stopPropagation();
                $("label[data-group='" + $(this).attr("data-group") + "']").removeClass("check-on");
                $(this).toggleClass("check-on");
            });
        }

        list.appendTo(".selected-members .selection-section-list");
        $(".selected-members .selection-list li").tsort();
       // $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);

        detailDialog.find(".cais-team .selected-members .selection-section-list").jScrollPane();
    });
}

function createSelectedCaisGroupList_detail() {
    Server.getSelectedTeamMembersForFirm( {clientId : selectedId}, function(response) {
            var teamMembers = response;
            var list = $("<ul class='selection-list'/>");
            for (var i in teamMembers) {
                var labelCheck = $("<label class='label_check'>Primary</label>");
                var li = $("<li/>");
                li.data(teamMembers[i]);
                li.text(teamMembers[i].memberName);
                li.append(labelCheck);
                li.appendTo(list);

                if(teamMembers[i].isPrimary == "0" || teamMembers[i].isPrimary == true)
                    labelCheck.addClass("check-on");

                labelCheck.attr("data-group", teamMembers[i].roleName);
                labelCheck.click(function(evt) {
                    evt.stopPropagation();
                    $("label[data-group='" + $(this).attr("data-group") + "']").removeClass("check-on");
                    $(this).toggleClass("check-on");
                });
            }

            list.appendTo(".selected-members .selection-section-list");
            $(".selected-members .selection-list li").tsort();
            $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);

        detailDialog.find(".cais-team .selected-members .selection-section-list").jScrollPane();
    });
}

function createAvailableCaisGroupList_detail() {
    Server.getTeamMembersForWizard( {}, function(response) {
            var teamMembers = response;
            var groupLabel = "";
            var list = $("<ul class='selection-list'/>");
            for (var i in teamMembers) {
                var li = $("<li/>");
                //doing the same thing here as we did with products above
                if(teamMembers[i].groupLabel=="ROLE_ADMIN") {
                    groupLabel="Admin";
                } else if (teamMembers[i].groupLabel=="ROLE_FINOPS") {
                    groupLabel="Financial Operations";
                } else if (teamMembers[i].groupLabel=="ROLE_SALES") {
                    groupLabel="Sales";
                }
                li.data("roleName", teamMembers[i].roleName);
                li.data(teamMembers[i]);
                li.text(groupLabel);
                li.click(populateCaisMemberList_detail);
                li.appendTo(list);
            }

            //list.appendTo(".firm-details .available-groups .selection-section-list");
            list.appendTo(".available-groups .selection-section-list");
            $(".available-groups .selection-list li").tsort();
            $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);

        detailDialog.find(".cais-team .available-groups .selection-section-list").jScrollPane();
    });
}

function populateCaisMemberList_detail(e) {
    $("li.selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");
    $(".available-members .selection-section-list").remove();
    var list = $("<ul class='selection-list'/>");
    var listWrapper = $("<div class='selection-section-list'/>");
    var memberList = $(e.currentTarget).data().members;
    var isSelected;

    for (var i in memberList) {
        isSelected = false;
        $(".selected-members .selection-section-list .selection-list li").each(function() {
            if ($(this).text().indexOf(memberList[i].memberName) != -1) {
                isSelected = true;
                return;
            }
        });

        if (!isSelected) {
            var li = $("<li/>");
            li.data(memberList[i]);
            li.text(memberList[i].memberName);
            li.click(addMemberToSelectedList_detail);
            li.appendTo(list);
        }
    }

    list.appendTo(listWrapper);
    listWrapper.appendTo(".available-members");
    $(".available-groups .selection-list li").tsort();

    detailDialog.find(".cais-team .available-members .selection-section-list").jScrollPane();
}

function addMemberToSelectedList_detail(e) {
    var labelCheck = $("<label class='label_check'>Primary</label>");
    var memberGroup = $(".available-groups li.selected").data();

    labelCheck.attr("data-group", memberGroup.groupName);
    labelCheck.click(function(evt) {
        evt.stopPropagation();
        $("label[data-group='" + $(this).attr("data-group") + "']").removeClass("check-on");
        $(this).toggleClass("check-on");
    });
    $(e.currentTarget).appendTo(".selected-members .selection-list").append(labelCheck);
    //$(".selected-members .selection-list li").tsort();

    detailDialog.find(".cais-team .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function removeMemberFromSelectedList_detail(e) {
    $(this).remove();
}

function saveMembers(saveButton) {
    notifySaveStarted(saveButton);
    var selectedMembers = [];
    $(".selected-members .selection-list li").each(function() {
         var saveTeamMembers = {};
         saveTeamMembers.clientId = parseInt(selectedId);
         saveTeamMembers.userId = $(this).data().userId;
         saveTeamMembers.roleName = $(this).data().roleName;
         saveTeamMembers.isPrimary = $(this).find(".label_check").hasClass("check-on") ? true : false;
         selectedMembers.push(saveTeamMembers);
    });
    var selectedMembersString =  JSON.stringify(selectedMembers);
    Server.updateTeamMembersList( selectedMembersString, function(teamMembers) {
        notifySaveComplete(saveButton);
    });
}

function saveMembersForGroup(saveButton) {
    notifySaveStarted(saveButton);
    var selectedMembers = [];
    if($(".label_check.override").hasClass("check-on")) {
        isOverriddenGroup = 1;
    } else {
        isOverriddenGroup = 0;
    }
    $(".selected-members .selection-list li").each(function() {
         var saveTeamMembers = {};
         saveTeamMembers.clientId = parseInt(selectedId);
         saveTeamMembers.userId = $(this).data().userId;
         saveTeamMembers.roleName = $(this).data().roleName;
         saveTeamMembers.isPrimary = $(this).find(".label_check").hasClass("check-on") ? true : false;
         selectedMembers.push(saveTeamMembers);
    });
    var selectedMembersString =  JSON.stringify(selectedMembers);
    Server.updateTeamMembersForGroup( {overridden: isOverriddenGroup, teamMembersStr: selectedMembersString}, function(teamMembers) {
        notifySaveComplete(saveButton);
    });
}

function createProductPermissionList_detail(action) {
    switch(action) {
        case "create":
            selectedProducts_detail = [];
            $(".selected-products .selection-list li").each(function() {
                var product = $(this).data();
                product.legalName = $(this).text();
                if($(this).data().overview == undefined) {
                    product.overview = true;
                    product.performances = true;
                    product.mercer = true;
                    product.document = true;
                    selectedProducts_detail.push($(this).data());
                } else {
                    product.overview = $(this).data().overview;
                    product.performances = $(this).data().performances;
                    product.mercer = $(this).data().mercer;
                    product.document = $(this).data().document;
                    selectedProducts_detail.push($(this).data());
                }
            });

            var dataSource = new kendo.data.DataSource({
                data: selectedProducts_detail,
                width: 500,
                schema: {
                    model: {
                        id: "productId",
                        fields: {
                            productId: { editable: false, nullable: false },
                            legalName: { editable: false },
                            overview: { editable: true, type: "boolean" },
                            performances: { type: "boolean" },
                            mercer: { type: "boolean" },
                            document: { type: "boolean" }
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

                if ($.inArray(product, selectedProducts_detail) == -1) {
                    product.overview = true;
                    product.performances = true;
                    product.mercer = true;
                    product.document = true;

                    selectedProducts_detail.push($(this).data());
                }
            });
            var ds = $(".product-permissions .grid-wrapper").data("kendoGrid").dataSource;
            ds.read(selectedProducts_detail);
            //grid.refresh();
            break;
        default:
            break;
    }
}

function savePermissions(saveButton) {
    notifySaveStarted(saveButton);
    var selectedPermissionsString =  JSON.stringify(selectedProducts_detail);
    var productPermission = {};
    productPermission.permissions = selectedPermissionsString;
    productPermission.clientId = selectedId;
    var productPermissionsString =  JSON.stringify(productPermission);
    Server.updateProductPermission( productPermissionsString, function(response) {
        notifySaveComplete(saveButton);
    });
}

// super hack to update adv email address
function updateEmail(e) {
    e.preventDefault();
    var input = $('[name="update-email"]');
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!input.val().length || !emailRegex.test(input.val())) {
        new Alert('Please enter a valid email address', 'OK');
        return;
    }
    Server.doesEmailAddressExists({emailAddress: input.val()}, function(response) {
        if (response === 'true') {
            new Alert('This email address already exists. Please use a different email.', 'OK');
            input.val('');
        } else {
            $.postJSON('/api/users/' + selectedId + '/update_email', {email: input.val()}, function() {
                new Alert('The email address has been updated', 'OK');
                input.val('');
            }).error(function() {
                new Alert('Could not update email address.', 'OK');
            });
        }
    });
}

function resendActivation(e) {
    e.preventDefault();
    new Alert("Are you sure you would like to resend the new user activation email?", "YES", "NO");
    $(document).bind("alertConfirm", function() {
        $.postJSON('/api/users/' + selectedId + '/send_activation_email', null, function() {
            new Alert("The user activation email has been sent.", "OK");
        }).error(function() {
            new Alert("The activation email could not be sent. Please contact support", "OK");
        });
    });
}

function savePermissionsForUser(saveButton) {
    notifySaveStarted(saveButton);
    if($(".label_check.override").hasClass("check-on")) {
        isOverriddenMember = 1;
    } else {
        isOverriddenMember = 0;
    }
    var selectedPermissionsString =  JSON.stringify(selectedProducts_detail);
    var productPermission = {};
    productPermission.permissions = selectedPermissionsString;
    productPermission.selectedId = selectedId;
    productPermission.isOverriddenMember = isOverriddenMember;
    var productPermissionsString =  JSON.stringify(productPermission);
    Server.updateProductPermissionForUser( productPermissionsString, function(response) {
        notifySaveComplete(saveButton);
    });
}

function savePermissionsForCaisUser(saveButton) {
    notifySaveStarted(saveButton);
    var productAccess = {};
    var selectedProducts_detail = [];
    //selectedProducts_detail.userId = selectedId;
    $(".selected-products .selection-list li").each(function() {
        var product = $(this).data();
        product.legalName = $(this).text();
        product.overview = true;
        product.performances = true;
        product.mercer = true;
        product.document = true;
        selectedProducts_detail.push($(this).data());
    });
    productAccess.userId = selectedId;
    productAccess.productAccess = selectedProducts_detail;

    var selectedPermissionsString =  JSON.stringify(productAccess);
    Server.updateProductPermissionForCaisUser( selectedPermissionsString, function(response) {
        notifySaveComplete(saveButton);
    });
}


function populateSelectedInvestorsList_detail() {
    var list = $("<ul class='selection-list'/>");
    list.appendTo(".selected-investors .selection-section-list");

    detailDialog.find(".investor-access .selection-section-list").jScrollPane();
}

function initFirmDetailsBinding() {
    initFirmDetailsBindings();
    initializeFirmDetailsBindings();
}

function initGroupDetailsBinding_detail() {
    initGroupDetailsBindings_detail();
    initializeGroupDetailsBindings_detail();
}

function initUserDetailsBinding() {
    initUserDetailsBindings();
    initializeUserDetailsBindings();
}

function intitializeLabelButtons() {
     $(".label_check").click(function() {
         $(this).toggleClass("check-on");
     });
}

function initMemberSaveButton() {
    Server.isOverriddenGroup( {advisorId : selectedId}, function(response) {
        isOverriddenGroup = response;
        if (isOverriddenGroup == 1) {
            $(".saveOverride").show();
            $(".selected-members").on("click", "li", removeMemberFromSelectedList_detail);
            $(".available-groups").on("click", "li", populateCaisMemberList_detail);
            $(".label_check.override").addClass("check-on");
        } else {
            $(".saveOverride").hide();
            $(".selected-members").unbind('click');
            $(".available-groups").unbind('click');
        }
    });
}

function initProductSaveButton() {
    Server.isOverriddenMember( {selectedId : selectedId}, function(response) {
        isOverriddenMember = response;
        if(isOverriddenMember == 1) {
            $(".saveOverride").show();
            $(".available-products .selection-list").on("click", "li", addProductToSelectedList_detail);
            $(".selected-products .selection-list").on("click", "li", removeProductFromSelectedList_detail);
            $(".label_check.override").addClass("check-on");
        } else {
            $(".saveOverride").hide();
            $(".selected-members").unbind('click');
            $(".available-groups").unbind('click');
        }
    });
}

function updatePermissions(saveButton) {
    notifySaveStarted(saveButton);
    var user = {};
    user.userId = parseInt(selectedId);
    var permissionArr = [];
    detailDialog.find(".functions label.check-on").each(function() {
        permissionArr.push($(this).attr("data-id"));
    });
    user.permissionArr = permissionArr;
    var userStr = JSON.stringify(user);
    $.postJSON('/updateUserPermissions', userStr, function(response) {
        if(response.status=="success"){
            notifySaveComplete(saveButton);
        }
    });
}

function populateUserPermissionList_detail(permissionsId) {
    var permissions = [];
    for(var k in permissionsId) {
        var permId = permissionsId[k].permissionId;
        permissions.push(permId.toString());
    }
    detailDialog.find(".functions label").each(function() {
        var exists = $.inArray(($(this).attr("data-id")), permissions);
        if(exists>-1){
            $(this).toggleClass("check-on");
        }
    });
}

var savingRecord = $("<span style='margin-right: 10px;'>Saving Record ...</span>");
var recordSaved = $("<span style='margin-right: 10px;'>Save Successful</span>");

function notifySaveStarted(saveButton) {
    $(saveButton).hide();
    $(saveButton).parent().append(savingRecord);
}

function notifySaveComplete(saveButton) {
    savingRecord.replaceWith(recordSaved);
    window.setTimeout(function() {
        recordSaved.remove();
        $(saveButton).show();
    }, 2000);
}


function initInvestorAccess() {
    Server.constructHierarchy( null, function(response) {
        clientHierarchyData = response;
        createAvailableFirmsList_detail();
        createSelectedGroups_detail();
    });
}

function createSelectedGroups_detail() {
    Server.getSelectedGroups( {selectedId:selectedId}, function(response) {
        var selectedGroups = response;
        populateSelectedGroup_detail(selectedGroups);
    });
}

function populateSelectedGroup_detail(selectedGroups) {
     var list = $("<ul class='selection-list'/>");
        for (var i in selectedGroups) {
            var li = $("<li/>");
            li.data(selectedGroups[i]);
            li.data("advisorTeamId", selectedGroups[i].advisorTeamId);
            li.text(selectedGroups[i].fullName+" - "+selectedGroups[i].advisorName);
            li.appendTo(list);
        }

        list.appendTo(".cais-employee-detail .selected-groups .selection-section-list");
}

function createAvailableFirmsList_detail() {
    var list = $("<ul class='selection-list'/>");
    for (var i in clientHierarchyData) {
        var li = $("<li/>");
        //doing the same thing here as we did with products above
        li.data(clientHierarchyData[i]);
        li.text(clientHierarchyData[i].clientName);
        li.click(populateGroupList_detail);
        li.appendTo(list);
    }

    list.appendTo(".cais-employee-detail .available-firms .selection-section-list");
    $(".available-firms .selection-list li").tsort();
    $(".cais-employee-detail .selected-groups").on("click", "li", removeGroupFromSelectedList_detail);
}

function populateGroupList_detail(e) {
    $("li.selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");
    $(".cais-employee-detail .available-groups .selection-section-list").remove();
    var list = $("<ul class='selection-list'/>");
    var listWrapper = $("<div class='selection-section-list'/>");
    var groupList = $(e.currentTarget).data().teams;
    var clientId= $(e.currentTarget).data().clientId;
    var isSelected;

    for (var i in groupList) {
        isSelected = false;
        $(".cais-employee-detail .selected-groups .selection-section-list .selection-list li").each(function() {
            if ($(this).text().indexOf(groupList[i].teamName) != -1 ) {
                isSelected = true;
                return;
            }
        });

        if (!isSelected) {
            var li = $("<li/>");
            groupList[i].clientId = clientId;
            li.data(groupList[i]);
            li.data("advisorTeamId", groupList[i].advisorTeamId);

            li.text(groupList[i].teamName);
            li.click(addGroupToSelectedList_detail);
            li.appendTo(list);
        }
    }

    list.appendTo(listWrapper);
    listWrapper.appendTo(".cais-employee-detail .available-groups");
    $(".available-groups .selection-list li").tsort();

    detailDialog.find(".firm-access .available-groups .selection-section-list").jScrollPane();
}

function addGroupToSelectedList_detail(e) {
     $(e.currentTarget).appendTo(".selected-groups .selection-list").prepend($(".available-firms .selected").text() + " - ");
        $(".selected-groups .selection-list li").tsort();

        detailDialog.find(".firm-access .selection-section-list").each(function() {
            var scrollPane = $(this).data("jsp");
            scrollPane.reinitialise();
        });
}

function removeGroupFromSelectedList_detail(e) {
    $(this).remove();
}

function addAllGroups_detail() {
    $(".available-groups .selection-list li").each(function() {
        $(this).appendTo(".selected-groups .selection-list");
        $(".selected-groups .selection-list li").tsort();
    });

    detailDialog.find(".firm-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function removeAllGroups_detail() {
    $(".selected-groups .selection-list li").each(function() {
        $(this).remove();
    });

    detailDialog.find(".firm-access .selection-section-list").each(function() {
        var scrollPane = $(this).data("jsp");
        scrollPane.reinitialise();
    });
}

function saveAdvisorTeam(saveButton) {
    notifySaveStarted(saveButton);
    var user = {};
    user.userId = selectedId;
    var teamId = [];
    var clientId = [];

    $(".selected-groups .selection-list li").each(function() {
        teamId.push($(this).data().advisorTeamId);
    });

    $(".selected-groups .selection-list li").each(function() {
        var this_Id = $(this).data().clientId;
        if($.inArray(this_Id, clientId) == -1){
            clientId.push(this_Id);
        }
    });

    user.teamId = teamId;
    user.clientId = clientId;
    var userStr = JSON.stringify(user);
    Server.updateInvestorAccess( userStr, function(response) {
        notifySaveComplete(saveButton);
    });
}

function populateTeamMemberList_detail(teamMembers) {
    for (var i in teamMembers) {
            var member = $("<li/>");
            var groupName = "";
            member.append("<div>" + teamMembers[i].memberName + "</div>");
            member.append("<div>" + teamMembers[i].phone + "</div>");
            member.append("<div>" + teamMembers[i].email + "</div>");

            if(teamMembers[i].role=="ROLE_ADMIN") {
                groupName="admin";
            }
            if(teamMembers[i].role=="ROLE_FINOPS") {
                groupName="financial";
            }
            if(teamMembers[i].role=="ROLE_SALES") {
                groupName="sales";
            }
            if (teamMembers[i].primary == true) {
                member.addClass("primary");
                member.prependTo($("." + groupName + "-members"));
            } else {
                member.appendTo($("." + groupName + "-members"));
            }
    }
}

function initializeFirmGroupFilters_detail() {
    $(".available-firms .search-input").keyup(function() {
        var list = $(".available-firms .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".available-groups .search-input").keyup(function() {
        var list = $(".available-groups .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });

    $(".selected-groups .search-input").keyup(function() {
        var list = $(".selected-groups .selection-list");
        var filter = $(this).val();

        if (filter) {
            $(list).find("li:not(:Contains(" + filter + "))").hide();
            $(list).find("li:Contains(" + filter + ")").show();
        } else {
            $(list).find("li").show();
        }
    });
}

function updateUserRole(userId) {
    var userSupervisorObj = {};
    userSupervisorObj.userId = userId;
    userSupervisorObj.isSupervisorFlag = "false";
    userSupervisorObj.isBlocked = "false";
    userSupervisorObj.isDeActivated = "false";
    userSupervisorObj.canOpenGBIAccounts = false;


    $(".label_check.isSupervisor.check-on").each(function() {
        userSupervisorObj.isSupervisorFlag = "true";
    });
    $(".label_check.isBlocked.check-on").each(function() {
        userSupervisorObj.isBlocked = "true";
    });
    $(".label_check.isDeActivated.check-on").each(function() {
        var alert = new Alert("All Deactivated Users will not be able to logon into the application and cannot be activated again.Are you sure you want to deactivate this user?", "YES", "NO");
        $(document).bind("alertConfirm", function() {
            userSupervisorObj.isDeActivated = "true";
            var userSupervisorStr = JSON.stringify(userSupervisorObj);
            Server.updateUserRole( userSupervisorStr, function(response) {
                //do nothing
            });
        });
        $(document).bind("alertCancel", function() {
            $(".label_check.isDeActivated").toggleClass("check-on");
        });

    });

    if($(".label_check.userCanOpenGBIAccounts").length > 0) {
        $(".label_check.userCanOpenGBIAccounts.check-on").each(function() {
            userSupervisorObj.canOpenGBIAccounts =true;
        });
    }

    var userSupervisorStr = JSON.stringify(userSupervisorObj);
    Server.updateUserRole( userSupervisorStr, function(response) {
        //do nothing
    });

}

function initializeProductFilters_detail() {
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


function addOrRemoveFundspireAccess() {
    var addFundspireAccess = $("<div class='command-button' data-thirdPartyAccess='fundspire' ><a><div class='inner'>ADD ACCESS</div></a></div>");
    addFundspireAccess.click(addOrRemoveFundspireAccess);
    var removeFundspireAccess = $("<div class='command-button-black' data-thirdPartyAccess='fundspire' ><a><div class='inner'>REMOVE ACCESS</div></a></div>");
    removeFundspireAccess.click(addOrRemoveFundspireAccess);
    var selectedUserId = selectedId;

    var thirdPartyAccess = $("div[data-thirdPartyAccess=fundspire]").first();
    if(thirdPartyAccess.hasClass("command-button")) {
        var fundspireFormUser = {};
        fundspireFormUser.companyName = userDetails.companyName;
        fundspireFormUser.email = userDetails.email;
        fundspireFormUser.userId = userDetails.userId;
        fundspireFormUser.userName = userDetails.userName;
        if(userDetails.isCAISEmployee)
            fundspireFormUser.caisEmployee = "true";
        else
            fundspireFormUser.caisEmployee = "false";
        var fundspireFormUserData =  JSON.stringify(fundspireFormUser);

        var addingMsg = $("<div class='alert-message'>Adding access to Fundspire ... </div>");
        showLoadingDialog(function(){
            $(".loading").before("<div id='loading-wrapper' class='dialog-wrapper'/>");
            $("div[class=alert-message]").replaceWith(addingMsg);
        });

        Server.grantAccessToFundspire( fundspireFormUserData, function(response) {
            $("#loading-wrapper").remove();
            removeLoadingDialog();
            $("div[data-thirdPartyAccess=fundspire]").replaceWith(removeFundspireAccess);
            new Alert("Access to Fundspire is added.", "OK");
        }, function(response){
            removeLoadingDialog();
            new Alert("Cannot add access to Fundspire.", "OK");
        });

    } else {
        var removingMsg = $("<div class='alert-message'>Removing access to Fundspire ... </div>");
        showLoadingDialog(function(){
            $(".loading").before("<div id='loading-wrapper' class='dialog-wrapper'/>");
            $("div[class=alert-message]").replaceWith(removingMsg);
        });

        Server.deleteAccessToFundspire( {selectedUserId:selectedUserId,fundspireUserId:userDetails.fundspireUserId},function(response) {
            $("#loading-wrapper").remove();
            removeLoadingDialog();
            $("div[data-thirdPartyAccess=fundspire]").replaceWith(addFundspireAccess);
            new Alert("Access to Fundspire is removed.", "OK");
        }, function(respones){
            removeLoadingDialog();
            new Alert("Cannot remove access to Fundspire.", "OK");
        });
    }
}

function resetSecurityQuestions(e) {
    e.preventDefault();
    new Alert("Are you sure you would like to reset this user's security questions? They will be sent the new user activation page to reset their questions and password.", "YES", "NO");
    $(document).bind("alertConfirm", function() {
        $.postJSON('/admin/users/' + selectedId + '/reset_password', function() {

        }).error(function() {
            new Alert("This user's security questions could not be reset", "OK");
        });
    });
}

function addOrRemoveGBIAccess() {
    var gbiArr = [];
    var addGBIAccess = $("<div class='command-button' data-thirdPartyAccess='gbi' ><a><div class='inner'>ADD ACCESS</div></a></div>");
    addGBIAccess.click(addOrRemoveGBIAccess);
    var removeGBIAccess = $("<div class='command-button-black' data-thirdPartyAccess='gbi'><a><div class='inner'>REMOVE ACCESS</div></a></div>");
    removeGBIAccess.click(addOrRemoveGBIAccess);
    var selectedUserId = selectedId;

    var thirdPartyAccess = $("div[data-thirdPartyAccess=gbi]").first();
    if(thirdPartyAccess.hasClass("command-button")) {
        Server.updateGBIAccess( {selectedUserId:selectedUserId, hasCAISPMAccess:1},function(response) {
            $("div[data-thirdPartyAccess=gbi]").replaceWith(removeGBIAccess);
        });
    } else {
        Server.updateGBIAccess( {selectedUserId:selectedUserId, hasCAISPMAccess:0},function(response) {
            $("div[data-thirdPartyAccess=gbi]").replaceWith(addGBIAccess);
        });
    }
}
}).call();