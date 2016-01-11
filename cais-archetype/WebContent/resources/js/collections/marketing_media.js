define([
	'jquery',
	'underscore',
	'backbone',
	'goog!feeds,1'
], function($, _, Backbone){
	var MarketingMediaFeed = Backbone.Collection.extend({
		url: 'https://www.caisgroup.com/feed/',
		articleCount: 10,
		contentSnippetWords: 50,
		initialize: function() {},
		fetch: function(options ) {
			options = options ? _.clone(options) : {};
			if (options.parse === void 0) options.parse = true;
			var success = options.success;
			var collection = this;
			var feed = new google.feeds.Feed(collection.url);
			feed.setNumEntries(this.articleCount);
			feed.load(function(result) {
				if (!result.error) {
					var resp = result.feed.entries;
					var method = options.reset ? 'reset' : 'set';
					collection[method](resp, options);
					if (success) success(collection, resp, options);
					collection.trigger('sync', collection, resp, options);
				}
			});
			return this.sync('read', this, options);
		},
		parse: function(response) {
			// give each an id and set the publish date to ISO8601
			_.each(response, function(article) {
				article.id = Math.random().toString(36).substr(2, 9);
				article.publishedDate = new Date(article.publishedDate).toJSON();
				// create a longer contentSnippet
				article.contentSnippet = this.createSnippet(article.content);
			}, this);
			return response;
		},
		createSnippet: function(content) {
			return this.stripTags(content).split(' ').slice(0, this.contentSnippetWords).join(' ') + '&hellip;';
		},
		stripTags: function(html) {
			var tmp = document.createElement('div');
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		}
	});
	return MarketingMediaFeed;
});