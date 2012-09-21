({
	appDir: "./",
	baseUrl: "/home/bluedr/workspace/gnosysjs.latest/lib/",
	dir: "../min",
	findNestedDependencies: true,
	optimize: 'none',
	out: "/home/bluedr/workspace/gnosysjs.latest/build/gnosys.js",
	paths: {
		almond: '/home/bluedr/workspace/gnosysjs.latest/bin/utils/almond',
		almondSettings: '/home/bluedr/workspace/gnosysjs.latest/bin/utils/almond.settings'
	},
	include: [
		'almond',
		'almondSettings',
		'gnosys'
	],
	wrap: {
		start: "//v0.0.1 gnosys.js (http://central.ntua.gr/gnosysjs.latest)\nvar gnosys = {};(function(){\n",
		end: "gnosys = require('gnosys'); }())\n"
	}
})
