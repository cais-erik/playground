Dialog.prototype.constructor = Dialog;

function Dialog(dialogName, dialogOptions)
{
	var initDialog = function() {
		var dialogContainer = $("<div/>");
		var dialogWrapper;
		
		if($(".dialog-wrapper").length == 0)
		{
			dialogWrapper = $("<div class='dialog-wrapper'/>");
			dialogWrapper.appendTo($("body"));
		}
		else
			dialogWrapper = $(".dialog-wrapper");
		
		var dialog;
		var DIALOGS_DIR = "/resources/views/dialogs/";

		dialog = DIALOGS_DIR + dialogName + ".html";
		
		dialogContainer.load(dialog + "?" + caisVersion, function(response){
			dialogWrapper.append(response);
			dialogWrapper.find(".page-dialog").last().find(".close-icon").click(function(e) {
				$(this).unbind("click");
				$(document).trigger("dialogCloseUi");
				$(document).trigger("dialogClose/" + dialogName, e.currentTarget);
			});
			$(document).trigger("dialogs/" + dialogName + "Ready", dialogOptions);
			$(document).trigger("dialogs/" + dialogName + "Loaded", dialogOptions);
			$(document).bind("dialogClose/" + dialogName, function(e, currentTarget) {
				$(document).unbind("dialogClose/" + dialogName);
				$(currentTarget).parents(".page-dialog").remove();
				if($(".page-dialog").length == 0) {
					$(".dialog-wrapper").remove();
				}
			});
		});
		return dialogWrapper;
	};
	

	// hack to lazy load details.js on pages that use require
	if (dialogName === 'my-profile' && typeof require !== 'undefined') {
		require(['common/details'], function() {
			initDialog();
		});
	}
	else {
		return initDialog();
	}
}