var lastPoints, finalCanv, gen

var AbstractGen = function () {
    this.color1 = [255, 0, 0];
    this.color2 = [0, 255, 0];
    this.color3 = [0, 0, 255];
    this.colorChange = 10;
    this.weirdMode = false;
    this.generateImage = function () {
            loop();
        },
        this.saveImage = function () {
            saveCanvas("Colors", "jpg");
        }
};
window.onload = function () {
    var gui = new dat.GUI();

    gui.addColor(gen, 'color1');
    gui.addColor(gen, 'color2');
    gui.addColor(gen, 'color3');
    gui.add(gen, 'colorChange', 0, 255);
    gui.add(gen, 'generateImage');
    gui.add(gen, 'saveImage')
    gui.add(gen, 'weirdMode')

};

function setup() {
    gen = new AbstractGen();
    createCanvas(windowWidth, windowHeight);
    background(255);
    /*text config*/
    textAlign(CENTER)
    textSize(200);
    stroke(254);
    strokeWeight(2);
    fill(0, 0);
    noStroke();
    lastPoints = [];

    noLoop()

    finalCanv = createGraphics(width, height);
    finalCanv.noStroke();


}

function draw() {
    tempPoints = [];
    let diff = gen.colorChange;
    if (lastPoints.length == 0) {
      image(finalCanv, 0, 0)
    }
    for (let p of lastPoints) {
      for (let i = 0; i < 3; i++) {
         if (gen.weirdMode && random(10) < 2) {continue};
        let newPoint = p.copy()
        let parentColor = get(p.x, p.y);
        newPoint.x += floor(random(-1, 2));
        newPoint.y += floor(random(-1, 2));
        let col = get(newPoint.x, newPoint.y);
        if (col[0] == 255 && col[1] == 255 && col[2] == 255) {
          tempPoints.push(newPoint);
          let col = color(parentColor[0] + random(-diff, diff), parentColor[1] + random(-diff, diff), parentColor[2] + random(-diff, diff))
          fill(col)
          rect(newPoint.x, newPoint.y, 1, 1);
          finalCanv.fill(col)
          finalCanv.ellipse(newPoint.x, newPoint.y, random(3, 3), random(3, 3));
        }
      }
    }
    lastPoints = tempPoints
}

function mouseDragged() {
    //Draw Particle Mode
    lastPoints.push(createVector(mouseX, mouseY));
    colors = [gen.color1, gen.color2, gen.color3];
    push()
    stroke(random(colors));
    point(mouseX, mouseY, 1, 1);
    pop()

}
