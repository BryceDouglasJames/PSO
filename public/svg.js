 //import {running} from './perlin.js'
 
 class swarm {
     static particles_best = [100];
     static particles_best_vals = [100];
     static global_best = null;
     static global_best_val = -1;
     static grid = [];
     constructor(particles, velocities, fitness, grid, trials, amount, width, height){
          //defaults
          this.w = 0.8;
          this.c1 = 1;
          this.c2 = 1;
          this.current_iter = 0;
          this.epochs = trials;
          this.auto_params = false;
          this.n = amount;
          this.grid = grid;
          this.width = width;
          this.height = height;
     
          //set particle attributes
          this.particles = particles;
          this.velocities = velocities;
          this.fitness = fitness;
     
          //unified particle best fit for evey optima
          this.particles_best = this.particles;
          this.particles_best_vals = this.fitness(this.particles);
          
          //set global best particle
          this.global_best = this.particles_best[0];
          this.global_best_val = this.particles_best_vals[0];
        
     
          //init
          this.update_best_fit();
     
     }
 
     next(){
         if(this.current_iter > 0){
             this.move();
             this.update_best_fit();
             this.update_coefficents();
         }
 
         this.current_iter += 1;
     }
 
     move(){
         /*
         *   see https://www.sciencedirect.com/science/article/pii/S0898122111004299 
         *   for formula
         * 
         * 
         *   this is VERY rough at the moment oopsies
         */
 
         //set velocity
         //let v = this.w * this.velocities;
          let r1 = [];
          let r2 = [];
          let currentpos = new Array();

          for(let i = 0; i < this.n; i++){
               r1[i] =  (Math.random() * 2) + 1;
               r2[i] =  (Math.random() * 2) + 1;
          }

          let new_vs = [];
          //let new_pos = [];

          this.particles.map((particle) =>{
               //generate cognitive params
               let temp = particle;
               let px = temp.x;
               let py = temp.y;

               let v = this.w * this.velocities[particle.index];
          
               //console.log(v)
               

               //generate cognition local params
               v += this.c1 * r1[particle.id] * (this.particles_best[particle.index].pbest - v);
               
               //console.log(`c1: ${this.c1} r1: ${r1[particle.id]} val: ${this.particles_best[particle.index].pbest}`)
               

               //grab nearest pixel node by using x,y cord window                   
               let temp_pos  = this.grid.filter(function(obj) { return (Math.floor(obj.x) - 10 <= px && Math.floor(obj.x) + 10 >= px)});
               currentpos = temp_pos;
               temp_pos  = currentpos.find(function(obj)  {return (Math.floor(obj.y) - 10 <= py && Math.floor(obj.y) + 10 >= py)});
               currentpos = temp_pos;
     
               //if undefined, widen the window
               if(currentpos === undefined){
                    temp_pos  = this.grid.filter(function(obj) { return (Math.floor(obj.x) - 80 <= px && Math.floor(obj.x) + 80 >= px)});
                    currentpos = temp_pos;
                    temp_pos  = currentpos.find(function(obj)  {return (Math.floor(obj.y) - 80 <= py && Math.floor(obj.y) + 80 >= py)});
                    currentpos = temp_pos
               }

               //console.log(currentpixel)
               //You can set this to find either the min or maxima maybe???
               //right now this will find the highest value
               //if(this.global_best_val < currentpixel.val){
               //     this.global_best = particle;
               //     this.global_best_val = currentpixel.val
               //}

               v += this.c2 * r2[particle.id] * (this.global_best_val - currentpos.val);

               //update new velocity and move accordingly
               new_vs[particle.id] = v;

               //update (x,y) of the particle and update particle list
               //TODO: implement more reliable reposition
               particle.x += (this.w * v) / this.n;
               particle.y += (this.w * v) / this.n;
               this.particles[particle.index] = particle;
               //console.log(new_vs)
          });

          //console.log(`particles : ${JSON.stringify(this.particles_best)}`)
          //console.log(this.particles)
          //console.log(new_vs)
          //console.log(this.n)
     }
 
     update_best_fit(){
         //get most fit particle for personal local exploration
         let fittest = this.fitness(this.particles);

         for(let i = 0; i < this.particles.length; i++){
             //if this particle is better suited, reassign local best particle
             if(fittest[i] > this.particles_best[i]){
                 
               //update personal best
               this.particles_best[i] = fittest[i]
               this.particles_best_vals[i] = this.particles[i];

               //update global best if needed
               if (fittest[i].pbest > this.global_best_val){
                    this.global_best = particle;
                    this.global_best_val = currentpixel.val
                    console.log("UPDATE")
               }
             }
         }
     }

     update_coefficents(){

          //if this particle happens to bet the best overall, 
          //assign it to be the best global particle
          if (this.auto_params){
               iters = this.iters;
               n = this.epochs;
               this.w = (0.4/n**2) * (iters-n) **2 + 0.4;
               this.c1 = -3 * iters / n + 3.5;
               this.c2 = 3 * iters / n + 0.5;
          }
     }
 
     toString(){
         return `Iteration: ${this.current_iter}/${this.epochs} c1: ${this.c1} c2:${this.c2} w:${this.w}`
     }
 }

 
 let random_data = [], unit_pixels = []
 width = 300
 height = 300

 function generate_Random_points(){
     random_data = [];
     for (let i=0 ; i < 30; i++){
          random_data.push({
               id: i,
               pbest: -1,
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

               vels = [];
               for(let i = 0; i < unit_pixels.length; i++){
                    ran = Math.random();
                    vels[i] = ran;
               }


               let target = 0;
               const fitess_function =  function(particles){
                    temp = [], index = 0
                    particles.map((node, _) =>{
                         temp[index] = node.pbest;
                         index += 1;
                    })
                    return temp;
               }

                //constructor(particles, velocities, fitness, trials, amount)
               s = new swarm(random_data, vels, fitess_function, unit_pixels, 50, 100, width, height)

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
                         .attr('r', 6)
                         .attr("fill", "black")
                         .call(d3.drag()
                              .on("start", dragstarted)
                              .on("drag", dragged)
                              .on("end", dragended));

               const start_button = document.createElement("button")
               start_button.innerHTML = "start";
               start_button.onclick = function (){
                    
                    if (running === false){
                         console.log("START")
                         start_button.innerHTML = "stop";
                         running = true;
                    }else{
                         console.log("STOP")
                         start_button.innerHTML = "start";
                         running = false;
                    }               
               };
               document.body.appendChild(start_button);               
                         
               //kinda optional, but add the data cords to simulation node cords
               simulation.nodes(random_data)

               //trigger simulation event loop
               simulation.on('tick', handletick);

               let refresh = 0; let iters = 0;
               function handletick(){
                    if (refresh > 1000){
                         refresh = 0;
                         //simulation.alphaTarget(0.4).restart();
                    }else if(running){
                         simulation.alphaTarget(0.2)
                         refresh = 0
                         console.log("HEY")
                         s.next()
                         iters += 1;
                         if (iters >= res.ret_arr.max_iters){
                              console.log("DONEEEE")
                              node.data(random_data);
                              iters = 0;
                              start_button.click();
                         }
                         refresh += 1
                    }else{
                         refresh += 1
                    }
                    

                    node.attr('cx', function(d) { return d.x; })
                    node.attr('cy', function(d) { return d.y; })
                    //node.attr('vy', function(d) { return d.vy })
                    //node.attr('vx', function(d) { return d.vx })
               }

    

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
