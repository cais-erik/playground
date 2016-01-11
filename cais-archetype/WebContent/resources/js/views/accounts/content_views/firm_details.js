define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'views/accounts/content_views/base_details',
	'views/assets/big_loader',
	'views/accounts/detail_nav/add_firm_nav',
	'models/firm',
	'collections/products/all_products',
	'views/accounts/content_views/firm_detail/firm_basic_info',
	'views/accounts/content_views/firm_detail/firm_product_access',
	'views/accounts/content_views/firm_detail/firm_product_permissions',
	'views/accounts/content_views/firm_detail/firm_supervisors',
	'views/accounts/content_views/firm_detail/firm_cais_team',
	'views/accounts/content_views/firm_detail/firm_syndicate',
	'text!templates/accounts/content/firm_detail.html',
], function ($, _, Backbone, Vm, BaseDetails, BigLoader, FirmViewNav, FirmModel, AllProducts, FirmBasicInfo, FirmProductAccess, FirmProductPermissions, FirmFunctions, FirmCaisAccountTeam, FirmCapMarketsAccts, Template) {
	var AddFirm = BaseDetails.extend({
		options: {},
		className: 'firm-details detail-view',
		viewNav: FirmViewNav,
		template: Template,
		model: FirmModel,
		products: AllProducts,
		permissionList: null,
		firmSubViews: {
			'basic-info': FirmBasicInfo,
			'product-access': FirmProductAccess,
			'product-permissions': FirmProductPermissions,
			'supervisor': FirmFunctions,
			'cais-account-team': FirmCaisAccountTeam,
			'cap-markets-accounts': FirmCapMarketsAccts
		},
		/*
		initialize: function() {
			this.model = new this.model();
			this.viewNav = Vm.create(this, 'FirmViewNav', FirmViewNav);
			this.listenTo(this.viewNav, 'navLinkSelected', this.onNavChange);
			this.listenTo(this.model, 'completionUpdated', this.viewNav.enableCheckboxes);
			this.listenTo(this.model, 'modelError', this.onModelerror);
			// if a node was provided to the view, set the ID and assume editing
			if (this.options.node) {
				this.model.id = this.options.node.id;
				this.options.editing = true;
				this.model.fetch({
					success: _.bind(this.render, this)
				});
			}
			// else we are creating a new firm, just render
			else {
				this.render();
			}
		},
		*/
		postRender: function() {
			this.viewNav.enableCheckboxes(this.model.completed);
		}
	});
	return AddFirm;
});