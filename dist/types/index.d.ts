export interface Expert {
    id: string;
    type: ExpertType;
    confidence: number;
    analyze(code: string, context: CodeContext): Promise<ExpertAnalysis>;
}
export declare enum ExpertType {
    Language = "language",
    Security = "security",
    Performance = "performance",
    Architecture = "architecture",
    Testing = "testing",
    Documentation = "documentation",
    Style = "style"
}
export interface CodeContext {
    language?: string;
    framework?: string;
    dependencies?: Record<string, string>;
    fileContext?: string;
    projectContext?: string;
    historicalContext?: HistoricalContext[];
}
export interface HistoricalContext {
    timestamp: number;
    relevanceScore: number;
    context: string;
}
export interface ExpertAnalysis {
    expertId: string;
    expertType: ExpertType;
    confidence: number;
    issues: CodeIssue[];
    suggestions: CodeSuggestion[];
    metrics: CodeMetrics;
}
export interface CodeIssue {
    type: IssueType;
    severity: IssueSeverity;
    description: string;
    location?: CodeLocation;
    suggestedFix?: string;
}
export interface CodeSuggestion {
    type: SuggestionType;
    description: string;
    impact: string;
    implementation?: string;
}
export interface CodeMetrics {
    complexity: number;
    maintainability: number;
    testability: number;
    security: number;
    performance: number;
}
export interface CodeLocation {
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
    filePath?: string;
}
export declare enum IssueType {
    Security = "security",
    Performance = "performance",
    Style = "style",
    Architecture = "architecture",
    Documentation = "documentation",
    Testing = "testing",
    Maintainability = "maintainability"
}
export declare enum IssueSeverity {
    Critical = "critical",
    High = "high",
    Medium = "medium",
    Low = "low",
    Info = "info"
}
export declare enum SuggestionType {
    Refactoring = "refactoring",
    Performance = "performance",
    Security = "security",
    Testing = "testing",
    Documentation = "documentation",
    Architecture = "architecture"
}
export interface GatingConfig {
    confidenceThreshold: number;
    loadBalanceFactor: number;
    minimumExperts: number;
    maximumExperts: number;
    fallbackStrategy: string;
}
export interface ContextConfig {
    windowSize: number;
    historyDepth: number;
    relevanceThreshold: number;
    pruningFrequency: number;
    sharingPolicy: string;
}
