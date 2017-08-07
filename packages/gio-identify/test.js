'use strict';

let expect = require('chai').expect;

let load = require('../gio-load/index');
let cache = require('../gio-cache/index');
let identify = require('./index');

let url = 'http://geotiff.io/data/spam2005v2r0_physical-area_rice_total.tiff';
let point = [-93.5, 41.8];
let expected_value = 20;

let list_of_points = [[55, 62], [66, 77], [120, -54]];

let test = () => (
	describe('Gio Identify Feature', function() {
		describe('Identify Point in Raster', function() {
			this.timeout(1000000);
			it('Identified Point Correctly', () => {
				return load(url).then(tiff => {
					let image = tiff.getImage();
					let value = identify(image, point);
					expect(value).to.equal(expected_value);
				});
			});
		});
	})
)

test();

module.exports = test;