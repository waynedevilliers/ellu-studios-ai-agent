// ELLU Studios Course Catalog
// Sample data based on CLAUDE.md requirements

import { Course, LearningJourney, CoursePackage } from '@/types/ellu';

export const COURSES: Course[] = [
  // PATTERN MAKING - Classical Construction
  {
    id: 'patternmaking-classic-skirt',
    name: 'Classical Pattern Making - Skirt',
    nameGerman: 'Klassische Schnittkonstruktion - Rock',
    description: 'Master precise mathematical pattern construction for all skirt styles using German precision methods.',
    level: 'beginner',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Basic skirt construction', 'Dart placement', 'Waist fitting', 'A-line variations'],
    prerequisites: [],
    outcomes: ['Professional skirt patterns', 'Fitting expertise', 'Technical precision'],
    category: 'patternmaking',
    pricing: { amount: 320, currency: 'EUR' },
    perfectFor: ['Complete beginners', 'Systematic learners', 'Career changers']
  },
  {
    id: 'patternmaking-classic-top',
    name: 'Classical Pattern Making - Top/Shirt',
    nameGerman: 'Klassische Schnittkonstruktion - Oberteil/Hemd',
    description: 'Systematic approach to bodice and shirt construction with precise fitting techniques.',
    level: 'beginner',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Bodice construction', 'Sleeve attachment', 'Neckline variations', 'Button plackets'],
    prerequisites: ['Basic pattern knowledge'],
    outcomes: ['Perfect-fitting tops', 'Sleeve mastery', 'Professional finishing'],
    category: 'patternmaking',
    pricing: { amount: 420, currency: 'EUR' },
    perfectFor: ['Structured learners', 'Precision seekers', 'Technical minds']
  },
  {
    id: 'patternmaking-classic-pants',
    name: 'Classical Pattern Making - Pants',
    nameGerman: 'Klassische Schnittkonstruktion - Hose',
    description: 'Master trouser construction with perfect fit using mathematical pattern drafting.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Trouser construction', 'Crotch curve perfection', 'Waistband fitting', 'Leg adjustments'],
    prerequisites: ['Basic pattern experience'],
    outcomes: ['Perfect trouser fit', 'Professional patterns', 'Fitting mastery'],
    category: 'patternmaking',
    pricing: { amount: 450, currency: 'EUR' },
    perfectFor: ['Fit perfectionists', 'Tailoring enthusiasts', 'Professional sewers']
  },
  {
    id: 'patternmaking-classic-jacket',
    name: 'Classical Pattern Making - Jacket',
    nameGerman: 'Klassische Schnittkonstruktion - Jacke',
    description: 'Advanced tailoring techniques for structured jackets and blazers.',
    level: 'advanced',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Jacket construction', 'Lapel drafting', 'Shoulder fitting', 'Lining integration'],
    prerequisites: ['Intermediate pattern skills'],
    outcomes: ['Tailoring expertise', 'Professional jackets', 'Advanced fitting'],
    category: 'patternmaking',
    pricing: { amount: 680, currency: 'EUR' },
    perfectFor: ['Advanced sewers', 'Tailoring lovers', 'Professional developers']
  },

  // PATTERN MAKING - Draping
  {
    id: 'patternmaking-draping-skirt',
    name: 'Pattern Making through Draping - Skirt',
    nameGerman: 'Schnittkonstruktion durch Drapieren - Rock',
    description: 'Intuitive skirt creation through fabric manipulation and draping techniques.',
    level: 'beginner',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Fabric draping', 'Intuitive fitting', 'Creative shaping', 'Pattern transfer'],
    prerequisites: ['Basic sewing knowledge'],
    outcomes: ['Creative pattern skills', 'Fabric understanding', 'Artistic approach'],
    category: 'draping',
    pricing: { amount: 350, currency: 'EUR' },
    perfectFor: ['Creative minds', 'Visual learners', 'Artistic designers']
  },
  {
    id: 'patternmaking-draping-top',
    name: 'Pattern Making through Draping - Top/Shirt',
    nameGerman: 'Schnittkonstruktion durch Drapieren - Oberteil/Hemd',
    description: 'Artistic approach to bodice construction through fabric manipulation.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Bodice draping', 'Creative necklines', 'Asymmetrical designs', 'Organic fitting'],
    prerequisites: ['Basic draping knowledge'],
    outcomes: ['Artistic bodice skills', 'Creative designs', 'Organic fitting'],
    category: 'draping',
    pricing: { amount: 420, currency: 'EUR' },
    perfectFor: ['Creative designers', 'Artists', 'Experimental creators']
  },
  {
    id: 'patternmaking-draping-dress',
    name: 'Pattern Making through Draping - Dress',
    nameGerman: 'Schnittkonstruktion durch Drapieren - Kleid',
    description: 'Create flowing, elegant dresses through advanced draping techniques.',
    level: 'intermediate',
    duration: '5 weeks',
    format: 'in-person',
    skills: ['Full dress draping', 'Complex silhouettes', 'Bias techniques', 'Evening wear'],
    prerequisites: ['Draping basics'],
    outcomes: ['Elegant dress creation', 'Advanced draping', 'Evening wear skills'],
    category: 'draping',
    pricing: { amount: 520, currency: 'EUR' },
    perfectFor: ['Evening wear designers', 'Couture aspirants', 'Advanced creators']
  },
  {
    id: 'patternmaking-draping-jacket',
    name: 'Pattern Making through Draping - Jacket',
    nameGerman: 'Schnittkonstruktion durch Drapieren - Jacke',
    description: 'Soft construction jackets and unstructured outerwear through draping.',
    level: 'advanced',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Soft jacket construction', 'Unstructured design', 'Creative outerwear', 'Organic fitting'],
    prerequisites: ['Advanced draping'],
    outcomes: ['Soft construction mastery', 'Creative outerwear', 'Advanced techniques'],
    category: 'draping',
    pricing: { amount: 650, currency: 'EUR' },
    perfectFor: ['Advanced drapers', 'Soft construction lovers', 'Creative professionals']
  },

  // PATTERN MAKING - Sustainable
  {
    id: 'zero-waste-patternmaking',
    name: 'Zero Waste Pattern Making',
    nameGerman: 'Null-Abfall Schnittkonstruktion',
    description: 'Revolutionary pattern making that eliminates fabric waste entirely.',
    level: 'advanced',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Zero waste layouts', 'Innovative cutting', 'Waste elimination', 'Sustainable design'],
    prerequisites: ['Pattern making experience'],
    outcomes: ['Zero waste expertise', 'Sustainable mastery', 'Innovation skills'],
    category: 'sustainable',
    pricing: { amount: 580, currency: 'EUR' },
    perfectFor: ['Sustainability advocates', 'Innovation seekers', 'Eco-conscious designers']
  },

  // SEWING SKILLS
  {
    id: 'basic-sewing-skirt',
    name: 'Basic Sewing Skills - Skirt',
    nameGerman: 'Grundlegende Näh-Fertigkeiten - Rock',
    description: 'Essential sewing techniques for perfect skirt construction.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'in-person',
    skills: ['Basic seaming', 'Zipper insertion', 'Waistband application', 'Hemming techniques'],
    prerequisites: [],
    outcomes: ['Clean skirt construction', 'Basic sewing mastery', 'Quality finishing'],
    category: 'sewing',
    pricing: { amount: 240, currency: 'EUR' },
    perfectFor: ['Complete beginners', 'Hobbyists', 'Foundation builders']
  },
  {
    id: 'seam-types-course',
    name: 'Different Seam Types Mastery',
    nameGerman: 'Verschiedene Nahtarten Meistern',
    description: 'Comprehensive guide to all professional seaming techniques.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'in-person',
    skills: ['French seams', 'Flat fell seams', 'Bound seams', 'Decorative seaming'],
    prerequisites: ['Basic sewing'],
    outcomes: ['Professional seaming', 'Quality construction', 'Technique mastery'],
    category: 'sewing',
    pricing: { amount: 280, currency: 'EUR' },
    perfectFor: ['Quality seekers', 'Technique enthusiasts', 'Professional aspirants']
  },
  {
    id: 'pockets-mastery',
    name: 'Pocket Construction Mastery',
    nameGerman: 'Taschen-Konstruktion Meistern',
    description: 'Master all types of pockets from patch to welt pockets.',
    level: 'intermediate',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Patch pockets', 'In-seam pockets', 'Welt pockets', 'Flap pockets'],
    prerequisites: ['Basic sewing skills'],
    outcomes: ['Perfect pockets', 'Professional details', 'Advanced construction'],
    category: 'sewing',
    pricing: { amount: 340, currency: 'EUR' },
    perfectFor: ['Detail perfectionists', 'Professional sewers', 'Quality enthusiasts']
  },
  {
    id: 'sewing-skills-shirt',
    name: 'Sewing Skills - Shirt',
    nameGerman: 'Näh-Fertigkeiten - Hemd',
    description: 'Advanced shirt construction with professional finishing.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Collar construction', 'Button plackets', 'Cuff attachment', 'Professional pressing'],
    prerequisites: ['Basic sewing experience'],
    outcomes: ['Perfect shirt construction', 'Professional finishing', 'Detail mastery'],
    category: 'sewing',
    pricing: { amount: 420, currency: 'EUR' },
    perfectFor: ['Precision sewers', 'Professional developers', 'Quality focused']
  },
  {
    id: 'sewing-skills-pants',
    name: 'Sewing Skills - Pants',
    nameGerman: 'Näh-Fertigkeiten - Hose',
    description: 'Master trouser construction and professional finishing techniques.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Trouser construction', 'Fly zipper insertion', 'Professional waistbands', 'Hemming perfection'],
    prerequisites: ['Intermediate sewing'],
    outcomes: ['Perfect trouser construction', 'Professional techniques', 'Quality finishing'],
    category: 'sewing',
    pricing: { amount: 450, currency: 'EUR' },
    perfectFor: ['Tailoring enthusiasts', 'Quality seekers', 'Professional sewers']
  },
  {
    id: 'collar-construction',
    name: 'Sewing of Collars',
    nameGerman: 'Kragen-Konstruktion',
    description: 'Master all collar types from basic to complex tailored collars.',
    level: 'intermediate',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Basic collars', 'Shirt collars', 'Stand collars', 'Tailored collars'],
    prerequisites: ['Intermediate sewing'],
    outcomes: ['Perfect collars', 'Professional finishing', 'Advanced techniques'],
    category: 'sewing',
    pricing: { amount: 380, currency: 'EUR' },
    perfectFor: ['Detail lovers', 'Tailoring enthusiasts', 'Quality focused']
  },
  {
    id: 'jacket-sewing',
    name: 'Sewing a Jacket',
    nameGerman: 'Jacken-Nähen',
    description: 'Complete jacket construction from interfacing to final pressing.',
    level: 'advanced',
    duration: '6 weeks',
    format: 'in-person',
    skills: ['Interfacing techniques', 'Shoulder construction', 'Lining installation', 'Professional pressing'],
    prerequisites: ['Advanced sewing skills'],
    outcomes: ['Professional jacket construction', 'Tailoring mastery', 'Industry-level skills'],
    category: 'sewing',
    pricing: { amount: 680, currency: 'EUR' },
    perfectFor: ['Advanced sewers', 'Tailoring aspirants', 'Professional developers']
  },

  // DESIGN COURSES
  {
    id: 'clo3d-course',
    name: 'CLO3D Digital Fashion Design',
    nameGerman: 'CLO3D Digitale Mode-Design',
    description: '3D fashion design and virtual prototyping with industry-leading software.',
    level: 'intermediate',
    duration: '6 weeks',
    format: 'hybrid',
    skills: ['3D pattern making', 'Virtual fitting', 'Fabric simulation', 'Digital prototyping'],
    prerequisites: ['Basic pattern knowledge'],
    outcomes: ['3D design mastery', 'Virtual prototyping', 'Modern fashion tech'],
    category: 'digital',
    pricing: { amount: 850, currency: 'EUR' },
    perfectFor: ['Tech-savvy designers', 'Future-focused creators', 'Digital natives']
  },
  {
    id: 'adobe-illustrator-basics',
    name: 'Adobe Illustrator Basics',
    nameGerman: 'Adobe Illustrator Grundlagen',
    description: 'Foundation skills in vector-based fashion design and technical drawings.',
    level: 'beginner',
    duration: '3 weeks',
    format: 'online',
    skills: ['Vector basics', 'Fashion flats', 'Basic illustration', 'Color application'],
    prerequisites: ['Basic computer skills'],
    outcomes: ['Digital design foundation', 'Technical drawing skills', 'Basic portfolio pieces'],
    category: 'digital',
    pricing: { amount: 320, currency: 'EUR' },
    perfectFor: ['Digital beginners', 'Modern designers', 'Career changers']
  },
  {
    id: 'adobe-illustrator-intermediate',
    name: 'Adobe Illustrator Intermediate',
    nameGerman: 'Adobe Illustrator Mittelstufe',
    description: 'Advanced illustration techniques and professional design workflows.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'online',
    skills: ['Advanced illustration', 'Pattern creation', 'Professional workflows', 'Print preparation'],
    prerequisites: ['Illustrator basics'],
    outcomes: ['Advanced design skills', 'Professional workflows', 'Portfolio development'],
    category: 'digital',
    pricing: { amount: 420, currency: 'EUR' },
    perfectFor: ['Developing designers', 'Portfolio builders', 'Professional aspirants']
  },
  {
    id: 'adobe-illustrator-advanced',
    name: 'Adobe Illustrator Advanced',
    nameGerman: 'Adobe Illustrator Fortgeschritten',
    description: 'Master-level techniques for complex fashion illustration and design.',
    level: 'advanced',
    duration: '4 weeks',
    format: 'online',
    skills: ['Complex illustrations', 'Advanced effects', 'Brand development', 'Master techniques'],
    prerequisites: ['Intermediate Illustrator'],
    outcomes: ['Master-level skills', 'Professional illustrations', 'Industry expertise'],
    category: 'digital',
    pricing: { amount: 520, currency: 'EUR' },
    perfectFor: ['Advanced designers', 'Industry professionals', 'Master-level creators']
  },
  {
    id: 'coloring-course',
    name: 'Fashion Illustration Coloring',
    nameGerman: 'Mode-Illustration Kolorierung',
    description: 'Master color application and rendering techniques for fashion illustration.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'hybrid',
    skills: ['Color theory', 'Rendering techniques', 'Fabric representation', 'Digital coloring'],
    prerequisites: ['Basic drawing skills'],
    outcomes: ['Professional coloring', 'Realistic rendering', 'Color mastery'],
    category: 'design',
    pricing: { amount: 280, currency: 'EUR' },
    perfectFor: ['Illustration enthusiasts', 'Color lovers', 'Visual designers']
  },
  {
    id: 'illustration-1',
    name: 'Fashion Illustration 1',
    nameGerman: 'Mode-Illustration 1',
    description: 'Foundation course in fashion figure drawing and basic illustration.',
    level: 'beginner',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Fashion figure', 'Proportions', 'Basic poses', 'Simple garment rendering'],
    prerequisites: [],
    outcomes: ['Fashion drawing foundation', 'Figure mastery', 'Basic illustrations'],
    category: 'design',
    pricing: { amount: 380, currency: 'EUR' },
    perfectFor: ['Drawing beginners', 'Creative minds', 'Visual learners']
  },
  {
    id: 'illustration-2',
    name: 'Fashion Illustration 2',
    nameGerman: 'Mode-Illustration 2',
    description: 'Advanced fashion illustration with complex poses and detailed rendering.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'in-person',
    skills: ['Complex poses', 'Detailed rendering', 'Advanced techniques', 'Style development'],
    prerequisites: ['Illustration 1'],
    outcomes: ['Advanced illustration skills', 'Personal style', 'Professional drawings'],
    category: 'design',
    pricing: { amount: 450, currency: 'EUR' },
    perfectFor: ['Developing illustrators', 'Style seekers', 'Advanced creators']
  },
  {
    id: 'anatomy-basics',
    name: 'Anatomy Basics for Fashion',
    nameGerman: 'Anatomie-Grundlagen für Mode',
    description: 'Essential anatomy knowledge for accurate fashion figure drawing.',
    level: 'beginner',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Human anatomy', 'Proportions', 'Body structure', 'Movement basics'],
    prerequisites: [],
    outcomes: ['Anatomical accuracy', 'Proportion mastery', 'Realistic figures'],
    category: 'design',
    pricing: { amount: 320, currency: 'EUR' },
    perfectFor: ['Accuracy seekers', 'Foundation builders', 'Realistic artists']
  },
  {
    id: 'anatomy-advanced',
    name: 'Advanced Anatomy for Fashion',
    nameGerman: 'Fortgeschrittene Anatomie für Mode',
    description: 'Advanced anatomy and movement for dynamic fashion illustration.',
    level: 'intermediate',
    duration: '3 weeks',
    format: 'in-person',
    skills: ['Advanced anatomy', 'Dynamic poses', 'Movement studies', 'Muscle structure'],
    prerequisites: ['Anatomy basics'],
    outcomes: ['Dynamic figure drawing', 'Movement mastery', 'Advanced accuracy'],
    category: 'design',
    pricing: { amount: 420, currency: 'EUR' },
    perfectFor: ['Advanced illustrators', 'Movement enthusiasts', 'Professional artists']
  },
  {
    id: 'sketching-course',
    name: 'Fashion Sketching Techniques',
    nameGerman: 'Mode-Skizzen Techniken',
    description: 'Quick sketching and ideation techniques for fashion designers.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'in-person',
    skills: ['Quick sketching', 'Ideation methods', 'Design development', 'Concept visualization'],
    prerequisites: [],
    outcomes: ['Rapid visualization', 'Idea development', 'Design sketching'],
    category: 'design',
    pricing: { amount: 260, currency: 'EUR' },
    perfectFor: ['Idea generators', 'Quick thinkers', 'Design developers']
  },
  {
    id: 'moodboard-inspiration',
    name: 'Moodboard and Inspiration',
    nameGerman: 'Moodboard und Inspiration',
    description: 'Learn to create compelling moodboards and develop design inspiration.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'hybrid',
    skills: ['Inspiration gathering', 'Visual storytelling', 'Concept development', 'Presentation skills'],
    prerequisites: [],
    outcomes: ['Strong concept development', 'Visual communication', 'Inspiration mastery'],
    category: 'design',
    pricing: { amount: 280, currency: 'EUR' },
    perfectFor: ['Concept developers', 'Visual thinkers', 'Inspiration seekers']
  },
  {
    id: 'collection-development',
    name: 'Collection Development',
    nameGerman: 'Kollektions-Entwicklung',
    description: 'Complete process of developing cohesive fashion collections.',
    level: 'intermediate',
    duration: '6 weeks',
    format: 'hybrid',
    skills: ['Collection planning', 'Design cohesion', 'Market research', 'Line development'],
    prerequisites: ['Basic design knowledge'],
    outcomes: ['Complete collection', 'Professional presentation', 'Market awareness'],
    category: 'design',
    pricing: { amount: 650, currency: 'EUR' },
    perfectFor: ['Collection designers', 'Brand developers', 'Professional aspirants']
  },
  {
    id: 'sustainable-fashion-concepts',
    name: 'Sustainable Fashion Concepts',
    nameGerman: 'Nachhaltige Mode-Konzepte',
    description: 'Comprehensive sustainable design principles and eco-conscious creation.',
    level: 'beginner',
    duration: '4 weeks',
    format: 'hybrid',
    skills: ['Sustainable principles', 'Eco-materials', 'Circular design', 'Environmental impact'],
    prerequisites: [],
    outcomes: ['Sustainable mindset', 'Eco-design skills', 'Environmental awareness'],
    category: 'sustainable',
    pricing: { amount: 450, currency: 'EUR' },
    perfectFor: ['Eco-conscious designers', 'Future-focused creators', 'Sustainability advocates']
  },
  {
    id: 'presentation-photoshop-indesign',
    name: 'Presentation with Photoshop & InDesign',
    nameGerman: 'Präsentation mit Photoshop & InDesign',
    description: 'Professional presentation creation for fashion portfolios and collections.',
    level: 'intermediate',
    duration: '4 weeks',
    format: 'online',
    skills: ['Layout design', 'Image editing', 'Professional presentations', 'Portfolio creation'],
    prerequisites: ['Basic computer skills'],
    outcomes: ['Professional presentations', 'Portfolio mastery', 'Visual communication'],
    category: 'digital',
    pricing: { amount: 520, currency: 'EUR' },
    perfectFor: ['Portfolio builders', 'Professional presenters', 'Career developers']
  },

  // TEXTILES COURSES
  {
    id: 'textile-types-overview',
    name: 'Textile Types and Overview',
    nameGerman: 'Textilarten und Überblick',
    description: 'Comprehensive introduction to all textile types and their properties.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'in-person',
    skills: ['Fabric identification', 'Textile properties', 'Care instructions', 'Application knowledge'],
    prerequisites: [],
    outcomes: ['Textile expertise', 'Fabric selection skills', 'Material knowledge'],
    category: 'textiles',
    pricing: { amount: 240, currency: 'EUR' },
    perfectFor: ['Material enthusiasts', 'Quality seekers', 'Foundation builders']
  },
  {
    id: 'textile-creation',
    name: 'Textile Creation',
    nameGerman: 'Textil-Herstellung',
    description: 'Understanding textile manufacturing and creation processes.',
    level: 'intermediate',
    duration: '3 weeks',
    format: 'hybrid',
    skills: ['Manufacturing processes', 'Weaving basics', 'Knitting principles', 'Finishing techniques'],
    prerequisites: ['Textile basics'],
    outcomes: ['Manufacturing knowledge', 'Process understanding', 'Quality assessment'],
    category: 'textiles',
    pricing: { amount: 380, currency: 'EUR' },
    perfectFor: ['Process enthusiasts', 'Quality focused', 'Manufacturing interested']
  },
  {
    id: 'sustainable-textiles',
    name: 'Sustainable Textiles',
    nameGerman: 'Nachhaltige Textilien',
    description: 'Eco-friendly textile options and sustainable material choices.',
    level: 'beginner',
    duration: '2 weeks',
    format: 'hybrid',
    skills: ['Sustainable materials', 'Eco-friendly processes', 'Impact assessment', 'Alternative fibers'],
    prerequisites: [],
    outcomes: ['Sustainable material knowledge', 'Eco-conscious choices', 'Environmental awareness'],
    category: 'sustainable',
    pricing: { amount: 320, currency: 'EUR' },
    perfectFor: ['Eco-conscious designers', 'Sustainability advocates', 'Future-focused creators']
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
        name: 'Pattern Foundation',
        duration: '6 weeks',
        courses: ['patternmaking-classic-skirt', 'basic-sewing-skirt'],
        description: 'Master precise pattern construction and basic sewing with skirts'
      },
      {
        phase: 2,
        name: 'Expand Skills',
        duration: '8 weeks',
        courses: ['patternmaking-classic-top', 'sewing-skills-shirt'],
        description: 'Add tops and shirts to your skillset with both pattern and sewing'
      },
      {
        phase: 3,
        name: 'Creative Development',
        duration: '6 weeks',
        courses: ['moodboard-inspiration', 'illustration-1', 'adobe-illustrator-basics'],
        description: 'Develop creative vision and digital presentation skills'
      }
    ],
    courses: ['patternmaking-classic-skirt', 'basic-sewing-skirt', 'patternmaking-classic-top', 'sewing-skills-shirt', 'moodboard-inspiration', 'illustration-1', 'adobe-illustrator-basics']
  },
  {
    id: 'advanced-journey',
    name: 'Professional Mastery Path',
    description: 'Advanced journey for experienced makers seeking professional mastery',
    targetAudience: 'Experienced sewers and pattern makers',
    duration: '3-5 months',
    outcome: 'Master-level skills ready for professional work',
    phases: [
      {
        phase: 1,
        name: 'Advanced Construction',
        duration: '8 weeks',
        courses: ['patternmaking-classic-jacket', 'jacket-sewing'],
        description: 'Master complex jacket construction and tailoring'
      },
      {
        phase: 2,
        name: 'Creative Mastery',
        duration: '6 weeks',
        courses: ['patternmaking-draping-dress', 'collection-development'],
        description: 'Advanced draping and professional collection development'
      },
      {
        phase: 3,
        name: 'Digital Integration',
        duration: '6 weeks',
        courses: ['clo3d-course', 'presentation-photoshop-indesign'],
        description: 'Integrate cutting-edge digital tools and professional presentation'
      }
    ],
    courses: ['patternmaking-classic-jacket', 'jacket-sewing', 'patternmaking-draping-dress', 'collection-development', 'clo3d-course', 'presentation-photoshop-indesign']
  },
  {
    id: 'sustainable-journey',
    name: 'Eco Fashion Designer Path',
    description: 'Comprehensive sustainable fashion design education',
    targetAudience: 'Environmentally conscious designers',
    duration: '4-6 months',
    outcome: 'Expert in sustainable fashion design and production',
    phases: [
      {
        phase: 1,
        name: 'Sustainable Foundation',
        duration: '6 weeks',
        courses: ['sustainable-fashion-concepts', 'sustainable-textiles'],
        description: 'Learn eco-conscious design principles and sustainable materials'
      },
      {
        phase: 2,
        name: 'Zero-Waste Mastery',
        duration: '8 weeks',
        courses: ['zero-waste-patternmaking', 'patternmaking-classic-skirt', 'patternmaking-classic-top'],
        description: 'Master zero waste techniques with practical application'
      },
      {
        phase: 3,
        name: 'Sustainable Production',
        duration: '6 weeks',
        courses: ['basic-sewing-skirt', 'seam-types-course'],
        description: 'Apply sustainable construction methods and quality techniques'
      }
    ],
    courses: ['sustainable-fashion-concepts', 'sustainable-textiles', 'zero-waste-patternmaking', 'patternmaking-classic-skirt', 'patternmaking-classic-top', 'basic-sewing-skirt', 'seam-types-course']
  },
  {
    id: 'digital-journey',
    name: 'Digital Fashion Designer Path',
    description: 'Modern digital-first fashion design education',
    targetAudience: 'Tech-savvy, digital-first learners',
    duration: '3-5 months',
    outcome: 'Expert in digital fashion design and presentation',
    phases: [
      {
        phase: 1,
        name: 'Digital Foundations',
        duration: '4 weeks',
        courses: ['adobe-illustrator-basics', 'sketching-course'],
        description: 'Master digital design tools and quick visualization'
      },
      {
        phase: 2,
        name: 'Advanced Digital Skills',
        duration: '8 weeks',
        courses: ['adobe-illustrator-intermediate', 'clo3d-course', 'illustration-1'],
        description: 'Advanced illustration, 3D design, and digital presentation'
      },
      {
        phase: 3,
        name: 'Professional Portfolio',
        duration: '6 weeks',
        courses: ['presentation-photoshop-indesign', 'collection-development'],
        description: 'Build industry-ready portfolio and collection concepts'
      }
    ],
    courses: ['adobe-illustrator-basics', 'sketching-course', 'adobe-illustrator-intermediate', 'clo3d-course', 'illustration-1', 'presentation-photoshop-indesign', 'collection-development']
  }
];

// Course Packages - Bundled courses with discounts
export const COURSE_PACKAGES: CoursePackage[] = [
  {
    id: 'beginner-complete-package',
    name: 'Complete Beginner Package',
    nameGerman: 'Komplettes Anfänger-Paket',
    description: 'Everything a complete beginner needs: pattern making (classic + draping), sewing, and design fundamentals.',
    level: 'beginner',
    duration: '10 weeks',
    courses: [
      'patternmaking-classic-skirt',
      'patternmaking-draping-skirt',
      'basic-sewing-skirt',
      'adobe-illustrator-basics',
      'moodboard-inspiration',
      'illustration-1'
    ],
    pricing: {
      amount: 1450, // vs 1840 individual (21% discount)
      currency: 'EUR',
      discount: 21
    },
    targetAudience: ['Complete beginners', 'Career changers', 'Hobby enthusiasts'],
    outcomes: ['Complete skirt creation skills', 'Digital design foundation', 'Creative development', 'Professional presentation']
  },
  {
    id: 'pattern-mastery-package',
    name: 'Pattern Making Mastery',
    nameGerman: 'Schnittkonstruktion Meisterschaft',
    description: 'Master both classical and draping approaches across all garment types.',
    level: 'intermediate',
    duration: '18 weeks',
    courses: [
      'patternmaking-classic-skirt',
      'patternmaking-classic-top',
      'patternmaking-classic-pants',
      'patternmaking-draping-skirt',
      'patternmaking-draping-top',
      'patternmaking-draping-dress'
    ],
    pricing: {
      amount: 2200, // vs 2710 individual (19% discount)
      currency: 'EUR',
      discount: 19
    },
    targetAudience: ['Serious pattern makers', 'Professional developers', 'Technique perfectionists'],
    outcomes: ['Complete pattern making mastery', 'Both construction approaches', 'All garment types', 'Professional expertise']
  },
  {
    id: 'digital-designer-package',
    name: 'Digital Fashion Designer',
    nameGerman: 'Digitale Mode-Designerin',
    description: 'Complete digital skillset from basic illustration to advanced 3D design.',
    level: 'intermediate',
    duration: '12 weeks',
    courses: [
      'adobe-illustrator-basics',
      'adobe-illustrator-intermediate',
      'clo3d-course',
      'illustration-1',
      'illustration-2',
      'presentation-photoshop-indesign'
    ],
    pricing: {
      amount: 2150, // vs 2690 individual (20% discount)
      currency: 'EUR',
      discount: 20
    },
    targetAudience: ['Tech-savvy designers', 'Modern fashion professionals', 'Digital natives'],
    outcomes: ['Complete digital mastery', '3D design skills', 'Professional presentations', 'Industry-ready portfolio']
  },
  {
    id: 'sustainable-creator-package',
    name: 'Sustainable Fashion Creator',
    nameGerman: 'Nachhaltige Mode-Schöpferin',
    description: 'Comprehensive sustainable fashion education with zero-waste techniques.',
    level: 'intermediate',
    duration: '14 weeks',
    courses: [
      'sustainable-fashion-concepts',
      'zero-waste-patternmaking',
      'sustainable-textiles',
      'patternmaking-classic-skirt',
      'patternmaking-classic-top',
      'basic-sewing-skirt'
    ],
    pricing: {
      amount: 1980, // vs 2410 individual (18% discount)
      currency: 'EUR',
      discount: 18
    },
    targetAudience: ['Eco-conscious designers', 'Sustainability advocates', 'Future-focused creators'],
    outcomes: ['Sustainable design mastery', 'Zero-waste expertise', 'Eco-material knowledge', 'Environmental leadership']
  },
  {
    id: 'professional-sewer-package',
    name: 'Professional Sewing Mastery',
    nameGerman: 'Professionelle Näh-Meisterschaft',
    description: 'Master all professional sewing techniques from basic to advanced construction.',
    level: 'intermediate',
    duration: '16 weeks',
    courses: [
      'basic-sewing-skirt',
      'seam-types-course',
      'pockets-mastery',
      'sewing-skills-shirt',
      'sewing-skills-pants',
      'collar-construction',
      'jacket-sewing'
    ],
    pricing: {
      amount: 2450, // vs 3010 individual (19% discount)
      currency: 'EUR',
      discount: 19
    },
    targetAudience: ['Quality perfectionists', 'Professional aspirants', 'Advanced hobbyists'],
    outcomes: ['Professional construction skills', 'Perfect finishing techniques', 'Industry-level quality', 'Master craftsmanship']
  },
  {
    id: 'fashion-entrepreneur-package',
    name: 'Fashion Entrepreneur Complete',
    nameGerman: 'Mode-Unternehmerin Komplett',
    description: 'Everything needed to start your fashion business: design, construction, and business skills.',
    level: 'advanced',
    duration: '20 weeks',
    courses: [
      'patternmaking-classic-top',
      'patternmaking-draping-dress',
      'sewing-skills-shirt',
      'collection-development',
      'adobe-illustrator-intermediate',
      'presentation-photoshop-indesign',
      'sustainable-fashion-concepts'
    ],
    pricing: {
      amount: 2850, // vs 3520 individual (19% discount)
      currency: 'EUR',
      discount: 19
    },
    targetAudience: ['Aspiring entrepreneurs', 'Brand developers', 'Business-minded creatives'],
    outcomes: ['Complete fashion business skills', 'Professional collections', 'Brand development', 'Market-ready expertise']
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

export function getCoursePackageById(id: string): CoursePackage | undefined {
  return COURSE_PACKAGES.find(pkg => pkg.id === id);
}

export function getCoursePackagesByLevel(level: CoursePackage['level']): CoursePackage[] {
  return COURSE_PACKAGES.filter(pkg => pkg.level === level);
}

export function calculatePackageValue(packageId: string): { original: number; discounted: number; savings: number } | null {
  const pkg = getCoursePackageById(packageId);
  if (!pkg) return null;
  
  const originalTotal = pkg.courses.reduce((total, courseId) => {
    const course = getCourseById(courseId);
    return total + (course?.pricing.amount || 0);
  }, 0);
  
  return {
    original: originalTotal,
    discounted: pkg.pricing.amount,
    savings: originalTotal - pkg.pricing.amount
  };
}