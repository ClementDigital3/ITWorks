import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './About.css'

const TEAM = [
  { initials:'JK', name:'John Kibet', role:'Founder & CEO', bio:'Network engineer with 8+ years in ICT infrastructure across Kenya and East Africa.', color:'av-green' },
  { initials:'SM', name:'Sarah Mutai', role:'Head of Operations', bio:'Ensures every project is delivered on time, within scope, and to the highest standard.', color:'av-orange' },
  { initials:'DK', name:'David Korir', role:'Senior Network Engineer', bio:'Specialist in enterprise networking, MikroTik, and hotspot billing systems.', color:'av-blue' },
  { initials:'AJ', name:'Alice Jepkoech', role:'Client Support Lead', bio:'Your first point of contact — responsive, knowledgeable, and always solutions-focused.', color:'av-teal' },
]

const VALUES = [
  { num:'01', title:'Reliability', desc:'We show up when we say we will. We fix what we say we\'ll fix. Your uptime is our responsibility — backed by a 30-day workmanship guarantee.', icon:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
  { num:'02', title:'Professionalism', desc:'Clean cable runs, clear documentation, on-time arrivals, and honest pricing. We treat every client\'s home or business with the same respect we\'d want for our own.', icon:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
  { num:'03', title:'Innovation', desc:'From MikroTik and Ubiquiti to M-Pesa billing integrations and modern IP camera systems — we bring the latest solutions to the Kenyan market.', icon:<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/> },
]

const AREAS = ['Eldoret (HQ)','Nakuru','Kisumu','Kitale','Iten','Kapsabet','Nandi Hills','Uasin Gishu','Trans Nzoia','Nairobi (Enterprise)']

export default function About() {
  const revealRef = useReveal()
  return (
    <main ref={revealRef}>
      <section className="page-hero">
        <div className="page-hero-bg"/><div className="hero-grid"/>
        <div className="page-hero-inner">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span style={{color:'#fff'}}>About</span></div>
          <div className="section-label" style={{animation:'fadeUp 0.7s ease both'}}>Our Story</div>
          <h1 style={{animation:'fadeUp 0.7s 0.1s ease both'}}>Built on <span>Trust.</span><br/>Powered by<br/>Technology.</h1>
          <p style={{animation:'fadeUp 0.7s 0.2s ease both',marginTop:16}}>We're not just an IT company. We're the team that shows up on time, explains everything clearly, does the work right, and comes back when you need us.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="story-inner">
          <div className="story-content reveal">
            <div className="section-label">Who We Are</div>
            <h2 className="section-title">The Team<br/>Behind the<br/><span>Connection</span></h2>
            <p style={{marginTop:20}}>ITWORKS Technologies Limited was founded with a clear mission: to bring reliable, professional, and affordable connectivity to homes and businesses in Eldoret and across Kenya. We saw a gap — a market full of ISPs, but not enough companies focused on the <strong>installation, configuration, and ongoing support</strong> that actually makes internet work well.</p>
            <p style={{marginTop:16}}>From our base in Eldoret, we've grown to serve clients across the North Rift. Every job, regardless of size, gets the same level of attention, professionalism, and quality workmanship.</p>
            <p style={{marginTop:16}}>We're a team of <strong>certified network engineers and IT professionals</strong> who take pride in clean installations, clear communication, and results that last.</p>
          </div>
          <div className="story-visual reveal reveal-delay-1">
            <div className="story-card">
              <div className="story-big-text">IT<br/>WORKS</div>
              <div className="story-quote">"Connecting Eldoret.<br/>Building Kenya."</div>
              <div className="story-attr">ITWORKS Technologies Limited</div>
              <div className="story-dots"><div className="dot active"/><div className="dot"/><div className="dot"/></div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="mission-inner">
          <div className="section-label reveal" style={{justifyContent:'center'}}>Our Mission</div>
          <div className="mission-statement reveal reveal-delay-1">
            To connect every <span>home, office,</span><br/>and institution in Kenya with<br/><span>reliable, fast, and affordable</span><br/>internet infrastructure.
          </div>
          <p className="mission-sub reveal reveal-delay-2">We believe that fast, reliable internet is not a luxury — it's infrastructure. Every student, business owner, hotel guest, and family deserves a connection that just works.</p>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="values-header">
          <div className="section-label reveal" style={{justifyContent:'center'}}>What We Stand For</div>
          <h2 className="section-title reveal reveal-delay-1" style={{textAlign:'center'}}>Our <span>Values</span></h2>
        </div>
        <div className="values-grid">
          {VALUES.map((v,i) => (
            <div key={v.num} className={`value-card reveal reveal-delay-${i}`}>
              <span className="value-num">{v.num}</span>
              <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{v.icon}</svg></div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <div className="team-header">
          <div className="section-label reveal" style={{justifyContent:'center'}}>The People</div>
          <h2 className="section-title reveal reveal-delay-1" style={{textAlign:'center'}}>Meet the <span>Team</span></h2>
        </div>
        <div className="team-grid">
          {TEAM.map((m,i) => (
            <div key={m.name} className={`team-card reveal reveal-delay-${i % 3}`}>
              <div className={`team-avatar ${m.color}`}>{m.initials}</div>
              <h4>{m.name}</h4>
              <div className="role">{m.role}</div>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="area-section">
        <div className="area-inner">
          <div className="area-content reveal">
            <div className="section-label">Where We Serve</div>
            <h2 className="section-title">Eldoret &<br/>Beyond<br/><span>Kenya</span></h2>
            <p style={{marginTop:20,fontSize:16,color:'var(--grey2)',lineHeight:1.8}}>Our base is Eldoret — but our clients aren't limited to the city. We regularly serve businesses, schools, hotels, and homes across the North Rift region and Western Kenya.</p>
            <div className="area-tags">
              {AREAS.map(a => <span key={a} className={`area-tag ${a.includes('HQ') ? 'primary' : ''}`}>{a}</span>)}
            </div>
            <Link to="/contact" className="btn-primary">
              Check If We Serve Your Area
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div className="reveal reveal-delay-1">
            <div className="map-placeholder">
              <iframe className="map-embed" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127578.82836782565!2d35.21667!3d0.52036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1780d5b5a55e6bbd%3A0x8a9c13c5a64ba9e4!2sEldoret!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske" allowFullScreen="" loading="lazy" title="Eldoret Map"></iframe>
              <div className="map-overlay"/>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-content">
            <div className="section-label reveal">Work With Us</div>
            <h2 className="reveal reveal-delay-1">Let's Build<br/><span>Your Network</span><br/>Together.</h2>
            <p className="reveal reveal-delay-2">Free site survey. Honest quote. Professional installation. Call or WhatsApp us today.</p>
          </div>
          <div className="cta-actions reveal reveal-delay-2">
            <a href="https://wa.me/254700000000" className="cta-btn cta-btn-wa">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Chat on WhatsApp</span><span className="value">+254 700 000 000</span></div>
            </a>
            <a href="tel:+254700000000" className="cta-btn cta-btn-call">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Call Us Directly</span><span className="value">+254 700 000 000</span></div>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
