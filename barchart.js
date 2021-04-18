  // Define a function that will create charts for given sample
  function buildCharts(selection) {
  
    // Read the json data
    d3.jsond3.json('http://localhost:5000/wins').then((data) => {
        console.log(data) // this is the data from the flask app
  
        // Filter the data to get the sample's OTU data
        var filtData = data;
        //var sampleDict = filtData.filter(item => item.id == selection)[0];
        //var sampleValues = sampleDict.sample_values; 
        //var idValues = sampleDict.otu_ids;
        //var barLabels = idValues.slice(0, 10).reverse();
        //var newLabels = [];
        //barLabels.forEach((label) => {
            //newLabels.push("OIT " + label);
        });
        var hovertext = mlb_beer_prices;
        
        // Create bar chart in correct location
        var barTrace = {
            type: "bar",
            y: team,
            x: wins,
            text: hovertext,
            orientation: 'h'
        };
  
        var barData = [barTrace];
  
    // Create the layout variable
    var barLayout = {
      title: "MLB",
      yaxis: {
        tickmode: "linear"
      }
    };
  
        Plotly.newPlot("bar", barData, barLayout);