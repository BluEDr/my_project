define([ "require", "exports", "module", "./geometry/Vec2",
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
