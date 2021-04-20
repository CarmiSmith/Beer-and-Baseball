// Define a function that will create metadata for given sample
function buildMetadata(selection) {

  // Read the json data
  d3.json("json/averages.json").then((Data) => {

    var filterData = Data.filter(obj => {
      return obj.team == selection

    })
    console.log(filterData)

    var chosenTeam = filterData[0]
    var tbody = d3.select("#data-table").append("tbody")
    var tr = tbody.append("tr")
    tr.append('td').text(chosenTeam.team)
    tr.append('td').text(chosenTeam.team)
    tr.append('td').text(chosenTeam.team)



    
      //Data.forEach((d) => {
      // Filter the data to get the sample's metadata
     // var filtData = d.team;
      //console.log(filtData)
      //var sample = filtData.filter(item => item.id.toString() == selection)[0];
      //})
      // Specify the location of the metadata and update it
      
  });
}

// Define a function that will create charts for given sample
function buildCharts(selection) {

  // Read the json data
  d3.json("json/averages.json").then((Data) => {
    
      Data.forEach((d) => {
        var filtData = d.team;
        var sampleDict = filtData.filter(item => item.team == selection)[0];
        var sampleValues = sampleDict.team; 
        var idValues = sampleDict.Average_Price_per_Ounce;
        var barLabels = idValues.slice(0, 10).reverse();
        var newLabels = [];
        barLabels.forEach((label) => {
            newLabels.push("Team " + label);
        });
        var hovertext = sampleDict.team; 

              // Create bar chart in correct location
      var barTrace = {
        type: "bar",
        y: newLabels,
        x: sampleValues.slice(0, 10).reverse(),
        text: hovertext.slice(0, 10).reverse(),
        orientation: 'h'
    };

      var barData = [barTrace];
        // Create the layout variable
      var barLayout = {
          title: "Beer and Baseball",
          yaxis: {
          tickmode: "linear"
          }
      };

      Plotly.newPlot("bar", barData, barLayout);
      })
      // Filter the data to get the sample's OTU data
      

      




      // Create bubble chart in correct location
      var bubbleTrace = {
          x: idValues,
          y: sampleValues,
          text: hovertext,
          mode: "markers",
          marker: {
              color: idValues,
              size: sampleValues
          }
      };

      var bubbleData = [bubbleTrace];

      var layout = {
          showlegend: false,
          height: 600,
          width: 1000,
          xaxis: {
              title: "Beer and Baseball"
          }
      };

      Plotly.newPlot("bubble", bubbleData, layout);
  });
}


// Define function that will run on page load
function init() {

  // Read json data
  d3.json("json/averages.json").then((Data) => {
      Data.forEach((d) => {
        //console.log(d.team)
           // Filter data to get sample names
        var filtData = d.team;
         // Add dropdown option for each sample
        var dropdownMenu = d3.select("#table-selector-dropdown");
        dropdownMenu.append("option").property("value", filtData).text(filtData)
        //buildMetadata(filtData[0]);

        //buildCharts(filtData[0]);
        //console.log(filtData)
              // Add names to the drop down
        //filtData.forEach((team) => {
        //console.log(team)
          //dropdownMenu.append("option").property("value", team).text(team);
      //})
      });
      
      
   

     


      // Use first sample to build metadata and initial plots
    

  });
}

function optionChanged() {
  newSelection = d3.select("#table-selector-dropdown").property("value")
  

  // Update metadata with newly selected sample
  buildMetadata(newSelection); 
  // Update charts with newly selected sample
  buildCharts(newSelection);
}

d3.select("#submitBtn").on("click", optionChanged)

// Initialize dashboard on page load
init();