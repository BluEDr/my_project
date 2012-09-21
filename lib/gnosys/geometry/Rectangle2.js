/**
 * 
 */

"use strict";
define([ "require", "exports", "module", "./Point2" ],

function(require, exports, module) {

	/*
	 * @member gnosys @class a two-dimensional rectangle class
	 */

	var Rectangle2 = function(position, width, height) {
		/*
		 * check parameters
		 */
		// var Point2 = require('./Point2');
		// if (!(position instanceof Point2) || !(size instanceof Point2)) {
		// alert("Position or Size problem!!" + position.y + size.y);
		// }
		this.position = position;
		this.width = width;
		this.height = height;
	};

	Rectangle2.prototype = {

		/* FIX HERE */
		// toString : function() {
		// var s = "Rectangle2(" + this.position.toString() + ","
		// + this.size.toString() + ")";
		// return s;
		// },
		bbox : function() {
			return {
				x : this.position.x,
				y : this.position.y,
				width : this.width,
				height : this.height
			};
		},
	};

	module.exports = Rectangle2;
});