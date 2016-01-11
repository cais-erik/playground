define([
	'underscore',
	'backbone',
	'models/firm_supervisor'
], function(_, Backbone, FirmSupervisor) {
	var FirmSupervisors = Backbone.Collection.extend({
		setUrl: function(firmId) {
			this.url = '/api/group/firm/' + firmId + '/supervisor'
		},
		model: FirmSupervisor
	});
	return FirmSupervisors;
});