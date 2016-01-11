require(['models/authed_user', 'core'], function(User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require([
			'views/products/structured_products/structured_products_landing',
			'routers/structured_products_router',
			'Vm',
			'views/products/structured_products/structured_products_terms',
			'collections/products/structured_products'
		], function(AppView, Router, Vm, Terms, StructuredProducts) {
			// launch the app
			var terms = Vm.create({}, 'TermsView', Terms);
			terms.on('termsAccepted', function() {
				StructuredProducts.fetch({
					success: function() {
						var appView = Vm.create({}, 'AppView', AppView);
						Router.initialize({appView: appView});  // The router now has a copy of all main appview		
					}
				});
			});
		});
	});
});