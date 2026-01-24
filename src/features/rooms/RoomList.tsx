import { useEffect, useState } from "react";
import { api } from "../../services/api";
import RoomCard from "./RoomCard";

interface Room {
  _id: string;
  title?: string;
  price?: number;
  image?: string;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api("/rooms")
      .then((data: Room[]) => {
        setRooms(data);
      })
      .catch(() => {
        setError("Failed to load rooms");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard key={room._id} room={room} />
      ))}
    </div>
  );
}
