 //initalize d3 svg
 var svg = d3.select("svg"),
 width = +svg.attr("width"),
 height = +svg.attr("height");
svg.style("background-color", "lightblue")
svg.style("display", "block")
svg.style("margin", "auto")

//enable drag functionality
svg.call(d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended));
svg.append("g")

//enable zoom functionality
svg.call(d3.zoom()
 .scaleExtent([0.25, 10])
 .on('zoom', handlezoom));
svg.append("g")

//event handlers
function handlezoom(e){
 console.log("ZOOOM")
 svg.attr('transform', d3.event.transform)
}

function dragstarted(e){
 console.log("DRAG START")
}

function dragged(e){
 console.log("DRAGGING")
}

function dragended(e){
 console.log("DRAG END")
}