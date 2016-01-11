define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	/** 
     * FiCollections
     * Collection class for active FI data
     */
	var FiCollections = Backbone.Collection.extend({
		url: '/api/sfdata/nfs_fidelity',
		initialize: function() {
			window.debug = this;
		},
		fidoIntoFirms: null,
		parse: function(response) {
			var filtered = [];
			_.each(response, function(val) {
				// make "null" = null
				for (var k in val) {
					if (val[k] === 'null') val[k] = null;
				}
				// make numbers numbers
				if(!isNaN(val.caisHfAumMil) && val.caisHfAumMil !== null) {
					val.caisHfAumMil = parseFloat(val.caisHfAumMil);
				} else {
					val.caisHfAumMil = 0;
				}
				if(!isNaN(val.opportunitySums) && val.opportunitySums !== null) {
					val.opportunitySums = parseFloat(val.opportunitySums);
				} else {
					val.opportunitySums = 0;
				}
				if (val.fidoIntroDate) filtered.push(val);
			});
			this.fidoIntroFirms = new Backbone.Collection();
			_.each(filtered, function(firm) {
				this.fidoIntroFirms.add(new this.fidoIntroFirms.model(firm));
			}, this);
			return response;
		},


		/** 
		 * Report data functions
		 * 
		 */

		// returns targets identified vs total targets (all models where priority !== null)
		getTargetsIdentified: function() {
			var priority = this.filter(function(model) { return model.get('priority')});
			return [{"category":"Identified","value": priority.length},{"category":"Total","value":3500}];
		},
		// returns a google maps array table of state data
		getMapData: function() {
			var arr = [['State','RM Introductions', 'Flows ($M)']]
			_.each(this.states, function(state) {
				var obj = this.getContactDataByState(state);
				arr.push([state, obj.rmIntro, obj.flow]);
			}, this);
			return arr;
		},
		getNationalTotals: function() {
			var obj = {
				rmIntro: this.fidoIntroFirms.length,
				executedContracts: 0,
				conversions: 0,
				flow: 0
			};	
			this.fidoIntroFirms.each(function(model) {
			//	if (model.get('introCall')) obj.rmIntro++;
				if (model.get('conversionDate')) obj.conversions++;
				if (model.get('ta')) obj.executedContracts++;
				obj.flow = obj.flow + model.get('caisHfAumMil');
			}, this);
			obj.flow = obj.flow.toFixed(1);
			return obj;
		},
		getTableData: function() {
			var data = [];
			var regions = _.values(this.regions);
			var categories = [{name: 'Identified Targets', field: 'identifiedTargets'},{name: 'RM Intro', field:'rmIntro'}, {name: 'Executed Contracts', field:'executedContracts'}, {name: 'Conversions', field:'conversions'}, {name: 'Flows ($MM)', field:'flow'}]; 
			var regionData = {};

			_.each(_.keys(this.regions), function(region) {
					regionData[region]  = this.getContactDataByRegion(region);
			}, this);

			_.each(categories, function(category) {
				var obj = {category: category.name};
				var total = 0;
				_.each(_.keys(regionData), function(region) {
					obj[region] = regionData[region][category.field];
					total = total + obj[region];
				}, this);
				obj.total = total;
				data.push(obj);
			}, this);
			return data;
		},


		// helper functions

		// returns the contact obj by state
		getContactDataByState: function(state) {
			var models = this.fidoIntroFirms.where({billingState: state});
			var obj = {
				rmIntro: models.length,
				executedContracts: 0,
				conversions: 0,
				flow: 0,
				identifiedTargets: 0
			};	
			_.each(models, function(model) {
				//if (model.get('introCall')) obj.rmIntro++;
				if (model.get('conversionDate')) obj.conversions++;
				if (model.get('ta')) obj.executedContracts++;
				if (model.get('priority')) obj.identifiedTargets++;
				obj.flow = obj.flow + model.get('caisHfAumMil');
			}, this);
			obj.flow = this.roundNumber(obj.flow, 2);
			return obj;
		},
		
		// returns the contact obj by region
		getContactDataByRegion: function(region) {
			var obj = {
				rmIntro: 0,
				executedContracts: 0,
				conversions: 0,
				flow: 0,
				identifiedTargets: 0
			};	
			_.each(this.regions[region], function(state) {
				var stateData = this.getContactDataByState(state);
				obj.rmIntro = obj.rmIntro + stateData.rmIntro;
				obj.executedContracts = obj.executedContracts + stateData.executedContracts;
				obj.conversions = obj.conversions + stateData.conversions;
				obj.flow = obj.flow + stateData.flow;
				obj.identifiedTargets = obj.identifiedTargets + stateData.identifiedTargets;
			}, this);
			obj.flow = this.roundNumber(obj.flow, 2);
			return obj;
		},
		roundNumber: function(rnum, rlength) { // Arguments: number to round, number of decimal places
			return Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
		},
		// state region map
		regions: {
			newEngland: ['NH','MA','VT','CT','RI','ME'],
			midAtlantic: ['NJ','DE','MD','PA','NY'],
			southEast: ['TN','NC','SC','GA','FL','AL'],
			southCentral: ['TX','LA','MI','AR', 'MO','KS','NE','NM','OK','MS'],
			nothCentral: ['KY','OH','MI','WI','MN','IA','SD','IN','ND','IL'],
			northWest: ['MT','WY','ID','OR','WA'],
			southWest: ['CA','NV','UT','AZ','NM','CO']
		},
		states: ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
		
	});
	return new FiCollections();
});