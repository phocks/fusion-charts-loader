// var FusionCharts = require("fusioncharts");
var loadJS = require('loadjs');
var shortid = require('shortid');

// require("fusioncharts/fusioncharts.charts")(FusionCharts);


let render = () => {
  ABC.News.embedExternalLinks.registerHandler({
    name: 'fusion-chart',
    pattern: /\/news\/interactives\/fchart\/\?xml=(.*)&type=(.*)$/,
    mobile: true,
    caption: 'Infographic',
    callback: function(options) {
      // Get the URL so we can extract the params later
      const parametersURL = options.externalLink;
      const chartName = "chart-container-" + shortid.generate();

      const rootEl = options.container[0];
      const appEl = document.createElement('div');

      appEl.innerHTML = '<div id="' + chartName + '">Loading...</div>';
      rootEl.innerHTML = appEl.innerHTML;

      loadJS([ "/cm/code/8851742/fusioncharts.js", "/cm/code/8851862/fusioncharts.charts.js" ], {
        success: () => {
          FusionCharts.ready(function () {
            var fusionChart = new FusionCharts({
              "type": getParameterByName('type', parametersURL),
              "renderAt": chartName,
              "width": getParameterByName('width', parametersURL) || "100%",
              "height": getParameterByName('height', parametersURL) || "500",
              "dataFormat": getParameterByName('format', parametersURL) || "xmlurl",
              "dataSource": getParameterByName('xml', parametersURL)
            });
            fusionChart.render();
          });
        },
        async: false
      });
    }
  });
};


// Do some hot reload magic with errors
// if (process.env.NODE_ENV !== 'production' && module.hot) {
//   // Wrap the actual renderer in an error trap
//   let renderFunction = render;
//   render = () => {
//   try {
//     renderFunction();
//   } catch (e) {
//     // Render the error to the screen in place of the actual app
//     const ErrorBox = require('./error-box');
//     Preact.render(<ErrorBox error={e} />, element, element.lastChild);
//     }
//   };

//   // If a new app build is detected try rendering it
//   module.hot.accept('./components/app', () => {
//   setTimeout(render);
//   });
// }

// Optionally change this to wait for Odyssey
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