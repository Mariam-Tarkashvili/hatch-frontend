import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login_page.css'

const Login_page = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Hardcoded creds with mapped roles
  const credentials = {
    'recruiter@company.com': { password: 'recruiter123', route: '/recruiter' },
    'worker1@company.com': { password: 'worker123', route: '/worker/1', role: 'project manager' },
    'worker2@company.com': { password: 'worker456', route: '/worker/2', role: 'data analyst' }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const user = credentials[username]
    if (user && user.password === password) {
      // If worker, notify backend about the role
      if (user.role) {
        try {
          await axios.post('http://127.0.0.1:5000/update_role', { role: user.role })
        } catch (err) {
          console.error("Failed to update role:", err)
        }
      }
      navigate(user.route)
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="container">
      <img src="/logo.png" alt="logo" className="logo" />
      <div className="login_container">
        <h1 className="login_caption">Log in</h1>
        <form onSubmit={handleLogin}>
  <div className="pretty_inputs">
    <input 
      className="username" 
      placeholder="Work E-mail" 
      type="email"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
    <input 
      className="password" 
      placeholder="Password" 
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  
  {error && <p className="error_message">{error}</p>}
  
  <div className="login_buttons">
    <button className="login_button" type="submit">Sign In</button>
    <button 
      type="button" 
      className="back_to_landing_btn"
      onClick={() => navigate('/')}
    >
      Back
    </button>
  </div>
</form>

      </div>
    </div>
  )
}

export default Login_page
