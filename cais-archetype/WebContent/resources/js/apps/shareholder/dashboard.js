require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require([
			'views/shareholder/root_shareholder',
			'routers/shareholder_router',
			'Vm',
		], function(AppView, Router, Vm) {
			var appView = Vm.create({}, 'AppView', AppView);
			Router.initialize({appView: appView});  // The router now has a copy of all main appview	
		});
	});
});