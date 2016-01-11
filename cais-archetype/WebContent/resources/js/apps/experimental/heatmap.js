// Require.js allows us to configure shortcut alias
require.config({
	baseUrl: '/resources/js',
	urlArgs: caisVersion || null,
	paths: {
		// Major libraries
		jquery: 'thirdparty/jquery.min',
		kendo: 'amd/kendo/kendo.all.min',
		underscore: 'amd/underscore/underscore', // https://github.com/amdjs
		backbone: 'amd/backbone/backbone', // https://github.com/amdjs
		handlebars: 'amd/handlebars/handlebars',
		core: 'amd/common/core',
		validator: 'thirdparty/parsley',
		// Require.js plugins
		text: 'amd/require/text',
		events: 'amd/common/Events',

		// Short cut so we can put our html outside the js dir
		templates: '../templates',
		Vm: 'views/Vm'
	},
	shim: {
		core: {
			deps: ['jquery', 'kendo', 'common/Server']
		},
		handlebars: {
            exports: 'Handlebars'
        },
        validator: {
        	deps: ['jquery']
        }
	}
});

// Let's kick off the application, sadly we have to bootstrap core.js and the user model before starting the app.
// core is a great place to start refactoring code
require(['core','models/authed_user'], function(core, User) {
	Server.caisUser.getLocalSessionInfo(function(user) {
		// set the user model
		User.set(user);
		require([
			'views/experimental/map',
			'views/experimental/email_list_chart',
			'Vm',
		], function(MapView, ChartView, Vm) {
			Vm.create({}, 'MapView', MapView, {el: '.heatmap'});
			Vm.create({}, 'ChartView', ChartView, {el: '.chart'});
		});
	});
});