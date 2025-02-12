import { Expert, ExpertType, GatingConfig } from '../types/index.js';

export class GatingNetwork {
  private experts: Map<string, Expert>;
  private config: GatingConfig;

  constructor(config: GatingConfig) {
    this.config = config;
    this.experts = new Map();
  }

  registerExpert(expert: Expert): void {
    this.experts.set(expert.id, expert);
  }

  unregisterExpert(expertId: string): void {
    this.experts.delete(expertId);
  }

  async selectExperts(
    language: string,
    characteristics: Map<string, number>
  ): Promise<Expert[]> {
    const candidates = Array.from(this.experts.values());
    const selectedExperts: Expert[] = [];
    const scores = new Map<string, number>();

    // Calculate scores for each expert
    for (const expert of candidates) {
      const score = await this.calculateExpertScore(expert, language, characteristics);
      scores.set(expert.id, score);
    }

    // Sort experts by score
    const sortedExperts = candidates.sort((a, b) => {
      const scoreA = scores.get(a.id) || 0;
      const scoreB = scores.get(b.id) || 0;
      return scoreB - scoreA;
    });

    // Select experts based on confidence threshold and load balance
    let totalConfidence = 0;
    for (const expert of sortedExperts) {
      const score = scores.get(expert.id) || 0;
      
      if (
        score >= this.config.confidenceThreshold &&
        selectedExperts.length < this.config.maximumExperts &&
        this.checkLoadBalance(expert)
      ) {
        selectedExperts.push(expert);
        totalConfidence += score;

        // Check if we have enough experts with sufficient confidence
        if (
          selectedExperts.length >= this.config.minimumExperts &&
          totalConfidence / selectedExperts.length >= this.config.confidenceThreshold
        ) {
          break;
        }
      }
    }

    // Apply fallback strategy if needed
    if (selectedExperts.length < this.config.minimumExperts) {
      return this.applyFallbackStrategy(sortedExperts, selectedExperts);
    }

    return selectedExperts;
  }

  private async calculateExpertScore(
    expert: Expert,
    language: string,
    characteristics: Map<string, number>
  ): Promise<number> {
    let score = expert.confidence;

    // Language matching
    if (expert.type === ExpertType.Language) {
      score *= language === expert.id ? 1.5 : 0.5;
    }

    // Characteristic matching
    for (const [characteristic, weight] of characteristics) {
      switch (expert.type) {
        case ExpertType.Security:
          if (characteristic === 'security_risk') {
            score *= 1 + weight;
          }
          break;
        case ExpertType.Performance:
          if (characteristic === 'performance_critical') {
            score *= 1 + weight;
          }
          break;
        // Add more characteristic matching logic for other expert types
      }
    }

    return score;
  }

  private checkLoadBalance(expert: Expert): boolean {
    // Simple load balancing - can be enhanced with more sophisticated metrics
    const currentLoad = Math.random(); // Placeholder for actual load calculation
    return currentLoad <= this.config.loadBalanceFactor;
  }

  private applyFallbackStrategy(
    sortedExperts: Expert[],
    selectedExperts: Expert[]
  ): Expert[] {
    switch (this.config.fallbackStrategy) {
      case 'select_best_available':
        // Select the best available experts up to minimum required
        while (
          selectedExperts.length < this.config.minimumExperts &&
          sortedExperts.length > 0
        ) {
          const nextBest = sortedExperts.shift();
          if (nextBest) {
            selectedExperts.push(nextBest);
          }
        }
        break;

      case 'include_general_expert':
        // Add a general-purpose expert
        const generalExpert = Array.from(this.experts.values()).find(
          (e) => e.type === ExpertType.Language
        );
        if (generalExpert) {
          selectedExperts.push(generalExpert);
        }
        break;

      // Add more fallback strategies as needed
    }

    return selectedExperts;
  }

  getExpertCount(): number {
    return this.experts.size;
  }

  getExpertsByType(type: ExpertType): Expert[] {
    return Array.from(this.experts.values()).filter(
      (expert) => expert.type === type
    );
  }
}
