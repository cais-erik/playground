define([
	'underscore',
	'backbone',
	'models/product/base_product_model',
	'kendo'
], function(_, Backbone, BaseModel){
	/** 
     * CapMarketEquityOffering class
     * Model class for a syndicate equity offering
     * Extends CapMarketProduct
	 */
	var CapMarketEquityOffering = BaseModel.extend({
		defaults: {
			expectedTimingWindow: 'Before market close',
			assetClass: 'Equity',
			exchange: 'NYSE',
			offeringType: 'IPO',
			productType: 'Common Stock',
			orderPeriodDesc: 'Indications of interest will be accepted until 4:00PM, '
		},
		initialize: function() {
			this.listenTo(this, 'change:orderPeriodEndDate', this.onOrderPeriodChange);
		},
		onOrderPeriodChange: function(model, value) {
			var date = new Date(value);
			var currentOrderPeriod = this.get('orderPeriodDesc').substring(0, 40);
			var defaultText = this.defaults.orderPeriodDesc.substring(0, 40);

			if (currentOrderPeriod === defaultText) {
				this.set('orderPeriodDesc', 'Indications of interest will be accepted until ' + kendo.toString(date, 'h:mm tt') +', ');
			}
		},
		idAttribute: 'internalCusip',
		urlRoot: '/api/products/syndicate/offerings/equity',
		cacheName: 'CapMarketEquity',
		getName: function() { return this.get('name'); },
		/** 
		 * Override the BaseProductModel method to return the correct doc category depending on offering type
		 */
		getDocumentCategoryId: function() {
			var offeringType = this.get('offeringType');
			var id = this._documentCategoryId;
			if (!offeringType) id = false;
			if (offeringType === 'Private Placement') id = 47;
			return id;
		}
	});
	return CapMarketEquityOffering;
});

