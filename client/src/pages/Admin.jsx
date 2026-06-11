import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'services'
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null) // { text: string, type: 'success' | 'error' }

  // Form State
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
    } catch (err) {
      showMsg('Failed to load database items.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
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
      const res = await fetch(url, { method: 'DELETE' })
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

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      let url = ''
      let method = 'POST'
      let body = {}

      if (activeTab === 'projects') {
        url = editingId ? `/api/projects/${editingId}` : '/api/projects'
        method = editingId ? 'PUT' : 'POST'
        body = {
          ...projectForm,
          tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
      } else {
        url = editingId ? `/api/services/${editingId}` : '/api/services'
        method = editingId ? 'PUT' : 'POST'
        // Format tiers: comma list string to [{name, label}]
        const formattedTiers = serviceForm.tiers
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
          .map(name => ({ name, label: name }))

        body = {
          ...serviceForm,
          features: serviceForm.features.split('\n').map(f => f.trim()).filter(Boolean),
          tiers: formattedTiers
        }
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (res.ok && (data.success || data.success === undefined)) {
        showMsg(editingId ? 'Item updated successfully!' : 'Item created successfully!')
        setIsFormOpen(false)
        fetchData()
      } else {
        showMsg(data.message || data.error || 'Operation failed.', 'error')
      }
    } catch (err) {
      showMsg('Server response error.', 'error')
    }
  }

  return (
    <main className="admin-page">
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="hero-grid" />
        <div className="page-hero-inner">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>Admin Dashboard</span>
          </div>
          <div className="section-label">Management console</div>
          <h1>System<br /><span>Dashboard</span></h1>
          <p>Create, update, and manage the active services and projects presented on the public ITWORKS website.</p>
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
        </div>
        <button className="btn-primary add-new-btn" onClick={handleAddClick}>
          + Add New {activeTab === 'projects' ? 'Project' : 'Service'}
        </button>
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
                {((activeTab === 'projects' && projects.length === 0) || 
                  (activeTab === 'services' && services.length === 0)) && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-grey">
                      No items found. Click "+ Add New" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Form */}
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
