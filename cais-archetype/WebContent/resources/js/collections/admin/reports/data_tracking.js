define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	/** 
     * DataTrackingCollection
     * Collection class for active SF clients
     */
	var DataTrackingCollection = Backbone.Collection.extend({
		url: '/api/sfdata/data_tracking',
		parse: function(response) {
			_.each(response, function(client) {
				if (client.introCall === 'null') client.introCall = null;
				if (client.introMtg === 'null') client.introMtg = null;
				if (client.demo === 'null') client.demo = null;
				if (client.ta === 'null') client.ta = null;
			});
			return response;
		},
		getDaysToTa: function() {
			var tempCollection = new Backbone.Collection(this.models);
			var noTa = tempCollection.where({'ta': null,});
			var avgTimeArray = [];

			tempCollection.remove(noTa);
			tempCollection.each(function(model) {
				var taTime = model.get('ta');
				var initContactTime = model.get('introCall') || model.get('introMtg') || model.get('demo');
				if (taTime && initContactTime) {
					var taDate = new Date(taTime);
					var initContactDate = new Date(initContactTime);
					var oneDay  = 24*60*60*1000;
					avgTimeArray.push(Math.abs((taDate.getTime() - initContactDate.getTime()) / oneDay));
				}
			});
			var total = 0;
			_.each(avgTimeArray,function(val) {
			    total += val;
			});
			return Math.round(total/avgTimeArray.length);
		},
		getConvertedVsUnconverted: function() {
			var arr = [
				{
					category: 'Converted',
					value: this.length - this.where({'ta': null}).length
				},
				{
					category: 'In Progress',
					value: this.where({'ta': null}).length
				}
			];
			return arr;
		},
		getClientsByStatus: function() {
			// [{step: 'IntroCall', count: 89},]
			var introCall = {category: 'Intro Call', value: 0};
			var introMtg = {category: 'Intro Meeting', value: 0};
			var demo = {category: 'Demo', value: 0};
			var ta = {category: 'TA', value: 0};  

			this.each(function(model) {
				if (model.get('ta')) {
					ta.value += 1;
					return;
				}
				if (model.get('demo')) {
					demo.value += 1;
					return;
				}
				if (model.get('introMtg')) {
					introMtg.value += 1;
					return;
				}
				if (model.get('introCall')) {
					introCall.value += 1;
					return;
				}
			});
			return [introCall, introMtg, demo, ta];
		}
	});
	return new DataTrackingCollection();
});