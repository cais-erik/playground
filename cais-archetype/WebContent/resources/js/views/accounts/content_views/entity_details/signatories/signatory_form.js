
define([
	'jquery',
	'underscore',
	'backbone',
	'views/assets/multiselector_form',
	'text!templates/accounts/entity/signatories/authorized_signatories.html',
	'text!templates/accounts/entity/signatories/signatory_list_item.html',
	'amd/backbone/Backbone.ModelBinder',
	'amd/backbone/Backbone.CollectionBinder'
], function ($, _, Backbone, MultiselectorForm, Template, ListItem) {
	var SignatoryForm = MultiselectorForm.extend({
		template: Template,
		className: 'signatory-form',
		collection: Backbone.Collection,
		listItem: ListItem
	});
	return SignatoryForm;
});