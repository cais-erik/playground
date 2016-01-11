define([], function() {
var user = {
      "userId":2226,
      "userName":"PGiurata",
      "fileOpenPassword":null,
      "salutation":null,
      "firstName":"Paul",
      "middleInitial":null,
      "lastName":"Giurata",
      "suffix":null,
      "email":"pgiurata@catalystresources.com",
      "phone":"650678-6740",
      "companyName":"Catalyst",
      "stampId":"kfwiaVNM",
      "salesForceId":null,
      "accessGroupId":1,
      "registerDate":null,
      "lastVisitDate":1362786276000,
      "address":{
         "addressId":2098,
         "addressTypeId":3,
         "street1":"2098Main Street",
         "street2":"Suite 100",
         "city":"New York",
         "state":"NY",
         "postalCode":"10022",
         "country":"US",
         "email":"test@caisgroup.com",
         "alternateEmail":"",
         "phone":"212-222-2222",
         "fax":"212-443-3333"
      },
      "hasCAISPMAccess":1,
      "block":0,
      "failedLoginAttempts":0,
      "advisorTeamId":0,
      "advisorTeamName":null,
      "userPermissions":null,
      "userProductAccessList":null,
      "userRole":null,
      "permissions":[],
      "roleId":0,
      "fragment":null,
      "fullName":null,
      "canOpenGBIAccounts":true,
      "clientId":34,
      "accessGroupOverridden":false,
      "caisemployee":false,
      "fileOpenRegistered":false
};

var cmEquityOffering = {
   "id":8,
   "bookRunner":[
      3
   ],
   "coManagers":[

   ],
   "leadManagers":[
      2
   ],
   "exchange":"NYSE",
   "expectedTiming":"2013-12-07T05:00:00.000Z",
   "expectedTimingWindow":"After market close",
   "expectedTimingAsDate":1386392400000,
   "orderPeriodEndDateAsDate":1387522800000,
   "issuerId":12,
   "industryGroup":"Consumer",
   "companyDescription":"SDfasdfaasdf",
   "internalCusip":"CEQ0000008",
   "offeringType":"IPO",
   "overAllotmentOptionPrct":23423,
   "orderPeriodEndDate":"2013-12-20T07:00:00.000Z",
   "orderPeriodDesc":"Indications of interest will be accepted until 2:00 AM, ",
   "productType":"Common Stock",
   "sharesOffered":234223423,
   "ticker":"3245",
   "useOfProceeds":null,
   "name":"Test",
   "approxSize":2323,
   "assetClass":"Equity",
   "priceRange":null,
   "prospectusId":22769,
   "bookRunnerObject":[
      {
         "id":67,
         "bankid":3,
         "bankshtname":"Cowen",
         "internalcusip":"CEQ0000008",
         "createUser":"CFetherston",
         "createDate":1386768591000,
         "updateUser":null,
         "updateDate":null,
         "isDeleted":false
      }
   ],
   "coManagerObject":[

   ],
   "leadManagerObject":[
      {
         "id":32,
         "bankid":2,
         "bankshtname":"Lazard",
         "internalcusip":"CEQ0000008",
         "createUser":"CFetherston",
         "createDate":1386768591000,
         "updateUser":null,
         "updateDate":null,
         "isDeleted":false
      }
   ],
   "netRoadShow":null,
   "netRoadShowDescription":null,
   "expired":false,
   "published":false
};
return {
	user: user,
   cmEquityOffering: cmEquityOffering
}
});