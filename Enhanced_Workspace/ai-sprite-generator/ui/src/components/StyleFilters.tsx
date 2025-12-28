import { useState } from 'react';

export function StyleFilters() {
  const [style, setStyle] = useState('pixel-art');
  const [perspective, setPerspective] = useState('side-view');

  return (
    <div className="flex gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="pixel-art">Pixel Art</option>
          <option value="cartoon">Cartoon</option>
          <option value="hand-drawn">Hand Drawn</option>
          <option value="isometric">Isometric</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Perspective</label>
        <select
          value={perspective}
          onChange={(e) => setPerspective(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="side-view">Side View</option>
          <option value="top-down">Top Down</option>
          <option value="isometric">Isometric</option>
          <option value="front-view">Front View</option>
        </select>
      </div>
    </div>
  );
}







