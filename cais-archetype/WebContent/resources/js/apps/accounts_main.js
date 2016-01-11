require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		// tree section must be fetched before starting app
		require(['collections/firm_tree_dataSource'], function(TreeDataSource) {
			TreeDataSource.data.one('requestEnd', function() {
				require([
					'views/accounts/base_accounts',
					'routers/accounts_router',
					'Vm'
				], function(AppView, Router, Vm, User) {
					// force only POST and GET for requests
					Backbone.emulateHTTP = true;
					// launch the app
					var appView = Vm.create({}, 'AppView', AppView);
					Router.initialize({appView: appView});  // The router now has a copy of all main appview
				});
			});
			TreeDataSource.data.fetch();
		});
	});
});
