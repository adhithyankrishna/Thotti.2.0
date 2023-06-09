import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const Chat = ({ firestore }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filename,setfilename] = useState(null);
 
  useEffect(() => {
    const unsubscribe = firestore
      .collection('chat')
      .orderBy('timestamp')
      .onSnapshot((snapshot) => {
        const messageList = snapshot.docs.map((doc) => doc.data());
        setMessages(messageList);
      });
    return () => unsubscribe();
  }, [firestore]);

  const handleSendMessage = async () => {
    
    //if (newMessage.trim() === '') return;
    console.log("file")
    const messageData = {
      text: newMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    
    console.log("form file ");
    
    if (file) {
      
      const storageRef = firebase.storage().ref();
      const folderRef = storageRef.child('files');
      const fileRef = folderRef.child(file.name);

      await fileRef.put(file);

      const fileUrl = await fileRef.getDownloadURL();
      messageData.file = fileUrl;
      messageData.filename = filename;
  
      console.log(messageData);


    }

    await firestore.collection('chat').add(messageData);

    setNewMessage('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileName = selectedFile.name;
    setfilename(fileName);
    setFile(selectedFile);
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <p>{message.text}</p>
            {message.file && (
              <a href={message.file} download>
                {message.filename}
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
