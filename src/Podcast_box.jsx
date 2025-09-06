import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Podcast_box.css'

const Podcast_box = () => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [conversationAudio, setConversationAudio] = useState(null)
  const [podcastMeta, setPodcastMeta] = useState({ title: '', description: '' })

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

    const fetchConversation = async () => {
        try {
          const res = await axios.get('http://127.0.0.1:5000/conversation', { responseType: 'blob' })
          const audioUrl = URL.createObjectURL(res.data)
          setConversationAudio(audioUrl)
        } catch (err) {
          console.error("Error fetching conversation audio:", err)
        }
    }

        const fetchPodcastMeta = async () => {
          try {
            const res = await axios.get('http://127.0.0.1:5000/podcast_description')
            setPodcastMeta(res.data)
          } catch (err) {
            console.error("Error fetching podcast description:", err)
          } finally {
            setLoading(false) // now we can set loading false once all data is fetched
          }
        }


    fetchPodcasts()
    fetchConversation()
    fetchPodcastMeta()
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
                      alt={podcastMeta.title}
                      className="podcast_image"
                  />
                  {conversationAudio && (
                      <audio
                          key={conversationAudio}
                          controls
                          className="podcast_audio"
                      >
                        <source src={conversationAudio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                  )}
                </div>

                {/* Title + description */}
                <div className="podcast_text_container">
                  <h2 className="podcast_title">{podcastMeta.title}</h2>
                  <p className="podcast_description">{podcastMeta.description}</p>
                </div>

              </div>
            </div>
        ))}
      </div>
  )
}

export default Podcast_box
