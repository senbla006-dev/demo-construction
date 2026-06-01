import { Project, ServiceItem, MachineSpec, ProcessPhase, AuditMetric } from "./types";

// Let's reference both Unsplash imagery and our high-end custom generated images!
export const PROJECTS: Project[] = [
  {
    id: "proj-manhattan",
    title: "Manhattan Crystal Pinnacle",
    city: "New York, NY",
    year: "2025",
    category: "Commercial Skyscraper",
    image: "/src/assets/images/elite_skyscraper_1780318341081.png",
    description: "An iconic 72-story commercial skyscraper using active mass dampers, high-efficiency low-E glass structural cladding, and intelligent floor plates overlooking Central Park.",
    stats: [
      { label: "Height", value: "1,140 FT" },
      { label: "Concrete Grade", value: "C80 Structural" },
      { label: "Steel Used", value: "18,400 Tons" },
      { label: "LEED Core", value: "Platinum" }
    ]
  },
  {
    id: "proj-miami",
    title: "Aetheria Luxury Enclosure",
    city: "Miami, FL",
    year: "2026",
    category: "Ultra-Luxury Residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    description: "State-of-the-art beachfront residential complex engineered with pile foundation anchorage for dynamic storm surges and custom post-tensioned dynamic concrete floors.",
    stats: [
      { label: "Area", value: "145,000 SQFT" },
      { label: "Shoring Depth", value: "-45 FT Anchor" },
      { label: "Seismic rating", value: "Zone 4 Safe" },
      { label: "Completion", value: "100%" }
    ]
  },
  {
    id: "proj-texas",
    title: "Texas Inland LogiForce Corridor",
    city: "Houston, TX",
    year: "2024",
    category: "Industrial Infrastructure",
    image: "/src/assets/images/heavy_machinery_1780318382785.png",
    description: "An automated mega-logistics depot supporting automated crane hubs, high-capacity slab loads resisting 8,000 PSI, and massive dynamic span roofs.",
    stats: [
      { label: "Roof Span", value: "240 FT Clear" },
      { label: "Slab Strength", value: "8,500 PSI" },
      { label: "Crane Hubs", value: "24 Heavy Gantry" },
      { label: "Acres Developed", value: "180 Acres" }
    ]
  },
  {
    id: "proj-la",
    title: "LA Nexus R&D Biome",
    city: "Los Angeles, CA",
    year: "2025",
    category: "Industrial / Lab Facilities",
    image: "/src/assets/images/structural_steel_1780318362692.png",
    description: "Seismically isolated research lab integrating cleanroom HVAC infrastructure, reinforced vibration-isolated concrete slabs, and a perimeter composite steel frame.",
    stats: [
      { label: "Vibration Isol.", value: "VC-D Certified" },
      { label: "Cleanliness", value: "ISO Class 5" },
      { label: "Structural Steel", value: "9,200 Tons" },
      { label: "Base Isolators", value: "72 Dynamic" }
    ]
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "srv-commercial",
    title: "Commercial Megastructures",
    iconName: "Building2",
    description: "High-rise skyscrapers, corporate headquarters, and mixed-use complexes engineering that define city skies. Built on structural safety and elite corporate aesthetics.",
    features: ["Seismic structural reinforcement", "Intelligent double-glazed curtain walls", "Automated building control systems"],
    specs: "AISD certified tall building foundations with active mass tuning support."
  },
  {
    id: "srv-infrastructure",
    title: "Heavy Civil & Infrastructure",
    iconName: "HardHat",
    description: "Strategic civil assets including logistics ports, spans, transit depots, and energy microgrids designed to sustain generations of stress.",
    features: ["Heavy post-tensioned concrete structural spans", "Reinforced abutments and grading", "Smart stormwater retention engineering"],
    specs: "AASHTO standard grade highway and corridor concrete solutions."
  },
  {
    id: "srv-industrial",
    title: "Industrial & R&D Hubs",
    iconName: "Factory",
    description: "Precision-critical facilities, automated smart logistics warehouses, heavy factory plants, and vibration-isolated research laboratories.",
    features: ["ISO cleanroom system air integration", "Heavy pile load foundations up to 10,000 PSI", "High-capacity dynamic clear-span trusses"],
    specs: "Vibration dampening structures with Class-A environmental containment."
  },
  {
    id: "srv-luxury",
    title: "Luxury Real Estate Developments",
    iconName: "ShieldCheck",
    description: "Prestige architectural landmarks. Exclusive high-end estates and boutique seaside residences prioritizing artistic geometry and customized elite finishes.",
    features: ["Bespoke monolithic architectural concrete work", "Frameless dynamic panoramic glazing systems", "Integrated solar energy shells & wellness biomes"],
    specs: "Fully customized premium finishes paired with advanced defensive storm engineering."
  }
];

export const MACHINES: MachineSpec[] = [
  {
    name: "Cat 395 Excavator",
    type: "Heavy Track Excavation",
    capacity: "205,000 lbs Weight / 8.5 cu yd Bucket",
    usage: "Deep foundational earth retention & high-volume site preparation.",
    powerRating: "542 HP CAT C18 Core",
    efficiency: "Tier IV Final Compliant"
  },
  {
    name: "Liebherr LR 13000",
    type: "Super Heavy Lattice Boom Crawler Crane",
    capacity: "3,000 Metric Tons Max Lift / 470 FT Jib",
    usage: "Lifting complete structural steel frames and core crane modular units.",
    powerRating: "1,360 HP Dual-Genset",
    efficiency: "Intelligent Power Assist"
  },
  {
    name: "Cat D11 Dozer",
    type: "Heavy Terrain Dozer & Grader",
    capacity: "115 Tons Pull / 57 cu yd Blade",
    usage: "Large scale civil site excavation grading and heavy debris displacement.",
    powerRating: "850 HP Twin-Turbo",
    efficiency: "GPS Automated Blade Grade"
  }
];

export const PROCESS_STEPS: ProcessPhase[] = [
  {
    number: "01",
    title: "Master Planning & Geotechnical Feasibility",
    duration: "Month 1 - 2",
    description: "Boring core samples, soil testing, density classification, and architectural coordination to align physical capacity with code authorizations.",
    deliverable: "Comprehensive Soil Report & Permitted Structural Blueprint Draft"
  },
  {
    number: "02",
    title: "Deep Excavation & Shoring",
    duration: "Month 3 - 5",
    description: "Installing surrounding sheet piles, soil nails, or concrete secant walls. Digging out to basement floor levels while ensuring surrounding dirt stability.",
    deliverable: "Secured Anchor Pit with Zero Active Retaining Wall Strain"
  },
  {
    number: "03",
    title: "Core Foundation & Cast Substructure",
    duration: "Month 6 - 9",
    description: "Assembling dense rebar cages, establishing base water-sealed drainage membranes, and hosting continuous high-volume concrete deck pours.",
    deliverable: "Grade-A Solid Concrete Foundation Ready to Support High Axial Load"
  },
  {
    number: "04",
    title: "Superstructure Framing & Cladding",
    duration: "Month 10 - 15",
    description: "Erecting vertical structural columns, high-tensile structural horizontal trusses, followed by dynamic safety screens and insulated curtain window panes.",
    deliverable: "Fully Sealed Weatherproof Thermal Shell of the Building Perimeter"
  },
  {
    number: "05",
    title: "MEP Systems & Premium Fit-out",
    duration: "Month 16 - 20",
    description: "Trenching commercial energy feeders, massive HVAC chiller lines, automated dampers, stone countertops, and executive premium timber finishes.",
    deliverable: "Safety Audited, Client Fine-Inspected Commissioning Key-Handover"
  }
];

export const SAFETY_METRICS: AuditMetric[] = [
  {
    title: "0.22 OSHA TRIR",
    value: "Industry-Leading Safety",
    sub: "93% below the current US national average for commercial firms.",
    iconName: "ShieldAlert"
  },
  {
    title: "M-Class Certified",
    value: "Zero-Incident System",
    sub: "Every foreman and supervisor possesses active OSHA 30 & structural certifications.",
    iconName: "Award"
  },
  {
    title: "ISO 45001 & 9001",
    value: "Integrated Standards",
    sub: "Certified framework governing quality concrete hydration and crane hoisting security.",
    iconName: "BookOpen"
  }
];
