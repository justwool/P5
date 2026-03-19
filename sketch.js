const PAPER_GRAIN = 42000;
const PALETTES = [
  {
    paper: [244, 240, 233],
    tint: [223, 218, 209, 14],
    fills: [
      [[122, 190, 252], [32, 132, 236]],
      [[226, 114, 128], [181, 68, 96]],
      [[209, 225, 245], [125, 174, 232]],
      [[188, 169, 220], [102, 88, 162]],
    ],
  },
  {
    paper: [244, 236, 242],
    tint: [219, 207, 223, 16],
    fills: [
      [[90, 64, 170], [45, 28, 112]],
      [[255, 191, 28], [221, 147, 0]],
      [[153, 179, 46], [92, 123, 20]],
      [[86, 108, 208], [70, 72, 162]],
    ],
  },
];
const PATTERN_MODES = ['hatch', 'contour', 'rings', 'grid', 'dots'];

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

  image(paperBuffer, 0, 0);

  for (const cell of artwork.cells) {
    drawCell(cell, artwork.transform, artwork.palette);
  }

  for (const split of artwork.splits) {
    drawSplitStroke(split, artwork.transform);
  }

  drawRoundedPolygon(artwork.frameWorld, 18, { strokeColor: color(12, 12, 12, 228), strokeWeight: 3.1 });
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
  };

  buildPaperBuffer(palette, seedValue);
  select('#seedLabel').html(String(seedValue));
  redraw();
}

function buildFrame() {
  return {
    center: createVector(random(280, 470), random(300, 460)),
    w: random(290, 430),
    h: random(210, 330),
    angle: random(-0.82, -0.32),
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
  const splitCount = floor(random(7, 12));
  const primaryAngle = random(-0.9, 0.9);

  for (let i = 0; i < splitCount; i += 1) {
    const cellIndex = pickCellIndex(cells);
    const poly = cells[cellIndex];
    const centroid = polygonCentroid(poly);
    const a = primaryAngle + random([-0.55, -0.2, 0.18, 0.6]) + random(-0.16, 0.16);
    const dir = createVector(cos(a), sin(a));
    const point = centroid.copy().add(p5.Vector.random2D().mult(random(8, 36)));

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
        extendOutside: random() < 0.45,
        extension: random(26, 90),
        curved: random() < 0.38,
        bow: random(-42, 42),
        weight: random(2.1, 3.3),
      });
    }
  }

  return {
    cells: cells.filter((poly) => polygonArea(poly) > 900),
    splits,
  };
}

function assignCellStyle(points, palette, index) {
  const pairs = palette.fills;
  const pair = pairs[index % pairs.length];
  return {
    points,
    mode: random(PATTERN_MODES),
    colors: pair,
    spacing: random(8, 16),
    angle: random(-PI * 0.5, PI * 0.5),
    weight: random(2.8, 3.3),
    centroid: polygonCentroid(points),
    area: polygonArea(points),
  };
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

  if (polygonArea(positive) < 1200 || polygonArea(negative) < 1200) {
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
  const t = p5.Vector.dot(p5.Vector.sub(point, a), normal) / p5.Vector.dot(ab, normal);
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

function drawCell(cell, transform, palette) {
  const worldPoints = cell.points.map(transform);
  drawCellPattern(worldPoints, cell, palette);
  drawRoundedPolygon(worldPoints, 14, { strokeColor: color(12, 12, 12, 214), strokeWeight: cell.weight });
}

function drawCellPattern(worldPoints, cell, palette) {
  drawingContext.save();
  roundedPolygonPath(worldPoints, 14);
  drawingContext.clip();

  const bounds = polygonBounds(worldPoints);
  const maxEdgeDistance = max(16, min(bounds.w, bounds.h) * 0.28);
  const inner = color(...cell.colors[0]);
  const outer = color(...cell.colors[1]);

  for (let y = bounds.y - 4; y <= bounds.y + bounds.h + 4; y += cell.spacing * 0.65) {
    for (let x = bounds.x - 4; x <= bounds.x + bounds.w + 4; x += cell.spacing * 0.65) {
      const p = createVector(x, y);
      if (!pointInPolygon(p, worldPoints)) {
        continue;
      }

      const edgeDistance = distanceToPolygonEdges(p, worldPoints);
      const t = constrain(1 - edgeDistance / maxEdgeDistance, 0, 1);
      const shade = lerpColor(inner, outer, pow(t, 0.9));
      const accent = lerpColor(inner, outer, constrain(t * 1.25, 0, 1));

      if (cell.mode === 'hatch') {
        stroke(red(shade), green(shade), blue(shade), 110);
        strokeWeight(1.1 + t * 1.2);
        const len = cell.spacing * (0.8 + t * 0.8);
        const dx = cos(cell.angle) * len * 0.5;
        const dy = sin(cell.angle) * len * 0.5;
        line(x - dx, y - dy, x + dx, y + dy);
      } else if (cell.mode === 'contour') {
        noFill();
        stroke(red(shade), green(shade), blue(shade), 120);
        strokeWeight(0.9 + t * 0.9);
        circle(x, y, max(1, edgeDistance * 0.28));
      } else if (cell.mode === 'rings') {
        noFill();
        stroke(red(accent), green(accent), blue(accent), 100);
        strokeWeight(0.85 + t * 1.15);
        const r = abs(sin(dist(x, y, cell.centroid.x, cell.centroid.y) * 0.075)) * cell.spacing * (0.45 + t);
        circle(x, y, max(1.2, r));
      } else if (cell.mode === 'grid') {
        noStroke();
        fill(red(shade), green(shade), blue(shade), 92 + t * 36);
        rect(x, y, 1.4 + t * 2.3, 1.4 + t * 2.3, 2);
      } else if (cell.mode === 'dots') {
        noStroke();
        fill(red(accent), green(accent), blue(accent), 84 + t * 48);
        circle(x, y, 1.2 + t * 2.6);
      }
    }
  }

  for (let i = 0; i < 160; i += 1) {
    const x = random(bounds.x, bounds.x + bounds.w);
    const y = random(bounds.y, bounds.y + bounds.h);
    const p = createVector(x, y);
    if (!pointInPolygon(p, worldPoints)) {
      continue;
    }
    const edgeDistance = distanceToPolygonEdges(p, worldPoints);
    const t = constrain(1 - edgeDistance / maxEdgeDistance, 0, 1);
    const col = lerpColor(inner, outer, t);
    noStroke();
    fill(red(col), green(col), blue(col), 16);
    circle(x, y, random(8, 22) * (0.2 + t));
  }

  drawingContext.restore();
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

function drawSplitStroke(split, transform) {
  const dir = split.dir.copy().normalize();
  const a = split.a.copy();
  const b = split.b.copy();

  if (split.extendOutside) {
    a.sub(p5.Vector.mult(dir, split.extension));
    b.add(p5.Vector.mult(dir, split.extension));
  }

  const worldA = transform(a);
  const worldB = transform(b);
  const mid = p5.Vector.lerp(worldA, worldB, 0.5);
  const normal = createVector(-(worldB.y - worldA.y), worldB.x - worldA.x).normalize();
  const control = split.curved ? mid.add(normal.mult(split.bow)) : mid;

  drawHandDrawnStroke(worldA, control, worldB, split.weight);
}

function drawHandDrawnStroke(a, control, b, baseWeight) {
  noFill();
  const steps = 24;
  for (let i = 0; i < steps; i += 1) {
    const t1 = i / steps;
    const t2 = (i + 1) / steps;
    const p1 = quadraticPointVec(a, control, b, t1);
    const p2 = quadraticPointVec(a, control, b, t2);
    const localNoise = noise(p1.x * 0.01, p1.y * 0.01);
    stroke(10, 10, 10, 232);
    strokeWeight(baseWeight + map(localNoise, 0, 1, -0.45, 0.55));
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

function roundedPolygonPath(points, radius) {
  if (points.length < 2) {
    return;
  }

  drawingContext.beginPath();

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[(i - 1 + points.length) % points.length];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    const v1 = p5.Vector.sub(prev, curr);
    const v2 = p5.Vector.sub(next, curr);
    const len1 = v1.mag();
    const len2 = v2.mag();
    const r = min(radius, len1 * 0.35, len2 * 0.35);
    const p1 = p5.Vector.add(curr, v1.normalize().mult(r));
    const p2 = p5.Vector.add(curr, v2.normalize().mult(r));

    if (i === 0) {
      drawingContext.moveTo(p1.x, p1.y);
    } else {
      drawingContext.lineTo(p1.x, p1.y);
    }
    drawingContext.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
  }

  drawingContext.closePath();
}

function drawRoundedPolygon(points, radius, options = {}) {
  roundedPolygonPath(points, radius);
  if (options.fillColor) {
    drawingContext.fillStyle = options.fillColor.toString();
    drawingContext.fill();
  }
  if (options.strokeColor) {
    drawingContext.strokeStyle = options.strokeColor.toString();
    drawingContext.lineWidth = options.strokeWeight || 1;
    drawingContext.stroke();
  }
}

function addVignette() {
  noFill();
  for (let i = 0; i < 18; i += 1) {
    stroke(120, 96, 72, 5);
    strokeWeight(22);
    rect(i * 4, i * 4, width - i * 8, height - i * 8, 30);
  }
}
