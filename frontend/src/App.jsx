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
        }
    },[socket,message])

    const handleKeyDown=(e)=>{
        if(e.key==='Enter'){
            e.preventDefault();
            sendMessage();
        }
    }


    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col items-center">
            <div className='flex justify-evenly mt-10'>
                <input 
                    type="text" 
                    value={message}
                    placeholder='Enter you message'
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='bg-purple-700 border border-rounded p-2'
                />
                <button 
                    onClick={sendMessage} 
                    className='bg-gradient-to-r from-green-400 via-green-500 to-green-600 ml-2 p-2 border border-rounded hover:bg-gradient-to-br'
                >
                    Send
                </button>
            </div>
            <div className='mt-20'>
                <h1 className='font-semibold text-2xl'>Chats</h1>
                {chats.map((msg, index) => (
                    <div key={index} className='flex flex-col justify-evenly p-1'>
                        <div className='bg-gray-700 min-w-96'>
                            <p>{msg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;