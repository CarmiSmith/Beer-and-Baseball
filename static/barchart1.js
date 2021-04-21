// Define a function that will create metadata for given sample
function buildMetadata(selection) {

  // Read the json data
  d3.json("json/teambeers.json").then((Data) => {

    var filterData = Data.filter(obj => {
      return obj.team == selection

    })
    console.log(filterData)

    var chosenTeam = filterData[0]
    var tbody = d3.select("#data-table").append("tbody")
    var tr = tbody.append("tr")
    tr.append('td').text(chosenTeam.team)
    tr.append('td').text(chosenTeam.Average_Price_per_Ounce)
    tr.append('td').text(chosenTeam.year)
    tr.append('td').text(chosenTeam.wins)
      
  });
}

// Define a function that will create charts for given sample
function buildCharts(selection) {

  // Read the json data
  d3.json("json/teambeers.json").then((Data) => {
    
      Data.forEach((d) => {
        var filtData = d.team;
        var price = d.Average_Price_per_Ounce
        var wins = d.year
        var hovertext = filtData; 

              // Create bar chart in correct location
      var barTrace = {
        type: "bar",
        y: wins,
        x: price,
        text: hovertext,
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
      
      // Create bubble chart in correct location
      var bubbleTrace = {
          x: price,
          y: wins,
          text: hovertext,
          mode: "markers",

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
  d3.json("json/teambeers.json").then((Data) => {
      Data.forEach((d) => {
           // Filter data to get sample names
        var filtData = d.team;
         // Add dropdown option for each sample
        var dropdownMenu = d3.select("#table-selector-dropdown");
        dropdownMenu.append("option").property("value", filtData).text(filtData)
      });

        //buildMetadata(filtData[0]);

        buildCharts(filtData[0]);
    
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