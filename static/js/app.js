//console log samples.json
d3.json("samples.json").then(data =>{
    console.log(data);
});

// read samples.json to create chart
d3.json("samples.json").then(d => {
    //create variables for arrays
    var sampleValues = d.samples[0].sample_values.slice(0,10).reverse()
    var otuIds = d.samples[0].otu_ids.slice(0,10).reverse()
    var otuLabels = d.samples[0].otu_labels
    //  Create data array for plot
    var data = [{
        type: 'bar',
        x: sampleValues,
        y: otuIds,
        orientation: 'h',
        //hovertext
        mode: 'markers',
        marker: {size:16},
        text: otuLabels
      }];
  
    // Define the plot layout
    var layout = {
      title: "Number of OTU Samples",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  
    // Plot the chart
    Plotly.newPlot("bar", data, layout);
  });
