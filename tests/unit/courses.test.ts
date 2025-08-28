// Unit Tests - Course Catalog
// Following CLAUDE.md requirements: Test course data and learning paths

import { 
  COURSES, 
  LEARNING_JOURNEYS, 
  COURSE_PACKAGES,
  getCourseById, 
  getCoursesByLevel, 
  getCoursesByCategory,
  getJourneyById,
  getCoursePackageById,
  getCoursePackagesByLevel,
  calculatePackageValue
} from '@/lib/ellu/courses';

describe('Course Catalog', () => {
  describe('Course Data Validation', () => {
    test('should have at least 30 courses as per comprehensive structure', () => {
      expect(COURSES.length).toBeGreaterThanOrEqual(30); // We have 34 courses
    });

    test('should have all 4 required learning journeys', () => {
      expect(LEARNING_JOURNEYS).toHaveLength(4);
      
      const journeyIds = LEARNING_JOURNEYS.map(j => j.id);
      expect(journeyIds).toContain('beginner-journey');
      expect(journeyIds).toContain('advanced-journey');
      expect(journeyIds).toContain('sustainable-journey');
      expect(journeyIds).toContain('digital-journey');
    });

    test('should have courses in all required categories', () => {
      const categories = COURSES.map(c => c.category);
      expect(categories).toContain('patternmaking');
      expect(categories).toContain('draping');
      expect(categories).toContain('sewing');
      expect(categories).toContain('design');
      expect(categories).toContain('digital');
      expect(categories).toContain('textiles');
      expect(categories).toContain('sustainable');
    });

    test('should have courses at all experience levels', () => {
      const levels = COURSES.map(c => c.level);
      expect(levels).toContain('beginner');
      expect(levels).toContain('intermediate');
      expect(levels).toContain('advanced');
    });

    test('should have required flagship courses', () => {
      const courseNames = COURSES.map(c => c.id);
      expect(courseNames).toContain('patternmaking-classic-skirt');
      expect(courseNames).toContain('patternmaking-draping-skirt');
      expect(courseNames).toContain('adobe-illustrator-basics');
      expect(courseNames).toContain('sustainable-fashion-concepts');
      expect(courseNames).toContain('clo3d-course');
      expect(courseNames).toContain('zero-waste-patternmaking');
    });
  });

  describe('Course Structure Validation', () => {
    test('should have all required course properties', () => {
      COURSES.forEach(course => {
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('name');
        expect(course).toHaveProperty('nameGerman');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('level');
        expect(course).toHaveProperty('duration');
        expect(course).toHaveProperty('format');
        expect(course).toHaveProperty('skills');
        expect(course).toHaveProperty('prerequisites');
        expect(course).toHaveProperty('outcomes');
        expect(course).toHaveProperty('category');
        expect(course).toHaveProperty('pricing');
        expect(course).toHaveProperty('perfectFor');
        
        // Validate pricing structure
        expect(course.pricing).toHaveProperty('amount');
        expect(course.pricing).toHaveProperty('currency');
        expect(typeof course.pricing.amount).toBe('number');
        expect(course.pricing.currency).toBe('EUR');
      });
    });

    test('should have valid duration formats', () => {
      COURSES.forEach(course => {
        expect(course.duration).toMatch(/\d+ weeks?/);
      });
    });

    test('should have non-empty skill arrays', () => {
      COURSES.forEach(course => {
        expect(Array.isArray(course.skills)).toBe(true);
        expect(course.skills.length).toBeGreaterThan(0);
        expect(Array.isArray(course.outcomes)).toBe(true);
        expect(course.outcomes.length).toBeGreaterThan(0);
        expect(Array.isArray(course.perfectFor)).toBe(true);
        expect(course.perfectFor.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Learning Journey Validation', () => {
    test('should have valid journey structures', () => {
      LEARNING_JOURNEYS.forEach(journey => {
        expect(journey).toHaveProperty('id');
        expect(journey).toHaveProperty('name');
        expect(journey).toHaveProperty('description');
        expect(journey).toHaveProperty('targetAudience');
        expect(journey).toHaveProperty('duration');
        expect(journey).toHaveProperty('phases');
        expect(journey).toHaveProperty('outcome');
        expect(journey).toHaveProperty('courses');
        
        // Validate phases
        expect(Array.isArray(journey.phases)).toBe(true);
        expect(journey.phases.length).toBeGreaterThan(0);
        
        journey.phases.forEach((phase, index) => {
          expect(phase).toHaveProperty('phase');
          expect(phase).toHaveProperty('name');
          expect(phase).toHaveProperty('duration');
          expect(phase).toHaveProperty('courses');
          expect(phase).toHaveProperty('description');
          expect(phase.phase).toBe(index + 1);
        });
      });
    });

    test('should have valid course references in journeys', () => {
      LEARNING_JOURNEYS.forEach(journey => {
        journey.courses.forEach(courseId => {
          const course = getCourseById(courseId);
          expect(course).toBeDefined();
          expect(course?.id).toBe(courseId);
        });
      });
    });

    test('should have appropriate durations', () => {
      const beginnerJourney = getJourneyById('beginner-journey');
      const advancedJourney = getJourneyById('advanced-journey');
      
      expect(beginnerJourney?.duration).toBe('4-6 months');
      expect(advancedJourney?.duration).toBe('3-5 months');
    });
  });

  describe('Helper Functions', () => {
    test('getCourseById should return correct course', () => {
      const course = getCourseById('patternmaking-classic-skirt');
      expect(course).toBeDefined();
      expect(course?.name).toBe('Classical Pattern Making - Skirt');
      expect(course?.nameGerman).toBe('Klassische Schnittkonstruktion - Rock');
    });

    test('getCourseById should return undefined for invalid ID', () => {
      const course = getCourseById('invalid-course-id');
      expect(course).toBeUndefined();
    });

    test('getCoursesByLevel should filter correctly', () => {
      const beginnerCourses = getCoursesByLevel('beginner');
      const advancedCourses = getCoursesByLevel('advanced');
      
      expect(beginnerCourses.length).toBeGreaterThan(0);
      expect(advancedCourses.length).toBeGreaterThan(0);
      
      beginnerCourses.forEach(course => {
        expect(course.level).toBe('beginner');
      });
      
      advancedCourses.forEach(course => {
        expect(course.level).toBe('advanced');
      });
    });

    test('getCoursesByCategory should filter correctly', () => {
      const patternmakingCourses = getCoursesByCategory('patternmaking');
      const digitalCourses = getCoursesByCategory('digital');
      
      expect(patternmakingCourses.length).toBeGreaterThan(0);
      expect(digitalCourses.length).toBeGreaterThan(0);
      
      patternmakingCourses.forEach(course => {
        expect(course.category).toBe('patternmaking');
      });
      
      digitalCourses.forEach(course => {
        expect(course.category).toBe('digital');
      });
    });

    test('getJourneyById should return correct journey', () => {
      const journey = getJourneyById('beginner-journey');
      expect(journey).toBeDefined();
      expect(journey?.name).toBe('Foundation to Professional Journey');
      
      const invalidJourney = getJourneyById('invalid-journey');
      expect(invalidJourney).toBeUndefined();
    });
  });

  describe('Course Content Quality', () => {
    test('should have meaningful German names', () => {
      const germanCourse = getCourseById('patternmaking-classic-skirt');
      expect(germanCourse?.nameGerman).toBe('Klassische Schnittkonstruktion - Rock');
      expect(germanCourse?.nameGerman).not.toBe(germanCourse?.name);
    });

    test('should have realistic pricing', () => {
      COURSES.forEach(course => {
        expect(course.pricing.amount).toBeGreaterThan(0);
        expect(course.pricing.amount).toBeLessThan(2000); // Reasonable upper limit
      });
    });

    test('should have appropriate course descriptions', () => {
      COURSES.forEach(course => {
        expect(course.description.length).toBeGreaterThan(50);
        expect(course.description).not.toContain('lorem ipsum');
        expect(course.description).not.toContain('placeholder');
      });
    });
  });

  describe('Course Packages', () => {
    test('should have course packages defined', () => {
      expect(COURSE_PACKAGES).toBeDefined();
      expect(COURSE_PACKAGES.length).toBeGreaterThan(0);
    });

    test('should have beginner package with correct courses', () => {
      const beginnerPackage = getCoursePackageById('beginner-complete-package');
      expect(beginnerPackage).toBeDefined();
      expect(beginnerPackage?.name).toBe('Complete Beginner Package');
      expect(beginnerPackage?.courses).toContain('patternmaking-classic-skirt');
      expect(beginnerPackage?.courses).toContain('adobe-illustrator-basics');
      expect(beginnerPackage?.level).toBe('beginner');
    });

    test('should have packages at different levels', () => {
      const beginnerPackages = getCoursePackagesByLevel('beginner');
      const intermediatePackages = getCoursePackagesByLevel('intermediate');
      
      expect(beginnerPackages.length).toBeGreaterThan(0);
      expect(intermediatePackages.length).toBeGreaterThan(0);
    });

    test('should calculate package savings correctly', () => {
      const packageValue = calculatePackageValue('beginner-complete-package');
      expect(packageValue).toBeDefined();
      expect(packageValue?.savings).toBeGreaterThan(0);
      expect(packageValue?.discounted).toBeLessThan(packageValue?.original || 0);
    });

    test('should have all package courses exist in course catalog', () => {
      COURSE_PACKAGES.forEach(pkg => {
        pkg.courses.forEach(courseId => {
          const course = getCourseById(courseId);
          expect(course).toBeDefined();
        });
      });
    });

    test('should have meaningful package discounts', () => {
      COURSE_PACKAGES.forEach(pkg => {
        expect(pkg.pricing.discount).toBeGreaterThan(15); // At least 15% discount
        expect(pkg.pricing.discount).toBeLessThan(25); // Max 25% discount
      });
    });
  });
});