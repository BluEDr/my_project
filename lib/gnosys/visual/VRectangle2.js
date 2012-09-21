'use strict';
define([ "require", "exports", "module", "../geometry/Rectangle2" ],

function(require, exports, module) {
	/*
	 * @member gnosys @class a two-dimensional visual circle class
	 */
	var VRectangle2 = function(rectangle, color, thickness, fill) {
		this.rectangle = rectangle;
		this.positionX = rectangle.position.x;
		this.positionY = rectangle.position.y;
		this.width = rectangle.width;
		this.height = rectangle.height;
		this.color = color || "black";
		this.thickness = thickness || 2;
		this.fill = fill || "red";
	};

	var Rectangle2 = require("../geometry/Rectangle2");

	VRectangle2.prototype = {
		draw : function(ctx, color) {
			this.ctx = ctx;
			this.clear(ctx);
			ctx.beginPath();
			ctx.rect(this.positionX, this.positionY, this.width, this.height);
			ctx.strokeStyle = color || this.color;
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.lineWidth = this.thickness;
			ctx.closePath();
			ctx.stroke();
		},

		clear : function() {
			var x = this.rectangle.bbox().x - this.thickness;
			var y = this.rectangle.bbox().y - this.thickness;
			var width = this.rectangle.bbox().width + 2 * this.thickness + 1;
			var height = this.rectangle.bbox().height + 2 * this.thickness + 1;

			this.ctx.clearRect(x, y, width, height);
		},

		setColor : function(color) {
			this.draw(this.ctx, color);
		}
	};

	module.exports = VRectangle2;

});