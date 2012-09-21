define(["require", "exports", "module", "../geometry/Circle2"],

function (require, exports, module) {
    /*
     * @member gnosys
     * @class a two-dimensional visual circle class
     */
    var VCircle2 = function (circle, color, thickness, fill) {
        this.x = circle.center.x;
        this.y = circle.center.y;
        this.radius = circle.center.radius;
        this.color = color || "black";
        this.thickness = thickness || 2;
        this.fill = fill || "white";
    };

    var Circle2 = require("../geometry/Circle2");

    VCircle2.prototype = {
        draw: function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.srokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            g ctx.stroke();
        }
    };

    module.exports = VCircle2;

});
