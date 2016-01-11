/*
This is a bit of a hack to maintain a hierarchy view as a constant object
*/
define([
	'views/accounts/hierarchy'
], function (Hierarchy) {
	return new Hierarchy();
});