define([ "require", "exports", "module" ], function(require, exports, module) {
	"use strict";
	/*
	 * 
	 */
	var VPoint2 = function(context, point2) {
		if (context !== 'undefined' && point2 !== 'undefined') {
			this.x = point2.x;
			this.y = point2.y;
			this.shape = 'circle';
			this.label = '';
			this.size = 5;
			this.stroke = 'lightskyblue';
			this.fill = 'lightskyblue';
			this.normalWidth = 4;
			this.selectedWidth = 2;
		}
	};

	VPoint2.prototype = {
		toString : function() {
			return 'VPoint2(' + this.x + ',' + this.y + ')';
		},

		contains : function(mx, my) {
			return (this.x <= mx + 3) && (this.y <= my + 3)
					&& (this.x >= mx - 3) && (this.y >= my - 3);
		},
	};

	module.exports = VPoint2;
});
