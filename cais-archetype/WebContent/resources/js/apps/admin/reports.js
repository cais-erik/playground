require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require([
			'views/admin/reports/root_reports',
			'routers/admin_reports_router',
			'Vm',
		], function(AppView, Router, Vm) {
			// launch the app
			if (!User.get('caisemployee')) {
				alert('You do not have permission to view CAIS Reports');
				window.location = '/';
				return;
			}
			var appView = Vm.create({}, 'AppView', AppView);
			Router.initialize({appView: appView});  // The router now has a copy of all main appview	
		});
	});
});