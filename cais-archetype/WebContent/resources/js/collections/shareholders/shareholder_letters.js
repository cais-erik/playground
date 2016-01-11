define([
	'underscore',
	'backbone',
], function(_, Backbone) {
	var ShareholderLetter= Backbone.Model.extend({
		defaults: {
			attachments: []
		},
		addAttachment: function(attachment) {
			var attachments = this.get('attachments');
			attachments.push(attachment);
			this.set('attachments', attachments);
			return attachments;
		}
	});
	var ShareholderLetters = Backbone.Collection.extend({
		url: '/api/shareholder/letter',
		model: ShareholderLetter,
		initialize: function() {},
		comparator: function(model) {
			return -new Date(model.get('toDate'));
		}
	});
	return ShareholderLetters;
});