export class BaseExpert {
    constructor(id, type, initialConfidence = 0.7) {
        this.id = id;
        this.type = type;
        this.confidence = initialConfidence;
    }
    async createAnalysis(issues, suggestions, metrics) {
        return {
            expertId: this.id,
            expertType: this.type,
            confidence: this.confidence,
            issues,
            suggestions,
            metrics
        };
    }
    updateConfidence(success, magnitude = 0.1) {
        if (success) {
            this.confidence = Math.min(1, this.confidence + magnitude);
        }
        else {
            this.confidence = Math.max(0, this.confidence - magnitude);
        }
    }
    calculateBaseMetrics() {
        return {
            complexity: 0,
            maintainability: 0,
            testability: 0,
            security: 0,
            performance: 0
        };
    }
    async validateContext(context) {
        // Basic context validation
        if (!context.fileContext) {
            throw new Error('File context is required for analysis');
        }
        return true;
    }
    getConfidence() {
        return this.confidence;
    }
}
