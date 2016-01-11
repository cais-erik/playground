define([
	'underscore',
	'backbone'
], function(_, Backbone){
	var ClientEmail = Backbone.Model.extend({
		defaults: {
			selected: true
		},
		serialize: function() {
			return _.clone(_.omit(this.attributes, ['selected', 'uuid']));
		},
		idAttribute: 'uuid'
	});
	/** 
     * ClientEmailList
     * Collection class for a list of emails
     */
	var ClientEmailList = Backbone.Collection.extend({
		url: '/api/sfdata/cmDistributionList',
		model: ClientEmail,
		initialize: function(models, options) {
			if (options.type === 'StructuredProduct') {
				this.url = '/api/sfdata/sp_distribution';
			}
			else if (options.type === 'test') {
				this.url = '/api/sfdata/test_distribution';
			}
			else {
				this.url = '/api/sfdata/syndicate_distribution';
			}
		},
		// returns the members of collection with selected: true
		getSelected: function() {
			return _.invoke(this.where({selected: true}), 'serialize');
		},
		parse: function(response) {
			// add an ID to each record
			_.each(response, function(record, i) {
				record.uuid = i;
				if (record.firmName === 'null') record.firmName = 'Unkown';
			});
			return response;
		}
	});
	return ClientEmailList;
});

