import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Recruiter_interface.css'

const Recruiter_interface = () => {
  const fileInputRef = useRef(null)
  const navigate = useNavigate() // Add this line
  const [messages, setMessages] = useState([]) // store all chat messages
  const [inputValue, setInputValue] = useState("") // store input text
  const [file, setFile] = useState(null) // store selected file
  const [dragActive, setDragActive] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  // Open file manager
  const handleFileButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleSignOut = () => {
    // Navigate back to login page
    navigate('/')
  }

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setDropdownOpen(false)
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setInputValue(selectedFile.name) // show file name in input
    }
  }

  // Drag drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setInputValue(droppedFile.name)
    }
  }

  // Send message
  const handleSend = () => {
    if (inputValue.trim() === "") return

    if (file) {
      // if file selected → send as file message
      const fileUrl = URL.createObjectURL(file)
      setMessages([
        ...messages,
        { type: "file", name: file.name, url: fileUrl, sender: "user" }
      ])
      setFile(null)
    } else {
      // send normal text
      setMessages([...messages, { type: "text", text: inputValue, sender: "user" }])
    }

    setInputValue("") // clear input
  }

  return (
    <div
      className={`recruiter_container ${dragActive ? "drag_active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top logo and title */}
      <div className="first_layer">
        <img src="/logo.png" alt="logo" className="recruiter_logo" />
        <h1 className="hatch">Hatch</h1>
        <h1 className="Sign_out" style={{ cursor: 'pointer' }} onClick={handleSignOut}>
          Sign Out
        </h1>
      </div>

      {/* Chat area */}
      <div className="second_layer">
        {messages.length === 0 ? (
          <h1 className="messages_placeholder">What can you teach me?</h1>
        ) : (
          <div className="messages_wrapper">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message_box ${msg.sender === "user" ? "user_msg" : "bot_msg"}`}
              >
                {msg.type === "text" && msg.text}

                {msg.type === "file" && (
                  <div>
                    {/* Image preview */}
                    {msg.url && msg.name.match(/\.(jpg|jpeg|png|gif)$/i) && (
                      <img src={msg.url} alt={msg.name} className="file_preview" />
                    )}

                    {/* PDF preview as link */}
                    {msg.url && msg.name.match(/\.pdf$/i) && (
                      <a
                        href={msg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf_link"
                      >
                        📄 {msg.name}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="third_layer">
        <div className="input_wrapper">
          {/* Upload Button */}
          <button className="icon_button" onClick={handleFileButtonClick}>+</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />

          {/* Role Dropdown */}
          <div className="dropdown_container" style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              className="icon_button dropdown_button" 
              onClick={handleDropdownToggle}
            >
              {selectedRole ? selectedRole : '▼'}
            </button>
            {dropdownOpen && (
              <div 
                className="dropdown_menu" 
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  backgroundColor: 'rgb(20, 20, 20)',
                  border: '1px solid #5cddfd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  minWidth: '150px',
                  zIndex: 1000
                }}
              >
                <div 
                  onClick={() => handleRoleSelect('Project Manager')}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #5cddfd',
                    color: 'rgb(165, 165, 165)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(40, 40, 40)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Project Manager
                </div>
                <div 
                  onClick={() => handleRoleSelect('Data Analyst')}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    color: 'rgb(165, 165, 165)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(40, 40, 40)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Data Analyst
                </div>
              </div>
            )}
          </div>

          {/* Text / File Input */}
          <input
            className="recruiter_input"
            type="text"
            placeholder="Provide your company specifics"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Send Button */}
          <button className="icon_button" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  )
}

export default Recruiter_interface