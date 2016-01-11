define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var entity = Backbone.Model.extend();
	var entityTypes = BaseCollection.extend({
		url: '/getEntityDropDownLists',
		model: entity,
		parse: function(resp, options) {
			if (resp.status === 'error') {
				// TODO: do some error handling in here
			} 
			else { 
				this.us_tax_exempt_basis = resp.msg.us_tax_exempt_basis;
				return resp.msg.entity_type_other;
			}
		},
	});
	return entityTypes;
});