import { useState } from "react";
import { motion } from "framer-motion";

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60)      [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180)[r, g, b] = [0, c, x];
  else if (180 <= h && h < 240)[r, g, b] = [0, x, c];
  else if (240 <= h && h < 300)[r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360)[r, g, b] = [c, 0, x];

  const toHex = x => {
    const hex = Math.round((x + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function generatePalette(hex) {
  const [h, s, l] = hexToHSL(hex);
  const palette = [];
  for (let i = -3; i <= 3; i++) {
    let newL = Math.min(100, Math.max(0, l + i * 10));
    palette.push(hslToHex(h, s, newL));
  }
  return palette;
}

function App() {
  const [baseColor, setBaseColor] = useState("#3498db");
  const [palette, setPalette] = useState(generatePalette("#3498db"));

  const handleGenerate = () => {
    setPalette(generatePalette(baseColor));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">🎨 Color Palette Generator</h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-12 h-12 p-1 border-2 border-gray-300 rounded"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="border px-3 py-2 rounded-lg w-32 text-center"
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate
          </button>
        </div>

        <motion.div
          layout
          className="grid grid-cols-4 sm:grid-cols-7 gap-3 mt-6"
        >
          {palette.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-12 h-12 rounded-full border shadow"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm mt-2">{color}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default App;
