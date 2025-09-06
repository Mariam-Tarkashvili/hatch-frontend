import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Recruiter_interface.css'

const Recruiter_interface = () => {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  const API_BASE_URL = 'http://127.0.0.1:5000'

  // ========== API CALLS ==========
  const updateRole = async (role) => {
    try {
      await fetch(`${API_BASE_URL}/update_role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const saveMessage = async (message, sender, role) => {
    try {
      await fetch(`${API_BASE_URL}/save_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          sender: sender,
          role: role || selectedRole || 'no_role'
        })
      })
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const uploadFiles = async (fileToUpload) => {
    try {
      const formData = new FormData()
      formData.append('files', fileToUpload)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.ai_confirmation) {
        setMessages(prev => [...prev, { type: "text", text: data.ai_confirmation, sender: "bot" }])
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const chatWithAI = async (question) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat_for_lizi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await response.json()
      if (data.answer) {
        setMessages(prev => [...prev, { type: "text", text: data.answer, sender: "bot" }])
      }
    } catch (error) {
      console.error('Error chatting with AI:', error)
    }
  }

  const finishTraining = async () => {
    try {
      await fetch(`${API_BASE_URL}/finish_training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
    } catch (error) {
      console.error('Error finishing training:', error)
    }
  }

  const generatePodcastScript = async () => {
    try {
      await fetch(`${API_BASE_URL}/generate_podcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
    } catch (error) {
      console.error('Error finishing training:', error)
    }
  }

  // ========== HANDLERS ==========
  const handleFileButtonClick = () => fileInputRef.current.click()

  const handleSignOut = async () => {
    await finishTraining()
    await generatePodcastScript()
    // Navigate back to login page
    navigate('/login');
  }

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen)

  const handleRoleSelect = async (role) => {
    setSelectedRole(role)
    setDropdownOpen(false)

    const roleMapping = {
      'Project Manager': 'project manager',
      'Data Analyst': 'data analyst'
    }

    await updateRole(roleMapping[role])
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setInputValue(selectedFile.name)
    }
  }

  const handleSend = async () => {
    if (inputValue.trim() === "" && !file) return; // nothing to send

    let newMessages = [...messages];

    // -------------------------------
    // 1 Handle file upload
    // -------------------------------
    if (file) {
      if (!selectedRole) {
        alert("Please select a role before uploading files.");
        return;
      }

      newMessages = [
        ...messages,
        { type: "file", name: file.name, url: URL.createObjectURL(file), sender: "user" }
      ];
      setMessages(newMessages);

      // Save file upload info as message
      await saveMessage(`File uploaded: ${file.name}`, "recruiter", selectedRole);

      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("role", selectedRole); // always send current role

        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.ai_confirmation) {
          setMessages(prev => [
            ...prev,
            { type: "text", text: data.ai_confirmation, sender: "bot" }
          ]);
        }

      } catch (err) {
        console.error("Error uploading file:", err);
        setMessages(prev => [
          ...prev,
          { type: "text", text: "⚠ File upload failed. Please try again.", sender: "bot" }
        ]);
      }

      setFile(null);
      setInputValue("");
      return;
    }

    // -------------------------------
    // 2️ Handle text messages
    // -------------------------------
    if (inputValue.trim() !== "") {
      newMessages = [
        ...messages,
        { type: "text", text: inputValue, sender: "user" }
      ];
      setMessages(newMessages);

      const userQuestion = inputValue;
      
      // Save recruiter message to Python directory
      await saveMessage(userQuestion, "recruiter", selectedRole);
      
      setInputValue("");

      try {
        const response = await fetch("http://127.0.0.1:5000/chat_for_lizi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userQuestion })
        });

        const data = await response.json();

        if (data.answer) {
          setMessages(prev => [
            ...prev,
            { type: "text", text: data.answer, sender: "bot" }
          ]);
        }

      } catch (err) {
        console.error("Error fetching chat response:", err);
        setMessages(prev => [
          ...prev,
          { type: "text", text: "⚠️ Server error. Please try again.", sender: "bot" }
        ]);
      }
    }
  };

  return (
    <div className={`recruiter_container ${dragActive ? "drag_active" : ""}`}>
      <div className="first_layer">
        <img src="/logo.png" alt="logo" className="recruiter_logo" />
        <h1 className="hatch">Hatch</h1>
        <h1 className="Sign_out" style={{ cursor: 'pointer' }} onClick={handleSignOut}>Sign Out</h1>
      </div>

      <div className="second_layer">
        {messages.length === 0 ? (
          <h1 className="messages_placeholder">What can you teach me?</h1>
        ) : (
          <div className="messages_wrapper">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message_box ${msg.sender === "user" ? "user_msg" : "bot_msg"}`}>
                {msg.type === "text" && msg.text}
                {msg.type === "file" && <a href={msg.url} target="_blank" rel="noopener noreferrer">{msg.name}</a>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="third_layer">
        <div className="input_wrapper">
          <button className="icon_button" onClick={handleFileButtonClick}>+</button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.txt" />

          {/* Role Dropdown with STYLING restored */}
          <div className="dropdown_container" style={{ position: 'relative', display: 'inline-block' }}>
            <button className="icon_button dropdown_button" onClick={handleDropdownToggle}>
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

          <input className="recruiter_input" type="text" placeholder="Provide your company specifics"
            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()} />

          <button className="icon_button" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  )
}

export default Recruiter_interface