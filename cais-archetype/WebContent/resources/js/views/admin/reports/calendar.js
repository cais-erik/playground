define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report',
	'text!templates/admin/reports/calendar.html',
	'//www.trumba.com/scripts/spuds.js'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, Template) {
	var CaisCalendar = BaseReport.extend({
		options: {
			sectionTitle: 'CAIS Calendar',
			frameSrc: '/resources/templates/admin/reports/cais_trumba_calendar.html'
		},
		template: Template,
		title: 'CAIS Calendar',
		className: 'calendar-view',
		events: {},
		loadCount: 0,
		postRender: function() {
			this.trigger('view:ready');
			$Trumba.addSpud({
				webName: "cais-internal",
				spudType : "main",
				spudId: 'trumba-calendar-container'
			});
			$Trumba.addSpud({
				webName: "cais-internal",
				spudType : "mix",
				spudId: 'trumba-filters' 
			});
			$Trumba.addSpud({
				webName: "cais-internal",
				spudType : "filter", 
				spudId: 'trumba-sub-filters'
			});
		}
	});
	return CaisCalendar;
});