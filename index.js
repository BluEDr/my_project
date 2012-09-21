/*
 * WTF is going on here?
 * see and try to understand http://requirejs.org/docs/node.html#2
 */

var requirejs = require('./bin/utils/r.js');

var gnosys = {};

requirejs.config({
	baseUrl : __dirname + '/lib',
	nodeRequire : require
});

requirejs([ 'gnosys' ], function(gnosys) {
	module.exports = gnosys;
}); 

//test sq
