var particles = [];
var particleGravity;
var modeSwitch = true;
var currentPos;
var spawners = [];
var colorStart;
var speed;
var currentDistance;
var rainbow = false;
var gui = true;
var spawnerAddMode = false;
var GUIArr = [];
var customMode = false;
var customSpawners = [];
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.size = 12;
    this.fade = false;
    this.ageMax = lifeSpan.value();
    this.grav = createVector(random(-1, 1), random(-1, 1))
    this.col2 = createVector(color2r.value(), color2g.value(), color2b.value())
    particles.push(this);
    if (!rainbow) {
      this.col = createVector(color1r.value(), color1g.value(), color1b.value())
    } else {
      this.col = createVector(0, 100, 50)

    }
    let angle = Math.random() * Math.PI * 3;
    let dx = Math.cos(angle) * random(1, 2.5);
    let dy = Math.sin(angle) * random(1, 2.5);
    this.dir = createVector(dx, dy);
  }
  update() {
    this.size = map(this.age, 0, lifeSpan.value(), 15, 0);
    this.x += this.dir.x;
    this.y += this.dir.y;
    this.dir = p5.Vector.lerp(this.dir, particleGravity, 0.1);
    this.age += 1;
    if (!rainbow) {
      if (!this.fade) {
        this.col.lerp(this.col2.x, this.col2.y, this.col2.z, 0.03);
        //this.col.lerp(255, 255, 255, 0.03)
      } else {
        this.col.lerp(0, 0, 0, 0.03);
      }
      if (this.col.x > 230 && this.col.y < 30 && this.col.z < 30) {
        this.fade = true;
      }
    } else {
      colorMode(HSL);
      this.col.x += 1;
      //this.col.x = map(this.age, 0, this.ageMax - 20, 360, 0);
    }
  }
  show() {
    noStroke();
    fill(this.col.x, this.col.y, this.col.z);
    if (shape.value() == 1 || !shape.value()) {
      ellipse(this.x, this.y, this.size, this.size);
    } else if (shape.value() == 2) {
      rect(this.x, this.y, this.size, this.size);
    }
  }

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mouseClicked(canvasClick)
  particleGravity = createVector(0, -1);
  frameRate(60);
  createGUI();
  currentPos = createVector(width / 2, height / 2)
  spawners = generateSpawners(4);

}

function createGUI() {
  let space = 40;
  speed = createSlider(0, 10, 1, .1);
  GUIArr.push(speed);
  GUIArr.push(createP("Spawner Rotation Speed").position(0, space * 0).style("color", "white"))
  speed.position(0, space * 1);

  //First Color
  color1r = createSlider(0, 255, 255, 1);
  GUIArr.push(color1r)
  GUIArr.push(createP("First Color Red").position(0, space * 2).style("color", "white"))
  color1r.position(0, space * 3);

  color1g = createSlider(0, 255, 221, 1);
  GUIArr.push(color1g);
  GUIArr.push(createP("First Color Green").position(0, space * 4).style("color", "white"));
  color1g.position(0, space * 5);

  color1b = createSlider(0, 255, 0, 1);
  GUIArr.push(color1b);
  GUIArr.push(createP("First Color Blue").position(0, space * 6).style("color", "white"));
  color1b.position(0, space * 7);

  //Second Color
  color2r = createSlider(0, 255, 255, 1);
  GUIArr.push(color2r);
  GUIArr.push(createP("Second Color Red").position(0, space * 8).style("color", "white"))
  color2r.position(0, space * 9);

  color2g = createSlider(0, 255, 0, 1);
  GUIArr.push(color2g);
  GUIArr.push(createP("Second Color Green").position(0, space * 10).style("color", "white"));
  color2g.position(0, space * 11);

  color2b = createSlider(0, 255, 0, 1);
  GUIArr.push(color2b);
  GUIArr.push(createP("Second Color Blue").position(0, space * 12).style("color", "white"));
  color2b.position(0, space * 13);

  spawnerAmount = createSlider(0, 10, 4, 1);
  GUIArr.push(spawnerAmount);
  GUIArr.push(createP("Amount of Spawners").position(0, space * 14).style("color", "white"));
  spawnerAmount.position(0, space * 15);

  lifeSpan = createSlider(1, 300, 200, 1);
  GUIArr.push(lifeSpan);
  GUIArr.push(createP("Life Span of Particles").position(0, space * 16).style("color", "white"));
  lifeSpan.position(0, space * 17);


  spawnerDistance = createSlider(1, 500, 100, 1);
  GUIArr.push(spawnerDistance);
  GUIArr.push(createP("Radius of Spawners").position(0, space * 18).style("color", "white"));
  spawnerDistance.position(0, space * 19);

  rainbowBox = createCheckbox("Rainbow?", false);
  GUIArr.push(rainbowBox);
  rainbowBox.position(150, space * 2);
  rainbowBox.style("color", "white");
  rainbowBox.changed((function () {
    rainbow = !rainbow;
  }))

  shape = createRadio();
  GUIArr.push(shape);
  GUIArr.push(createP("Shape?").position(150, space * 3).style("color", "white"));
  shape.option("Circle", 1);
  shape.option("Sqaure", 2);
  shape.style("color", "white");
  shape.position(150, space * 4);


  randomizer = createButton("Randomize Values")
  GUIArr.push(randomizer);
  randomizer.position(150, space * 1);
  randomizer.mousePressed(randomizeValues)

  customPoints = createButton("Enable Custom Spawner Point Mode <br>(Click where you want a spawner)<br>The Green Point is the center")
  GUIArr.push(customPoints);
  customPoints.position(150, space * 5);
  customPoints.mousePressed(toggleCustomMode)


  clearCustomPoints = createButton("Clear Custom Points")
  GUIArr.push(clearCustomPoints);
  clearCustomPoints.position(150, space * 7);
  clearCustomPoints.mousePressed(function () {
    customSpawners = []
  })

  activateCustomSpawners = createCheckbox("Custom Point Mode")
  activateCustomSpawners.style("color", "white")
  GUIArr.push(activateCustomSpawners);
  activateCustomSpawners.position(150, space * 2.5);
  activateCustomSpawners.changed((function () {
    customMode = !customMode;
  }))

  guiToggle = createButton("Toggle GUI");
  guiToggle.position(width - 120, space * 0);
  guiToggle.mousePressed(toggleGUI);
  guiToggle.style("background-color", "rgba(0, 0, 0, .5)")
  guiToggle.style("outline", "none")
  guiToggle.style("color", "rgba(255,255,255,.5)");

}

function randomizeValues() {
  speed.value(random(1, 10))
  color1r.value(random(0, 255));
  color1g.value(random(0, 255));
  color1b.value(random(0, 255));
  color2r.value(random(0, 255));
  color2g.value(random(0, 255));
  color2b.value(random(0, 255));
  spawnerAmount.value(random(0, 10));
  lifeSpan.value(random(1, 300));
  spawnerDistance.value(random(1, 500));
}

function draw() {
  colorMode(RGB);
  background(30);
  if (!spawnerAddMode && !customMode) {
    for (i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].show();
      if (particles[i].age >= lifeSpan.value()) {
        particles.splice(i, 1);
      }
    }
    if (modeSwitch) {
      currentPos.x = width / 2;
      currentPos.y = height / 2;
      //new Particle(currentPos.x, currentPos.y);
      for (i = 0; i < spawners.length; i++) {
        new Particle(spawners[i].x, spawners[i].y);
        spawners[i] = pointRotate(width / 2, height / 2, spawners[i].x, spawners[i].y, speed.value());
      }
    } else {
      currentPos = p5.Vector.lerp(currentPos, createVector(mouseX, mouseY), 0.1);
      new Particle(currentPos.x, currentPos.y);
    }

    if (spawnerAmount.value() != spawners.length) {
      spawners = generateSpawners(spawnerAmount.value());
    }
    if (spawnerDistance.value() != currentDistance) {
      spawners = generateSpawners(spawnerAmount.value())
    }
  } else if ( customMode) {
    for (i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].show();
      if (particles[i].age >= lifeSpan.value()) {
        particles.splice(i, 1);
      }
    }
    if (modeSwitch) {
      currentPos.x = width / 2;
      currentPos.y = height / 2;
      //new Particle(currentPos.x, currentPos.y);
      for (i = 0; i < customSpawners.length; i++) {
        new Particle(customSpawners[i].x, customSpawners[i].y);
        customSpawners[i] = pointRotate(width / 2, height / 2, customSpawners[i].x, customSpawners[i].y, speed.value());
      }
    } else {
      currentPos = p5.Vector.lerp(currentPos, createVector(mouseX, mouseY), 0.1);
      new Particle(currentPos.x, currentPos.y);
    }


  } else {
    fill(0,0,255);
    ellipse(width/2, height/2, 10, 10)
    for (let i = 0; i < customSpawners.length; i++) {
      fill(255);
      ellipse(customSpawners[i].x, customSpawners[i].y, 10, 10);
    }


  }


}

function toggleCustomMode() {
  spawnerAddMode = !spawnerAddMode;
}

function generateSpawners(amount) {
  let start = 0;
  let temp = []
  currentDistance = spawnerDistance.value();
  let currentPoint = createVector(width / 2 - spawnerDistance.value(), height / 2);
  for (let i = 0; i < amount; i++) {
    temp.push(currentPoint);
    currentPoint = pointRotate(width / 2, height / 2, currentPoint.x, currentPoint.y, 360 / amount)
  }
  return temp;
}

function canvasClick() {
  modeSwitch = !modeSwitch;
  if (spawnerAddMode) {
    customSpawners.push(createVector(mouseX, mouseY))
  }
  //disable mouseSwitching code above, and enable code below to make it so when you click,
  //flame goes towards where you last clicked.
  // angle = angleFromPoints(width / 2, height / 2, mouseX, mouseY);
  // let dx = Math.cos(angle)
  // let dy = Math.sin(angle)
  // particleGravity = createVector(dx, dy);


}

function toggleGUI() {
  if (gui) {
    gui = false;
    for (i = 0; i < GUIArr.length; i++) {
      GUIArr[i].style("display", "none");

    }
  } else {
    gui = true;
    for (i = 0; i < GUIArr.length; i++) {
      GUIArr[i].style("display", "inline-block");

    }

  }
}

function pointRotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return createVector(nx, ny);
}

function angleFromPoints(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx);
  return theta;
}