define(["require", "exports", "module", "./utils", "../geometry/Point2"],
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class a two-dimensional visual point class
	 */
	var VPoint2 = function(ctx, x, y, shape, label, size, stroke, fill){
		this.x = x || 0;
		this.y = y || 0;
		this.shape = shape || "circle";
		this.label = label || "";
		this.size = size || 5;
		this.stroke = stroke || "lightskyblue";
		this.fill = fill || "lightskyblue";
		this.normalWidth = 4;
		this.selectedWidth = 2;
		console.log(this.x+" "+this.y);
		this.draw(ctx);
	};
	
	var canvasUtils = require("./utils");
	
	VPoint2.prototype = {
			toPoint2: function(){
				var Point2 = require("../geometry/Point2");
				return new Point2(this.x, this.y);
			},
			
			toString: function(){
				return "VPoint2(" + this.x + "," + this.y + ")";
			},
			
			clear: function(ctx){
				ctx.clearRect(this.x-2, this.y-2, 5, 5);
			},
	
			setContext: function(ctx){
				ctx.strokeStyle = this.stroke;
				ctx.fillStyle = this.fill;
				//ctx.lineWidth = this.normalWidth;
			},
			
			asRectangle: function(ctx) {
				ctx.fillRect(this.x-3, this.y-3, 6, 6);
				ctx.textAlign = "center";
				ctx.fillText(this.label, this.x, this.y-5);
			},
			
			asCircle: function(ctx) {
				canvasUtils.fillCircle(ctx, this.x, this.y, 3);
				ctx.textAlign = "center";
				ctx.fillText(this.label, this.x, this.y-5);
			},
			
			asTriangle: function(ctx){
				alert("VPoint2.asTriangle NOT IMPLEMENTED!");
				this.asCircle(ctx);
			},
			
			draw: function(ctx){
				this.setContext(ctx);
				switch (this.shape) {
					case "rectangle" : {
						this.asRectangle(ctx);
						break;
					} case "circle" : {
						this.asCircle(ctx);
						break;
					} case "triangle" : {
						this.asTriangle(ctx);
					};
				};
			},
			
			contains: function(mx, my) {
				return ((this.x <= mx+3) && (this.y <= my+3) && (this.x >= mx-3) && (this.y >= my-3));
			}
	};
	
	module.exports = VPoint2;
	
	});
		
		
