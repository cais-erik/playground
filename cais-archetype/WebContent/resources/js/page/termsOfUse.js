(function(){
	var termsOfUseId;

	var acceptButton = $("<li id='accept' class='command-button'><a><div class='inner'>ACCEPT</div></a></li>");
	var declineButton = $("<li id='decline' class='command-button-black'><a><div class='inner'>DECLINE</div></a></li>");
	
	$(document).ready(function() {
		initializeTermsOfUse();
		initializeButtons();		
	});
	
	function initializeButtons(){
		$(".command-buttons").on("click", "#accept", function() {
			
			Server.acceptTerms(JSON.stringify(termsOfUseId), function(response) {
				window.location = "/index";
				return true;
			});
		});
		
		$(".command-buttons").on("click","#decline", function() {
			var alert = new Alert("If you do not agree to accept the Terms of Use, you will be unable to access CAIS.  Are you sure you do not want to accept the Terms of Use?", "YES", "NO");
			
			$(document).bind("alertConfirm", function() {			
				document.location.href='/j_spring_security_logout';
				return true;
			});
		});
	}
	
	function initializeTermsOfUse(){
		Server.getTermsOfUseId(null, function(response) {
			termsOfUseId = response;
		});
	}
}).call();