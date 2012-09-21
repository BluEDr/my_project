define(["require", "exports", "module", "./Point2"],

function(require, exports, module) {

    /*
     * @member gnosys
     * @class a two-dimensional circle class
     */

    var Circle2 = function(center, radius) {
        /*
         * check parameters
         */
        var Point2 = require('./Point2');
        if (!(center instanceof Point2)) {
            alert("center problem");
        }
        this.center = center;
        this.radius = radius;
    };

    Circle2.prototype = {

        toString: function() {
            var s = "Circle2(" + this.center.toString() + "," + this.radius + ")";
            return s;
        },
        
        bbox: function() {
            return {
                x: this.center.x - this.radius,
                y: this.center.y - this.radius,
                width: 2 * this.radius,
                height: 2 * this.radius
            }
        },
    };

    module.exports = Circle2;
});
