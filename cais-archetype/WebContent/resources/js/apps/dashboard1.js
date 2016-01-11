require(['models/authed_user', 'Vm', 'core', 'thirdparty/moment'], function(User, Vm) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		var $body = $("body");
		$(".tab-navigation").on("click", ".item", function(){
			var $this = $(this),
				$parent = $this.parent(),
				$content = $parent.parent().find(".tab-navigation-content .item");
			$parent.find(".item").removeClass("active");
			$content.removeClass("active");
			$this.addClass("active");
			$content.filter(":eq("+$this.index()+")").addClass("active");
		});
		var $videoContainerClose = $(".video-intro-dialog .close-icon");
		if($videoContainerClose.length>0){
			$videoContainerClose.one("click", function(e, currentTarget){
	            var $dialogWrapper = $(this).parents(".video-intro-dialog"),
	                $video = $dialogWrapper.find('video').get(0);
	            if($video){
	                $video.pause();
	                $video.src = '';
	            }
	            $dialogWrapper.remove();
	            $body.removeClass('freeze-me');
	            window.location.hash = "";
	        });
	    }
	    // set the user model
		User.set(user);
	});
});