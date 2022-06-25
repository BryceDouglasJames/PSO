//big thanks to these sources
//  https://adrianb.io/2014/08/09/perlinnoise.html
//  https://joeiddon.github.io/
// :)


// Hash lookup table as defined by Ken Perlin.
//This will be used for other perlin implemetation later...
let perms = [
151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,    
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]

//GLOBAL VALUES
export let pixels = [];
export let grid_size = 4;
export let resolution = 20;
export let color_scale = 200;
export let running = false;
export let max_iters = 100;
//*******************


let gradients = {}
let cache = {}
let simple_vects = []

//for simple randoms. assign vector to each unit vertex
export function new_map(){
    simple_vects = []
    gradients = {}
    cache = {}
    
    for (let i = 0; i < 8; i++){
        let temp = []
        for(let j = 0; j < 8; j++){
            temp.push(simple_random())
        }
        simple_vects.push(temp)
    }
}


//This will generate a random unit vector.. not so random
export function simple_random(){
    let t = Math.random() * 2 * Math.PI
    let cord = {x: Math.cos(t), y: Math.sin(t)}
    return cord;
}

//get dot product of gradient vectors and distance vectors
function dot_product(x,y,vx,vy){
    let direction = {x:x - vx, y: y - vy}, gradient = {x:0, y:0};
    if(gradients[[vx,vy]]){
        //found gradient in table
        gradient = gradients[[vx,vy]];
    }else{
        //assign new gradient and add to table
        gradient = simple_random();
        gradients[[vx,vy]] = gradient;
    }
    //console.log(`grade: ${JSON.stringify(gradient)}, direction: ${JSON.stringify(direction)}`)
    return (direction.x * gradient.x) + (direction.y * gradient.y)
}

//generate some voodoo perlin values for each unit vertex
export function get_perl_val(x,y){
    
    x = x.toFixed(5)
    y = y.toFixed(5)
    //if this val has been calculated already, just fetch from cache and return
    if (cache.hasOwnProperty([x,y])) return cache[[x,y]];

    //set min and max for gradient
    let xf = Math.floor(x);
    let yf = Math.floor(y);

    //uhhhhh interpolation stuff
    let tl = dot_product(x, y, xf, yf);

    //console.log(`tl: ${tl} xf: ${xf} yf: ${yf}`)
    let tr = dot_product(x, y, xf+1, yf);
    let bl = dot_product(x, y, xf,   yf+1);
    let br = dot_product(x, y, xf+1, yf+1);
    let xt = intercept(x-xf , tl, tr);
    let xb = intercept(x-xf, bl, br);

    //console.log(`${y}, ${xt}, ${xb}`)
    let v = intercept(y-yf, xt, xb);

    //store and return value
    cache[[x,y]] = v;

    //console.log(cache)
    return v;
}

function fade_func(x){
    return 6*x**5 - 15*x**4 + 10*x**3;
}

function intercept(x, a, b){
    return a + fade_func(x) * (b-a);  
}   

/*export default {
    get_perl_val,
    pixels,
    grid_size,
    resolution,
    color_scale,
    running
}*/

/*module.exports = {
    get_perl_val,
    pixels,
    grid_size,
    resolution,
    color_scale,
    running
}*/
