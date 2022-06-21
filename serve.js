'use strict';
import {get_perl_val,
    pixels,
    grid_size,
    resolution,
    color_scale,
    running
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
        for(let y = 0; y < grid_size; y+=(grid_size/resolution)/grid_size){
            for(let x = 0; x < grid_size; x+=(grid_size/resolution)/grid_size){
                let func_val = get_perl_val(x,y) * color_scale
                pixels.push({
                        //the weight will be based on the defined value provided by the  noise generator 
                        id: `hsl(${parseInt(func_val)}, 60%, 50%)`,
                        x: x/grid_size*512,
                        y: y/grid_size*512,
                        val: func_val
                });
            }
        }
    let answer = {
        "pixels": pixels,
        "grid_size": grid_size,
        "resolution": resolution,
        "color_scale": color_scale,
        "running": running
    }
    res.json(answer);
})

app.listen(port, host, ()=>{
    console.log(`Running on http://${host}:${port}`)
});