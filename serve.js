'use strict';
const express = require('express');
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

app.listen(port, host, ()=>{
    console.log(`Running on http://${host}:${port}`)
});