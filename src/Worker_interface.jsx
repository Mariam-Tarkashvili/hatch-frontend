import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Worker_interface.css'

const Worker_interface = ({ workerId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me about your training material.", sender: "bot" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [wallText, setWallText] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Fetch wall of text and summarize it
  useEffect(() => {
    const fetchAndSummarize = async () => {
      try {
        // Step 1: fetch full wall of text
        const resText = await axios.get('http://127.0.0.1:5000/get_text')
        const fullText = resText.data.text

        // Step 2: send summarization request to the chat endpoint
        const summaryRes = await axios.post('http://127.0.0.1:5000/ask_text_reader', {
          question: `Please summarize this onboarding/training material in 3 concise paragraphs for a new employee:\n${fullText}`
        })

        setWallText(summaryRes.data.answer)
      } catch (err) {
        console.error("Error fetching or summarizing text:", err)
        setWallText("⚠️ Unable to fetch or summarize training material.")
      } finally {
        setLoading(false)
      }
    }
    fetchAndSummarize()
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const newMsg = { text: inputValue, sender: "user" }
    setMessages(prev => [...prev, newMsg])
    setInputValue("")

    try {
      const res = await axios.post('http://127.0.0.1:5000/ask_text_reader', { question: newMsg.text })
      setMessages(prev => [...prev, { text: res.data.answer, sender: "bot" }])
    } catch (err) {
      console.error("Chat error:", err)
    }
  }

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="worker_container">
      <div className="reader_text">
        <h1 className="worker_text_title">Training Material</h1>
        {loading ? (
          <p className="worker_text_content">Loading and summarizing material...</p>
        ) : (
          <p className="worker_text_content">{wallText}</p>
        )}
      </div>

      {/* Chatbot Button / Box */}
      <div className="chatbot_container">
        {isChatOpen ? (
          <div className="chatbox">
            <div className="chatbox_header">
              <span>Assistant</span>
              <button onClick={() => setIsChatOpen(false)}>✕</button>
            </div>
            <div className="chatbox_body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat_message ${msg.sender === "user" ? "sent" : "received"}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbox_footer">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>➤</button>
            </div>
          </div>
        ) : (
          <button className="chatbot_button" onClick={() => setIsChatOpen(true)}>
            <img src="/white_logo.png" alt="Chatbot" className="chatbot_icon"/>
          </button>
        )}
      </div>
    </div>
  )
}

export default Worker_interface
