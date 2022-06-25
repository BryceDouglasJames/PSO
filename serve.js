'use strict';
import {get_perl_val,
    grid_size,
    resolution,
    color_scale,
    running,
    max_iters,
    new_map
 } from './public/perlin.js';
import express, {json} from 'express';
import path from 'path'
const app = express()
const port = 5000;
const host = '0.0.0.0';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import favicon from "serve-favicon";
import { fileURLToPath } from 'url';

app.use(json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, "public")))

app.get('/', (_, res) =>{
    res.sendFile('index.html', {root: __dirname});
});

app.post('change_grid_size', (req, res)=>{
    grid_size = parseInt(req.body.val);
    res.end("OKAY");
})

app.post('change_resolution', (req, res)=>{
    resolution = parseInt(req.body.val);
    res.end("OKAY");
})

app.get('/gradient', (_, res) =>{
    new_map();
    let pix = [];
    let index = 0;
    for(let y = 0; y < grid_size; y+=(grid_size/resolution)/grid_size){
        for(let x = 0; x < grid_size; x+=(grid_size/resolution)/grid_size){
            let func_val = get_perl_val(x,y) * color_scale
            pix.push({
                    //the weight will be based on the defined value provided by the  noise generator 
                    id: `hsl(${parseInt(func_val)}, 60%, 50%)`,
                    x: x/grid_size*600,
                    y: y/grid_size*600,
                    val: func_val,
                    index: index++
            });            
        }
    }
    let answer = {
        "pixels": pix,
        "grid_size": grid_size,
        "resolution": resolution,
        "color_scale": color_scale,
        "running": running,
        "max_iters": max_iters
    }
    res.json(answer);
})

app.listen(port, host, ()=>{
    console.log(`Running on http://${host}:${port}`)
});