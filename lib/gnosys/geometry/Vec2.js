define(["require", "exports", "module"], 
	function(require, exports, module) {

		/*
		 * @member gnosys
		 * @class a two-dimensional vector class
		 */

		var Vec2 = function(a, b) {
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

		//private,
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
			return {x: a, y: b};
		};

		Vec2.prototype = {

			abs: function(a, b) {
				this.x = Math.abs(this.x);
				this.y = Math.abs(this.y);
				return this;
			},

			clear: function() {
				this.x = this.y = 0;
				return this;
			},

			toString: function() {
				var s = "Vec2(" + this.x + "," + this.y + ")";
				return s;
			}
		};

		module.exports = Vec2;
	}
);
	


