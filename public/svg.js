 //import {running} from './perlin.js'
 
 let random_data = [], unit_pixels = []
 width = 512
 height = 512
 //import './perlin.mjs'


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

async function display(){
     //wait to generate heatmap with assigned weights for particles to calculate off of
     await fetch('/gradient')
          .then(response => {
               response.json().then(res_arr=>({
                    ret_arr: res_arr
               })     
          ).then(res=>{
               document.querySelector("#load").innerHTML = ''

               running = res.ret_arr.running;

               //assign pixel data from server generated cords
               unit_pixels = res.ret_arr.pixels

               //initalize d3 svg
               var svg = d3.select("svg").attr("width", width).attr("height", height);
               svg.style("display", "block")
               svg.style("margin", "auto")


               //inmitialize simulation
               var simulation = d3.forceSimulation()
               //.force("center", d3.forceCenter(width/2, height/2))
               //.force("charge", d3.forceManyBody())
               //.force("x", d3.forceX(width/2).strength(0.3))
               //.force("y", d3.forceY(height/2).strength(0.3))


               //define pixel props
               var pixel = svg.append('g')
                    .attr('class', 'unit_pixels')
                    .selectAll('rect')
                    .data(unit_pixels)
                    .enter().append('rect')
                         .attr('x', function(d){ return d.x })
                         .attr('y', function(d){ return d.y })
                         .attr('width', window.innerWidth/30)
                         .attr('height', window.innerHeight/30)
                         .attr('fill', function(d){ return d.id })

               //define node props
               var node = svg
                    .append('g')
                    .attr('class', 'nodes')
                    .selectAll('circle')
                    .data(random_data)
                    .enter().append('circle')
                         .attr('r', 7)
                         .attr("fill", "black")
                         .call(d3.drag()
                              .on("start", dragstarted)
                              .on("drag", dragged)
                              .on("end", dragended));
                         
               //kinda optional, but add the data cords to simulation node cords
               simulation.nodes(random_data)

               //trigger simulation event loop
               simulation.on('tick', handletick);
               function handletick(){
                    node.attr('cx', function(d) { return d.x; })
                    node.attr('cy', function(d) { return d.y; })
               }

               const start_button = document.createElement("button")
               start_button.innerHTML = "start";
               start_button.onclick = function (){
                    if (running === false){
                         start_button.innerHTML = "stop";
                         running = true;
                    }else{
                         start_button.innerHTML = "start";
                         running = false;
                    }
               };
               document.body.appendChild(start_button);

               //event handlers
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
               //console.log(unit_pixels)
               return
          })
     })          
}
generate_Random_points() 
display()
