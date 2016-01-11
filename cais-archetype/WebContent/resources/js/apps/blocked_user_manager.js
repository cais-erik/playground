require(['models/authed_user', 'Vm', 'core'], function(User, Vm) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require(['views/admin/users/blocked_user_list'], function(BlockedUserList) {
			var list = Vm.create({}, 'BlockedUserList', BlockedUserList);
			$('.grid-wrapper').html(list.$el);
		});
	});
});