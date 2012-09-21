define(["require", "exports", "module", "./utils", "./Canvas2", "./VPoint2"],
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class a two-dimensional class for visual input
	 */	
	var Input2 = function(){};
	
	var canvasUtils = require("./utils");
	
	var _draw = function(sketch) {
		if (!sketch.valid) {
			var ctx = sketch.ctx;
			var shapes = sketch.shapes;
			sketch.clear();

			// stuff drawn in the background all the time go here

			var l = shapes.length;
			for (var i = 0; i < l; i++) {
				var shape = shapes[i];
				shape.label = i;
				// skip elements off screen ???
				//alert(i);
				//ctx.lineWidth = sketch.normalWidth;
				shapes[i].draw(ctx);
			}

			//draw selection
			if (sketch.selection != null) {
				ctx.strokeStyle = sketch.selectionColor;
				ctx.lineWidth = sketch.selectionWidth;
				var sel = sketch.selection;
				switch (sel.shape){
					case "circle" : {
						canvasUtils.strokeCircle(ctx, sel.x, sel.y, 4);
						break;
					} case "rectangle" : {
						ctx.strokeRect(sel.x-4, sel.y-4, 8, 8);
					}
				}
			}
			
			// stuff drown on top all the time go here

			sketch.valid = true;
		}
	};
	
	//Input2.getVPoints2 = function() {
	
	Input2.prototype = {
			getVPoints2: function() {
				var Canvas2 = require("./Canvas2");

				var sketch = new Canvas2();
				var canvas = sketch.canvas;
				sketch.shapes = [];
				this.points = sketch.shapes;
				var shapes = sketch.shapes;

				// double click for making new Shapes
				canvas.addEventListener('dblclick', function(e) {
					var mouse = sketch.getMouse(e);
					var VPoint2 = require("./VPoint2");
					var ctx = sketch.ctx;
					point2 = new VPoint2(ctx, mouse.x, mouse.y);
					//var shapes=sketch.shapes;
					shapes.push(point2);
					sketch.valid = false;
				}, true);

				canvas.addEventListener('mousedown', function(e) {
					var mouse = sketch.getMouse(e);
					var mx = mouse.x;
					var my = mouse.y;
					//var shapes = sketch.shapes;
					var l = shapes.length;

					for (var i = l-1; i >= 0; i--) {
						if (shapes[i].contains(mx, my)) {
							var mySel = shapes[i];
							sketch.dragoffx = mx - mySel.x;
							sketch.dragoffy = my - mySel.y;
							sketch.dragging = true;
							sketch.selection = mySel;
							sketch.valid = false;
							return;
						} 
					}
					// nothing selected so we have to deselect any previously selected object			
					if (sketch.selection) {
						sketch.selection = null;
						sketch.valid = false; // clears the old selection border
					}		
				}, true);

				canvas.addEventListener('mousemove', function(e) {
					if (sketch.dragging) {
						var mouse = sketch.getMouse(e);
						sketch.selection.x = mouse.x - sketch.dragoffx;
						sketch.selection.y = mouse.y - sketch.dragoffy;
						sketch.valid = false;
					}
				}, true);

				canvas.addEventListener('mouseup', function(e) {
					sketch.dragging = false;
				}, true);

				t = setInterval(function() { _draw(sketch); }, 30);
			}
	};
	
	module.exports = Input2;
	
	});