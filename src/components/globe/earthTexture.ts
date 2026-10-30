import * as THREE from "three";

/**
 * Procedurally generates a detailed, high-contrast dark climate-tech Earth texture.
 * Features:
 * - Deep midnight pine & charcoal ocean base
 * - High-contrast continents with topographic variation
 * - Vibrantly illuminated Indian subcontinent in glowing emerald & mint
 * - Urban city lighting nodes and latitude/longitude navigational contour rings
 */
export function createProceduralEarthTexture(): {
  mapTexture: THREE.CanvasTexture;
  bumpTexture: THREE.CanvasTexture;
} {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // 1. Deep Oceanic Gradient Base (Charcoal Pine to Deep Marine)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#051310");
  oceanGrad.addColorStop(0.3, "#071B16");
  oceanGrad.addColorStop(0.5, "#08201A");
  oceanGrad.addColorStop(0.7, "#071B16");
  oceanGrad.addColorStop(1, "#051310");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle latitude & longitude grid lines (climate monitoring grid)
  ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 2. Simplified high-fidelity landmass polygons (Equirectangular projection)
  // Mapping coordinates: x = (lon + 180)/360 * width, y = (90 - lat)/180 * height
  function toCanvas(lon: number, lat: number): [number, number] {
    return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
  }

  function drawLandmass(points: Array<[number, number]>, fillColor: string, strokeColor?: string) {
    if (points.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = toCanvas(points[0][0], points[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const [px, py] = toCanvas(points[i][0], points[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const landColor = "#0E2B21"; // Deep pine forest landmass
  const landBorder = "rgba(52, 211, 153, 0.25)";

  // Eurasia (Europe + Northern/Central/Eastern Asia)
  drawLandmass(
    [
      [-10, 36], [0, 44], [10, 54], [25, 71], [60, 75], [100, 78], [140, 72], [170, 66],
      [145, 45], [125, 30], [105, 20], [80, 10], [70, 25], [60, 25], [50, 30],
      [35, 32], [26, 40], [15, 38], [-5, 36]
    ],
    landColor,
    landBorder
  );

  // Africa
  drawLandmass(
    [
      [-15, 30], [10, 37], [32, 32], [51, 12], [42, -5], [35, -20], [20, -35],
      [15, -30], [10, -10], [0, 5], [-17, 15], [-15, 30]
    ],
    landColor,
    landBorder
  );

  // North America
  drawLandmass(
    [
      [-165, 65], [-140, 70], [-95, 70], [-60, 55], [-70, 42], [-80, 25], [-95, 18],
      [-105, 23], [-120, 35], [-125, 50], [-165, 65]
    ],
    landColor,
    landBorder
  );

  // South America
  drawLandmass(
    [
      [-78, 10], [-55, 5], [-35, -6], [-40, -22], [-55, -45], [-70, -55], [-75, -40],
      [-80, -5], [-78, 10]
    ],
    landColor,
    landBorder
  );

  // Australia
  drawLandmass(
    [
      [115, -22], [130, -12], [145, -15], [152, -28], [145, -38], [130, -35],
      [115, -32], [115, -22]
    ],
    landColor,
    landBorder
  );

  // 3. Indian Subcontinent - HIGH FOCUS & HIGHLIGHT!
  // Exact boundaries of India (approximate polygon with distinct shape)
  const indiaPolygon: Array<[number, number]> = [
    [74.0, 37.0], // Northern Jammu & Kashmir / Ladakh
    [77.0, 35.5],
    [79.0, 32.5],
    [81.0, 30.5],
    [88.5, 27.5], // Sikkim
    [92.5, 28.0], // Arunachal Pradesh
    [96.0, 28.0],
    [95.0, 26.0],
    [92.0, 24.0], // Assam / Meghalaya
    [89.0, 22.0], // Sunderbans
    [86.5, 20.0], // Odisha coast
    [83.0, 18.0], // Andhra coast
    [80.0, 13.0], // Chennai coast
    [79.8, 10.0], // Tamil Nadu
    [77.5, 8.1],  // Kanyakumari (Southern tip)
    [76.0, 10.0], // Kerala coast
    [74.0, 15.0], // Goa / Karnataka
    [72.8, 19.0], // Mumbai / Maharashtra
    [69.0, 22.5], // Gujarat (Dwarka / Kathiawar)
    [69.5, 24.5], // Rann of Kutch
    [71.0, 27.0], // Rajasthan
    [74.5, 31.0], // Punjab
    [74.0, 37.0]  // Back to North
  ];

  // Draw India with vibrant luminous emerald gradient & highlight glow
  ctx.save();
  ctx.shadowColor = "#10B981";
  ctx.shadowBlur = 15;
  drawLandmass(indiaPolygon, "#134E35", "#34D399");
  ctx.restore();

  // Subtle interior contour illumination for India
  drawLandmass(
    [
      [75.0, 34.0], [80.0, 30.0], [88.0, 26.0], [85.0, 20.0], [80.0, 14.0],
      [78.0, 10.0], [75.0, 16.0], [72.0, 22.0], [73.0, 28.0]
    ],
    "rgba(52, 211, 153, 0.22)"
  );

  // 4. Urban Night Light Constellations
  // Glowing amber & mint city cluster lights
  const cityClusters: Array<{ lon: number; lat: number; size: number; color: string }> = [
    // India Cities (Bright & Prominent)
    { lon: 77.209, lat: 28.6139, size: 7, color: "#34D399" }, // Delhi
    { lon: 72.8777, lat: 19.076, size: 6, color: "#34D399" }, // Mumbai
    { lon: 77.5946, lat: 12.9716, size: 6, color: "#34D399" }, // Bengaluru
    { lon: 78.4867, lat: 17.385, size: 5, color: "#34D399" }, // Hyderabad
    { lon: 88.3639, lat: 22.5726, size: 5, color: "#34D399" }, // Kolkata
    { lon: 80.2707, lat: 13.0827, size: 5, color: "#34D399" }, // Chennai
    { lon: 72.5714, lat: 23.0225, size: 4, color: "#34D399" }, // Ahmedabad
    { lon: 75.8577, lat: 22.7196, size: 4, color: "#34D399" }, // Indore
    { lon: 73.8567, lat: 18.5204, size: 4, color: "#34D399" }, // Pune

    // Major Global nodes (Subtle dim reference lights)
    { lon: 55.2708, lat: 25.2048, size: 3, color: "rgba(251, 191, 36, 0.6)" }, // Dubai
    { lon: 103.8198, lat: 1.3521, size: 3, color: "rgba(251, 191, 36, 0.6)" }, // Singapore
    { lon: 139.6917, lat: 35.6895, size: 4, color: "rgba(251, 191, 36, 0.5)" }, // Tokyo
    { lon: -0.1278, lat: 51.5074, size: 4, color: "rgba(251, 191, 36, 0.5)" }, // London
    { lon: -74.006, lat: 40.7128, size: 4, color: "rgba(251, 191, 36, 0.5)" }, // New York
  ];

  for (const c of cityClusters) {
    const [cx, cy] = toCanvas(c.lon, c.lat);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.size * 2);
    grad.addColorStop(0, c.color);
    grad.addColorStop(0.5, c.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, c.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Create Bump Canvas for 3D mountain & terrain relief
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext("2d")!;
  bCtx.fillStyle = "#000000";
  bCtx.fillRect(0, 0, width, height);

  // Draw land on bump canvas in mid-gray and Himalayas in bright white
  bCtx.fillStyle = "#444444";
  bCtx.fillRect(0, 0, width, height);
  // Himalayas relief bump
  const [hX, hY] = toCanvas(82, 30);
  const himalayaGrad = bCtx.createRadialGradient(hX, hY, 0, hX, hY, 120);
  himalayaGrad.addColorStop(0, "#FFFFFF");
  himalayaGrad.addColorStop(1, "#333333");
  bCtx.fillStyle = himalayaGrad;
  bCtx.beginPath();
  bCtx.arc(hX, hY, 120, 0, Math.PI * 2);
  bCtx.fill();

  const mapTexture = new THREE.CanvasTexture(canvas);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

  return { mapTexture, bumpTexture };
}
