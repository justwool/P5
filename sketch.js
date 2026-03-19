const PAPER_GRAIN = 42000;
const PALETTES = [
  {
    paper: [244, 240, 233],
    tint: [224, 218, 207, 15],
    fills: [
      [[96, 186, 255], [203, 227, 255]],
      [[24, 146, 236], [15, 110, 206]],
      [[233, 96, 128], [177, 44, 72]],
      [[236, 187, 186], [169, 118, 121]],
    ],
  },
  {
    paper: [244, 236, 242],
    tint: [221, 207, 222, 17],
    fills: [
      [[86, 58, 164], [45, 26, 109]],
      [[255, 189, 20], [212, 140, 0]],
      [[144, 181, 37], [86, 120, 15]],
      [[81, 102, 200], [66, 61, 153]],
    ],
  },
];
const PATTERN_MODES = ['cloud', 'lines', 'bands', 'rings', 'grid', 'microgrid', 'ripple', 'contour'];

let seedValue = 1001;
let paperBuffer;
let composition;

function setup() {
  const canvas = createCanvas(820, 1220);
  canvas.parent('canvas-host');
  pixelDensity(2);
  noLoop();
  wireControls();
  generateComposition(int(random(100000, 999999)));
}

function draw() {
  if (!composition) {
    return;
  }

  randomSeed(composition.seed);
  noiseSeed(composition.seed);
  image(paperBuffer, 0, 0);

  for (const cell of composition.cells) {
    drawCell(cell);
  }

  for (const knot of composition.knots) {
    drawKnot(knot.x, knot.y, knot.size);
  }

  for (const filament of composition.filaments) {
    drawFilament(filament);
  }

  addVignette();
}

function wireControls() {
  select('#newSeed').mousePressed(() => generateComposition(int(random(100000, 999999))));
  select('#sameSeed').mousePressed(() => redraw());
  select('#saveBtn').mousePressed(() => saveCanvas(`organic-${seedValue}`, 'png'));
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    generateComposition(int(random(100000, 999999)));
  } else if (key === 'r' || key === 'R') {
    redraw();
  } else if (key === 's' || key === 'S') {
    saveCanvas(`organic-${seedValue}`, 'png');
  }
}

function generateComposition(seed) {
  seedValue = seed;
  randomSeed(seedValue);
  noiseSeed(seedValue);

  const palette = random(PALETTES);
  composition = buildComposition(seedValue, palette);
  buildPaperBuffer(palette, seedValue);
  select('#seedLabel').html(String(seedValue));
  redraw();
}

function buildPaperBuffer(palette, seed) {
  randomSeed(seed);
  paperBuffer = createGraphics(width, height);
  paperBuffer.pixelDensity(1);
  paperBuffer.background(...palette.paper);
  paperBuffer.noStroke();

  for (let i = 0; i < PAPER_GRAIN; i += 1) {
    paperBuffer.fill(
      palette.tint[0] + random(-8, 8),
      palette.tint[1] + random(-8, 8),
      palette.tint[2] + random(-8, 8),
      palette.tint[3],
    );
    paperBuffer.circle(random(width), random(height), random(0.5, 1.7));
  }
}

function buildComposition(seed, palette) {
  randomSeed(seed);
  noiseSeed(seed);

  const flip = random() < 0.5 ? -1 : 1;
  const center = createVector(random(270, 470), random(250, 410));
  const frameW = random(270, 390);
  const frameH = random(180, 290);
  const angle = random(-0.82, -0.32);
  const tailLength = random(220, 390);
  const compactness = random();
  const detachedOrb = compactness < 0.55;
  const bulbWeight = random(0.9, 1.35);

  const local = makeLocalSystem(center, angle, flip);
  const n = {};

  n.tl = local(-frameW * 0.5, -frameH * 0.5);
  n.tr = local(frameW * 0.5, -frameH * 0.5);
  n.br = local(frameW * 0.5, frameH * 0.5);
  n.bl = local(-frameW * 0.5, frameH * 0.5);
  n.leftA = local(-frameW * random(0.18, 0.28), frameH * 0.5);
  n.leftB = local(-frameW * random(0.05, 0.18), frameH * 0.18);
  n.topA = local(frameW * random(0.05, 0.16), -frameH * random(0.08, 0.18));
  n.topB = local(frameW * random(0.16, 0.26), -frameH * random(0.18, 0.3));
  n.rightA = local(frameW * 0.5, -frameH * random(0.02, 0.12));
  n.rightB = local(frameW * 0.5, frameH * random(0.22, 0.36));
  n.hub = local(frameW * random(0.02, 0.14), frameH * random(0.1, 0.2));
  n.lowHub = local(frameW * random(0.04, 0.18), frameH * 0.5);

  const spineA = local(frameW * random(0.1, 0.2), frameH * random(0.6, 0.74));
  const spineB = local(frameW * random(0.02, 0.16), frameH + random(120, 210));
  const bellyTop = local(frameW * random(0.42, 0.56), frameH * random(0.32, 0.48));
  const bellyMid = local(frameW * (0.82 + random(0.08, 0.22)) * bulbWeight, frameH + random(70, 170));
  const bellyLow = local(frameW * random(0.42, 0.62), frameH + random(230, 380));
  const tailA = local(frameW * random(0.16, 0.28), frameH + tailLength * 0.44);
  const tailB = local(frameW * random(0.08, 0.2), frameH + tailLength * 0.92);
  const orb = local(frameW * random(0.8, 1.12), frameH + tailLength + random(320, 470));

  const modes = shuffledModes();
  const colors = palette.fills.map((pair) => ({ a: pair[0], b: pair[1] }));
  const pickFill = (index) => {
    const pair = colors[index % colors.length];
    const mode = modes[index % modes.length];
    return [mode, pair.a, pair.b, random(10, 22), random(-0.8, 0.8)];
  };

  const cells = [];
  cells.push({
    points: [n.tl, n.tr, n.rightA, n.topB, n.topA, n.leftB, n.bl],
    fill: ['cloud', colors[0].a, colors[0].b, 18, 0],
    stroke: 3.2,
  });
  cells.push({
    points: [n.leftB, n.topA, n.hub, n.leftA],
    fill: pickFill(3),
    stroke: 3.1,
  });
  cells.push({
    points: [n.topA, n.topB, n.rightA, n.hub],
    fill: pickFill(0),
    stroke: 3.1,
  });
  cells.push({
    points: [n.topB, n.rightA, n.rightB, bellyTop, n.hub],
    fill: pickFill(2),
    stroke: 3.1,
  });
  cells.push({
    points: [n.leftA, n.hub, spineA, local(-frameW * 0.12, frameH + random(65, 130))],
    fill: pickFill(1),
    stroke: 3.15,
  });
  cells.push({
    points: [n.hub, n.rightB, bellyTop, bellyLow, tailA, spineB, spineA],
    fill: ['bands', colors[0].b, colors[0].a, random(15, 24), random(-0.7, -0.22)],
    stroke: 3.35,
  });
  cells.push({
    points: [n.rightB, bellyTop, bellyMid, bellyLow],
    fill: detachedOrb ? ['microgrid', colors[2].a, colors[2].b, random(10, 16), 0] : pickFill(4),
    stroke: 3.3,
  });
  cells.push({
    points: [spineB, tailA, tailB],
    fill: ['bands', colors[1].a, colors[1].b, random(14, 20), random(-0.6, -0.18)],
    stroke: 3.25,
  });

  if (compactness > 0.38) {
    cells.push({
      points: [local(-frameW * 0.28, frameH * 0.5), n.leftA, n.hub, local(-frameW * 0.02, frameH * 0.74), local(-frameW * 0.2, frameH * 0.88)],
      fill: pickFill(5),
      stroke: 3.05,
    });
  }

  if (detachedOrb) {
    cells.push({
      points: blobPolygon(orb, random(24, 38), 8, 0.22),
      fill: ['ripple', colors[3].a, colors[3].b, random(10, 16), 0],
      stroke: 3.1,
    });
  }

  const knots = [
    n.leftB,
    n.hub,
    n.rightA,
    n.rightB,
    bellyLow,
    spineB,
    detachedOrb ? orb : tailB,
  ].map((p, index) => ({ x: p.x, y: p.y, size: index < 4 ? 8 : 9 }));

  const filaments = [];
  filaments.push(makeFilament(n.leftB, local(-frameW * random(0.8, 1.15), -frameH * random(0.02, 0.18)), 0.32));
  filaments.push(makeFilament(n.rightA, local(frameW * random(0.95, 1.4), -frameH * random(0.45, 1.0)), 0.35));
  filaments.push(makeFilament(spineB, local(-frameW * random(0.15, 0.45), frameH + tailLength + random(290, 520)), 0.42));
  filaments.push(makeFilament(bellyLow, local(frameW * random(0.65, 1.2), frameH + tailLength + random(80, 260)), 0.36));

  if (detachedOrb) {
    filaments.push(makeFilament(tailB, orb, 0.22));
    filaments.push(makeFilament(orb, local(frameW * random(0.95, 1.25), frameH + tailLength + random(330, 430)), 0.18));
  } else {
    filaments.push(makeFilament(tailB, local(frameW * random(0.72, 1.08), frameH + tailLength + random(290, 460)), 0.28));
  }

  return {
    seed,
    palette,
    cells,
    knots,
    filaments,
  };
}

function makeLocalSystem(center, angle, flip) {
  const ca = cos(angle);
  const sa = sin(angle);
  return (u, v) => createVector(center.x + flip * u * ca - v * sa, center.y + flip * u * sa + v * ca);
}

function blobPolygon(center, radius, count, variance) {
  const points = [];
  const start = random(TWO_PI);
  for (let i = 0; i < count; i += 1) {
    const a = start + (i / count) * TWO_PI;
    const r = radius * (1 + random(-variance, variance));
    points.push(createVector(center.x + cos(a) * r, center.y + sin(a) * r));
  }
  return points;
}

function shuffledModes() {
  const items = [...PATTERN_MODES];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = floor(random(i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function makeFilament(start, end, bend) {
  const mid = p5.Vector.lerp(start, end, 0.5);
  const direction = p5.Vector.sub(end, start);
  const normal = createVector(-direction.y, direction.x).normalize().mult(direction.mag() * bend * random(-1, 1));
  const c1 = p5.Vector.lerp(start, mid, 0.45).add(normal);
  const c2 = p5.Vector.lerp(end, mid, 0.45).add(normal.copy().mult(0.4));
  return {
    start: start.copy(),
    c1,
    c2,
    end: end.copy(),
  };
}

function drawCell(cell) {
  const pts = cell.points.map((point) => point.copy());
  drawPatternFill(pts, cell.fill);

  stroke(16, 16, 16, 224);
  strokeWeight(cell.stroke || 3.2);
  strokeJoin(ROUND);
  noFill();
  beginShape();
  for (const point of pts) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}

function drawPatternFill(points, fillSpec) {
  drawingContext.save();
  polygonClip(points);

  const bounds = polygonBounds(points);
  const [mode, c1, c2, spacing = 18, angle = 0] = fillSpec;
  const baseColor = lerpColor(color(...c1), color(...c2), 0.4);

  backgroundWash(bounds, c1, c2);

  if (mode === 'hatch' || mode === 'bands') {
    drawParallelLines(bounds, color(...c1), color(...c2), spacing, angle, mode === 'bands' ? 2.2 : 3.0);
  } else if (mode === 'lines') {
    drawParallelLines(bounds, color(...c1), color(...c2), spacing, HALF_PI, 2.4);
  } else if (mode === 'grid') {
    drawGrid(bounds, color(...c1), color(...c2), spacing);
  } else if (mode === 'microgrid') {
    drawMicroGrid(bounds, color(...c1), color(...c2), spacing);
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
  for (let y = bounds.y - 8; y <= bounds.y + bounds.h + 8; y += 3) {
    const t = map(y, bounds.y, bounds.y + bounds.h, 0, 1);
    const col = lerpColor(color(...c1), color(...c2), constrain(t * 0.72 + noise(y * 0.01) * 0.22, 0, 1));
    stroke(red(col), green(col), blue(col), 44);
    line(bounds.x - 14, y, bounds.x + bounds.w + 14, y);
  }
}

function drawParallelLines(bounds, c1, c2, spacing, angle, weight) {
  push();
  translate(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
  rotate(angle);
  const span = max(bounds.w, bounds.h) * 1.9;
  const breadth = max(bounds.w, bounds.h) * 2.6;
  for (let i = -breadth; i <= breadth; i += spacing) {
    const t = map(i, -breadth, breadth, 0, 1);
    const col = lerpColor(c1, c2, constrain(t, 0, 1));
    stroke(red(col), green(col), blue(col), 112);
    strokeWeight(weight);
    line(i, -span, i, span);
  }
  pop();
}

function drawGrid(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.3);
  for (let x = bounds.x - spacing; x <= bounds.x + bounds.w + spacing; x += spacing) {
    const col = lerpColor(c1, c2, noise(x * 0.02));
    stroke(red(col), green(col), blue(col), 125);
    line(x, bounds.y - spacing, x, bounds.y + bounds.h + spacing);
  }
  for (let y = bounds.y - spacing; y <= bounds.y + bounds.h + spacing; y += spacing) {
    const col = lerpColor(c2, c1, noise(y * 0.02));
    stroke(red(col), green(col), blue(col), 115);
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
      arc(x + spacing * 0.5, y + spacing * 0.5, spacing * 0.8, spacing * 0.8, 0, PI);
      arc(x + spacing * 0.5, y + spacing * 0.5, spacing * 0.8, spacing * 0.8, PI, TWO_PI);
    }
  }
}

function drawRings(bounds, c1, c2, spacing) {
  noFill();
  const anchors = [
    createVector(bounds.x + bounds.w * 0.68, bounds.y + bounds.h * 0.68),
    createVector(bounds.x + bounds.w * 0.26, bounds.y + bounds.h * 0.24),
  ];
  for (const anchor of anchors) {
    for (let r = 6; r < max(bounds.w, bounds.h) * 0.78; r += spacing * 0.22) {
      const col = lerpColor(c1, c2, constrain(r / (max(bounds.w, bounds.h) * 0.78), 0, 1));
      stroke(red(col), green(col), blue(col), 96);
      strokeWeight(r < 12 ? 2.4 : 0.85);
      circle(anchor.x, anchor.y, r * 2);
    }
  }
}

function drawContourFan(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.15);
  const ox = bounds.x + bounds.w * 0.5;
  const oy = bounds.y + bounds.h * 1.08;
  for (let r = 14; r < bounds.h * 2.1; r += spacing) {
    const col = lerpColor(c1, c2, map(r, 14, bounds.h * 2.1, 0, 1));
    stroke(red(col), green(col), blue(col), 120);
    arc(ox, oy, r * 1.55, r, PI, TWO_PI);
  }
}

function drawRipple(bounds, c1, c2, spacing) {
  noFill();
  strokeWeight(1.05);
  for (let y = bounds.y; y <= bounds.y + bounds.h; y += 3) {
    beginShape();
    for (let x = bounds.x; x <= bounds.x + bounds.w; x += 5) {
      const wave = sin(x * 0.03 + y * 0.02) * spacing * 0.24;
      const col = lerpColor(c1, c2, map(y, bounds.y, bounds.y + bounds.h, 0, 1));
      stroke(red(col), green(col), blue(col), 118);
      vertex(x, y + wave);
    }
    endShape();
  }
}

function drawCloud(bounds, c1, c2) {
  noStroke();
  for (let i = 0; i < 170; i += 1) {
    const col = lerpColor(c1, c2, random());
    fill(red(col), green(col), blue(col), 18);
    ellipse(
      random(bounds.x, bounds.x + bounds.w),
      random(bounds.y, bounds.y + bounds.h),
      random(26, 120),
      random(22, 110),
    );
  }
}

function subtleSpeckles(bounds, baseColor) {
  noStroke();
  for (let i = 0; i < 900; i += 1) {
    fill(red(baseColor), green(baseColor), blue(baseColor), random(7, 19));
    circle(random(bounds.x, bounds.x + bounds.w), random(bounds.y, bounds.y + bounds.h), random(0.35, 1.3));
  }
}

function drawKnot(x, y, size) {
  noStroke();
  fill(0);
  push();
  translate(x, y);
  beginShape();
  vertex(-size, 0);
  bezierVertex(-size * 0.22, -size * 0.7, size * 0.22, -size * 0.7, size, 0);
  bezierVertex(size * 0.22, size * 0.7, -size * 0.22, size * 0.7, -size, 0);
  endShape(CLOSE);
  pop();
}

function drawFilament(filament) {
  noFill();
  stroke(12, 12, 12, 242);
  strokeWeight(2.15);
  bezier(
    filament.start.x,
    filament.start.y,
    filament.c1.x,
    filament.c1.y,
    filament.c2.x,
    filament.c2.y,
    filament.end.x,
    filament.end.y,
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
