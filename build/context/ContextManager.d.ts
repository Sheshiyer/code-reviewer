import { CodeContext, ContextConfig } from '../types/index.js';
export declare class ContextManager {
    private contextCache;
    private config;
    private activeContexts;
    constructor(config: ContextConfig);
    createContext(code: string, language?: string, framework?: string, dependencies?: Record<string, string>): Promise<string>;
    updateContext(contextId: string, newContext: Partial<CodeContext>): Promise<void>;
    getContext(contextId: string): Promise<CodeContext | null>;
    pruneContext(contextId: string): Promise<void>;
    private calculateRelevance;
    private calculateStringSimilarity;
    shareContext(contextId: string, targetExperts: string[]): Promise<void>;
}
