function Server(){}

Server.alertServerError = function() {
	var alert = new Alert("Server Error", "OK");
};

Server.validateServerResponse = function(response, success, failure) {
	if(response.status == "success") {
		success(response.msg);
	} else {
		if(failure) {
			failure(response.msg);
		}
		else {
			Server.alertServerError();
		}
	}
};

/* 
	TODO: refactor this ugliness to User.js
	Extend Server class to return user object in local storage 
	@param callabck - callback function, recieves user object as first argument
	@param force - boolean force the user model to refresh from the server
*/
Server.caisUser = {
	getLocalSessionInfo: function(callback, force) {
		var user = JSON.parse(localStorage.getItem("user"));
		if (user && !force)  {
			if (callback) callback.call(window, user);
		}
		else{
			Server.getUserInfo(null, function(response) {
				// Process the permissions before storing
			    response.menuPermissions = {};
			    response.contextMenuPermissions = {};
			    for (var k in response.userPermissions) {
			        switch (response.userPermissions[k].permissionId) {
			            case 1:
			                response.menuPermissions.alternativesAccess = true; //done
			                break;
			            case 2:
			                response.menuPermissions.subscribeAccess = true; //done
			                break;
			            case 3:
			                response.menuPermissions.pipelineAccess = true; //done
			                break;
			            case 4:
			                response.menuPermissions.transactionAccess = true;
			                break;
			            case 5:
			                response.menuPermissions.investorAccess = true;
			                break;
			            case 6:
			                response.contextMenuPermissions.addInvestors = true;  //done
			                break;
			            case 7:
			                response.contextMenuPermissions.addUsers = true; //done
			                break;
			            case 8:
			                response.contextMenuPermissions.addUsers = true; // duplicate
			            case 9:
			                response.menuPermissions.connectAccess = true; //done
			                break;
			            case 10:
			                response.menuPermissions.accountsAccess = true; //done
			                break;
			            case 11:
			                response.menuPermissions.accessRebates = true;
			                break;
			        }
			    }
			    // Store the response in localStorage
			    localStorage.setItem("user", JSON.stringify(response));
				user = response;
				if (callback) callback.call(window, user);
			});
		}
	}
}

// LOGIN / USER RELATED SERVER CALLS
Server.getUserInfo = function (param, success, failure) {
    $.getJSON("/getUserInfo", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getAllFundAUM = function (param, success, failure) {
    $.getJSON("/getAllFundAUM", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.getAllFundGross = function (param, success, failure) {
    $.getJSON("/getAllFundGross", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
/*Server.getLoggedInUserName = function(param, success, failure) {
	$.getJSON('/getLoggedInUserName', {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getUserPermissions = function(param, success, failure) {
	$.getJSON("/getUserPermissions", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getUserPermissionsByUserId = function(param, success, failure) {
	$.getJSON("/getUserPermissionsByUserId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getThirdPartyAccess = function(param, success, failure) {
	$.getJSON("/getThirdPartyAccess", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISTeamMembersByLoggedInUser = function(param, success, failure) {
	$.getJSON("/getCAISTeamMembersByLoggedInUser", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getFundSpireParameters = function(param, success, failure) {
	$.getJSON("/getFundSpireParameters", function(response){
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getLandingSecurityQuestions = function(param, success, failure) {
	$.getJSON("/newLandingSecurityQuestions", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getLandingVerifySecurityQuestions = function(param, success, failure) {
	$.getJSON("/newLandingVerifySecurityQuestions", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.checkUserSwitchMenu = function(param, success, failure) {
	$.getJSON("/checkUserSwitchMenu", {}, function(response){
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGBIParameters = function(param, success, failure) {
	$.getJSON("/getGBIParameters", function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISAccountRole = function(param, success, failure) {
	$.getJSON("/getCAISAccountRole", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getIsCAISEmployee = function(param, success, failure) {
	$.getJSON("/getIsCAISEmployee", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*
Server.getShareClassForUser = function(param, success, failure) {
	$.getJSON("/getShareClassForUser", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};
*/

Server.getNewLandingDetails = function(param, success, failure) {
	$.getJSON("/newLandingDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.myProfileDetails = function(param, success, failure) {
	$.getJSON("/myProfileDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.forgotPasswordForm = function(param, success, failure) {
	$.getJSON('/forgotPasswordForm', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.requestFundspireAccess = function(param, success, failure) {
	$.getJSON('/requestFundspireAccess', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getUserNotificationTypes = function(param, success, failure) {
	$.getJSON('/getUserNotificationTypes', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getCurrentUserNotifications = function(param, success, failure) {
	$.getJSON('/getCurrentUserNotifications', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.currentPasswordMatch = function(param, success, failure) {
	$.getJSON('/currentPasswordMatch', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.changeSuccessful = function(param, success, failure) {
	$.getJSON('/changeSuccessful', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.changePassword = function(param, success, failure) {
	$.postJSON('/changeSuccessful', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getUserDetails = function(param, success, failure) {
	$.getJSON('/getUserDetails', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getPermissions = function(param, success, failure) {
	$.getJSON('/getPermissions', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

/*Server.getUserSPTermsStatus = function (param, success, failure) {
    $.getJSON("/getUserSPTermsStatus", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.updateUserSPTermsStatus = function (param, success, failure) {
    $.postJSON("/updateUserSPTermsStatus", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}*/

// DASHBOARD SERVER CALLS
//Server.getDashboardCounts = function(param, success, failure) {
//	$.getJSON("/getDashboardCounts", param, function(response) {
//		Server.validateServerResponse(response, success, failure);
//	});
//};

/*Server.getCommentsForUser = function(param, success, failure) {
	$.getJSON("/getCommentsForUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.getTasksForUser = function(param, success, failure) {
	$.getJSON("/getTasksForUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.getAllTrades = function(param, success, failure) {
	$.getJSON("/getAllTrades", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.getOpportunitiesForDashboard = function(param, success, failure) {
	$.getJSON("/getOpportunitiesForDashboard", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};
*/
Server.getUserDetailForUserId = function(param, success, failure) {
	$.getJSON("/getUserDetailForUserId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCaisAssetsForUser = function(param, success, failure) {
	$.getJSON("/getCaisAssetsForUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getDashboardArticles = function(param, success, failure) {
	$.getJSON("/getDashboardArticles", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.sessionManagement = function(param, success, failure) {
	$.getJSON('/sessionManagement', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}
Server.getContentVisibility = function(param, success, failure) {
	$.getJSON('/getContentVisibility', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}


// FUND DATA SERVER CALLS

/*Server.getFunds = function(param, success, failure) {
	$.getJSON("/getFunds", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getFundById = function(param, success, failure) {
	$.getJSON("/getFundById", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getUnderlyingFundDataById = function(param, success, failure) {
	$.getJSON("/getUnderlyingFundDataById", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.interceptFundDetails = function(param, success, failure) {
	$.getJSON("/interceptFundDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getMercerDocuments = function(param, success, failure) {
	$.getJSON("/getMercerDocuments", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getDocumentsByFundId = function(param, success, failure) {
	$.getJSON("/getDocumentsByFundId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getRiskMetricsDocuments = function(param, success, failure){
    $.getJSON("/getRiskMetricsDocumentsByFundId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getMultimediaDocuments = function(param, success, failure){
    $.getJSON("/getMultimediaDocumentsByFundId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deleteInvestmentEntityDoc = function (param, success, failure) {
    $.getJSON("/deleteInvestmentEntityDoc", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.requestFundDocs = function(param, success, failure) {
	$.getJSON("/requestFundDocs", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getFileOpenCredentials = function(param, success, failure) {
	$.getJSON("/getFileOpenCredentials", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getFundAnnualsChart = function(param, success, failure) {
	$.getJSON("/fundAnnualsChart", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getHighestHierarchy = function(param, success, failure) {
	$.getJSON("/highestHierarchy", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.searchEntities = function(param, success, failure) {
    $.getJSON("/searchEntities", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getEntitiesCount = function(param, success, failure) {
	$.getJSON("/getEntitiesCount", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.constructCAISAccountHierarchy = function(param, success, failure) {
	$.getJSON("/constructCAISAccountHierarchy", function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

//ACCOUNTS SERVER CALLS
Server.getAllInvestors = function(param, success, failure) {
	$.getJSON("/getAllInvestors", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllInvestorsByClient = function(param, success, failure) {
	$.getJSON("/getAllInvestorsByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllInvestorsByTeam = function(param, success, failure) {
	$.getJSON("/getAllInvestorsByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllInvestorsByUser = function(param, success, failure) {
	$.getJSON("/getAllInvestorsByUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllTeamMembers = function(param, success, failure) {
	$.getJSON("/getAllTeamMembers", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntityDetail = function(param, success, failure) {
	$.getJSON("/getEntityDetail", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISUserList = function(param, success, failure) {
	$.getJSON("/getCAISUserList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISUserNames = function(param, success, failure) {
	$.getJSON('/getCAISUserNames', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.doesInvestorExistsForGroup = function(param, success, failure) {
	$.getJSON("/doesInvestorExistsForGroup", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.doesInvestorExistsForTeamMember = function(param, success, failure) {
	$.getJSON("/doesInvestorExistsForTeamMember", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.doesFirmNameExists = function(param, success, failure) {
	$.getJSON("/doesFirmNameExists", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.doesEmailAddressExists = function(param, success, failure) {
	$.getJSON("/doesEmailAddressExists", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.doesAdvisorTeamNameExists = function(param, success, failure) {
	$.getJSON("/doesAdvisorTeamNameExists", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.getProductsForUser = function(param, success, failure) {
	$.getJSON("/getProductsForUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getAllProducts = function(param, success, failure) {
	$.getJSON("/getAllProducts", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.getAllPrivateEquities = function (param, success, failure) {
    $.getJSON("/getAllPrivateEquities", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}*/

/*Server.getInvestorsByAdvisorTeamId = function(param, success, failure) {
	$.getJSON("/getInvestorsByAdvisorTeamId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getCAISTeamMembersByClientId = function(param, success, failure) {
	$.getJSON("/getCAISTeamMembersByClientId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISTeamMembersByAdvisorId = function(param, success, failure) {
	$.getJSON("/getCAISTeamMembersByAdvisorId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCAISTeamMembersByUserrId = function(param, success, failure) {
	$.getJSON("/getCAISTeamMembersByUserId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getTeamMembersForWizard = function(param, success, failure) {
	$.getJSON("/getTeamMembersForWizard", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getSelectedTeamMembersForGroup = function(param, success, failure) {
	$.getJSON('/getSelectedTeamMembersForGroup', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedTeamMembersForFirm = function(param, success, failure) {
	$.getJSON('/getSelectedTeamMembersForFirm', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedGroups = function(param, success, failure) {
	$.getJSON('/getSelectedGroups', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.insertNewInvestor = function(param, success, failure) {
	$.postJSON("/insertNewInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.getExistingUsersForClient = function(param, success, failure) {
	$.getJSON("/getExistingUsersForClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getFirmDetails = function(param, success, failure) {
	$.getJSON("/getFirmDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});	
};

/*Server.getAdvisorTeams = function(param, success, failure) {
	$.getJSON("/getAdvisorTeams", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.getNewUsersForClient = function(param, success, failure) {
	$.getJSON("/getNewUsersForClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getGroupDetails = function(param, success, failure) {
	$.getJSON("/getGroupDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAdvisorByUserId = function(param, success, failure) {
    $.getJSON("/getAdvisorByUserId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

/*Server.getClientById = function (param, success, failure) {
    $.getJSON("/getClientById", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}*/

Server.getClientByInvestorId = function (param, success, failure) {
    $.getJSON("/getClientByInvestorId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getInvestmentEntityById = function (param, success, failure) {
    $.getJSON("/getInvestmentEntityById", param, function (response) {
     //   Server.validateServerResponse(response, success, failure);
    	if (success) success(response);
    }).error(function() {
    	if (failure) failure(response);
    });
}

Server.getInvestmentEntityNavInfo = function (param, success, failure) {
    $.getJSON("/getInvestmentEntityNavInfo", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getInvestmentEntityNotifications = function (param, success, failure) {
    $.getJSON("/getInvestmentEntityNotifications", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editPartyContact = function (param, success, failure) {
    $.postJSON("/editPartyContact", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getPartyContact = function (param, success, failure) {
    $.getJSON("/getPartyContact", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.removeInvestmentEntityNotification = function (param, success, failure) {
    $.postJSON("/removeInvestmentEntityNotification", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editInvestmentEntity = function (param, success, failure) {
    $.postJSON("/editInvestmentEntity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editInvestmentEntityNotifications = function (param, success, failure) {
    $.postJSON("/editInvestmentEntityNotifications", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getHoldings = function(param, success, failure) {
	$.getJSON("/getHoldings", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getHoldingsByClient = function(param, success, failure) {
	$.getJSON("/getHoldingsByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getHoldingsByTeam = function(param, success, failure) {
	$.getJSON("/getHoldingsByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getHoldingsByAdvisor = function (param, success, failure) {
    $.getJSON("/getHoldingsByAdvisor", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getHoldingsByInvestmentEntity = function (param, success, failure) {
    $.getJSON("/getHoldingsByInvestmentEntity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getHoldingsByInvestorForPerformance = function(param, success, failure) {
	$.getJSON("/getHoldingsByInvestorForPerformance", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getHoldingsByEntity = function(param, success, failure) {
	$.getJSON('/getHoldingsByEntity', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getHoldingsByInvestor = function(param, success, failure) {
	$.getJSON('/getHoldingsByInvestor', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getRebates = function(param, success, failure) {
	$.getJSON("/getRebates", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getRebatesByClient = function(param, success, failure) {
	$.getJSON("/getRebatesByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getRebatesByTeam = function(param, success, failure) {
	$.getJSON("/getRebatesByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getRebatesByInvestorForPerformance = function(param, success, failure) {
	$.getJSON("/getRebatesByInvestorForPerformance", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getRebatesByAdvisor = function (param, success, failure) {
    $.getJSON("/getRebatesByAdvisor", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getRebatesByInvestmentEntity = function (param, success, failure) {
    $.getJSON("/getRebatesByInvestmentEntity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getAvailableProductDetailsForFirm = function(param, success, failure) {
	$.getJSON('/getAvailableProductDetailsForFirm', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedProductDetailsForFirm = function(param, success, failure) {
	$.getJSON('/getSelectedProductDetailsForFirm', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getAvailableProductDetailsForGroup = function(param, success, failure) {
	$.getJSON('/getAvailableProductDetailsForGroup', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedProductDetailsForGroup = function(param, success, failure) {
	$.getJSON('/getSelectedProductDetailsForGroup', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getAvailableProductDetailsForMember = function(param, success, failure) {
	$.getJSON('/getAvailableProductDetailsForMember', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedProductDetailsForMember = function(param, success, failure) {
	$.getJSON('/getSelectedProductDetailsForMember', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getAvailableProductDetailsForCaisUser = function(param, success, failure) {
	$.getJSON('/getAvailableProductDetailsForCaisUser', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getSelectedProductDetailsForCaisUser = function(param, success, failure) {
	$.getJSON('/getSelectedProductDetailsForCaisUser', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.isOverriddenGroup = function(param, success, failure) {
	$.getJSON('/isOverriddenGroup', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.isOverriddenMember = function(param, success, failure) {
	$.getJSON('/isOverriddenMember', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.grantAccessToFundspire = function(param, success, failure) {
	$.postJSON('/grantAccessToFundspire', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.deleteAccessToFundspire = function(param, success, failure) {
	$.getJSON('/deleteAccessToFundspire', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.deleteUploadedDocumentFromTransaction = function(param,success,failure){
	$.postJSON("/deleteUploadedDocumentFromTransaction", param, function(response){
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateGBIAccess = function(param, success, failure) {
	$.getJSON('/updateGBIAccess', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateContentVisibility = function(param, success, failure){
	$.postJSON("/updateContentVisibility", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}
Server.getEntitiesDetailsByInvestorId = function(param, success, failure) {
	$.getJSON('/getEntitiesDetailsByInvestorId', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getEntitiesDetailsByEntityId = function(param, success, failure) {
	$.getJSON('/getEntitiesDetailsByEntityId', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getInvestorDetails = function(param, success, failure) {
	$.getJSON('/getInvestorDetails', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

//ENTITIES SERVER CALLS
Server.constructHierarchy = function(param, success, failure) {
	$.getJSON("/constructHierarchy", function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllEntities = function(param, success, failure) {
	$.getJSON("/getAllEntities", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntitiesByClient = function(param, success, failure) {
	$.getJSON("/getEntitiesByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntitiesByTeam = function(param, success, failure) {
	$.getJSON("/getEntitiesByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntitiesByInvestor = function(param, success, failure) {
	$.getJSON("/getEntitiesByInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntitiesByAdvisor = function (param, success, failure) {
    $.getJSON("/getEntitiesByAdvisor", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });    
};

Server.getEntityById = function (param, success, failure) {
    $.getJSON("/getEntityById", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getLiquidityByInvestor = function(param, success, failure) {
	$.getJSON('/getLiquidityByInvestor', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getLiquidityByEntity = function(param, success, failure) {
	$.getJSON('/getLiquidityByEntity', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

//CHARTING SERVER CALLS
Server.getPositionChartData = function(param, success, failure) {
	$.getJSON("/positionChartData", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getPositionChartDataByClient = function(param, success, failure) {
	$.getJSON("/positionChartDataByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});	
};

Server.getPositionChartDataByTeam = function(param, success, failure) {
	$.getJSON("/positionChartDataByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getPositionChartDataByUser = function(param, success, failure) {
	$.getJSON("/positionChartDataByUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGraphForAll = function(param, success, failure) {
	$.getJSON("/getGraphForAll", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.positionChartDataByInvestor = function(param, success, failure) {
	$.getJSON("/positionChartDataByInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.positionChartDataByEntity = function(param, success, failure) {
	$.getJSON("/positionChartDataByEntity", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGraphByClient = function(param, success, failure) {
	$.getJSON("/getGraphByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGraphByTeam = function(param, success, failure) {
	$.getJSON("/getGraphByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGraphByInvestor = function(param, success, failure) {
	$.getJSON("/getGraphByInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getGraphByAdvisor = function (param, success, failure) {
    $.getJSON("/getGraphByAdvisor", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getGraphByInvestmentEntity = function (param, success, failure) {
    $.getJSON("/getGraphByInvestmentEntity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

/*Server.getPositionsCount = function(param, success, failure) {
	$.getJSON('/getPositionsCount', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}*/

/*Server.getTransactionCount = function(param, success, failure) {
	$.getJSON('/getTransactionCount', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}*/

Server.getClientEntityDocuments = function(param, success, failure) {
	$.getJSON('/getClientEntityDocuments', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}


Server.getChartDataForClientDetailsPerformance = function(param, success, failure) {
	$.getJSON('/getChartDataForClientDetailsPerformance', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

//TRADE SERVER CALLS
Server.getSubscriptionDataList = function(param, success, failure) {
	$.getJSON("/getSubscriptionDataList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getEntityInfoByTransaction = function (param, success, failure) {
    $.getJSON("/getEntityInfoByTransaction", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getEventLogList = function(param, success, failure) {
	$.getJSON("/getEventLogList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getTaskComments = function(param, success, failure) {
	$.getJSON("/getTaskComments", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};


Server.getTransactionTasks = function(param, success, failure) {
	$.getJSON("/getTransactionTasks", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAllOpportunities = function(param, success, failure) {
	$.getJSON("/getAllOpportunities", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getOpportunitiesByClient = function(param, success, failure) {
	$.getJSON("/getOpportunitiesByClient", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getOpportunitiesByTeam = function(param, success, failure) {
	$.getJSON("/getOpportunitiesByTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getOpportunitiesByInvestor = function(param, success, failure) {
	$.getJSON("/getOpportunitiesByInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getOpportunitiesByAdvisor = function (param, success, failure) {
    $.getJSON("/getOpportunitiesByAdvisor", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getOpportunitiesByInvestmentEntity = function (param, success, failure) {
    $.getJSON("/getOpportunitiesByInvestmentEntity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getOpportunitiesCount = function(param, success, failure) {
	$.getJSON('/getOpportunitiesCount', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getReceivedDocsList = function(param, success, failure) {
	$.getJSON("/getReceivedDocsList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.approveTransactionTask = function(param, success, failure) {
	$.getJSON("/approveTransactionTask", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.approveTransactionTaskByTransactionId = function(param, success, failure) {
	$.getJSON("/approveTransactionTaskByTransactionId", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getAllDropDownList = function(param, success, failure) {
	$.getJSON("/getAllDropDownList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getReviewDocs = function(param, success, failure) {
	$.getJSON("/getReviewDocs", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.getDSADocsPresented = function(param, success, failure) {
	$.postJSON("/getDSADocsPresented", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}*/

Server.generateRedemptionRequest = function(param,success,failure){
	$.postJSON("/generateRedemptionRequest", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

/*Server.setFedwireNumber = function(param, success, failure) {
	$.getJSON("/setFedwireNumber", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

//ADVISOR RESOURCES
Server.getAdvisorResources = function(param, success, failure) {
	$.getJSON("/getAdvisorResources", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAdvisorResourcesArticles = function(param, success, failure) {
	$.getJSON("/getAdvisorResourcesArticles", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

//PRODUCT MANAGEMENT
Server.getAllManagersList = function (param, success, failure) {
    $.getJSON("/getAllManagersList", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.deleteManager = function (param, success, failure) {
    $.getJSON("/deleteManager", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getFundOnlyList = function (param, success, failure) {
    $.getJSON("/fetchFundOnlyList", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getFundCUSIP = function (param, success, failure) {
    $.getJSON("/fetchCusipsByFundId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getFundSeries = function (param, success, failure) {
    $.getJSON("/fetchSeriesByFundId", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditManager = function (param, success, failure) {
	$.postJSON("/addEditManager", param, function (response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.addEditManagerInfo = function (param, success, failure) {
    $.postJSON("/addEditManagerInfo", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deleteManagerInfo = function(param, success, failure) {
    $.getJSON("/deleteManagerInfo", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditFund = function (param, success, failure) {
	$.postJSON("/addEditFund", param, function (response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.deleteFund = function(param, success, failure) {
    $.getJSON("/deleteFund", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editStructuredProduct = function (param, success, failure) {
    $.postJSON("/editStructuredProduct", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editStructuredProductNoFile = function (param, success, failure) {
    $.postJSON("/editStructuredProductNoFile", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getStructuredProductByInternalCusip = function (param, success, failure) {
    $.getJSON("/getStructuredProductByInternalCusip", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditSeries = function(param, success, failure) {
	$.postJSON("/addEditSeries", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.deleteSeries = function(param, success, failure) {
	$.getJSON("/deleteSeries", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.addEditCaisTerms = function(param, success, failure) {
	$.postJSON("/addEditCaisTerms", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.addEditCusip = function(param, success, failure) {
    $.postJSON("/addEditCusip", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deleteCusip = function(param, success, failure) {
	$.getJSON("/deleteCusip", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.addEditPrivateEquity = function (param, success, failure) {
    $.postJSON("/addEditPrivateEquity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deletePrivateEquity = function (param, success, failure) {
    $.getJSON("/deletePrivateEquity", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditPrivateEquitySeries = function (param, success, failure) {
    $.postJSON("/addEditPrivateEquitySeries", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deletePrivateEquitySeries = function (param, success, failure) {
    $.getJSON("/deletePrivateEquitySeries", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditPrivateEquityCusip = function (param, success, failure) {
    $.postJSON("/addEditPrivateEquityCusip", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deletePrivateEquityCusip = function (param, success, failure) {
    $.getJSON("/deletePrivateEquityCusip", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.addEditPrivateEquityCaisTerms = function (param, success, failure) {
    $.postJSON("/addEditPrivateEquityCaisTerms", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deletePrivateEquityCaisTerms = function (param, success, failure) {
    $.getJSON("/deletePrivateEquityCaisTerms", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getCustodianList = function(param, success, failure) {
    $.getJSON("/getAllCustodianNames", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getCustodianInfo = function (param, success, failure) {
    $.getJSON("/getCustodianInfo", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

/*
Server.getShareClassList = function(param, success, failure) {
    $.getJSON("/getAllShareClass", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}
*/

Server.getProductTypeList = function(param, success, failure) {
    $.getJSON("/getAllProductType", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getSPDropDownLists = function (param, success, failure) {
    $.getJSON("/getSPDropDownLists", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getProductsByType = function (param, success, failure) {
    $.getJSON("/getProductsByType", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getBenchmarkList = function(param, success, failure) {
    $.getJSON("/getAllBenchMark", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getAllOnBoardingStatus = function (param, success, failure) {
    $.getJSON("/getAllOnBoardingStatus", param, function (response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.getProductsByOnboardingStatus = function(param, success, failure) {
    $.getJSON("/getProductsOnBoardingByStatus", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getManagersIdNameList = function(param, success, failure) {
    $.getJSON("/getManagersIdNameList", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getProductOnBoardingDocsByFundId = function(param, success, failure) {
    $.getJSON("/getProductOnBoardingDocsByFundId", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.editProductOnBoardDocument = function(param, success, failure) {
    $.postJSON("/editProductOnBoardDocument", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.deleteProductOnBoardDocument = function(param, success, failure) {
    $.getJSON("/deleteProductOnBoardDocument", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getCAISXDocsByFundId = function(param, success, failure) {
    $.getJSON("/getCAISXDocsByFundId", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getAllAUMInfo = function(param, success, failure) {
    $.getJSON("/getAllAUMInfo", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.enterReturns = function(param, success, failure) {
    $.getJSON("/enterReturns", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getBenchmarks = function (param, success, failure) {
    $.getJSON("/getBenchmarks", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getWeeklyEstimates = function (param, success, failure) {
    $.getJSON("/getWeeklyEstimates", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.publishFactSheet = function (param, success, failure) {
    $.postJSON("/publishFactSheet", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

// Document Watermarking
Server.getStampingDocumentCategories = function (param, success, failure) {
    $.getJSON("/getStampingDocumentCategories", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.getAllUsers = function (param, success, failure) {
	$.getJSON("/getAllUsers", param, function (response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.downloadEmailWithSelfStamp = function(param, success, failure) {
    $.postJSON("/downloadEmailWithSelfStamp", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
}

//These calls should maybe become .postJSON instead??
Server.closeTaskComment = function(param, success, failure) {
	$.getJSON("/closeTaskComment", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.openTaskComment = function(param, success, failure) {
	$.getJSON("/openTaskComment", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateTeamMembersForGroup = function(param, success, failure) {
	$.getJSON('/updateTeamMembersForGroup', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}
Server.getTermsOfUseId = function(param, success, failure){
	$.getJSON('/getCurrentTermsOfUseId', param, function(response){
		Server.validateServerResponse(response, success, failure);
	});
};

//POST SERVER CALLS
Server.acceptTerms = function(param, success, failure) {
	//insertUserTermsOfUse
	$.postJSON("/insertUserTermsOfUse", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.deleteInvestmentEntity = function(param, success, failure) {
	$.postJSON("/deleteInvestmentEntity", param, function(response) {
		if (success) success(response);
	}).error(function(response) {
		if (failure) failure(response);
	});
};

Server.deleteInvestor = function(param, success, failure) {
	$.postJSON("/deleteInvestor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.deleteTransaction = function(param, success, failure) {
	$.postJSON("/deleteTransaction", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.submitNewCAISUser = function(param, success, failure) {
	$.postJSON("/submitNewCAISUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.submitUserDetails = function(param, success, failure) {
	$.postJSON("/submitUserDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.submitNewAdvisorTeam = function(param, success, failure) {
	$.postJSON("/submitNewAdvisorTeam", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.submitNewAdvisor = function(param, success, failure) {
	$.postJSON("/submitNewAdvisor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.submitNewSupervisor = function(param, success, failure) {
	$.postJSON("/submitNewSupervisor", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.insertExistingTeamMember = function(param, success, failure) {
	$.postJSON("/insertExistingTeamMember", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.insertNewCustodian = function(param, success, failure) {
	$.postJSON("/insertNewCustodian", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateSubscriptionDocumentAndTransaction = function(param, success, failure) {
	$.postJSON("/updateSubscriptionDocumentAndTransaction", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateTransaction = function (param, success, failure) {
    $.postJSON("/updateTransaction", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
    
};

Server.sendMailWithAttachment = function(param, success, failure) {
	$.postJSON("/sendMailWithAttachment", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getVerifiedDocsList = function(param, success, failure) {
	$.postJSON("/getVerifiedDocsList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.addTaskComments = function(param, success, failure) {
	$.postJSON("/addTaskComments", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.insertEventLog = function(param, success, failure) {
	$.postJSON("/insertEventLog", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getDocsPresented = function(param, success, failure) {
	$.postJSON("/getDocsPresented", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getOnOffShorePerformDocuments = function(param, success, failure) {
	$.postJSON("/getOnOffShorePerformDocuments", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCaisInTheNews = function(param, success, failure) {
	$.getJSON("/getCaisInTheNews", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getDashboardArticles = function(param, success, failure) {
	$.getJSON("/getDashboardArticles", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getCaisTourForUser = function(param, success, failure) {
	$.getJSON("/getCaisTourForUser", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAdvisorResourcesGlossary = function(param, success, failure) {
	$.getJSON("/getAdvisorResourcesGlossary", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateCaisTourForUser = function(param, success, failure) {
	$.postJSON("/updateCaisTourForUser", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateUserNotifications = function(param, success, failure) {
	$.postJSON('/updateUserNotifications', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateFirmDetails = function(param, success, failure) {
	$.postJSON('/updateFirmDetails', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateUserDetails = function(param, success, failure) {
	$.postJSON('/updateUserDetails', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateProductsList = function(param, success, failure) {
	$.postJSON('/updateProductsList', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateTeamMembersList = function(param, success, failure) {
	$.postJSON('/updateTeamMembersList', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateProductPermission = function(param, success, failure) {
	$.postJSON('/updateProductPermission', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateProductPermissionForUser = function(param, success, failure) {
	$.postJSON('/updateProductPermissionForUser', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateProductPermissionForCaisUser = function(param, success, failure) {
	$.postJSON('/updateProductPermissionForCaisUser', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateInvestorAccess = function(param, success, failure) {
	$.postJSON('/updateInvestorAccess', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateUserRole = function(param, success, failure) {
	$.postJSON('/updateUserRole', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

/*Server.deleteEntity = function(param, success, failure) {
	$.postJSON('/deleteEntity', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}*/

Server.insertInvestmentEntityList = function(param, success, failure) {
	$.postJSON('/insertInvestmentEntityList', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateInvestorDetails = function(param, success, failure) {
	$.postJSON('/updateInvestorDetails', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateInvestmentEntityList = function(param, success, failure) {
	$.postJSON('/updateInvestmentEntityList', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.updateUserEnvStats = function(param, success, failure) {
	$.postJSON('/updateUserEnvStats', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
}

Server.submitGroupAccess = function(param, success, failure) {
	$.postJSON("/submitGroupAccess", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateGroupName = function(param, success, failure) {
	$.postJSON("/updateGroupName", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateProductAccess = function(param, success, failure) {
	$.postJSON("/updateProductAccess", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateFunctions = function(param, success, failure) {
	$.postJSON("/updateFunctions", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.deleteGroup = function(param, success, failure) {
	$.postJSON("/deleteGroup", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.getFirmTypeList = function(param, success, failure) {
	$.getJSON("/getFirmTypeList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.getGroupManagerDetails = function(param, success, failure) {
	$.getJSON("/getGroupManagerDetails", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getAminTypeList = function(param, success, failure) {
	$.getJSON("/getAminTypeList", {}, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.getReconTransList = function(param, success, failure) {
	$.getJSON("/getReconTransList", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.saveAdminInvestmentEntity = function(param, success, failure) {
	$.getJSON("/saveAdminInvestmentEntity", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

Server.updateOpenGBIAccounts = function(param, success, failure) {
	$.postJSON('/updateOpenGBIAccounts', param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};

/*Server.updateTransactionStatus = function(param, success, failure) {
	$.getJSON("/updateTransactionStatus", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

/*Server.approveTransactionTaskForDSA = function(param, success, failure) {
	$.getJSON("/approveTransactionTaskForDSA", param, function(response) {
		Server.validateServerResponse(response, success, failure);
	});
};*/

Server.publishInternalorExternal = function(param, success, failure) {
    $.postJSON("/publishInternalorExternal", param, function(response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.saveReturns = function (param, success, failure) {
    $.postJSON("/saveReturns", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.saveBenchmarks = function (param, success, failure) {
    $.postJSON("/saveBenchmarks", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.saveWeeklyEstimates = function (param, success, failure) {
    $.postJSON("/saveWeeklyEstimates", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
}

Server.emailWithSelfStamp = function (param, success, failure) {
    $.postJSON("/emailWithSelfStamp", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.deleteTeamMember = function (param, success, failure) {
    $.getJSON("/deleteTeamMember", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.addAdvisorDoc = function (param, success, failure) {
    $.postJSON("/addAdvisorDoc", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.updateProfileUserList = function (param, success, failure) {
    $.postJSON("/updateProfileUserList", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.deleteAdvisorDoc = function (param, success, failure) {
    $.postJSON("/deleteAdvisorDoc", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.addAdvisorDocToFYI = function (param, success, failure) {
    $.postJSON("/addAdvisorDocToFYI", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.removeAdvisorDocFromFYI = function (param, success, failure) {
    $.postJSON("/removeAdvisorDocFromFYI", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.saveOrUpdateAdminAdvisorTeam = function (param, success, failure) {
    $.postJSON("/saveOrUpdateAdminAdvisorTeam", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.loadAdvisorReconList = function (param, success, failure) {
    $.getJSON("/loadAdvisorReconList", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};
Server.updatePointOfContact = function (param, success, failure) {
    $.getJSON("/updatePointOfContact", param, function (response) {
        Server.validateServerResponse(response, success, failure);
    });
};

Server.getStructuredProductAccessHistory = function(param, success, failure) {
	$.getJSON("/getStructuredProductAccessHistory", param, function(response){
		Server.validateServerResponse(response, success, failure);
	});
};

