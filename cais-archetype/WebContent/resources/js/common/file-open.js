(function(){
	$(document).bind("dialogs/file-open-instructionsLoaded", function (event,options) {
		$("#fpuserName").replaceWith("<div  id='fpuserName'>Username: "+options.fileOpenUser+"</div>");
		$("#fpPassword").replaceWith("<div  id='fpPassword'>Password: "+options.fileOpenPasswd+"</div>");
		$('a[href^="http://"]').attr("target", "_blank");
	
		$(".cancel, .confirm").click(function() {
			$(".file-open-dialog").parent().remove();
		});
	});
	$(document).bind("dialogs/file-open-confirmationLoaded", function(event,options) {
		$(".cancel, .confirm").click(function() {
			$(".file-open-dialog").parent().remove();
		});	
	});
}).call();