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
    this.id = dataPoint.id;
    this.attr = [dataPoint.a, dataPoint.b, dataPoint.c];
    this.next = [];
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

let fakeDataPoints = [];
let points = [];
getFakeData(100);
fakeDataPoints.forEach(dataPoint => {
  points.push(new Point(dataPoint));
});
let current = points[randIntBetween(0, points.length - 1)];
let coming = null;
let paths = [];
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
