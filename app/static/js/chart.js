function drawTrendLine(data) {
    // Set up the SVG container
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#trend-line-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // Parse date strings into JavaScript Date objects
    // var parseDate = d3.utcParse("%Y-%m-%dT");
    // data.forEach(function (d) {
    //     d.date = parseDate(d.date);
    //     d.commits = +d.commits;
    // });

    // // Ensure data is ordered by date
    // data.sort((a, b) => a.date - b.date);

    // Define scales
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.commits; })])
        .range([height, 0]);

    // Define the line
    var line = d3.line()
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.commits); });

    // Draw data points
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function (d) { return xScale(d.date); })
        .attr("cy", function (d) { return yScale(d.commits); })
        .attr("r", 5);

    // Draw the trend line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    // Draw axes
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));
}


// --------------------------------------------------
// Dummy data
// var data = [
//     { day: 1, commits: 5 },
//     { day: 2, commits: 8 },
//     { day: 3, commits: 12 },
//     { day: 4, commits: 6 },
//     { day: 5, commits: 10 },
//     { day: 6, commits: 15 },
// ];

// $(document).ready(function() {
//     drawTrendLine(data);
// });