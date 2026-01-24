import React from "react";

interface Room {
  _id: string;
  title?: string;
  price?: number;
  image?: string;
}

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      {room.image ? (
        <img
          src={room.image}
          alt={room.title || "Room image"}
          className="w-full h-48 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
          No Image
        </div>
      )}
      <h3 className="text-lg font-semibold">{room.title || "Untitled Room"}</h3>
      {room.price !== undefined && (
        <p className="text-gray-600 mt-2">₹{room.price}</p>
      )}
    </div>
  );
};

export default RoomCard;
