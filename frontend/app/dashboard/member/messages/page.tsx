'use client';
import React, { useState } from 'react';

const initialMessages = [
  { 
    id: 1, 
    sender: 'John Smith', 
    senderRole: 'trainer',
    avatar: '👨‍🏫',
    content: 'Hi Shivam, how are you finding the new workout routine? Any issues with the exercises?', 
    timestamp: '2 days ago'
  },
  { 
    id: 2, 
    sender: 'You', 
    senderRole: 'member',
    avatar: '👤',
    content: 'It\'s going well, but I\'m struggling a bit with the deadlifts. Could we review my form next session?', 
    timestamp: '1 day ago'
  },
  { 
    id: 3, 
    sender: 'John Smith', 
    senderRole: 'trainer',
    avatar: '👨‍🏫',
    content: 'Absolutely, I\'ll set aside some time at the beginning of our next session to go through deadlift form. In the meantime, try reducing the weight slightly and focus on keeping your back straight.', 
    timestamp: '1 day ago'
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: messages.length + 1,
      sender: 'You',
      senderRole: 'member',
      avatar: '👤',
      content: newMessage,
      timestamp: 'Just now'
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">💬 Messages</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded shadow overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Message list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.senderRole === 'member' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.senderRole === 'member' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 ml-4' 
                    : 'bg-gray-100 dark:bg-slate-700 mr-4'
                }`}
              >
                <div className="flex items-center mb-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
                    <span>{message.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{message.sender}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l p-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Trainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded shadow flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">👨‍🏫</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">John Smith</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bodybuilding Specialist</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">Online</span>
                <button className="text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded transition">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 