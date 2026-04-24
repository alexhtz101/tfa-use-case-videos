import { useState, useCallback } from 'react'
import './App.css'
import './VideoLibrary.css'

/* ============================================
   DATA
   ============================================ */

const googleVideos = [
  {
    title: 'Engage AI as a sparring partner to unlock instructional ideas',
    src: 'https://www.loom.com/embed/c4c18a3b092a485badf4580199088310',
    tool: 'Gemini',
  },
  {
    title: 'Create multimodal resources with Notebook LM',
    src: 'https://www.loom.com/embed/9c55693aae4342c9b6f39734668ddd35',
    tool: 'NotebookLM',
  },
  {
    title: 'Develop interactive visuals using canvas in Gemini',
    src: 'https://www.loom.com/embed/b42a6f63c7c54edfa9b61d0a566bec51',
    tool: 'Gemini',
  },
  {
    title: 'Produce songs to support learning in Gemini',
    src: 'https://www.loom.com/embed/be67d94df8bf4219bece5d3a6d0854a1',
    tool: 'Gemini',
  },
  {
    title: 'Make visuals and videos with Nano Banana',
    src: 'https://www.loom.com/embed/22f7faf7cc7f4e19988b692355c83b47',
    tool: 'Gemini',
  },
]

const claudeVideos: { title: string; src: string; tool: string }[] = []

const platforms = [
  {
    id: 'google',
    name: 'Google',
    tagline: 'Gemini · NotebookLM · and more',
    description:
      'Explore how Google\'s AI tools — Gemini and NotebookLM — can power instructional innovation, multimodal content creation, and creative learning experiences.',
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
   HELPERS
   ============================================ */

function buildLoomSrc(src: string): string {
  const sep = src.includes('?') ? '&' : '?'
  return `${src}${sep}hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`
}

/* ============================================
   ICONS
   ============================================ */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 8 10 13 15 8" />
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
   LIBRARY VIDEO CARD — thumbnail + title
   ============================================ */

function LibraryVideoCard({ video }: { video: { title: string; src: string; tool: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="lib-card">
      <div className="lib-card-media">
        {isPlaying ? (
          <div className="lib-card-embed">
            <iframe
              src={buildLoomSrc(video.src)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            className="lib-card-overlay"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play: ${video.title}`}
          >
            <div className="lib-card-overlay-bg" />
            <div className="lib-card-play-btn">
              <PlayIcon />
            </div>
            <span className="lib-card-play-label">Watch video</span>
          </button>
        )}
      </div>
      <div className="lib-card-meta">
        <span className="lib-card-tool">{video.tool}</span>
        <h3 className="lib-card-title">{video.title}</h3>
      </div>
    </div>
  )
}

/* ============================================
   COMING SOON PLACEHOLDER
   ============================================ */

function ComingSoon() {
  return (
    <div className="lib-coming-soon">
      <div className="lib-coming-soon-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="lib-coming-soon-title">Videos coming soon</p>
      <p className="lib-coming-soon-body">Claude use case videos are being added. Check back shortly.</p>
    </div>
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
          {platform.videos.length > 0
            ? `${platform.videos.length} video${platform.videos.length !== 1 ? 's' : ''}`
            : 'Coming soon'}
        </span>
        <ChevronDown className="lib-platform-chevron" />
      </button>

      <div className="lib-platform-body">
        <div className="lib-platform-body-inner">
          <div className="lib-platform-content">
            <p className="lib-platform-description">{platform.description}</p>
            {platform.videos.length > 0 ? (
              <div className="lib-video-grid">
                {platform.videos.map((video, i) => (
                  <LibraryVideoCard key={i} video={video} />
                ))}
              </div>
            ) : (
              <ComingSoon />
            )}
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
  const [openPlatform, setOpenPlatform] = useState<string | null>('google')

  const toggle = useCallback((id: string) => {
    setOpenPlatform(prev => (prev === id ? null : id))
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <span className="lib-wordmark">AI Innovation Video Library</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-label">AI Innovation</div>
          <h1>
            AI Use Case<br />
            <em>Video Library</em>
          </h1>
          <p className="hero-subtitle">
            Short walkthroughs showcasing innovative ways educators and leaders are using AI tools from Google and Anthropic.
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
