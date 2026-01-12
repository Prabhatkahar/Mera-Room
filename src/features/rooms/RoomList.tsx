import { useEffect, useState } from "react";
import { api } from "../../services/api";
import RoomCard from "./RoomCard";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api("/rooms").then(setRooms);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {rooms.map((r: any) => (
        <RoomCard key={r._id} room={r} />
      ))}
    </div>
  );
}
