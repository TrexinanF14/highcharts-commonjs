'use strict';

var Highcharts = require('./src/highcharts.src.js');
require('imports?Highcharts=./highcharts.src.js!./src/highcharts-more.src.js');
require('imports?Highcharts=./highcharts.src.js,HighchartsAdapter=./HighchartsAdapter.js!./src/exporting.js');

/**
* Create a global getSVG method that takes an array of charts as an argument
*/
Highcharts.getSVG = function(charts) {
	var svgArr = [],
	top = 0,
	width = 0;

	$.each(charts, function(i, chart) {
		var svg = chart.getSVG();
		svg = svg.replace('<svg', '<g transform="translate(0,' + top + ')" ');
		svg = svg.replace('</svg>', '</g>');

		top += chart.chartHeight;
		width = Math.max(width, chart.chartWidth);

		svgArr.push(svg);
	});

	return '<svg height="'+ top +'" width="' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>';
}

module.exports = {
	createChart: function(div, options, callback) {
		options.chart = options.chart || {};
		options.chart.renderTo = div;
		return new Highcharts.Chart(options, callback);
	},
	destroy: function(chart) {
		chart.destroy();
	},
	/**
	* Create a global exportCharts method that takes an array of charts as an argument,
	* and exporting options as the second argument
	*/
	exportCharts: function(charts, options) {
		var form;
		var svg = Highcharts.getSVG(charts);

		// merge the options
		options = Highcharts.merge(Highcharts.getOptions().exporting, options);

		// create the form
		form = Highcharts.createElement('form', {
				method: 'post',
				action: options.url
			}, {
				display: 'none'
		}, document.body);

		// add the values
		Highcharts.each(['filename', 'type', 'width', 'svg'], function(name) {
			Highcharts.createElement('input', {
				type: 'hidden',
				name: name,
				value: {
				filename: options.filename || 'chart',
				type: options.type,
				width: options.width,
				svg: svg
				}[name]
			}, null, form);
		});
		//console.log(svg); return;
		// submit
		form.submit();

		// clean up
		form.parentNode.removeChild(form);
	}
};
