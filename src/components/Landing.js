import React, { useRef, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SplineCanvas from "./SplineCanvas";
import { gsap } from "gsap";
import How from "./How";

const Landing = () => {
  const name = useRef();
  const code = useRef();
  const textRef = useRef();

  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [room, setRoom] = useState("");
  const firestore = firebase.firestore();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      textRef.current,
      { y: 300, opacity: 0 },
      { y: 0, opacity: 1, duration: 10 }
    );
  }, []);

  const createroom = async () => {
    const data = {
      name: room,
      code: pin,
    };

    await firestore.collection("room").add(data);
    navigate(`/chat/${room}/${pin}`);
  };

  const pop = () => {
    return (
      <div className="popup">
        <div className="popup-content">
          <h1>We couldn't find { room }</h1>
          <h3>Do you want to create new room</h3>
          <button
            onClick={() => {
              setisOpen(false);
            }}
          >
            No
          </button>
          <button
            onClick={() => {
              createroom();
              setisOpen(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    );
  };

  const search = async () => {
    setRoom(name.current.value.trim());
    setPin(code.current.value.trim());
    const snapshot = await firestore
      .collection("room")
      .where("name", "==", room)
      .where("code", "==", pin)
      .get();

    if (snapshot.empty) {
      setisOpen(true);
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
      <div>{isOpen ? pop() : null}</div>
      <div className="nav">
        <button>Home</button>
        <button>Explore</button>
        <button>About </button>
        <button>Contact</button>
      </div>
      <div className="logo">
        <SplineCanvas />
      </div>
      <div className="en">
        <div className="title" ref={textRef}>
          <h1>THOTTI</h1>
          <h3 className="subtitle" align="justify">
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
        <How />
      </div>
    </>
  );
};

export default Landing;
