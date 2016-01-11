define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/products/selected_products',
	'text!templates/products/trader/entity_item.html',
], function ($, _, Backbone, Vm, Events, Handlebars, SelectedProducts, Template) {
	var TraderEntityItem = Backbone.View.extend({
		tagName: 'li',
		attributes: {
			'class': 'account-item'
		},
		initialize: function() {
			this.$el.attr('id', 'account-' + this.model.id);
			this.listenTo(this.model.advisorTeams, 'sync', this.onAdvisorTeamsSync);
			this.listenTo(this.model, 'team:sync', this.onTeamSync);
			this.render();
		},
		render: function() {
			var context = {
				model: this.model.toJSON(),
				products: SelectedProducts.toJSON()
			};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			kendo.init(this.$el);
		},
		events: {
			'change [name=ioi]': 'onIoiChange',
			'click .remove-account': 'removeAccount',
			'change [name=userId]': 'userIdChangeHandler',
			'change [name=advisorTeamId]': 'advisorTeamIdChangeHandler'
		},
		advisorTeamTemplate: Handlebars.compile('{{#.}}<option value="{{id}}">{{advisorName}}</option>{{/.}}{{^.}}<option value="">No teams</option>{{/.}}'), 
		onAdvisorTeamsSync: function() {
			var elem = this.$('[name=advisorTeamId]');
			elem.html(this.advisorTeamTemplate(this.model.advisorTeams.toJSON()));
		},
		teamMemberTemplate: Handlebars.compile('{{#.}}<option value="{{userId}}">{{firstName}} {{lastName}}</option>{{/.}}{{^.}}<option value="">No teams</option>{{/.}}'), 
		onTeamSync: function(team) {
			this.$('[name=userId]').html(this.teamMemberTemplate(team.toJSON()));
			this.$('[name=userId]').kendoDropDownList();
			this.$('[name=advisorTeamId]').kendoDropDownList();
		},
		userIdChangeHandler: function(e) {
			this.model.set('userId', parseInt($(e.currentTarget).val()));
		},
		onIoiChange: function(e){
			var elem = $(e.currentTarget);
			var productId = elem.attr('data-productid');
			// bind the IOI uniquely to the account
			SelectedProducts.get(productId).set('ioi-' + this.model.id, parseInt(elem.val()));
		},
		advisorTeamIdChangeHandler: function(e) {
			this.model.set('advisorTeamId', parseInt($(e.currentTarget).val()));
		},
		removeAccount: function(e) {
			this.model.trigger('destroy', this.model, this.model.collection);
		}
	});
	return TraderEntityItem;
});