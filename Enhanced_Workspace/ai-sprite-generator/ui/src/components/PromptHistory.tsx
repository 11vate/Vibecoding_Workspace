import { useChatStore } from '../stores/chatStore';

export function PromptHistory() {
  const { messages, clearMessages } = useChatStore();
  const userMessages = messages.filter((m) => m.role === 'user');

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">History</h2>
        <button
          onClick={clearMessages}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {userMessages.length === 0 ? (
          <p className="text-gray-500 text-sm">No prompts yet</p>
        ) : (
          <div className="space-y-2">
            {userMessages.map((message) => (
              <div
                key={message.id}
                className="p-2 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
              >
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}







