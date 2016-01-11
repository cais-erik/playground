define([
	'underscore',
	'backbone',
	'views/experimental/records_geo'
], function(_, Backbone, Records) {
	var ClientLatLong = Backbone.Model.extend();
	var ClientLatLongs = Backbone.Collection.extend({
		url: '/getEntityDropDownLists',
		geoCoderKey: 'Fmjtd%7Cluubnu6rn1%2Cas%3Do5-9uylgz',
		model: ClientLatLong,
		initialize: function() {
			var that = this;
		},
		getLatLng: function(callback) {
			var arr = []
			$.each(Records, function(i, val) {
				arr.push(new google.maps.LatLng(val.lat, val.lng));
			});	
			callback(arr);
		}
		/*
		getLatLng: function(callback) {
			console.log('Total records: ', Records.records.length);
			var limit = Records.records.length;
			var records = Records.records.slice(0, limit);
			var latLngArr = [];
			var latLngToString = [];
			var url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=';
			var delay = 200;
			var timer = 0;
			var urls = [];
			var x = 0;

			for (i=0; i<limit; i++) {
				urls.push(url + records[i].BillingStreet + ', ' + records[i].BillingCity + ', ' + records[i].BillingState);
			//	console.log(urls);
			}

			for (y=0; y < urls.length; y++) {
				//console.log(urls[y]);
				setTimeout(function() {
					console.log('get', urls[x]);
					$.getJSON(urls[x], function(response) {
						if (response.results.length) {
							latLngArr.push(new google.maps.LatLng(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng));
							latLngToString.push(response.results[0].geometry.location);
						}
						//console.log(JSON.stringify(latLngToString));
						if (x === limit) {
							if (callback) callback(latLngArr);
							console.log(latLngArr);
							console.log(JSON.stringify(latLngToString));
						}
					});
					x++;
				}, timer);
				timer = timer + delay;
			}
		}
		*/
	});
	return new ClientLatLongs();
});