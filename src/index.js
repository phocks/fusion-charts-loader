// var FusionCharts = require("fusioncharts");
const loadJS = require('loadjs');
const shortid = require('shortid');

const styles = require('./styles.scss')

// require("fusioncharts/fusioncharts.charts")(FusionCharts);

let render = () => {
  ABC.News.embedExternalLinks.registerHandler({
    name: 'fusion-chart',
    pattern: /\/news\/interactives\/fchart\/\?xml=(.*)&type=(.*)$/,
    mobile: true,
    caption: 'Infographic',
    callback (options) {

      // Get the URL so we can extract the params later
      const parametersURL = options.externalLink;

      let chartType =   getParameterByName('type', parametersURL),
          chartWidth =  getParameterByName('width', parametersURL) || "100%",
          chartHeight = getParameterByName('height', parametersURL) || "100%",
          dataFormat =  getParameterByName('format', parametersURL) || "xmlurl",
          dataSource =  getParameterByName('xml', parametersURL);


      // Generate unique ID so we can have multiple charts
      const chartName = "chart-container-" + shortid.generate();


      const rootEl = options.container[0];

      let rootWidth = rootEl.offsetWidth;


      let appEl = document.createElement('div');

      appEl.innerHTML =
       `<div class=${styles.fusionChart} id="${chartName}">
          <div class="spinner"></div>
        </div>`;

      // Replace external link without chart div
      rootEl.innerHTML = appEl.innerHTML;

      // Just select the element again so we can modify it
      appEl = document.getElementById(chartName);
      appEl.style.height = rootWidth + "px"; // 1x1 square for now


      loadJS([ "/cm/code/8851742/fusioncharts.js", "/cm/code/8851862/fusioncharts.charts.js" ], {
        success: () => {
          FusionCharts.ready( () => {
            var fusionChart = new FusionCharts({
              "type":       chartType,
              "renderAt":   chartName,
              "width":      chartWidth,
              "height":     chartHeight,
              "dataFormat": dataFormat,
              "dataSource": dataSource
            });
            fusionChart.render();
          });
        },
        async: false
      });
    }
  });
};


render();



// Function definitions: maybe put them in their own document later

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}