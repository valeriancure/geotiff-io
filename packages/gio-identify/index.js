'use strict';

let gio = require('../gio/index');
let load = require('../gio-load/index');
let convert_geometry = require('../gio-convert-geometry/index');

module.exports = (image, geometry) => {
		
	// convert point
	let point = convert_geometry('point', geometry);
	let lng = point[0];
	let lat = point[1];

	// convert image
	let fd = image.fileDirectory;
	let geoKeys = image.getGeoKeys();

	// TEMPORARY: make sure raster is in wgs 84
	if (geoKeys.GeographicTypeGeoKey === 4326 && geoKeys.GeogCitationGeoKey === "WGS 84") {
		
		let data = image.readRasters();

		let origin = image.getOrigin();
		let lng_0 = origin[0];
		let lat_0 = origin[1];
		let cell_width = fd.ModelPixelScale[0];
		let cell_height = fd.ModelPixelScale[1];

		// console.error(`image props: origin lng: ${lng_0}, origin lat: ${lat_0}`);
		// console.error(`             cell width: ${cell_width}, cell height: ${cell_height}`);
		// console.error(`             image width: ${fd.ImageWidth}, height: ${fd.ImageLength}, num cells: ${data[0].length}`);
		// console.error(`point props: lng: ${lng}, lat: ${lat}`);

		let x = Math.floor(Math.abs(lng - lng_0) / cell_width);
		let y = Math.floor(Math.abs(lat_0 - lat) / cell_height);
		let cell_index = y * fd.ImageWidth + x;

		// console.error(`values: x: ${x}, y: ${y}, cell_index: ${cell_index}`);
		let value = data.length === 1 ? data[0][cell_index] : data.map(d => d[cell_index]);

		return value;
	} else {
		throw 'Identification currently only works with geotiffs in WGS 84. Please reproject the geotiff';
	}
}