import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', email:'', service:'', location:'', size:'', message:'' })
  const [status, setStatus] = useState('idle')
  const revealRef = useReveal()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) { setStatus('success'); setForm({ firstName:'', lastName:'', phone:'', email:'', service:'', location:'', size:'', message:'' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <main ref={revealRef}>
      <section className="page-hero">
        <div className="page-hero-bg"/><div className="hero-grid"/>
        <div className="page-hero-inner">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span style={{color:'#fff'}}>Contact</span></div>
          <div className="section-label" style={{animation:'fadeUp 0.7s ease both'}}>Get In Touch</div>
          <h1 style={{animation:'fadeUp 0.7s 0.1s ease both'}}>Let's Build<br/><span>Something</span><br/>That Works.</h1>
          <p style={{animation:'fadeUp 0.7s 0.2s ease both',marginTop:16}}>Free site survey. Honest quote. No obligation. We respond within the hour during business hours.</p>
        </div>
      </section>

      <div className="quick-contact">
        <div className="quick-grid">
          <a href="https://wa.me/254700000000" className="quick-card wa reveal" target="_blank" rel="noreferrer">
            <div className="quick-icon quick-icon-wa"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
            <div><div className="quick-label">Fastest Response</div><div className="quick-value">WhatsApp Us</div><div className="quick-sub">+254 700 000 000 — usually within minutes</div></div>
            <div className="quick-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
          </a>
          <a href="tel:+254700000000" className="quick-card reveal reveal-delay-1">
            <div className="quick-icon quick-icon-call"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg></div>
            <div><div className="quick-label">Call Directly</div><div className="quick-value">+254 700 000 000</div><div className="quick-sub">Mon–Sat 8am–6pm</div></div>
            <div className="quick-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
          </a>
          <a href="mailto:info@itworks.co.ke" className="quick-card reveal reveal-delay-2">
            <div className="quick-icon quick-icon-email"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <div><div className="quick-label">Send an Email</div><div className="quick-value">info@itworks.co.ke</div><div className="quick-sub">We respond within 4 hours</div></div>
            <div className="quick-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
          </a>
        </div>
      </div>

      <section className="contact-main">
        <div className="contact-inner">
          <div className="contact-form-wrap reveal">
            <div className="form-title">Request a Free Quote</div>
            <div className="form-sub">Fill in the form and we'll get back to you within the hour. A free site survey is included with every quote.</div>
            {status === 'success' ? (
              <div className="form-success"><p>✓ Message sent! We'll be in touch within the hour.</p></div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group"><label>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" required/></div>
                  <div className="form-group"><label>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Kamau" required/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Phone / WhatsApp *</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX" required/></div>
                  <div className="form-group"><label>Email Address</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com"/></div>
                </div>
                <div className="form-group">
                  <label>Service Interested In *</label>
                  <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="" disabled>Select a service...</option>
                    <option>Home WiFi Setup</option>
                    <option>Office & Enterprise Networks</option>
                    <option>Hotspot & Captive Portal</option>
                    <option>CCTV & Surveillance</option>
                    <option>Structured Cabling</option>
                    <option>IT Support & Maintenance</option>
                    <option>Multiple Services</option>
                    <option>Not Sure — Need Advice</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Your Location *</label><input name="location" value={form.location} onChange={handleChange} placeholder="Eldoret, Nakuru..." required/></div>
                  <div className="form-group">
                    <label>Property Size</label>
                    <select name="size" value={form.size} onChange={handleChange}>
                      <option value="">Select size...</option>
                      <option>Single room / Apartment</option>
                      <option>3–5 bedroom home</option>
                      <option>Large home / Villa</option>
                      <option>Small office (1–10 staff)</option>
                      <option>Medium office (10–50 staff)</option>
                      <option>Large office / Building</option>
                      <option>Hotel / Estate</option>
                      <option>School / Institution</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Additional Details</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more — current ISP, number of floors, specific challenges, timeline..." rows={4}/></div>
                {status === 'error' && <p className="form-error">Something went wrong. Please WhatsApp us directly.</p>}
                <button type="submit" className="form-submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send My Request
                  </>}
                </button>
                <p className="form-note">We never share your data. By submitting you agree to be contacted by ITWORKS Technologies Limited.</p>
              </form>
            )}
          </div>

          <div className="contact-info reveal reveal-delay-1">
            <div className="info-block">
              <div className="info-block-title">Contact Details</div>
              {[
                { icon:<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>, label:'Phone & WhatsApp', val:'+254 700 000 000', sub:'Call or WhatsApp — same number', href:'tel:+254700000000' },
                { icon:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, label:'Email', val:'info@itworks.co.ke', sub:'Responds within 4 hours', href:'mailto:info@itworks.co.ke' },
                { icon:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>, label:'Office Location', val:'Eldoret CBD, Eldoret', sub:'Uasin Gishu County, Kenya', href:null },
              ].map((item, i) => (
                <div key={i} className="info-item">
                  <div className="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg></div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    {item.href ? <a href={item.href}><div className="info-val">{item.val}</div></a> : <div className="info-val">{item.val}</div>}
                    <div className="info-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-block">
              <div className="info-block-title">Business Hours</div>
              <div className="hours-grid">
                {[['Monday – Friday','8:00 AM – 6:00 PM',false],['Saturday','9:00 AM – 4:00 PM',false],['Sunday','By Appointment',true],['Public Holidays','Emergency Only',true]].map(([day,time,closed])=>(
                  <div key={day} className="hours-row">
                    <span className="hours-day">{day}</span>
                    <span className={`hours-time ${closed?'closed':''}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-wrap">
              <iframe className="map-embed-contact" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127578.82836782565!2d35.21667!3d0.52036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1780d5b5a55e6bbd%3A0x8a9c13c5a64ba9e4!2sEldoret!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske" allowFullScreen="" loading="lazy" title="ITWORKS Location"></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
