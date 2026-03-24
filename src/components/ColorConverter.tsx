'use client';

import { useState, useEffect } from 'react';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToCmyk, cmykToRgb } from '@/lib/conversions/color';
import { useAppStore } from '@/lib/store';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [cmyk, setCmyk] = useState({ c: 76, m: 47, y: 0, k: 4 });
  const { addHistory } = useAppStore();

  const updateFromHex = (h: string) => {
    setHex(h);
    const c = hexToRgb(h);
    if (!c) return;
    setRgb(c);
    setHsl(rgbToHsl(c.r, c.g, c.b));
    setCmyk(rgbToCmyk(c.r, c.g, c.b));
    addHistory({ tab: 'color', from: 'hex', to: 'all', input: h, output: `rgb(${c.r},${c.g},${c.b})` });
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
    setCmyk(rgbToCmyk(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const c = hslToRgb(h, s, l);
    setRgb(c);
    setHex(rgbToHex(c.r, c.g, c.b));
    setCmyk(rgbToCmyk(c.r, c.g, c.b));
  };

  const updateFromCmyk = (c: number, m: number, y: number, k: number) => {
    setCmyk({ c, m, y, k });
    const col = cmykToRgb(c, m, y, k);
    setRgb(col);
    setHex(rgbToHex(col.r, col.g, col.b));
    setHsl(rgbToHsl(col.r, col.g, col.b));
  };

  const inputClass = "w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono";
  const labelClass = "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide";

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-inner" style={{ backgroundColor: hex }} />
        <div className="flex-1">
          <input
            type="color"
            value={hex.length === 7 ? hex : '#000000'}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* HEX */}
      <div className="space-y-1">
        <label className={labelClass}>HEX</label>
        <input
          type="text"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className={inputClass + ' text-lg'}
          placeholder="#000000"
        />
      </div>

      {/* RGB */}
      <div className="space-y-1">
        <label className={labelClass}>RGB</label>
        <div className="grid grid-cols-3 gap-2">
          {(['r', 'g', 'b'] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <span className="text-xs text-gray-400 uppercase">{ch}</span>
              <input
                type="number"
                min={0} max={255}
                value={rgb[ch]}
                onChange={(e) => updateFromRgb(
                  ch === 'r' ? Number(e.target.value) : rgb.r,
                  ch === 'g' ? Number(e.target.value) : rgb.g,
                  ch === 'b' ? Number(e.target.value) : rgb.b,
                )}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* HSL */}
      <div className="space-y-1">
        <label className={labelClass}>HSL</label>
        <div className="grid grid-cols-3 gap-2">
          {(['h', 's', 'l'] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <span className="text-xs text-gray-400 uppercase">{ch}{ch === 'h' ? '°' : '%'}</span>
              <input
                type="number"
                min={0} max={ch === 'h' ? 360 : 100}
                value={hsl[ch]}
                onChange={(e) => updateFromHsl(
                  ch === 'h' ? Number(e.target.value) : hsl.h,
                  ch === 's' ? Number(e.target.value) : hsl.s,
                  ch === 'l' ? Number(e.target.value) : hsl.l,
                )}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CMYK */}
      <div className="space-y-1">
        <label className={labelClass}>CMYK</label>
        <div className="grid grid-cols-4 gap-2">
          {(['c', 'm', 'y', 'k'] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <span className="text-xs text-gray-400 uppercase">{ch}%</span>
              <input
                type="number"
                min={0} max={100}
                value={cmyk[ch]}
                onChange={(e) => updateFromCmyk(
                  ch === 'c' ? Number(e.target.value) : cmyk.c,
                  ch === 'm' ? Number(e.target.value) : cmyk.m,
                  ch === 'y' ? Number(e.target.value) : cmyk.y,
                  ch === 'k' ? Number(e.target.value) : cmyk.k,
                )}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
