import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './Projects.css'

const PROJECTS = [
  { id:'hotel-hotspot', category:'hotspot', title:'Eldoret City Hotel — Full Hotspot System', location:'Eldoret CBD, Uasin Gishu', tag:'M-Pesa Billing', large:true,
    desc:'Designed and deployed a full hotel-wide hotspot system across 3 floors and 80 rooms. Includes a branded captive portal, M-Pesa STK push payment integration, voucher-based access, and per-user bandwidth controls.',
    tags:['M-Pesa Billing','Branded Portal','80 Rooms','MikroTik','Remote Monitoring'] },
  { id:'office-network', category:'networks', title:'SACCO HQ — 3-Floor Network', location:'Eldoret Town', tag:'VLAN + PoE Switches',
    desc:'Full network infrastructure design and installation across 3 floors. Included Cat6 structured cabling, PoE switch rack, VLAN segmentation for staff/guest/management traffic, and enterprise Ubiquiti access points.',
    tags:['Cat6 Cabling','VLAN Segmentation','Ubiquiti APs','PoE Rack','Network Documentation'] },
  { id:'home-wifi', category:'wifi', title:'5-Bedroom Residence — Full Coverage', location:'Elgon View, Eldoret', tag:'Mesh Network',
    desc:'Complete home WiFi overhaul. Site survey revealed 3 dead zones. Deployed a mesh network with 3 access points, cable concealment, and a separate IoT network for smart home devices.',
    tags:['Mesh Network','Dead Zone Eliminated','3 Access Points','Smart Home','30-Day Guarantee'] },
  { id:'cctv-supermarket', category:'cctv', title:'Supermarket — 12-Camera System', location:'Langas, Eldoret', tag:'Remote Viewing',
    desc:'12-camera HD IP surveillance system covering all entry/exit points, cashier areas, storage rooms, and the car park. NVR configured with 30-day cloud backup and motion alerts.',
    tags:['12 HD Cameras','Cloud Backup','Motion Detection','Mobile Viewing','Car Park Coverage'] },
  { id:'estate-hotspot', category:'hotspot', title:'Residential Estate — 80 Units', location:'Kapsaret, Eldoret', tag:'Voucher System',
    desc:'Large-scale hotspot deployment across an 80-unit gated estate with outdoor weatherproof access points. Residents purchase vouchers via M-Pesa or at the estate office.',
    tags:['80 Units','Outdoor APs','Voucher System','M-Pesa','Bandwidth Management'] },
  { id:'cabling-office', category:'cabling', title:'Microfinance Office — Cat6 Full Build', location:'Eldoret CBD', tag:'40 Workstations',
    desc:'Complete structured cabling project for a microfinance institution with 40 workstations across 2 floors. All Cat6 runs certified, labelled, and documented with patch panels and server rack.',
    tags:['40 Workstations','Cat6 Certified','Patch Panel','Server Rack','Cable Trays'] },
  { id:'school-wifi', category:'wifi', title:'Secondary School — Campus Network', location:'Nandi Hills', tag:'Computer Lab + Staff',
    desc:'Full campus network covering the computer lab (30 PCs), staff room, library, and administration block. Separate segments for students and staff with content filtering.',
    tags:['Computer Lab','Staff Network','Content Filtering','Library Coverage','Server Room'] },
  { id:'clinic-network', category:'networks', title:'Private Clinic — Secure Medical Network', location:'Kitale, Trans Nzoia', tag:'HIPAA-Ready',
    desc:'Secure network infrastructure with separate VLANs for clinical systems, admin computers, and patient Wi-Fi. Appropriate access controls to protect sensitive medical data.',
    tags:['Medical Network','VLAN Isolation','Guest WiFi','Access Control','Kitale'] },
  { id:'warehouse-cctv', category:'cctv', title:'Warehouse — Perimeter + Interior', location:'Industrial Area, Eldoret', tag:'Night Vision',
    desc:'Comprehensive CCTV coverage including perimeter fence lines, loading bays, storage areas, and office entry points. Full HD with IR night vision and RAID storage.',
    tags:['Perimeter Coverage','Night Vision','Loading Bay','RAID Storage','Security Access'] },
]

const FILTERS = ['All Projects','Home WiFi','Office Networks','Hotspot','CCTV','Cabling']
const FILTER_MAP = {'All Projects':null,'Home WiFi':'wifi','Office Networks':'networks','Hotspot':'hotspot','CCTV':'cctv','Cabling':'cabling'}

const ICON_COLORS = { wifi:'rgba(43,176,74,0.15)', networks:'rgba(43,176,74,0.15)', hotspot:'rgba(232,64,26,0.15)', cctv:'rgba(100,100,255,0.15)', cabling:'rgba(255,180,0,0.15)' }
const ICON_STROKE = { wifi:'#2BB04A', networks:'#2BB04A', hotspot:'#E8401A', cctv:'#8888ff', cabling:'#ffb400' }

function ProjectIcon({ cat }) {
  const stroke = ICON_STROKE[cat]
  const bg = ICON_COLORS[cat]
  return (
    <div className="proj-icon-wrap" style={{ background: bg, borderColor: stroke }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        {cat === 'wifi' && <><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill={stroke}/></>}
        {cat === 'networks' && <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" strokeLinecap="round"/></>}
        {cat === 'hotspot' && <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>}
        {cat === 'cctv' && <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>}
        {cat === 'cabling' && <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>}
      </svg>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All Projects')
  const [lightbox, setLightbox] = useState(null)
  const revealRef = useReveal()

  const filtered = filter === 'All Projects' ? PROJECTS : PROJECTS.filter(p => p.category === FILTER_MAP[filter])
  const lb = PROJECTS.find(p => p.id === lightbox)

  return (
    <main ref={revealRef}>
      <section className="page-hero">
        <div className="page-hero-bg"/><div className="hero-grid"/>
        <div className="page-hero-inner">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span style={{color:'#fff'}}>Projects</span></div>
          <div className="section-label" style={{animation:'fadeUp 0.7s ease both'}}>Our Work</div>
          <h1 style={{animation:'fadeUp 0.7s 0.1s ease both'}}>Our Work<br/><span>Speaks</span><br/>For Itself.</h1>
          <p style={{animation:'fadeUp 0.7s 0.2s ease both',marginTop:16}}>From single-room home setups to full enterprise deployments — every project was delivered on time, professionally installed, and built to last.</p>
        </div>
      </section>

      <div className="projects-filter">
        <div className="filter-inner">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <section className="projects-section">
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <div key={p.id} className={`project-card reveal ${p.large ? 'large' : ''}`} onClick={() => setLightbox(p.id)}>
              <div className="project-img">
                <div className="project-placeholder">
                  <div className="proj-rings"><div className="proj-ring"/><div className="proj-ring"/><div className="proj-ring"/></div>
                  <ProjectIcon cat={p.category}/>
                  <div className="proj-placeholder-label">{p.category.toUpperCase()}</div>
                </div>
                <div className="project-overlay"><span>Click to View Details →</span></div>
              </div>
              <div className="project-meta">
                <div className="proj-cat">{p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {p.location}
                </div>
                <span className="proj-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="stats-strip">
        <div className="stats-strip-inner">
          {[{n:200,s:'+',l:'Total Projects'},{n:15,s:'+',l:'Towns Served'},{n:98,s:'%',l:'Client Satisfaction'},{n:50,s:'+',l:'Business Clients'}].map((s,i)=>(
            <div key={s.l} className={`strip-stat reveal reveal-delay-${i}`}>
              <div className="strip-num">{s.n}<span>{s.s}</span></div>
              <div className="strip-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-content">
            <div className="section-label reveal">Your Project Next</div>
            <h2 className="reveal reveal-delay-1">Want Results<br/>Like <span>These?</span></h2>
            <p className="reveal reveal-delay-2">Contact us today for a free site survey. We'll assess your space and deliver results you can be proud of.</p>
          </div>
          <div className="cta-actions reveal reveal-delay-2">
            <a href="https://wa.me/254700000000" className="cta-btn cta-btn-wa">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Chat on WhatsApp</span><span className="value">+254 700 000 000</span></div>
            </a>
            <Link to="/contact" className="cta-btn cta-btn-call">
              <div className="cta-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg></div>
              <div className="cta-btn-text"><span className="label">Get a Free Quote</span><span className="value">Contact Us</span></div>
            </Link>
          </div>
        </div>
      </section>

      {lb && (
        <div className="lightbox open" onClick={e => e.target.className.includes('lightbox') && setLightbox(null)}>
          <div className="lb-inner">
            <button className="lb-close" onClick={() => setLightbox(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="lb-visual"><ProjectIcon cat={lb.category}/></div>
            <div className="lb-body">
              <div className="lb-cat">{lb.category}</div>
              <div className="lb-title">{lb.title}</div>
              <p className="lb-desc">{lb.desc}</p>
              <div className="lb-tags">{lb.tags.map(t => <span key={t} className="lb-tag">{t}</span>)}</div>
              <div className="lb-actions">
                <Link to="/contact" className="btn-primary" onClick={() => setLightbox(null)}>Get a Similar Quote →</Link>
                <a href="https://wa.me/254700000000" className="btn-ghost">WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
