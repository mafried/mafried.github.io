const border = 16
const channel_levels = 256
const text_size = 16
const canvas_width = 800
const canvas_height = 1024
const max_image_with = 800
const max_image_height = 600
const sel_size = 4

var active_region = -1
var scale_factor = 10

let img
let overlay_img

function preload() {
  
  scale_factor_field = document.getElementById('scale_factor');
  scale_factor_field.value = scale_factor; 
  
  
  const button = document.getElementById('button');
  button.addEventListener('click', event => {
    scale_factor = scale_factor_field.value;
    setup_image_data();
  });
  
  img = loadImage('assets/hist2dim_1.jpg',  setup_image_data); 
}

function handle_file() {
  const selected_file = document.getElementById('upload');
  const image = selected_file.files[0];
  let image_url = URL.createObjectURL(image);
  img = loadImage(image_url,  setup_image_data);
}

function setup() {
   
  createCanvas(canvas_width, canvas_height);
  textSize(text_size);
}

function setup_image_data() {
  
  if (img.width > img.height)
    img.resize(min(max_image_with, img.width),  img.height / (img.width / min(max_image_with, img.width)))
  else 
     img.resize(img.width / (img.height / min(max_image_height, img.height)),  min(max_image_height, img.height))
  
  print(img.width + ' ' + img.height)
  
  histos = create_histos_2d(img)

  overlay_img = createImage(img.width, img.height);
  
  overlay_img.loadPixels();
  for (let i = 0; i < overlay_img.width; i++) {
    for (let j = 0; j < overlay_img.height; j++) {
      overlay_img.set(i, j, color(0, 0, 0, 0));
    }
  }
  overlay_img.updatePixels();
}


function draw() {
  
  background(200);
    
  image(img, 0, 0);
  image(overlay_img, 0, 0)
  
  regions = [
    [0, img.height + border], 
    [channel_levels + border, img.height + border], 
    [2 * (channel_levels + border), img.height + border]
  ]
  
  for (var i = 0; i < regions.length; ++i) {
    image(histos[0][i], regions[i][0], regions[i][1])  
  }
  
  text("X-Achse: Rot, Y-Achse: Grün", regions[0][0], img.height + border + channel_levels + border)
  text("X-Achse: Rot, Y-Achse: Blau", regions[1][0], img.height + border + channel_levels + border)
  text("X-Achse: Grün, Y-Achse: Blau", regions[2][0], img.height + border + channel_levels + border)

  text("Es gilt: Nach oben und rechts positiv.", 0, img.height + border + channel_levels + border + border + text_size)

  rect(mouseX - sel_size / 2, mouseY - sel_size / 2, sel_size, sel_size)
  
  active_region = -1
  for (var i = 0; i < regions.length; ++i) {

    if (cursor_in_region(regions[i][0], regions[i][1], channel_levels, channel_levels)) {  
    
      let rc = get_region_coords(regions[i][0], regions[i][1])
      
      active_region = i
        
      count = histos[1][i][rc[0] + channel_levels * flip_axis(rc[1], channel_levels)]
        
      text('Kanalwerte: ' + rc[0] + ' ' + flip_axis(rc[1], channel_levels) + " Anzahl: " + count, 0, img.height + border + channel_levels + border + border + text_size + border + text_size)
        
      break;
    }
  }
}

/*
let sel_x1, sel_y1, sel_x2, sel_y2;

function mousePressed() {
  
  if (active_region == -1) {
    return
  }
  sel_x2 = mouseX
  sel_y2 = mouseY
    
  sel_x1 = mouseX
  sel_y1 = mouseY
}

function mouseDragged() {
  sel_x2 = mouseX
  sel_y2 = mouseY
}
*/

/*
function mouseClicked() {
  
  if (active_region == -1) return 
  
  let x1 = mouseX - sel_size / 2
  let x2 = mouseX + sel_size / 2
  let y1 = mouseY - sel_size / 2
  let y2 = mouseY + sel_size / 2
  
  
  let count = 0;

  overlay_img.loadPixels();

  for (var img_x = 0; img_x < img.width; img_x+=1) {
    for (var img_y = 0; img_y < img.height; img_y+=1) {
      
      c = img.get(img_x,img_y)
      overlay_img.set(img_x,img_y, color(0,0,0,0))            

      for(var x = x1; x < x2; x++) {
        for(var y = y1; y < y2; y++){
          
          //if (position_in_region(x,y, regions[active_region][0], regions[active_region][1], channel_levels, channel_levels)){
            
            rc = (x,y, regions[active_region][0], regions[active_region][1])
            
            
            switch(active_region) {          
              case 0: 
                if (rc[0] == red(c) && flip_axis(rc[1], channel_levels) == green(c)) {
                  overlay_img.set(x,y, color(255,0,0,200))  
                  count++;
                }            
                break;
              case 1:          
                if (rc[0] == red(c) && flip_axis(rc[1], channel_levels) == blue(c)) {
                  overlay_img.set(x,y, color(255,0,0,200))   
                  count++;

                }          
                break;
              case 2:          
                if (rc[0] == green(c) && flip_axis(rc[1], channel_levels) == blue(c)) {
                  overlay_img.set(x,y, color(255,0,0,200))  
                  count++;

                }          
                break;          
              }
            
          //}          
        }    
      }
    }
  }
  
   
  print("Count: " + count)
  
  overlay_img.updatePixels();
}
*/

function mouseClicked() {
  if (active_region == -1) return 
  
  let rc = get_region_coords(regions[active_region][0], regions[active_region][1])  
  let count = 0;

  overlay_img.loadPixels();
     
  for (var x = 0; x < img.width; x+=1) {
    for (var y = 0; y < img.height; y+=1) {
      
      c = img.get(x,y)
          
      overlay_img.set(x,y, color(0,0,0,0))            
     
      switch(active_region) {          
        case 0: 
          if (rc[0] == red(c) && flip_axis(rc[1], channel_levels) == green(c)) {
            overlay_img.set(x,y, color(255,0,0,200))  
            count++;
          }            
          break;
        case 1:          
          if (rc[0] == red(c) && flip_axis(rc[1], channel_levels) == blue(c)) {
            overlay_img.set(x,y, color(255,0,0,200))   
            count++;

          }          
          break;
        case 2:          
          if (rc[0] == green(c) && flip_axis(rc[1], channel_levels) == blue(c)) {
            overlay_img.set(x,y, color(255,0,0,200))  
            count++;

          }          
          break;          
      }
    }
  }
  
  print("Count: " + count)
  
  overlay_img.updatePixels();

}

function create_histos_2d(image) {
  
  const n = channel_levels * channel_levels
  
  let h_rg = new Array(n);  
  let h_rb = new Array(n);  
  let h_gb = new Array(n);  
  
  for (i = 0; i <= n; i++) {
    h_rg[i] = 0
    h_rb[i] = 0
    h_gb[i] = 0
  }  
    
  for (var x = 0; x < image.width; x+=1) {
    for (var y = 0; y < image.height; y+=1) {
      
      c = image.get(x,y)
      
      let r = red(c)
      let g = green(c)
      let b = blue(c)      
      
      h_rg[r + channel_levels * g]++
      h_rb[r + channel_levels * b]++
      h_gb[g + channel_levels * b]++      
    }
  }

  min_rg = get_min(h_rg)
  max_rg = get_max(h_rg)
  min_rb = get_min(h_rb)
  max_rb = get_max(h_rb)
  min_gb = get_min(h_gb)
  max_gb = get_max(h_gb)
    
  let h_rg_2d = createImage(channel_levels, channel_levels);
  let h_rb_2d = createImage(channel_levels, channel_levels);
  let h_gb_2d = createImage(channel_levels, channel_levels);
  
  h_rg_2d.loadPixels();
  h_rb_2d.loadPixels();
  h_gb_2d.loadPixels();

  for (let i = 0; i < channel_levels; i++) {
    for (let j = 0; j < channel_levels; j++) {
      
      //let v_rg = rescale(norm(h_rg[i + channel_levels * j], min_rg, max_rg));
      //let v_rb = rescale(norm(h_rb[i + channel_levels * j], min_rb, max_rb));
      //let v_gb = rescale(norm(h_gb[i + channel_levels * j], min_gb, max_gb));
      
      f = image.width * image.height;
      
      let v_rg = rescale((h_rg[i + channel_levels * j]) / f);
      let v_rb = rescale((h_rb[i + channel_levels * j]) / f);
      let v_gb = rescale((h_gb[i + channel_levels * j]) / f);
      
      
      h_rg_2d.set(i, flip_axis(j, channel_levels), color(v_rg,v_rg,v_rg));
      h_rb_2d.set(i, flip_axis(j, channel_levels), color(v_rb,v_rb,v_rb));
      h_gb_2d.set(i, flip_axis(j, channel_levels), color(v_gb,v_gb,v_gb));
    }
  }
  h_rg_2d.updatePixels();
  h_rb_2d.updatePixels();
  h_gb_2d.updatePixels();

  return [[h_rg_2d, h_rb_2d, h_gb_2d], [h_rg, h_rb, h_gb]]
}

function cursor_in_region(x,y,w,h) {  
  return mouseX >= x && mouseX < x + w && mouseY >= y && mouseY < y + h;
}
    
function position_in_region(x,y,r_x,r_y,r_w,r_h) {  
  return x >= r_x && x < r_x + r_w && y >= r_y && y < r_y + r_h;
}

function get_region_coords(x,y, r_x, r_y) {  
  return [x - r_x, y - r_y]  
}
function get_region_coords(x,y) {  
  return [mouseX - x, mouseY - y]  
}

function get_max(arr) {
    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        max = arr[len] > max ? arr[len] : max;
    }
    return max;
}

function get_min(arr) {
    let len = arr.length;
    let min = Infinity;

    while (len--) {
        min = arr[len] < min ? arr[len] : min;
    }
    return min;
}

function rescale(v) {
 return  sqrt(v) * scale_factor *  channel_levels;
}

function flip_axis(v, max_axis) {
  
  return max_axis - 1 - v 
  
}
