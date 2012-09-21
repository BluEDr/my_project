define([ "require", "exports", "module", "../geometry/Circle2" ],

function(require, exports, module) {
	/*
	 * @member gnosys @class a two-dimensional visual circle class
	 */
	var VCircle2 = function(circle, color, thickness, fill) {
		this.circle = circle;
		this.x = circle.center.x;
		this.y = circle.center.y;
		this.radius = circle.radius;
		this.color = color || "black";
		this.thickness = thickness || 2;
		this.fill = fill || "red";
	};

	var Circle2 = require("../geometry/Circle2");

	VCircle2.prototype = {
		draw : function(ctx, color) {
			this.ctx = ctx;
			this.clear(ctx);
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
			ctx.strokeStyle = color || this.color;
			ctx.fillStyle = this.fill;
			ctx.lineWidth = this.thickness;
			ctx.closePath();
			ctx.stroke();
		},

		clear : function() {
			var x = this.circle.bbox().x - this.thickness;
			var y = this.circle.bbox().y - this.thickness;
			var width = this.circle.bbox().width + 2 * this.thickness + 1;
			var height = this.circle.bbox().height + 2 * this.thickness + 1;

			this.ctx.clearRect(x, y, width, height);
		},

		setColor : function(color) {
			this.draw(this.ctx, color);
		}
	};

	module.exports = VCircle2;

});
