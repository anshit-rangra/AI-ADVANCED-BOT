import { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaRobot, FaPlus, FaComments, FaPaperPlane, FaSignOutAlt, FaEllipsisH } from "react-icons/fa";
import "../styles/Home.css";
import api from "../api/axiosInstance";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const defaultHistory = [
  { id: 1, title: "General"},
];

const Home = () => {
  const token = Cookies.get("token")
  const chatBoxRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [history, setHistory] = useState(defaultHistory);
  const [selectedChat, setSelectedChat] = useState(history[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      extraHeaders: {
        "token": `token=${token};`
      }
    }); 
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await api.get("/chats/")
      setSelectedChat(chats.data.chats[chats.data.chats.length - 1])
      setHistory((chats.data.chats).reverse())
    }
    fetchChats();
  }, [])

  useEffect(() => {
    if (!socket) return;
    
    socket.on("ai-message-response", (msg) => {
      const botResponse = { content: msg.content, role: "bot"}
      const msgs = [...messages, botResponse]
      setMessages(msgs);
      setIsLoading(false); // Stop loading when response received
    });

  }, [socket, messages])

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return; // Prevent sending if loading

    socket.emit("ai-message", {
      "chat": selectedChat._id,
      "content": input
    });

    const newMsg = { content: input, role: "user" };
    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    setIsLoading(true); // Start loading
    
    const updatedHistory = history.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, messages: updatedMsgs }
        : chat
    );
    setHistory(updatedHistory);
    
    setInput("");
  };

  const handleSelectChat = async (chat) => {
    const {data} = await api.get(`/chats/${chat._id}`)
    setSelectedChat(chat);
    setMessages(data.chat || []);
  };

  const handleNewChat = async () => {
    const title = prompt("Enter chat title")
    const createChat = await api.post("/chats/",{
      title: title || `Chat ${history.length + 1}`
    })
    const newChat = {
      _id: createChat.data.chat._id,
      title: title || `Chat ${history.length + 1}`,
    };
    setHistory([newChat, ...history]);
    setSelectedChat(newChat);
    setMessages([]);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="gpt-home-container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaComments />
      </button>
      
      <aside className={`chat-history-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">
            <FaComments size={22} style={{marginRight: 8}}/>
            Chats
          </span>
          <div className="sidebar-actions">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <FaPlus /> New
            </button>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
        <ul className="chat-history-list">
          {history?.map((chat , idx) => {
            return (
              <li
                key={idx}
                className={chat._id === selectedChat._id ? "active" : ""}
                onClick={() => handleSelectChat(chat)}
              >
                <FaComments style={{marginRight: 6}} /> 
                {chat.name}
              </li>
            );
          })}
        </ul>
      </aside>
      
      <main className="gpt-chat-main">
        <div className="gpt-chat-content-wrapper">
          <div className="gpt-chat-box" ref={chatBoxRef}>
            {messages?.length === 0 ? (
              <div className="gpt-empty-chat">
                <div className="empty-chat-icon">
                  <FaRobot size={64} />
                </div>
                <h3>Start a conversation</h3>
                <p>Ask me anything or try one of these example queries:</p>
                <div className="example-queries">
                  <button onClick={() => setInput("Tell me about artificial intelligence")}>
                    Tell me about artificial intelligence
                  </button>
                  <button onClick={() => setInput("How does a neural network work?")}>
                    How does a neural network work?
                  </button>
                  <button onClick={() => setInput("What are the latest trends in web development?")}>
                    What are the latest trends in web development?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`gpt-chat-message ${msg.role === "user" ? "user" : "model"}`}
                  >
                    <div className="gpt-avatar">
                      {msg.role === "user" ? (
                        <FaUserCircle size={32} />
                      ) : (
                        <FaRobot size={32} />
                      )}
                    </div>
                    <div className="gpt-message-content">
                      <div className="gpt-message-text">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {/* Loading indicator */}
                {isLoading && (
                  <div className="gpt-chat-message model">
                    <div className="gpt-avatar">
                      <FaRobot size={32} />
                    </div>
                    <div className="gpt-message-content">
                      <div className="gpt-message-text loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <form className="gpt-chat-input-form" onSubmit={handleSend}>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                autoFocus
                disabled={isLoading} // Disable input while loading
              />
              <button 
                type="submit" 
                disabled={input.trim() === "" || isLoading} // Disable button while loading
                className={isLoading ? "loading" : ""}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;