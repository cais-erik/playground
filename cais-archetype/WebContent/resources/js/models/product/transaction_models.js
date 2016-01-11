define([
	'underscore',
	'backbone',
], function(_, Backbone){
	/** 
     * BaseTransaction class
     * Model class for a transaction
     * Extends Backbone Model
	 */
	var BaseTransaction = Backbone.Model.extend({
		defaults: {},
	});
	/** 
     * CapMarketsTransaction class
     * Model class for a transaction
     * Extends BaseTransaction Model
	 */
	var CapMarketsTransaction = BaseTransaction.extend({
		urlRoot: '/api/products/syndicate/transaction',
		idAttribute: 'caisId',
		initialize: function(attr, options) {
			options = _.extend({}, options);
			if (options.product && options.entity) {
				this.createTransaction(options.product, options.entity);
			}
			if (this.id) this.listenTo(this, 'change:ioi', this.modifyIoi);
		},
		/** 
	     * Modifies the IOI of a transaction model
	     * @param options, an options object
		 */
		modifyIoi: function(options) {
			options = _.extend({}, options);
			$.ajax({
				url: '/api/transaction/syndicate/ioi',
				type: 'PUT',
				data: JSON.stringify([this.toJSON()]),
				success: function(response) {
					if (response.success && options.success) {
						options.success(response);
					} else {
						new Alert(response[0].responseMessage, 'OK');
					}
				},
				error: function(resposne) {
					Alert('The IOI could not be changed at this time. Please contact CAIS support.', 'OK');
				},
				contentType: 'application/json',
				dataType: 'json'
			});
		},
		/** 
	     * Creates a transaction model
	     * @param products, a BB collection of products 
	     * @param entities, a BB collection of entities
		 */
		createTransaction: function(product, entity) {
			var obj = _.extend(
				product.pick('internalCusip'),
				entity.pick('clientId', 'userId', 'advisorTeamId')
			);
			obj.ioi = product.get('ioi-' + entity.id);
			obj.accountId = entity.id;
			this.set(obj);
			return this;
		},
		/** 
	     * Notify users of this transaction
	     * @param options, an options object containing success or fail callbacks
		 */
		notify: function(options) {
			$.post(this.url + '/' + 'notify', function() {
				if (options.success) options.success(); 
			}).error(function(response) {
				if (options.error) options.error(response);
			});
		}
	});
	return {
		cmTransactionModel: CapMarketsTransaction
	};
});