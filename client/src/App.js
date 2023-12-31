import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")

let isPlayer1;

socket.on("playerRole", data => {
    isPlayer1 = data.isPlayer1;
    localStorage.setItem("isPlayer1", isPlayer1 ? "1" : "0");
});


// Client side
socket.on("alertMessage", data => {
  // Handle the alert message, for example, display an alert
  alert(data.message);
});



function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatPage socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
