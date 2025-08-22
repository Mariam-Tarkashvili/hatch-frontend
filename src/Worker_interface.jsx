import React, { useState, useRef, useEffect } from 'react'
import './Worker_interface.css'

const Worker_interface = ({ workerId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: `Hello! How can I help you${workerId ? ` (Worker ${workerId})` : ''}?`, sender: "bot" }
  ])
  // here should go text coming from chatbot from backend
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)

  const handleSend = () => {
    if (!inputValue.trim()) return
    setMessages([...messages, { text: inputValue, sender: "user" }])
    setInputValue("")
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="worker_container">
      <div className="reader_text">
        <h1 className="worker_text_title">
          {workerId ? `Worker ${workerId} Content` : 'Some Title'}
        </h1>
        <p className="worker_text_content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget nisi ac magna aliquam efficitur. Duis ac nisl luctus, placerat justo congue, tristique massa. Phasellus euismod est ut orci congue molestie. Suspendisse non efficitur libero. Vestibulum sodales felis in eros interdum cursus. Phasellus tincidunt tortor sed libero finibus, eget consequat ex laoreet. Proin scelerisque lorem a ligula viverra, ut commodo elit laoreet. Nullam faucibus tellus vitae purus convallis mollis. Aliquam quam nibh, laoreet non auctor eu, commodo id enim. Sed vehicula quam in porttitor blandit. Proin venenatis eleifend ornare. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam sed ultrices nunc, a eleifend enim. Pellentesque eget nunc ipsum. Pellentesque ac neque nisi. Pellentesque convallis arcu felis, consectetur pretium sem pellentesque nec. Nunc lobortis rutrum magna, in accumsan turpis dignissim facilisis. Aliquam erat volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam vel leo id augue scelerisque mattis a id nunc. Nulla facilisi. Etiam porttitor ipsum sit amet diam fermentum commodo. Sed ut massa pharetra, rhoncus orci eget, placerat diam. In viverra ornare enim sit amet vulputate. Sed sed lorem eget enim molestie accumsan quis a nisi. Praesent tempus urna eget malesuada sollicitudin. Proin id nisi metus. Duis eget accumsan ipsum.
        </p>
      </div>

      {/* Chatbot Button / Box */}
      <div className="chatbot_container">
        {isChatOpen ? (
          <div className="chatbox">
            <div className="chatbox_header">
              <span>Hatch</span>
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