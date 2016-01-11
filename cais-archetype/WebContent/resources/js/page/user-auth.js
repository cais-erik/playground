(function() {
	var passwordForm = $('#forgot-password-form');
	var loginForm = $('#login-form');

	// show input labels for browsers that don't support placeholder
	if (!Modernizr.input.placeholder) $('label').show();
	$('input#username, #email').focus();

	/*
	Login form js
	*/
	var initLogin = function() {
		if ( localStorage.getItem("username") != undefined && localStorage.getItem("username") != "" ) {
		$("#username").val(localStorage.getItem("username"));	}

		loginForm.submit(function(e) {
			if ($(this).parsley().isValid()) {
				$('.spinner').addClass('visible');
			} else {
				$('.spinner').removeClass('visible');
			}
		});
	};
	

	/*
	Reset password JS
	*/
	var initPasswordReset = function() {
		passwordForm.submit(function(event) {
			event.preventDefault();
			$('.messages-wrapper').slideUp();
			if ($(this).parsley().isValid()) {
				var email = $(this).find('#email').val();
				$(this).find('#email').blur();
				$('.spinner').addClass('visible');
				$.getJSON('/forgotPasswordForm', {email:email}, function(response) {
					if(response.msg == "success") {
						alert("Thank You, an email will be sent shortly with more instructions.", "OK");
						window.location = "/login";
					} else if (response.msg == 'blocked') {
						$('.messages-wrapper p').html("<span class='error-msg'>Account Locked</span> <a href='mailto:support@caisgroup.com'>Click Here</a> to restore access.");
						$('.messages-wrapper').slideDown();
					} else {
						$('.messages-wrapper p').html('Your email address could not be located, contact support or <a href="http://www.caisgroup.com/#get-started">request to join CAIS</a>.');
						$('.messages-wrapper').slideDown();
					}
					$('.spinner').removeClass('visible');
				});
			}
		});
	}

	if (loginForm.length) initLogin();
	if (passwordForm.length) initPasswordReset();
})();