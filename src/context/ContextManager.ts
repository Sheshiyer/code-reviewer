import { CodeContext, ContextConfig, HistoricalContext } from '../types/index.js';
import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';

export class ContextManager {
  private contextCache: NodeCache;
  private config: ContextConfig;
  private activeContexts: Map<string, CodeContext>;

  constructor(config: ContextConfig) {
    this.config = config;
    this.contextCache = new NodeCache({
      stdTTL: config.pruningFrequency,
      checkperiod: config.pruningFrequency / 2,
    });
    this.activeContexts = new Map();
  }

  async createContext(
    code: string,
    language?: string,
    framework?: string,
    dependencies?: Record<string, string>
  ): Promise<string> {
    const contextId = uuidv4();
    const context: CodeContext = {
      language,
      framework,
      dependencies,
      fileContext: code,
      historicalContext: [],
    };

    this.activeContexts.set(contextId, context);
    return contextId;
  }

  async updateContext(contextId: string, newContext: Partial<CodeContext>): Promise<void> {
    const existingContext = this.activeContexts.get(contextId);
    if (!existingContext) {
      throw new Error(`Context not found: ${contextId}`);
    }

    // Update context while preserving historical data
    const updatedContext = {
      ...existingContext,
      ...newContext,
      historicalContext: existingContext.historicalContext || [],
    };

    // Add current state to historical context if it meets relevance threshold
    const relevanceScore = await this.calculateRelevance(existingContext, newContext);
    if (relevanceScore >= this.config.relevanceThreshold) {
      const historicalEntry: HistoricalContext = {
        timestamp: Date.now(),
        relevanceScore,
        context: JSON.stringify(existingContext),
      };

      updatedContext.historicalContext = [
        ...(updatedContext.historicalContext || []),
        historicalEntry,
      ].slice(-this.config.historyDepth); // Keep only the most recent entries
    }

    this.activeContexts.set(contextId, updatedContext);
    this.contextCache.set(contextId, updatedContext);
  }

  async getContext(contextId: string): Promise<CodeContext | null> {
    // Try active contexts first
    const activeContext = this.activeContexts.get(contextId);
    if (activeContext) {
      return activeContext;
    }

    // Try cache
    const cachedContext = this.contextCache.get<CodeContext>(contextId);
    if (cachedContext) {
      // Move to active contexts if found in cache
      this.activeContexts.set(contextId, cachedContext);
      return cachedContext;
    }

    return null;
  }

  async pruneContext(contextId: string): Promise<void> {
    this.activeContexts.delete(contextId);
    this.contextCache.del(contextId);
  }

  private async calculateRelevance(
    oldContext: CodeContext,
    newContext: Partial<CodeContext>
  ): Promise<number> {
    // Simple relevance calculation - can be enhanced with more sophisticated metrics
    let relevanceScore = 0;
    let totalFactors = 0;

    // Compare language
    if (newContext.language && oldContext.language) {
      relevanceScore += newContext.language === oldContext.language ? 1 : 0;
      totalFactors++;
    }

    // Compare framework
    if (newContext.framework && oldContext.framework) {
      relevanceScore += newContext.framework === oldContext.framework ? 1 : 0;
      totalFactors++;
    }

    // Compare dependencies
    if (newContext.dependencies && oldContext.dependencies) {
      const depsMatch = Object.entries(newContext.dependencies).every(
        ([key, value]) => oldContext.dependencies?.[key] === value
      );
      relevanceScore += depsMatch ? 1 : 0;
      totalFactors++;
    }

    // Compare file context if available
    if (newContext.fileContext && oldContext.fileContext) {
      // Simple string similarity - can be enhanced with more sophisticated comparison
      const similarity = this.calculateStringSimilarity(
        newContext.fileContext,
        oldContext.fileContext
      );
      relevanceScore += similarity;
      totalFactors++;
    }

    return totalFactors > 0 ? relevanceScore / totalFactors : 0;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Simple Jaccard similarity implementation
    // Can be replaced with more sophisticated algorithms
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  async shareContext(contextId: string, targetExperts: string[]): Promise<void> {
    const context = await this.getContext(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    if (this.config.sharingPolicy === 'selective') {
      // Implement selective sharing logic
      // This could involve filtering sensitive information
      // or creating expert-specific context views
    }

    // In a real implementation, this would distribute context to other experts
    // For now, we'll just log the sharing action
    console.log(`Sharing context ${contextId} with experts:`, targetExperts);
  }
}
