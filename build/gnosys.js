//v0.0.1 gnosys.js (http://central.ntua.gr/gnosysjs.latest)
var gnosys = {};(function(){

/**
 * almond 0.0.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
/*jslint strict: false, plusplus: false */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {

    var defined = {},
        waiting = {},
        aps = [].slice,
        main, req;

    if (typeof define === "function") {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseName = baseName.split("/");
                baseName = baseName.slice(0, baseName.length - 1);

                name = baseName.concat(name.split("/"));

                //start trimDots
                var i, part;
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }
        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            main.apply(undef, args);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, i, ret, map;

        //Use name if no relName
        if (!relName) {
            relName = name;
        }

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Default to require, exports, module if no deps if
            //the factory arg has any arguments specified.
            if (!deps.length && callback.length) {
                deps = ['require', 'exports', 'module'];
            }

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name]
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw name + ' missing ' + depName;
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef) {
                    defined[name] = cjsModule.exports;
                } else if (!usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {

            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            //Drop the config stuff on the ground.
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = arguments[2];
            } else {
                deps = [];
            }
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function () {
        return req;
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (define.unordered) {
            waiting[name] = [name, deps, callback];
        } else {
            main(name, deps, callback);
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define("almond", function(){});

define.unordered = true;
define("almondSettings", function(){});

/*global define: true */
define('gnosys/datastructures/BST',["require", "exports", "module"],
    function (require, exports, module) {
		

		var Node = function (key, cargo, left, right, parent) {
            return {
                key: (typeof key === "undefined") ? null : key,
                cargo: (typeof cargo === "undefined") ? null : cargo,
                left: (typeof left === "undefined") ? null : left,
                right: (typeof right === "undefined") ? null : right,
                parent: (typeof parent === "undefined") ? null : parent
            };
        },

            /*
             * Inserts data to node
             *
             */

            insertToNode = function (node, key, cargo, parent) {
                if (node.key === null) {
                    node.key = key;
                    node.cargo = cargo;
                    node.left = new Node();
                    node.right = new Node();
                    node.parent = parent;
                    return true;
                }

                var nodeKey = parseInt(node.key, 10);

                if (key <= nodeKey) {
                    insertToNode(node.left, key, cargo, parent);
                }

                if (key > nodeKey) {
                    insertToNode(node.right, key, cargo, parent);
                }

                return true;
            }, // insertToNode

            maxNode = function (node) {
                while (node.right.key) {
                    node = node.right;
                }

                return node;
            },

            iterativelyTraverseNode = function (node, callback) {
                var stack = [],
                    curr = node;

                while (curr.key !== null || stack.length !== 0) {
                    if (curr.key !== null) {
                        stack.push(curr);
                        curr = curr.left;
                    } else {
                        curr = stack.pop();
                        callback(curr);
                        curr = curr.right;
                    }
                }

                return true;
            }, // iterativelyTraverseNode

            calculateNodeCoordinates = function (node) {
                var stack = [],
                    curr = node,
                    x = 0,
                    y = 0;

                while (curr.key !== null || stack.length !== 0) {
                    if (curr.key !== null) {
                        curr.x = x;
                        stack.push(curr);
                        if (curr.left.key !== null) {
                            x = x + 1;
                        }
                        curr = curr.left;
                    } else {
                        curr = stack.pop();
                        curr.y = y;
                        y = y + 1;
                        if (curr.right.key !== null) {
                            x = curr.x + 1;
                        }
                        curr = curr.right;
                    }
                }
            }, // calculateNodeCoordinates

            BST = function () {

                /*
                 * Pointer to root node in the tree
                 * @property root
                 *
                 */

                this.root = new Node();
            };

        BST.prototype = {

            insert: function (key, cargo) {
                var keyInt = parseInt(key, 10);

                if (isNaN(keyInt)) {
                    return undefined; // key must be a number
                }

                return insertToNode(this.root, keyInt, cargo, null);
            },

            traverse: function (callback) {
                if (typeof callback === "undefined") {
                    callback = function (node) {
                        console.log(node.key + ":" + node.cargo);
                    };
                }

                return iterativelyTraverseNode(this.root, callback);
            },

            keysToString: function () {
                var stack = [];

                iterativelyTraverseNode(this.root,
                    function (node) {
                        stack.push(node.key);
                    });

                return stack.toString();
            },

            gridPrint: function () {
                var x, y, k, grid, maxDepth;

                calculateNodeCoordinates(this.root);
                maxDepth = 0;
                iterativelyTraverseNode(this.root,
                    function (node) {
                        if (node.x > maxDepth) {
                            maxDepth = node.x;
                        }
                    });
                y = maxNode(this.root).y;
                x = maxDepth;

                grid = [];
                for (k = 0; k <= x; k = k + 1) {
                    grid[k] = [];
                }

                iterativelyTraverseNode(this.root,
                    function (node) {
                        grid[node.x][node.y] = node.key;
                    });

                return grid;
            }
        };




		///*
		// * @member gnosys
		// * @class a binary search tree class
        // *
		// */

		//var BST = function() {
        //    /*
        //     * Pointer to root node in the tree
        //     * @property _root
        //     * @type Object
        //     * @private
        //     */
        //    this._root = null;
		//};

		//BST.prototype = {

        //    /*
        //     * Inserts some data to the appropriate position in the tree.
        //     */

        //    insert: function(key, label) {
        //        label = label || key.toString();
        //        //create new node, use the ginen value
        //        var node = {
        //                key: key,
        //                label: label,
        //                left: null,
        //                right: null
        //            },
        //            //current traverses the BST structure
        //            current;

        //        //no items in tree yet?
        //        if (this._root === null) {
        //            this._root = node;
        //        } else {
        //            current = this._root;
        //            while (true) {
        //                if (key <= current.key) {
        //                    if (current.left === null) {
        //                        current.left = node;
        //                        break;
        //                    } else {
        //                        current = current.left;
        //                    }
        //                } else if (key > current.key) {
        //                    if (current.right === null) {
        //                        current.right = node;
        //                        break;
        //                    } else {
        //                        current = current.right;
        //                    }
        //                }
        //            }
        //        }
        //    },

        //    size: function() {
        //        var length = 0;
        //        this.traverse(function(node) {
        //                length++;
        //        });

        //        return length;
        //    },

        //    toArray: function() {
        //        var result = [];
        //        this.traverse(function(node) {
        //            result.push(node.label);
        //        });

        //        return result;
        //    },

        //    print: function() {
        //        var grid = new Array(60);
        //        for (var k = 0; k<grid.length; k++)
        //            grid[k]=new Array(60);
        //        var y=0; 
        //        var x=0;
        //        function inOrder(node) {
        //            if (node) {
        //                if (node.left) {
        //                    x = x + 1;
        //                    inOrder(node.left);
        //                }

        //                if (node.right || node.left) {  // eswterikos komvos
        //                    if (node.left) {
        //                        x=x-1;
        //                    }
        //                    grid[x][y]=node.label; 
        //                    console.log(x,y,node.label);
        //                    if (node.right) {     // an exei deksi paidi, auksise to bathos
        //                        x=x+1;
        //                    }
        //                }
        //                else { // fullo
        //                        grid[x][y]=node.label; 
        //                        //console.log(x,y,node.label);
        //                      }
        //                y = y + 2;
        //                if (node.right) {
        //                    inOrder(node.right);
        //                    x = x - 1;
        //                }
        //            }
        //        }
        //        inOrder(this._root);
        //        for (var i=0; i<grid.length; i++){
        //            var line = '';
        //            for (var j=0; j<grid.length; j++)
        //                if (grid[i][j]) {
        //                    line += grid[i][j].toString();
        //                } else {
        //                    line += ' ';
        //                }
        //            console.log(line);
        //        }
        //    },

        //    toString: function(){
        //        return this.toArray().toString();
        //    },
        //    
        //    traverse: function(process) {
        //        function inOrder(node) {
        //            if (node) {
        //                if (node.left) {
        //                    inOrder(node.left);
        //                }

        //                process.call(this, node);

        //                if (node.right) {
        //                    inOrder(node.right);
        //                }
        //            }
        //        }

        //        inOrder(this._root);
        //    },

		//	abs: function(a, b) {
		//		this.x = Math.abs(this.x);
		//		this.y = Math.abs(this.y);
		//		return this;
		//	},

		//	clear: function() {
		//		this.x = this.y = 0;
		//		return this;
		//	}

		//};

        module.exports = BST;
    }
    );



define('gnosys/datastructures',["require", "exports", "module", "./datastructures/BST"], function (require, exports, module) {
    
    module.exports = {
	    BST: require('./datastructures/BST')
    };
});

define('gnosys/geometry/Vec2',["require", "exports", "module"], 
	function(require, exports, module) {

		/*
		 * @member gnosys
		 * @class a two-dimensional vector class
		 */

		var Vec2 = function(a, b) {
			if (a instanceof Object && a.x !== undefined && a.y !== undefined) {
				b = a.y;
				a = a.x;
			} else {
				if (a === undefined) {
					a = 0;
				}
				if (b === undefined) {
					b = 0;
				}
			}
			this.x = a;
			this.y = b;
		};

		//private,
		var _getXY = function(a, b) {
			if (a instanceof Object) {
				b = a.y;
				a = a.x;
			} else {
				if (a !== undefined && b === undefined) {
					b = a;
				} else if (a === undefined) {
					a = 0;
				} else if (b === undefined) {
					b = 0;
				}
			}
			return {x: a, y: b};
		};

		Vec2.prototype = {

			abs: function(a, b) {
				this.x = Math.abs(this.x);
				this.y = Math.abs(this.y);
				return this;
			},

			clear: function() {
				this.x = this.y = 0;
				return this;
			},

			toString: function() {
				var s = "Vec2(" + this.x + "," + this.y + ")";
				return s;
			}
		};

		module.exports = Vec2;
	}
);
	



define('gnosys/geometry/Point2',[ "require", "exports", "module", "./Vec2" ], function(require, exports,
		module) {

	/*
	 * @member gnosys @class a two-dimensional point class
	 */

	var Point2 = function(a, b) {
		if (a instanceof Object && a.x !== undefined && a.y !== undefined) {
			b = a.y;
			a = a.x;
		} else {
			if (a === undefined) {
				a = 0;
			}
			if (b === undefined) {
				b = 0;
			}
		}
		this.x = a;
		this.y = b;
	};

	// private
	var _getXY = function(a, b) {
		if (a instanceof Object) {
			b = a.y;
			a = a.x;
		} else {
			if (a !== undefined && b === undefined) {
				b = a;
			} else if (a === undefined) {
				a = 0;
			} else if (b === undefined) {
				b = 0;
			}
		}
		return {
			x : a,
			y : b
		};
	};

	// public
	Point2.prototype = {
		abs : function() {
			this.x = Math.abs(this.x);
			this.y = Math.abs(this.y);
			return this;
		},

		clear : function() {
			this.x = this.y = 0;
			return this;
		},

		equals : function(obj) {
			if (obj instanceof Object) {
				return (this.x == obj.x) && (this.y == obj.y);
			}
			return false;
		},

		toString : function() {
			var s = "Point2(" + this.x + "," + this.y + ")";
			return s;
		},

		sub : function(other) {
			var Vec2 = require('./Vec2');
			return new Vec2(this.x - other.x, this.y - other.y);
		}
	};

	module.exports = Point2;

});

define('gnosys/geometry/Circle2',["require", "exports", "module", "./Point2"],

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

/**
 * 
 */


define('gnosys/geometry/Rectangle2',[ "require", "exports", "module", "./Point2" ],

function(require, exports, module) {

	/*
	 * @member gnosys @class a two-dimensional rectangle class
	 */

	var Rectangle2 = function(position, width, height) {
		/*
		 * check parameters
		 */
		// var Point2 = require('./Point2');
		// if (!(position instanceof Point2) || !(size instanceof Point2)) {
		// alert("Position or Size problem!!" + position.y + size.y);
		// }
		this.position = position;
		this.width = width;
		this.height = height;
	};

	Rectangle2.prototype = {

		/* FIX HERE */
		// toString : function() {
		// var s = "Rectangle2(" + this.position.toString() + ","
		// + this.size.toString() + ")";
		// return s;
		// },
		bbox : function() {
			return {
				x : this.position.x,
				y : this.position.y,
				width : this.width,
				height : this.height
			};
		},
	};

	module.exports = Rectangle2;
});
define('gnosys/geometry/Triangle2',["require", "exports", "module", "./Point2"], 
	function(require, exports, module) {
	/*
	 * @member gnosys
	 * @class a two dimensional triangle class
	 */
	var Triangle2 = function(a, b, c) {
		var Point2 = require("./Point2");
		if ((a instanceof Point2) && (b instanceof Point2) && (c instanceof Point2)) {
			this.a = a;
			this.b = b;
			this.c = c;
		} else {
			alert("Triangle2: Invalid Point2!");
			return null;
		}
	};
	
	module.exports = Triangle2;
});
define('gnosys/geometry',[ "require", "exports", "module", "./geometry/Vec2",
		"./geometry/Point2", "./geometry/Circle2", "./geometry/Rectangle2",
		"./geometry/Triangle2" ], function(require, exports, module) {
	module.exports = {
		Vec2 : require('./geometry/Vec2'),
		Point2 : require('./geometry/Point2'),
		Circle2 : require('./geometry/Circle2'),
		Rectangle2 : require('./geometry/Rectangle2'),
		Triangle2 : require('./geometry/Triangle2')
	};
});

/*global define: true */
/*global define: true */
/*jslint browser: true*/
define('gnosys/visual/scene',["require", "exports", "module"],

function(require, exports, module) {
    
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
define('gnosys/visual/VCircle2',[ "require", "exports", "module", "../geometry/Circle2" ],

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


define('gnosys/visual/VRectangle2',[ "require", "exports", "module", "../geometry/Rectangle2" ],

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

define('gnosys/visual',[ "require", "exports", "module", "./visual/scene", "./visual/VCircle2",
		"./visual/VRectangle2" ], function(require, exports, module) {

	module.exports = {
		Scene : require('./visual/scene'),
		VCircle2 : require('./visual/VCircle2'),
		VRectangle2 : require('./visual/VRectangle2')
	// Actor: require('./visual/actor'),
	// utils: require('./visual/utils'),
	// Canvas2: require('./visual/Canvas2'),
	// VPoint2: require('./visual/VPoint2'),
	// Input2: require('./visual/Input2')
	};
});

define('gnosys/main',[
    "./datastructures",
	"./geometry",
	"./visual"
	], function(datastructures, geometry, visual) {

		return {
            datastructures: datastructures,
			geometry: geometry,
			visual: visual
		};
	}
);

define('gnosys',[ "./gnosys/main" ], function(gnosys) {
	return gnosys;
});
gnosys = require('gnosys'); }())
