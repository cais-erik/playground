define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'amd/backbone/Backbone.ModelBinder',
	'models/firm',
	'views/accounts/accounts_hierarchy',
	'models/authed_user',
	'text!templates/accounts/firm_detail/firm_basic_info.html',
	'amd/common/Backbone.ModelBinder.config',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Vm, Binder, FirmModel, Hierarchy, AuthedUser, Template) {
	var FirmManager = Backbone.View.extend({
		options: {},
		className: 'firm-manager-details',
		_modelBinder: undefined,
		groupTemplate: '{{#.}}<option value="{{groupId}}">{{groupName}}</option>{{/.}}',
		initialize: function() {
			this._modelBinder = new Backbone.ModelBinder();
			this.listenTo(this.model.groupManagerDetails, 'sync', this.populateGroupList);
			this.render();
			this.model.groupManagerDetails.fetch();
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(Template);
			this.$el.html(template());
			this.$el.kendoValidator();
			this._modelBinder.bind(that.model, this.el);
			var roles = AuthedUser.get('roles'),
					hasAccess = false, isSalesRep = false;
			for(var i = 0; i<roles.length; i++){
				if (roles[i].name === "ROLE_SALES"){
					isSalesRep=true;

				}
				if(roles[i].name==="ROLE_SUPERADMIN" || roles[i].name==="ROLE_FINOPS"){
					hasAccess=true;
					break;
				}
			}
			hasAccess=hasAccess && !isSalesRep;
			if (!hasAccess) this.$('[name=groupId]').attr('disabled', 'disabled');
			this.$('[data-role=dropdownlist]').kendoDropDownList();
		},
		populateGroupList: function(collection) {
			var template = Handlebars.compile(this.groupTemplate);
			this.$('[name=groupId]').html(template(collection.toJSON())).val(this.model.get('groupId'));
			this.$('[data-role=dropdownlist]').kendoDropDownList();
		},
		events: {
			'change [name=groupId]': 'onGroupChangeHandler'
		},
		onGroupChangeHandler: function(e) {
			var model = this.model.groupManagerDetails.findWhere({'groupId': parseInt($(e.target).val())});
			this.model.set('typeOfGroup', model.get('typeOfGroup'));
		},
		saveModel: function() {
			var that = this;
			if (!this.$el.data('kendoValidator').validate()) return;
			this.model.save([], {
				success: function() {
					if (that.options.editing) {
						Hierarchy.updateNode(Hierarchy.hierarchy.dataItem(Hierarchy.hierarchy.select()));
					}
					that.trigger('saveSuccess');
				}
			});
		},
		clean: function() {
			this.stopListening();
		}
	});
	return FirmManager;
});
