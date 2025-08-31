import logo from './logo.svg';
import './styles.css';
import React, { useState, useRef, useEffect } from "react";

function IconPlus() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z" fill="currentColor"/>
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16V8M12 8l-4 4M12 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const API_BASE = 'http://localhost:8000'

 

export default function App() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [answer, setAnswer] = useState('')

 

  useEffect(() => {
      const fullReply = answer
      
      
      ///////////////////////////
      // set interval here
      ////////////////////////////
      let currentText = "";
      let index = 0;
      const interval = setInterval(() => {
        if ( fullReply !== undefined && fullReply !== '' && fullReply !== null)
        {

          currentText += fullReply[index];
          index++;
          setMessages((prev) => {
            const withoutTyping = prev.filter((m) => m.role !== "assistant-typing");
            return [
              ...withoutTyping,
              { role: "assistant-typing", text: currentText },
            ];
          });

          scrollToBottom();

          if (index === fullReply.length) {
            clearInterval(interval);
            setTyping(false);

            setMessages((prev) => {
              const withoutTyping = prev.filter((m) => m.role !== "assistant-typing");
              return [...withoutTyping, { role: "assistant", text: currentText }];
            });
            scrollToBottom();
          }
        }
        
      }, 40); // speed (ms per character)


    }, [answer]);


  function scrollToBottom() {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }

 
  const doChat = async (question) => {
    //setBusy(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setAnswer(data.answer)

    } catch (e) {
      setAnswer(`Error: ${e?.message || e}`)
      
    } finally {
      //setBusy(false)
    }
  }

  const handleSend = async() => {
    if (!value.trim()) return;

    
    const userMsg = { role: "user", text: value };
    
    setMessages((prev) => [...prev, userMsg]);
    // call chat API
    await doChat(value)


    setValue("");
    
    scrollToBottom();
    console.log('answer= ' + answer)

    // Simulate assistant typing effect (character by character)
    const fullReply = answer; //`You said: "${userMsg.text}" `; //🤖
    console.log('fullReply= ' + fullReply)
    
    setTyping(true);


    
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="page">
      {/* Chat History */}
      <div className="chat-history" ref={scrollRef}>
        {messages.length !== 0 && messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.role.startsWith("assistant") ? "assistant" : "user"
            }`}
          >
            {msg !== 'undefined' && msg.text}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="prompt-bar" role="search">
        <button
          className="btn circle"
          aria-label="Add attachment"
          onClick={() => fileInputRef.current?.click()}
        >
          <IconPlus />
        </button>

        <input
          className="input"
          placeholder="Ask anything"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Prompt"
        />

        <button
          className={`btn ghost ${recording ? "active" : ""}`}
          aria-pressed={recording}
          aria-label={recording ? "Stop voice input" : "Start voice input"}
          onClick={() => setRecording((r) => !r)}
          title="Voice"
        >
          <IconMic />
        </button>

        <button
          className={`btn send ${value.trim() ? "ready" : ""}`}
          aria-label="Send"
          onClick={handleSend}
          disabled={!value.trim()}
          title="Send"
        >
          <IconArrowUp />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) =>
            alert(`Selected ${e.target.files?.[0]?.name ?? "no file"}`)
          }
        />
      </div>
    </div>
  );
}

