define([
	'underscore',
	'backbone'
], function(_, Backbone){

	// available subviews
	var views = [
		{
			'name': 'financials',
			'uri': 'views/shareholder/sub_views/finance'
		},
		{
			'name': 'firm',
			'uri': 'views/shareholder/sub_views/firm_status'
		}
	];
	var ShAppViews = Backbone.Collection.extend({});
	/** 
	 * ShAppModel class
	 * Model class to manage application state on shareholder section
	 * Extends Backbone Model
	 */
	var ShAppModel = Backbone.Model.extend({
		_subViews: new ShAppViews(views),
		defaults: {
			fromDate: '2009-01-01T05:00:00.000Z',
			toDate: new Date().toJSON(),
			showLetter: false
		},
		initialize: function() {
			window.debug = this;
		},
		/* set the date range of the model 
		 * accepts an options object containing a preset string ('itd,'ytd',etc) or
		 * a fromDate and toDate
		 */
		setDateRange: function(options) {
			var dates = {
				fromDate: null,
				toDate: null
			};
			var now = new Date();
			if (options.preset) {
				switch(options.preset) {
					case 'itd':
						dates.fromDate = this.defaults.fromDate;
						dates.toDate = now.toJSON();
						break;
					case 'ytd':
						dates.toDate = now.toJSON();
						dates.fromDate = new Date(now.getFullYear(), 0, 1).toJSON();
						break;
					case 'lastYear':
						dates.toDate = new Date(now.getFullYear() -1, 11, 31).toJSON();
						dates.fromDate = new Date(now.getFullYear() -1, 0, 1).toJSON();
						break;
					case 'lastMonth':
						dates.toDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toJSON();
						dates.fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 0).toJSON();
						break;
					case 'lastQuarter':
						var currentMonth = now.getMonth();
						break;
				}
			} else {
				dates.fromDate = options.fromDate;
				dates.toDate = options.toDate;
			}
			this.set(dates);
			return dates;
		},
		// returns a URI component for the model/application state
		getUriComponent: function() {
			var route = '/';
			if (this.get('section')) route = route += this.get('section');
			return route;
		},
		getSubView: function() {
			return this._subViews.findWhere({'name': this.get('section')});
		},
		getSubViews: function() { return this._subViews.toJSON(); },
		selectNext: function() {
			var currentIndex = this._subViews.indexOf(this.getSubView());
			var next = this._subViews.at(currentIndex + 1);
			if (!next) next = this._subViews.at(0);
			this.set('section', next.get('name'));
		},
		selectPrev: function() {
			var currentIndex = this._subViews.indexOf(this.getSubView());
			var next = this._subViews.at(currentIndex - 1);
			if (!next) next = this._subViews.at(this._subViews.length - 1);
			this.set('section', next.get('name'));
		}
	});
	return new ShAppModel();
});