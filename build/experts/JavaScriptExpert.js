import { BaseExpert } from './BaseExpert.js';
import { ExpertType, IssueType, IssueSeverity, SuggestionType } from '../types/index.js';
export class JavaScriptExpert extends BaseExpert {
    constructor(id = 'javascript', initialConfidence = 0.8) {
        super(id, ExpertType.Language, initialConfidence);
    }
    async analyze(code, context) {
        await this.validateContext(context);
        const issues = [];
        const suggestions = [];
        let metrics = this.calculateBaseMetrics();
        try {
            // Analyze code structure and patterns
            this.analyzeCodeStructure(code, issues, suggestions);
            // Check for common JavaScript issues
            this.checkCommonIssues(code, issues);
            // Analyze performance implications
            this.analyzePerformance(code, issues, suggestions);
            // Calculate metrics
            metrics = this.calculateMetrics(code);
            this.updateConfidence(true);
        }
        catch (error) {
            this.updateConfidence(false);
            issues.push({
                type: IssueType.Maintainability,
                severity: IssueSeverity.High,
                description: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
        return this.createAnalysis(issues, suggestions, metrics);
    }
    analyzeCodeStructure(code, issues, suggestions) {
        // Check for ES6+ features usage
        if (!code.includes('const') && !code.includes('let')) {
            suggestions.push({
                type: SuggestionType.Refactoring,
                description: 'Consider using ES6+ variable declarations (const/let) instead of var',
                impact: 'Improved code maintainability and scoping',
                implementation: 'Replace var declarations with const for constants and let for variables'
            });
        }
        // Check for callback hell patterns
        if ((code.match(/callback/g) || []).length > 3) {
            suggestions.push({
                type: SuggestionType.Refactoring,
                description: 'Consider refactoring nested callbacks using Promises or async/await',
                impact: 'Improved code readability and maintainability',
                implementation: 'Convert nested callbacks to Promise chains or async/await syntax'
            });
        }
        // Check for proper error handling
        if (!code.includes('try') && !code.includes('catch')) {
            issues.push({
                type: IssueType.Maintainability,
                severity: IssueSeverity.Medium,
                description: 'No error handling detected in the code',
                suggestedFix: 'Implement try-catch blocks for error handling'
            });
        }
    }
    checkCommonIssues(code, issues) {
        // Check for console.log statements
        if (code.includes('console.log')) {
            issues.push({
                type: IssueType.Maintainability,
                severity: IssueSeverity.Low,
                description: 'Console.log statements found in code',
                suggestedFix: 'Remove or replace console.log with proper logging mechanism'
            });
        }
        // Check for eval usage
        if (code.includes('eval(')) {
            issues.push({
                type: IssueType.Security,
                severity: IssueSeverity.Critical,
                description: 'Eval usage detected - potential security risk',
                suggestedFix: 'Remove eval and use safer alternatives'
            });
        }
        // Check for == instead of ===
        if (code.includes('==') || code.includes('!=')) {
            issues.push({
                type: IssueType.Style,
                severity: IssueSeverity.Medium,
                description: 'Use of loose equality operators (== or !=)',
                suggestedFix: 'Replace == with === and != with !=='
            });
        }
    }
    analyzePerformance(code, issues, suggestions) {
        // Check for large array operations
        if (code.includes('.forEach') || code.includes('.map')) {
            const arrayOps = code.match(/\.(forEach|map|filter|reduce)/g) || [];
            if (arrayOps.length > 3) {
                suggestions.push({
                    type: SuggestionType.Performance,
                    description: 'Multiple array operations detected',
                    impact: 'Potential performance impact on large datasets',
                    implementation: 'Consider combining operations or using a more efficient approach'
                });
            }
        }
        // Check for memory leaks in event listeners
        if (code.includes('addEventListener') && !code.includes('removeEventListener')) {
            issues.push({
                type: IssueType.Performance,
                severity: IssueSeverity.Medium,
                description: 'Potential memory leak: event listener without cleanup',
                suggestedFix: 'Add corresponding removeEventListener calls'
            });
        }
    }
    calculateMetrics(code) {
        const metrics = this.calculateBaseMetrics();
        // Calculate complexity based on control structures
        const controlStructures = (code.match(/(if|for|while|switch|catch)/g) || []).length;
        metrics.complexity = Math.min(10, controlStructures / 2);
        // Calculate maintainability based on various factors
        const lines = code.split('\n').length;
        const comments = (code.match(/\/\//g) || []).length + (code.match(/\/\*[\s\S]*?\*\//g) || []).length;
        metrics.maintainability = Math.min(10, (comments / lines) * 10);
        // Calculate testability based on function structure
        const functions = (code.match(/function/g) || []).length;
        metrics.testability = Math.min(10, (functions / lines) * 20);
        // Security score based on dangerous patterns
        const dangerousPatterns = (code.match(/(eval|innerHTML|document\.write)/g) || []).length;
        metrics.security = Math.max(0, 10 - dangerousPatterns * 2);
        // Performance score based on various factors
        const heavyOperations = (code.match(/(\.forEach|\.map|\.filter|while|for\s+of|for\s+in)/g) || []).length;
        metrics.performance = Math.max(0, 10 - heavyOperations);
        return metrics;
    }
}
