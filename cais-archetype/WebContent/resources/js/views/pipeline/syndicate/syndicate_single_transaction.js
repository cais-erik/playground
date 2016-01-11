define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'amd/backbone/Backbone.ModelBinder',
	'views/pipeline/syndicate/base_syndicate_offer_detail',
	'models/authed_user',
	'text!templates/pipeline/syndicate/syndicate_single_transaction.html',
	'amd/common/Backbone.ModelBinder.config'
], function ($, _, Backbone, Vm, Events, Handlebars, Binder, BaseCmOfferDetail, AuthedUser, Template) {
	/* CmSingleTransaction Class
	 * Shows the details of a single CM transaction
	 * @extends BaseCmOfferDetail
	 */
	var CmSingleTransaction = BaseCmOfferDetail.extend({
		_modelBinder: undefined,
		className: 'cm-single-transaction-container',
		initialize: function() {
			var context = {
				offering: this.options.parent.model.toJSON(),
				caisemployee: AuthedUser.get('caisemployee')
			};
			var template = Handlebars.compile(Template);
			this.$el.html(template(context));
			this._modelBinder = new Backbone.ModelBinder();
			this.render();
		},
		render: function() {
			var that = this;
			var columns = [];
			this._modelBinder.bind(this.model, this.el);
			this.manageControlVisibility();
		},
		events: function(){
			return _.extend({}, BaseCmOfferDetail.prototype.events,{
				'click .notify': 'notify',
				'click .notify-final-prospectus': 'notifyFinalProspectus'
			});
		},
		manageControlVisibility: function() {
			var caisemployee = AuthedUser.get('caisemployee');
			if (!caisemployee) this.$('.notify-individual').hide();
		},
		notify: function(e) {
			e.preventDefault();
			if (!this.model.get('allotted')) {
				new Alert('This account does not have an allocation yet. Add an allocation before notifying this user.', 'OK');
				return;
			}
			this.bootStrapEmailDialog({
				callback: _.bind(this.options.parent.model.notifySelected, this.options.parent.model),
				titleText: 'Notify ' + this.model.get('advisorName'),
				collection: this.options.parent.model.getContactList(),
				selectUser: this.model.get('advisorName')
			});
		},
		notifyFinalProspectus: function(e) {
			e.preventDefault();
			this.bootStrapEmailDialog({
				collection: this.options.parent.model.getContactList('FINAL_PROSPECTUS'),
				selectUser: this.model.get('advisorName'),
				callback: _.bind(this.options.parent.model.notifyFinalProspectus, this.options.parent.model),
				titleText: 'Notify ' + this.model.get('advisorName') + ' of Final Prospectus'
			});
		},
		closeView: function() {
			this.$el.fadeOut('fast', _.bind(function() {
				this.trigger('view:close');
			}, this));
		}
	});
	return CmSingleTransaction;
});