define([
	'underscore',
	'backbone',
	'models/tree/base_tree_model',
	'collections/entities',
	'models/tree/tree_events'
], function(_, Backbone, BaseModel, EntitiesCollection, TreeEvents) {
	var clientModel = BaseModel.extend({
		defaults: {
			categoryName: 'Client'
		},
		idAttribute: 'investorId',
		initialize: function() {
			BaseModel.prototype.initialize.apply(this, arguments);
			//this.child = new this.child();
			this.child.params.investorId = this.id;
			this.child.parentCid = this.cid;
			this.child.setUrl();
			if (this._autoFetchChild) this.fetchChild();
		},
		// override the fetchChild method in base.js to insert advisor ID into each entity fragment
		fetchChild: function(callback) {
			var that = this;
			var advisorId = this.collection.parent.userId;
			this.child.fetch({
				success: function(collection) {
					collection.each(function(model) {
						var fragment = model.get('fragment').split('/');
						var newFragment = fragment[0] + '/' + fragment[1] + '/' + advisorId + '/' + fragment[2] + '/' + fragment[3];
						model.set('fragment', newFragment);
					});
					TreeEvents.trigger('fetchChild', collection);
					if (typeof callback === 'function') callback.call(this, collection);
				}
			});
		},
		child: EntitiesCollection
	});
	return clientModel;
});