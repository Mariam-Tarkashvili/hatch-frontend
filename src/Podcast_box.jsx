import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Podcast_box.css'

const Podcast_box = () => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get('/podcasts.json')
        setPodcasts(res.data)
      } catch (err) {
        console.error("Error fetching podcasts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPodcasts()
  }, [])

  if (loading) return <p>Loading podcasts...</p>

  return (
    <div>
      {podcasts.map(podcast => (
        <div key={podcast.id} className="podcast_box_container">
          <div className="podcast_content">

            {/* Image + audio */}
            <div className="podcast_image_container">
              <img
                src={podcast.image}
                alt={podcast.title}
                className="podcast_image"
              />
              <audio controls className="podcast_audio">
                <source src={podcast.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Title + description */}
            <div className="podcast_text_container">
              <h2 className="podcast_title">{podcast.title}</h2>
              <p className="podcast_description">{podcast.description}</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default Podcast_box