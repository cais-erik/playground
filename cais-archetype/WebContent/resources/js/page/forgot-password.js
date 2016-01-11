$(document).ready(function() {
	var form = $('#forgot-password-form');
	$('#email').focus();
	$('.send').click(function() {
		form.submit();
	});
	form.submit(function(event) {
		event.preventDefault();
		if ($(this).parsley('validate')) {
			var email = $(this).find('#email').val();
			$(this).find('#email').blur();
			$('.dialog-wrapper').show();
			Server.forgotPasswordForm( {email: email}, function(response) {
				var msg = response;
				$('.dialog-wrapper').hide();
				if (msg == 'success') {
					var alert = new Alert("Thank You, an email will be sent shortly with more instructions.", "OK");
					$(document).bind("alertConfirm", function(){		
						window.location = "/login";
					});
				} else{
					if (msg == 'blocked') {
						var alert = new Alert("Your CAIS account has been blocked, please send an email to <a href='mailto:support@caisgroup.com'>support@caisgroup.com</a>", "OK");
					} else{
						var alert = new Alert("We could not locate your email address in CAIS, please send an email to <a href='mailto:support@caisgroup.com'>support@caisgroup.com</a> or Click this link to <a href='https://www.caisgroup.com/#get-started/'>Join CAIS</a>", "OK");
					}
				}
			});
		}
	});
});