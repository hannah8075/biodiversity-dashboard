// //console log samples.json
// d3.json("samples.json").then(d =>{
//     console.log(d);
// });

// read samples.json to create chart
// examined that sample values in json in sorted order
function createCharts(samplesId) {
    d3.json("samples.json").then(d => {
        var samples = d.samples
        var filterSample = samples.filter(x => x.id == samplesId)
        console.log(filterSample)
        var results = filterSample[0]
        console.log(results)
        // create variables for top 10 arrays
        var sampleValues10 = results.sample_values.slice(0,10).reverse();
        var otuIds10 = results.otu_ids.slice(0,10).reverse();
        var otuLabels10 = results.otu_labels.slice(0,10).reverse();
        
        // create more descriptive ID labels 
        var strIds = otuIds10.map(str => "OTU" + " " + str.toString());
    
        //  create data array for plot
        var barData = [{
            type: 'bar',
            x: sampleValues10,
            y: strIds,
            orientation: 'h',
            mode: 'markers',
            marker: {size:16},
            text: otuLabels10
          }];
      
        // Define the plot layout
        var barLayout = {
          title: "Top 10 OTUs",
          xaxis: { title: "Sample Values" },
          yaxis: { title: "OTU ID" }
        };
      
        // Plot the chart
        Plotly.newPlot("bar", barData, barLayout);
    
    
        //bubble chart
        var otuIds = results.otu_ids
        var sampleValues = results.sample_values
        var otuLabels = results.otu_labels
    
        var bubbleData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIds,
                size: sampleValues
            }
        }];
        
        var bubbleLayout = {
            title: 'Bubble Chart of OTU',
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" },
            showlegend: false,
            height: 600,
            width: 1000
        };
        
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

function init() {
    d3.json("samples.json").then(d => {
    var names = d.names
    
    // create selector
    var selector = d3.select("#selDataset");
    // Use sample names to populate the select options
    for (var i = 0; i < names.length; i++) {  
    selector.append("option").property("value",names[i]).text(names[i])
    }  

    // set default to sample 1
    var sample1 = d.names[0];
    createCharts(sample1);
    loadMetaData(sample1);
    });
}

function optionChanged(newSample) {
    createCharts(newSample);
    loadMetaData(newSample);
}

init()

function loadMetaData(samplesId) {
    d3.json("samples.json").then(d => {
    var metadata = d.metadata;
    var filterMeta = metadata.filter(x => x.id ==samplesId)
    var results = filterMeta[0]
    console.log(results)
    var sampleMetaData = d3.select("#sample-metadata");
    sampleMetaData.html("")
    Object.entries(results).forEach(([key,value]) => 
        {sampleMetaData.append("h7").text(`${key}: ${value}`).append("br")
        
    });

})
}
