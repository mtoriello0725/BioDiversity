function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  url = "/metadata/"+sample;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel_selector = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel_selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key,value]) => {
      d3.select(".panel-body")
        .append("b").html(`${key}: ${value} `);
    });
    // Works for now, but will need to pretty it up

  });
}

function buildGauge(sample) {
  url = "/wfreq/"+sample;

  d3.json(url).then(function(response){

    console.log("from gauge function")

    var meterRatio = 180/9

    var level = meterRatio * response 
    console.log(level)

    // calculate meter point
    var degrees = 180 - level,
         radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Create triangle path
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // define data for gauge chart
    var data = [{
      type: "scatter",
      x: [0],
      y: [0],
      marker: {size: 28, color: "850000"},
      showlegend: false,
      name: "WFREQ",
      text: response,
      hoverinfo: "name+text"},

      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
        textinfo: "text",
        textposition: "inside",
        marker: {colors: [
          'rgba(14, 127, 0, .5)', 'rgba(70, 155, 15, .5)',
          'rgba(120, 180, 30, .5)', 'rgba(170, 202, 42, .5)',
          'rgba(185, 203, 75, .5)', 'rgba(200, 205, 110, .5)',
          'rgba(210, 206, 145, .5)', 'rgba(220, 216, 180, .5)',
          'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
          ]},

        hole: .5,
        type: "pie",
        showlegend: false
      }];

    // Define layout for gauge chart
    var layout = {
      shapes:[{
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {color: "850000"}
      }],

      title: "<b>Gauge: WFREQ 0-9</b>",
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot("gauge", data, layout);

  })
}