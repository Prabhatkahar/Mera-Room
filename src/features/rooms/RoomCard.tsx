const RoomCard = ({ room }: any) => (
  <div className="border p-3 rounded">
    <img src={room.image} alt={room.title} className="h-40 w-full object-cover" />
    <h3 className="font-bold">{room.title}</h3>
    <p>{room.location}</p>
    <p>₹{room.price}</p>
  </div>
);

export default RoomCard;
