define([
	'underscore',
	'backbone',
	'models/product/transaction_models'
], function(_, Backbone, TransactionModels) {
	var CmTransactions = Backbone.Collection.extend({
		model: TransactionModels.cmTransactionModel,
		url: '/api/transaction/syndicate/ioi',
		/** 
	     * Creates an array of transaction models
	     * @param products, a BB collection of products 
	     * @param entities, a BB collection of entities
	     * @param options, an options object
		 */
		createTransactions: function(products, entities, options) {
			entities.each(function(entity) {
				products.each(function(product) {
					this.add(new this.model([], {product: product, entity: entity}));
				}, this);
			}, this);
			return this;
		},
		saveTransactions: function(options) {
			$.postJSON(this.url, this.toJSON(), function(response) {
				if (options.success) options.success(response);
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		},
		getReadyToBeBooked: function() {
			return new Backbone.Collection(this.filter(function(model) {
				if (model.get('allotted') !== null && !model.get('isBooked')) return true;
				else return false;
			}));
		}
	});

	var BookingPreview = Backbone.Model.extend({
		toJSON: function() {
			var attrs = _.clone(this.attributes);
			for (var i in attrs.bookingPreview) {
				if (!attrs.bookingPreview[i]) attrs.bookingPreview[i] = 'N/A';
			}
			return attrs;
		}
	});
	var BookingPreviews = Backbone.Collection.extend({
		model: BookingPreview
	});
	return {
		cmTransactions: CmTransactions,
		BookingPreviews: BookingPreviews
	};
});