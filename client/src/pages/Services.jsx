import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './Services.css'

const SERVICES = [
  { id:'wifi', cat:'Home & Residential', title:'Home WiFi Setup', tagline:'Full-home coverage · Router configuration · Signal optimisation',
    desc:'Patchy internet and dead zones end here. We conduct a full site survey before every job, mapping your layout to determine exactly where routers and access points should be placed for complete, consistent coverage.',
    features:['Full site survey and signal mapping','Professional router and access point placement','Cable routing and concealment','Password security, guest network, and parental controls','Works with all Kenyan ISPs — Safaricom, Zuku, Faiba','30-day post-installation support guarantee'],
    tiers:['Basic','Standard','Premium'] },
  { id:'networks', cat:'Enterprise', title:'Office & Enterprise Networks', tagline:'LAN/WAN design · Managed switches · Enterprise access points · VLAN',
    desc:'A slow or unreliable office network costs your business time and money every single day. We design and install enterprise-grade infrastructure built for performance, security, and scalability.',
    features:['Complete network architecture design','Enterprise-grade access points (Ubiquiti, TP-Link, Cisco)','PoE switch installation and rack setup','VLAN configuration and guest network segmentation','Firewall setup and network security hardening','Full network documentation and handover report'],
    tiers:['Small Office','Mid-size','Enterprise'] },
  { id:'hotspot', cat:'Hotels & Estates', title:'Hotspot & Captive Portal', tagline:'M-Pesa billing · Branded portal · Bandwidth management · MikroTik',
    desc:'Turn your internet connection into a managed, monetisable service. Ideal for hotels, apartment blocks, schools, and co-working spaces. Integrated M-Pesa payments mean guests pay instantly from their phones.',
    features:['Custom-branded captive portal','M-Pesa STK push and voucher payment integration','Per-user bandwidth throttling and session limits','MikroTik and Radius billing system','Real-time usage dashboard and reports','Remote monitoring and support included'],
    tiers:['Small Venue','Hotel / Block','Large Campus'] },
  { id:'cctv', cat:'Security', title:'CCTV & Surveillance', tagline:'HD IP cameras · Remote viewing · DVR/NVR setup · Mobile app',
    desc:'Professional CCTV installation for homes, offices, warehouses, and perimeter security. We design camera placement for maximum coverage with minimal blind spots and set up remote viewing worldwide.',
    features:['Site survey and strategic camera placement','HD IP and analog camera installation','DVR/NVR setup with local and cloud storage','Mobile app configuration (iOS & Android)','Night vision and motion detection setup','Cable management and concealment'],
    tiers:['Home (4 cams)','Office (8 cams)','Perimeter'] },
  { id:'cabling', cat:'Infrastructure', title:'Structured Cabling', tagline:'Cat5e / Cat6 · Patch panels · Cable trays · Certified runs',
    desc:'Clean, organised cabling is the backbone of any reliable network. Our structured cabling delivers properly routed, labelled, and documented data cables — scalable, serviceable, and built to last.',
    features:['Cat5e and Cat6 data cabling','Cable tray, conduit, and raceway installation','Patch panel and network rack installation','All cable runs tested and certified','Cable labelling and full documentation','Suitable for new builds and retrofits'],
    tiers:['Small Office','Medium','Large Building'] },
  { id:'support', cat:'Ongoing Support', title:'IT Support & Maintenance', tagline:'Remote & on-site · Monthly contracts · Network monitoring · Priority SLA',
    desc:'Network problems don\'t wait for convenient times. Our IT support contracts give your business a dedicated technical partner available remotely and on-site to keep your infrastructure running smoothly.',
    features:['Monthly and annual support contracts','Remote troubleshooting with guaranteed response times','On-site visits included in contract','Proactive network health monitoring and alerts','Router, switch, and AP firmware updates','Priority SLA for contracted clients'],
    tiers:['Monthly','Quarterly','Annual'] },
]

const FAQS = [
  { q:'Do you provide the equipment or do I need to buy my own?', a:'We can supply all equipment as part of the service, or install hardware you\'ve already purchased. We\'ll recommend the right equipment during the site survey. Supplied equipment comes with a manufacturer warranty.' },
  { q:'How long does a typical WiFi installation take?', a:'A standard home WiFi installation takes 2–4 hours. Office network installations vary from half a day to multiple days depending on size and complexity. We\'ll give you a clear timeline before we start.' },
  { q:'Do you serve areas outside Eldoret?', a:'Yes. While Eldoret is our primary base, we regularly serve clients in Nakuru, Kisumu, Kitale, Iten, and other towns across the North Rift and Western Kenya. Travel fees may apply for distant sites.' },
  { q:'What ISPs do you work with?', a:'We work with all major ISPs in Kenya — Safaricom Home Fibre, Zuku, Faiba, Liquid Home, and others. We\'re ISP-agnostic and will optimise your network regardless of your provider.' },
  { q:'Is there a warranty on your work?', a:'All our installations come with a 30-day workmanship guarantee. If anything related to our installation doesn\'t perform as expected within that period, we\'ll return and fix it at no extra charge.' },
  { q:'How do I get started?', a:'Simply WhatsApp, call, or fill in the contact form. Tell us your location, the type of service you need, and a brief description of your space. We\'ll respond within the hour during business hours.' },
]

const FILTERS = ['All Services','WiFi','Networks','Hotspot','CCTV','Cabling','IT Support']
const FILTER_MAP = {'All Services':null,'WiFi':'wifi','Networks':'networks','Hotspot':'hotspot','CCTV':'cctv','Cabling':'cabling','IT Support':'support'}

export default function Services() {
  const [open, setOpen] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)
  const [filter, setFilter] = useState('All Services')
  const revealRef = useReveal()

  const filtered = filter === 'All Services' ? SERVICES : SERVICES.filter(s => s.id === FILTER_MAP[filter])

  return (
    <main ref={revealRef}>
      <section className="page-hero">
        <div className="page-hero-bg"/><div className="hero-grid"/>
        <div className="page-hero-inner">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span style={{color:'#fff'}}>Services</span></div>
          <div className="section-label" style={{animation:'fadeUp 0.7s ease both'}}>What We Offer</div>
          <h1 style={{animation:'fadeUp 0.7s 0.1s ease both'}}>Solutions <span>Built</span><br/>for Real Kenya.</h1>
          <p style={{animation:'fadeUp 0.7s 0.2s ease both',marginTop:16}}>Six core services. Every one executed with professionalism, precision, and a deep understanding of what connectivity means to homes and businesses across Kenya.</p>
        </div>
      </section>

      <div className="services-filter">
        <div className="filter-inner">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <section className="services-main">
        <div className="services-list">
          {filtered.map((s, i) => (
            <div key={s.id} className={`service-block reveal ${open === s.id ? 'open' : ''}`}>
              <div className="service-block-header" onClick={() => setOpen(open === s.id ? null : s.id)}>
                <div className="svc-num">0{i+1}</div>
                <div className="svc-header-content">
                  <div className="svc-icon-row">
                    <div className="svc-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg></div>
                    <span className="svc-tag">{s.cat}</span>
                  </div>
                  <div className="svc-title">{s.title}</div>
                  <div className="svc-tagline">{s.tagline}</div>
                </div>
                <div className="svc-toggle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </div>
              <div className="service-block-body">
                <div className="svc-body-inner">
                  <div>
                    <p className="svc-description">{s.desc}</p>
                    <ul className="svc-features">{s.features.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                  <div>
                    <div className="svc-pricing">
                      <div className="svc-pricing-label">Service Tiers</div>
                      <div className="pricing-tiers">
                        {s.tiers.map((t,ti) => <span key={t} className={`tier tier-${['basic','standard','premium'][ti]}`}>{t}</span>)}
                      </div>
                      <div className="svc-pricing-note">Pricing depends on site requirements. Contact us for a free survey and accurate quote.</div>
                    </div>
                    <div className="svc-cta-group">
                      <a href="https://wa.me/254700000000" className="btn-primary">Request on WhatsApp</a>
                      <Link to="/contact" className="btn-ghost">Get a Free Quote</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-header">
            <div className="section-label reveal" style={{justifyContent:'center'}}>Common Questions</div>
            <h2 className="section-title reveal reveal-delay-1" style={{textAlign:'center'}}>Got <span>Questions?</span></h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item reveal ${faqOpen === i ? 'open' : ''}`}>
                <div className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <div className="faq-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                </div>
                <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-content">
            <div className="section-label reveal">Start Today</div>
            <h2 className="reveal reveal-delay-1">Let's Build<br/><span>Something</span><br/>That Works.</h2>
            <p className="reveal reveal-delay-2">Free site survey. No obligation. We'll come to you and give you an honest quote — usually within the same day.</p>
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
