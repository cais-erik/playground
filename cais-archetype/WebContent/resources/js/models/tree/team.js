define([
	'underscore',
	'backbone',
	'models/tree/base_tree_model',
	'collections/advisors'
], function(_, Backbone, BaseModel, AdvisorCollection) {
	var teamModel = BaseModel.extend({
		defaults: {
			categoryName: 'Team'
		},
		idAttribute: 'advisorTeamId',
		initialize: function() {
			BaseModel.prototype.initialize.apply(this, arguments);
			//this.child = new this.child();
			this.child.params.advisorTeamId = this.id;
			this.child.parentCid = this.cid;
			this.child.setUrl();

			if (this._autoFetchChild) this.fetchChild();
		},
		child: AdvisorCollection
	});
	return teamModel;
});