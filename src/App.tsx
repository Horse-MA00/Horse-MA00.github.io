import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State for text rotation
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [fadeState, setFadeState] = useState('fade-in')
  const [cardPositions, setCardPositions] = useState<Array<{top: number, left: number}>>([])
  
  // Text array for rotation
  const texts = ['Horse-MA00', 'CUHK Student', 'Developer', 'Badminton Player']
  
  // Orbit cards data
  const orbitCards = [
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Building modern web applications with React & TypeScript'
    },
    {
      icon: '🎓',
      title: 'CUHK Student',
      description: 'Studying Computer Science at CUHK'
    },
    {
      icon: '🏸',
      title: 'Badminton',
      description: 'Passionate badminton player and sports enthusiast'
    },
    {
      icon: '🌍',
      title: 'Exchange Program',
      description: 'Coming exchange at Chalmers University 🇸🇪'
    },
    {
      icon: '🚀',
      title: 'Tech Enthusiast',
      description: 'Love exploring new technologies and tools'
    },
    {
      icon: '📚',
      title: 'Continuous Learning',
      description: 'Always learning and improving my skills'
    }
  ]
  
  // Generate random non-overlapping positions
  useEffect(() => {
    const generatePositions = () => {
      const positions: Array<{top: number, left: number}> = []
      const cardWidth = 10 // Card width in percentage (150px out of ~1500px average viewport)
      const cardHeight = 16 // Card height in percentage (120px out of ~750px average viewport)
      const minSpacing = 5 // Minimum spacing between cards (percentage) - INCREASED for better separation
      const edgeMargin = 3 // Margin from viewport edges (percentage) - INCREASED
      
      const centerZone = { 
        x: 50 - 14, // Center card left edge (50% - half width ~14%)
        y: 50 - 26, // Center card top edge (50% - half height ~26%)
        width: 28,  // Center card width ~28%
        height: 52  // Center card height ~52%
      }
      
      const isOverlapping = (newPos: {top: number, left: number}) => {
        // Check if overlaps with center card (with larger buffer)
        const centerBuffer = minSpacing + 2 // Extra buffer around center card
        if (
          newPos.left - centerBuffer < centerZone.x + centerZone.width && 
          newPos.left + cardWidth + centerBuffer > centerZone.x &&
          newPos.top - centerBuffer < centerZone.y + centerZone.height && 
          newPos.top + cardHeight + centerBuffer > centerZone.y
        ) {
          return true
        }
        
        // Check if overlaps with other cards using stricter distance check
        for (const pos of positions) {
          // If either card is within the other's bounding box (including minimum spacing)
          const horizontalOverlap = 
            newPos.left < pos.left + cardWidth + minSpacing && 
            newPos.left + cardWidth + minSpacing > pos.left
          
          const verticalOverlap = 
            newPos.top < pos.top + cardHeight + minSpacing && 
            newPos.top + cardHeight + minSpacing > pos.top
          
          // Cards overlap if they overlap both horizontally AND vertically
          if (horizontalOverlap && verticalOverlap) {
            return true
          }
        }
        return false
      }
      
      const isWithinBounds = (pos: {top: number, left: number}) => {
        // Ensure card stays well within viewport boundaries
        return (
          pos.top >= edgeMargin && 
          pos.top + cardHeight <= 100 - edgeMargin &&
          pos.left >= edgeMargin && 
          pos.left + cardWidth <= 100 - edgeMargin
        )
      }
      
      for (let i = 0; i < orbitCards.length; i++) {
        let attempts = 0
        let newPos
        
        do {
          // Generate random position ensuring it stays within bounds
          newPos = {
            top: Math.random() * (100 - cardHeight - 2 * edgeMargin) + edgeMargin,
            left: Math.random() * (100 - cardWidth - 2 * edgeMargin) + edgeMargin
          }
          attempts++
        } while ((!isWithinBounds(newPos) || isOverlapping(newPos)) && attempts < 200)
        
        // If couldn't find position after 200 attempts, use carefully spaced fallback positions
        if (attempts >= 200) {
          const fallbackPositions = [
            { top: 5, left: 5 },     // Top-left
            { top: 5, left: 85 },    // Top-right
            { top: 78, left: 5 },    // Bottom-left
            { top: 78, left: 85 },   // Bottom-right
            { top: 40, left: 2 },    // Middle-left
            { top: 40, left: 88 }    // Middle-right
          ]
          newPos = fallbackPositions[i] || { top: 5 + i * 15, left: 5 }
        }
        
        positions.push(newPos)
      }
      
      setCardPositions(positions)
    }
    
    generatePositions()
  }, [])
  
  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out')
      
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        setFadeState('fade-in')
      }, 500)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="nav-title">Horse-MA00</h2>
          <div className="nav-links">
            <a href="#favorites">⭐ Favorites</a>
            <a href="#code">Code</a>
            <a href="#projects">Projects</a>
            <a href="#music">Music</a>
            <a href="#books">Books</a>
          </div>
        </div>
        <div className="nav-social">
          <a href="https://github.com/Horse-MA00" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </a>
          <a href="mailto:mht.matthew@gmail.com">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Main card - Center */}
        <div className="main-card">
          <div className="card-header">
            <span className="label">My name is:</span>
          </div>
          <h1 className={`rotating-text ${fadeState}`}>
            {texts[currentTextIndex]}
          </h1>
          <div className="divider"></div>
          <div className="card-content">
            <span className="label">I'm a:</span>
            <div className="roles">
              <p>CUHK Student</p>
              <p>Developer</p>
              <p>Badminton Player</p>
              <p>Coming Exchange at Chalmers 🇸🇪</p>
            </div>
          </div>
        </div>
        
        {/* Scattered info cards */}
        <div className="scattered-cards">
          {orbitCards.map((card, index) => (
            <div 
              key={index} 
              className="info-card"
              style={{
                position: 'absolute',
                top: cardPositions[index] ? `${cardPositions[index].top}%` : '0%',
                left: cardPositions[index] ? `${cardPositions[index].left}%` : '0%',
                opacity: cardPositions[index] ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
