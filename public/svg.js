 let random_data = []
 width = window.innerWidth
 height = window.innerHeight

 function generate_Random_points(){
     random_data = [];
     for (let i=0 ; i < 100; i++){
          random_data.push({
               id: i,
               x: Math.floor(Math.random() * width),
               y: Math.floor(Math.random() * height)
          });
     }
 }
generate_Random_points()

 //initalize d3 svg
 var svg = d3.select("svg").attr("width", width).attr("height", height);
svg.style("display", "block")
svg.style("margin", "auto")
svg.style("background-color", "pink")


var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width/2, height/2))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(width/2).strength(0.3))
    .force("y", d3.forceY(height/2).strength(0.3))
    
var node = svg
     .append('g')
     .attr('class', 'nodes')
     .selectAll('circle')
     .data(random_data)
     .enter().append('circle')
          .attr('r', 7)
          .call(d3.drag()
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended));
          
simulation.nodes(random_data)
simulation.on('tick', handletick);


//event handlers
function handletick(){
     node.attr('cx', function(d) { return d.x; })
     node.attr('cy', function(d) { return d.y; })
}


function dragstarted(e){
     if(!d3.event.active)
          simulation.alphaTarget(0.2).restart();
     e.fx = e.x
     e.fy = e.y
}

function dragged(e){
     e.fx = d3.event.x
     e.fy = d3.event.y
}

function dragended(e){
     if(!d3.event.active)
          simulation.alphaTarget(0)
     e.fx = null
     e.fy = null
}

/*
//enable zoom functionality
svg.call(d3.zoom()
 .scaleExtent([1, 5])
 //.translateExtent([[0,0], [width*2,height*2]])
 .on('zoom', handlezoom));
svg.append("g")
function handlezoom(e){
 console.log(d3.event.transform)
 var center = d3.mouse(this)
 newx = center[0] - d3.event.transform.x
 newy = center[1] - d3.event.transform.y
 svg.attr('transform', `translate(${newx},${newy}) scale(${d3.event.transform.k})`)
}
*/