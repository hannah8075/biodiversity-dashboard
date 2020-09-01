// //console log samples.json
// d3.json("samples.json").then(d =>{
//     console.log(d);
// });

// read samples.json to create chart
// examined that sample values in json in sorted order
function createCharts(samplesId) {
    d3.json("samples.json").then(d => {
        var samples = d.samples
        //filter sample data using sample ID
        var filterSample = samples.filter(x => x.id == samplesId)
        var results = filterSample[0]
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

        //Gauge
        // Randomly generate washing frequency between 0 and 180 degress
        var freq = parseFloat(Math.random() * (180 - 0) + 0);

        // Using degrees to determine where needle points
        var degrees = 180 - freq;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: freq,
            hoverinfo: "text+name"
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
            colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
            ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
        ];

        var layout = {
        shapes: [
            {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
                color: "850000"
            }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
        };

        Plotly.newPlot("gauge", data, layout);
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

//function to update dashboard when new sample is selected
function optionChanged(newSample) {
    createCharts(newSample);
    loadMetaData(newSample);
}

function loadMetaData(samplesId) {
    d3.json("samples.json").then(d => {
    var metadata = d.metadata;
    //filter metadata data based on selected sample ID
    var filterMeta = metadata.filter(x => x.id ==samplesId)
    var results = filterMeta[0]
    var sampleMetaData = d3.select("#sample-metadata");
    //clear previous output
    sampleMetaData.html("")
    //write in key and values for each metadata 
    Object.entries(results).forEach(([key,value]) => 
        {sampleMetaData.append("h7").text(`${key}: ${value}`).append("br")
    });

})
}
//init function for when page is launched
init()