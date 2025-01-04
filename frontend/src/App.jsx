import { useCallback, useDebugValue, useEffect, useState } from 'react';
import './App.css';

function App() {
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");
    const [socket,setSocket]=useState(null)

    useEffect(()=>{
        const ws=new WebSocket("ws://localhost:5000")

        const handleOpen=()=>{
            console.log("Client Connected!",Date.now())
        }
        
        const handleMessage=(event)=>{
            console.log("Message : ",event.data)
            setChats((prevChats)=>[...prevChats,event.data])
        }
        
        const handleClose=()=>{
            console.log("Client Disconnected!")
        }
        
        const handleError=()=>{
            console.log("WebSocket Cllient error")
        }
        
        ws.addEventListener('open',handleOpen);
        ws.addEventListener('message',handleMessage);
        ws.addEventListener('close',handleClose);
        ws.addEventListener('error',handleError);

        setSocket(ws);

        return ()=>{
            ws.removeEventListener('open',handleOpen);
            ws.removeEventListener('message',handleMessage);
            ws.removeEventListener('close',handleClose);
            ws.removeEventListener('error',handleError);
            if(ws.readyState==WebSocket.OPEN){
                ws.close();
            }
        }
    },[])

    const sendMessage=useCallback(()=>{
        if(socket&&socket.readyState==WebSocket.OPEN){
            socket.send(message);
            setMessage("")
        }
    },[socket,message])

    const handleKeyDown=(e)=>{
        if(e.key==='Enter'){
            e.preventDefault();
            sendMessage();
        }
    }


    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
            <div className="max-w-3xl w-full mx-auto flex flex-col flex-grow p-4">
                {/* Header */}
                <div className="text-center py-4 border-b border-gray-700 mb-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Real-time Chat
                    </h1>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow overflow-auto mb-4 rounded-lg bg-gray-800 p-4 custom-scrollbar">
                    <div className="space-y-4">
                        {chats.map((msg, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="bg-gray-700 rounded-lg p-3 max-w-[80%] break-words shadow-lg transform hover:scale-[1.02] transition-transform">
                                    <p className="text-gray-100">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={message}
                            placeholder="Type your message..."
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <button 
                            onClick={sendMessage} 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-medium hover:opacity-90 transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;