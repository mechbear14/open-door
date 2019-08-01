const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis sed assumenda dolorum tenetur qui numquam quod excepturi totam at distinctio temporibus itaque, vel explicabo praesentium recusandae possimus soluta vitae impedit.";

class DataPoint {
  constructor(id, a, b, c, title, text) {
    this.id = id;
    this.a = a;
    this.b = b;
    this.c = c;
    this.title = title;
    this.text = text;
  }
}

class Point {
  constructor(dataPoint) {
    this.dataPoint = dataPoint;
    this.id = dataPoint.id;
    this.attr = [dataPoint.a, dataPoint.b, dataPoint.c];
    this.next = [];
  }

  copy() {
    return new Point(this.dataPoint);
  }

  render(face) {
    let door = document.createElement("div");
    door.classList.add("door");
    door.dataset.id = this.id;
    door.textContent = this.id;
    let balloon = document.createElement("div");
    balloon.classList.add("balloon");
    let title = document.createElement("h1");
    title.textContent = this.dataPoint.title;
    let text = document.createElement("p");
    text.textContent = this.dataPoint.text;
    balloon.append(title);
    balloon.append(text);
    face.append(door);
    face.append(balloon);
  }
}

function randIntBetween(a, b) {
  let coef = Math.random();
  return Math.round(a * coef + b * (1 - coef));
}

function getFakeData(n) {
  for (let i = 0; i < n; i++) {
    fakeDataPoints.push(
      new DataPoint(
        i,
        randIntBetween(0, 100),
        randIntBetween(0, 100),
        randIntBetween(0, 100),
        `Bear ${i}`,
        LOREM
      )
    );
  }
}

/**
 * Game globals
 */
let fakeDataPoints = [];
let points = [];
let current;
let coming;
let paths = [];

/**
 * UI globals
 */
let world;
let front;
let back;

/**
 * Initialise game
 */
getFakeData(100);
fakeDataPoints.forEach(dataPoint => {
  points.push(new Point(dataPoint));
});
for (let i = 0; i < points[0].attr.length; i++) {
  let arr = points.slice();
  paths.push(arr.sort((p1, p2) => p1.attr[i] - p2.attr[i]));
}
for (let i = 0; i < paths.length; i++) {
  for (let j = 0; j < paths[i].length - 1; j++) {
    points[paths[i][j].id].next.push(points[paths[i][j + 1].id]);
    points[paths[i][j + 1].id].next.push(points[paths[i][j].id]);
  }
}
current = points[randIntBetween(0, points.length - 1)];

/**
 * Initialise UI
 */
world = document.getElementById("world");
front = Array.from(document.getElementsByClassName("front"))[0];
back = Array.from(document.getElementsByClassName("back"))[0];
current.next.forEach(point => {
  point.render(front);
});
let frontDoors = Array.from(document.querySelectorAll(".front .door"));
frontDoors.forEach(door => {
  door.addEventListener("click", openDoor);
});

/**
 * Events
 */
function openDoor(event) {
  let opening = event.target;
  let pointId = opening.dataset.id;
  let frontDoors = Array.from(document.querySelectorAll(".front .door"));
  frontDoors.forEach(door => {
    door.removeEventListener("click", openDoor);
  });
  let balloons = Array.from(document.getElementsByClassName("balloon"));
  console.log(balloons);
  balloons.forEach(balloon => {
    balloon.style.display = "none";
  });
  coming = points[pointId];
  coming.next.forEach(point => {
    point.render(back);
  });
  opening.classList.add("fall");
  opening.addEventListener("transitionend", moveForward);
}

function moveForward(event) {
  let opening = event.target;
  opening.removeEventListener("transitionend", moveForward);
  front.classList.add("out");
  back.classList.add("front");
  back.classList.remove("back");
  back.addEventListener("transitionend", newRound);
}

function newRound() {
  back.removeEventListener("transitionend", newRound);
  let out = Array.from(document.getElementsByClassName("out"))[0];
  world.removeChild(out);
  front = Array.from(document.getElementsByClassName("front"))[0];
  back = document.createElement("div");
  back.classList.add("back");
  back.classList.add("face");
  world.append(back);
  let frontDoors = Array.from(document.querySelectorAll(".front .door"));
  frontDoors.forEach(door => {
    door.addEventListener("click", openDoor);
  });
  current = coming.copy();
}
