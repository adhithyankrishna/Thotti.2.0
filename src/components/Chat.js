import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";
import ProgressBar from "@ramonak/react-progress-bar";
import SplineCanvas from "./SplineCanvas";
import { useParams, Link } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const chatContainerRef = useRef(null);
  const inputContainerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const firestore = firebase.firestore();
  const { room, pin } = useParams();

  useEffect(() => {
    const unsubscribe = firestore
      .collection("chat")
      .where("room", "==", room)
      .where("pin", "==", pin)
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messageList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageList);
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      });
    console.log(unsubscribe);
    return () => unsubscribe();
  }, [firestore, pin, room]);

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
      const fileRef = folderRef.child(file.name);

      const uploadTask = fileRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate the progress percentage
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // Update the progress state
          setProgress(progress);
        },
        (error) => {
          // Handle any errors that occur during the upload
          alert("Something bad happened");
        },
        () => {
          // When the upload is complete, get the file download URL
          uploadTask.snapshot.ref.getDownloadURL().then((fileUrl) => {
            messageData.file = fileUrl;
            messageData.filename = filename;

            // Add the message to Firestore
            firestore
              .collection("chat")
              .add(messageData)
              .then(() => {
                // Reset the input values
                setNewMessage("");
                setFile(null);
                setProgress(0);
              });
          });
        }
      );
    } else {
      // If there is no file, simply add the message to Firestore
      await firestore.collection("chat").add(messageData);

      // Reset the input values
      setNewMessage("");
      setFile(null);
    }

    scrollToBottom();
  };

  const delete_fun = async (mes) => {
    if (mes.file) {
      const storage = firebase.storage();
      const fileref = storage.refFromURL(mes.file);
      await fileref.delete();
      await firestore.collection("chat").doc(mes.id).delete();
    } else {
      await firestore.collection("chat").doc(mes.id).delete();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      setFilename(fileName);
      setFile(selectedFile);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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

  return (
    <div className="chat-container">
      <div className="roomname">{room}</div>
      <div className="scroll-button-container">
        <button onClick={scrollToBottom} className="scroll">
          Scroll to End
        </button>
      </div>
      <div className="mid-c">
        <div className="chat-a">
          <div className="messages-container" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div className="message" key={index}>
                <div className="item">
                  <p>{message.text}</p>
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
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div>{progress > 0 && <ProgressBar completed={progress} />}</div>
        </div>
        <div className="input-container">
          <textarea
            className="chat-input"
            placeholder="Enter the message"
            type="textarea"
            value={newMessage}
            onKeyDown={handleKeyPress}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            className="file-i"
            type="file"
            onChange={handleFileChange}
            onKeyDown={handleKeyPress}
          />
          <button className="sendBut" onClick={handleSendMessage}>
            Send
          </button>
        </div>
        <div className="logo-c">
          <SplineCanvas />
        </div>
      </div>
    </div>
  );
};

export default Chat;
