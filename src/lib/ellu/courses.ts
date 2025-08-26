// ELLU Studios Course Catalog
// Sample data based on CLAUDE.md requirements

import { Course, LearningJourney } from '@/types/ellu';

export const COURSES: Course[] = [
  // Construction Courses
  {
    id: 'klassische-schnittkonstruktion',
    name: 'Classical Pattern Construction',
    nameGerman: 'Klassische Schnittkonstruktion',
    description: 'Master German precision in pattern construction with mathematical, systematic approach perfect for structured garments.',
    level: 'beginner',
    duration: '8 weeks',
    format: 'in-person',
    skills: ['Basic bodice construction', 'Skirt patterns', 'Sleeve drafting', 'Measurement techniques'],
    prerequisites: [],
    outcomes: ['Professional pattern drafting skills', 'Understanding of garment fitting', 'Technical precision'],
    category: 'construction',
    pricing: { amount: 800, currency: 'EUR', installments: true },
    perfectFor: ['Complete beginners', 'Those wanting structured approach', 'Career changers', 'Technical minds']
  },
  {
    id: 'advanced-construction',
    name: 'Advanced Pattern Construction',
    nameGerman: 'Fortgeschrittene Schnittkonstruktion',
    description: 'Complex pattern development for tailored garments, including jackets, coats, and structured dresses.',
    level: 'advanced',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Jacket construction', 'Lapel drafting', 'Complex fitting', 'Pattern grading'],
    prerequisites: ['Basic pattern construction'],
    outcomes: ['Master-level pattern skills', 'Tailoring expertise', 'Professional fitting'],
    category: 'construction',
    pricing: { amount: 1200, currency: 'EUR' },
    perfectFor: ['Experienced sewers', 'Fashion professionals', 'Tailoring enthusiasts']
  },

  // Draping Courses
  {
    id: 'schnittkonstruktion-drapieren',
    name: 'Pattern Construction through Draping',
    nameGerman: 'Schnittkonstruktion durch Drapieren',
    description: 'Creative, intuitive approach to pattern making using Parisian atelier techniques for flowing, artistic designs.',
    level: 'intermediate',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Draping techniques', 'Fabric manipulation', 'Creative pattern development', 'Artistic fitting'],
    prerequisites: ['Basic sewing knowledge'],
    outcomes: ['Creative pattern skills', 'Artistic design ability', 'Fabric understanding'],
    category: 'draping',
    pricing: { amount: 950, currency: 'EUR' },
    perfectFor: ['Creative designers', 'Artists', 'Those preferring intuitive approach', 'Evening wear designers']
  },
  {
    id: 'advanced-draping',
    name: 'Advanced Draping Techniques',
    nameGerman: 'Fortgeschrittene Drapier-Techniken',
    description: 'Master complex draping for haute couture, bias cutting, and experimental fashion design.',
    level: 'advanced',
    duration: '8 weeks',
    format: 'in-person',
    skills: ['Bias cutting', 'Complex draping', 'Haute couture techniques', 'Experimental design'],
    prerequisites: ['Basic draping experience'],
    outcomes: ['Haute couture skills', 'Advanced creativity', 'Professional draping mastery'],
    category: 'draping',
    pricing: { amount: 1400, currency: 'EUR' },
    perfectFor: ['Advanced designers', 'Haute couture aspirants', 'Experimental fashion lovers']
  },

  // Digital Courses
  {
    id: 'adobe-illustrator-fashion',
    name: 'Adobe Illustrator for Fashion Design',
    nameGerman: 'Adobe Illustrator für Mode-Design',
    description: 'Essential digital skills for fashion illustration, technical drawings, and design presentation.',
    level: 'beginner',
    duration: '4 weeks',
    format: 'online',
    skills: ['Fashion illustration', 'Technical flats', 'Color palettes', 'Design presentation'],
    prerequisites: ['Basic computer skills'],
    outcomes: ['Digital design portfolio', 'Professional presentations', 'Industry-standard skills'],
    category: 'digital',
    pricing: { amount: 450, currency: 'EUR' },
    perfectFor: ['Digital natives', 'Modern designers', 'Portfolio builders', 'Remote learners']
  },
  {
    id: 'clo3d-basics',
    name: 'CLO3D Digital Fashion Design',
    nameGerman: 'CLO3D Digitale Mode-Design',
    description: '3D fashion design and visualization using industry-leading CLO3D software.',
    level: 'intermediate',
    duration: '6 weeks',
    format: 'hybrid',
    skills: ['3D pattern making', 'Virtual fitting', 'Fabric simulation', 'Digital prototyping'],
    prerequisites: ['Basic pattern knowledge'],
    outcomes: ['3D design skills', 'Digital prototyping', 'Modern fashion tech'],
    category: 'digital',
    pricing: { amount: 1100, currency: 'EUR' },
    perfectFor: ['Tech-savvy designers', 'Future-focused creators', 'Remote workers', 'Sustainable designers']
  },
  {
    id: 'digital-portfolio',
    name: 'Digital Fashion Portfolio Creation',
    nameGerman: 'Digitale Mode-Portfolio Erstellung',
    description: 'Build a professional digital portfolio showcasing your fashion design work.',
    level: 'intermediate',
    duration: '3 weeks',
    format: 'online',
    skills: ['Portfolio design', 'Digital presentation', 'Brand development', 'Online presence'],
    prerequisites: ['Basic design work'],
    outcomes: ['Professional portfolio', 'Strong online presence', 'Career advancement'],
    category: 'digital',
    pricing: { amount: 350, currency: 'EUR' },
    perfectFor: ['Job seekers', 'Career changers', 'Freelancers', 'Students']
  },

  // Sustainable Courses
  {
    id: 'sustainable-design-principles',
    name: 'Sustainable Fashion Design Principles',
    nameGerman: 'Nachhaltige Mode-Design Prinzipien',
    description: 'Learn eco-conscious design principles and sustainable production methods.',
    level: 'beginner',
    duration: '5 weeks',
    format: 'hybrid',
    skills: ['Sustainable materials', 'Eco-design principles', 'Waste reduction', 'Circular fashion'],
    prerequisites: [],
    outcomes: ['Sustainable mindset', 'Eco-design skills', 'Environmental awareness'],
    category: 'sustainable',
    pricing: { amount: 600, currency: 'EUR' },
    perfectFor: ['Environmentally conscious', 'Future-focused designers', 'Ethical fashion lovers']
  },
  {
    id: 'zero-waste-patterns',
    name: 'Zero Waste Pattern Making',
    nameGerman: 'Null-Abfall Schnittmuster',
    description: 'Revolutionary pattern making techniques that eliminate fabric waste entirely.',
    level: 'advanced',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Zero waste techniques', 'Innovative pattern layouts', 'Sustainable cutting', 'Waste analysis'],
    prerequisites: ['Pattern making experience'],
    outcomes: ['Zero waste expertise', 'Innovation skills', 'Sustainable mastery'],
    category: 'sustainable',
    pricing: { amount: 850, currency: 'EUR' },
    perfectFor: ['Sustainability advocates', 'Innovation seekers', 'Professional designers']
  },

  // Professional Sewing
  {
    id: 'professional-sewing-techniques',
    name: 'Professional Sewing Techniques',
    nameGerman: 'Professionelle Nähtechniken',
    description: 'Master professional construction methods and finishing techniques for high-quality garments.',
    level: 'intermediate',
    duration: '8 weeks',
    format: 'in-person',
    skills: ['Professional seaming', 'Finishing techniques', 'Industrial methods', 'Quality control'],
    prerequisites: ['Basic sewing skills'],
    outcomes: ['Professional quality work', 'Industry-standard techniques', 'Advanced construction'],
    category: 'construction',
    pricing: { amount: 900, currency: 'EUR' },
    perfectFor: ['Serious hobbyists', 'Career changers', 'Quality focused sewers']
  },

  // Business & Career
  {
    id: 'fashion-business-basics',
    name: 'Fashion Business Fundamentals',
    nameGerman: 'Mode-Business Grundlagen',
    description: 'Essential business skills for starting your own fashion brand or freelance career.',
    level: 'beginner',
    duration: '4 weeks',
    format: 'online',
    skills: ['Business planning', 'Pricing strategies', 'Marketing basics', 'Client management'],
    prerequisites: [],
    outcomes: ['Business knowledge', 'Entrepreneurial skills', 'Career preparation'],
    category: 'construction',
    pricing: { amount: 400, currency: 'EUR' },
    perfectFor: ['Entrepreneurs', 'Freelancers', 'Business-minded creatives']
  }
];

// Learning Journey Templates
export const LEARNING_JOURNEYS: LearningJourney[] = [
  {
    id: 'beginner-journey',
    name: 'Foundation to Professional Journey',
    description: 'Complete beginner path from zero to professional pattern making skills',
    targetAudience: 'Complete beginners wanting career or serious hobby skills',
    duration: '4-6 months',
    outcome: 'Ready to work as pattern maker or start own design business',
    phases: [
      {
        phase: 1,
        name: 'Foundation',
        duration: '2 months',
        courses: ['klassische-schnittkonstruktion'],
        description: 'Master precise German pattern construction methods'
      },
      {
        phase: 2,
        name: 'Practical Application',
        duration: '2 months',
        courses: ['professional-sewing-techniques'],
        description: 'Bring patterns to life with expert construction'
      },
      {
        phase: 3,
        name: 'Specialization Choice',
        duration: '1-2 months',
        courses: ['sustainable-design-principles', 'adobe-illustrator-fashion'],
        description: 'Choose focus: sustainable design, digital tools, or advanced draping'
      }
    ],
    courses: ['klassische-schnittkonstruktion', 'professional-sewing-techniques', 'sustainable-design-principles', 'adobe-illustrator-fashion']
  },
  {
    id: 'advanced-journey',
    name: 'Mastery Path',
    description: 'Advanced journey for experienced sewers seeking mastery',
    targetAudience: 'Experienced sewers and pattern makers',
    duration: '2-4 months',
    outcome: 'Master-level skills in chosen specialization',
    phases: [
      {
        phase: 1,
        name: 'Advanced Techniques',
        duration: '1-2 months',
        courses: ['schnittkonstruktion-drapieren', 'advanced-construction'],
        description: 'Master advanced pattern making approaches'
      },
      {
        phase: 2,
        name: 'Digital Integration',
        duration: '1 month',
        courses: ['clo3d-basics', 'digital-portfolio'],
        description: 'Integrate modern digital tools and presentation'
      }
    ],
    courses: ['schnittkonstruktion-drapieren', 'advanced-construction', 'clo3d-basics', 'digital-portfolio']
  },
  {
    id: 'sustainable-journey',
    name: 'Eco Fashion Designer Path',
    description: 'Comprehensive sustainable fashion design education',
    targetAudience: 'Environmentally conscious designers',
    duration: '3-6 months',
    outcome: 'Expert in sustainable fashion design and production',
    phases: [
      {
        phase: 1,
        name: 'Sustainable Principles',
        duration: '1-2 months',
        courses: ['sustainable-design-principles', 'klassische-schnittkonstruktion'],
        description: 'Learn eco-conscious design and efficient pattern making'
      },
      {
        phase: 2,
        name: 'Advanced Sustainability',
        duration: '2 months',
        courses: ['zero-waste-patterns', 'professional-sewing-techniques'],
        description: 'Master zero waste techniques and quality construction'
      },
      {
        phase: 3,
        name: 'Business Application',
        duration: '1-2 months',
        courses: ['fashion-business-basics', 'digital-portfolio'],
        description: 'Build sustainable fashion business and portfolio'
      }
    ],
    courses: ['sustainable-design-principles', 'klassische-schnittkonstruktion', 'zero-waste-patterns', 'professional-sewing-techniques', 'fashion-business-basics', 'digital-portfolio']
  },
  {
    id: 'digital-journey',
    name: 'Digital Fashion Designer Path',
    description: 'Modern digital-first fashion design education',
    targetAudience: 'Tech-savvy, digital-first learners',
    duration: '2-4 months',
    outcome: 'Expert in digital fashion design and presentation',
    phases: [
      {
        phase: 1,
        name: 'Digital Foundations',
        duration: '1 month',
        courses: ['adobe-illustrator-fashion'],
        description: 'Master digital design and presentation tools'
      },
      {
        phase: 2,
        name: '3D Design Mastery',
        duration: '1-2 months',
        courses: ['clo3d-basics', 'klassische-schnittkonstruktion'],
        description: 'Advanced 3D design with pattern making foundation'
      },
      {
        phase: 3,
        name: 'Professional Portfolio',
        duration: '1 month',
        courses: ['digital-portfolio', 'fashion-business-basics'],
        description: 'Build professional presence and business skills'
      }
    ],
    courses: ['adobe-illustrator-fashion', 'clo3d-basics', 'klassische-schnittkonstruktion', 'digital-portfolio', 'fashion-business-basics']
  }
];

// Helper functions
export function getCourseById(id: string): Course | undefined {
  return COURSES.find(course => course.id === id);
}

export function getCoursesByLevel(level: Course['level']): Course[] {
  return COURSES.filter(course => course.level === level);
}

export function getCoursesByCategory(category: Course['category']): Course[] {
  return COURSES.filter(course => course.category === category);
}

export function getJourneyById(id: string): LearningJourney | undefined {
  return LEARNING_JOURNEYS.find(journey => journey.id === id);
}