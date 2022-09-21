// Where is the circle
let c_w = 800
let c_h = 800
let cx, cy;
let r = 100
let x = 0;
let w0 = 0
let b = 10
let graph_w = c_w - r * 2 - 3 * b
let graph_h = r * 2
let scale = 50

let sin_values = []
let cos_values = []

let phi0 = 0

function preload() {
  
  a_field = document.getElementById('a');
  a_field.value = r; 
  a_field.addEventListener('change', event => {
    r = parseFloat(a_field.value);
    init_values();
  });
  
  omega_field = document.getElementById('omega');
  omega_field.value = w0; 
  omega_field.addEventListener('change', event => {
    w0 = parseFloat(omega_field.value);
    init_values();
  });
  
  phi0_field = document.getElementById('phi0');
  phi0_field.value = phi0;   
  phi0_field.addEventListener('change', event => {
    phi0 = parseFloat(phi0_field.value);
    init_values();
  });
}

function init_values(){
  
  while(sin_values.length > 0) {
    sin_values.pop();
  }
  while(cos_values.length > 0) {
    cos_values.pop();
  }
  
  cx = r + b;
  cy = r + b; 
  
  x = 0;
  
  graph_w = c_w - 2 * r - 3 * b
}

function setup() {
  createCanvas(c_w, c_h);
  
  textSize(16);

  init_values();
}

function draw() {
  px = r * cos(w0 * x + phi0);
  py = r * sin(w0 * x + phi0);
  
  
  sin_values.push([x, py])
  cos_values.push([x, px])
    
  if (cos_values[cos_values.length -1][0] * scale >= graph_w) {
    cos_values.shift();
  }
  if (sin_values[sin_values.length -1][0] * scale >= graph_w) {
    sin_values.shift();
  }
  
  background(200);
  
  stroke(0,0,0)

  
  circle(cx,cy,r * 2)
  circle(cx,cy,5)
    
  line(cx,cy,cx,b)
  line(cx,cy, cx + r, cy)
  text("Im", cx + 2, b + 16)
  text("Re", cx + r - 32, cy + 16)

  line(0,cy - py,width, cy - py)
  line(cx + px,0, cx + px, height)
  
  line(cx + r + b, cy + r, cx + r + b, cy - r)
  line(cx + r + b, cy, cx + r + b + graph_w, cy )
  
  line(cx - r, cy + r + b, cx + r , cy + r + b)
  line(cx , cy + r + b, cx , cy + r + b + graph_w)

  circle(cx + px, cy - py, 5)
  
  stroke(255,0,0)
  line(cx, cy, cx + px, cy - py)
  
   stroke(0,0,255)

  text("sin", cx + px - 32, cy - py * 0.5)
  line(cx + px,cy, cx + px, cy -  py)
  
  for(var i = 0; i < sin_values.length; ++i){   
    point(cx + r + b + i, cy  - sin_values[i][1]);    
  }
  
  stroke(0,255,255)
  
  text("cos", cx + px * 0.5, cy + 16)
  line(cx + px,cy, cx, cy )

  for(var i = 0; i < cos_values.length; ++i){   
    point(cx + cos_values[i][1], cy + r + b + i );    
  }
  
  stroke(0,255,0)
  line(cx + r + b/2,b, cx + r + b/2, cy - py)
  line(b,cy + r + b/2,  px + cx, cy + r + b/2)
  
  x+= 0.02;
}

