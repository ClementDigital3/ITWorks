const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Service = require('./models/Service')
const Project = require('./models/Project')

dotenv.config()

const services = [
  {
    slug: 'home-wifi',
    title: 'Home WiFi Setup',
    tagline: 'Full-home coverage · Router configuration · Signal optimisation',
    tag: 'Home & Residential',
    description: 'Patchy internet and dead zones end here. We conduct a full site survey before every job, mapping your home\'s layout to determine exactly where routers and access points should be placed for complete, consistent coverage.',
    features: [
      'Full site survey and signal mapping before installation',
      'Professional router and access point placement',
      'Cable routing and concealment for a clean finish',
      'Password security, guest network, and parental controls setup',
      'Works with all Kenyan ISPs — Safaricom, Zuku, Faiba, and more',
      '30-day post-installation support guarantee'
    ],
    tiers: [{ name: 'basic', label: 'Basic' }, { name: 'standard', label: 'Standard' }, { name: 'premium', label: 'Premium' }],
    icon: 'wifi',
    order: 1
  },
  {
    slug: 'office-networks',
    title: 'Office & Enterprise Networks',
    tagline: 'LAN/WAN design · Managed switches · Enterprise access points · VLAN setup',
    tag: 'Enterprise',
    description: 'A slow or unreliable office network costs your business time and money every single day. We design and install enterprise-grade infrastructure built for performance, security, and scalability.',
    features: [
      'Complete network architecture design and planning',
      'Enterprise-grade access points (Ubiquiti, TP-Link, Cisco)',
      'PoE switch installation and rack setup',
      'VLAN configuration and guest network segmentation',
      'Firewall setup and basic network security hardening',
      'Full network documentation and handover report'
    ],
    tiers: [{ name: 'basic', label: 'Small Office' }, { name: 'standard', label: 'Mid-size' }, { name: 'premium', label: 'Enterprise' }],
    icon: 'server',
    order: 2
  },
  {
    slug: 'hotspot-captive-portal',
    title: 'Hotspot & Captive Portal',
    tagline: 'M-Pesa billing · Branded portal · Bandwidth management · MikroTik',
    tag: 'Hotels & Estates',
    description: 'Turn your internet connection into a managed, monetisable service. Ideal for hotels, apartment blocks, schools, and co-working spaces. Integrated M-Pesa payments mean guests pay instantly from their phones.',
    features: [
      'Custom-branded captive portal with your logo and colours',
      'M-Pesa STK push and voucher payment integration',
      'Per-user bandwidth throttling and session time limits',
      'MikroTik and Radius-based billing and authentication',
      'Real-time usage dashboard and monthly reports',
      'Remote monitoring and support included'
    ],
    tiers: [{ name: 'basic', label: 'Small Venue' }, { name: 'standard', label: 'Hotel / Block' }, { name: 'premium', label: 'Large Campus' }],
    icon: 'database',
    order: 3
  },
  {
    slug: 'cctv-surveillance',
    title: 'CCTV & Surveillance',
    tagline: 'HD IP cameras · Remote viewing · DVR/NVR setup · Mobile app access',
    tag: 'Security',
    description: 'Professional CCTV installation for homes, offices, warehouses, and perimeter security. We design camera placement for maximum coverage with minimal blind spots.',
    features: [
      'Site survey and strategic camera placement design',
      'HD IP and analog camera installation (indoor & outdoor)',
      'DVR/NVR setup with local and cloud storage options',
      'Mobile app configuration for remote viewing (iOS & Android)',
      'Night vision and motion detection configuration',
      'System training for client and staff'
    ],
    tiers: [{ name: 'basic', label: 'Home (4 cams)' }, { name: 'standard', label: 'Office (8 cams)' }, { name: 'premium', label: 'Perimeter' }],
    icon: 'camera',
    order: 4
  },
  {
    slug: 'structured-cabling',
    title: 'Structured Cabling',
    tagline: 'Cat5e / Cat6 · Patch panels · Cable trays · Certified runs',
    tag: 'Infrastructure',
    description: 'Clean, organised cabling is the backbone of any reliable network. Our structured cabling service delivers properly routed, labelled, and documented data cables.',
    features: [
      'Cat5e and Cat6 data cabling for voice and data',
      'Cable tray, conduit, and raceway installation',
      'Patch panel and network rack installation',
      'All cable runs tested and certified',
      'Cable labelling and full documentation provided',
      'Suitable for new builds and retrofit installations'
    ],
    tiers: [{ name: 'basic', label: 'Small Office' }, { name: 'standard', label: 'Medium' }, { name: 'premium', label: 'Large Building' }],
    icon: 'code',
    order: 5
  },
  {
    slug: 'it-support',
    title: 'IT Support & Maintenance',
    tagline: 'Remote & on-site · Monthly contracts · Network monitoring · Priority SLA',
    tag: 'Ongoing Support',
    description: 'Network problems do not wait for convenient times. Our IT support contracts give your business a dedicated technical partner — available remotely and on-site.',
    features: [
      'Monthly and annual support contracts available',
      'Remote troubleshooting with guaranteed response times',
      'On-site visits included in contract or available as needed',
      'Proactive network health monitoring and alerts',
      'Router, switch, and access point firmware updates',
      'Priority SLA for contracted clients'
    ],
    tiers: [{ name: 'basic', label: 'Monthly' }, { name: 'standard', label: 'Quarterly' }, { name: 'premium', label: 'Annual' }],
    icon: 'tool',
    order: 6
  }
]

const projects = [
  { title: 'Eldoret City Hotel — Full Hotspot System', category: 'hotspot', location: 'Eldoret CBD, Uasin Gishu', description: 'Deployed a full hotel-wide hotspot system across 3 floors and 80 rooms. Includes branded captive portal, M-Pesa STK push payment, voucher-based access, and per-user bandwidth controls.', tags: ['M-Pesa Billing', 'Branded Portal', '80 Rooms', 'MikroTik'], featured: true },
  { title: 'SACCO HQ — 3-Floor Network', category: 'networks', location: 'Eldoret Town', description: 'Full network infrastructure design across 3 floors. Cat6 structured cabling, PoE switch rack, VLAN segmentation, enterprise Ubiquiti access points, and firewall configuration.', tags: ['Cat6 Cabling', 'VLAN', 'Ubiquiti', 'PoE Rack'] },
  { title: '5-Bedroom Residence — Full Coverage', category: 'wifi', location: 'Elgon View, Eldoret', description: 'Complete home WiFi overhaul for a 5-bedroom home. Mesh network with 3 access points, cable concealment through walls, separate IoT network for smart home devices.', tags: ['Mesh Network', '3 Access Points', 'Smart Home'] },
  { title: 'Supermarket — 12-Camera System', category: 'cctv', location: 'Langas, Eldoret', description: '12-camera HD IP surveillance covering all entry/exit points, cashier areas, storage rooms, and the car park. NVR with 30-day cloud backup and motion alerts.', tags: ['12 HD Cameras', 'Cloud Backup', 'Motion Detection'] },
  { title: 'Residential Estate — 80 Units', category: 'hotspot', location: 'Kapsaret, Eldoret', description: 'Large-scale hotspot across an 80-unit gated estate. Outdoor weatherproof access points covering the compound, pool area, and communal spaces.', tags: ['80 Units', 'Outdoor APs', 'Voucher System'] },
  { title: 'Microfinance Office — Cat6 Full Build', category: 'cabling', location: 'Eldoret CBD', description: 'Structured cabling for a microfinance institution with 40 workstations across 2 floors. All Cat6 runs certified, labelled, and documented. Patch panels and server rack installed.', tags: ['40 Workstations', 'Cat6 Certified', 'Patch Panel'] },
  { title: 'Secondary School — Campus Network', category: 'networks', location: 'Nandi Hills', description: 'Full campus network covering computer lab (30 PCs), staff room, library, and administration block. Separate VLANs for students and staff, content filtering.', tags: ['Computer Lab', 'Content Filtering', 'Library'] },
  { title: 'Private Clinic — Secure Medical Network', category: 'networks', location: 'Kitale, Trans Nzoia', description: 'Secure network with separate VLANs for clinical systems, admin computers, and patient WiFi. Access controls to protect sensitive medical data.', tags: ['VLAN Isolation', 'Guest WiFi', 'Access Control'] },
  { title: 'Warehouse — Perimeter + Interior CCTV', category: 'cctv', location: 'Industrial Area, Eldoret', description: 'Comprehensive CCTV covering perimeter fence lines, loading bays, storage areas, and office entry points. Full HD with IR night vision. RAID storage with remote access.', tags: ['Perimeter', 'Night Vision', 'RAID Storage'] }
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  await Service.deleteMany()
  await Project.deleteMany()

  await Service.insertMany(services)
  await Project.insertMany(projects)

  console.log(`Seeded ${services.length} services and ${projects.length} projects`)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
