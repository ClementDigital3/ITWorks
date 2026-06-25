import { useState } from 'react'
import './WhatsAppButton.css'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')

  const triggerWhatsAppRedirect = (text) => {
    const phone = '254142445499'
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank', 'noopener,noreferrer')
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    triggerWhatsAppRedirect(inputMessage)
    setInputMessage('')
  }

  return (
    <div className="wa-widget-container">
      {isOpen && (
        <div className="wa-chat-window">
          {/* Header */}
          <div className="wa-chat-header">
            <div className="wa-chat-avatar-wrap">
              <div className="wa-chat-avatar">IW</div>
              <span className="wa-online-dot"></span>
            </div>
            <div className="wa-chat-info">
              <h4>ITWORKS Support</h4>
              <p>Replies in under 10 minutes</p>
            </div>
            <button className="wa-chat-close-header" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
          </div>
          
          {/* Chat Body */}
          <div className="wa-chat-body">
            <div className="wa-chat-bubble system">
              <div className="wa-sender">ITWorks Assistant</div>
              <p>Hi there! 👋 Welcome to ITWorks. How can we help you today with your internet, networking, or CCTV setup?</p>
              <span className="wa-chat-time">
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
            
            {/* Quick Actions */}
            <div className="wa-quick-actions">
              <button type="button" onClick={() => triggerWhatsAppRedirect('I want to request a free quote for Home WiFi setup.')}>
                📶 Home WiFi Quote
              </button>
              <button type="button" onClick={() => triggerWhatsAppRedirect('I would like to request a free site survey.')}>
                📅 Book Site Survey
              </button>
              <button type="button" onClick={() => triggerWhatsAppRedirect('Hello ITWorks, I have a general support request.')}>
                🛠️ Tech Support
              </button>
            </div>
          </div>
          
          {/* Chat Input */}
          <form className="wa-chat-input-form" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputMessage} 
              onChange={e => setInputMessage(e.target.value)}
            />
            <button type="submit" className="wa-chat-send-btn" disabled={!inputMessage.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        type="button"
        className={`wa-float-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
      >
        {!isOpen && <div className="wa-tooltip">Chat with us on WhatsApp</div>}
        
        {isOpen ? (
          // Close Icon
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // WhatsApp Icon
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
