define([
	'jquery',
	'underscore',
	'backbone',
	'collections/base_tree_collection',
	'models/tree/firm'
], function($, _, Backbone, BaseCollection, FirmModel){
	var firmCollection = BaseCollection.extend({
		url: '/constructCAISAccountHierarchy',
		model: FirmModel,
		collectionType: 'Firms',
		kendoDataSource: kendo.data.HierarchicalDataSource,
		initialize: function() {
			this.kendoDataSource = new this.kendoDataSource({
				schema: {
					model: {
						hasChildren: 'hasChildren',
						id: 'cid'
					}
				}
			});
			this.on('add', this.addToDataSource);
			window.firmsDebug = this;
		},
		addToDataSource: function(model) {
			this.kendoDataSource.add(model.toJSON());
		}
	});
	return new firmCollection();
});