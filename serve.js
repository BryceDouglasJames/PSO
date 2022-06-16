'use strict';
const express = require('express');
var Rainbow = require("rainbowvis.js");
const app = express();
const port = 5000;
const host = '0.0.0.0';
const path = require('path')
const favicon = require("serve-favicon")

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, "public")))

app.get('/', (_, res) =>{
    res.sendFile('index.html', {root: __dirname});
});

app.get('/gradient', (_, res) =>{
    let gradient = new Rainbow()
    gradient.setNumberRange(1, 4000000)
    gradient.setSpectrum("pink", 'blue')
    let pixels = []
        let hex_string = ''
        for(let y = 0; y <= 2000; y+=5){
            for(let x = 0; x <= 2000; x+=5){
                let func_val = (x**2) + ((y+1)**2)
                hex_string =  gradient.colorAt(func_val)
                pixels.push({
                        //the weight will be the id based on the defined function 
                        id: "#" + hex_string,
                        x: x,
                        y: y,
                });
            }
        }
        //gradient.setNumberRange(Math.min(pixels), Math.max(pixels))
        
    
    //generate_pixels()
    //console.log(pixels)
    res.json(pixels)
})

app.listen(port, host, ()=>{
    console.log(`Running on http://${host}:${port}`)
});