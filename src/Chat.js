import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { LineProgressBar } from '@frogress/line';

const Chat = ({ firestore }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const chatContainerRef = useRef(null);
  const inputContainerRef = useRef(null);
  
  useEffect(() => {
    const unsubscribe = firestore
      .collection('chat')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        const messageList = snapshot.docs.map((doc) => doc.data());
        setMessages(messageList);
        
        // Scroll to the end of the chat container
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    return () => unsubscribe();
  }, [firestore]);

  const handleSendMessage = async () => {
    // Check if the message is empty
    // if (newMessage.trim() === '') return;
  
    const messageData = {
      text: newMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
  
    if (file) {
      const storageRef = firebase.storage().ref();
      const folderRef = storageRef.child('files');
      const fileRef = folderRef.child(file.name);
  
      const uploadTask = fileRef.put(file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate the progress percentage
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
  
          // Update the progress state
          setProgress(progress);
          setShowProgressBar(true);
        },
        (error) => {
          // Handle any errors that occur during the upload
          alert('Something bad happened');
        },
        () => {
          // When the upload is complete, get the file download URL
          uploadTask.snapshot.ref.getDownloadURL().then((fileUrl) => {
            messageData.file = fileUrl;
            messageData.filename = filename;
  
            // Add the message to Firestore
            firestore.collection('chat').add(messageData).then(() => {
              // Reset the input values
              setNewMessage('');
              setFile(null);
              setShowProgressBar(false);
              setProgress(0);
            });
          });
        }
      );
    } else {
      // If there is no file, simply add the message to Firestore
      await firestore.collection('chat').add(messageData);
  
      // Reset the input values
      setNewMessage('');
      setFile(null);
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
    
    if (e.key === 'Enter') {
      
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="chat-container">
      <div className="scroll-button-container">
        <button onClick={scrollToBottom}  class='scroll' >Scroll to End</button>
      </div>
      <div className="messages-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div className="message" key={index}>

            <p>{message.text}</p>
            <div class='fileli'>
            {message.file && (
              <a href={message.file} download>
                {message.filename}
              </a>
            )}
            </div>
          </div>
        ))}
      </div >
  
      {showProgressBar && (
        <div className='prog'>
          <LineProgressBar percent={progress} />
        </div>
      )}
      <div className="input-container"  ref={inputContainerRef}>
        <input placeholder='Enter the message'
          type="text"
          value={newMessage}
          onKeyDown={handleKeyPress}
          onChange={(e) => setNewMessage(e.target.value) }
        />
        <input type="file" onChange={handleFileChange} onKeyDown={handleKeyPress} />
        
        
        <button onClick={handleSendMessage}>Send</button>
      </div>
      
    </div>
  );
};

export default Chat;
