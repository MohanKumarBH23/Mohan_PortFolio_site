/**
 * @fileoverview Single-Source-of-Truth Personal Profile, Navigation, Contact Channels & Timeline Data.
 */

export const NAV_ITEMS = Object.freeze([
  { num: '01', id: 'home', label: 'Home', href: '#home' },
  { num: '02', id: 'about', label: 'About Me', href: '#about' },
  { num: '03', id: 'experience', label: 'Experience', href: '#experience' },
  { num: '04', id: 'skills', label: 'Skills', href: '#skills' },
  { num: '05', id: 'publications', label: 'Publications', href: '#publications' },
  { num: '06', id: 'projects', label: 'Projects', href: '#projects' },
  { num: '07', id: 'contact', label: 'Contact', href: '#contact' }
]);

export const PROFILE = Object.freeze({
  monogram: 'MK',
  brandName: 'MOHAN KUMAR',
  fullName: 'MOHAN KUMAR B.H',
  locationShort: 'Bengaluru',
  role: 'AI & ML Engineer',
  availability: 'Available for Full-Time AI/ML & SDE Roles • Bengaluru',
  heroLead:
    'CSE (AI & ML) graduate from Sai Vidya Institute of Technology, Bengaluru (2026). Accepted IEEE ICNPCV 2026 author and AI Intern at Digitaltransols AI Pvt. Ltd.',
  credentials: [
    { label: 'B.Tech AIML', value: '8.80 / 10.0 CGPA' },
    { label: 'Conference', value: 'IEEE ICNPCV ’26' },
    { label: 'Focus', value: 'Artificial Intelligence • Machine Learning • Core CS' }
  ],
  avatar: {
    src: 'assets/images/mohan-avatar.jpg',
    alt: 'Mohan Kumar B.H',
    width: 400,
    height: 400
  },
  resume: {
    url: 'assets/documents/Mohan_Resume.pdf',
    downloadName: 'Mohan_Kumar_BH_Resume.pdf'
  },
  aboutParagraphs: [
    [
      { text: 'I am a B.Tech graduate in ' },
      { text: 'Artificial Intelligence and Machine Learning (CSE-AIML)', strong: true },
      { text: ' from ' },
      { text: 'Sai Vidya Institute of Technology', strong: true },
      { text: ', Bangalore (' },
      { text: 'CGPA: 8.80 / 10.0', strong: true },
      { text: '), with hands-on engineering experience as an ' },
      { text: 'AI Intern at Digitaltransols AI Private Limited', strong: true },
      { text: '.' }
    ],
    [
      { text: 'In my published research, I designed ' },
      { text: 'Intelli-Eye', strong: true },
      {
        text: ', a GPU-accelerated multi-threat surveillance framework that combines fine-tuned YOLOv8 CNN models with a YOLOv8-Pose skeletal heuristic engine to detect weapons, fire, accidents, and shoplifting in real-time. At Digitaltransols AI, I engineered a real-time bilingual (Kannada/English) interview evaluation engine powered by multimodal Gemini 2.0 Flash.'
      }
    ],
    [
      {
        text: 'I enjoy diving into new tech, picking up hands-on experience, and learning through real world applications from building production grade software to researching RAG systems and LLMs. Along the way, I love connecting with like minded individuals and sharing knowledge as we grow together in this ever evolving field.'
      }
    ],
    [
      {
        text: "I'm always on the lookout for exciting opportunities to upskill and make meaningful contributions."
      }
    ]
  ],
  ledger: [
    { label: 'Academic Degree', value: 'B.Tech CSE (AIML)' },
    { label: 'Institution', value: 'Sai Vidya Inst. of Tech' },
    { label: 'CGPA', value: '8.80 / 10.0' },
    { label: 'Industry Experience', value: 'Digitaltransols AI' },
    { label: 'Location Base', value: 'Bengaluru, India' }
  ]
});

export const CONTACT_CHANNELS = Object.freeze([
  {
    id: 'phone',
    type: 'copyable',
    icon: 'phone',
    name: 'Phone / WhatsApp',
    displayValue: '+91 9980507072',
    href: 'tel:+919980507072',
    copyValue: '+919980507072',
    copyToast: 'Phone number copied!',
    copyLabel: 'Copy phone number',
    tabular: true
  },
  {
    id: 'email',
    type: 'copyable',
    icon: 'mail',
    name: 'Email',
    displayValue: 'mohankumarbh007@gmail.com',
    href: 'mailto:mohankumarbh007@gmail.com',
    copyValue: 'mohankumarbh007@gmail.com',
    copyToast: 'Email address copied!',
    copyLabel: 'Copy email address',
    tabular: false
  },
  {
    id: 'linkedin',
    type: 'external',
    icon: 'linkedin',
    name: 'LinkedIn',
    displayValue: 'linkedin.com/in/mohan-kumar-bh-mk23 ↗',
    href: 'https://www.linkedin.com/in/mohan-kumar-bh-mk23'
  },
  {
    id: 'github',
    type: 'external',
    icon: 'github',
    name: 'GitHub',
    displayValue: 'github.com/MohanKumarBH23 ↗',
    href: 'https://github.com/MohanKumarBH23'
  }
]);

export const TIMELINE = Object.freeze({
  experience: [
    {
      period: 'Feb 2026 – May 2026 • Bengaluru',
      role: 'AI Intern',
      organization: 'DIGITALTRANSOLS AI PRIVATE LIMITED',
      highlights: [
        {
          title: 'Bilingual AI Interview Platform:',
          description:
            'Developed an end-to-end platform utilizing FastAPI, Next.js, and Gemini 2.0 Flash with multimodal audio transcription and AI-based automated candidate scoring.'
        },
        {
          title: 'Bulk-Recruitment Automation:',
          description:
            'Built high-concurrency Telegram pipelines to parse candidate resumes, execute automated standard matching, and schedule interview rounds.'
        }
      ]
    }
  ],
  education: [
    {
      period: '2022 – 2026 • Bengaluru',
      role: 'B.Tech in Artificial Intelligence & ML',
      organization: 'Sai Vidya Institute of Technology',
      grade: 'CGPA: 8.80 / 10.0',
    },
    {
      period: '2020 – 2022 • Gauribidanur',
      role: 'Pre-University (PCMC)',
      organization: 'BGS PU College',
      grade: 'Grade: 88% (528/600)'
    },
    {
      period: '2020 • Gauribidanur',
      role: 'Karnataka State Board (SSLC)',
      organization: 'BGS Public School',
      grade: 'Grade: 92.28% (578/625)'
    }
  ]
});

