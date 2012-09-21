define(["require", "exports", "module", "./Point2"], 
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class a two dimensional triangle class
	 */
	var Triangle2 = function(a, b, c) {
		var Point2 = require("./Point2");
		if ((a instanceof Point2) && (b instanceof Point2) && (c instanceof Point2)) {
			this.a = a;
			this.b = b;
			this.c = c;
		} else {
			alert("Triangle2: Invalid Point2!");
			return null;
		}
	};
	
	module.exports = Triangle2;
});