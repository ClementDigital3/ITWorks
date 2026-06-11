const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Service = require('./models/Service')
const Project = require('./models/Project')
const Stats = require('./models/Stats')

dotenv.config()

const services = [
  {
    slug: 'home-wifi',
    title: 'Home WiFi Setup',
    tagline: 'Full-home coverage · Router configuration · Signal optimisation',
    tag: 'Home & Residential',
    description: 'Patchy internet and dead zones end here. We conduct a full site survey before every job, mapping your layout to determine exactly where routers and access points should be placed for complete, consistent coverage.',
    features: [
      'Full site survey and signal mapping',
      'Professional router and access point placement',
      'Cable routing and concealment',
      'Password security, guest network, and parental controls',
      'Works with all Kenyan ISPs — Safaricom, Zuku, Faiba',
      '30-day post-installation support guarantee'
    ],
    tiers: [
      { name: 'Basic', label: 'Basic' },
      { name: 'Standard', label: 'Standard' },
      { name: 'Premium', label: 'Premium' }
    ],
    icon: 'wifi',
    order: 1,
    comingSoon: false
  },
  {
    slug: 'office-networks',
    title: 'Office & Enterprise Networks',
    tagline: 'LAN/WAN design · Managed switches · Enterprise access points · VLAN',
    tag: 'Enterprise',
    description: 'A slow or unreliable office network costs your business time and money every single day. We design and install enterprise-grade infrastructure built for performance, security, and scalability.',
    features: [
      'Complete network architecture design',
      'Enterprise-grade access points (Ubiquiti, TP-Link, Cisco)',
      'PoE switch installation and rack setup',
      'VLAN configuration and guest network segmentation',
      'Firewall setup and network security hardening',
      'Full network documentation and handover report'
    ],
    tiers: [
      { name: 'Small Office', label: 'Small Office' },
      { name: 'Mid-size', label: 'Mid-size' },
      { name: 'Enterprise', label: 'Enterprise' }
    ],
    icon: 'networks',
    order: 2,
    comingSoon: false
  },
  {
    slug: 'hotspot-captive-portal',
    title: 'Hotspot & Captive Portal',
    tagline: 'M-Pesa billing · Branded portal · Bandwidth management · MikroTik',
    tag: 'Hotels & Estates',
    description: 'Turn your internet connection into a managed, monetisable service. Ideal for hotels, apartment blocks, schools, and co-working spaces. Integrated M-Pesa payments mean guests pay instantly from their phones.',
    features: [
      'Custom-branded captive portal',
      'M-Pesa STK push and voucher payment integration',
      'Per-user bandwidth throttling and session limits',
      'MikroTik and Radius billing system',
      'Real-time usage dashboard and reports',
      'Remote monitoring and support included'
    ],
    tiers: [
      { name: 'Small Venue', label: 'Small Venue' },
      { name: 'Hotel / Block', label: 'Hotel / Block' },
      { name: 'Large Campus', label: 'Large Campus' }
    ],
    icon: 'hotspot',
    order: 3,
    comingSoon: true
  },
  {
    slug: 'cctv-surveillance',
    title: 'CCTV & Surveillance',
    tagline: 'HD IP cameras · Remote viewing · DVR/NVR setup · Mobile app',
    tag: 'Security',
    description: 'Professional CCTV installation for homes, offices, warehouses, and perimeter security. We design camera placement for maximum coverage with minimal blind spots and set up remote viewing worldwide.',
    features: [
      'Site survey and strategic camera placement',
      'HD IP and analog camera installation',
      'DVR/NVR setup with local and cloud storage',
      'Mobile app configuration (iOS & Android)',
      'Night vision and motion detection setup',
      'Cable management and concealment'
    ],
    tiers: [
      { name: 'Home (4 cams)', label: 'Home (4 cams)' },
      { name: 'Office (8 cams)', label: 'Office (8 cams)' },
      { name: 'Perimeter', label: 'Perimeter' }
    ],
    icon: 'cctv',
    order: 4,
    comingSoon: true
  },
  {
    slug: 'structured-cabling',
    title: 'Structured Cabling',
    tagline: 'Cat5e / Cat6 · Patch panels · Cable trays · Certified runs',
    tag: 'Infrastructure',
    description: 'Clean, organised cabling is the backbone of any reliable network. Our structured cabling delivers properly routed, labelled, and documented data cables — scalable, serviceable, and built to last.',
    features: [
      'Cat5e and Cat6 data cabling',
      'Cable tray, conduit, and raceway installation',
      'Patch panel and network rack installation',
      'All cable runs tested and certified',
      'Cable labelling and full documentation',
      'Suitable for new builds and retrofits'
    ],
    tiers: [
      { name: 'Small Office', label: 'Small Office' },
      { name: 'Medium', label: 'Medium' },
      { name: 'Large Building', label: 'Large Building' }
    ],
    icon: 'cabling',
    order: 5,
    comingSoon: true
  },
  {
    slug: 'it-support',
    title: 'IT Support & Maintenance',
    tagline: 'Remote & on-site · Monthly contracts · Network monitoring · Priority SLA',
    tag: 'Ongoing Support',
    description: 'Network problems don\'t wait for convenient times. Our IT support contracts give your business a dedicated technical partner available remotely and on-site to keep your infrastructure running smoothly.',
    features: [
      'Monthly and annual support contracts',
      'Remote troubleshooting with guaranteed response times',
      'On-site visits included in contract',
      'Proactive network health monitoring and alerts',
      'Router, switch, and AP firmware updates',
      'Priority SLA for contracted clients'
    ],
    tiers: [
      { name: 'Monthly', label: 'Monthly' },
      { name: 'Quarterly', label: 'Quarterly' },
      { name: 'Annual', label: 'Annual' }
    ],
    icon: 'support',
    order: 6,
    comingSoon: false
  }
]

const projects = [
  {
    title: 'Eldoret City Hotel — Full Hotspot System',
    category: 'hotspot',
    location: 'Eldoret CBD, Uasin Gishu',
    tag: 'M-Pesa Billing',
    description: 'Designed and deployed a full hotel-wide hotspot system across 3 floors and 80 rooms. Includes a branded captive portal, M-Pesa STK push payment integration, voucher-based access, and per-user bandwidth controls.',
    tags: ['M-Pesa Billing', 'Branded Portal', '80 Rooms', 'MikroTik', 'Remote Monitoring'],
    featured: true,
    large: true
  },
  {
    title: 'SACCO HQ — 3-Floor Network',
    category: 'networks',
    location: 'Eldoret Town',
    tag: 'VLAN + PoE Switches',
    description: 'Full network infrastructure design and installation across 3 floors. Included Cat6 structured cabling, PoE switch rack, VLAN segmentation for staff/guest/management traffic, and enterprise Ubiquiti access points.',
    tags: ['Cat6 Cabling', 'VLAN Segmentation', 'Ubiquiti APs', 'PoE Rack', 'Network Documentation'],
    featured: true,
    large: false
  },
  {
    title: '5-Bedroom Residence — Full Coverage',
    category: 'wifi',
    location: 'Elgon View, Eldoret',
    tag: 'Mesh Network',
    description: 'Complete home WiFi overhaul. Site survey revealed 3 dead zones. Deployed a mesh network with 3 access points, cable concealment, and a separate IoT network for smart home devices.',
    tags: ['Mesh Network', 'Dead Zone Eliminated', '3 Access Points', 'Smart Home', '30-Day Guarantee'],
    featured: true,
    large: false
  },
  {
    title: 'Supermarket — 12-Camera System',
    category: 'cctv',
    location: 'Langas, Eldoret',
    tag: 'Remote Viewing',
    description: '12-camera HD IP surveillance system covering all entry/exit points, cashier areas, storage rooms, and the car park. NVR configured with 30-day cloud backup and motion alerts.',
    tags: ['12 HD Cameras', 'Cloud Backup', 'Motion Detection', 'Mobile Viewing', 'Car Park Coverage'],
    featured: false,
    large: false
  },
  {
    title: 'Residential Estate — 80 Units',
    category: 'hotspot',
    location: 'Kapsaret, Eldoret',
    tag: 'Voucher System',
    description: 'Large-scale hotspot deployment across an 80-unit gated estate with outdoor weatherproof access points. Residents purchase vouchers via M-Pesa or at the estate office.',
    tags: ['80 Units', 'Outdoor APs', 'Voucher System', 'M-Pesa', 'Bandwidth Management'],
    featured: false,
    large: false
  },
  {
    title: 'Microfinance Office — Cat6 Full Build',
    category: 'cabling',
    location: 'Eldoret CBD',
    tag: '40 Workstations',
    description: 'Complete structured cabling project for a microfinance institution with 40 workstations across 2 floors. All Cat6 runs certified, labelled, and documented with patch panels and server rack.',
    tags: ['40 Workstations', 'Cat6 Certified', 'Patch Panel', 'Server Rack', 'Cable Trays'],
    featured: false,
    large: false
  },
  {
    title: 'Secondary School — Campus Network',
    category: 'wifi',
    location: 'Nandi Hills',
    tag: 'Computer Lab + Staff',
    description: 'Full campus network covering the computer lab (30 PCs), staff room, library, and administration block. Separate segments for students and staff with content filtering.',
    tags: ['Computer Lab', 'Staff Network', 'Content Filtering', 'Library Coverage', 'Server Room'],
    featured: false,
    large: false
  },
  {
    title: 'Private Clinic — Secure Medical Network',
    category: 'networks',
    location: 'Kitale, Trans Nzoia',
    tag: 'HIPAA-Ready',
    description: 'Secure network infrastructure with separate VLANs for clinical systems, admin computers, and patient Wi-Fi. Appropriate access controls to protect sensitive medical data.',
    tags: ['Medical Network', 'VLAN Isolation', 'Guest WiFi', 'Access Control', 'Kitale'],
    featured: false,
    large: false
  },
  {
    title: 'Warehouse — Perimeter + Interior',
    category: 'cctv',
    location: 'Industrial Area, Eldoret',
    tag: 'Night Vision',
    description: 'Comprehensive CCTV coverage including perimeter fence lines, loading bays, storage areas, and office entry points. Full HD with IR night vision and RAID storage.',
    tags: ['Perimeter Coverage', 'Night Vision', 'Loading Bay', 'RAID Storage', 'Security Access'],
    featured: false,
    large: false
  }
]

const stats = {
  installations: 200,
  businessClients: 50,
  yearsExperience: 5,
  citiesServed: 15,
  satisfaction: 98
}

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/itworks'
    console.log(`Connecting to database at ${MONGO_URI}...`)
    
    await mongoose.connect(MONGO_URI)
    console.log('✓ Successfully connected to MongoDB.')

    // 1. Clear Existing Data
    console.log('Clearing old services, projects, and stats...')
    await Service.deleteMany({})
    await Project.deleteMany({})
    await Stats.deleteMany({})
    console.log('✓ Cleared old data.')

    // 2. Insert Services
    console.log(`Seeding ${services.length} services...`)
    await Service.insertMany(services)
    console.log('✓ Services seeded successfully.')

    // 3. Insert Projects
    console.log(`Seeding ${projects.length} projects...`)
    await Project.insertMany(projects)
    console.log('✓ Projects seeded successfully.')

    // 4. Insert Stats
    console.log('Seeding website stats...')
    await Stats.create(stats)
    console.log('✓ Stats seeded successfully.')

    console.log('✓ Database seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('✗ Seeding failed:', err.message)
    process.exit(1)
  }
}

seedDatabase()
