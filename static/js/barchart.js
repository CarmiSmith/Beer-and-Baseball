//const ROOT_URL = 'https://namhere.herokuapp.com'

// Define a function that will create charts for given sample
  function buildCharts(selection) {
  
    // Read the json data
    d3.jsond3.json('http://localhost:5000/wins').then((data) => {
        console.log(data) // this is the data from the flask app
  
        // Filter the data to get the sample's OTU data
        var filtData = data;
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

function createScatter(table, x, y, zeros) {
    d3.json(`${'http://localhost:5000/wins'}/${toSnakeCase(table)}/${toSnakeCase(x)}/${toSnakeCase(y)}`).then((d) =>{

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

        // create scatter plot
        var layout = makeLayout(toTitleCase(x), toTitleCase(y))
        var plot = document.getElementById('plot');

        // setup trace
        var trace = {
            x: Object.values(d[toSnakeCase(x)]),
            y: Object.values(d[toSnakeCase(y)]),
            text: Object.values(d.name),
            mode: 'markers',
            type: 'scatter'
        }

        // setup data
        var data = [trace]

        // create plot
        Plotly.newPlot(plot, data, layout, { responsive: true, displayModeBar: false })
    })
}

function updateScatter() {

    // get table selection
    var selector = document.getElementById('table-selector-dropdown')
    var table = selector.options[selector.selectedIndex].value.toLowerCase()

    // get x choice
    var xAxis = document.getElementById('x-selector-dropdown')
    xAxis = xAxis.options[xAxis.selectedIndex].value.toLowerCase()

    // get y choice
    var yAxis = document.getElementById('y-selector-dropdown')
    yAxis = yAxis.options[yAxis.selectedIndex].value.toLowerCase()

    // get remove zero option
    var removeZeros = document.getElementById('remove-zeros')
    removeZeros = removeZeros.checked

    //create scatter plot
    createScatter(table, xAxis, yAxis, removeZeros)
}

function updateSelectors() {

    var selector = document.getElementById('table-selector-dropdown')
    var table = selector.options[selector.selectedIndex].value.toLowerCase()

    // axies dropdowns
    var x = document.getElementById('x-selector-dropdown')
    var y = document.getElementById('y-selector-dropdown')

    var options = ''
    d3.json(`${'http://localhost:5000/wins'}/${toSnakeCase(table)}`).then((d) => {
        
        // create options
        for (var selection of d) {
            options += "<option>" + toTitleCase(selection) + "</option>"
        }

        // add options
        x.innerHTML = options
        y.innerHTML = options
    })

}

function toTitleCase(str) {
    
    // split string into words
    var words = str.split('_')
    var outputWords = ''

    // concatenate words together with space
    for(var word of words){
        outputWords += word + ' '
    }

    // convert to proper casing
    var output = outputWords.charAt(0).toUpperCase() + outputWords.substr(1).toLowerCase()

    return output.trim();
}

function toSnakeCase(str) {

    // split string into words
    var words = str.split(' ')
    var outputWords = ''

    // concatenate words together with space
    if(words.length > 1){
        for (var word of words) {
            outputWords += word + '_'
        }
        outputWords = outputWords.substr(0, outputWords.length - 1)
    } else {
        outputWords = str
    }

    // convert to proper casing
    var output = outputWords.toLowerCase().trim()

    return output;

}

function removeZeros(obj, x, y) {

    /* Removes entries that have 0s in x or y values. */

    var clean = {}

    // setup arrays
    clean[x] = []
    clean[y] = []
    clean['name'] = []

    // loop through object
    for (var i = 0; i < Object.keys(obj[x]).length; i++) {
        // if the values are not empty, add to the new object
        if (obj[x][i] != 0 && obj[y][i] != 0) {
            clean[x].push(obj[x][i])
            clean[y].push(obj[y][i])
            clean['name'].push(obj['name'][i])
        }
    }

    return clean

}

$(document).ready(() => {

    // default graph
    createScatter('team_name', 'beer_cost', 'wins')
    
    // create event listener
    d3.selectAll('#submitBtn').on('click', updateScatter)
    d3.selectAll('#table-selector-dropdown').on('change', updateSelectors)
})


        tickmode: "linear"
      }
    };
  
        Plotly.newPlot("bar", barData, barLayout);