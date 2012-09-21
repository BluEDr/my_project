'use strict';
define([ "require", "exports", "module", "./visual/scene", "./visual/VCircle2",
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
