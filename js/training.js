var margin1 = {top: 10, right: 50, bottom: 40, left: 60},
    width1 = 750 - margin1.left - margin1.right,
    height1 = 500 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin1.left + "," + margin1.top + ")");

//Read the data
d3.csv("data/training2.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["valueA", "valueB", "valueC", "valueD"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function(d) {
                return {time: d.time, value: +d[grpName]};
            })
        };
    });
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain([0,160])
        .range([ 0, width1 ]);
    svg1.append("g")
        .attr("transform", "translate(0," + height1 + ")")
        .call(d3.axisBottom(x));

    svg1.append("text")      // text label for the x axis
        .attr("x", width1 / 2)
        .attr("y",  height1 + margin1.bottom)
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Epochs");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain( [0,2200])
        .range([ height1, 0 ]);
    svg1.append("g")
        .call(d3.axisLeft(y));

    svg1.append("text")      // text label for the x axis
        .attr("x", width1 / 2)
        .attr("transform", "rotate(-90)")
        .attr("y", 0.2 - margin1.left)
        .attr("x",0 - (height1 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Error");

    // Add the lines
    var line = d3.line()
        .x(function(d) { return x(+d.time) })
        .y(function(d) { return y(+d.value) })
    svg1.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg1
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
        .attr("class", function(d){ return d.name })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function(d){ return d.values })
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.time) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a label at the end of each line
    svg1
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
        .append('g')
        .append("text")
        .attr("class", function(d){ return d.name })
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return myColor(d.name) })
        .style("font-size", 15)

    // Add a legend (interactive)
    svg1
        .selectAll("myLegend")
        .data(dataReady)
        .enter()
        .append('g')
        .append("text")
        .attr('x', function(d,i){ return 30 + i*60})
        .attr('y', 30)
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return myColor(d.name) })
        .style("font-size", 15)
        .on("click", function(d){
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d.name).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
})

