import {
  Expert,
  ExpertType,
  CodeContext,
  ExpertAnalysis,
  CodeIssue,
  CodeSuggestion,
  CodeMetrics
} from '../types/index.js';

export abstract class BaseExpert implements Expert {
  readonly id: string;
  readonly type: ExpertType;
  public confidence: number;

  constructor(id: string, type: ExpertType, initialConfidence: number = 0.7) {
    this.id = id;
    this.type = type;
    this.confidence = initialConfidence;
  }

  abstract analyze(code: string, context: CodeContext): Promise<ExpertAnalysis>;

  protected async createAnalysis(
    issues: CodeIssue[],
    suggestions: CodeSuggestion[],
    metrics: CodeMetrics
  ): Promise<ExpertAnalysis> {
    return {
      expertId: this.id,
      expertType: this.type,
      confidence: this.confidence,
      issues,
      suggestions,
      metrics
    };
  }

  protected updateConfidence(success: boolean, magnitude: number = 0.1): void {
    if (success) {
      this.confidence = Math.min(1, this.confidence + magnitude);
    } else {
      this.confidence = Math.max(0, this.confidence - magnitude);
    }
  }

  protected calculateBaseMetrics(): CodeMetrics {
    return {
      complexity: 0,
      maintainability: 0,
      testability: 0,
      security: 0,
      performance: 0
    };
  }

  protected async validateContext(context: CodeContext): Promise<boolean> {
    // Basic context validation
    if (!context.fileContext) {
      throw new Error('File context is required for analysis');
    }

    return true;
  }

  getConfidence(): number {
    return this.confidence;
  }
}
