// ELLU Studios Recommendation Engine
// Following CLAUDE.md requirements for course matching

import { UserProfile, CourseRecommendation, LearningJourney } from '@/types/ellu';
import { COURSES, LEARNING_JOURNEYS, getCourseById } from './courses';

export class RecommendationEngine {
  
  /**
   * Generate course recommendations based on user profile
   */
  static generateRecommendations(userProfile: Partial<UserProfile>): CourseRecommendation[] {
    const recommendations: CourseRecommendation[] = [];
    
    // Get recommended journey first
    const journey = this.recommendJourney(userProfile);
    
    if (journey) {
      // Recommend courses from the journey
      const journeyCourses = journey.courses
        .map(courseId => getCourseById(courseId))
        .filter(Boolean);
        
      journeyCourses.forEach(course => {
        if (course) {
          const matchScore = this.calculateMatchScore(course, userProfile);
          const reasoning = this.generateReasoning(course, userProfile, journey);
          
          recommendations.push({
            course,
            matchScore,
            reasoning,
            journey
          });
        }
      });
    }
    
    // Sort by match score (highest first)
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5 recommendations
  }
  
  /**
   * Recommend the best learning journey based on user profile
   */
  static recommendJourney(userProfile: Partial<UserProfile>): LearningJourney | null {
    const { experience, goals, timeCommitment, preferredStyle, interests } = userProfile;
    
    // Beginner Journey - for complete beginners wanting structured approach
    if (experience === 'complete-beginner' || experience === 'some-sewing') {
      if (goals?.includes('career-change') || goals?.includes('start-business')) {
        return LEARNING_JOURNEYS.find(j => j.id === 'beginner-journey') || null;
      }
    }
    
    // Advanced Journey - for experienced users
    if (experience === 'intermediate' || experience === 'advanced') {
      return LEARNING_JOURNEYS.find(j => j.id === 'advanced-journey') || null;
    }
    
    // Sustainable Journey - for sustainability-focused users
    if (goals?.includes('sustainability') || interests?.includes('sustainable fashion')) {
      return LEARNING_JOURNEYS.find(j => j.id === 'sustainable-journey') || null;
    }
    
    // Digital Journey - for tech-savvy users
    if (goals?.includes('digital-skills') || interests?.includes('digital tools')) {
      return LEARNING_JOURNEYS.find(j => j.id === 'digital-journey') || null;
    }
    
    // Default to beginner journey
    return LEARNING_JOURNEYS.find(j => j.id === 'beginner-journey') || null;
  }
  
  /**
   * Calculate match score between course and user profile (0-100)
   */
  private static calculateMatchScore(course: any, userProfile: Partial<UserProfile>): number {
    let score = 50; // Base score
    
    // Experience level matching (25 points)
    if (userProfile.experience) {
      switch (userProfile.experience) {
        case 'complete-beginner':
          score += course.level === 'beginner' ? 25 : course.level === 'intermediate' ? 10 : 0;
          break;
        case 'some-sewing':
          score += course.level === 'beginner' ? 20 : course.level === 'intermediate' ? 25 : 5;
          break;
        case 'intermediate':
          score += course.level === 'intermediate' ? 25 : course.level === 'advanced' ? 20 : 10;
          break;
        case 'advanced':
          score += course.level === 'advanced' ? 25 : course.level === 'intermediate' ? 15 : 5;
          break;
      }
    }
    
    // Goals alignment (20 points)
    if (userProfile.goals) {
      if (userProfile.goals.includes('sustainability') && course.category === 'sustainable') {
        score += 20;
      }
      if (userProfile.goals.includes('digital-skills') && course.category === 'digital') {
        score += 20;
      }
      if (userProfile.goals.includes('career-change') && course.level === 'beginner') {
        score += 15;
      }
    }
    
    // Time commitment matching (10 points)
    if (userProfile.timeCommitment) {
      const courseDurationWeeks = parseInt(course.duration);
      switch (userProfile.timeCommitment) {
        case 'minimal':
          score += courseDurationWeeks <= 4 ? 10 : courseDurationWeeks <= 6 ? 5 : 0;
          break;
        case 'moderate':
          score += courseDurationWeeks >= 4 && courseDurationWeeks <= 8 ? 10 : 5;
          break;
        case 'intensive':
          score += courseDurationWeeks >= 6 ? 10 : 5;
          break;
      }
    }
    
    // Preferred style matching (15 points)
    if (userProfile.preferredStyle) {
      switch (userProfile.preferredStyle) {
        case 'precise-technical':
          score += course.category === 'construction' ? 15 : course.category === 'digital' ? 10 : 5;
          break;
        case 'creative-intuitive':
          score += course.category === 'draping' ? 15 : course.category === 'sustainable' ? 10 : 5;
          break;
        case 'mixed':
          score += 10; // Bonus for being flexible
          break;
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  /**
   * Generate human-readable reasoning for the recommendation
   */
  private static generateReasoning(
    course: any, 
    userProfile: Partial<UserProfile>, 
    journey?: LearningJourney
  ): string {
    const reasons: string[] = [];
    
    // Experience match
    if (userProfile.experience === 'complete-beginner' && course.level === 'beginner') {
      reasons.push('Perfect for complete beginners');
    } else if (userProfile.experience === 'advanced' && course.level === 'advanced') {
      reasons.push('Matches your advanced skill level');
    }
    
    // Goals alignment
    if (userProfile.goals?.includes('career-change')) {
      reasons.push('Excellent for career changers');
    }
    if (userProfile.goals?.includes('sustainability') && course.category === 'sustainable') {
      reasons.push('Aligns with your sustainability interests');
    }
    if (userProfile.goals?.includes('digital-skills') && course.category === 'digital') {
      reasons.push('Develops your desired digital skills');
    }
    
    // Style preference
    if (userProfile.preferredStyle === 'precise-technical' && course.category === 'construction') {
      reasons.push('Matches your preference for technical precision');
    } else if (userProfile.preferredStyle === 'creative-intuitive' && course.category === 'draping') {
      reasons.push('Perfect for your creative, intuitive approach');
    }
    
    // Journey context
    if (journey) {
      reasons.push(`Part of your ${journey.name.toLowerCase()}`);
    }
    
    // Default reasoning if no specific matches
    if (reasons.length === 0) {
      reasons.push('Well-suited based on your profile');
    }
    
    return reasons.join(', ') + '.';
  }
  
  /**
   * Compare two courses for user decision making
   */
  static compareCourses(course1Id: string, course2Id: string): string {
    const course1 = getCourseById(course1Id);
    const course2 = getCourseById(course2Id);
    
    if (!course1 || !course2) {
      return 'Unable to compare courses.';
    }
    
    return `
**${course1.name}** vs **${course2.name}**:

**Approach**: ${course1.name} uses ${course1.category === 'construction' ? 'mathematical, precise methods' : 'creative, intuitive techniques'}, while ${course2.name} focuses on ${course2.category === 'construction' ? 'systematic construction' : 'artistic expression'}.

**Duration**: ${course1.duration} vs ${course2.duration}

**Perfect for**: ${course1.name} suits ${course1.perfectFor.join(', ')}, while ${course2.name} is ideal for ${course2.perfectFor.join(', ')}.

**Investment**: ${course1.pricing.amount}€ vs ${course2.pricing.amount}€

Both courses lead to valuable skills, but your choice depends on whether you prefer ${course1.category === 'construction' ? 'structured precision' : 'creative freedom'} or ${course2.category === 'construction' ? 'technical accuracy' : 'artistic expression'}.
    `.trim();
  }
}