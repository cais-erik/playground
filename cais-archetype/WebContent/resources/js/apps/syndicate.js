require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require([
			'views/products/syndicate/syndicate_landing',
			'routers/syndicate_router',
			'Vm',
			'views/products/syndicate/syndicate_terms',
			'collections/products/syndicate_all_offerings'
		], function(AppView, Router, Vm, Terms, CapMarketsProducts) {
			// launch the app
			var terms = Vm.create({}, 'TermsView', Terms);
			terms.on('termsAccepted', function() {
				CapMarketsProducts.fetch({
					success: function() {
						var appView = Vm.create({}, 'AppView', AppView);
						Router.initialize({appView: appView});  // The router now has a copy of all main appview		
					}
				});
			});
		});
	});
});