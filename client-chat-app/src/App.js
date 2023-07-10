import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { ToastContainer } from 'react-toastify';
import { Button, Input, Badge, Tooltip, Avatar } from 'antd';
import { LikeOutlined, DislikeOutlined, AudioOutlined, SmileOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';
import './Chat.css';

const socket = io('http://localhost:4000');

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesRef = useRef(null);

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim(); // remove leading and trailing white spaces
    if (trimmedMessage) {
      const timestamp = new Date();
      setChat([...chat, { text: trimmedMessage, avatar: "https://via.placeholder.com/40", timestamp, sent: true }]);
      socket.emit("chat message", { text: trimmedMessage, avatar: "https://via.placeholder.com/40", timestamp, likes: 0, dislikes: 0 });
      setMessage("");
    }
  };
  

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((chat) => [...chat, { ...msg, sent: false }]);
    });

    return () => socket.off("chat message");
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = 0;
    }
  }, [chat]);

  return (
    <div className="chat-wrapper">
      <div className="profile-image-container">
        <img className="profile-image" src="https://via.placeholder.com/100" alt="Profile" />
      </div>
      <div className="chat-container">
      <ToastContainer />
      <div className="messages" ref={messagesRef}>
        {chat.slice().reverse().map((msg, index) => (
          <div className={msg.sent ? "sent-message message" : "received-message message"} key={index}>
            <Avatar src={msg.avatar} />
            <div className="message-content">
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            {!msg.sent && (
              <div className="reactions">
                <Tooltip title="Like">
                  <Badge className="badge" count={msg.likes} overflowCount={999}>
                    <Button shape="circle" icon={<LikeOutlined />} size="small"/>
                  </Badge>
                </Tooltip>
                <Tooltip title="Dislike">
                  <Badge className="badge" count={msg.dislikes} overflowCount={999}>
                    <Button shape="circle" icon={<DislikeOutlined />} size="small"/>
                  </Badge>
                </Tooltip>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={sendMessage} className="message-input">
          <Button shape="circle" icon={<SmileOutlined />} size="small"/>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <Button shape="circle" icon={<AudioOutlined />} size="small"/>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Chat;
