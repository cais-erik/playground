define([
	'underscore',
	'backbone',
	'models/tree/tree_events'
], function(_, Backbone, TreeEvents) {
	var baseModel = Backbone.Model.extend({
		_autoFetchChild: false,
		initialize: function() {
			// broadcasted from UI
			this.listenTo(TreeEvents, 'treeExpand', function(cid) {
				// if broadcasted CID is this model
				if (cid === this.cid && this.child) {
					// if model has children and hasn't been fetched already
					if (this.get('hasChildren') !== false && !this.child.models.length) {
						this.fetchChild();
					}
				} 
			});
			// set a reference to the parent in the child collection
			if (this.child) {
				this.child = new this.child();
				this.child.parent = this.toJSON();
			}
		},
		// serializes the model and its children to get it ready for UI
		toJSON: function(){ 
			var obj = _.clone(this.attributes);
			obj.cid = this.cid; // add the CID to the model

			// TODO: evaluate when server returns 0 or 1...
			if (obj.hasChildren === 0) obj.hasChildren = false
			else obj.hasChildren = true;

			// TODO: change backend to return object name more uniformly and w/o firm: team: etc
			obj.displayName = obj.clientName || obj.teamName || obj.name || obj.investorName || obj.investmentEntityName;
			obj.shortname = obj.displayName.replace('Firm : ', '').replace('Team : ', '').replace('Advisor : ', '').replace('Client : ', '');

			// serialize and child collections
			if (this.child instanceof Backbone.Collection) {
				obj.children = this.child.toJSON();
			}
			return obj;
		},
		/**
		 *	Fetches the child in the tree
		 *	@param callback, function, callback after successful child fetch
		*/
		fetchChild: function(callback) {
			var that = this;
			if (!this.child) {
				if (typeof callback === 'function') callback.call(this, null);
				return;
			}
			// prevent fetching twice
			/*
			if (this.child.models.length) {
				callback.call(this, this.child);
				return;
			}
			*/
			this.child.fetch({
				success: function(collection) {
					TreeEvents.trigger('fetchChild', collection);
					if (typeof callback === 'function') callback.call(this, collection);
				}
			});
		}
	});
	return baseModel;
});