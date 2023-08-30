import React, { useState, useRef, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";
import ProgressBar from "@ramonak/react-progress-bar";
import Linkify from "react-linkify";
import { useParams, Link } from "react-router-dom";
import useFirestore from "../hook/useFirestore";
import useRandom from "../hook/useRandom";
import send from "../assets/send.png";
import hai from "../assets/hai.gif";
import scrollimg from "../assets/scrollimg.png";
import deleteimg from "../assets/delete.png";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const chatContainerRef = useRef(null);
  const inputContainerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const firestore = firebase.firestore();
  const { room, pin } = useParams();
  const { data: msg, isLoading, isError, error } = useFirestore(room, pin);
  const [randomNumber, generateNewRandomNumber] = useRandom(100, 999999);
  const [upfile, setupfile] = useState("Upload file");

  useEffect(() => {
    if (inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [setNewMessage]);

  const handleSendMessage = async () => {
    const messageData = {
      text: newMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      room: room,
      pin: pin,
    };

    if (file) {
      const storageRef = firebase.storage().ref();
      const folderRef = storageRef.child("files");
      const fileRef = folderRef.child(filename);
      const uploadTask = fileRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          alert("Something bad happened");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((fileUrl) => {
            messageData.file = fileUrl;
            messageData.filename = filename;

            firestore
              .collection("chat")
              .add(messageData)
              .then(() => {
                setNewMessage("");
                setFile(null);
                setProgress(0);
              });
          });

          setupfile("Upload File");
        }
      );
    } else {
      if (newMessage.trim() !== "") {
        await firestore.collection("chat").add(messageData);
        setNewMessage("");
        scrollToBottom();
        setFile(null);
      }
    }
  };

  const delete_fun = async (mes) => {
    if (mes.file) {
      try {
        const storage = firebase.storage();
        const fileref = storage.refFromURL(mes.file);
        await fileref.delete();
      } catch {
        console.log("error");
      }
      await firestore.collection("chat").doc(mes.id).delete();
    } else {
      await firestore.collection("chat").doc(mes.id).delete();
    }
  };

  const handleFileChange = (e) => {
    generateNewRandomNumber();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileNam = selectedFile.name;
      const ext = fileNam.split(".");
      const fileName = ext[0] + randomNumber + "." + ext[1];
      setFilename(fileName);
      setupfile(fileName);
      setFile(selectedFile);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const blob = item.getAsFile();
        const fileName = "pasted_image_" + Date.now();
        setFilename(fileName);
        setupfile(fileName);
        setFile(blob);
      }
    }
  };

  useEffect(() => {
    if (inputContainerRef.current) {
      console.log("JJ");
      inputContainerRef.current.scrollIntoView({
        behavior: "smooth",
      });
      scrollToBottom();
    }
  }, [msg]);

  return (
    <div className="chat-container">
      <div className="roomname">{room}</div>

      <div className="mid-c">
        <div className="chat-a">
          <div className="messages-container" ref={chatContainerRef}>
            {isLoading ? (
              <h1>Loading</h1>
            ) : isError ? (
              <h1>error{error}</h1>
            ) : !msg ? (
              <h1>Room empty</h1>
            ) : msg.length === 0 ? (
              <div>
                <img className="haiimage" src={hai} alt="haiimage" />
                <h1>Lets say Hai...</h1>
              </div>
            ) : (
              msg.map((message, index) => (
                <div className="message" key={index}>
                  <div className="item">
                    <Linkify>
                      <p className="message-text">{message.text}</p>
                    </Linkify>
                  </div>

                  <div className="fileli">
                    {message.file && (
                      <Link target="_blank" to={message.file} download>
                        📁 {message.filename}
                      </Link>
                    )}
                  </div>
                  <button
                    className="deletebut"
                    onClick={() => delete_fun(message)}
                  >
                    <img
                      className="deleteimg"
                      src={deleteimg}
                      alt="deleteimage"
                    />
                  </button>
                </div>
              ))
            )}
          </div>
          <div>{progress > 0 && <ProgressBar completed={progress} />}</div>
          <div ref={inputContainerRef} />
        </div>

        <div className="input-container">
          <textarea
            className="chat-input"
            placeholder="Enter the message"
            type="textarea"
            value={newMessage}
            onKeyDown={handleKeyPress}
            onChange={(e) => setNewMessage(e.target.value)}
            onPaste={handlePaste}
          />
          <label
            className="file-label"
            htmlFor="file"
            onClick={() => {
              document.querySelector(".file-i").click();
            }}
          >
            <span>{upfile}</span>
            <input
              className="file-i"
              type="file"
              onChange={handleFileChange}
              onKeyDown={handleKeyPress}
            />
          </label>

          <button className="sendBut" onClick={handleSendMessage}>
            <div className="sendimg">
              <img className="sendimg" src={send} alt="sendimage" />
            </div>
          </button>
          <div className="scroll-button-container">
            <button onClick={scrollToBottom} className="scroll">
              <img className="scrollimg" src={scrollimg} alt="scrollimage" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
