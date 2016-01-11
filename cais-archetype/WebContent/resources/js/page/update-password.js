(function(){
$(document).ready(function () {
    var questionStep = 1;
    var form = $("#reset-password-form");

    form.submit(function(event) {
		event.preventDefault();
	});
    
    Server.getLandingVerifySecurityQuestions( {}, function(response) {
		if(response.length>0) {
	    	var verifyQuestions = response;
	    	var questionDOM = $('.security-question').clone();

			$.each(verifyQuestions, function(i, question) {
				if ('hideQuestions' in question) {
					if (question.hideQuestions) {
						$('.security-questions').remove();
						$('.wizard-action-description').text('Your password has expired. Please enter a new password.');
					}
					return;
				}
				var newquestionDom = questionDOM.clone();
				newquestionDom.find('label').text(i+1 + '. ' + question.question);
				newquestionDom.find('input').attr('name', question.userSecurityQuestionsId);
				newquestionDom.show();
				$('.security-question:last').after(newquestionDom);
			});

			$('.security-question:first').remove();
		    $('.next').click(function () {
		    	form.submit();
		    });

		    form.parsley({
				validators: {
					pwformat: function (val) {
						var regExp = /^(?=.*[A-Z])(?=.*\d).*$/
						return '' !== val ? regExp.test(val) : false;
					}
				}, 
				messages: {
					pwformat: "Password must contain at least one number and one uppercase letter"
				}
			});
			form.parsley('addListener', {
				onFormSubmit: function(valid, event) {
					if (!valid) return;
					event.preventDefault;
					var questions = form.find('.question-input:visible');
					var data = {
						questions: [],
						password: form.find('#password').val(),
			 			password_again: form.find('#password_again').val()
					};
					data.questions = [];
					questions.each(function() {
						var question = {}
						data.questions.push({
							id: $(this).attr('name'),
							answer: $(this).val()
						});
					});

					Server.changePassword(JSON.stringify(data), function() {
						new Alert("Your password has been updated. Please login using your new password.", "OK");
						$(document).bind("alertConfirm", function(){		
							window.location = "/login";
						});
					}, function(response) {
						new Alert("There was a problem changing your password. Error: " + response, "OK");
					});
				}
			})
		}
		else{
			$(".security-question.one").removeClass("active");
			$(".next").hide();
			$(".wizard-action-description").text("Unable to update your password. Please contact your CAIS Administrator");
		}
    });
});
}).call();