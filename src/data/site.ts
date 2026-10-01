/**
 * Single source of truth for every factual claim on this site.
 *
 * RULE: nothing in this file may assert an award, metric, user count, client,
 * employer, publication or certification that has not been confirmed.
 * Unconfirmed items live in `PLACEHOLDERS` and are rendered as visible TBC
 * markers, never as fact.
 */

export const PERSON = {
  name: 'Abhyudh Solanki',
  shortName: 'Abhyudh',
  role: 'AI · Product · Robotics',
  location: 'India',
  timezone: 'Asia/Kolkata',
  tzLabel: 'IST',
  /** Positioning line. Deliberately not "aspiring / passionate student". */
  positioning:
    'A young builder working at the intersection of AI, product, robotics and design.',
  /**
   * Character-portrait photos.
   * - about: run through the ASCII character-grid treatment.
   * - ledge: the real cutout photo (genuine alpha transparency, no baked
   *   background) shown as-is, perched on a section divider — not
   *   converted to the ASCII style.
   *
   * portrait-1.png (the original green-screen selfie) isn't currently
   * placed anywhere — kept in /public if a use for it comes up.
   */
  photos: {
    about: '/portrait-2.png',
    ledge: '/portrait-3.png',
  },
  /** Intrinsic pixel sizes, so images can always reserve their own space. */
  photoSizes: {
    about: { width: 290, height: 447 },
    ledge: { width: 433, height: 465 },
  },
} as const

/**
 * Address assembled at runtime rather than written as a literal.
 *
 * This page is client-rendered, so the served HTML never contains it — but
 * the bundle did, and a bundle is just as easy to grep as a page. Decoding it
 * here keeps `name@domain.tld` out of the shipped text entirely, which is
 * enough to miss every scraper that is not running a browser. It is
 * obfuscation, not protection: anyone executing the page still sees it,
 * which is the point.
 */
const EMAIL = atob('YWJoeXVkaHNvbGFua2lAZ21haWwuY29t')

/**
 * Links are intentionally empty until real URLs are supplied.
 * An empty href renders as a disabled "not linked yet" row rather than a
 * fabricated profile.
 */
export const LINKS: { label: string; href: string; handle: string }[] = [
  { label: 'Email', href: `mailto:${EMAIL}`, handle: EMAIL },
  { label: 'GitHub', href: 'https://github.com/abhyudhPSS', handle: '@abhyudhPSS' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/abhyudh-p-s-solanki-62443828a/',
    handle: '@abhyudhPSS',
  },
]

/** Things I was asked to include but cannot state as fact yet. */
export const PLACEHOLDERS = {
  certificates: 'not yet documented — no certificate list is being claimed',
} as const

export const BOOK = {
  title: 'MECHCORPS',
  about: 'On the accelerating growth of AI.',
  href: 'https://www.bribooks.com/bookstore/mechcorps/',
} as const

export const HERO = {
  /** Kept short, declarative, slightly unconventional. */
  statement: ['i build things', 'to find out', 'if i can.'],
  sub:
    'AI systems, products, robots and a lot of experiments that did not work. ' +
    'Mostly built out of stubbornness.',
} as const

export const MARQUEE = [
  'build → experiment → learn → ship',
  'curiosity is a working method',
  'take it apart first',
  'ideas are cheap until they run',
]

export const ABOUT = {
  lede:
    'I started building software before I knew what any of it was called. ' +
    'That has not really changed — I still learn things by breaking them open ' +
    'and putting them back together slightly wrong.',
  body: [
    'Most of what I make sits between a few fields at once. An AI model is only ' +
      'interesting to me once it is inside something a person can actually hold or ' +
      'open or argue with. So the work tends to drift: a classifier becomes a product, ' +
      'a product needs an interface, an interface needs hardware, and the hardware ' +
      'needs the model to be smaller than it was.',
    'I care about how things feel to use, not only whether they run. I design the ' +
      'product and I write the code, which means I get to blame exactly one person ' +
      'when it is bad.',
    'Right now I am mostly interested in local AI, computer vision, and the question ' +
      'of what a personal computer should be doing for you that it currently is not.',
  ],
  /** Marginalia — rendered as handwritten-feeling annotations. */
  notes: [
    { at: 0, text: 'age 10 → MIT App Inventor · age 12 → Python' },
    { at: 1, text: 'designer and engineer, same person' },
    { at: 2, text: 'currently: making models run offline' },
  ],
  curious: [
    'local inference on tiny hardware',
    'why most AI products feel the same',
    'robot perception',
    'interface design as a form of argument',
    'how encryption actually works',
    'building companies, eventually',
  ],
} as const

export type Project = {
  id: string
  index: string
  name: string
  kind: string
  year: string
  status: string
  thesis: string
  body: string
  facts: { k: string; v: string }[]
  stack: string[]
  /** Visual identity per project — drives the generative artifact + accent. */
  accent: string
  artifact:
    | 'satya'
    | 'mangal'
    | 'minti'
    | 'lumo'
    | 'vision'
    | 'sentinel'
    | 'chemverse'
    | 'secureecom'
    | 'voicecar'
    | 'soilmonitor'
    | 'dhankhedi'
    | 'sakha'
  /** Shown as a factual note, never as an award unless confirmed. */
  note?: string
  /** Live link to the project, when one exists. */
  link?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'satya',
    index: '01',
    name: 'SATYA AI',
    kind: 'Misinformation analysis',
    year: '2025',
    status: 'Prototype',
    thesis: 'What can a machine actually tell you about a claim it has never seen?',
    body:
      'SATYA reads a headline or an article and tries to work out how much of it is ' +
      'load-bearing. It pulls supporting material through search, compares what the ' +
      'claim asserts against what it can find, and classifies the gap. It does not ' +
      'return a verdict — it returns its reasoning, because a confidence score with no ' +
      'argument behind it is just a more confident lie.',
    facts: [
      { k: 'Input', v: 'Headline, article, claim' },
      { k: 'Method', v: 'LLM reasoning + retrieval' },
      { k: 'Output', v: 'Signals, not a verdict' },
      { k: 'Open problem', v: 'Visual claims' },
    ],
    stack: ['Gemini API', 'Google Custom Search', 'NLP', 'Classification', 'Python'],
    accent: '#F2542A',
    artifact: 'satya',
  },
  {
    id: 'mangal',
    index: '02',
    name: 'MANGAL',
    kind: 'Local AI assistant',
    year: 'Age 15',
    status: 'In progress',
    thesis: 'What if your computer actually felt like it was on your side?',
    body:
      'Mangal is an attempt at a personal assistant that lives on the machine instead ' +
      'of in someone else\'s datacentre. It runs on a local LLM rather than calling out ' +
      'to the cloud, alongside wake word, voice, a camera it can look through, and enough ' +
      'context to handle mail, reminders, weather and the small administrative friction ' +
      'of a day. The constraint is the interesting part: everything it can do, it has to ' +
      'do locally, which rules out most of the easy answers.',
    facts: [
      { k: 'Trigger', v: 'Wake word, always-on' },
      { k: 'Processing', v: 'Local LLM, local-first' },
      { k: 'Senses', v: 'Voice, vision' },
      { k: 'Constraint', v: 'No cloud round-trip' },
    ],
    stack: ['Python', 'Local LLM', 'Speech', 'Computer vision', 'Automation'],
    accent: '#C8F751',
    artifact: 'mangal',
  },
  {
    id: 'minti',
    index: '03',
    name: 'MINTI FINANCE',
    kind: 'Financial literacy product',
    year: '2025',
    status: 'Ideathon winner',
    thesis: 'Teenagers are told to be good with money by people who never show them how.',
    body:
      'Minti teaches money by letting you lose it — simulated markets, simulated funds, ' +
      'simulated consequences, and none of your actual savings. An AI layer explains what ' +
      'just happened to your portfolio in language that does not assume you already know. ' +
      'The gamification is deliberate and slightly cynical: the behaviour we are competing ' +
      'with is also gamified.',
    facts: [
      { k: 'Audience', v: 'Teenagers' },
      { k: 'Market', v: 'Simulated, zero risk' },
      { k: 'Layer', v: 'AI budgeting guidance' },
      { k: 'Loop', v: 'Challenges, leaderboards' },
    ],
    stack: ['Product design', 'AI', 'Gamification', 'UI/UX'],
    accent: '#4FD39A',
    artifact: 'minti',
    link: 'https://mintifinance.lovable.app',
    note: 'Won an ideathon.',
  },
  {
    id: 'lumo',
    index: '04',
    name: 'LUMO',
    kind: 'Hardware + product concept',
    year: '2025',
    status: 'Concept',
    thesis: 'Can technology help teenagers without handing them more technology to consume?',
    body:
      'Lumo started from a problem that does not have a software answer: loneliness, peer ' +
      'pressure, and screens that are engineered to be difficult to put down. The response ' +
      'was deliberately not another app. It is a dedicated object with one job, a quiet ' +
      'interface, an AI that talks rather than feeds, and a parental view that does not read ' +
      'like surveillance. I worked through the industrial design, the build cost and the ' +
      'business case, because a concept that cannot be manufactured is a poster.',
    facts: [
      { k: 'Form', v: 'Dedicated device' },
      { k: 'Anti-goal', v: 'Another social app' },
      { k: 'Surface', v: 'Minimal, non-addictive' },
      { k: 'Scope', v: 'Hardware, OS, pricing' },
    ],
    stack: ['Industrial design', 'Product OS', 'AI interaction', 'Business model'],
    accent: '#9B8CFF',
    artifact: 'lumo',
    note: 'Submitted as a project for the INSPIRE Awards – MANAK.',
  },
  {
    id: 'sentinel',
    index: '05',
    name: 'SENTINEL',
    kind: 'End-to-end encrypted chat',
    year: 'Age 15',
    status: 'Prototype',
    thesis: 'Most encrypted chat protects what you say. Not who you said it to.',
    body:
      'Sentinel is a messaging platform built on Libsodium, encrypting every message ' +
      'end-to-end with X3DH and Double Ratchet — the same family of cryptography behind ' +
      'Signal. Most encrypted chat apps stop at message content and leave metadata, who ' +
      'is talking to whom and when, exposed to the server. Sentinel is built to close ' +
      'that gap too, alongside a properly considered, dark-first interface — the security ' +
      'is not an excuse for the app to look unfinished.',
    facts: [
      { k: 'Crypto', v: 'Libsodium, X3DH + Double Ratchet' },
      { k: 'Scope', v: 'Content and metadata' },
      { k: 'Media', v: 'Encrypted attachments, calls' },
      { k: 'Interface', v: 'Dark, considered' },
    ],
    stack: ['Libsodium', 'X3DH', 'Double Ratchet', 'TypeScript', 'WebRTC'],
    accent: '#3B9EFF',
    artifact: 'sentinel',
  },
  {
    id: 'chemverse',
    index: '06',
    name: 'CHEMVERSE',
    kind: 'Chemistry visualisation',
    year: 'Recent',
    status: 'Live',
    thesis: 'Chemistry got easier once I could actually see the atom moving.',
    body:
      'Chemverse renders atoms and molecules in interactive 3D instead of leaving them ' +
      'flat on a textbook page — starting with an animated Bohr model of the oxygen atom: ' +
      'protons and neutrons in the nucleus, electrons orbiting in labelled shells, atomic ' +
      'number and mass number alongside it. Click on any part and it opens further detail; ' +
      'live demos and walk-throughs of the underlying practicals sit next to the model. I ' +
      'built it because I was the one struggling to picture this from a diagram, and ' +
      'building it made it click.',
    facts: [
      { k: 'Renders', v: 'Atoms, molecules in 3D' },
      { k: 'Interaction', v: 'Click to inspect, zoom, speed' },
      { k: 'Also includes', v: 'Live demos, practicals' },
      { k: 'Origin', v: 'Built to understand it myself' },
    ],
    stack: ['React', 'TypeScript', '3D visualisation', 'Interactive UI'],
    accent: '#D68CFF',
    artifact: 'chemverse',
  },
  {
    id: 'secureecom',
    index: '07',
    name: 'SECURE ECOM',
    kind: 'Privacy-first commerce',
    year: 'Recent',
    status: 'Concept',
    thesis: 'Buying something online should not mean handing over your identity.',
    body:
      'Secure Ecom is a concept for an anonymous, privacy-first e-commerce platform, built ' +
      'around high encryption so a purchase does not have to leave a data trail behind it. ' +
      'It is early-stage, but the question behind it runs through most of what I build: how ' +
      'much of a normal transaction can happen without anyone needing to know who you are.',
    facts: [
      { k: 'Focus', v: 'Anonymity, encryption' },
      { k: 'Domain', v: 'E-commerce' },
      { k: 'Goal', v: 'No data trail' },
    ],
    stack: ['Encryption', 'Privacy engineering', 'Product design'],
    accent: '#F5C242',
    artifact: 'secureecom',
  },
  {
    id: 'voicecar',
    index: '08',
    name: 'VOICE-CONTROLLED CAR',
    kind: 'Bluetooth robotics',
    year: 'Age 12',
    status: 'Complete',
    thesis: 'My first robot took voice commands over Bluetooth and mostly did what it was told.',
    body:
      'A small car controlled by voice, built when I was twelve — spoken commands travel ' +
      'over a Bluetooth module and move it forward, back, left and right. It was the first ' +
      'time I had sound, wireless communication and motors all listening to each other, ' +
      'which is a smaller problem than it sounds and a bigger one than it looks.',
    facts: [
      { k: 'Input', v: 'Voice' },
      { k: 'Link', v: 'Bluetooth module' },
      { k: 'Output', v: 'Motorised movement' },
    ],
    stack: ['Arduino', 'Bluetooth module', 'Motors'],
    accent: '#29C4DE',
    artifact: 'voicecar',
  },
  {
    id: 'soilmonitor',
    index: '09',
    name: 'SOIL MONITORING SYSTEM',
    kind: 'Agricultural sensing',
    year: 'Age 13',
    status: 'Complete',
    thesis: 'Before I could build anything smarter, I had to learn to read a patch of soil.',
    body:
      'A soil monitoring system built when I was thirteen, using a soil moisture sensor ' +
      'alongside other sensors to read conditions in the ground. It was a small early ' +
      'version of the instinct that later became Dhan Khedi: measure a growing environment ' +
      'accurately, and you can act on it instead of guessing.',
    facts: [
      { k: 'Sensing', v: 'Soil moisture + other sensors' },
      { k: 'Domain', v: 'Agriculture' },
      { k: 'Kind', v: 'Embedded sensing' },
    ],
    stack: ['Sensors', 'Embedded systems'],
    accent: '#A9744F',
    artifact: 'soilmonitor',
  },
  {
    id: 'dhankhedi',
    index: '10',
    name: 'DHAN KHEDI',
    kind: 'Agri storage monitoring',
    year: 'Age 14',
    status: 'Complete',
    thesis: 'Most farmers in India cannot afford a silo. Their storage room can still act like one.',
    body:
      'Built when I was fourteen, Dhan Khedi turns an ordinary storage room into a ' +
      'monitored one — an ESP8266 and sensors tracking temperature, humidity and gas ' +
      'levels, the conditions that matter for keeping stored grain from spoiling. Most ' +
      'farmers store produce in rooms on the farm rather than proper silos, simply ' +
      'because silos are out of budget. The system gives them a way to monitor that ' +
      'space properly, hold onto quality for longer, and sell at a better price instead ' +
      'of losing it to spoilage.',
    facts: [
      { k: 'Monitors', v: 'Temperature, humidity, gas' },
      { k: 'Problem', v: 'No budget for silos' },
      { k: 'Goal', v: 'Better price at sale' },
      { k: 'Domain', v: 'Agri-tech' },
    ],
    stack: ['ESP8266', 'Sensors', 'Embedded monitoring', 'Agri-tech'],
    accent: '#E2A63B',
    artifact: 'dhankhedi',
  },
  {
    id: 'sakha',
    index: '11',
    name: 'SAKHA',
    kind: 'Assistive mobility device',
    year: 'Age 14',
    status: 'Prototype',
    thesis: "A stick that notices what you can't see, before you walk into it.",
    body:
      'Sakha — named after the Sanskrit word for "friend" — is a walking stick for blind, ' +
      'visually impaired and elderly people, built when I was fourteen. An Arduino Nano reads an ' +
      'ultrasonic sensor pinging for obstacles ahead; as the distance closes, feedback ' +
      'through a combined vibration motor and buzzer gets faster, then continuous, so the ' +
      'person feels the danger increase rather than being told once. The piezoelectric ' +
      "layer — generating power from the user's own footsteps while they walk — is the one " +
      'part still in prototype. Everything else is working.',
    facts: [
      { k: 'Detection', v: 'Ultrasonic, graduated warning' },
      { k: 'Feedback', v: 'Vibration + buzzer, distance-scaled' },
      { k: 'Controller', v: 'Arduino Nano' },
      { k: 'In progress', v: 'Piezoelectric energy harvesting' },
    ],
    stack: ['Arduino Nano', 'Ultrasonic sensor', 'Piezoelectric', 'Embedded C++'],
    accent: '#3FCDB0',
    artifact: 'sakha',
  },
  {
    id: 'vision',
    index: '12',
    name: 'ROBOTICS & VISION',
    kind: 'Hardware experiments',
    year: 'Ongoing',
    status: 'Workbench',
    thesis: 'Not everything I build fits inside a browser tab.',
    body:
      'A running series of physical experiments — cameras, motors, a Raspberry Pi, and ' +
      'models small enough to run on it. The recurring project is an autonomous ' +
      'waste-collection robot: detect the object, decide it is worth collecting, move, ' +
      'collect. Every step of that sentence is harder in a room than it is in a dataset, ' +
      'which is the entire reason it is worth doing.',
    facts: [
      { k: 'Compute', v: 'Raspberry Pi' },
      { k: 'Sensing', v: 'Camera, object detection' },
      { k: 'Actuation', v: 'Motors, drive' },
      { k: 'Reality gap', v: 'Considerable' },
    ],
    stack: ['OpenCV', 'Python', 'Raspberry Pi', 'Motors', 'Sensors'],
    accent: '#F0733C',
    artifact: 'vision',
  },
]

export const STACK: { group: string; note: string; items: string[] }[] = [
  {
    group: 'Intelligence',
    note: 'Models, and getting them to be useful',
    items: [
      'Python',
      'Machine learning',
      'Neural network fundamentals',
      'NLP',
      'Computer vision',
      'OpenCV',
      'Gemini / LLM APIs',
    ],
  },
  {
    group: 'Software',
    note: 'The part that has to actually run',
    items: [
      'JavaScript',
      'Node.js',
      'Django',
      'HTML',
      'CSS',
      'APIs',
      'Automation',
      'React Native',
      'Expo',
    ],
  },
  {
    group: 'Product',
    note: 'Deciding what it should be before building it',
    items: [
      'UI/UX',
      'Product design',
      'Interaction design',
      'Prototyping',
      'Visual design',
      'Figma',
      'Canva',
    ],
  },
  {
    group: 'Physical',
    note: 'Where the abstractions stop working',
    items: [
      'Raspberry Pi',
      'Arduino',
      'ESP8266',
      'Robotics',
      'Cameras',
      'Motors',
      'Sensors',
      'CV systems',
    ],
  },
  {
    group: 'Workflow',
    note: 'Tools I am currently building with',
    items: [
      'GSAP',
      'Motion',
      'Anime.js',
      'Ollama',
      'MCP workflows',
      'OriginKit',
      'Morphicons',
    ],
  },
]

export const TIMELINE: {
  when: string
  head: string
  body: string
  link?: string
  linkLabel?: string
}[] = [
  {
    when: 'Started',
    head: 'Took things apart',
    body: 'Began experimenting with computers and code well before it was a subject at school.',
  },
  {
    when: 'Age 10',
    head: 'Drag-and-drop AI assistant',
    body: 'Built an AI assistant in MIT App Inventor — no real code yet, but the first time an idea became something that ran.',
  },
  {
    when: 'Age 12',
    head: 'Started development with Python',
    body: 'Moved from drag-and-drop blocks to actual code. Built a working voice assistant — it was bad, but it was mine. Also built a voice-controlled car over Bluetooth, the first robot.',
  },
  {
    when: 'Then',
    head: 'Machine learning',
    body: 'Moved from scripts to models — classification, NLP, then computer vision.',
  },
  {
    when: 'Age 13',
    head: 'Soil monitoring system',
    body: 'First real sensor project — soil moisture and more, read and reported properly.',
  },
  {
    when: 'Age 14',
    head: 'Dhan Khedi and Sakha',
    body: 'The same year: a storage-room monitor for farmers, and a smart stick for the visually impaired.',
  },
  {
    when: 'Age 15',
    head: 'Mangal and Sentinel',
    body: 'A local AI assistant, and an end-to-end encrypted chat platform. Still 15, still building both.',
  },
  {
    when: 'Then',
    head: 'Products, not demos',
    body: 'SATYA, Minti, Lumo, Chemverse and Secure Ecom — designed as products with users, pricing and a reason to exist.',
  },
  {
    when: 'Also',
    head: `Wrote ${BOOK.title}`,
    body: `A book on the accelerating growth of AI, written young.`,
    link: BOOK.href,
    linkLabel: 'Read it',
  },
  {
    when: 'Now',
    head: 'Local AI + deep tech',
    body: 'Continuing robotics experiments, and building a development workflow around AI-assisted engineering.',
  },
]

export type Achievement = { title: string; meta: string }
export type AchievementGroup = { category: string; items: Achievement[] }

/**
 * Formal recognition, kept exactly as won or participated — a "Winner" stays
 * a winner, a quiz completed stays a quiz completed. Nothing here is
 * upgraded. The "Overall profile" summary category from the source list is
 * deliberately omitted: it only restates the other seven.
 */
export const ACHIEVEMENTS: AchievementGroup[] = [
  {
    category: 'Innovation, hackathons & science',
    items: [
      {
        title: 'Winner — Skillizee Ideathon Level 2.0',
        meta: 'Top 5% · "The Best in STEM 2024" · with E-Cell BITS Hyderabad, E-Cell IIT Bombay',
      },
      {
        title: '1st place — Inter-School SciPoTech 2024–25',
        meta: 'Podar World School, Jaipur · Oct 2024',
      },
      {
        title: '2nd position — District Level Science Fair 2024–25',
        meta: '"Model for Special Need" · Rajasthan Education Dept + RSCERT · Oct 2024',
      },
      {
        title: 'Startup pitching — Rajasthan Youth Board & UNICEF',
        meta: 'Youth Empowerment Startup Opportunities · Aug 2025',
      },
      {
        title: 'WWT IGNIS 2025 Hackathon',
        meta: 'Team SATYA AI · Shooting Stars Foundation × World Wide Technology',
      },
      {
        title: 'UDHBAV-2025 — 4th National Project Exhibition',
        meta: 'Software category · Poornima Institute of Engineering & Technology · Oct 2025',
      },
      {
        title: 'CBSE Regional Science Exhibition 2024–25',
        meta: 'Representing Cambridge Court World School',
      },
    ],
  },
  {
    category: 'MUN & public speaking',
    items: [
      { title: 'Special Mention', meta: 'Model United Nations' },
      { title: 'UNICEF committee award', meta: 'MUN — impact of COVID-19 on education' },
      { title: 'Elocution competition', meta: 'Rotary Club Jaipur Udaan · Nelson Mandela Day' },
    ],
  },
  {
    category: 'Publications',
    items: [
      {
        title: `Published author — ${BOOK.title}`,
        meta: 'BriBooks · Summer Book Writing Festival (India), 2023',
      },
    ],
  },
  {
    category: 'Quizzes & academic',
    items: [
      {
        title: 'Quarter-finalist — Cryptics 6.0',
        meta: 'All India Computer Quiz · Vydehi School of Excellence · Oct 2023',
      },
      { title: 'Chandrayaan-3 Mahaquiz', meta: 'ISRO × MyGov' },
      { title: 'National Space Day Quiz', meta: 'ISRO × MyGov' },
      { title: 'Anti-Doping Quiz', meta: 'NADA India × MyGov' },
    ],
  },
]

export const BELIEFS: { n: string; head: string; body: string }[] = [
  {
    n: '01',
    head: 'Build it, then argue about it.',
    body: 'An idea is a rumour until it runs. The argument gets much shorter once there is something to point at.',
  },
  {
    n: '02',
    head: 'If I cannot explain it, I have not understood it.',
    body: 'So I take it apart. This is slower than reading the documentation and it works considerably better.',
  },
  {
    n: '03',
    head: 'Good products feel obvious.',
    body: 'The system underneath is allowed to be complicated. The thing the person touches is not.',
  },
  {
    n: '04',
    head: 'Nobody is going to give you permission.',
    body: 'There is no qualifying round for building something. You just start and find out in public.',
  },
  {
    n: '05',
    head: 'Most of it will not work.',
    body: 'That is the price of the few that do. I would rather have a shelf of failures than a folder of plans.',
  },
]

/** Small, human, true. Rendered as draggable objects on a desk. */
export const DESK: { tag: string; text: string; tone?: 'signal' | 'acid' | 'ink' }[] = [
  { tag: 'currently', text: 'getting a model to run without the internet', tone: 'signal' },
  { tag: 'reading', text: 'anything about how companies actually get started' },
  { tag: 'obsessed with', text: 'local inference', tone: 'acid' },
  { tag: 'on repeat', text: 'music, loudly, while debugging' },
  { tag: 'unresolved', text: 'why robot perception is so much harder in a real room' },
  { tag: 'watching', text: 'films — mostly for the production design', tone: 'ink' },
  { tag: 'learning', text: 'how encryption primitives fit together' },
  { tag: 'building', text: 'a Jarvis that is not a party trick', tone: 'signal' },
]

/**
 * Off the keyboard: skateboarding, and trying new things (archery). Real
 * photos of Abhyudh, shown as-is. Captions describe only what the photos
 * show — no claims about skill level, frequency or results.
 */
export const OUTSIDE = {
  head: ['off the screen,', 'same habit.'],
  body:
    'Away from the keyboard I skateboard, and I try new things. It is the same habit ' +
    'as everything above: pick it up, see what happens.',
  /**
   * `webp` is the 820px-wide version actually needed (these render at most
   * 408 CSS px, so 820 covers a 2x display); `src` is the original, kept as
   * the fallback source and as the archive copy.
   */
  photos: [
    {
      src: '/skate.jpg',
      webp: '/skate.webp',
      width: 1200,
      height: 1600,
      alt: 'Abhyudh on a skateboard against an orange and blue sunset sky, in silhouette',
      tag: 'skateboarding',
      text: 'pushing around at sunset.',
    },
    {
      src: '/archery.jpg',
      webp: '/archery.webp',
      width: 900,
      height: 1200,
      alt: 'Abhyudh, seen from behind, drawing a bow at an archery target on a lawn',
      tag: 'something new',
      text: 'archery. took a shot.',
    },
  ],
} as const

export const CONNECT = {
  head: ['have something', 'weird to build?'],
  body:
    'I am usually mid-project and open to another one. AI, product, robotics, ' +
    'hardware, or something that does not have a category yet.',
} as const

export const SEO = {
  title: 'Abhyudh Solanki — AI, Product & Robotics Builder',
  description:
    'Abhyudh Solanki — a young builder working at the intersection of AI, product, ' +
    'robotics and design. Twelve projects, from robotics at 12 to encrypted chat at 15.',
  /** Injected from SITE_ORIGIN in vite.config.ts — never hardcode it here. */
  canonical: `${__SITE_ORIGIN__}/`,
} as const
