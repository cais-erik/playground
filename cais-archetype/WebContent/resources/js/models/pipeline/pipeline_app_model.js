define([
	'underscore',
	'backbone',
	'models/tree/tree_events'
], function(_, Backbone, TreeEvents){
	/** 
	 * PipelineAppModel class
	 * Model class to manage application state on pipeline view
	 * Extends Backbone Model
	 */
	var PipelineAppModel = Backbone.Model.extend({
		defaults: {
			type: null, // ai, cm
			lens: null, // grid', chart
			iois: null, // a CM ioi model id
			offering: null, // a CM offering model id
			transactionStatusId: null,
			filters: {
				type: null, //'cais',
				dataNode: {}
			},
			trade: false // false || object containing trade ticket attrs
		},
		_aiStatuses: ['Opportunities','Documents Received','Funds Received','Ready to Trade','Completed'],
		_cmStatuses: ['Active Orders', 'Finalized Orders'],
		initialize: function() {
			// listen to the tree events to determine filters
			this.listenTo(TreeEvents, 'tree:nodeSelect', function(data){
				this.set('filters', {
					type: data.categoryName,
					dataNode: data
				});
			});
		},
		selectedProducts: new Backbone.Collection(),
		// consider moving this somewhere else, like the transaction collections
		deleteTransactions: function(options) {
			var that = this;
			options = _.extend({}, options);
			Server.deleteTransaction(JSON.stringify(this.selectedProducts.pluck('id')), function(response) {
				that.selectedProducts.trigger('transactionsDeleted');
				that.selectedProducts.reset();
				if (options.success) options.success(response);
			});
		},
		// returns a URI component for the model/application state
		getUriComponent: function() {
			var route = '';
			if (this.get('trade')) {
				var tradeDetails = this.get('trade');
				route = '/trade/' + tradeDetails.transactionId + '/' + tradeDetails.section;
				if (tradeDetails.subViewName) route = route + '/' + tradeDetails.subViewName;
				return route;
			}
			route = '/' + this.get('type') + '/' + this.get('lens') + '/' + this.get('transactionStatusId');
			if (this.get('offering')) route = route + '/' + this.get('offering');
			if (this.get('iois')) route = route + '/' + this.get('iois');
			return route;
		},
		// utility function to return the active transaction status name
		getActiveStatusName: function() {
			if(this.get('type') === 'ai') return this._aiStatuses[this.get('transactionStatusId')];
			if(this.get('type') === 'cm') return this._cmStatuses[this.get('transactionStatusId')];
		}
	});
	return new PipelineAppModel();
});