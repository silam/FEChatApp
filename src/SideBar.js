// Sidebar.js
import React, { useState } from "react";
import "./SideBar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: 1, title: "First Chat" },
    { id: 2, title: "Shopping List" },
    { id: 3, title: "AI Project Ideas" },
  ]);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {isOpen && (
        <div className="sidebar-content">
          {/* New Chat */}
          <button className="new-chat-btn">+ New Chat</button>

          {/* Chat List */}
          <div className="chat-list">
            {chats.map((chat) => (
              <div key={chat.id} className="chat-item">
                {chat.title}
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="sidebar-bottom">
            <button className="settings-btn">⚙ Settings</button>
            <button className="profile-btn">👤 Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
