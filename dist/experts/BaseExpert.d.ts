import { Expert, ExpertType, CodeContext, ExpertAnalysis, CodeIssue, CodeSuggestion, CodeMetrics } from '../types/index.js';
export declare abstract class BaseExpert implements Expert {
    readonly id: string;
    readonly type: ExpertType;
    confidence: number;
    constructor(id: string, type: ExpertType, initialConfidence?: number);
    abstract analyze(code: string, context: CodeContext): Promise<ExpertAnalysis>;
    protected createAnalysis(issues: CodeIssue[], suggestions: CodeSuggestion[], metrics: CodeMetrics): Promise<ExpertAnalysis>;
    protected updateConfidence(success: boolean, magnitude?: number): void;
    protected calculateBaseMetrics(): CodeMetrics;
    protected validateContext(context: CodeContext): Promise<boolean>;
    getConfidence(): number;
}
