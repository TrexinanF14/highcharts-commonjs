'use strict';

var Highcharts = require('./src/highcharts.src.js');
require('imports?Highcharts=./highcharts.src.js!./src/highcharts-more.src.js');
require('imports?Highcharts=./highcharts.src.js,HighchartsAdapter=./HighchartsAdapter.js!./src/exporting.js');

module.exports = {
  createChart: function(div, options, callback) {
    options.chart = options.chart || {};
    options.chart.renderTo = div;
    return new Highcharts.Chart(options, callback);
  },
  destroy: function(chart) {
    chart.destroy();
  }
};
