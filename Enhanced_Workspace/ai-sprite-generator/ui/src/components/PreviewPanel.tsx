import { usePreviewStore } from '../stores/previewStore';

export function PreviewPanel() {
  const { sprites, selectedSprite, setSelectedSprite } = usePreviewStore();
  const selected = sprites.find((s) => s.id === selectedSprite);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Preview</h2>
      
      <div className="flex-1 overflow-y-auto">
        {sprites.length === 0 ? (
          <p className="text-gray-500">No sprites generated yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sprites.map((sprite) => (
              <div
                key={sprite.id}
                onClick={() => setSelectedSprite(sprite.id)}
                className={`border rounded-lg p-2 cursor-pointer ${
                  selectedSprite === sprite.id ? 'border-blue-500' : ''
                }`}
              >
                <img
                  src={sprite.thumbnailUrl || sprite.url}
                  alt={`Sprite ${sprite.id}`}
                  className="w-full"
                />
                {sprite.frames && sprite.frames > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {sprite.frames} frames
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="border-t mt-4 pt-4">
          <h3 className="font-bold mb-2">Selected Sprite</h3>
          <img src={selected.url} alt="Selected sprite" className="w-full" />
          {selected.metadata && (
            <div className="mt-2 text-sm">
              <p>ID: {selected.id}</p>
              {selected.frames && <p>Frames: {selected.frames}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}







