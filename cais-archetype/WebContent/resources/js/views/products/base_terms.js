define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
], function ($, _, Backbone, Vm, Events, Handlebars) {
	var BaseTerms = Backbone.View.extend({
		attributes: {
			'class': 'dialog-wrapper alert'
		},
		template: null,
		termUrl: null,
		initialize: function() {
			var that = this;
			$.getJSON(this.termUrl, function (response) {
				if (response === false) {
                    that.render();
                }
                else {
                	that.trigger('termsAccepted');
                }
			});
		},
		render: function() {
			this.$el.html(this.template).appendTo('body').hide().fadeIn('slow');
		},
		events: {
			'click .accept': 'onAccept',
			'click .decline': 'onDecline'
		},
		onAccept: function() {
			var that = this;
			$.post(this.termUrl, function() {
				that.trigger('termsAccepted');
				// refresh the user model in localstorage from the server
				Server.caisUser.getLocalSessionInfo(null, true);
				that.$el.fadeOut('slow', function() {
					that.remove();
				})
			});
		},
		onDecline: function() {
			window.location = '/';
		}
	});
	return BaseTerms;
});