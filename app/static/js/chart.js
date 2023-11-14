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
        .attr("transform", `translate(${margin.left}, 0)`);

    // Define scales
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.commits; }) + 100])
        .range([height, 0]);

    // Define the line
    var line = d3.line()
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.commits); });

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
        .call(d3.axisLeft(yScale))
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
        .style("opacity", 0)  // Make it invisible

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
        const yPos = yScale(d.commits);
        
        // Update the position of the circle (tooltip)
        circle.attr("cx", xPos).attr("cy", yPos);

        function convertDate(str){
            const date = new Date(str);
            const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        tooltip
            .style("display", "block")
            .style("left", `${xPos + 30}px`)
            .style("top", `${yPos + 30}px`)
            .html(`<strong>Date: </strong>${convertDate(d.date)}<br>
                   <strong>Commits: </strong>${d.commits}`)
    });

    // Transition for the tooltip circle
    circle.transition().duration(50).attr("r", 5);
    
    listeningRect.on("mouseleave",function (){
        // circle.transition().duration(50).attr("r", 0);
        tooltip.style("display","none");
    });
}


// function drawBarChart(data) {
    
//     const svgWidth = 800;
//     const svgHeight = 400;
//     const margin = { top: 20, right: 20, bottom: 30, left: 40 };
//     const width = svgWidth - margin.left - margin.right;
//     const height = svgHeight - margin.top - margin.bottom;

//     const svg = d3.select("#bar-chart")
//         .append("svg")
//         .attr("width", svgWidth)
//         .attr("height", svgHeight)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // Create the X and Y scales
//     const xScale = d3.scaleBand()
//         .domain(Object.keys(data))
//         .range([0, width])
//         .padding(0.1);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(Object.values(data))])
//         .range([height, 0]);

//     // Create the bars
//     svg.selectAll(".data-bar")
//         .data(Object.entries(data))
//         .enter().append("rect")
//         .attr("class", "data-bar")
//         .attr("x", d => xScale(d[0]))
//         .attr("width", xScale.bandwidth())
//         .attr("y", d => yScale(d[1]))
//         .attr("height", d => height - yScale(d[1]));

//     // Create X-axis
//     svg.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(xScale));

//     // Create Y-axis
//     svg.append("g")
//         .call(d3.axisLeft(yScale));
// }


function drawBarChart(data) {
    // Configure chart dimensions and margins
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
  
    // Create the SVG container and append a group for transformation
    const svg = d3.select("#bar-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Define scales for X and Y axes
    const xScale = d3.scaleBand()
      .domain(Object.keys(data))
      .range([0, width])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(Object.values(data))])
      .range([height, 0]);
  
    // Create rounded-corner bars with gradient fill
    svg.selectAll(".data-bar")
      .data(Object.entries(data))
      .enter()
      .append("rect")
      .attr("class", "data-bar")
      .attr("rx", 4) // Rounded corners
      .attr("ry", 4)
      .attr("x", d => xScale(d[0]))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d[1]))
      .attr("height", d => height - yScale(d[1]))
      .style("fill", (d, i) => `url(#gradient-${i + 1})`) // Apply gradient fill
      .style("opacity", 0.8); // Subtle opacity
  
    // Define linear gradients for each bar with contrasting colors
    const gradients = svg.append("defs");
    gradients.selectAll("linearGradient")
      .data(Object.entries(data))
      .enter()
      .append("linearGradient")
      .attr("id", (d, i) => `gradient-${i + 1}`)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 1)
      .attr("y2", 0)
      .selectAll("stop")
      .data(d => d3.interpolateCoolWarm(0, 1)) // Color gradient
      .enter()
      .append("stop")
      .attr("offset", d => d)
      .attr("stop-color", d);
  
    // Enhance axis labels and ticks
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text") // Increase font size and weight
      .style("font-size", "12px")
      .style("font-weight", 600);
  
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", 600);
  
    // Add faint grid lines
    svg.selectAll(".grid-line")
      .data(yScale.ticks(5)) // Five grid lines
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("x1", 0)
      .attr("x2", width)
      .style("stroke", "lightgray") // Subtle color
      .style("stroke-width", 0.5);
  
    // Refine chart container
    svg.style("background-color", "lightgray") // Subtle background
      .style("padding", "10px"); // Subtle padding
  
    // Incorporate annotations and labels (optional)
    // ...
  
    // Stylize data point labels (optional)
    // ...
  }
  