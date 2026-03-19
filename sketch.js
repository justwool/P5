const PAPER_GRAIN = 45000;
const PRESETS = {
  a: {
    name: 'Blue / Rose Tendril',
    paper: [244, 240, 233],
    noiseTint: [225, 220, 210, 16],
    frame: {
      center: [368, 284],
      w: 358,
      h: 215,
      angle: -0.53,
    },
    cells: [
      {
        points: [
          [162, 65],
          [354, 175],
          [324, 228],
          [274, 208],
          [225, 250],
          [190, 244],
          [89, 178],
        ],
        fill: ['cloud', [80, 180, 255], [210, 232, 255]],
        stroke: 3.2,
      },
      {
        points: [
          [262, 217],
          [318, 193],
          [387, 230],
          [384, 348],
          [300, 320],
          [236, 252],
        ],
        fill: ['lines', [20, 145, 240], [20, 145, 240], 17, 0],
        stroke: 3.2,
      },
      {
        points: [
          [322, 196],
          [368, 180],
          [425, 206],
          [408, 255],
          [387, 230],
        ],
        fill: ['hatch', [230, 90, 125], [185, 36, 56], 16, -0.55],
        stroke: 3.2,
      },
      {
        points: [
          [355, 175],
          [394, 173],
          [434, 196],
          [425, 206],
          [384, 191],
        ],
        fill: ['grid', [238, 182, 182], [148, 70, 70], 12],
        stroke: 3.2,
      },
      {
        points: [
          [188, 241],
          [225, 251],
          [207, 280],
          [174, 278],
          [161, 252],
        ],
        fill: ['cross', [230, 188, 184], [170, 122, 117], 12],
        stroke: 3.2,
      },
      {
        points: [
          [301, 318],
          [384, 346],
          [442, 501],
          [414, 688],
          [318, 757],
          [255, 650],
          [261, 560],
          [213, 478],
          [175, 370],
          [207, 280],
          [236, 252],
        ],
        fill: ['bands', [210, 223, 248], [65, 145, 230], 20, -0.42],
        stroke: 3.4,
      },
      {
        points: [
          [442, 501],
          [573, 501],
          [654, 530],
          [703, 592],
          [700, 716],
          [633, 808],
          [551, 879],
          [478, 828],
          [414, 688],
        ],
        fill: ['microgrid', [235, 122, 128], [160, 69, 86], 13],
        stroke: 3.4,
      },
      {
        points: [
          [319, 758],
          [478, 829],
          [431, 930],
          [367, 1046],
          [307, 986],
          [278, 892],
        ],
        fill: ['bands', [31, 160, 249], [12, 110, 211], 18, -0.42],
        stroke: 3.4,
      },
      {
        points: [
          [608, 1147],
          [628, 1140],
          [649, 1148],
          [657, 1174],
          [640, 1192],
          [607, 1186],
          [596, 1166],
        ],
        fill: ['ripple', [120, 163, 255], [112, 84, 164], 13],
        stroke: 3.2,
      },
    ],
    knots: [
      [188, 241, 8],
      [355, 175, 8],
      [387, 230, 8],
      [442, 501, 9],
      [319, 758, 9],
      [649, 1148, 8],
    ],
    filaments: [
      {
        start: [161, 252],
        c1: [122, 278],
        c2: [86, 270],
        end: [34, 278],
      },
      {
        start: [274, 208],
        c1: [216, 174],
        c2: [165, 173],
        end: [131, 195],
      },
      {
        start: [442, 501],
        c1: [521, 590],
        c2: [655, 668],
        end: [627, 980],
      },
      {
        start: [319, 758],
        c1: [362, 839],
        c2: [289, 1042],
        end: [320, 1173],
      },
      {
        start: [319, 758],
        c1: [398, 828],
        c2: [474, 972],
        end: [520, 1161],
      },
      {
        start: [649, 1148],
        c1: [682, 1159],
        c2: [702, 1187],
        end: [719, 1198],
      },
    ],
  },
  b: {
    name: 'Amber / Violet Cluster',
    paper: [244, 236, 242],
    noiseTint: [220, 205, 225, 18],
    frame: {
      center: [392, 410],
      w: 430,
      h: 365,
      angle: -0.58,
    },
    cells: [
      {
        points: [
          [97, 255],
          [251, 177],
          [329, 226],
          [324, 420],
          [236, 545],
          [118, 462],
        ],
        fill: ['hatch', [255, 177, 25], [214, 124, 0], 19, -0.04],
        stroke: 3.4,
      },
      {
        points: [
          [251, 177],
          [478, 74],
          [560, 195],
          [479, 328],
          [343, 339],
          [329, 226],
        ],
        fill: ['rings', [72, 49, 149], [48, 30, 103], 18],
        stroke: 3.4,
      },
      {
        points: [
          [478, 74],
          [592, 230],
          [510, 274],
          [479, 328],
          [560, 195],
        ],
        fill: ['cloud', [96, 63, 170], [40, 18, 103]],
        stroke: 3.2,
      },
      {
        points: [
          [329, 226],
          [343, 339],
          [291, 415],
          [239, 376],
          [241, 284],
        ],
        fill: ['ripple', [128, 175, 26], [82, 121, 15], 14],
        stroke: 3.2,
      },
      {
        points: [
          [479, 328],
          [590, 230],
          [622, 455],
          [500, 562],
          [343, 339],
        ],
        fill: ['rings', [255, 188, 15], [216, 147, 0], 21],
        stroke: 3.4,
      },
      {
        points: [
          [343, 339],
          [500, 562],
          [379, 664],
          [291, 415],
        ],
        fill: ['rings', [250, 201, 23], [199, 148, 2], 20],
        stroke: 3.2,
      },
      {
        points: [
          [500, 562],
          [624, 456],
          [674, 534],
          [544, 612],
        ],
        fill: ['bands', [226, 194, 31], [168, 135, 5], 16, -0.08],
        stroke: 3.2,
      },
      {
        points: [
          [291, 415],
          [379, 664],
          [255, 745],
          [174, 606],
          [236, 545],
        ],
        fill: ['contour', [239, 197, 17], [167, 131, 1], 18],
        stroke: 3.2,
      },
      {
        points: [
          [379, 664],
          [444, 698],
          [391, 740],
          [339, 719],
        ],
        fill: ['bands', [67, 86, 189], [49, 57, 143], 10, -0.55],
        stroke: 3.2,
      },
      {
        points: [
          [239, 376],
          [291, 415],
          [255, 542],
          [236, 545],
        ],
        fill: ['rings', [223, 184, 17], [171, 128, 0], 18],
        stroke: 3.2,
      },
    ],
    knots: [
      [251, 177, 9],
      [329, 226, 9],
      [343, 339, 9],
      [291, 415, 9],
      [500, 562, 9],
      [379, 664, 9],
    ],
    filaments: [
      {
        start: [97, 255],
        c1: [61, 222],
        c2: [11, 233],
        end: [-18, 214],
      },
      {
        start: [251, 177],
        c1: [197, 218],
        c2: [105, 226],
        end: [41, 204],
      },
      {
        start: [560, 195],
        c1: [601, 132],
        c2: [699, 68],
        end: [838, 101],
      },
      {
        start: [291, 415],
        c1: [229, 490],
        c2: [78, 624],
        end: [93, 908],
      },
      {
        start: [379, 664],
        c1: [365, 740],
        c2: [430, 914],
        end: [809, 889],
      },
    ],
  },
};

let activePreset = 'a';
let paperBuffer;

function setup() {
  const canvas = createCanvas(820, 1220);
  canvas.parent('canvas-host');
  pixelDensity(2);
  noLoop();
  wireControls();
  buildPaperBuffer();
}

function draw() {
  renderArtwork(PRESETS[activePreset]);
}

function wireControls() {
  select('#presetA').mousePressed(() => switchPreset('a'));
  select('#presetB').mousePressed(() => switchPreset('b'));
  select('#rerender').mousePressed(() => redraw());
  select('#saveBtn').mousePressed(() => saveCanvas(`organic-${activePreset}`, 'png'));
}

function switchPreset(name) {
  activePreset = name;
  buildPaperBuffer();
  redraw();
}

function keyPressed() {
  if (key === '1') {
    switchPreset('a');
  } else if (key === '2') {
    switchPreset('b');
  } else if (key === 's' || key === 'S') {
    saveCanvas(`organic-${activePreset}`, 'png');
  }
}

function buildPaperBuffer() {
  paperBuffer = createGraphics(width, height);
  paperBuffer.pixelDensity(1);
  paperBuffer.background(...PRESETS[activePreset].paper);
  paperBuffer.noStroke();
  const tint = PRESETS[activePreset].noiseTint;

  for (let i = 0; i < PAPER_GRAIN; i += 1) {
    paperBuffer.fill(tint[0] + random(-8, 8), tint[1] + random(-8, 8), tint[2] + random(-8, 8), tint[3]);
    const x = random(width);
    const y = random(height);
    const s = random(0.6, 1.8);
    paperBuffer.circle(x, y, s);
  }
}

function renderArtwork(preset) {
  randomSeed(17);
  noiseSeed(17);
  image(paperBuffer, 0, 0);

  for (const cell of preset.cells) {
    drawCell(cell);
  }

  for (const knot of preset.knots) {
    drawKnot(knot[0], knot[1], knot[2]);
  }

  for (const filament of preset.filaments) {
    drawFilament(filament);
  }

  addVignette();
}

function drawCell(cell) {
  const pts = cell.points.map(([x, y]) => createVector(x, y));
  drawPatternFill(pts, cell.fill);

  stroke(16, 16, 16, 220);
  strokeWeight(cell.stroke || 3.2);
  strokeJoin(ROUND);
  noFill();
  beginShape();
  for (const p of pts) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function drawPatternFill(points, fillSpec) {
  drawingContext.save();
  polygonClip(points);
  noStroke();

  const bounds = polygonBounds(points);
  const [mode, c1, c2, spacing = 18, angle = 0] = fillSpec;
  const baseColor = lerpColor(color(...c1), color(...c2), 0.38);

  backgroundWash(bounds, c1, c2);

  if (mode === 'hatch' || mode === 'bands') {
    drawParallelLines(bounds, color(...c1), color(...c2), spacing, angle, mode === 'bands' ? 2.2 : 3.1);
  } else if (mode === 'lines') {
    drawParallelLines(bounds, color(...c1), color(...c2), spacing, HALF_PI, 2.6);
  } else if (mode === 'grid') {
    drawGrid(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'microgrid') {
    drawMicroGrid(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'cross') {
    drawCrossContour(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'rings') {
    drawRings(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'contour') {
    drawContourFan(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'ripple') {
    drawRipple(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'cloud') {
    drawCloud(bounds, color(...c1), color(...c2));
  }

  subtleSpeckles(bounds, baseColor);
  drawingContext.restore();
}

function polygonClip(points) {
  drawingContext.beginPath();
  drawingContext.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    drawingContext.lineTo(points[i].x, points[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();
}

function polygonBounds(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
}

function backgroundWash(bounds, c1, c2) {
  for (let y = bounds.y; y <= bounds.y + bounds.h; y += 3) {
    const t = map(y, bounds.y, bounds.y + bounds.h, 0, 1);
    const col = lerpColor(color(...c1), color(...c2), constrain(t * 0.7 + noise(y * 0.01) * 0.25, 0, 1));
    stroke(red(col), green(col), blue(col), 42);
    line(bounds.x - 10, y, bounds.x + bounds.w + 10, y);
  }
}

function drawParallelLines(bounds, c1, c2, spacing, angle, weight) {
  push();
  translate(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
  rotate(angle);
  const span = max(bounds.w, bounds.h) * 1.8;
  const breadth = max(bounds.w, bounds.h) * 2.4;
  for (let i = -breadth; i < breadth; i += spacing) {
    const t = map(i, -breadth, breadth, 0, 1);
    const col = lerpColor(c1, c2, constrain(t * 0.8, 0, 1));
    stroke(red(col), green(col), blue(col), 110);
    strokeWeight(weight);
    line(i, -span, i, span);
  }
  pop();
}

function drawGrid(bounds, c1, c2, spacing) {
  strokeWeight(2);
  for (let x = bounds.x - spacing; x <= bounds.x + bounds.w + spacing; x += spacing) {
    const t = map(x, bounds.x, bounds.x + bounds.w, 0, 1);
    const col = lerpColor(c1, c2, constrain(t, 0, 1));
    stroke(red(col), green(col), blue(col), 140);
    line(x, bounds.y - spacing, x, bounds.y + bounds.h + spacing);
  }
  for (let y = bounds.y - spacing; y <= bounds.y + bounds.h + spacing; y += spacing) {
    const t = map(y, bounds.y, bounds.y + bounds.h, 0, 1);
    const col = lerpColor(c2, c1, constrain(t, 0, 1));
    stroke(red(col), green(col), blue(col), 110);
    line(bounds.x - spacing, y, bounds.x + bounds.w + spacing, y);
  }
}

function drawMicroGrid(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(0.9);
  for (let x = bounds.x; x <= bounds.x + bounds.w; x += spacing) {
    for (let y = bounds.y; y <= bounds.y + bounds.h; y += spacing) {
      const col = lerpColor(c1, c2, noise(x * 0.01, y * 0.01));
      stroke(red(col), green(col), blue(col), 110);
      rect(x, y, spacing, spacing);
      arc(x + spacing * 0.5, y + spacing * 0.5, spacing * 0.82, spacing * 0.82, 0, PI);
      arc(x + spacing * 0.5, y + spacing * 0.5, spacing * 0.82, spacing * 0.82, PI, TWO_PI);
    }
  }
}

function drawCrossContour(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.4);
  for (let i = 0; i < 30; i += 1) {
    const inset = i * (spacing * 0.16);
    const col = lerpColor(c1, c2, i / 29);
    stroke(red(col), green(col), blue(col), 110);
    rect(bounds.x + inset, bounds.y + inset, bounds.w - inset * 2, bounds.h - inset * 2, 18);
  }
  drawParallelLines(bounds, c2, c1, spacing, PI / 4, 1.4);
}

function drawRings(bounds, c1, c2, spacing) {
  noFill();
  const anchors = [
    createVector(bounds.x + bounds.w * 0.63, bounds.y + bounds.h * 0.68),
    createVector(bounds.x + bounds.w * 0.25, bounds.y + bounds.h * 0.25),
    createVector(bounds.x + bounds.w * 0.82, bounds.y + bounds.h * 0.28),
  ];
  for (const anchor of anchors) {
    for (let r = 4; r < max(bounds.w, bounds.h) * 0.72; r += spacing * 0.18) {
      const t = constrain(r / (max(bounds.w, bounds.h) * 0.72), 0, 1);
      const col = lerpColor(c1, c2, t);
      stroke(red(col), green(col), blue(col), 100);
      strokeWeight(r < 8 ? 2.6 : 0.9);
      circle(anchor.x, anchor.y, r * 2);
    }
  }
}

function drawContourFan(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.2);
  const ox = bounds.x + bounds.w * 0.52;
  const oy = bounds.y + bounds.h * 1.1;
  for (let r = 12; r < bounds.h * 2; r += spacing) {
    const t = map(r, 12, bounds.h * 2, 0, 1);
    const col = lerpColor(c1, c2, t);
    stroke(red(col), green(col), blue(col), 120);
    arc(ox, oy, r * 1.6, r, PI, TWO_PI);
  }
}

function drawRipple(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.1);
  for (let y = bounds.y; y < bounds.y + bounds.h; y += 3) {
    beginShape();
    for (let x = bounds.x; x <= bounds.x + bounds.w; x += 5) {
      const wave = sin(x * 0.03 + y * 0.02) * spacing * 0.24;
      const t = map(y, bounds.y, bounds.y + bounds.h, 0, 1);
      const col = lerpColor(c1, c2, t);
      stroke(red(col), green(col), blue(col), 120);
      vertex(x, y + wave);
    }
    endShape();
  }
}

function drawCloud(bounds, c1, c2) {
  noStroke();
  for (let i = 0; i < 160; i += 1) {
    const x = random(bounds.x, bounds.x + bounds.w);
    const y = random(bounds.y, bounds.y + bounds.h);
    const size = random(36, 120);
    const col = lerpColor(c1, c2, random());
    fill(red(col), green(col), blue(col), 18);
    ellipse(x, y, size * random(0.6, 1.4), size * random(0.6, 1.3));
  }
}

function subtleSpeckles(bounds, baseColor) {
  noStroke();
  for (let i = 0; i < 1000; i += 1) {
    const x = random(bounds.x, bounds.x + bounds.w);
    const y = random(bounds.y, bounds.y + bounds.h);
    fill(red(baseColor), green(baseColor), blue(baseColor), random(8, 20));
    circle(x, y, random(0.4, 1.4));
  }
}

function drawKnot(x, y, size) {
  noStroke();
  fill(0);
  push();
  translate(x, y);
  beginShape();
  vertex(-size, 0);
  bezierVertex(-size * 0.25, -size * 0.65, size * 0.25, -size * 0.65, size, 0);
  bezierVertex(size * 0.25, size * 0.65, -size * 0.25, size * 0.65, -size, 0);
  endShape(CLOSE);
  pop();
}

function drawFilament(filament) {
  noFill();
  stroke(12, 12, 12, 240);
  strokeWeight(2.25);
  bezier(
    filament.start[0],
    filament.start[1],
    filament.c1[0],
    filament.c1[1],
    filament.c2[0],
    filament.c2[1],
    filament.end[0],
    filament.end[1],
  );
}

function addVignette() {
  noFill();
  for (let i = 0; i < 18; i += 1) {
    stroke(120, 96, 72, 5);
    strokeWeight(22);
    rect(i * 4, i * 4, width - i * 8, height - i * 8, 30);
  }
}
