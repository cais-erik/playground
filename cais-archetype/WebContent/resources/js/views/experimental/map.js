define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'views/experimental/clients_geo'
], function ($, _, Backbone, Vm, ClientsGeo) {
	var Map = Backbone.View.extend({
		styler: [
			{
				"stylers": [
				  { "saturation": -100 },
				  { "lightness": 59 }
				]
			}
		],
		mapOptions: {
			zoom: 3,
			disableDefaultUI: true,
			styles: [
				{
					stylers: [
						{ "saturation": -4 },
						{ "hue": "#00e5ff" },
						{ "lightness": 30 }
					]
				},
				{
					"featureType": "administrative.country",
					"elementType": "labels.text",
					"stylers": [
					  { "visibility": "off" }
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "labels.text",
					"stylers": [
						{ "visibility": "off" }
					]
				}
			]
		},
		initialize: function() {
			this.mapOptions = $.extend(this.mapOptions, {
			    center: new google.maps.LatLng(39.8282, -98.5795),
			    mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			this.render();
		},
		render: function() {
			var that = this;
			this.map = new google.maps.Map(this.el, this.mapOptions);
			
			ClientsGeo.getLatLng(function(response) {
				var pointArray = new google.maps.MVCArray(response);
				that.heatmap = new google.maps.visualization.HeatmapLayer({
					data: pointArray,
					radius: 50,
					maxIntensity: 90
				});
				that.heatmap.setMap(that.map);
			});
		},
		events: {}
	});
	return Map;
});