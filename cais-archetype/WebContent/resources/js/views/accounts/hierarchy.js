/*
View to manage hierarchy tree
Accepts a collection extended from base_tree_collection.js
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/hierarchy_list_item.html',
	'models/tree/tree_events',
	'collections/firm_tree_dataSource'
], function ($, _, Backbone, Handlebars, HierarchyListItem, TreeEvents, FirmCollection) {
	var hierarchyView = Backbone.View.extend({
		el: $('.hierarchy-view'), // rendered in jsp template
		collection: FirmCollection.data,
		initialize: function() {
			$(window).resize(_.bind(this.resizeTreeView, this));
			this.listenTo(TreeEvents, 'expandNode', this.expandNode);
			this.listenTo(TreeEvents, 'updateNode', this.updateNode);
			this.listenTo(TreeEvents, 'selected:remove', this.removeSelected);
			this.listenTo(TreeEvents, 'teamMember:added', this.refreshSelected);
			this.listenTo(TreeEvents, 'refreshTree', this.loadNodeFromFragment);
			this.render();
		},
		render: function() {
			var that = this;
			this.$('#group-tree-wrapper').jScrollPane();
			this.renderTree();
		},
		loadNodeFromFragment: function(fragment, refresh) {
			var that = this;
			if (fragment === 'cais') {
				that.selectFirstNode();
				that.hierarchy.dataItem(that.hierarchy.select());
				if (!refresh) TreeEvents.trigger('selectNode', that.hierarchy.dataItem(that.hierarchy.select()));
				that.loadAttempts = 0;
				return;
			}
			var fragments = _.values(fragment);
			if (!fragments.length) return; 

			// the datasource to operate on
			var op = this.hierarchy.dataSource;
			var i = 0;
			var getChild = function() {
				if (op.data()[0].categoryName === 'CAIS') {
					var node = that.hierarchy.findByUid(op.data()[0].uid);
					that.hierarchy.expand(that.hierarchy.findByText('CAIS'));
					op = op.data()[0].children;

					// if the node is already loaded, just call get child
					if (that.hierarchy.dataItem(node).loaded()) {
						getChild();
					}
					// else bind to the next dataBound event, which is fired when the node expand AJAX call finishes
					else {
						that.hierarchy.one('dataBound', function() {
							getChild();
						});
					}
				}
				else {
					var model = op.get(fragments[i]);
					// model does not exist...
					if (!model) {
						that.onRoutingError(fragment, refresh || false);
						return;
					}
					// if the model does not have children, but we have a fragment that says it does...
					if (!model.hasChildren && i + 1 != fragments.length) {
						that.onRoutingError(fragment, refresh || false);
						return;
					}
					// set the operator to the model's children for the next iteration
					op = model.children;
					var node = that.hierarchy.findByUid(model.uid)
					that.hierarchy.expand(node);
					i++
					if (i < fragments.length) {
						// if the node is already loaded, just call get child
						if (that.hierarchy.dataItem(node).loaded()) {
							getChild();
						}
						// else bind to the next dataBound event, which is fired when the node expand AJAX call finishes
						else {
							that.hierarchy.one('dataBound', function() {
								getChild();
							});
						}
					}
					// select the last item in fragment
					else {
						that.activeNode = model;
						that.hierarchy.select(node);
						that.scrollToElem(node);
						that.loadAttempts = 0;
						if (!refresh) TreeEvents.trigger('selectNode', model);
					}
				}
			}
			getChild();
		},
		renderTree: function() {
			var that = this;
			var template = Handlebars.compile(HierarchyListItem);

			this.hierarchy = this.$('#group-tree').kendoTreeView({
				template: function(data) {
					// hacky solution to inject advisorId into the entity fragment
					if( data.item.categoryName === 'Entity') {
						var advisorId = data.item.parent().parent().parent().parent().id;
						var frag = data.item.fragment.split('/');
						data.item.fragment = frag[0] + '/' + frag[1] + '/' + advisorId + '/' + frag[2] + '/' + frag[3];
					}
					return template(data)},
				dataSource: that.collection,
				collapse: _.bind(that.resizeTreeView, that),
				expand: _.bind(that.onExpand, that),
				select: function(e) {
					that.noscroll = true;
					that.activeNode = this.dataItem(e.node);
					TreeEvents.trigger('tree:nodeSelect', that.activeNode);
				}
			}).data("kendoTreeView");
			this.hierarchy.one('dataBound', function() {
				that.trigger('treeReady');
			});
			this.resizeTreeView();
		},
		onExpand: function(event) {
			this.resizeTreeView();
		},
		getActiveNode: function() {
			return this.activeNode;
		},
		expandNode: function(node) {
			var elem = this.hierarchy.findByText(node.displayName);
			this.hierarchy.expand(elem);
		},
		selectFirstNode: function() {
			var first = this.$('a.cais-list-item').first();
			first.click();
			this.hierarchy.expand(first);
		},
		updateNode: function(node) {
			var that = this;
			// if node instance does not contain the parent function, fail silently
			if (typeof node.parent !== 'function') return;
			// updates a node with a given model
			var parent = node.parent().parent();
			if (parent) {
				parent.loaded(false);
				parent.load();
				parent.one('change', function() {
					that.hierarchy.select(that.getNodebyId(node.id));
					that.scrollToElem(that.hierarchy.select());
					TreeEvents.trigger('nodeUpdateComplete', that.hierarchy.dataItem(that.hierarchy.select()));
				});
			} else {
				this.hierarchy.one('dataBound', function() {
					that.hierarchy.select(that.getNodebyId(node.id));
					that.hierarchy.expand(that.hierarchy.select());
					TreeEvents.trigger('nodeUpdateComplete', that.hierarchy.dataItem(that.hierarchy.select()));
				});
				FirmCollection.data.read();
			}
		},
		refreshSelected: function() {
			var selected = this.hierarchy.dataItem(this.hierarchy.select());
			if (selected) {
				selected.loaded(false);
				selected.hasChildren = true;
                selected.load();	
                this.hierarchy.expand(this.hierarchy.select());
			}
		},
		// reinits the scroller whenever content is added
		// TODO: find better way to detect resize, consider jQuery resize plugin
		resizeTreeView: _.debounce(function() {
			var scroller = this.$('#group-tree-wrapper').data('jsp');
			if (scroller) {
				setTimeout(function() {
					scroller.reinitialise();	
				}, 1200);
			}
		}, 100),
		scrollToElem: function(elem) {
			if (this.noscroll) {
				this.noscroll = false;
				return;
			}
			var scroller = this.$('#group-tree-wrapper').data('jsp');
			scroller.reinitialise();
			scroller.scrollToElement(elem, true);
		},
		loadAttempts: 0,
		// attempts to reload the tree if a fragment isn't found, and then shows an error if it isn't found the second time
		onRoutingError: function(fragment, refresh) {
			var that = this;
			if (this.loadAttempts > 0) {
				Alert('This entity could not be found. Select another member of the accounts tree.', 'OK');
				this.loadAttempts = 0;
			}
			else {
				this.loadAttempts = 1;
				FirmCollection.data.data([]);
				this.hierarchy.one('dataBound', function() {
					that.loadNodeFromFragment(fragment, refresh || false);
				});
				FirmCollection.data.read();
			}
		},
		removeSelected: function() {
			var that = this;
			this.hierarchy.select().slideUp('slow', function() {
				that.hierarchy.remove(that.hierarchy.select());
			});
		},
		// TODO: find method of selecting parent node directly
		getNodeByCid: function(cid) {return this.$('[data-cid="' + cid + '"]').parents('li.k-item').first()},
		getNodebyId: function(id) {
			var node = this.hierarchy.dataSource.get(id);
			return this.hierarchy.findByUid(node.uid);
		},
		// returns an object containing current active ids
		//TODO: consolidate with similar function in router
		getHierarchyIds: function() {
			var node = this.hierarchy.dataItem(this.hierarchy.select());
			if (!node) return null;
			if (!node.fragment) return null;

			if (node.fragment === 'cais') return 'cais';
			var frag = node.fragment.split('/');
			var obj = {};
			for (var i = 0; i < frag.length; i++) {
				var classType = 'firmId';
				if (i === 1) classType = 'advisorTeamId';
				if (i === 2) classType = 'advisorId';
				if (i === 3) classType = 'investorId';
				if (i === 4) classType = 'entityId';
				obj[classType] = parseInt(frag[i]);
			}
			return obj;
		}
	});
	return hierarchyView;
});