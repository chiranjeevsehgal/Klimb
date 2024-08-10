import './App.css'
import Home from './pages/home'
import Add from './pages/add'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { app } from "./services/firebase.js";

function App() {
  return (
      <BrowserRouter>
        <Routes>
    
            <Route path="/" element={<Home app={app}/>} />
            <Route path="/adduser" element={<Add app={app}/>} />
            <Route path="/adduser/:id" element={<Add app={app} />} />
        
        </Routes>
      </BrowserRouter>
  )
}

export default App
