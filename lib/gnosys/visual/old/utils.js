define(["require", "exports", "module"],
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class canvas related stuff
	 */
	canvasUtils = {};
	
	canvasUtils.strokeCircle = function(ctx, x, y, radius){
				ctx.beginPath();
				ctx.arc(x , y, radius, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.stroke();
	};
	
	canvasUtils.fillCircle = function(ctx, x, y, radius){
		ctx.beginPath();
		ctx.arc(x , y, radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	};
	
	canvasUtils.getVPoints2Interface = function(){
		var wrapDiv = document.createElement("div");
		wrapDiv.id = "wrapDiv";
		wrapDiv.style.width = "600px";
		wrapDiv.style.height = "480px";
		wrapDiv.style.marginLeft = "100px";
		wrapDiv.style.marginTop = "100px";
		
		document.body.appendChild(wrapDiv);
		
		var buttonsDiv = document.createElement("div");
		buttonsDiv.id = "buttonsDiv";
		buttonsDiv.style.width = "100%";
		
		var doneButton = document.createElement("input");
		doneButton.type = "button";
		doneButton.value = "Done";
		doneButton.style.border = "none";
		var clearButton = document.createElement("input");
		clearButton.type = "button";
		clearButton.value = "Clear";
		clearButton.style.border = "none";
		var deleteButton = document.createElement("input");
		deleteButton.type = "button";
		deleteButton.value = "Delete";
		deleteButton.style.border = "none";
		
		buttonsDiv.appendChild(doneButton);
		buttonsDiv.appendChild(clearButton);
		buttonsDiv.appendChild(deleteButton);
		
		wrapDiv.appendChild(buttonsDiv);
		
		var canvasDiv = document.createElement("div");
		canvasDiv.id = "canvasDiv";
		canvasDiv.style.width = wrapDiv.style.width;
		canvasDiv.style.height = (parseInt(wrapDiv.style.height) * 0.8)+"px";
		
		
		wrapDiv.appendChild(canvasDiv);
	
		var canvas = document.createElement("canvas");
		canvas.setAttribute ('width', canvasDiv.style.width);
		canvas.setAttribute ('height', canvasDiv.style.height);
		canvas.style.border = "solid 2px lightgrey";
		
		canvasDiv.appendChild(canvas);
		
		var statusDiv = document.createElement("div");
		statusDiv.id = "statusDiv";
		statusDiv.style.width = "100%";
		
				
		wrapDiv.appendChild(statusDiv);
		
		return canvas;
	};
	
	module.exports = canvasUtils;
	
	}
);