define([
	'underscore',
	'jquery',
	'backbone',
], function(_, $, Backbone) {

	/** 
	 * Contact, a contact model
	 * @extends Backbone.Model
	 */
	var Contact = Backbone.Model.extend({
		defaults: {
			selected: false,
		},
		// serialize the selected attribute in toView, omit for server serialization
		toView: function(options) { return _.clone(this.attributes); },
		toJSON: function(options) { return _.clone(_.omit(this.attributes, 'selected')); }
	});
	/** 
	 * ContactList, a contact collection
	 * @extends Backbone.Collection
	 */
	var ContactList = Backbone.Collection.extend({
		model: Contact,
		// serialize the selected attribute in toView, omit for server serialization
		toView: function(options) {
			return this.map(function(model) { return model.toView(options); });
		},
		getSelected: function() {
			var selectedModels = this.where({'selected': true});
			var selected = new Backbone.Collection();
			_.each(selectedModels, function(model) {
				selected.add(model.clone().unset('selected'));
			});
			return selected;
		}
	});

	return ContactList;
});