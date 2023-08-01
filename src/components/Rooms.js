import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "../App.css";

const Rooms = () => {
  const [roomList, setRoomList] = useState([]);
  const [cookies] = useCookies(["roomList"]);

  useEffect(() => {
    const rooms = cookies.roomList;
    console.log("Cookie Data:", rooms);
    setRoomList(rooms);
  }, [cookies.roomList]);

  const roomclick = () => {
    alert("hai");
  };

  return (
    <div>
      <div className="room">
        <div className="room-ti">
          <h1 className="room-ti">
            {roomList ? "Rooms List" : "Rooms are Not Avaailable. "}
          </h1>
        </div>
        <div className="rooms-container">
          <ul>
            {roomList &&
              roomList.map((item) => (
                <li
                  key={item.pinCode}
                  className="room-list"
                  onClick={roomclick}
                >
                  🏠{item.roomName}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
