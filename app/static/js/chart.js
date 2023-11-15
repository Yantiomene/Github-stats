function drawTrendLine(data) {
    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 450;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#trend-line-chart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`);

    // Define scales
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, (d3.max(data, function (d) { return d.commits; }) * 1.10) / 1000]) // Updated Y-axis scale to display in 'k'
        .range([height, 0]);

    // Define the line
    var line = d3.line()
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.commits / 1000); }); // Updated Y values to be in 'k'

    // Draw the trend line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .style("stroke-width", 2)
        .style("fill", "none");

    // Draw axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => d + 'k'))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "var(--dark-grey)");

    // Adding gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    // CREATE TOOLTIP
    const tooltip = d3.select("#trend-line-chart")
        .append("div")
        .attr("class", "tooltip");

    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "var(--secondary-color)")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0); // Make it invisible

    // Mousemove event on the listening rectangle
    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.date).left;
        const x0 = xScale.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPos = xScale(d.date);
        const yPos = yScale(d.commits / 1000); // Updated Y value to be in 'k'

        // Update the position of the circle (tooltip)
        circle.attr("cx", xPos).attr("cy", yPos);
        tooltip
            .style("display", "block")
            .style("left", `${xPos + 30}px`)
            .style("top", `${yPos + 30}px`)
            .html(`<strong>Date: </strong>${convertDate(d.date)}<br>
                   <strong>Contribution count: </strong>${d.commits}`);
    });

    // Transition for the tooltip circle
    circle.transition().duration(50).attr("r", 5);

    listeningRect.on("mouseleave", function () {
        // circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
    });

    // Add Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "var(--dark-grey)")
        .text("Total Public Contributions Count (k)");

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "#333")
        .text("Contribution Analysis");
}


function drawBarChart(data) {
    const svgWidth = 800;
    const svgHeight = 450;
    const margin = { top: 50, right: 20, bottom: 50, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the X and Y scales
    const xScale = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data)) * 1.10])
        .range([height, 0]);

    // Create the bars with some styling
    const barChartTooltip = createTooltip("#bar-chart");
    svg.selectAll(".data-bar")
        .data(Object.entries(data))
        .enter().append("rect")
        .attr("class", "data-bar")
        .attr("x", d => xScale(d[0]))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d[1]))
        .attr("rx", 8)
        .attr("height", d => height - yScale(d[1])) 
        .on("mouseover", (event, d) => barChartTooltip.show(event, `${d[0]}: ${formatFileSize(d[1])}`))
        .on("mouseout", barChartTooltip.hide);

    // Create X-axis with some styling
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("dy", ".35em")
        .style("text-anchor", "center")
        .style("font-size", "12px")
        .style("fill", "var(--dark-grey)");

    // Create Y-axis with some styling and custom format
    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "var(--dark-grey)");

    // Add a title to the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "var(--dark-grey)")
        .text("Programming Languages Experience");
}
