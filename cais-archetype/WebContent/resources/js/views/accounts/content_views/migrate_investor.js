define([
	'jquery',
	'underscore',
	'backbone',
	'routers/accounts_router',
	'handlebars',
	'text!templates/accounts/content/migrate_investor.html',
	'views/assets/base_kendo_dialog',
	'views/accounts/accounts_hierarchy',
	'views/assets/firm_team_advisor_select',
	'models/tree/tree_events',
	'collections/accounts/all_investors',
	'collections/accounts/all_teams'
], function ($, _, Backbone, Router, Handlebars, Template, BaseKendoDialog, Hierarchy, Selector, TreeEvents, AllInvestors, AllTeams) {
	var MigrateInvestor = BaseKendoDialog.extend({
		allInvestors: new AllInvestors(),
		allTeams: new AllTeams(),
		options: {
			width: 475,
			height: 150,
			title: 'Move Investor',
			resizable: false,
			selfRender: true
		},
		template: Handlebars.compile(Template),
		render: function() {
			this.$el.html('<div class="doc-loading"><img src="/resources/assets/CAISloader-white.gif" alt="loading..." /></div>');
			$.when(
				this.allInvestors.fetch(),
				this.allTeams.fetch()
			).done(_.bind(function(){
				this.context = {
					investors: this.allInvestors.toJSON(),
					teams: this.allTeams.toJSON()
				};
				this.$el.html(this.template(this.context));
				
				this.initLists();
			}, this));
		},
		events: {
			'click .move-investor': 'moveInvestor'
		},
		initLists: function() {
			// attempt to set the investor value if an investor is selected in the hierarchy
			var selected = Hierarchy.getActiveNode();
			this.$('form').kendoValidator();

			this.$('[name=investorId]').kendoAutoComplete({
                dataSource: this.allInvestors.toJSON(),
                filter: "contains",
                dataTextField: 'name',
                placeholder: "Type client/investor..."
            });

            this.$('[name=advisorTeamId]').kendoAutoComplete({
                dataSource: this.allTeams.toJSON(),
                filter: "contains",
                dataTextField: 'advisorName',
                placeholder: "Type team name..."
            });
            try {
				this.$('[name=investorId]').data('kendoAutoComplete').value(this.allInvestors.get(selected.id).get('name'));
			} catch(e) { }
		},
		// TODO: move this to a model or collection someplace
		moveInvestor: function() {
			if (!this.$('form').data('kendoValidator').validate()) return;
			var investor = this.allInvestors.findWhere({'name': this.$('[name=investorId]').data('kendoAutoComplete').value()} );
			var advisorTeam = this.allTeams.findWhere({'advisorName': this.$('[name=advisorTeamId]').data('kendoAutoComplete').value() });
			var data = {
				investorId: investor.id,
				advisorTeamId: advisorTeam.get('advisorTeamId')
			};
			
			$.ajax({
				url: '/api/accounts/move_investor',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType: 'JSON',
				success: _.bind(this.onSuccess, this),
				error: _.bind(this.onError, this),
				type: 'PUT'
			});
		},
		onSuccess: function(response) {
			if (response.length){
				Router.appRouter.navigate('/list/' + response[0].fragment, {trigger: true});
			}
			this.kendoWindow.close();
		},
		onError: function(error) {
			try {
				new Alert('There was an error while moving clients. Error: ' + JSON.parse(error.msg), 'OK');
			}
			catch(e) {
				new Alert('There was an error while moving clients.', 'OK');
			}
		},
		onClose: function() {
			this.kendoWindow.destroy();
			this.remove();
		},
	});
	return MigrateInvestor;
});
