define([
	'amd/backbone/Backbone.ModelBinder'
], function(ModelBinder) {
	Backbone.ModelBinder.SetOptions({
		converter: function(direction, value, attrName, model, el) {
			if (direction === 'ViewToModel') {
				// save numbers as int in model
				if ($(el[0]).attr('type') === 'number' && !isNaN(value)) {
					return parseInt(value);	
				}
				if ($(el[0]).hasClass('parse-int') || $(el[0]).attr('data-role') === 'numerictextbox' && !isNaN(value)) {
					return parseFloat(value);	
				}
				// save dates as yyyy-MM-dd in model
				if ($(el[0]).attr('data-role') === 'datepicker') {
					var date = new Date(kendo.parseDate($(el[0]).val(), [ "MMM dd, yyyy","yyyy-MM-dd", "M-d-yyyy", "M/d/yyyy"])).toJSON();
					if ($(el[0]).is('[data-split-iso-date]')) date = date.split('T')[0];
					return date;
				}
				//saves dates as ISO-8601
				if ($(el[0]).attr('data-role') === 'datetimepicker') {
					return new Date(kendo.parseDate($(el[0]).val())).toJSON();
				}
				// save multiselects with id's as int
				if ($(el[0]).attr('name') === 'bookRunner' || $(el[0]).attr('name') === 'leadManagers' || $(el[0]).attr('name') === 'coManagers') {
					// kendo's value method returns selections in proper order
					kendoValue = $(el[0]).data('kendoMultiSelect').value();
					if (!kendoValue) return null;
					var newArr = [];
					for (var i=0; i<kendoValue.length; i++) {
						newArr[i] = parseInt(kendoValue[i]);
					}
					return newArr;
				}
				// converter to map radios to boolean
				if ($(el[0]).is('[type="radio"]')) {
					if (value === 'true') return true;
					if (value === 'false') return false;
					return value;
				}
			}
			if (direction === "ModelToView") {
				if ($(el[0]).hasClass('parse-int') && !isNaN(value) && value) {
					return value.toString();
				}
				if ($(el[0]).attr('data-dateformatter')) {
					var date = kendo.toString(kendo.parseDate(value, ["yyyy-MM-dd"]), $(el[0]).attr('data-dateformatter'));
					return date;
				}
				if ($(el[0]).attr('data-numberformatter')) {
					var number = kendo.toString(value, $(el[0]).attr('data-numberformatter'));
					return number;
				}
				// converter to map radios to boolean
				if ($(el[0]).is('[type="radio"]')) {
					if (value === true) return 'true';
					if (value === false) return 'false';
					return value;
				}
			}
			return value;
		}
	});
});