define(["require", "exports", "module"],
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class a two-dimensional html5 canvas
	 */
	var Canvas2 = function () {
		var canvasUtils = require("./utils");
		// setup
		//canvas = canvasUtils.getVPoints2Interface();
		//this.canvas = canvas;
		this.canvas = canvasUtils.getVPoints2Interface();
		var canvas = this.canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = canvas.getContext("2d");

		// according to simonsarris this fixes mouse coordinate problems
		var stylePaddingLeft, stylePaddingTop;
		var styleBorderLeft, styleBorderTop;
		if (document.defaultView && document.defaultView.getComputedStyle) {
			this.stylePaddingLeft = parseInt(
					document.defaultView.getComputedStyle(canvas, null)
					['paddingLeft'], 10
			) || 0;
			this.stylePaddingTop = parseInt(
					document.defaultView.getComputedStyle(canvas, null)
					['paddingTop'], 10
			) || 0;
			this.styleBorderLeft = parseInt(
					document.defaultView.getComputedStyle(canvas, null)
					['borderLeftWidth'], 10
			) || 0;
			this.styleBorderTop = parseInt(
					document.defaultView.getComputedStyle(canvas, null)
					['borderTopWidth'], 10
			) || 0;
		}
		var html = document.body.parentNode;
		this.htmlTop = html.offsetTop;
		this.htmlLeft = html.offsetLeft;

		// keep track of state

		this.valid = false;
		//this.shapes = [];
		this.dragging = false;
		this.selection = null;
		this.dragoffx = 0;
		this.dragoffy = 0;

		//fixes a problem where double clicking ...
		canvas.addEventListener('selectstart', function(e) {
			e.preventDefault();
			return false;
		}, false);

		this.selectionWidth = 2;
		this.selectionColor = 'red';
		this.normalWidth = 1;
	};
	
	Canvas2.prototype = {
			getMouse: function(e) {
				var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

				// Compute the total offset
				if (element.offsetParent !== undefined) {
					do {
						offsetX += element.offsetLeft;
						offsetY += element.offsetTop;
					} while ((element = element.offsetParent));
				}

				// Add padding and border style widths to offset
				// Also add the <html> offsets in case there's a position:fixed 
				offsetX += this.stylePaddingLeft + this.styleBorderLeft	+ this.htmlLeft;
				offsetY += this.stylePaddingTop + this.styleBorderTop 	+ this.htmlTop;
				mx = e.pageX - offsetX;
				my = e.pageY - offsetY;
				
				/*var element = this.canvas;
				var offsetTop = 0;
				var offsetLeft = 0; 
				var mx; 
				var my;
				
				while (element){
				//while (element.tagName !== "BODY"){
					offsetTop += element.offsetTop;
					offsetLeft += element.offsetLeft;
					element = element.offsetParent;
					//alert(element.tagName);
				}
				
				mx = e.pageX - offsetLeft;
				my = e.pageY - offsetTop;
				console.log(e.pageX+" "+e.pageY+" "+offsetLeft+" "+offsetTop);*/
				
				return {x: mx, y: my};
			},
			
			clear: function() {
				this.ctx.clearRect(0,0,this.width,this.height);
			}			
	};

	module.exports = Canvas2;
	
	});

