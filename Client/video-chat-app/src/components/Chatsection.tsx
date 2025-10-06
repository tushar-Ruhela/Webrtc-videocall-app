// src/components/Chat.tsx
import React from "react";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatsection: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed md:static top-0 right-0 h-full w-80 bg-gray-850 border-l border-gray-700 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="self-start bg-gray-800 p-3 rounded-lg max-w-[80%]">
          <p className="text-sm text-gray-200">Hey! Can you hear me?</p>
        </div>
        <div className="self-end bg-blue-600 p-3 rounded-lg max-w-[80%] ml-auto">
          <p className="text-sm">Yes! Everything is clear.</p>
        </div>
      </div>

      {/* Input area (UI only) */}
      <div className="p-3 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 bg-gray-800 p-2 rounded-lg outline-none text-sm"
          disabled
        />
        <button
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
          disabled
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatsection;
