require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require(['common/fund-info-dialog', 'common/file-open', 'common/session-management', 'common/redemption-info', 'common/details']);
		if (!User.get('menuPermissions').transactionAccess) {
			return false;
		}
		require([
			'views/pipeline/root_pipeline',
			'routers/pipeline_router',
			'Vm',
		], function(AppView, Router, Vm) {
			// launch the app
			var appView = Vm.create({}, 'AppView', AppView);
			Router.initialize({appView: appView});  // The router now has a copy of all main appview
		});
	});
});