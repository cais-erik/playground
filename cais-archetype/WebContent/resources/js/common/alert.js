Alert.prototype.constructor = Alert;
Alert.prototype.constructor = IntroVideo;
function Alert(alertMessage, confirmText, cancelText) {
	var alertContainer = $("<div/>"),
		dialogWrapper,
		$body = $("body");
	$body.addClass('freeze-me');
	if($(".dialog-wrapper").length == 0 || $(".page-dialog").length > 0)
	{
		dialogWrapper = $("<div class='dialog-wrapper alert'/>");
		dialogWrapper.appendTo($body);
		dialogWrapper.hide().fadeIn('fast');
	}
	else
	{
		dialogWrapper = $(".dialog-wrapper");
		dialogWrapper.removeClass("video-intro-dialog");
		
		// if there is already an alert, remove it
		dialogWrapper.find(".page-dialog.alert").remove();
	}
	
	alertContainer.load("/resources/views/dialogs/alert.html", function(response){
	    dialogWrapper.append(response);
		
		var alert = $(".page-dialog.alert");
		alert.find(".alert-message").html(alertMessage);
		alert.css("width", alert.width());

		$(document).trigger("alertLoaded");

		if (confirmText == null) {
		    alert.find(".confirm .inner").remove();
		} else {
		    alert.find(".confirm .inner").text(confirmText);
		}
		
		if(cancelText) {
			alert.find(".cancel .inner").text(cancelText);
		} else {
			alert.find(".cancel").remove();
		}
		
		alert.height(alert.find(".alert-message").height() + 78);
		
		$(document).bind("alertCancel", function(e, currentTarget) {
			$(document).trigger("alertClose", currentTarget);
		});
		
		$(document).bind("alertConfirm", function(e, currentTarget) {
			$(document).trigger("alertClose", currentTarget);
		});
		
		$(document).bind("alertClose", function(e, currentTarget) {
			// remove bindings for alerts
			$(document).unbind("alertCancel");
			$(document).unbind("alertConfirm");
			$(document).unbind("alertClose");
			
			$(currentTarget).parents(".page-dialog").remove();
			$body.removeClass('freeze-me');
			dialogWrapper.fadeOut('fast', function() { $(this).remove(); $(document).trigger('alertClosed')});
		});
		
		alert.find(".confirm").click(function(e) {
			$(document).trigger("alertConfirm", e.currentTarget);
		});
		
		alert.find(".cancel").click(function(e) {
			$(document).trigger("alertCancel", e.currentTarget);
		});
	});
}
function IntroVideo(){
	var alertContainer = $("<div/>"),
		$dialogWrapper = $(".dialog-wrapper"),
		$body = $("body");
	$dialogWrapper.remove();
	$dialogWrapper = $("<div class='dialog-wrapper alert video-intro-dialog' style='display:block'>");
	$body.addClass('freeze-me');
	$dialogWrapper.append($("#intro-video").html());
	$dialogWrapper.on("click", ".close-icon", function(e, currentTarget){
		var $dialogWrapper = $(this).parents(".video-intro-dialog"),
			$video = $dialogWrapper.find('video').get(0);
		$video.pause();
	    $video.src = '';
		$dialogWrapper.remove();
		$body.removeClass('freeze-me');
		window.location.hash = "";
	});	
	$dialogWrapper.appendTo($body);
	$dialogWrapper.find('video').get(0).play();
}