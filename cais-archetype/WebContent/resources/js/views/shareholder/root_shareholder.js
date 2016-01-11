define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/shareholder/shareholder_app_model',
	'views/shareholder/sub_views/sh_report_manager',
	'views/shareholder/sub_views/sh_letter',
	'views/shareholder/sub_views/finance',
	'views/shareholder/sub_views/firm_status'
], function ($, _, Backbone, Vm, Events, Handlebars, ShAppModel, ShReportManager, ShLetter) {
	var RootShareholder = Backbone.View.extend({
		el: $('.workspace'), // rendered in base template
		options: {},
		initialize: function() {
			this.setupKendoCharts();
			Events.on('domchange:title', this.changeTitle);
			this.listenTo(ShAppModel, 'change:section', this.onSectionChange);
			this.listenTo(ShAppModel, 'change:showLetter', this.onShowLetterChange);
			this.render();
			Vm.create(this, 'VmReportManager', ShReportManager);
		},
		render: function() {
			kendo.init(this.$el);
			this.viewLetters();
		},
		events: {
			'click .page-navigation': 'navigateClickHandler',
			'click .print-report': 'printReport',
			'click .view-letters': 'viewLetters'
		},
		printReport: function(e) {
			e.preventDefault();
			window.print();
		},
		viewLetters: function(e) {
			if (e) e.preventDefault();
			ShAppModel.set('showLetter', true);
		},
		navigateClickHandler: function(e) {
			e.preventDefault();
			if ($(e.currentTarget).hasClass('right')) {
				this.subView.$el.addClass('left');
				ShAppModel.selectNext();
			} else {
				this.subView.$el.addClass('right');
				ShAppModel.selectPrev();
			}
		},
		/**
		 *	Renders a subview in the .main-column container
		 *  @param view, Backbone View class
		 *  @param options, View options object
		 */
		showView: function(view, options) {
			// if (this.subView) this.subView.remove();
			// set the active tab if not set already
			var closedViewPosition = 'right';
			if (this.subView) {
				if (this.subView.$el.hasClass('right')) closedViewPosition = 'left';
			}

			this.subView = Vm.create(this, 'Subview_' + ShAppModel.get('section'), view, options || {});
			if (this.subView.title) this.updateTitle(this.subView.title);
			//TODO: find a better way to manage the css transition timing
			setTimeout(_.bind(function() {
				this.subView.$el.addClass(closedViewPosition);
				this.$('.workspace-content').html(this.subView.$el);
				setTimeout(_.bind(function() {
					this.subView.$el.removeClass(closedViewPosition);
					Events.trigger('rootShareholder:viewchange', this);
				}, this), 1);
			}, this), 500);
		},
		/**	
		 *	Updates the title tag of the page
		 *  @param title, string, title of page
		 */
		changeTitle: function(title) {
			$(document).attr('title', title + ' | CAIS');
		},
		updateTitle: function(title){
			this.$('.section-title').fadeOut('fast', function() {
				$(this).text(title);	
				$(this).fadeIn('slow');
			});
		},
		onShowLetterChange: function(model, value) {
			if (value) {
				Vm.create(this, 'ShLetter', ShLetter);
			}
		},
		onSectionChange: function(model, value) {
			require([model.getSubView().get('uri')], _.bind(function(subView) {
				this.showView(subView);
			}, this));
		},
		setupKendoCharts: function() {
			kendo.dataviz.ui.Chart.fn.options.seriesColors = ['#064a72', '#FF9300', '#2DB1FF', '#ffcd35', '#94a0a9', '#B26700'];
			kendo.dataviz.ui.Chart.fn.options.chartArea.background = "";
			kendo.dataviz.ui.Chart.fn.options.transitions = false;
			kendo.dataviz.ui.Chart.fn.options.categoryAxis.color = "#E2E2E2";
			kendo.dataviz.ui.Chart.fn.options.valueAxis.color = "#E2E2E2";
			kendo.dataviz.ui.Chart.fn.options.categoryAxis.majorGridLines = {color: "#666"};
			kendo.dataviz.ui.Chart.fn.options.valueAxis.majorGridLines = {color: "#666"};
			kendo.dataviz.ui.Chart.fn.options.legend.labels.color = "#E2E2E2";
			kendo.dataviz.ui.Chart.fn.options.seriesDefaults['overlay'] = {gradient:"none"};

		}
	});
	return RootShareholder;
});