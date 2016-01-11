/*
 	Module to manage the session timeout cross tab/window.
	Sets a time in local storage and refreshes that time on page load and AJAX request events
	Prompts the user if inactive
*/

(function() {
	// config
	var serverTimeout = (29 * 60000); // server timeout minutes converted to MS
	var warningTime = 7000;   // how long should the warning be shown to the user
	var sessionCheckRate = 5000; // how often the time should be checked 
	var sessionTimer = serverTimeout - warningTime - sessionCheckRate; // how long can a session be inactive for in (min * ms)
	var intervalTimer = null; // variable to hold the timer

	// factory to produce session setInterval functions
	var interval = function() { return setInterval(function() {
			var sessionStartDate = parseInt(localStorage.getItem('sessionTimer'));
			var checkDate = new Date(new Date().getTime() - sessionTimer);
			if (checkDate > sessionStartDate) showDialog();
		}, sessionCheckRate);
	};
	var refreshTimer = function() {
		localStorage.setItem('sessionTimer', new Date().getTime());
	};
	var logoutUser = function() {
		$('<form action="j_spring_security_logout" method="post"></form>').appendTo('body').submit();
	};
	var showDialog = function() {
		new Alert("Would you like to keep your session alive?", "YES", "NO");
		var logOutTimer = setTimeout(logoutUser, warningTime);

		$(document).bind("alertConfirm", function() {
			// arbitrary request to reset server side timer
			Server.sessionManagement( null,null, function(response) { });
			clearTimeout(logOutTimer);
			intervalTimer = interval();
		});
		$(document).bind("alertCancel", logoutUser);

		clearInterval(intervalTimer);
	};

	// set the time when this code is first loaded (typically page refresh);
	refreshTimer();

	// listen to the ajax send event to refresh on every ajax call
	$(document).bind('ajaxSend', refreshTimer);

	// start the timer on page load
	intervalTimer = interval();
})();