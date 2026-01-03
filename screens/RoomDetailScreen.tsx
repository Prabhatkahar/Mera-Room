import React, { useState, useRef, useEffect } from 'react';
import { Room } from '../types';
import { ArrowLeft, MapPin, Share2, Heart, Phone, IndianRupee, Sparkles, Send, Bot, User } from 'lucide-react';
import { askAboutRoom } from '../services/geminiService';

interface RoomDetailScreenProps {
  room: Room;
  onBack: () => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const RoomDetailScreen: React.FC<RoomDetailScreenProps> = ({ room, onBack, onToggleSave, isSaved }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleAskAI = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || isAsking) return;

    const userQ = question.trim();
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: userQ }]);
    setIsAsking(true);

    const answer = await askAboutRoom(room, userQ);

    setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    setIsAsking(false);
  };

  const displayImage = room.images?.[0] || `https://picsum.photos/800/600?random=${room.id}`;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={displayImage} alt={room.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        {/* Nav overlay */}
        <div className="absolute top-4 left-0 w-full px-4 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
             <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onToggleSave(room.id)}
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 md:left-8 text-white">
           <span className="bg-teal-600 px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">FOR RENT</span>
           <h1 className="text-2xl md:text-4xl font-bold">{room.title}</h1>
           <div className="flex items-center mt-2 text-gray-200 text-sm md:text-base">
             <MapPin className="w-4 h-4 mr-1" />
             {room.location}
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Amenities */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map((item, idx) => (
                <span key={idx} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About this place</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-2xl p-6 border border-teal-100 dark:border-teal-800/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-600 dark:text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ask about this room</h2>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto mb-4 border border-white/50 dark:border-gray-700 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-4">
                  <Bot className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Hi! I'm your AI assistant.</p>
                  <p className="text-xs">Ask me anything about amenities, location, or price.</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                        : 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {isAsking && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                 </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAskAI} className="relative">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Is there a gym nearby?"
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm"
              />
              <button 
                type="submit" 
                disabled={!question.trim() || isAsking}
                className="absolute right-2 top-2 p-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

           {/* Location Map */}
           <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Location</h2>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
               <iframe
                 width="100%"
                 height="100%"
                 frameBorder="0"
                 scrolling="no"
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(room.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                 title="Room Location"
                 className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
               ></iframe>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {room.location}
            </div>
           </div>
        </div>

        {/* Sidebar / Owner Info */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
             <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-6 flex items-center">
                <IndianRupee className="w-6 h-6" />
                {room.price.toLocaleString('en-IN')}
                <span className="text-base text-gray-400 font-normal ml-1">/ month</span>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                   <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl">
                     {room.ownerNumber.slice(-1)}
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                     <p className="font-semibold text-gray-900 dark:text-white">Room Owner</p>
                   </div>
                </div>

                <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/20">
                   <Phone className="w-5 h-5" />
                   Contact {room.ownerNumber}
                </button>
                <div className="text-center">
                   <span className="text-xs text-gray-400">UPI: {room.ownerUPI}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailScreen;