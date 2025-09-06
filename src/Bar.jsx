import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './Bar.css';

const Bar = () => {
  const navigate = useNavigate()
  const { id: workerId } = useParams()  // ✅ grab workerId from route

  const handleSignOut = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/finish_training', {})
    } catch (err) {
      console.error("Error finishing training:", err)
    }
    navigate('/')
  }

  const handleReaderClick = () => {
    navigate(`/worker/${workerId}/articles`)  // ✅ redirect to Articles
  }

  const handleLogoClick = () => {
    navigate(`/worker/${workerId}`)  // ✅ go to landing page
  }

  return (
    <nav className="bar">
      <div className="bar_logo_container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/logo.png" alt="Logo" className="worker_logo"/>
        <h1 className="worker_hatch">Hatch</h1>
      </div>
      <div className="bar_options_container">
        <h1 className="Reader" style={{ cursor: 'pointer' }} onClick={handleReaderClick}>Materials</h1>
        <h1 className="Sign_out" style={{ cursor: 'pointer' }} onClick={handleSignOut}>Sign Out</h1>
      </div>
    </nav>
  )
}

export default Bar
