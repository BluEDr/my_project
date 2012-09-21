/*global define: true */
/*global define: true */
/*jslint browser: true*/
define(["require", "exports", "module"],

function(require, exports, module) {
    "use strict";
    /*
     *
     */
    var Scene = function(canvas) {
        if (canvas !== "undefined") {
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            this.lines = [];
            this.cx = this.width / 2;
            this.cy = this.width / 2;
            this.fl = 250;
            this.cz = this.fl * 2;
            this.strokeStyle = "black";
            this.lineWidth = 1;
            this.running = false;
            this.clearCanvas = true;
            this.context = canvas.getContext("2d");

            // according to simonsarris this fixes mouse coordinate
            // problems
            if (document.defaultView && document.defaultView.getComputedStyle) {
                this.stylePaddingLeft = parseInt(
                document.defaultView.getComputedStyle(canvas, null).paddingLeft,
                10) || 0;
                this.stylePaddingTop = parseInt(
                document.defaultView.getComputedStyle(canvas, null).paddingTop,
                10) || 0;
                this.styleBorderLeft = parseInt(
                document.defaultView.getComputedStyle(canvas, null).borderLeftWidth,
                10) || 0;
                this.styleBorderTop = parseInt(
                document.defaultView.getComputedStyle(canvas, null).borderTopWidth,
                10) || 0;
            }
            this.htmlTop = document.body.parentNode.offsetTop;
            this.htmlLeft = document.body.parentNode.offsetLeft;
        }
    };

    Scene.prototype = {
        project: function(p3d) {
            var p2d = {}, scale = this.fl / (this.fl + p3d.z + this.cz);
            p2d.x = this.cx + p3d.x * scale;
            p2d.y = this.cy + p3d.y * scale;
            return p2d;
        },

        addLine: function(points) {
            var i, numPoints, line;

            numPoints = points.length;
            if (numPoints >= 6) {
                line = {
                    style: this.strokeStyle,
                    width: this.lineWidth,
                    points: []
                };
                this.lines.push(line);
                for (i = 0; i < numPoints; i += 3) {
                    line.points.push({
                        x: points[i],
                        y: points[i + 1],
                        z: points[i + 2]
                    });
                }
            } else {
                console.error("GNOSYS.Scene.addLine: You need to add at least two 3d points (6 numbers) to make a line.");
            }
            return line;
        },

        addBox: function(x, y, z, w, h, d) {
            this.addLine([
            x - w / 2,
            y - h / 2,
            z - d / 2,
            x + w / 2,
            y - h / 2,
            z - d / 2,
            x + w / 2,
            y + h / 2,
            z - d / 2,
            x - w / 2,
            y + h / 2,
            z - d / 2,
            x - w / 2,
            y - h / 2,
            z - d / 2]);
            this.addLine([
            x - w / 2,
            y - h / 2,
            z + d / 2,
            x + w / 2,
            y - h / 2,
            z + d / 2,
            x + w / 2,
            y + h / 2,
            z + d / 2,
            x - w / 2,
            y + h / 2,
            z + d / 2,
            x - w / 2,
            y - h / 2,
            z + d / 2]);
            this.addLine([
            x - w / 2,
            y - h / 2,
            z - d / 2,
            x - w / 2,
            y - h / 2,
            z + d / 2]);
            this.addLine([
            x + w / 2,
            y - h / 2,
            z - d / 2,
            x + w / 2,
            y - h / 2,
            z + d / 2]);
            this.addLine([
            x + w / 2,
            y + h / 2,
            z - d / 2,
            x + w / 2,
            y + h / 2,
            z + d / 2]);
            this.addLine([
            x - w / 2,
            y + h / 2,
            z - d / 2,
            x - w / 2,
            y + h / 2,
            z + d / 2]);
        },

        addCircle: function(circle) {},

        //addCircle: function (x, y, z, radius, segments) {
        //    var i, points = [], a;
        //    for (i = 0; i < segments; i += 1) {
        //        a = Math.PI * 2 * i / segments;
        //        points.push(x + Math.cos(a) * radius, y + Math.sin(a) * radius, z);
        //    }
        //    points.push(points[0], points[1], points[2]);
        //    this.addLine(points);
        //},

        draw: function() {
            var i, j, line, p2d;
            if (this.clearCanvas) {
                this.context.clearRect(0, 0, this.width, this.height);
            }
            for (i = 0; i < this.lines.length; i += 1) {
                this.context.beginPath();
                line = this.lines[i];
                p2d = this.project(line.points[0]);
                this.context.moveTo(p2d.x, p2d.y);
                for (j = 1; j < line.points.length; j += 1) {
                    p2d = this.project(line.points[j]);
                    this.context.lineTo(p2d.x, p2d.y);
                }
                this.context.lineWidth = line.width;
                this.context.strokeStyle = line.style;
                this.context.stroke();
            }
        },

        loop: function(fps, callback) {
            if (!this.running) {
                var wl = this;
                this.running = true;
                this.interval = setInterval(

                function() {
                    callback();
                    wl.draw();
                },
                1000 / fps);
            }
        },

        stop: function() {
            this.running = false;
            clearInterval(this.interval);
        },

        rotateX: function(radians) {
            var i, j, p, y1, z1, line, cos = Math.cos(radians),
                sin = Math.sin(radians);
            for (i = 0; i < this.lines.length; i += 1) {
                line = this.lines[i];
                for (j = 0; j < line.points.length; j += 1) {
                    p = line.points[j];
                    y1 = p.y * cos - p.z * sin;
                    z1 = p.z * cos + p.y * sin;
                    p.y = y1;
                    p.z = z1;
                }
            }
        },

        rotateY: function(radians) {
            var i, j, p, x1, z1, line, cos = Math.cos(radians),
                sin = Math.sin(radians);
            for (i = 0; i < this.lines.length; i += 1) {
                line = this.lines[i];
                for (j = 0; j < line.points.length; j += 1) {
                    p = line.points[j];
                    z1 = p.z * cos - p.x * sin;
                    x1 = p.x * cos + p.z * sin;
                    p.x = x1;
                    p.z = z1;
                }
            }
        },

        rotateZ: function(radians) {
            var i, j, p, x1, y1, line, cos = Math.cos(radians),
                sin = Math.sin(radians);
            for (i = 0; i < this.lines.length; i += 1) {
                line = this.lines[i];
                for (j = 0; j < line.points.length; j += 1) {
                    p = line.points[j];
                    y1 = p.y * cos - p.x * sin;
                    x1 = p.x * cos + p.y * sin;
                    p.x = x1;
                    p.y = y1;
                }
            }
        },

        translate: function(x, y, z) {
            var i, j, p, line;
            for (i = 0; i < this.lines.length; i += 1) {
                line = this.lines[i];
                for (j = 0; j < line.points.length; j += 1) {
                    p = line.points[j];
                    p.x += x;
                    p.y += y;
                    p.z += z;
                }
            }
        },

        jitter: function(amount) {
            var i, j, line, p;
            for (i = 0; i < this.lines.length; i += 1) {
                line = this.lines[i];
                for (j = 0; j < line.points.length; j += 1) {
                    p = line.points[j];
                    p.x += Math.random() * amount * 2 - amount;
                    p.y += Math.random() * amount * 2 - amount;
                    p.z += Math.random() * amount * 2 - amount;
                }
            }
        },

        setCenter: function(x, y, z) {
            this.cx = x === null ? this.cx : x;
            this.cy = y === null ? this.cy : y;
            this.cz = z === null ? this.cz : z;
        },

        setStrokeStyle: function(s) {
            this.strokeStyle = s;
        },

        getStrokeStyle: function() {
            return this.strokeStyle;
        },

        setLineWidth: function(w) {
            this.lineWidth = w;
        },

        getLineWidth: function() {
            return this.lineWidth;
        },

        setClearCanvas: function(c) {
            this.clearCanvas = c;
        },

        getClearCanvas: function() {
            return this.clearCanvas;
        },

        setShowCenter: function(sc) {
            this.showCenter = sc;
        },

        getShowCenter: function() {
            return this.showCenter;
        },

        getMouse: function(e) {
            var element = this.canvas,
                offsetX = 0,
                offsetY = 0,
                mx,
                my;

            // Compute the total offset
            if (element.offsetParent !== 'undefined') {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                    element = element.offsetParent;
                } while (element !== 'undefined');
            }

            // Add padding and border style widths to offset
            // Also add the <html> offsets in case there's a position:fixed 
            offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
            offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            return {
                x: mx,
                y: my
            };
        },

        addEventListeners: function() {
            var sceneState = this;

            // fixes a problem where double clicking causes text to 
            // get selected on the canvas
            this.canvas.addEventListener('selectstart',

            function(e) {
                e.preventDefault();
                return false;
            }, false);

            this.canvas.addEventListener('mousedown',

            function(e) {
                var mouse = sceneState.getMouse(e),
                    mx = mouse.x,
                    my = mouse.y,
                    lines = sceneState.lines,
                    l = lines.length;
            })


        }

    };

    module.exports = Scene;
});