define([
	'underscore',
	'backbone',
	'models/tree/base_tree_model',
	'collections/clients'
], function(_, Backbone, BaseModel, ClientsCollection) {
	var advisorModel = BaseModel.extend({
		defaults: {
			categoryName: 'Advisor'
		},
		idAttribute: 'userId',
		initialize: function() {
			BaseModel.prototype.initialize.apply(this, arguments);
			//this.child = new this.child();
			this.child.params.advisorTeamId = this.get('advisorTeamId');
			this.child.params.userId = this.id;
			this.child.parentCid = this.cid;
			this.child.setUrl();
			if (this._autoFetchChild) this.fetchChild();
		},
		child: ClientsCollection
	});
	return advisorModel;
});
