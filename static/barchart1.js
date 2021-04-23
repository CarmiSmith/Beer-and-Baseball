// Define a function that will create metadata for given sample
function buildMetadata(selection) {
    //const url = "/teambeers"
    
      // Read the json data
      d3.json("http://127.0.0.1:5000/teambeers").then((Data) => {
    
        var filterData = Data.filter(obj => {
          return obj.team == selection
        })
        //console.log(filterData)
    
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
      d3.json("http://127.0.0.1:5000/teambeers").then((Data) => {
        
            var filterData = Data.filter(obj => {
              return obj.team == selection
        
            })
            var prices = filterData.map((obj) => {
              return obj.Average_Price_per_Ounce
            })
            var wins = filterData.map((obj) => {
              return obj.wins
            })
            var teams = filterData.map((obj) => {
              return obj.team
            })
            var years = filterData.map((obj) => {
              return obj.year
            })
         
             // Create bar chart in correct location
        //   var barTrace = {
        //     type: "bar",
        //     y: filterData.wins,
        //     x: filterData.price,
        //     text: filterData.team,
        //     orientation: 'h'
        // };
    
        //   var barData = [barTrace];
        //     // Create the layout variable
        //   var barLayout = {
        //       title: "Beer and Baseball",
        //       yaxis: {
        //       tickmode: "linear"
        //       }
        //   };
    
        //   Plotly.newPlot("bar", barData, barLayout);
        //   })
        // } 
          // Create bubble chart in correct location
          var bubbleTrace = {
              x: wins,
              y: prices,
              text: years,
              mode: "markers",
              marker: {
                color: [120, 125, 130, 135, 140, 145],
                size: [20, 40, 60, 80, 100, 120]
              }
           };
    
           var bubbleData = [bubbleTrace];
    
           var layout = {
               showlegend: false,
               height: 600,
               width: 1000,
               xaxis: {
                   title: "Wins (Year)"
               },
               yaxis: {
                  title: "Price per Ounce"
            }
           };
    
           Plotly.newPlot("bubble", bubbleData, layout);
          });
        }
    
    
    // Define function that will run on page load
    function init() {
    
      // Read json data
      d3.json("http://127.0.0.1:5000/teambeers").then((Data) => {
          Data.forEach((d) => {
               // Filter data to get sample names
            var filtData = d.team;
             // Add dropdown option for each sample
            var dropdownMenu = d3.select("#table-selector-dropdown");
            //Data.forEach((d) => {
            dropdownMenu.append("option").property("value", filtData).text(filtData)
          });
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