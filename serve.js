'use strict';
const Perlin = require('./public/perlin');
const express = require('express');
const app = express();
const port = 5000;
const host = '0.0.0.0';
const path = require('path')
const favicon = require("serve-favicon")


//TODO have these values inside perlin.js and export so the front-end can grab state
let pixels = [];
let grid_size = 4;
let resolution = 30;
let color_scale = 200;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, "public")))

app.get('/', (_, res) =>{
    res.sendFile('index.html', {root: __dirname});
});

app.post('change_grid_size', (req, res)=>{
    this.grid_size = parseInt(req.body.val);
    res.end("OKAY");
})

app.post('change_resolution', (req, res)=>{
    this.resolution = parseInt(req.body.val);
    res.end("OKAY");
})

app.get('/gradient', (_, res) =>{
    
        for(let y = 0; y < grid_size; y+=(grid_size/resolution)/grid_size){
            for(let x = 0; x < grid_size; x+=(grid_size/resolution)/grid_size){
                let func_val = Perlin.get_perl_val(x,y) * color_scale
                pixels.push({
                        //the weight will be based on the defined value provided by the perlin noise generator 
                        id: `hsl(${parseInt(func_val)}, 60%, 50%)`,
                        x: x/grid_size*512,
                        y: y/grid_size*512,
                        val: func_val
                });
            }
        }
    res.json(pixels)
})

app.listen(port, host, ()=>{
    console.log(`Running on http://${host}:${port}`)
});