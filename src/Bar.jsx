import { useNavigate } from 'react-router-dom'
import './Bar.css';

const Bar = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    // Navigate back to login page
    navigate('/')
  }


  const handleReaderClick = () => {
    // Reader is just whatever renders while opening worker interface
    // No navigation needed, just a placeholder function
    console.log('Reader clicked - content is already displayed')
  }

  return (
    <nav className="bar">
      <div className="bar_logo_container">
        <img
          src="/logo.png"
          alt="Logo"
          className="worker_logo"
          style={{ cursor: 'pointer' }}
        />
        <h1 className="worker_hatch">Hatch</h1>
      </div>

      <div className="bar_options_container">
        <h1 className="Reader" style={{ cursor: 'pointer' }} onClick={handleReaderClick}>
          Reader
        </h1>
        <h1 className="Sign_out" style={{ cursor: 'pointer' }} onClick={handleSignOut}>
          Sign Out
        </h1>
      </div>
    </nav>
  );
};

export default Bar;