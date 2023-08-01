import React, { useRef, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SplineCanvas from "./SplineCanvas";
import { gsap } from "gsap";
import Nav from "./Nav";
import How from "./How";
import { useCookies } from "react-cookie";
import Rooms from "./Rooms";

const Landing = () => {
  const name = useRef();
  const code = useRef();
  const navigate = useNavigate();
  const firestore = firebase.firestore();
  const [room, setRoom] = useState("");
  const [pin, setPin] = useState("");
  const textRef = useRef();
  const [cookies, setCookie] = useCookies(["roomList"]);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      textRef.current,
      { y: 300, opacity: 0 },
      { y: 0, opacity: 1, duration: 10 }
    );
  }, []);

  useEffect(() => {
    const rooms = cookies.roomList;
    try {
      const parsedRooms = JSON.parse(rooms);
      setRoomList(parsedRooms || []);
    } catch (error) {
      setRoomList([]);
    }
  }, [cookies.roomList]);

  const createroom = async () => {
    const data = {
      name: room,
      code: pin,
    };

    await firestore.collection("room").add(data);
    navigate(`/chat/${room}/${pin}`);
  };

  const store = () => {
    const roomData = {
      roomName: room,
      pinCode: pin,
    };
    setRoomList([...roomList, roomData]);
    setCookie("roomList", JSON.stringify([...roomList, roomData]), {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    console.log(cookies);
  };

  const search = async () => {
    setRoom(name.current.value);
    setPin(code.current.value);

    store();
    const snapshot = await firestore
      .collection("room")
      .where("name", "==", room)
      .where("code", "==", pin)
      .get();

    if (snapshot.empty) {
      const check = window.confirm("Do you want to create a room?");
      if (check) {
        createroom();
      }
    } else {
      navigate(`/chat/${room}/${pin}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const sett = () => {
    setRoom(name.current.value);
    setPin(code.current.value);
  };

  return (
    <>
      <div className="logo">
        <SplineCanvas />
      </div>
      <div className="en">
        <Nav />
        <div className="title" ref={textRef}>
          <h1>THOTTI</h1>
          <h3 className="subtitle">
            "Chatting is the art of saying nothing when you have nothing to
            say."
          </h3>
        </div>

        <div className="mid">
          <div className="landing">
            <div className="linput">
              <h1>GET YOUR THOTTI</h1>
              <input
                placeholder="  Enter room name "
                ref={name}
                onChange={sett}
                className="li"
                onKeyDown={handleKeyPress}
              />
              <input
                type="number"
                placeholder="  Enter code "
                ref={code}
                className="li"
                onChange={sett}
                onKeyDown={handleKeyPress}
              />
              <button onClick={search} className="lb">
                GET IN
              </button>
            </div>
          </div>
        </div>
        <div className="roomlist">
          <Rooms />
        </div>
        <How />
      </div>
    </>
  );
};

export default Landing;
