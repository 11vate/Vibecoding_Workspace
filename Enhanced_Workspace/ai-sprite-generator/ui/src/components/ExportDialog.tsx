import { useState } from 'react';

interface ExportDialogProps {
  spriteId: string;
  onClose: () => void;
}

export function ExportDialog({ spriteId, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState('png');
  const [engine, setEngine] = useState('phaser');

  const handleExport = async () => {
    // Export logic would go here
    console.log('Exporting', spriteId, format, engine);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Export Sprite</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            >
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="json">JSON Metadata</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Engine</label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            >
              <option value="phaser">Phaser</option>
              <option value="pixijs">PixiJS</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}







