define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'routers/accounts_router',
	'views/accounts/accounts_hierarchy',
	'amd/backbone/Backbone.ModelBinder',
	'views/assets/firm_team_advisor_select',
	'text!templates/accounts/team_detail/team_basic_info.html',
	'amd/common/Backbone.ModelBinder.config',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Vm, Router, Hierarchy, Binder, Selector, Template) {
	var TeamBasicInfo = Backbone.View.extend({
		options: {},
		className: 'team-basic-info',
		_modelBinder: undefined,
		options: {
			hideFirm: false,
			//firmId: Hierarchy.getHierarchyIds().firmId,
			hideTeam: true,
			advisorTeamId: null, // preselected advisor team
			advisorId: null, // preselected advisor,
			createEntity: false, // create new investment entity after saving
			hideAdvisor: true
		},
		initialize: function() {
			var selectedIds = Hierarchy.getHierarchyIds();
			if (selectedIds !== 'cais') this.options = $.extend(this.options, {firmId: this.model.get('clientId')}, selectedIds);
			if (this.options.firmId) this.model.set('clientId', this.options.firmId);
			
			this._modelBinder = new Backbone.ModelBinder();
			this.selector = new Selector(this.options);

			this.listenTo(this.selector, 'render', this.render);
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template(this.options));
			this.$('.firm-selector').html(this.selector.$el);			
			this.$el.kendoValidator();
			this._modelBinder.bind(this.model, this.el);
			kendo.init(this.$el);
			if (this.model.get('clientId')) {
				this.$('.team-member-form').show();	
			}
		},
		events: {
			'change [name=clientId]': 'firmChangeHandler'
		},
		firmChangeHandler: function(e) {
			this.model.set('clientId', $(e.currentTarget).val());
			this.$('.team-member-form').show();	
		},
		saveModel: function() {
			var that = this;
			if (!this.$el.data('kendoValidator').validate()) return;
			this.model.save([], {
				success: function() {
					if (!that.options.editing) {
						Router.appRouter.navigate('/detail/' + that.model.get('fragment'), {trigger: true});
					} else {
						Hierarchy.updateNode(Hierarchy.hierarchy.dataItem(Hierarchy.hierarchy.select()));
						that.trigger('saveSuccess');	
					}
				}
			});
		},
		clean: function() {
			this.stopListening();
		}
	});
	return TeamBasicInfo;
});