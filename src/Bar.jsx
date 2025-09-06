import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Bar.css';

const Bar = () => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/finish_training', {})
    } catch (err) {
      console.error("Error finishing training:", err)
    }
    navigate('/')
  }

  const handleReaderClick = () => {
    console.log('Reader clicked - content already shown')
  }

  return (
    <nav className="bar">
      <div className="bar_logo_container">
        <img src="/logo.png" alt="Logo" className="worker_logo" style={{ cursor: 'pointer' }}/>
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
