import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { NavLink, Routes, Route, useParams, useLocation } from 'react-router-dom'
import Podcast_box from './Podcast_box'
import Quiz_box from './Quiz_box'  // <-- import Quiz_box
import './Worker_interface.css'

const Worker_interface = () => {
  const { id: workerId } = useParams()
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me about your training material.", sender: "bot" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [wallText, setWallText] = useState("")
  const [loading, setLoading] = useState(true)
  const [quizInProgress, setQuizInProgress] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchAndSummarize = async () => {
      try {
        const resText = await axios.get('http://127.0.0.1:5000/get_text')
        const fullText = resText.data.text
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check if current route is quiz
  const isQuizRoute = location.pathname.includes('/quiz')
  
  // Show chatbot only on articles and podcasts routes
  const shouldShowChatbot = !isQuizRoute

  // Handle quiz progress updates from Quiz_box component
  const handleQuizProgressChange = (inProgress) => {
    setQuizInProgress(inProgress)
  }

  // Handle navigation click - prevent if quiz is in progress
  const handleNavClick = (e, path) => {
    if (quizInProgress && !path.includes('/quiz')) {
      e.preventDefault()
      alert('Please finish your current quiz before navigating to other sections.')
      return false
    }
    return true
  }

  return (
    <div className="worker_container">
      <div className="materials_container">
        {/* Inner navbar with NavLink */}
        <ul className="inner_navbar">
          <li>
            <NavLink
              to={`/worker/${workerId}/articles`}
              className={({ isActive }) => {
                let className = isActive ? "active_tab" : ""
                if (quizInProgress && !location.pathname.includes('/quiz')) {
                  className += " nav_disabled"
                }
                return className
              }}
              onClick={(e) => handleNavClick(e, `/worker/${workerId}/articles`)}
            >
              Articles
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/worker/${workerId}/podcasts`}
              className={({ isActive }) => {
                let className = isActive ? "active_tab" : ""
                if (quizInProgress && !location.pathname.includes('/quiz')) {
                  className += " nav_disabled"
                }
                return className
              }}
              onClick={(e) => handleNavClick(e, `/worker/${workerId}/podcasts`)}
            >
              Podcasts
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/worker/${workerId}/quiz`}
              className={({ isActive }) => isActive ? "active_tab" : ""}
            >
              Daily Quiz
            </NavLink>
          </li>
        </ul>

        {/* Quiz progress indicator */}
        {quizInProgress && (
          <div className="quiz_progress_banner">
            📝 Quiz in progress - Please complete all questions before navigating elsewhere
          </div>
        )}

        {/* Nested routes */}
        <Routes>
           {/* Default landing page */}
  <Route
    index
    element={
      <div className="big_container">
      <div className="worker_landing_container">
        <div className="worker_landing_text">
        
        <h1 className="worker_landing_header">Welcome to Hatch</h1>
        
        <p className="worker_landing_paragraph">This is your training workspace.
          Select a tab above to get started with articles, podcasts, or your daily quiz.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla vitae posuere blandit, eros mauris aliquet justo, vel euismod justo arcu a est. Integer feugiat, nibh nec sollicitudin posuere, nunc turpis aliquet odio, vitae tincidunt erat mauris nec lacus. Proin dapibus nulla id quam imperdiet, nec mattis libero efficitur. Duis luctus odio id fermentum</p>
          </div>
          
            <img className="worker_landing_img" src="/worker_landing.png" alt="workplace"/>
         </div>
      </div>
    }
  />
          <Route
            path="articles"
            element={
              <div className="reader_text">
                <h1 className="worker_text_title">Article</h1>
                {loading ? (
                  <p className="worker_text_content">Loading and summarizing material...</p>
                ) : (
                  <p className="worker_text_content">{wallText}</p>
                )}
              </div>
            }
          />
          <Route
            path="podcasts"
            element={
              <div className="podcast_container">
                <Podcast_box />
              </div>
            }
          />
          <Route
            path="quiz"
            element={
              <div className="quiz_container">
                <h1 className="worker_text_title">Daily Quiz</h1>
                <Quiz_box onQuizProgressChange={handleQuizProgressChange} />
              </div>
            }
          />
        </Routes>
      </div>

      {/* Chatbot Button / Box - Only show on articles and podcasts routes */}
      {shouldShowChatbot && (
        <div className="chatbot_container">
          {isChatOpen ? (
            <div className="chatbox">
              <div className="chatbox_header">
                <span className="assistant">Assistant</span>
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
      )}
    </div>
  )
}

export default Worker_interface