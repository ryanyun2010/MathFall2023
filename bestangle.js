const EnviormentalValues = {
    "GravitationalConstant":9.80665,
    "Wind":[0,0]
}
// 1 pixel = 1 meter
// 1 frame = 1 second
var ease = 0;
var ease2 = 0;
var x = 500;
let canvas;
let ctx;
var angle = Math.PI/7 + Math.PI/100;
var trace1 = {
    x: [],
    y: [],
    mode: 'lines+markers',
    type: 'scatter',
    name: '5 degree error',
  };
  var trace2 = {
    x: [],
    y: [],
    mode: 'lines+markers',
    type: 'scatter',
    name: '1 degree error',
  };
  var layout = {
    legend: {
      y: 0.5,
      yref: 'paper',
      font: {
        family: 'Arial, sans-serif',
        size: 20,
        color: 'grey',
      }
    },
    xaxis: {
        title: {
          text: 'angle',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        range: [-Math.PI, Math.PI]
      },
      yaxis: {
        title: {
          text: 'Percentage that hit',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        // range: [0,50]
    },
    title:'Ease of Shot based on angle'
  };


  Plotly.newPlot('myDiv', [trace1,trace2],layout);
  

class Projectile {
    constructor (x,y,s,v,direction,c,ease,type){
        this.x = x;
        this.type = type;
        this.startX = x;
        this.y = y;
        this.startY = y;
        this.v = v;
        this.s = s;
        this.c = c;
        this.t = 0;
        this.direction = direction;
        this.lifespan = 300;
        this.ease = ease;
    }
    move(){



        this.x = this.startX + (this.v * Math.cos(this.direction) * this.t);
        this.y = this.startY + ((this.v * Math.sin(this.direction) * this.t) - EnviormentalValues.GravitationalConstant/2 * this.t * this.t);

    }
    draw(){
        
        // fill(this.c);
        // push();
        // translate(0,800);
        // circle(this.x,-this.y,this.s);
        // pop();
        ctx.fillStyle = this.c;
        // ctx.beginPath();
        // ctx.arc(this.x,800-this.y,this.s,0,Math.PI * 2);
        // ctx.fill();
        ctx.fillRect(this.x,800-this.y,this.s,this.s);
    }
    update(){
        if(this.type == 1){
            if(this.x > 1425){
                this.dead = true;
            }
        }
        if(this.type == 2){
            if(this.x < 1500){

                this.dead = true;
            }
        }
        if(this.type == 1){
            if(this.x < 0){

                this.dead = true;
            }
        }
        if(this.type == 2){
            if(this.x > 2950){

                this.dead = true;
            }
        }
        this.lifespan -= 0.1;
        if(this.y < 0){
            this.dead = true;
        }
        if(this.lifespan < 1){
this.dead = true;
        }
        this.t += 0.1;
        for(var enemy of enemies){
            if(this.x > enemy.x && this.x < enemy.x + enemy.s && 800-this.y > enemy.y && 800-this.y < enemy.y + enemy.s){
                // enemy.hp --;
                if(this.dead){}else{
                this.dead = true;
                
                if(this.type == 1){ease+= 1;}else{ease2+=1;}
                }

            }
        this.move();
        this.draw();
        }
    }
}
class Tracer extends Projectile{
    constructor(x,y,s,v,direction,c){
        super(x,y,s,v,direction,c);
    }
    update(){
        this.lifespan -= 7/60;
        if(this.lifespan < 1){
            this.dead = true;
        }
        this.t += 1.5;
        this.move();
        this.draw();
    }
}

class Enemy{
    constructor(x,y,s,hp){
        this.x = x;
        this.y = y;
        this.s = s;
        this.hp = hp;
    }
    draw(){
        fill("red");
        rect(this.x,this.y,this.s,this.s)
        if(this.hp < 1){
            this.dead = true;
        }
    }
}
let projectiles = [];
let enemies = [];
function setup(){
    createCanvas(2950,800);
    enemies.push(new Enemy(400,250,50,100));
    enemies.push(new Enemy(400 + 1525,250,50,100));
    canvas = document.getElementById("defaultCanvas0");
    ctx = canvas.getContext("2d");
}

function draw(){

    background(230); 
    let start = millis();
    for(var projectile of projectiles){
        // if(projectiles.indexOf(projectile) < 5000){continue;}
        if(projectile.dead){
            projectiles.splice(projectiles.indexOf(projectile),1);
        }
        projectile.update();
        
    }
    
    let end = millis();
    let elapsed = end - start;
    // console.log("This took: " + elapsed + "ms. to draw "+ projectiles.length +" rectangles") 
    if(projectiles.length == 1){
    console.log(projectiles[0]);
    }
    for(var enemy of enemies){
        enemy.draw();
    }
    fill("white");
    rect(50,x,50,50);
    rect(50 + 1525,x,50,50);
    fill("black");
    rect(1425,0,100,800)
    // rect(50,400,50,50);
    noStroke();
    for(var i = 0; i < 200; i++){
        // projectiles.push(new Tracer(75,275,20,i,Math.atan2(mouseX - 75,mouseY - 375) - Math.PI/2, "lightgrey"))
    }
    // projectiles.push(new Tracer(75,375,20,20 + Math.hypot(mouseX - 75, mouseY - 375)/6,Math.atan2(mouseX - 75,mouseY - 375) - Math.PI/2, "lightgrey"))
    fill("white");
    textSize(20);
    for(var i = projectiles.length - 1; i > -1; i--){
        proj = projectiles[i];
        if(proj instanceof Tracer){
            text("Angle: " + proj.direction * 180/Math.PI,100,50);
            return;
        }
    }

            // text("Ease: " + ease,100,50);
            // text("Ease: " + ease2,100 + 1525,50);

            if(projectiles.length == 0){
                next();
            }
    // console.log(trace1);
    fill("black");
    textSize(30);
    text("Optimal Angle: " + findOptimal(trace1)[0],50,50);
    text("Optimal Angle: " + findOptimal(trace2)[0],1575,50);
}

function next(){
    // velocity over 50 is correlated with decreased ease
    // angle over 75 is correlated with decreased ease
    if(x!=780){
    trace1.x.push(angle);
    trace2.x.push(angle);
    trace1.y.push(ease/(5600))
    trace2.y.push(ease2/(5600))
    Plotly.newPlot('myDiv', [trace1,trace2],layout);
    }
    // x-= 10;
    ease = 0;
    ease2 = 0;
    angle += Math.PI/400;

    for(var i = 50; i < 150; i+=0.5){
        for(var j = angle - Math.PI/36; j < angle + Math.PI/36; j+= Math.PI/500){
            projectiles.push(new Projectile(75,800-x - 25,1,i,j, "black", findEase(i,j),1))
        }
    }
    // console.log("BREAK");
    // console.log("BREAK");
    // console.log("BREAK");
    // console.log("BREAK");
    // console.log("BREAK");
    // console.log("BREAK");
//    var index = 0; 
    for(var i = 50; i < 150; i+=0.5){
        for(var j = angle - Math.PI/180; j < angle + Math.PI/180; j+= Math.PI/2500){
            // index++;
            // console.log(index);
            projectiles.push(new Projectile(75 + 1525,800-x - 25,1,i,j, "black", findEase(i,j),2))
        }
    }
    // index = 0;
    // projectiles.push(new Projectile(75,375,20,20 + Math.hypot(mouseX - 75, mouseY - 375)/6,Math.atan2(mouseX - 75,mouseY - 375) - Math.PI/2, "black"))

    // console.info("Projectile Shot: Angle: " + (Math.atan2(mouseX - 75,mouseY - 375) - Math.PI/2) * 180/Math.PI);
}   

function findEase(velocity,angle){
    // var ease = 100;
    // if(velocity > 50){
        // ease -= (velocity - 50) / 1.4;
    // }
    // if(angle > 75){
        // ease -= (angle - 75) * 2.5;
    // }
    // return (150 - velocity)/1000;
    return 1;
}

function findOptimal(trace){
    var largest = [0,0];
    // console.log(trace);
    for(var i = 0; i < trace.y.length; i++){
        if(trace.y[i] > largest[1]){
            largest[1] = trace.y[i];
            largest[0] = trace.x[i];
        }
    }
    if(trace == trace1){
        if(ease/5600 > largest[1]){
            largest = [angle,ease/5600];
        }
    }
    if(trace == trace2){
        if(ease2/5600 > largest[1]){
            largest = [angle,ease2/5600];
        }
    }
    return largest;
}