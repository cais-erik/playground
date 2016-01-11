define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	/** 
     * Organization
     * Collection class for Organization
     * Extends Backbone.Collection
     */
	var Organization = Backbone.Collection.extend({
		url: '/api/organization'
	});

	/** 
     * Employees
     * Collection class for employees
     * Extends Backbone.Collection
     */
	var Employees = Backbone.Collection.extend({
		url: '/api/organization/employee',
		// return only the active employees from collection
		getActive: function() {
			return _.invoke(this.where({'status': 'Active'}), 'toJSON');
		},
		toView: function() {
			var employees = this.toJSON();
			_.each(employees, function(employee) {
				var phone = employee.phone.toString();
				employee.phone = '(' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6,4);
			}, this);
			return employees;
		},
		getByGroup: function() {
			var data = _.groupBy(this.toView(), 'businessUnit');
			var arr = [];
			for (var key in data) {
				arr.push({
					name: key,
					count: _.where(data[key], {status:'Active'}).length,
					members: data[key]
				});
			}
			
			return arr;
		}
	});

	/** 
     * PersonnelHistory
     * Collection class for the total personnel history
     * Extends Backbone.Collection
     */
	var PersonnelHistory = Backbone.Collection.extend({
		url: '/api/organization/history/personnel',
		comparator: 'date',
		getChartData: function() {
			var data = this.toJSON();
			_.each(data, function(data) {
				data.date = new Date(data.date);
			});
			return data;
		}
	});

	/** 
     * BusinessUnitHistory
     * Collection class for Business Unit History
     * Extends Backbone.Collection
     */
	var BusinessUnitHistory = Backbone.Collection.extend({
		url: '/api/organization/history/business_units',
		getChartData: function() {
			var data = this.toJSON();
			_.each(data, function(group) {
				group.name = group.businessUnit;
				var newData = [];
				_.each(group.data, function(point) {
					newData.push(point.count);
				});
				group.data = newData;
			});
			return data;
		},
		getCategories: function() {
			var dates = [];
			if (this.at(0)) {
				_.each(this.at(0).get('data'), function(point) {
					dates.push(new Date(point.date));
				});
			}
			return dates;
		},
		getPersonnelByTeam: function() {
			var data = [];
			this.each(function(model) {
				data.push({
					name: model.get('businessUnit'),
					data: [model.get('data')[0].count]
				});
			}, this);
			return data;
		}
	});

	return {
		Organization: new Organization(),
		Employees: new Employees(),
		PersonnelHistory: new PersonnelHistory(),
		BusinessUnitHistory: new BusinessUnitHistory()
	};
});