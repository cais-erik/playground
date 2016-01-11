/*
Broadcasts events for tree UI and tree models to listen to:
fetchChild: triggered when child tree collection is fetched.
treeExpand: triggered when a node of the tree is expanded
tree:nodeSelect: triggered when user clicks on a tree of a node, passes node data as argument
selectNode: triggered when a node of the tree is selected
teamMember:added: triggered when a new advisor team member is added
updateNode: triggered when a node is modified by the application node and new model as arguments
nodeUpdateComplete: triggered when a node update is complete
*/

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var vent = _.extend({}, Backbone.Events);
	return vent;
});