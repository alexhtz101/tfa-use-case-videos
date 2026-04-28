import { useState, useCallback } from 'react'
import './App.css'
import './VideoLibrary.css'

/* ============================================
   DATA
   ============================================ */

const googleVideos = [
  {
    title: 'Engage AI as a sparring partner to unlock instructional ideas',
    href: 'https://www.loom.com/share/c4c18a3b092a485badf4580199088310',
    tool: 'Gemini',
  },
  {
    title: 'Create multimodal resources with Notebook LM',
    href: 'https://www.loom.com/share/9c55693aae4342c9b6f39734668ddd35',
    tool: 'NotebookLM',
  },
  {
    title: 'Develop interactive visuals using canvas in Gemini',
    href: 'https://www.loom.com/share/b42a6f63c7c54edfa9b61d0a566bec51',
    tool: 'Gemini',
  },
  {
    title: 'Produce songs to support learning in Gemini',
    href: 'https://www.loom.com/share/be67d94df8bf4219bece5d3a6d0854a1',
    tool: 'Gemini',
  },
  {
    title: 'Make visuals and videos with Nano Banana',
    href: 'https://www.loom.com/share/22f7faf7cc7f4e19988b692355c83b47',
    tool: 'Gemini',
  },
  {
    title: 'Make engaging slide decks with Gemini',
    href: 'https://www.loom.com/share/e86821cc71a74b4b8a258f87988eccf7',
    tool: 'Gemini',
  },
  {
    title: 'Leverage Gemini in Google Drive',
    href: 'https://www.loom.com/share/c7f38a3ab60c4b5dae0d599cf479d2cd',
    tool: 'Gemini',
  },
]

const claudeVideos = [
  {
    title: 'Automate complex and recurring workflows with Claude Skills',
    href: 'https://www.loom.com/share/0b647de16ca743418e89cd3bf0a3b0a4',
    tool: 'Claude',
  },
  {
    title: 'Make infographics (and more!) with Claude Design',
    href: 'https://www.loom.com/share/349964a429d1400bb0511cd3623d1616',
    tool: 'Claude',
  },
  {
    title: 'Generate decks for your lessons',
    href: 'https://www.loom.com/share/896984e7dbc34edea991e0e2a05eda2e',
    tool: 'Claude',
  },
]

const platforms = [
  {
    id: 'google',
    name: 'Google',
    tagline: 'Gemini · NotebookLM · and more',
    description:
      "Explore how Google's AI tools — Gemini and NotebookLM — can power instructional creativity, multimodal content creation, and engaging learning experiences.",
    videos: googleVideos,
    accentClass: 'platform-google',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    tagline: 'Claude · Claude.ai',
    description:
      'See how Claude can support deep reasoning, complex writing tasks, and nuanced instructional workflows across a range of use cases.',
    videos: claudeVideos,
    accentClass: 'platform-claude',
  },
]

/* ============================================
   ICONS
   ============================================ */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 8 10 13 15 8" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" />
      <path d="M10 2h4v4" />
      <line x1="14" y1="2" x2="7" y2="9" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <circle cx="12" cy="12" r="10" fill="#CC785C" opacity="0.15"/>
      <path d="M8 15.5l4-7 4 7" stroke="#CC785C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 13h5" stroke="#CC785C" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  )
}

/* ============================================
   VIDEO LIST ITEM — links out to Loom
   ============================================ */

function VideoListItem({ video, index }: { video: { title: string; href: string; tool: string }; index: number }) {
  return (
    <a
      href={video.href}
      target="_blank"
      rel="noopener noreferrer"
      className="lib-list-item"
    >
      <span className="lib-list-number">{index + 1}</span>
      <span className="lib-list-tool">{video.tool}</span>
      <span className="lib-list-title">{video.title}</span>
      <span className="lib-list-icon"><ExternalLinkIcon /></span>
    </a>
  )
}

/* ============================================
   PLATFORM SECTION — accordion
   ============================================ */

function PlatformSection({
  platform,
  isOpen,
  onToggle,
}: {
  platform: typeof platforms[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const icon = platform.id === 'google' ? <GoogleIcon /> : <ClaudeIcon />

  return (
    <div className={`lib-platform animate-in ${isOpen ? 'is-open' : ''} ${platform.accentClass}`}>
      <button className="lib-platform-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="lib-platform-icon">{icon}</div>
        <div className="lib-platform-title-group">
          <span className="lib-platform-name">{platform.name}</span>
          <span className="lib-platform-tagline">{platform.tagline}</span>
        </div>
        <span className="lib-platform-count">
          {platform.videos.length} video{platform.videos.length !== 1 ? 's' : ''}
        </span>
        <ChevronDown className="lib-platform-chevron" />
      </button>

      <div className="lib-platform-body">
        <div className="lib-platform-body-inner">
          <div className="lib-platform-content">
            <p className="lib-platform-description">{platform.description}</p>
            <div className="lib-video-list">
              {platform.videos.map((video, i) => (
                <VideoListItem key={i} video={video} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   VIDEO LIBRARY PAGE
   ============================================ */

export default function VideoLibrary() {
  const [openPlatform, setOpenPlatform] = useState<string | null>(null)

  const toggle = useCallback((id: string) => {
    setOpenPlatform(prev => (prev === id ? null : id))
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <span className="lib-wordmark">AI Use Case Video Library</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-label">AI Use Cases</div>
          <h1>
            AI Use Case<br />
            <em>Video Library</em>
          </h1>
          <p className="hero-subtitle">
            Short walkthroughs showcasing how educators and leaders are using AI tools from Google and Anthropic.
          </p>
        </div>
      </section>

      <main className="main-content">
        {platforms.map(platform => (
          <PlatformSection
            key={platform.id}
            platform={platform}
            isOpen={openPlatform === platform.id}
            onToggle={() => toggle(platform.id)}
          />
        ))}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-text">2026</p>
        </div>
      </footer>
    </>
  )
}
