define([ "require", "exports", "module", "./Vec2" ], function(require, exports,
		module) {

	/*
	 * @member gnosys @class a two-dimensional point class
	 */

	var Point2 = function(a, b) {
		if (a instanceof Object && a.x !== undefined && a.y !== undefined) {
			b = a.y;
			a = a.x;
		} else {
			if (a === undefined) {
				a = 0;
			}
			if (b === undefined) {
				b = 0;
			}
		}
		this.x = a;
		this.y = b;
	};

	// private
	var _getXY = function(a, b) {
		if (a instanceof Object) {
			b = a.y;
			a = a.x;
		} else {
			if (a !== undefined && b === undefined) {
				b = a;
			} else if (a === undefined) {
				a = 0;
			} else if (b === undefined) {
				b = 0;
			}
		}
		return {
			x : a,
			y : b
		};
	};

	// public
	Point2.prototype = {
		abs : function() {
			this.x = Math.abs(this.x);
			this.y = Math.abs(this.y);
			return this;
		},

		clear : function() {
			this.x = this.y = 0;
			return this;
		},

		equals : function(obj) {
			if (obj instanceof Object) {
				return (this.x == obj.x) && (this.y == obj.y);
			}
			return false;
		},

		toString : function() {
			var s = "Point2(" + this.x + "," + this.y + ")";
			return s;
		},

		sub : function(other) {
			var Vec2 = require('./Vec2');
			return new Vec2(this.x - other.x, this.y - other.y);
		}
	};

	module.exports = Point2;

});
