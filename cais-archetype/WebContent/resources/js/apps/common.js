/*
RequireJS Common configuration module
Defines the paths and configuration options shared by all application modules
Also serves as a build target for the common module, see modules definition array
*/

({
	baseUrl: '/resources/js',
	//urlArgs: function() { if (typeof caisVersion != 'undefined') return caisVersion; }(),
	paths: {
		// Major libraries
		jquery: 'thirdparty/jquery.min',
		kendo: 'amd/kendo/kendo.all.min',
		underscore: 'amd/underscore/underscore', // https://github.com/amdjs
		backbone: 'amd/backbone/backbone', // https://github.com/amdjs
		handlebars: 'amd/handlebars/handlebars',
		core: 'amd/common/core',
		validator: 'thirdparty/parsley',
		Vm: 'views/Vm',
		text: 'amd/require/text',
		events: 'amd/common/Events',
		async: 'amd/require-plugins/async',
        goog: 'amd/require-plugins/goog',
        propertyParser : 'amd/require-plugins/propertyParser',
        moment: 'thirdparty/moment',
		// Short cut so we can put our html outside the js dir
		templates: '../templates'
	},
	shim: {
		kendo: {
			deps: ['jquery']
		},
		core: {
			deps: ['kendo', 'common/Server']
		},
		handlebars: {
			exports: 'Handlebars'
		},
		validator: {
			deps: ['jquery']
		},
		'amd/backbone/Backbone.CollectionBinder': {
			deps: ['amd/backbone/Backbone.ModelBinder']
		}
	},
	waitSeconds: 90,
	modules: [
	
		// This is the common JS module
		{
			name: 'apps/common',
			include: [
				'jquery',
				'kendo',
				'underscore',
				'backbone',
				'events',
				'Vm',
				'handlebars',
				'text',
				'common/Server',
				'core' // core CAIS functions, mostly legacy
			]
		},
		// unique page modules, excludes common modules
		{
			name: 'apps/accounts_main',
			exclude: ['apps/common']
		},
		{
			name: 'apps/dashboard1',
			exclude: ['apps/common']
		},
		{
			name: 'apps/syndicate',
			exclude: ['apps/common']
		},
		{
			name: 'apps/structured_products',
			exclude: ['apps/common']
		},
		{
			name: 'apps/admin/reports',
			exclude: ['apps/common']
		},
		{
			name: 'apps/blocked_user_manager',
			exclude: ['apps/common']
		},
		{
			name: 'apps/shareholder/dashboard',
			exclude: ['apps/common']
		},
		// builds parts of the accounts section for the trade ticket window
		{
			name: 'views/trade_ticket/checklist_views/root_subscription',
			exclude: ['apps/common']
		},
		// pipeline view, includes trade checklist view for fast initial render of trade ticket window
		{
			name: 'apps/pipeline',
			exclude: ['apps/common'],
			include: ['views/trade_ticket/checklist_views/root_checklist']
		}
	],
	preserveLicenseComments: false,
	findNestedDependencies: true
});
