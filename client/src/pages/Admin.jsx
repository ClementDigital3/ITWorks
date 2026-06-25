import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'services' | 'about' | 'contacts' | 'reviews' | 'analytics'
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [contacts, setContacts] = useState([])
  const [adminReviews, setAdminReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null) // { text: string, type: 'success' | 'error' }

  // Leads Filters & Expanders State
  const [expandedContactId, setExpandedContactId] = useState(null)
  const [contactSearch, setContactSearch] = useState('')
  const [contactStatusFilter, setContactStatusFilter] = useState('all')
  const [contactServiceFilter, setContactServiceFilter] = useState('all')

  // Form State for Projects and Services
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null for create, id for update

  // Projects Form Fields
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'wifi',
    location: '',
    tag: '',
    description: '',
    tags: '',
    featured: false,
    large: false
  })

  // Services Form Fields
  const [serviceForm, setServiceForm] = useState({
    slug: '',
    title: '',
    tagline: '',
    tag: '',
    description: '',
    features: '',
    tiers: '',
    icon: 'wifi',
    order: 0,
    comingSoon: false
  })

  // About Page Form Fields
  const [aboutForm, setAboutForm] = useState({
    storyTitle: '',
    storyParagraphs: '',
    missionTitle: '',
    missionStatement: '',
    missionSub: '',
    values: [],
    team: [],
    areas: '',
    areaTitle: '',
    areaText: ''
  })
  const [aboutSaving, setAboutSaving] = useState(false)

  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    try {
      const projRes = await fetch('/api/projects')
      const projData = await projRes.json()
      setProjects(projData)

      const servRes = await fetch('/api/services')
      const servData = await servRes.json()
      if (servData.success) {
        setServices(servData.data)
      } else {
        setServices(servData)
      }

      const aboutRes = await fetch('/api/about')
      const aboutData = await aboutRes.json()
      if (aboutData) {
        setAboutForm({
          storyTitle: aboutData.storyTitle || '',
          storyParagraphs: Array.isArray(aboutData.storyParagraphs) ? aboutData.storyParagraphs.join('\n\n') : '',
          missionTitle: aboutData.missionTitle || '',
          missionStatement: aboutData.missionStatement || '',
          missionSub: aboutData.missionSub || '',
          values: aboutData.values || [],
          team: aboutData.team || [],
          areas: Array.isArray(aboutData.areas) ? aboutData.areas.join(', ') : '',
          areaTitle: aboutData.areaTitle || '',
          areaText: aboutData.areaText || ''
        })
      }

      // Fetch Contacts securely
      const contactRes = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (contactRes.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }
      const contactData = await contactRes.json()
      if (Array.isArray(contactData)) {
        setContacts(contactData)
      } else {
        setContacts([])
      }

      // Fetch Reviews securely
      const reviewRes = await fetch('/api/reviews/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (reviewRes.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }
      const reviewData = await reviewRes.json()
      if (Array.isArray(reviewData)) {
        setAdminReviews(reviewData)
      } else {
        setAdminReviews([])
      }
    } catch (err) {
      showMsg('Failed to load database items.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token)
        setToken(data.token)
        setUsername('')
        setPassword('')
      } else {
        setAuthError(data.message || 'Invalid username or password')
      }
    } catch (err) {
      setAuthError('Connection error. Server may be offline.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
    showMsg('Signed out successfully.')
  }

  const handleContactStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()
      if (res.ok && (data._id || data.success)) {
        showMsg('Lead status updated successfully!')
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c))
      } else {
        showMsg(data.error || 'Failed to update lead status.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    }
  }

  const handleReviewStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()
      if (res.ok && (data._id || data.success)) {
        showMsg('Review status updated successfully!')
        setAdminReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r))
      } else {
        showMsg(data.error || 'Failed to update review status.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    }
  }

  const handleReviewDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()
      if (res.ok && data.success) {
        showMsg('Review deleted successfully!')
        setAdminReviews(prev => prev.filter(r => r._id !== id))
      } else {
        showMsg(data.error || 'Failed to delete review.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    }
  }

  const handleExportLeads = () => {
    const filtered = contacts.filter(c => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase()
      const phone = (c.phone || '').toLowerCase()
      const location = (c.location || '').toLowerCase()
      const query = contactSearch.toLowerCase()
      
      const matchesSearch = name.includes(query) || phone.includes(query) || location.includes(query)
      const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter
      const matchesService = contactServiceFilter === 'all' || c.service === contactServiceFilter
      
      return matchesSearch && matchesStatus && matchesService
    })

    if (filtered.length === 0) {
      showMsg('No leads available to export.', 'error')
      return
    }

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return ''
      let str = String(val)
      str = str.replace(/"/g, '""')
      if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
        return `"${str}"`
      }
      return str
    }

    const headers = ['Date', 'First Name', 'Last Name', 'Phone', 'Email', 'Service', 'Location', 'Size', 'Survey Date', 'Survey Time', 'Status', 'Message']
    
    const rows = filtered.map(c => [
      new Date(c.createdAt).toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      c.firstName || '',
      c.lastName || '',
      c.phone || '',
      c.email || '',
      c.service || '',
      c.location || '',
      c.size || '',
      c.surveyDate || '',
      c.surveyTime || '',
      c.status || '',
      c.message || ''
    ])

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    link.href = url
    link.setAttribute('download', `itworks-leads-${today}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showMsg(`Successfully exported ${filtered.length} leads to CSV.`)
  }

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setMessage(null), 4000)
  }

  // Open Form for Adding
  const handleAddClick = () => {
    setEditingId(null)
    setProjectForm({
      title: '',
      category: 'wifi',
      location: '',
      tag: '',
      description: '',
      tags: '',
      featured: false,
      large: false
    })
    setServiceForm({
      slug: '',
      title: '',
      tagline: '',
      tag: '',
      description: '',
      features: '',
      tiers: '',
      icon: 'wifi',
      order: 0,
      comingSoon: false
    })
    setIsFormOpen(true)
  }

  // Open Form for Editing
  const handleEditClick = (item) => {
    setEditingId(item._id || item.id)
    if (activeTab === 'projects') {
      setProjectForm({
        title: item.title || '',
        category: item.category || 'wifi',
        location: item.location || '',
        tag: item.tag || '',
        description: item.description || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        featured: !!item.featured,
        large: !!item.large
      })
    } else {
      setServiceForm({
        slug: item.slug || '',
        title: item.title || '',
        tagline: item.tagline || '',
        tag: item.tag || '',
        description: item.description || '',
        features: Array.isArray(item.features) ? item.features.join('\n') : '',
        tiers: Array.isArray(item.tiers) ? item.tiers.map(t => t.name).join(', ') : '',
        icon: item.icon || 'wifi',
        order: item.order || 0,
        comingSoon: !!item.comingSoon
      })
    }
    setIsFormOpen(true)
  }

  // Handle Delete
  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      const url = activeTab === 'projects' ? `/api/projects/${id}` : `/api/services/${id}`
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()

      if (res.ok && (data.success || data.success === undefined)) {
        showMsg('Item deleted successfully!')
        fetchData()
      } else {
        showMsg(data.message || data.error || 'Failed to delete item.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    }
  }

  // Handle Projects & Services submit
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = activeTab === 'projects'
        ? (editingId ? `/api/projects/${editingId}` : '/api/projects')
        : (editingId ? `/api/services/${editingId}` : '/api/services')
      
      const method = editingId ? 'PUT' : 'POST'
      
      let payload = {}
      if (activeTab === 'projects') {
        payload = {
          ...projectForm,
          tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
      } else {
        payload = {
          ...serviceForm,
          features: serviceForm.features.split('\n').map(f => f.trim()).filter(Boolean),
          tiers: serviceForm.tiers.split(',').map(t => ({ name: t.trim() })).filter(t => t.name)
        }
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        setIsFormOpen(false)
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()

      if (res.ok && (data.success || data.success === undefined)) {
        showMsg(`Item ${editingId ? 'updated' : 'created'} successfully!`)
        setIsFormOpen(false)
        fetchData()
      } else {
        showMsg(data.message || data.error || 'Operation failed.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    }
  }

  // About Page Change Handlers
  const handleAboutValueChange = (idx, field, val) => {
    setAboutForm(prev => {
      const updated = [...prev.values]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, values: updated }
    })
  }

  const handleAboutValueAdd = () => {
    setAboutForm(prev => {
      const nextNum = String(prev.values.length + 1).padStart(2, '0')
      return {
        ...prev,
        values: [...prev.values, { num: nextNum, title: '', desc: '' }]
      }
    })
  }

  const handleAboutValueDelete = (idx) => {
    setAboutForm(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== idx)
    }))
  }

  const handleAboutTeamChange = (idx, field, val) => {
    setAboutForm(prev => {
      const updated = [...prev.team]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, team: updated }
    })
  }

  const handleAboutTeamAdd = () => {
    setAboutForm(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', bio: '', initials: '', color: 'av-green', avatarUrl: '' }]
    }))
  }

  const handleAboutTeamDelete = (idx) => {
    setAboutForm(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== idx)
    }))
  }

  const handleAboutSubmit = async (e) => {
    e.preventDefault()
    setAboutSaving(true)
    try {
      const payload = {
        storyTitle: aboutForm.storyTitle,
        storyParagraphs: aboutForm.storyParagraphs.split('\n\n').map(p => p.trim()).filter(Boolean),
        missionTitle: aboutForm.missionTitle,
        missionStatement: aboutForm.missionStatement,
        missionSub: aboutForm.missionSub,
        values: aboutForm.values,
        team: aboutForm.team.map(m => ({
          ...m,
          initials: m.initials || m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        })),
        areas: aboutForm.areas.split(',').map(a => a.trim()).filter(Boolean),
        areaTitle: aboutForm.areaTitle,
        areaText: aboutForm.areaText
      }

      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        setToken('')
        showMsg('Session expired. Please log in again.', 'error')
        return
      }

      const data = await res.json()
      if (res.ok) {
        showMsg('About page content saved successfully!')
        // Reload to sync formatted fields
        fetchData()
      } else {
        showMsg(data.error || 'Failed to save About page content.', 'error')
      }
    } catch (err) {
      showMsg('Network error occurred.', 'error')
    } finally {
      setAboutSaving(false)
    }
  }

  if (!token) {
    return (
      <main className="admin-page login-page-wrap">
        <section className="page-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div className="page-hero-bg" />
          <div className="hero-grid" />
          <div className="login-card">
            <div className="login-header">
              <div className="nav-logo" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                <div className="nav-logo-text" style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px', color: '#fff' }}>ITWORKS</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '3px', color: 'var(--green)', textTransform: 'uppercase' }}>Management Console</span>
                </div>
              </div>
              <h2>Dashboard Access</h2>
              <p>Please enter administrative credentials to access the console.</p>
            </div>
            
            {authError && (
              <div className="admin-alert error" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                {authError}
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" className="btn-primary login-btn" disabled={authLoading} style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}>
                {authLoading ? 'Authenticating...' : 'Sign In'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/" className="btn-ghost" style={{ fontSize: '13px', textDecoration: 'none' }}>Return to Website</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    )
  }

  // ── ANALYTICS CALCULATIONS ──────────────────────────────────────────
  const totalLeads = contacts.length
  const newLeads = contacts.filter(c => c.status === 'new').length
  const contactedLeads = contacts.filter(c => c.status === 'contacted').length
  const convertedLeads = contacts.filter(c => c.status === 'converted').length
  const closedLeads = contacts.filter(c => c.status === 'closed').length
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

  // Service popularities
  const servicesMap = {
    'Home WiFi Setup': 0,
    'Office Networks': 0,
    'IT Support': 0,
    'Hotspot Deployment': 0,
    'CCTV & Surveillance': 0,
    'Structured Cabling': 0
  }
  contacts.forEach(c => {
    if (servicesMap[c.service] !== undefined) {
      servicesMap[c.service]++
    } else if (c.service) {
      servicesMap[c.service] = (servicesMap[c.service] || 0) + 1
    }
  })
  const serviceData = Object.entries(servicesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Top locations
  const locationsMap = {}
  contacts.forEach(c => {
    if (c.location) {
      const loc = c.location.trim()
      const normalizedLoc = loc.replace(/\b\w/g, l => l.toUpperCase())
      locationsMap[normalizedLoc] = (locationsMap[normalizedLoc] || 0) + 1
    }
  })
  const locationData = Object.entries(locationsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Last 6 months trend
  const getTrendData = () => {
    const trendList = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      trendList.push({
        name: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        count: 0
      })
    }
    
    contacts.forEach(c => {
      const created = new Date(c.createdAt)
      const cMonth = created.getMonth()
      const cYear = created.getFullYear()
      const match = trendList.find(m => m.monthNum === cMonth && m.year === cYear)
      if (match) {
        match.count++
      }
    })
    return trendList
  }
  const trendData = getTrendData()

  return (
    <main className="admin-page">
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="hero-grid" />
        <div className="page-hero-inner">
          <div className="breadcrumb-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="breadcrumb" style={{ marginBottom: 0 }}>
              <Link to="/">Home</Link>
              <span>/</span>
              <span style={{ color: '#fff' }}>Admin Dashboard</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
          <div className="section-label">Management console</div>
          <h1>System<br /><span>Dashboard</span></h1>
          <p>Create, update, and manage the active services, projects, and custom about sections presented on the public ITWORKS website.</p>
        </div>
      </section>

      <div className="admin-controls">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('projects'); setIsFormOpen(false); }}
          >
            Projects ({projects.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('services'); setIsFormOpen(false); }}
          >
            Services ({services.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('about'); setIsFormOpen(false); }}
          >
            About Page Content
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('contacts'); setIsFormOpen(false); }}
          >
            Quote Requests ({contacts.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('reviews'); setIsFormOpen(false); }}
          >
            Client Reviews ({adminReviews.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('analytics'); setIsFormOpen(false); }}
          >
            Analytics & Insights
          </button>
        </div>
        
        {activeTab !== 'about' && activeTab !== 'contacts' && activeTab !== 'reviews' && activeTab !== 'analytics' && (
          <button className="btn-primary add-new-btn" onClick={handleAddClick}>
            + Add New {activeTab === 'projects' ? 'Project' : 'Service'}
          </button>
        )}
      </div>

      {message && (
        <div className={`admin-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="admin-content-section">
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner" />
            <p>Loading database items...</p>
          </div>
        ) : activeTab === 'about' ? (
          <form onSubmit={handleAboutSubmit} className="about-editor-form">
            
            {/* STORY CARD */}
            <div className="about-card">
              <div className="about-card-title">Who We Are (Story)</div>
              <div className="form-group">
                <label>Story Section Heading</label>
                <input 
                  type="text" 
                  required
                  value={aboutForm.storyTitle} 
                  onChange={e => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
                  placeholder="e.g. The Team Behind the Connection (HTML allowed)"
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Story Paragraphs (Separate each paragraph with a blank line)</label>
                <textarea 
                  rows="6"
                  required
                  value={aboutForm.storyParagraphs} 
                  onChange={e => setAboutForm({ ...aboutForm, storyParagraphs: e.target.value })}
                  placeholder="ITWORKS Technologies Limited was founded...&#10;&#10;From our base in Eldoret..."
                />
              </div>
            </div>

            {/* MISSION CARD */}
            <div className="about-card">
              <div className="about-card-title">Our Mission</div>
              <div className="form-group">
                <label>Mission Section Label</label>
                <input 
                  type="text" 
                  required
                  value={aboutForm.missionTitle} 
                  onChange={e => setAboutForm({ ...aboutForm, missionTitle: e.target.value })}
                  placeholder="e.g. Our Mission"
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Mission Statement (Main Highlight Text)</label>
                <textarea 
                  rows="3"
                  required
                  value={aboutForm.missionStatement} 
                  onChange={e => setAboutForm({ ...aboutForm, missionStatement: e.target.value })}
                  placeholder="To connect every home, office, and institution..."
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Mission Sub-text (Supporting description)</label>
                <textarea 
                  rows="3"
                  required
                  value={aboutForm.missionSub} 
                  onChange={e => setAboutForm({ ...aboutForm, missionSub: e.target.value })}
                  placeholder="We believe that fast, reliable internet is not a luxury..."
                />
              </div>
            </div>

            {/* SERVICE AREA CARD */}
            <div className="about-card">
              <div className="about-card-title">Where We Serve</div>
              <div className="form-group">
                <label>Where We Serve Section Heading</label>
                <input 
                  type="text" 
                  required
                  value={aboutForm.areaTitle} 
                  onChange={e => setAboutForm({ ...aboutForm, areaTitle: e.target.value })}
                  placeholder="e.g. Eldoret & Beyond (HTML allowed)"
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Section Description Text</label>
                <textarea 
                  rows="3"
                  required
                  value={aboutForm.areaText} 
                  onChange={e => setAboutForm({ ...aboutForm, areaText: e.target.value })}
                  placeholder="Our base is Eldoret — but our clients aren't limited to the city..."
                />
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Served Towns / Regions (Comma Separated)</label>
                <input 
                  type="text" 
                  required
                  value={aboutForm.areas} 
                  onChange={e => setAboutForm({ ...aboutForm, areas: e.target.value })}
                  placeholder="e.g. Eldoret (HQ), Nakuru, Kisumu"
                />
              </div>
            </div>

            {/* VALUES CARD */}
            <div className="about-card">
              <div className="about-card-title">
                <span>What We Stand For (Values)</span>
                <button type="button" className="btn-add-item" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleAboutValueAdd}>
                  + Add Value
                </button>
              </div>
              <div className="about-list">
                {aboutForm.values.map((v, i) => (
                  <div key={i} className="about-list-item">
                    <div className="about-item-header">
                      <span className="about-item-title">Value Item #{i + 1}</span>
                      <button type="button" className="btn-remove-item" onClick={() => handleAboutValueDelete(i)}>
                        Remove
                      </button>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Display Number</label>
                        <input 
                          type="text" 
                          required
                          value={v.num} 
                          onChange={e => handleAboutValueChange(i, 'num', e.target.value)}
                          placeholder="e.g. 01"
                        />
                      </div>
                      <div className="form-group">
                        <label>Value Title</label>
                        <input 
                          type="text" 
                          required
                          value={v.title} 
                          onChange={e => handleAboutValueChange(i, 'title', e.target.value)}
                          placeholder="e.g. Reliability"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        rows="2"
                        required
                        value={v.desc} 
                        onChange={e => handleAboutValueChange(i, 'desc', e.target.value)}
                        placeholder="Explain what this value means in practice..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              {aboutForm.values.length === 0 && (
                <p style={{ color: 'var(--grey2)', textAlign: 'center', margin: '20px 0' }}>No values defined. Click "+ Add Value" to add one.</p>
              )}
            </div>

            {/* TEAM CARD */}
            <div className="about-card">
              <div className="about-card-title">
                <span>The People (Team Members)</span>
                <button type="button" className="btn-add-item" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleAboutTeamAdd}>
                  + Add Member
                </button>
              </div>
              <div className="about-list">
                {aboutForm.team.map((m, i) => (
                  <div key={i} className="about-list-item">
                    <div className="about-item-header">
                      <span className="about-item-title">Team Member #{i + 1}</span>
                      <button type="button" className="btn-remove-item" onClick={() => handleAboutTeamDelete(i)}>
                        Remove
                      </button>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Member Name</label>
                        <input 
                          type="text" 
                          required
                          value={m.name} 
                          onChange={e => handleAboutTeamChange(i, 'name', e.target.value)}
                          placeholder="e.g. John Kibet"
                        />
                      </div>
                      <div className="form-group">
                        <label>Role / Job Title</label>
                        <input 
                          type="text" 
                          required
                          value={m.role} 
                          onChange={e => handleAboutTeamChange(i, 'role', e.target.value)}
                          placeholder="e.g. Founder & CEO"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Initials (Leave empty to auto-generate)</label>
                        <input 
                          type="text" 
                          value={m.initials} 
                          onChange={e => handleAboutTeamChange(i, 'initials', e.target.value)}
                          placeholder="e.g. JK"
                        />
                      </div>
                      <div className="form-group">
                        <label>Avatar Color Theme</label>
                        <select 
                          value={m.color} 
                          onChange={e => handleAboutTeamChange(i, 'color', e.target.value)}
                        >
                          <option value="av-green">Green</option>
                          <option value="av-orange">Orange</option>
                          <option value="av-blue">Blue</option>
                          <option value="av-teal">Teal</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row" style={{alignItems: 'center', gap: '16px'}}>
                      <div className="form-group" style={{flex: 1}}>
                        <label>Avatar Image File (Click to upload)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          style={{display: 'none'}}
                          id={`avatar-upload-${i}`}
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 1.5 * 1024 * 1024) {
                                alert("Image is too large. Please select an image under 1.5MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleAboutTeamChange(i, 'avatarUrl', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button 
                            type="button" 
                            className="btn-add-item" 
                            style={{padding: '8px 14px', fontSize: '12px'}}
                            onClick={() => document.getElementById(`avatar-upload-${i}`).click()}
                          >
                            Choose Image
                          </button>
                          {m.avatarUrl && (
                            <button 
                              type="button" 
                              className="btn-remove-item" 
                              style={{padding: '8px 14px', fontSize: '12px', background: 'rgba(224, 58, 58, 0.1)', borderColor: 'rgba(224, 58, 58, 0.2)', color: '#e03a3a'}}
                              onClick={() => handleAboutTeamChange(i, 'avatarUrl', '')}
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      </div>
                      {m.avatarUrl && (
                        <div className="avatar-preview-box" style={{width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--green)', flexShrink: 0}}>
                          <img src={m.avatarUrl} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Short Bio</label>
                      <textarea 
                        rows="2"
                        required
                        value={m.bio} 
                        onChange={e => handleAboutTeamChange(i, 'bio', e.target.value)}
                        placeholder="e.g. Specialist in enterprise networking..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              {aboutForm.team.length === 0 && (
                <p style={{ color: 'var(--grey2)', textAlign: 'center', margin: '20px 0' }}>No team members defined. Click "+ Add Member" to add one.</p>
              )}
            </div>

            {/* SAVE BAR */}
            <div className="about-save-bar">
              <button type="submit" className="btn-primary btn-save-about" disabled={aboutSaving}>
                {aboutSaving ? 'Saving Changes...' : 'Save About Page Content'}
              </button>
            </div>

          </form>
        ) : activeTab === 'contacts' ? (
          <div className="crm-lead-container">
            <div className="crm-filter-bar">
              <div className="crm-search-box">
                <svg className="crm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search name, phone, or location..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                />
              </div>
              <div className="crm-select-filters">
                <div className="crm-filter-group">
                  <label>Status</label>
                  <select value={contactStatusFilter} onChange={e => setContactStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed / Spam</option>
                  </select>
                </div>
                <div className="crm-filter-group">
                  <label>Service Type</label>
                  <select value={contactServiceFilter} onChange={e => setContactServiceFilter(e.target.value)}>
                    <option value="all">All Services</option>
                    <option value="Home WiFi Setup">Home WiFi</option>
                    <option value="Office Networks">Office Networks</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Hotspot Deployment">Hotspot Deployment</option>
                    <option value="CCTV & Surveillance">CCTV & Surveillance</option>
                    <option value="Structured Cabling">Structured Cabling</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="export-leads-btn"
                  onClick={handleExportLeads}
                  title="Export filtered leads to CSV"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Contact Details</th>
                    <th>Service</th>
                    <th>Location & Size</th>
                    <th>Lead Status</th>
                    <th style={{ textAlign: 'center' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts
                    .filter(c => {
                      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase()
                      const phone = (c.phone || '').toLowerCase()
                      const location = (c.location || '').toLowerCase()
                      const query = contactSearch.toLowerCase()
                      
                      const matchesSearch = name.includes(query) || phone.includes(query) || location.includes(query)
                      const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter
                      const matchesService = contactServiceFilter === 'all' || c.service === contactServiceFilter
                      
                      return matchesSearch && matchesStatus && matchesService
                    })
                    .length > 0 ? (
                      contacts
                        .filter(c => {
                          const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase()
                          const phone = (c.phone || '').toLowerCase()
                          const location = (c.location || '').toLowerCase()
                          const query = contactSearch.toLowerCase()
                          
                          const matchesSearch = name.includes(query) || phone.includes(query) || location.includes(query)
                          const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter
                          const matchesService = contactServiceFilter === 'all' || c.service === contactServiceFilter
                          
                          return matchesSearch && matchesStatus && matchesService
                        })
                        .map(c => {
                          const isExpanded = expandedContactId === c._id
                          const dateFormatted = new Date(c.createdAt).toLocaleDateString('en-KE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          
                          return (
                            <React.Fragment key={c._id}>
                              <tr className={isExpanded ? 'row-expanded-header' : ''}>
                                <td style={{ fontSize: '13px', color: 'var(--grey2)' }}>{dateFormatted}</td>
                                <td className="font-semibold">{c.firstName} {c.lastName}</td>
                                <td>
                                  <div className="crm-contact-links">
                                    <a href={`tel:${c.phone}`} className="crm-phone-link">📞 {c.phone}</a>
                                    {c.email && <a href={`mailto:${c.email}`} className="crm-email-link">✉️ {c.email}</a>}
                                  </div>
                                </td>
                                <td>
                                  <span className="pill-category">{c.service}</span>
                                </td>
                                <td>
                                  <div>{c.location}</div>
                                  {c.size && <div style={{ fontSize: '11px', color: 'var(--grey2)', marginTop: '2px' }}>Size: {c.size}</div>}
                                  {c.surveyDate && (
                                    <div className="crm-survey-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(43,176,74,0.1)', border: '1px solid rgba(43,176,74,0.2)', color: 'var(--green)', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                                      📅 {c.surveyDate} ({c.surveyTime.split(' ')[0]})
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className={`crm-status-dropdown status-${c.status}`}
                                    value={c.status}
                                    onChange={e => handleContactStatusUpdate(c._id, e.target.value)}
                                  >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button
                                    className="btn-edit"
                                    onClick={() => setExpandedContactId(isExpanded ? null : c._id)}
                                  >
                                    {isExpanded ? 'Hide Message' : 'View Message'}
                                  </button>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="row-expanded-details">
                                  <td colSpan="7">
                                    <div className="crm-expanded-message-box">
                                      {c.surveyDate && (
                                        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px dashed var(--black4)' }}>
                                          <div className="message-label" style={{ color: 'var(--green)', marginBottom: '4px' }}>📅 Requested Site Survey Slot:</div>
                                          <p className="message-text" style={{ fontWeight: 'bold', color: 'var(--white)' }}>
                                            {c.surveyDate} — {c.surveyTime}
                                          </p>
                                        </div>
                                      )}
                                      <div className="message-label">Customer Message:</div>
                                      <p className="message-text">{c.message || 'No message provided.'}</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--grey2)' }}>
                          No quote requests found matching the current filters.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="crm-analytics-container">
            {/* Metric Cards Grid */}
            <div className="analytics-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-info">
                  <span className="metric-label">Total Quote Requests</span>
                  <span className="metric-value">{totalLeads}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon green">📈</div>
                <div className="metric-info">
                  <span className="metric-label">Conversion Rate</span>
                  <span className="metric-value">{conversionRate}%</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon blue">⚡</div>
                <div className="metric-info">
                  <span className="metric-label">New / Pending</span>
                  <span className="metric-value">{newLeads}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon orange">🏆</div>
                <div className="metric-info">
                  <span className="metric-label">Converted Clients</span>
                  <span className="metric-value">{convertedLeads}</span>
                </div>
              </div>
            </div>

            {/* Charts Section Grid */}
            <div className="analytics-charts-grid">
              {/* Trend Chart Card */}
              <div className="analytics-chart-card trend-card">
                <h3>Lead Generation Volume</h3>
                <p className="card-sub">Last 6 Months Activity</p>
                <div className="chart-wrapper">
                  {totalLeads > 0 ? (
                    <svg className="svg-trend-chart" viewBox="0 0 500 200" width="100%" height="100%">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      {[0, 1, 2, 3, 4].map(i => {
                        const y = 30 + i * 35
                        return (
                          <line key={i} x1="40" y1={y} x2="460" y2={y} stroke="var(--black5)" strokeWidth="1" strokeDasharray="4 4" />
                        )
                      })}
                      
                      {/* X Axis Labels */}
                      {trendData.map((d, i) => (
                        <text key={i} x={40 + i * 84} y="192" fill="var(--grey2)" fontSize="11" textAnchor="middle">
                          {d.name}
                        </text>
                      ))}

                      {/* Area Fill */}
                      <path
                        d={`M 40 170 ${trendData.map((d, i) => `L ${40 + i * 84} ${170 - (d.count / Math.max(...trendData.map(td => td.count), 5)) * 140}`).join(' ')} L 460 170 Z`}
                        fill="url(#chartGlow)"
                      />

                      {/* Line Path */}
                      <path
                        d={trendData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${40 + i * 84} ${170 - (d.count / Math.max(...trendData.map(td => td.count), 5)) * 140}`).join(' ')}
                        fill="none"
                        stroke="var(--green)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Circles & Tooltips */}
                      {trendData.map((d, i) => {
                        const cx = 40 + i * 84
                        const cy = 170 - (d.count / Math.max(...trendData.map(td => td.count), 5)) * 140
                        return (
                          <g key={i} className="chart-node-group">
                            <circle cx={cx} cy={cy} r="5" fill="var(--black1)" stroke="var(--green)" strokeWidth="3" />
                            <circle cx={cx} cy={cy} r="10" fill="transparent" className="node-hover-trigger" />
                            <g className="node-tooltip">
                              <rect x={cx - 24} y={cy - 34} width="48" height="24" rx="4" fill="var(--black2)" stroke="var(--black4)" strokeWidth="1" />
                              <text x={cx} y={cy - 18} fill="var(--white)" fontSize="10" fontWeight="700" textAnchor="middle">{d.count} leads</text>
                            </g>
                          </g>
                        )
                      })}
                    </svg>
                  ) : (
                    <div className="no-data-placeholder">No lead history records found.</div>
                  )}
                </div>
              </div>

              {/* Service popularities Card */}
              <div className="analytics-chart-card service-card">
                <h3>Services Distribution</h3>
                <p className="card-sub">Requested WiFi & Networks</p>
                <div className="chart-wrapper-premium" style={{ display: 'flex', alignItems: 'center', minHeight: '180px' }}>
                  {totalLeads > 0 ? (
                    <div className="donut-chart-container" style={{ display: 'flex', alignItems: 'center', gap: '32px', width: '100%' }}>
                      <div className="svg-donut-wrapper" style={{ width: '150px', height: '150px', position: 'relative', flexShrink: 0 }}>
                        <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                          {/* Background Track */}
                          <circle cx="80" cy="80" r="50" fill="none" stroke="var(--black4)" strokeWidth="15" />
                          
                          {(() => {
                            let accumulatedPercent = 0
                            const colors = ['#2bb04a', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#e8401a']
                            return serviceData.map((d, idx) => {
                              if (d.count === 0) return null
                              const pct = d.count / totalLeads
                              const strokeLength = pct * 314.16
                              const strokeOffset = 314.16 - (accumulatedPercent * 314.16)
                              accumulatedPercent += pct
                              const color = colors[idx % colors.length]
                              
                              return (
                                <g key={d.name} className="chart-donut-group">
                                  <circle
                                    cx="80"
                                    cy="80"
                                    r="50"
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="15"
                                    strokeDasharray={`${strokeLength} 314.16`}
                                    strokeDashoffset={strokeOffset}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 0.5s ease', cursor: 'pointer' }}
                                  />
                                  <g className="donut-tooltip">
                                    <rect x="50" y="5" width="60" height="24" rx="4" fill="var(--black2)" stroke="var(--black4)" strokeWidth="1" transform="rotate(90 80 80)" />
                                    <text x="80" y="21" fill="var(--white)" fontSize="9" fontWeight="700" textAnchor="middle" transform="rotate(90 80 80)">{d.count} ({Math.round(pct * 100)}%)</text>
                                  </g>
                                </g>
                              )
                            })
                          })()}
                        </svg>
                        
                        {/* Donut Center Display */}
                        <div className="donut-center-info" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--white)', display: 'block', lineHeight: 1 }}>{totalLeads}</span>
                          <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--grey2)', letterSpacing: '0.5px', marginTop: '2px', display: 'block' }}>Leads</span>
                        </div>
                      </div>
                      
                      {/* Interactive Custom Legend */}
                      <div className="donut-legend" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(() => {
                          const colors = ['#2bb04a', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#e8401a']
                          return serviceData.map((d, idx) => {
                            if (d.count === 0) return null
                            const color = colors[idx % colors.length]
                            const pct = Math.round((d.count / totalLeads) * 100)
                            return (
                              <div key={d.name} className="legend-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                                  <span style={{ color: 'var(--grey1)', fontWeight: '600' }}>{d.name}</span>
                                </div>
                                <span style={{ color: 'var(--white)', fontWeight: '700' }}>{d.count} ({pct}%)</span>
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="no-data-placeholder">No quote statistics available.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="analytics-bottom-grid">
              {/* Location leaderboard */}
              <div className="analytics-chart-card location-leaderboard">
                <h3>Top Active Locations</h3>
                <p className="card-sub">Hotspot & Cabling hotspots</p>
                <div className="chart-wrapper-premium" style={{ display: 'flex', alignItems: 'center', minHeight: '180px', width: '100%', marginTop: '10px' }}>
                  {locationData.length > 0 ? (
                    <div className="bar-chart-container" style={{ width: '100%', height: '160px' }}>
                      <svg viewBox="0 0 400 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2bb04a" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                        
                        {/* Horizontal Gridlines */}
                        {[0, 1, 2, 3].map(i => {
                          const y = 15 + i * 35
                          return (
                            <line key={i} x1="30" y1={y} x2="380" y2={y} stroke="var(--black5)" strokeWidth="1" strokeDasharray="3 3" />
                          )
                        })}

                        {/* Rendering Bars */}
                        {(() => {
                          const maxVal = Math.max(...locationData.map(ld => ld.count), 4)
                          return locationData.map((d, idx) => {
                            const barWidth = 28
                            const spacing = 70
                            const x = 45 + idx * spacing
                            const barHeight = (d.count / maxVal) * 105
                            const y = 135 - barHeight
                            
                            return (
                              <g key={d.name} className="chart-bar-group">
                                {/* Bar */}
                                <rect
                                  x={x}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  rx="4"
                                  fill="url(#barGradient)"
                                  className="svg-bar"
                                  style={{ transition: 'height 0.3s ease, y 0.3s ease', cursor: 'pointer' }}
                                />
                                {/* Value Text Above Bar */}
                                <text x={x + barWidth / 2} y={y - 6} fill="var(--white)" fontSize="9" fontWeight="700" textAnchor="middle">
                                  {d.count}
                                </text>
                                {/* X Label (Truncated if too long) */}
                                <text x={x + barWidth / 2} y="150" fill="var(--grey2)" fontSize="10" fontWeight="600" textAnchor="middle">
                                  {d.name.length > 9 ? `${d.name.slice(0, 8)}…` : d.name}
                                </text>
                                {/* Tooltip on Hover */}
                                <g className="bar-tooltip">
                                  <rect x={x - 24} y={y - 34} width="76" height="22" rx="4" fill="var(--black2)" stroke="var(--black4)" strokeWidth="1" />
                                  <text x={x + barWidth / 2} y={y - 19} fill="var(--white)" fontSize="9" fontWeight="700" textAnchor="middle">{d.name}</text>
                                </g>
                              </g>
                            )
                          })
                        })()}
                        
                        {/* Base Line */}
                        <line x1="30" y1="135" x2="380" y2="135" stroke="var(--black4)" strokeWidth="2" />
                      </svg>
                    </div>
                  ) : (
                    <div className="no-data-placeholder">No location data submitted.</div>
                  )}
                </div>
              </div>

              {/* Lifecycle Funnel */}
              <div className="analytics-chart-card funnel-card">
                <h3>Lead Funnel Conversion</h3>
                <p className="card-sub">Lifecycle status drop-off</p>
                <div className="funnel-visualization">
                  <div className="funnel-stage stage-new">
                    <span className="stage-name">1. Captured Leads</span>
                    <span className="stage-count">{totalLeads}</span>
                    <div className="funnel-shape" />
                  </div>
                  <div className="funnel-stage stage-contacted" style={{ opacity: totalLeads > 0 ? 0.4 + (contactedLeads + convertedLeads) / totalLeads * 0.6 : 0.4 }}>
                    <span className="stage-name">2. Contacted & Engaged</span>
                    <span className="stage-count">{contactedLeads + convertedLeads}</span>
                    <div className="funnel-shape" />
                  </div>
                  <div className="funnel-stage stage-converted" style={{ opacity: totalLeads > 0 ? 0.3 + convertedLeads / totalLeads * 0.7 : 0.3 }}>
                    <span className="stage-name">3. Converted Clients</span>
                    <span className="stage-count">{convertedLeads}</span>
                    <div className="funnel-shape" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="crm-lead-container">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Role / Location</th>
                    <th>Feedback</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminReviews.length > 0 ? (
                    adminReviews.map(r => {
                      const dateFormatted = new Date(r.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                      return (
                        <tr key={r._id}>
                          <td style={{ fontSize: '13px', color: 'var(--grey2)' }}>{dateFormatted}</td>
                          <td className="font-semibold">{r.name}</td>
                          <td>{r.role}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '13px', color: 'var(--grey1)' }}>{r.text}</td>
                          <td>
                            <span style={{ color: 'var(--green)' }}>{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</span>
                          </td>
                          <td>
                            <select
                              className={`crm-status-dropdown status-${r.status === 'approved' ? 'converted' : 'new'}`}
                              value={r.status}
                              onChange={e => handleReviewStatusUpdate(r._id, e.target.value)}
                              style={{ width: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="btn-delete" onClick={() => handleReviewDelete(r._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--grey2)' }}>
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                {activeTab === 'projects' ? (
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Featured</th>
                    <th>Layout</th>
                    <th className="actions-header">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Tiers</th>
                    <th className="actions-header">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {activeTab === 'projects' ? (
                  projects.map(p => (
                    <tr key={p._id || p.id}>
                      <td className="font-semibold">{p.title}</td>
                      <td><span className="pill-category">{p.category}</span></td>
                      <td>{p.location}</td>
                      <td>
                        <span className={`pill-boolean ${p.featured ? 'true' : 'false'}`}>
                          {p.featured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td>
                        <span className="layout-type">
                          {p.large ? 'Large Width' : 'Standard'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteClick(p._id || p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  services.map(s => (
                    <tr key={s._id || s.id}>
                      <td className="font-semibold">{s.title}</td>
                      <td className="font-mono text-xs">{s.slug}</td>
                      <td>{s.order}</td>
                      <td>
                        <span className={`pill-boolean ${s.comingSoon ? 'coming-soon' : 'active'}`}>
                          {s.comingSoon ? 'Coming Soon' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {s.tiers && s.tiers.length > 0 ? (
                          <div className="tiers-list">
                            {s.tiers.map(t => (
                              <span key={t._id || t.id || t.name} className="pill-tier">{t.name}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-grey">—</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="btn-edit" onClick={() => handleEditClick(s)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteClick(s._id || s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Form for Projects & Services */}
      {isFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit' : 'Add New'} {activeTab === 'projects' ? 'Project' : 'Service'}</h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              {activeTab === 'projects' ? (
                <>
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={projectForm.title} 
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} 
                      placeholder="e.g. SACCO HQ — 3-Floor Network"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select 
                        value={projectForm.category} 
                        onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      >
                        <option value="wifi">Home WiFi</option>
                        <option value="networks">Office Networks</option>
                        <option value="hotspot">Hotspot & Captive Portal</option>
                        <option value="cctv">CCTV & Surveillance</option>
                        <option value="cabling">Structured Cabling</option>
                        <option value="support">IT Support</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Location *</label>
                      <input 
                        type="text" 
                        required 
                        value={projectForm.location} 
                        onChange={e => setProjectForm({ ...projectForm, location: e.target.value })} 
                        placeholder="e.g. Eldoret Town"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tagline (Short Summary Tag)</label>
                    <input 
                      type="text" 
                      value={projectForm.tag} 
                      onChange={e => setProjectForm({ ...projectForm, tag: e.target.value })} 
                      placeholder="e.g. Mesh Network, 3-Floor Build"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      rows="3"
                      value={projectForm.description} 
                      onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} 
                      placeholder="Detailed description of what was done..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={projectForm.tags} 
                      onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} 
                      placeholder="e.g. Cat6 Cabling, VLAN, Ubiquiti APs"
                    />
                  </div>

                  <div className="form-row-checkboxes">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={projectForm.featured} 
                        onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })} 
                      />
                      <span className="checkmark"></span>
                      Featured Project (Promoted to top)
                    </label>

                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={projectForm.large} 
                        onChange={e => setProjectForm({ ...projectForm, large: e.target.checked })} 
                      />
                      <span className="checkmark"></span>
                      Large Layout Display (Spans two columns in grid)
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Service Title *</label>
                      <input 
                        type="text" 
                        required 
                        value={serviceForm.title} 
                        onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} 
                        placeholder="e.g. Home WiFi Setup"
                      />
                    </div>

                    <div className="form-group">
                      <label>URL Slug * (Lowercase, no spaces)</label>
                      <input 
                        type="text" 
                        required 
                        value={serviceForm.slug} 
                        disabled={!!editingId}
                        onChange={e => setServiceForm({ ...serviceForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                        placeholder="e.g. home-wifi"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tagline</label>
                      <input 
                        type="text" 
                        value={serviceForm.tagline} 
                        onChange={e => setServiceForm({ ...serviceForm, tagline: e.target.value })} 
                        placeholder="e.g. Full-home coverage · Signal optimisation"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category Label</label>
                      <input 
                        type="text" 
                        value={serviceForm.tag} 
                        onChange={e => setServiceForm({ ...serviceForm, tag: e.target.value })} 
                        placeholder="e.g. Home & Residential"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea 
                      rows="3"
                      required
                      value={serviceForm.description} 
                      onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} 
                      placeholder="Service overview description..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Features List (One feature per line)</label>
                    <textarea 
                      rows="4"
                      value={serviceForm.features} 
                      onChange={e => setServiceForm({ ...serviceForm, features: e.target.value })} 
                      placeholder="Professional AP placement&#10;Cable routing and concealment&#10;Works with Safaricom, Zuku"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tiers (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={serviceForm.tiers} 
                        onChange={e => setServiceForm({ ...serviceForm, tiers: e.target.value })} 
                        placeholder="e.g. Basic, Standard, Premium"
                      />
                    </div>

                    <div className="form-group">
                      <label>Icon Name</label>
                      <select 
                        value={serviceForm.icon} 
                        onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      >
                        <option value="wifi">wifi</option>
                        <option value="networks">networks</option>
                        <option value="hotspot">hotspot</option>
                        <option value="cctv">cctv</option>
                        <option value="cabling">cabling</option>
                        <option value="support">support</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Display Order (Sorting weight)</label>
                      <input 
                        type="number" 
                        value={serviceForm.order} 
                        onChange={e => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) || 0 })} 
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={serviceForm.comingSoon} 
                          onChange={e => setServiceForm({ ...serviceForm, comingSoon: e.target.checked })} 
                        />
                        <span className="checkmark"></span>
                        Coming Soon (Mark as unavailable)
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
