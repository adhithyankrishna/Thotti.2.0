import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "./App.css";
import Top from "./components/Top";
import Chat from "./components/Chat";
import React from "react";
//import Home from "./components/Home";

const firebaseConfig = {
  apiKey: "AIzaSyAoKkzM6WHyexNTq_vhHZXeag4DFfyR2zw",
  authDomain: "thotti-2cb6a.firebaseapp.com",
  projectId: "thotti-2cb6a",
  storageBucket: "thotti-2cb6a.appspot.com",
  messagingSenderId: "247930786868",
  appId: "1:247930786868:web:e8b7077f136d57f6d1e661",
  measurementId: "G-LNRQGCJDK0",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <div className="top">
        <Top />
      </div>
      <header className="App-header">
        <Chat firestore={firestore} />
      </header>
    </div>
  );
}

export default App;
