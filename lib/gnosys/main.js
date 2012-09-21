define([
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
