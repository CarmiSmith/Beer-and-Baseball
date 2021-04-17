const ROOT_URL = 'https://namhere.herokuapp.com'

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
        margin: {
            l: 60,
            r: 0,
            b: 50,
            t: 0
        },
      yaxis: {
        title: "Team",
        text: Team,
        font: {
        family: 'Sans Serif',
        size: 20,
        color: '#4974a5'
       }
       },
       
       xaxis: {
       title: "Cost",    
         text: Cost,
         font: {
         family: 'Sans Serif',
         size: 20,
         color: '#4974a5'
       }
       },
    }
       return barLayout
    }

    function createTable(d, x, y) {

        // update table data
        var tableData = []
        for (var ind = 0; ind < Object.values(d.name).length; ind++) {
            tableData.push({
                'name': Object.values(d.name)[ind],
                'x': Object.values(d[toSnakeCase(x)])[ind],
                'y': Object.values(d[toSnakeCase(y)])[ind]
            })
        }
    // load table data
    $(function () {
        if ($.fn.dataTable.isDataTable('#data-table')) {
            table = $('#data-table').DataTable({ 
                retrieve: true 
            });
            table.destroy()
        }

        // create or recreate data table - documentation @ datatables.net
        $('#data-table').DataTable({
            data: tableData,
            columns: [
                { data: 'Team Name'},
                { data: 'x'},
                { data: 'y'}
            ],
            searching: false,
            pagingType: "full",
            columnDefs: [{ "title": "Team Name", "targets": 0 }, { "title": toTitleCase(x), "targets": 1 }, { "title": toTitleCase(y), "targets": 2 }],
            responsive: true
        })

        $('#data-table').bootstrapTable("hideLoading")

    })

    // bootstrap updates too quickly to change headers without timeout....
    setTimeout(updateTableHeaders, 1000)

    function updateTableHeaders(){
        if ($('.th-inner').text().length > 0){
            
            var arr = [x, y]

            // update headers of x and y
            $('.th-inner').each(function (index, obj){
                if(index > 0){
                    $(this).html(toTitleCase(arr[index-1]))
                }
            })
        }

        
    }

}
function createBarchart(table, x, y, zeros) {
    d3.json(`${ROOT_URL}/${toSnakeCase(table)}/${toSnakeCase(x)}/${toSnakeCase(y)}`).then((d) =>{

        // check for incorrect input
        if(d.length === 0){
            alert('Please choose different x and y values!')
            return
        }

        // remove zero values
        if (zeros) {
            d = removeZeros(d, toSnakeCase(x), toSnakeCase(y))
        }

        // update table
        createTable(d, x, y)

        // create bar plot
        var layout = makeLayout(toTitleCase(x), toTitleCase(y))
        var plot = document.getElementById('plot');

        // setup trace
        var trace = {
            x: Object.values(d[toSnakeCase(x)]),
            y: Object.values(d[toSnakeCase(y)]),
            text: Object.values(d.name),
            mode: 'markers',
            type: 'barchart'
        }
        
        


        
        tickmode: "linear"
      }
    };
  
        Plotly.newPlot("bar", barData, barLayout);