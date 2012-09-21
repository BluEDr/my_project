/*global define: true */
define(["require", "exports", "module"],
    function (require, exports, module) {
		"use strict";

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


