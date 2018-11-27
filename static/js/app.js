function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  url = "/metadata/"+sample;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){

    console.log(response);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel_selector = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel_selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key,value]) => {
      d3.select(".panel-body")
        .append("p").html(`${key}: ${value}`);
    });
    // Works for now, but will need to pretty it up

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = "/samples/"+sample;
  console.log(url);

  d3.json(url).then(function(response) {

    var sampleData = response;

    console.log(sampleData);

    // Try to reconstruct the data given to be list of dictionaries
    var sortable = [];
    for (var i=0; i < sampleData.sample_values.length; i++ ) {

      var dict = {
        "otu_id": sampleData.otu_ids[i],
        "otu_label": sampleData.otu_labels[i],
        "sample_value": sampleData.sample_values[i]
      };
      sortable.push(dict);
    };
    console.log(sortable);

    // @TODO: Build a Bubble Chart using the sample data

    var data = [{
      y: sortable.map(row => row.sample_value),
      x: sortable.map(row => row.otu_id),
      mode: "markers",
      marker: {
        size: sortable.map(row => row.sample_value/2),
        colorscale: "YiGnBu"
      }
    }];

    var layout = {
      title: "Bubble Chart",
      showlegend: false,
      height: 500,
      width: 1000
    };    

    Plotly.newPlot("bubble", data, layout);    

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    sortable.sort(function(a,b){
      return b.sample_value - a.sample_value;
    })
    sortable = sortable.slice(0,10);

    var data = [{
      values: sortable.map(row => row.sample_value),
      labels: sortable.map(row => row.otu_id),
      type: "pie"
    }];

    var layout = {
      height: 500,
      width: 500
    };

    Plotly.newPlot("pie", data, layout);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard

init();
