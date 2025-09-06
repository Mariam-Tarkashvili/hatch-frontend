import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing_page.css'

const Landing_page = () => {
  const navigate = useNavigate()

  return (
    <div className="landing_page">
      {/* Sticky Navbar */}
<nav className="landing_navbar">
  <div 
    className="landing_logo"
    onClick={() => {
      document.querySelector('.landing_hero')?.scrollIntoView({ behavior: 'smooth' })
    }}
    style={{ cursor: 'pointer' }}
  >
    <img src="/logo.png" alt="Logo" className="landing_logo_img" />
    <h1 className="landing_hatch">Hatch</h1>
  </div>

  <div className="navbar_links">
    <button 
      className="nav_link_btn" 
      onClick={() => {
        document.querySelector('.landing_features')?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      Efficiency
    </button>
    <button 
      className="nav_link_btn" 
      onClick={() => {
        document.querySelector('.landing_contact')?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      Contact Us
    </button>
    <button className="signin_button" onClick={() => navigate('/login')}>
      Sign In
    </button>
  </div>
</nav>



      {/* Hero Section with Background */}
      {/* Hero Section with Background */}
<section className="landing_hero">
  <div className="landing_hero_overlay">
    <div className="landing_hero_text">
      <h1>Smarter Onboarding, Stronger Teams.</h1>
      <p>
        Hatch is a smart training platform that makes onboarding and skill development faster and more engaging. New hires get clear learning paths to quickly adapt to company culture and processes, while existing employees gain access to interactive materials and personalized modules to grow their skills. With Hatch, organizations save time, boost knowledge retention, and empower teams to perform at their best.
      </p>

      {/* Buttons */}
      <div className="hero_buttons">
        <button 
          className="get_started_btn" 
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
        <button 
          className="show_more_btn" 
          onClick={() => {
            document.querySelector('.landing_features')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Show Me More
        </button>
      </div>

    </div>
  </div>
</section>

      {/* Why Hatch Section */}
      <section className="landing_features">
        <h1>Hatch Efficiency</h1>
        <ul>
          <li> Interactive training experience</li>
          <li>Easy progress tracking</li>
          <li>AI-powered learning assistant</li>
          <li> Rich articles & podcasts</li>
          <li>Daily quizzes for retention</li>
          <li>Simple setup for recruiters</li>
        </ul>
      </section>

      {/* Contact Us Bar */}
      <footer className="landing_contact">
  <div className="contact_container">
    <h2>Contact Us</h2>
    <ul>
      <li>
        <div className="contact_mail_div">
        <span className="contact_icon">✉</span>
        <a href="mailto:hatch.officiall@gmail.com">hatch.officiall@gmail.com</a>
        </div>
      </li>
    </ul>
  </div>
</footer>

    </div>
  )
}

export default Landing_page
