define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/products/structured_products/key-terms-list.html',
	'text!templates/products/structured_products/key-terms-list-item.html',
	'amd/backbone/Backbone.ModelBinder',
	'amd/backbone/Backbone.CollectionBinder'
], function ($, _, Backbone, Template, ListItem) {
	var MultiSelectorForm = Backbone.View.extend({
		template: Template,
		className: 'multi-selector-form',
		collection: Backbone.Collection,
		listItem: ListItem,
		initialize: function() {
			var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(this.listItem, 'name');
			this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			if (typeof this.collection === 'function') this.collection = new this.collection(this.options.models);
			this.listenTo(this.collection, 'change', this.onCollectionChange);
			this.render();
		},
		render: function() {
			this.$el.html(this.template);
			this._collectionBinder.bind(this.collection, this.$('ul.items'));
			kendo.init(this.$el);
			this.$el.setMasks();
			if (this.postRender) this.postRender();
		},
		events: {
			'click .add-new': 'addNew',
			'click .remove-item': 'removeItem'
		},
		onCollectionChange: function() {
			this.trigger('collectionChange', this.collection.toJSON());
		},
		removeItem: function(e) {
			e.preventDefault();
			var item = $(e.currentTarget).parents('li');
			var index = item.index();
			item.slideUp('slow', _.bind(function() {
				this.collection.remove(this.collection.at(index));
				this.trigger('collectionChange', this.collection.toJSON());
			}, this));
		},
		addNew: function(e) {
			e.preventDefault();
			this.collection.add(new this.collection.model());
			kendo.init(this.$el);
			this.$el.setMasks();
			this.$('.items > li:last-child').hide().slideDown();
		},
		getItems: function() {
			return this.collection.toJSON();
		}
	});
	return MultiSelectorForm;
});