import { useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import { usePreviewStore } from '../stores/previewStore';
import { StyleFilters } from './StyleFilters';
import { PreviewPanel } from './PreviewPanel';
import { PromptHistory } from './PromptHistory';

export function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const { messages, isGenerating, addMessage, setGenerating } = useChatStore();
  const { addSprite } = usePreviewStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Add user message
    addMessage({
      role: 'user',
      content: prompt,
      type: 'text',
    });

    setGenerating(true);
    setPrompt('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: prompt }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const result = await response.json();
      
      // Add assistant message
      addMessage({
        role: 'assistant',
        content: `Generated sprite: ${result.sprite?.id || 'unknown'}`,
        type: result.sheet ? 'sprite-sheet' : 'sprite',
        spriteUrl: result.spriteUrl,
        metadata: result.metadata,
      });

      // Add to preview
      if (result.spriteUrl) {
        addSprite({
          id: result.sprite?.id || Date.now().toString(),
          url: result.spriteUrl,
          metadata: result.metadata,
          frames: result.metadata?.frames?.length || 1,
        });
      }
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'text',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4">
        <PromptHistory />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.type === 'sprite' || message.type === 'sprite-sheet' ? (
                    <div>
                      <p>{message.content}</p>
                      {message.spriteUrl && (
                        <img
                          src={message.spriteUrl}
                          alt="Generated sprite"
                          className="mt-2 max-w-full"
                        />
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <StyleFilters />
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe a sprite..."
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/3 border-l p-4">
        <PreviewPanel />
      </div>
    </div>
  );
}







