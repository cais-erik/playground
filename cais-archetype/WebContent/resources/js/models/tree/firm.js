define([
	'underscore',
	'backbone',
	'models/tree/base_tree_model',
	'models/tree/team',
	'collections/teams'
], function(_, Backbone, BaseModel, TeamModel, TeamsCollection) {
	var firmModel = BaseModel.extend({
		defaults: {
			categoryName: 'Firm'
		},
		idAttribute: 'clientId',
		initialize: function() {
			BaseModel.prototype.initialize.apply(this, arguments);
			//this.child = new this.child();
			this.child.params.id = this.id;
			this.child.parentCid = this.cid;
			this.child.setUrl();
			if (this._autoFetchChild) this.fetchChild();
		},
		child: TeamsCollection
	});
	return firmModel;
});