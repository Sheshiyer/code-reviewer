import { BaseExpert } from './BaseExpert.js';
import { CodeContext, ExpertAnalysis } from '../types/index.js';
export declare class JavaScriptExpert extends BaseExpert {
    constructor(id?: string, initialConfidence?: number);
    analyze(code: string, context: CodeContext): Promise<ExpertAnalysis>;
    private analyzeCodeStructure;
    private checkCommonIssues;
    private analyzePerformance;
    private calculateMetrics;
}
