const PAPER_GRAIN = 42000;
const PALETTES = [
  {
    paper: [244, 240, 233],
    tint: [223, 218, 209, 14],
    fills: [
      [[117, 188, 250], [38, 131, 230]],
      [[230, 118, 132], [186, 70, 96]],
      [[214, 226, 245], [134, 178, 232]],
      [[189, 170, 219], [106, 90, 162]],
    ],
  },
  {
    paper: [244, 236, 242],
    tint: [219, 207, 223, 16],
    fills: [
      [[88, 62, 168], [49, 30, 112]],
      [[255, 190, 24], [224, 149, 0]],
      [[154, 182, 48], [97, 125, 23]],
      [[83, 106, 204], [68, 70, 158]],
    ],
  },
];
const PATTERN_MODES = ['plain', 'plain', 'stripe', 'peel', 'rings'];

let seedValue = 1001;
let paperBuffer;
let artwork;

function setup() {
  const canvas = createCanvas(820, 1220);
  canvas.parent('canvas-host');
  pixelDensity(2);
  noLoop();
  wireControls();
  generateArtwork(int(random(100000, 999999)));
}

function draw() {
  if (!artwork) {
    return;
  }

  randomSeed(seedValue);
  noiseSeed(seedValue);
  image(paperBuffer, 0, 0);

  for (const cell of artwork.cells) {
    drawCellFill(cell, artwork.transform);
  }

  drawPolygon(artwork.frameWorld, { strokeColor: color(12, 12, 12, 228), strokeWeight: 3.2 });

  for (const split of artwork.splits) {
    drawSplitStroke(split, artwork.transform);
  }

  for (const knot of artwork.knots) {
    drawKnotBlob(artwork.transform(knot.point), knot.size, knot.rotation);
  }

  for (const filament of artwork.filaments) {
    drawFilament(filament, artwork.transform);
  }

  addVignette();
}

function wireControls() {
  select('#newSeed').mousePressed(() => generateArtwork(int(random(100000, 999999))));
  select('#sameSeed').mousePressed(() => redraw());
  select('#saveBtn').mousePressed(() => saveCanvas(`organic-${seedValue}`, 'png'));
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    generateArtwork(int(random(100000, 999999)));
  } else if (key === 'r' || key === 'R') {
    redraw();
  } else if (key === 's' || key === 'S') {
    saveCanvas(`organic-${seedValue}`, 'png');
  }
}

function generateArtwork(seed) {
  seedValue = seed;
  randomSeed(seedValue);
  noiseSeed(seedValue);

  const palette = random(PALETTES);
  const frame = buildFrame();
  const splitsAndCells = splitRectangleIntoCells(frame.w, frame.h);
  const transform = makeTransform(frame.center, frame.angle);
  const frameLocal = rectPolygon(frame.w, frame.h);
  const frameWorld = frameLocal.map(transform);

  artwork = {
    seed,
    palette,
    transform,
    frame,
    frameWorld,
    cells: splitsAndCells.cells.map((cell, index) => assignCellStyle(cell, palette, index)),
    splits: splitsAndCells.splits,
    knots: findKnots(splitsAndCells.cells, frameLocal),
    filaments: buildFilaments(frame, splitsAndCells.splits),
  };

  buildPaperBuffer(palette, seedValue);
  select('#seedLabel').html(String(seedValue));
  redraw();
}

function buildFrame() {
  return {
    center: createVector(random(270, 470), random(290, 440)),
    w: random(300, 430),
    h: random(220, 330),
    angle: random(-0.86, -0.3),
  };
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
    paperBuffer.circle(random(width), random(height), random(0.45, 1.75));
  }
}

function splitRectangleIntoCells(frameW, frameH) {
  const cells = [rectPolygon(frameW, frameH)];
  const splits = [];
  const splitCount = floor(random(4, 7));
  const primaryAngle = random(-1.1, 1.1);
  const secondaryAngle = primaryAngle + random(0.65, 1.15) * (random() < 0.5 ? -1 : 1);

  for (let i = 0; i < splitCount; i += 1) {
    const cellIndex = pickCellIndex(cells);
    const poly = cells[cellIndex];
    const centroid = polygonCentroid(poly);
    const familyAngle = random() < 0.7 ? primaryAngle : secondaryAngle;
    const a = familyAngle + random(-0.18, 0.18);
    const dir = createVector(cos(a), sin(a));
    const point = centroid.copy().add(p5.Vector.random2D().mult(random(5, 26)));

    const split = splitPolygonByLine(poly, point, dir);
    if (!split) {
      continue;
    }

    cells.splice(cellIndex, 1, split.a, split.b);

    const segment = clippedSegmentInRect(point, dir, frameW, frameH);
    if (segment) {
      splits.push({
        a: segment.a,
        b: segment.b,
        dir,
        extendOutside: random() < 0.65,
        extensionA: random(40, 150),
        extensionB: random(40, 170),
        curved: random() < 0.72,
        bow: random(-95, 95),
        weight: random(2.25, 3.6),
      });
    }
  }

  return {
    cells: cells.filter((poly) => polygonArea(poly) > 1600),
    splits,
  };
}

function assignCellStyle(points, palette, index) {
  const pair = palette.fills[index % palette.fills.length];
  return {
    points,
    base: pair[0],
    edge: pair[1],
    mode: random(PATTERN_MODES),
    angle: random(-PI * 0.5, PI * 0.5),
    spacing: random(12, 22),
    centroid: polygonCentroid(points),
  };
}

function buildFilaments(frame, splits) {
  const filaments = [];
  const count = floor(random(2, 4));
  const usable = shuffleArray(splits.slice()).slice(0, count);

  for (const split of usable) {
    const anchor = random() < 0.5 ? split.a.copy() : split.b.copy();
    const dir = split.dir.copy().normalize().mult(random(140, 280));
    const tangent = createVector(-dir.y, dir.x).mult(random(-1.2, 1.2));
    filaments.push({
      start: anchor,
      c1: p5.Vector.add(anchor, tangent.copy().mult(0.2)),
      c2: p5.Vector.add(anchor, dir).add(tangent),
      end: p5.Vector.add(anchor, dir.copy().mult(1.9)).add(tangent.copy().mult(0.55)),
    });
  }

  return filaments;
}


function shuffleArray(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = floor(random(i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function findKnots(cells, framePoly) {
  const samples = [];
  for (const cell of cells) {
    for (const point of cell) {
      samples.push(point.copy());
    }
  }

  const frameCorners = framePoly;
  const groups = [];
  for (const point of samples) {
    let group = groups.find((entry) => p5.Vector.dist(entry.point, point) < 2.2);
    if (!group) {
      group = { point: point.copy(), count: 0 };
      groups.push(group);
    }
    group.count += 1;
  }

  return groups
    .filter((group) => group.count >= 3)
    .filter((group) => !frameCorners.some((corner) => p5.Vector.dist(corner, group.point) < 2.2))
    .map((group) => ({
      point: group.point,
      size: map(group.count, 3, 8, 8, 16, true),
      rotation: random(TWO_PI),
    }));
}

function pickCellIndex(cells) {
  const areas = cells.map((poly) => max(0, polygonArea(poly)));
  const total = areas.reduce((sum, area) => sum + area, 0);
  let target = random(total);
  for (let i = 0; i < cells.length; i += 1) {
    target -= areas[i];
    if (target <= 0) {
      return i;
    }
  }
  return 0;
}

function rectPolygon(w, h) {
  return [
    createVector(-w * 0.5, -h * 0.5),
    createVector(w * 0.5, -h * 0.5),
    createVector(w * 0.5, h * 0.5),
    createVector(-w * 0.5, h * 0.5),
  ];
}

function makeTransform(center, angle) {
  const ca = cos(angle);
  const sa = sin(angle);
  return (point) => createVector(center.x + point.x * ca - point.y * sa, center.y + point.x * sa + point.y * ca);
}

function polygonArea(poly) {
  let total = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    total += a.x * b.y - b.x * a.y;
  }
  return abs(total) * 0.5;
}

function polygonCentroid(poly) {
  let x = 0;
  let y = 0;
  let area = 0;

  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const f = a.x * b.y - b.x * a.y;
    x += (a.x + b.x) * f;
    y += (a.y + b.y) * f;
    area += f;
  }

  if (abs(area) < 0.0001) {
    return poly[0].copy();
  }

  const scale = 1 / (3 * area);
  return createVector(x * scale, y * scale);
}

function splitPolygonByLine(poly, point, dir) {
  const normal = createVector(-dir.y, dir.x);
  const positive = clipPolygonHalfPlane(poly, point, normal, true);
  const negative = clipPolygonHalfPlane(poly, point, normal, false);

  if (positive.length < 3 || negative.length < 3) {
    return null;
  }

  if (polygonArea(positive) < 1800 || polygonArea(negative) < 1800) {
    return null;
  }

  return {
    a: cleanupPolygon(positive),
    b: cleanupPolygon(negative),
  };
}

function clipPolygonHalfPlane(poly, point, normal, keepPositive) {
  const output = [];
  const eps = 0.00001;

  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = p5.Vector.dot(p5.Vector.sub(a, point), normal);
    const db = p5.Vector.dot(p5.Vector.sub(b, point), normal);
    const aInside = keepPositive ? da >= -eps : da <= eps;
    const bInside = keepPositive ? db >= -eps : db <= eps;

    if (aInside && bInside) {
      output.push(b.copy());
    } else if (aInside && !bInside) {
      output.push(intersectSegmentWithLine(a, b, point, normal));
    } else if (!aInside && bInside) {
      output.push(intersectSegmentWithLine(a, b, point, normal));
      output.push(b.copy());
    }
  }

  return output;
}

function intersectSegmentWithLine(a, b, point, normal) {
  const ab = p5.Vector.sub(b, a);
  const divisor = p5.Vector.dot(ab, normal);
  const t = abs(divisor) < 0.00001 ? 0 : p5.Vector.dot(p5.Vector.sub(point, a), normal) / divisor;
  return p5.Vector.add(a, p5.Vector.mult(ab, constrain(t, 0, 1)));
}

function cleanupPolygon(poly) {
  const cleaned = [];
  for (const point of poly) {
    if (!cleaned.length || p5.Vector.dist(point, cleaned[cleaned.length - 1]) > 0.5) {
      cleaned.push(point.copy());
    }
  }
  if (cleaned.length > 2 && p5.Vector.dist(cleaned[0], cleaned[cleaned.length - 1]) < 0.5) {
    cleaned.pop();
  }
  return cleaned;
}

function clippedSegmentInRect(point, dir, w, h) {
  const hits = [];
  const limits = [
    { axis: 'x', value: -w * 0.5 },
    { axis: 'x', value: w * 0.5 },
    { axis: 'y', value: -h * 0.5 },
    { axis: 'y', value: h * 0.5 },
  ];

  for (const limit of limits) {
    let t = null;
    if (limit.axis === 'x' && abs(dir.x) > 0.0001) {
      t = (limit.value - point.x) / dir.x;
    } else if (limit.axis === 'y' && abs(dir.y) > 0.0001) {
      t = (limit.value - point.y) / dir.y;
    }

    if (t === null) {
      continue;
    }

    const hit = p5.Vector.add(point, p5.Vector.mult(dir, t));
    if (hit.x >= -w * 0.5 - 0.1 && hit.x <= w * 0.5 + 0.1 && hit.y >= -h * 0.5 - 0.1 && hit.y <= h * 0.5 + 0.1) {
      hits.push({ t, point: hit });
    }
  }

  if (hits.length < 2) {
    return null;
  }

  hits.sort((a, b) => a.t - b.t);
  return {
    a: hits[0].point,
    b: hits[hits.length - 1].point,
  };
}

function drawCellFill(cell, transform) {
  const worldPoints = cell.points.map(transform);
  polygonClip(worldPoints);

  const bounds = polygonBounds(worldPoints);
  const base = color(...cell.base);
  const edge = color(...cell.edge);
  const shadeLimit = max(20, min(bounds.w, bounds.h) * 0.22);

  noStroke();
  fill(base);
  rect(bounds.x - 2, bounds.y - 2, bounds.w + 4, bounds.h + 4);

  const lightCenter = p5.Vector.lerp(worldPoints[0], worldPoints[floor(worldPoints.length / 2)], 0.5).add(p5.Vector.random2D().mult(min(bounds.w, bounds.h) * 0.12));
  for (let i = 0; i < 2600; i += 1) {
    const x = random(bounds.x, bounds.x + bounds.w);
    const y = random(bounds.y, bounds.y + bounds.h);
    const p = createVector(x, y);
    if (!pointInPolygon(p, worldPoints)) {
      continue;
    }

    const edgeDistance = distanceToPolygonEdges(p, worldPoints);
    const edgeT = constrain(1 - edgeDistance / shadeLimit, 0, 1);
    if (edgeT > 0) {
      const shade = lerpColor(base, edge, edgeT * 0.9);
      fill(red(shade), green(shade), blue(shade), 8 + edgeT * 18);
      circle(x, y, random(8, 24) * (0.2 + edgeT));
    }

    const glow = max(0, 1 - dist(x, y, lightCenter.x, lightCenter.y) / (min(bounds.w, bounds.h) * 0.45));
    if (glow > 0) {
      fill(255, 255, 255, glow * 5);
      circle(x, y, random(10, 26) * glow);
    }
  }

  if (cell.mode === 'stripe') {
    drawStripePattern(worldPoints, cell, bounds, base, edge);
  } else if (cell.mode === 'peel') {
    drawPeelPattern(worldPoints, cell, bounds, base, edge);
  } else if (cell.mode === 'rings') {
    drawRingPattern(worldPoints, cell, bounds, base, edge);
  }

  drawingContext.restore();
}

function drawStripePattern(points, cell, bounds, base, edge) {
  push();
  translate(bounds.x + bounds.w * 0.5, bounds.y + bounds.h * 0.5);
  rotate(cell.angle);
  const span = max(bounds.w, bounds.h) * 1.9;
  for (let x = -span; x <= span; x += cell.spacing) {
    const tone = lerpColor(base, edge, 0.55);
    stroke(red(tone), green(tone), blue(tone), 92);
    strokeWeight(2.15);
    line(x, -span, x, span);
  }
  pop();
}

function drawPeelPattern(points, cell, bounds, base, edge) {
  noFill();
  const anchor = p5.Vector.lerp(points[0], points[1], 0.5);
  for (let i = 0; i < 34; i += 1) {
    const tone = lerpColor(base, edge, i / 34);
    stroke(red(tone), green(tone), blue(tone), 72);
    strokeWeight(1.0);
    beginShape();
    for (let x = bounds.x - 20; x <= bounds.x + bounds.w + 20; x += 6) {
      const y = anchor.y + i * 5 + noise(x * 0.014, i * 0.14) * 22 - 11;
      curveVertex(x, y);
    }
    endShape();
  }
}

function drawRingPattern(points, cell, bounds, base, edge) {
  noFill();
  const center = p5.Vector.lerp(points[0], cell.centroid, 0.55);
  for (let r = 6; r < min(bounds.w, bounds.h) * 0.6; r += 6) {
    const tone = lerpColor(base, edge, constrain(r / (min(bounds.w, bounds.h) * 0.6), 0, 1));
    stroke(red(tone), green(tone), blue(tone), 70);
    strokeWeight(r < 16 ? 2 : 1);
    circle(center.x, center.y, r * 2);
  }
}

function pointInPolygon(point, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = yi > point.y !== yj > point.y
      && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

function distanceToPolygonEdges(point, poly) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    best = min(best, distancePointToSegment(point, a, b));
  }
  return best;
}

function distancePointToSegment(point, a, b) {
  const ab = p5.Vector.sub(b, a);
  const ap = p5.Vector.sub(point, a);
  const t = constrain(p5.Vector.dot(ap, ab) / max(0.00001, ab.magSq()), 0, 1);
  const closest = p5.Vector.add(a, p5.Vector.mult(ab, t));
  return p5.Vector.dist(point, closest);
}

function polygonBounds(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    x: min(...xs),
    y: min(...ys),
    w: max(...xs) - min(...xs),
    h: max(...ys) - min(...ys),
  };
}

function polygonClip(points) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    drawingContext.lineTo(points[i].x, points[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();
}

function drawPolygon(points, options = {}) {
  if (options.fillColor) {
    fill(options.fillColor);
  } else {
    noFill();
  }
  if (options.strokeColor) {
    stroke(options.strokeColor);
    strokeWeight(options.strokeWeight || 1);
  } else {
    noStroke();
  }
  beginShape();
  for (const point of points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}

function drawSplitStroke(split, transform) {
  const dir = split.dir.copy().normalize();
  const a = split.a.copy().sub(p5.Vector.mult(dir, split.extendOutside ? split.extensionA : 0));
  const b = split.b.copy().add(p5.Vector.mult(dir, split.extendOutside ? split.extensionB : 0));

  const worldA = transform(a);
  const worldB = transform(b);
  const mid = p5.Vector.lerp(worldA, worldB, 0.5);
  const normal = createVector(-(worldB.y - worldA.y), worldB.x - worldA.x).normalize();
  const control = split.curved ? mid.copy().add(normal.mult(split.bow)) : mid.copy().add(normal.mult(random(-18, 18)));

  drawInkStroke(worldA, control, worldB, split.weight);
}

function drawInkStroke(a, control, b, baseWeight) {
  noFill();
  const steps = 32;
  for (let i = 0; i < steps; i += 1) {
    const t1 = i / steps;
    const t2 = (i + 1) / steps;
    const p1 = quadraticPointVec(a, control, b, t1);
    const p2 = quadraticPointVec(a, control, b, t2);
    const localNoise = noise(p1.x * 0.012, p1.y * 0.012);
    stroke(8, 8, 8, 236);
    strokeWeight(baseWeight + map(localNoise, 0, 1, -0.38, 0.62));
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function quadraticPointVec(a, c, b, t) {
  const mt = 1 - t;
  return createVector(
    mt * mt * a.x + 2 * mt * t * c.x + t * t * b.x,
    mt * mt * a.y + 2 * mt * t * c.y + t * t * b.y,
  );
}

function drawKnotBlob(point, size, rotation) {
  noStroke();
  fill(6, 6, 6, 245);
  push();
  translate(point.x, point.y);
  rotate(rotation);
  beginShape();
  vertex(-size, 0);
  bezierVertex(-size * 0.2, -size * 0.82, size * 0.2, -size * 0.82, size, 0);
  bezierVertex(size * 0.2, size * 0.82, -size * 0.2, size * 0.82, -size, 0);
  endShape(CLOSE);
  pop();
}

function drawFilament(filament, transform) {
  noFill();
  stroke(10, 10, 10, 240);
  strokeWeight(2.05);
  const start = transform(filament.start);
  const c1 = transform(filament.c1);
  const c2 = transform(filament.c2);
  const end = transform(filament.end);
  bezier(start.x, start.y, c1.x, c1.y, c2.x, c2.y, end.x, end.y);
}

function addVignette() {
  noFill();
  for (let i = 0; i < 18; i += 1) {
    stroke(120, 96, 72, 5);
    strokeWeight(22);
    rect(i * 4, i * 4, width - i * 8, height - i * 8, 30);
  }
}
