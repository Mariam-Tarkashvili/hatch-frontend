import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login_page.css'

const Login_page = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Define login credentials
  const credentials = {
    'recruiter@company.com': { password: 'recruiter123', route: '/recruiter' },
    'worker1@company.com': { password: 'worker123', route: '/worker/1' },
    'worker2@company.com': { password: 'worker456', route: '/worker/2' }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Check if username exists and password matches
    if (credentials[username] && credentials[username].password === password) {
      // Navigate to appropriate route
      navigate(credentials[username].route)
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }
    
  return (
    <div className="container">
      <img src="/logo.png" alt="logo" className="logo" />
      <div className="login_container">
        <h1 className="login_caption">
          Log in
        </h1>
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
          {error && <p className="error_message" style={{color: 'white', marginTop: '2px', marginBottom:'2px', textAlign: 'start', fontSize: '10px'}}>{error}</p>}
          <button className="login_button" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}

export default Login_page