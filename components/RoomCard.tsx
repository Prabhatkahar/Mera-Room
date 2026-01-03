import React from 'react';
import { Room } from '../types';
import { MapPin, Heart, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onPress, onToggleSave, isSaved }) => {
  const displayImage = room.images?.[0] || `https://picsum.photos/800/600?random=${room.id}`;

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
      onClick={() => onPress(room)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={displayImage} 
          alt={room.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(room.id);
            }}
            className="p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart 
              className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-200'}`} 
            />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
           <span className="text-white font-semibold">₹{room.price.toLocaleString('en-IN')}/mo</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
          {room.title}
        </h3>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{room.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-teal-600 dark:text-teal-400 font-medium flex items-center group/btn">
            View Details 
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;