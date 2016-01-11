define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'views/products/base_product_landing',
	'collections/products/syndicate_all_offerings',
	'views/assets/product_viewer',
	'views/assets/product_list/syndicate_product_list',
	'text!templates/products/syndicate/product_list.html'
], function ($, _, Backbone, Vm, Events, BaseProductLanding, CmAllOfferings, ProductViewer, CapMarketsProductList, Template) {
	var CapMarketsLanding = BaseProductLanding.extend({
		name: 'Syndicate',
		products: CmAllOfferings,
		productList: CapMarketsProductList,
		productViewer: ProductViewer,
		template: Template
	});
	return CapMarketsLanding;
});