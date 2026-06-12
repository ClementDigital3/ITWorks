import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'services' | 'about'
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null) // { text: string, type: 'success' | 'error' }

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
      team: [...prev.team, { name: '', role: '', bio: '', initials: '', color: 'av-green' }]
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
        </div>
        
        {activeTab !== 'about' && (
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
