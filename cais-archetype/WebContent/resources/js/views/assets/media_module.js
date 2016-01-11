/** 
 * FlyoutNav - view to manage the flyout navigation window
 * Extends Backbone.View
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'handlebars',
	'collections/marketing_media',
	'text!templates/assets/marketing_media_module.html',
	'views/assets/media_module_article',
	'amd/handlebars/handlebars.helpers'
], function ($, _, Backbone, Vm, Handlebars, MarketingMediaFeed, Template, MediaModuleArticle) {
	var MediaModule = Backbone.View.extend({
		// el: $('.flyout-nav'), // rendered in base template
		className: 'marketing-media-module',
		options: {},
		template: Handlebars.compile(Template),
		initialize: function() {
			this.collection = new MarketingMediaFeed();
			this.collection.fetch();
			this.listenTo(this.collection, 'sync', this.render);
			$(document).on('cais-news.html', _.bind(this.render, this));
		},
		render: function() {
			this.$el.html(this.template(this.collection.toJSON()));
			this.$el.prependTo($('.news-content-area'));
			this.delegateEvents();
		},
		events: {
			'click article h1 a': 'onHeaderClick',
			'click .read-more': 'onHeaderClick'
		},
		onHeaderClick: function(e) {
			e.preventDefault();
			var model = this.collection.get($(e.currentTarget).parents('article').attr('id'));
			Vm.create(this, 'MediaModuleArticle', MediaModuleArticle, {model: model});
		}
	});
	return MediaModule;
});