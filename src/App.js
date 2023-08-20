import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "./App.css";
import Chat from "./components/Chat";
import React from "react";
import Landing from "./components/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import How from "./components/How";
import { QueryClient, QueryClientProvider } from "react-query";

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

function App() {
  const quaryclint = new  QueryClient();
  return (
    <QueryClientProvider client={quaryclint} contextSharing={true}>
      <div className="App">
        <header className="App-header">
          <Router>
            <Routes>
              <Route path="/" Component={Landing} />
              <Route path="/chat/:room/:pin" Component={Chat} />
              <Route path="/how" Component={How} />
            </Routes>
          </Router>
        </header>
      </div>
    </QueryClientProvider>
  );
}

export default App;
