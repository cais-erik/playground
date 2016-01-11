define([
	'underscore',
	'backbone',
	'collections/products/syndicate_equity_offerings',
	'collections/products/syndicate_preferred_offerings',
	'collections/products/syndicate_bond_offerings'
], function(_, Backbone, EquityOfferings, PreferredOfferings, BondOfferings) {
	/** 
     * SyndicateAllOfferings
     * Collection class for syndicate products
     */
	var SyndicateAllOfferings = Backbone.Collection.extend({
		url: '/api/products/syndicate/offerings',
		activeProduct: null,
		equityOfferings: EquityOfferings,
		preferredOfferings: PreferredOfferings,
		bondOfferings: BondOfferings,
		comparator: function(model) {
			var date = new Date(model.get('expectedTiming'));
			return -date;
		},
		initialize: function() {},
		setActiveModel: function(id) {
			this.activeProduct = this.get(id);
			if (this.activeProduct) {
				this.trigger('activeProductChange', this.activeProduct);
			}
		},
		// returns a model of the appropriate type
		newModel: function(id, type) {
			if (type === 'Preferred' || type === 'Preferred Stock') return new this.preferredOfferings.model({internalCusip: id});
			if(type === 'Bond') return new this.bondOfferings.model({internalCusip: id});
			else return new this.equityOfferings.model({internalCusip: id});
		},
		// push the two offering types their collections
		parse: function(response) {
			var that = this;
			var arr = [];
			$.each(response.cmEquityofferings, function(i, offering) {
				var model = new that.equityOfferings.model(offering);
				that.equityOfferings.add(model);
				arr.push(model);
			});
			$.each(response.cmPreferredOfferings, function(i, offering) {
				var model = new that.preferredOfferings.model(offering);
				that.preferredOfferings.add(model);
				arr.push(model);
			});
			if (response.cmBondOfferings) {
				$.each(response.cmBondOfferings, function(i, offering) {
					var model = new that.bondOfferings.model(offering);
					that.bondOfferings.add(model);
					arr.push(model);
				});
			}
			return arr;
		}
	});
	
	return new SyndicateAllOfferings();
});