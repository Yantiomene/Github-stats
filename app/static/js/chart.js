function drawTrendLine(data) {
    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#trend-line-chart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function drawBarChart(data) {
    
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the X and Y scales
    const xScale = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([height, 0]);

    // Create the bars
    svg.selectAll(".data-bar")
        .data(Object.entries(data))
        .enter().append("rect")
        .attr("class", "data-bar")
        .attr("x", d => xScale(d[0]))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d[1]))
        .attr("height", d => height - yScale(d[1]));

    // Create X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Create Y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));
}