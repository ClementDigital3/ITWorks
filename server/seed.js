const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Service = require('./models/Service')
const Project = require('./models/Project')
const Stats = require('./models/Stats')
const About = require('./models/About')

dotenv.config()

const services = [
  {
    slug: 'home-wifi',
    title: 'Home WiFi Setup',
    tagline: 'Full-home coverage · Router configuration · Signal optimisation',
    tag: 'Home & Residential',
    description: 'Patchy internet and dead zones end here. We conduct a full site survey before every job, mapping your layout to determine exactly where routers and access points should be placed for complete, consistent coverage.',
    features: [
      'Installation Fee: KES 1,500 only',
      'Unlimited internet with no data caps',
      'No contract — pay monthly and cancel anytime',
      'Localized support (24/7 client support team)',
      'Full site survey and signal mapping',
      'Professional router & access point setup',
      'Works with all Kenyan ISPs — Safaricom, Zuku, Faiba'
    ],
    tiers: [
      { name: 'Plan 1,500', label: 'Plan 1,500 (Up to 5Mbps)' },
      { name: 'Plan 2,000', label: 'Plan 2,000 (Up to 10Mbps)' },
      { name: 'Plan 2,500', label: 'Plan 2,500 (Up to 15Mbps)' },
      { name: 'Plan 3,000', label: 'Plan 3,000 (Up to 20Mbps)' },
      { name: 'Plan 4,000', label: 'Plan 4,000 (Up to 40Mbps)' }
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

const aboutData = {
  storyTitle: 'The Team Behind the Connection',
  storyParagraphs: [
    'ITWORKS Technologies Limited was founded with a clear mission: to bring reliable, professional, and affordable connectivity to homes and businesses in Eldoret and across Kenya. We saw a gap — a market full of ISPs, but not enough companies focused on the installation, configuration, and ongoing support that actually makes internet work well.',
    'From our base in Eldoret, we\'ve grown to serve clients across the North Rift. Every job, regardless of size, gets the same level of attention, professionalism, and quality workmanship.',
    'We\'re a team of certified network engineers and IT professionals who take pride in clean installations, clear communication, and results that last.'
  ],
  missionTitle: 'Our Mission',
  missionStatement: 'To connect every home, office, and institution in Kenya with reliable, fast, and affordable internet infrastructure.',
  missionSub: 'We believe that fast, reliable internet is not a luxury — it\'s infrastructure. Every student, business owner, hotel guest, and family deserves a connection that just works.',
  values: [
    { num: '01', title: 'Reliability', desc: 'We show up when we say we will. We fix what we say we\'ll fix. Your uptime is our responsibility — backed by a 30-day workmanship guarantee.' },
    { num: '02', title: 'Professionalism', desc: 'Clean cable runs, clear documentation, on-time arrivals, and honest pricing. We treat every client\'s home or business with the same respect we\'d want for our own.' },
    { num: '03', title: 'Innovation', desc: 'From MikroTik and Ubiquiti to M-Pesa billing integrations and modern IP camera systems — we bring the latest solutions to the Kenyan market.' }
  ],
  team: [
    { initials: 'JK', name: 'John Kibet', role: 'Founder & CEO', bio: 'Network engineer with 8+ years in ICT infrastructure across Kenya and East Africa.', color: 'av-green' },
    { initials: 'SM', name: 'Sarah Mutai', role: 'Head of Operations', bio: 'Ensures every project is delivered on time, within scope, and to the highest standard.', color: 'av-orange' },
    { initials: 'DK', name: 'David Korir', role: 'Senior Network Engineer', bio: 'Specialist in enterprise networking, MikroTik, and hotspot billing systems.', color: 'av-blue' },
    { initials: 'AJ', name: 'Alice Jepkoech', role: 'Client Support Lead', bio: 'Your first point of contact — responsive, knowledgeable, and always solutions-focused.', color: 'av-teal' }
  ],
  areas: ['Eldoret (HQ)', 'Nakuru', 'Kisumu', 'Kitale', 'Iten', 'Kapsabet', 'Nandi Hills', 'Uasin Gishu', 'Trans Nzoia', 'Nairobi (Enterprise)'],
  areaTitle: 'Eldoret &<br/>Beyond<br/><span>Kenya</span>',
  areaText: 'Our base is Eldoret — but our clients aren\'t limited to the city. We regularly serve businesses, schools, hotels, and homes across the North Rift region and Western Kenya.'
}

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/itworks'
    console.log(`Connecting to database at ${MONGO_URI}...`)
    
    await mongoose.connect(MONGO_URI)
    console.log('✓ Successfully connected to MongoDB.')

    // 1. Clear Existing Data
    console.log('Clearing old services, projects, stats, and about...')
    await Service.deleteMany({})
    await Project.deleteMany({})
    await Stats.deleteMany({})
    await About.deleteMany({})
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

    // 5. Insert About Content
    console.log('Seeding website about content...')
    await About.create(aboutData)
    console.log('✓ About content seeded successfully.')

    console.log('✓ Database seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('✗ Seeding failed:', err.message)
    process.exit(1)
  }
}

seedDatabase()
