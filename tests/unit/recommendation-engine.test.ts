// Unit Tests - Recommendation Engine
// Following CLAUDE.md requirements: Test recommendation logic accuracy

import { RecommendationEngine } from '@/lib/ellu/recommendations';
import { UserProfile } from '@/types/ellu';

describe('RecommendationEngine', () => {
  describe('generateRecommendations', () => {
    test('should recommend beginner journey for complete beginners wanting career change', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'complete-beginner',
        goals: ['career-change'],
        timeCommitment: 'intensive',
        preferredStyle: 'precise-technical'
      };

      const recommendations = RecommendationEngine.generateRecommendations(userProfile);
      
      expect(recommendations).toHaveLength(5); // Top 5 recommendations
      expect(recommendations[0].journey?.id).toBe('beginner-journey');
      expect(recommendations[0].matchScore).toBeGreaterThan(70);
      expect(recommendations[0].reasoning).toContain('beginner');
    });

    test('should recommend advanced journey for experienced users', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'advanced',
        goals: ['start-business'],
        timeCommitment: 'moderate',
        preferredStyle: 'creative-intuitive'
      };

      const recommendations = RecommendationEngine.generateRecommendations(userProfile);
      
      expect(recommendations[0].journey?.id).toBe('advanced-journey');
      expect(recommendations[0].matchScore).toBeGreaterThan(65);
    });

    test('should recommend sustainable journey for sustainability-focused users', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'intermediate',
        goals: ['sustainability'],
        interests: ['sustainable fashion'],
        preferredStyle: 'mixed'
      };

      const recommendations = RecommendationEngine.generateRecommendations(userProfile);
      
      expect(recommendations[0].journey?.id).toBe('sustainable-journey');
      expect(recommendations[0].reasoning).toContain('sustainability');
    });

    test('should recommend digital journey for tech-focused users', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'some-sewing',
        goals: ['digital-skills'],
        interests: ['digital tools'],
        timeCommitment: 'moderate'
      };

      const recommendations = RecommendationEngine.generateRecommendations(userProfile);
      
      expect(recommendations[0].journey?.id).toBe('digital-journey');
      expect(recommendations[0].reasoning).toContain('digital');
    });

    test('should return empty array for invalid profile', () => {
      const userProfile = {};
      const recommendations = RecommendationEngine.generateRecommendations(userProfile);
      
      // Should still return default beginner journey
      expect(recommendations).toHaveLength(5);
      expect(recommendations[0].journey?.id).toBe('beginner-journey');
    });
  });

  describe('recommendJourney', () => {
    test('should return beginner journey for complete beginners', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'complete-beginner',
        goals: ['career-change']
      };

      const journey = RecommendationEngine.recommendJourney(userProfile);
      expect(journey?.id).toBe('beginner-journey');
    });

    test('should return advanced journey for experienced users', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'advanced'
      };

      const journey = RecommendationEngine.recommendJourney(userProfile);
      expect(journey?.id).toBe('advanced-journey');
    });

    test('should prioritize sustainability journey over experience level', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'advanced',
        goals: ['sustainability']
      };

      const journey = RecommendationEngine.recommendJourney(userProfile);
      expect(journey?.id).toBe('sustainable-journey');
    });

    test('should prioritize digital journey for digital skills goal', () => {
      const userProfile: Partial<UserProfile> = {
        experience: 'intermediate',
        goals: ['digital-skills']
      };

      const journey = RecommendationEngine.recommendJourney(userProfile);
      expect(journey?.id).toBe('digital-journey');
    });
  });

  describe('compareCourses', () => {
    test('should provide meaningful comparison between construction and draping', () => {
      const comparison = RecommendationEngine.compareCourses(
        'klassische-schnittkonstruktion',
        'schnittkonstruktion-drapieren'
      );

      expect(comparison).toContain('Classical Pattern Construction');
      expect(comparison).toContain('Pattern Construction through Draping');
      expect(comparison).toContain('mathematical, precise methods');
      expect(comparison).toContain('creative, intuitive techniques');
      expect(comparison).toContain('800€');
      expect(comparison).toContain('950€');
    });

    test('should handle invalid course IDs gracefully', () => {
      const comparison = RecommendationEngine.compareCourses('invalid-id', 'another-invalid');
      expect(comparison).toBe('Unable to compare courses.');
    });

    test('should handle one invalid course ID', () => {
      const comparison = RecommendationEngine.compareCourses(
        'klassische-schnittkonstruktion',
        'invalid-id'
      );
      expect(comparison).toBe('Unable to compare courses.');
    });
  });
});