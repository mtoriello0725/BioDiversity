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
      text: sortable.map(row => row.otu_label),
      type: "scatter",
      mode: "markers",
      marker: {
        size: sortable.map(row => row.sample_value/2),
        color: sortable.map(row => row.otu_id),
        colorscale: "Viridis"
      },
      hoverinfo: "(x,y) text"
    }];

    var layout = {
      title: "<b>Bubble Chart</b>",
      titlefont:{
        size: 20
      },
      xaxis: {
        title: "OTU_ID",
        titlefont: {
          size: 18
        }

      },
      yaxis: {
        title: "Sample_Value",
        titlefont: {
          size: 18
        }
      },
      showlegend: false,
      height: 500,
      width: 1000,
      hovermode: "closest"

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
      // text: sortable.map(row => row.otu_label),
      type: "pie",
      hoverinfo: "labels",
      // textinfo: "none"
    }];

    var layout = {
      title: "<b>Pie Chart of Sample "+sample+"</b>",
      height: 500,
      width: 500
    };

    Plotly.newPlot("pie", data, layout);

  })
}