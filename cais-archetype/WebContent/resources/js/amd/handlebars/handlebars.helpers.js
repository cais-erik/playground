/* Handlebars template helpers */
define([
	'handlebars',
	'jquery'
], function(Handlebars, $) {
	// format a number using kendo, accepts a number and a string formatter
	// http://docs.kendoui.com/getting-started/framework/globalization/numberformatting
	// @param value, a number
	// @param format, a formatter string
	Handlebars.registerHelper('formatNumber', function(value, format) {
		return kendo.toString(value, format);
	});
	Handlebars.registerHelper('sanitizeString', function(value, format) {
		if (value) return value.toLowerCase().replace(/\s+/g, '-');
	});
	// format a date using kendo, accepts iso8601 date and a string formatter
	// http://docs.kendoui.com/getting-started/framework/globalization/dateformatting
	// @param isoDate, iso8601 date string
	// @param format, a formatter string
	Handlebars.registerHelper('formatDate', function(isoDate, format) {
		return kendo.toString(new Date(isoDate), format);
	});
	// join a list or a list of objects by a separator, great for formatting a commma delineated list
	// @param list, an array or array of objects
	// @param separator, a separator to divide items by
	// @param key, optional, a key in each object to use 
	Handlebars.registerHelper('joinList', function(list, separator, key) {
		var arr = [];
		if (!key) {
			arr = list;
		} else {
			for (i = 0; i < list.length; i++) {
				arr[i] = list[i][key];
			}
		}
		return arr.join(separator);
	});
});