define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){
	var baseCollection = Backbone.Collection.extend({
		parse: function(resp, options) {
			if (resp.status === 'error') {
				// TODO: do some error handling in here
			} 
			else { 
				return resp.msg;
			}
		},
		setUrl: function() {
			if(!this.baseUrl) {
				throw 'Collection must have baseUrl defined';
				return;
			}
			if (this.params) {
				this.url = this.baseUrl + '?' + $.param(this.params);
			}
			else{
				this.url = this.baseUrl	
			}
			return this.url;
		},
		loadNode: function(fragment, callback) {
			/* recursive function that drills down through fragment object loading collections as it goes
			 * @param fragment, object, contains firm/team/advisor/client/entity ids
			 * @param callback, function, callback function, returns the last model in the chain
			 */
			var fragments = _.values(fragment);
			if (!fragments.length) return; 
			
			var op = this;
			var i = 0;
			var getChild = function() {
				var model = op.get(fragments[i]);
				if (!model) {
					console.log('Not found ', model);
					//Alert('This entity could not be found', 'ok');
					return;
				}
				model.fetchChild(function(collection) {
					op = model.child;
					i++;
					if (i < fragments.length) {
						getChild();
					}
					else{
						if (typeof callback === 'function') callback.call(this, model);
					}
				});
			}
			getChild();
		}
	});
	return baseCollection;
});

