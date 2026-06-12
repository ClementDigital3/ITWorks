import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './Home.css'

const SERVICES = [
  { num:'01', icon:'wifi', title:'Home WiFi Setup', desc:'Full-home coverage planning, router installation, and configuration. We ensure every corner gets strong, reliable internet.', comingSoon: false },
  { num:'02', icon:'network', title:'Office Networks', desc:'Enterprise-grade LAN/WAN infrastructure with managed switches, access points, and VLAN segmentation for secure offices.', comingSoon: false },
  { num:'03', icon:'hotspot', title:'Hotspot Deployment', desc:'High-density hotspot systems for hotels and estates. Includes captive portal, M-Pesa billing, and bandwidth management.', comingSoon: true },
  { num:'04', icon:'cctv', title:'CCTV & Surveillance', desc:'HD IP and analog CCTV installation with remote viewing setup. Protect your home or business professionally.', comingSoon: true },
  { num:'05', icon:'cable', title:'Structured Cabling', desc:'Cat5e/Cat6 data cabling, patch panels, and cable management for clean, scalable network infrastructure.', comingSoon: true },
  { num:'06', icon:'support', title:'IT Support', desc:'Ongoing network monitoring, remote and on-site troubleshooting, and preventive maintenance contracts.', comingSoon: false },
]

const STATS = [
  { num: 200, label: 'Installations', suffix: '+' },
  { num: 50,  label: 'Business Clients', suffix: '+' },
  { num: 5,   label: 'Years Experience', suffix: '+' },
]

const TESTIMONIALS = [
  { initials:'JM', name:'James Mutai', role:'Hotel Manager, Eldoret', text:'ITWORKS transformed our hotel\'s internet. Guests used to complain constantly — now it\'s one of our highest-rated features. The captive portal with M-Pesa is a game changer.' },
  { initials:'AK', name:'Aisha Kiptoo', role:'Office Manager, Nakuru', text:'Our office network was a mess before ITWORKS. They came in, ran Cat6 throughout the building, and now everything just works. Fast, clean, professional.' },
  { initials:'DN', name:'David Ng\'eno', role:'Homeowner, Eldoret', text:'They showed up on time, explained everything clearly, and our home WiFi now covers even the backyard. Highly recommend ITWORKS to anyone in Eldoret.' },
]

function ServiceIcon({ type }) {
  const icons = {
    wifi: <path d="M5 12.55a11 11 0 0 1 14.08 0"/>,
    network: <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></>,
    hotspot: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    cctv: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    cable: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    support: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {type === 'wifi' && <><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></>}
      {type !== 'wifi' && icons[type]}
    </svg>
  )
}

function Counter({ target, suffix }) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = target / 112
      const t = setInterval(() => {
        cur += step
        if (cur >= target) { ref.current && (ref.current.textContent = target); clearInterval(t); return }
        ref.current && (ref.current.textContent = Math.floor(cur))
      }, 16)
      obs.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span className="stat-num"><span ref={ref}>0</span><span className="plus">{suffix}</span></span>
}

export default function Home() {
  const revealRef = useReveal()
  const [stats, setStats] = useState(STATS)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => {
        if (data) {
          setStats([
            { num: data.installations || 200, label: 'Installations', suffix: '+' },
            { num: data.businessClients || 50, label: 'Business Clients', suffix: '+' },
            { num: data.yearsExperience || 5, label: 'Years Experience', suffix: '+' }
          ])
        }
      })
      .catch(err => console.log('Using local stats fallback:', err.message))
  }, [])

  return (
    <main ref={revealRef}>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-wifi">
          <svg viewBox="0 0 400 400" className="hw-svg">
            <defs>
              <filter id="gGlow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="oGlow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id="bgGlow" cx="50%" cy="62%" r="55%">
                <stop offset="0%" stopColor="#2BB04A" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#2BB04A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <ellipse cx="200" cy="248" rx="175" ry="155" fill="url(#bgGlow)" className="hw-bg"/>
            <path d="M 28 272 Q 200 38 372 272" fill="none" stroke="#2BB04A" strokeWidth="5" strokeLinecap="round" filter="url(#gGlow)" className="hw-arc hw-a1"/>
            <path d="M 72 284 Q 200 88 328 284" fill="none" stroke="#2BB04A" strokeWidth="4.5" strokeLinecap="round" filter="url(#gGlow)" className="hw-arc hw-a2"/>
            <path d="M 116 296 Q 200 138 284 296" fill="none" stroke="#2BB04A" strokeWidth="4" strokeLinecap="round" filter="url(#gGlow)" className="hw-arc hw-a3"/>
            <path d="M 156 308 Q 200 185 244 308" fill="none" stroke="#2BB04A" strokeWidth="3.5" strokeLinecap="round" filter="url(#gGlow)" className="hw-arc hw-a4"/>
            <path d="M 177 316 Q 200 220 223 316" fill="none" stroke="#2BB04A" strokeWidth="3" strokeLinecap="round" filter="url(#gGlow)" className="hw-arc hw-a5"/>
            <circle cx="200" cy="332" r="28" fill="none" stroke="#E8401A" strokeWidth="1.5" opacity="0.4" className="hw-ring hw-r1"/>
            <circle cx="200" cy="332" r="18" fill="none" stroke="#E8401A" strokeWidth="2" opacity="0.7" className="hw-ring hw-r2"/>
            <circle cx="200" cy="332" r="11" fill="#E8401A" filter="url(#oGlow)" className="hw-dot"/>
            <circle cx="200" cy="332" r="6" fill="#ff7a55"/>
          </svg>
          <div className="hw-badge">
            <div className="hw-badge-label">Network Uptime</div>
            <div className="hw-badge-val">99.9%</div>
            <div className="hw-badge-sub">Guaranteed reliability</div>
          </div>
          <div className="hw-badge2">
            <div className="hw-b2-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div>
              <div className="hw-b2-title">Fast Setup</div>
              <div className="hw-b2-sub">Same-day installation</div>
            </div>
          </div>
          <div className="hw-live">
            <div className="hw-live-dot" />
            <div className="hw-live-text">Live Network</div>
          </div>
          <div className="hw-bars">
            <div className="hw-bar"/><div className="hw-bar"/>
            <div className="hw-bar"/><div className="hw-bar"/>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            <span>Eldoret's #1 Connectivity Provider</span>
          </div>
          <h1 className="hero-title">
            <span className="line1">We Keep</span>
            <span className="line2">You Connected.</span>
            <span className="line3">Always.</span>
          </h1>
          <p className="hero-sub">Professional WiFi installation, enterprise networking, and hotspot deployment across Eldoret and North Rift Kenya. <strong>Reliable. Fast. Professionally Done.</strong></p>
          <div className="hero-actions">
            <Link to="/contact" className="btn-primary">
              Get a Free Quote
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/projects" className="btn-ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {['WiFi Installation','Office Networks','Hotspot Deployment','CCTV & Surveillance','IT Support','Structured Cabling','Eldoret Kenya','Reliable. Fast. Professional',
            'WiFi Installation','Office Networks','Hotspot Deployment','CCTV & Surveillance','IT Support','Structured Cabling','Eldoret Kenya','Reliable. Fast. Professional']
            .map((item, i) => (
            <div className="ticker-item" key={i}>
              <span>{item}</span><div className="ticker-dot"/>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="services-strip">
        <div className="services-strip-header">
          <div>
            <div className="section-label reveal">What We Do</div>
            <h2 className="section-title reveal reveal-delay-1">Our <span>Services</span></h2>
            <p className="section-sub reveal reveal-delay-2">End-to-end connectivity solutions built for homes, businesses, and institutions across Kenya.</p>
          </div>
          <Link to="/services" className="btn-ghost reveal reveal-delay-2">View All Services →</Link>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div className={`service-card reveal reveal-delay-${i % 3}`} key={s.num}>
              <span className="service-num">{s.num}</span>
              <div className="service-icon"><ServiceIcon type={s.icon}/></div>
              <h3>
                {s.title}
                {s.comingSoon && <span className="badge-coming-soon">Soon</span>}
              </h3>
              <p>{s.desc}</p>
              {s.comingSoon ? (
                <Link to={`/contact?interest=${encodeURIComponent(s.title)}`} className="service-link" style={{color: '#f59e0b'}}>
                  Register Interest <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              ) : (
                <Link to="/services" className="service-link">
                  Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-inner">
          <div className="stats-left">
            <div className="section-label reveal">By The Numbers</div>
            <h2 className="section-title reveal reveal-delay-1">Trusted by<br/><span>Hundreds</span><br/>Across Kenya</h2>
            <p className="reveal reveal-delay-2">From single-room WiFi to multi-floor enterprise networks — we've built a reputation on reliability, professionalism, and results that last.</p>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className={`stat-card reveal reveal-delay-${i}`} key={s.label}>
                <Counter target={s.num} suffix={s.suffix}/>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
            <div className="stat-card reveal reveal-delay-3">
              <span className="stat-num">24<span className="plus">/7</span></span>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="testi-header">
          <div className="section-label reveal">What Clients Say</div>
          <h2 className="section-title reveal reveal-delay-1">Real Results,<br/><span>Real People</span></h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className={`testi-card reveal reveal-delay-${i}`} key={t.name}>
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-stars">{'★'.repeat(5)}</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-content">
            <div className="section-label reveal">Get Connected Today</div>
            <h2 className="reveal reveal-delay-1">Ready to <span>Get</span><br/>Connected?</h2>
            <p className="reveal reveal-delay-2">Contact us today for a free site survey and quote. We respond within the hour during business hours.</p>
          </div>
          <div className="cta-actions reveal reveal-delay-2">
            <a href="https://wa.me/254142445499" className="cta-btn cta-btn-wa">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Chat on WhatsApp</span><span className="value">014 2445499</span></div>
            </a>
            <a href="tel:+254142445499" className="cta-btn cta-btn-call">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Call Us Directly</span><span className="value">014 2445499</span></div>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
