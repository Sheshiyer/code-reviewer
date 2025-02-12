import { Expert, ExpertType, GatingConfig } from '../types/index.js';
export declare class GatingNetwork {
    private experts;
    private config;
    constructor(config: GatingConfig);
    registerExpert(expert: Expert): void;
    unregisterExpert(expertId: string): void;
    selectExperts(language: string, characteristics: Map<string, number>): Promise<Expert[]>;
    private calculateExpertScore;
    private checkLoadBalance;
    private applyFallbackStrategy;
    getExpertCount(): number;
    getExpertsByType(type: ExpertType): Expert[];
}
