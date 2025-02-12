#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from './context/ContextManager.js';
import { GatingNetwork } from './gating/GatingNetwork.js';
import { JavaScriptExpert } from './experts/JavaScriptExpert.js';
import { ExpertAnalysis, ContextConfig, GatingConfig } from './types/index.js';

class CodeReviewMCP {
  private server: Server;
  private contextManager: ContextManager;
  private gatingNetwork: GatingNetwork;

  constructor() {
    // Initialize configurations
    const contextConfig: ContextConfig = {
      windowSize: 1000,
      historyDepth: 10,
      relevanceThreshold: 0.75,
      pruningFrequency: 3600, // 1 hour in seconds
      sharingPolicy: 'selective'
    };

    const gatingConfig: GatingConfig = {
      confidenceThreshold: 0.8,
      loadBalanceFactor: 0.3,
      minimumExperts: 2,
      maximumExperts: 5,
      fallbackStrategy: 'select_best_available'
    };

    // Initialize components
    this.contextManager = new ContextManager(contextConfig);
    this.gatingNetwork = new GatingNetwork(gatingConfig);

    // Initialize server
    this.server = new Server(
      {
        name: 'code-review-mcp',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // Register initial experts
    this.registerExperts();
    
    // Set up request handlers
    this.setupRequestHandlers();
  }

  private registerExperts(): void {
    // Register JavaScript expert
    const jsExpert = new JavaScriptExpert();
    this.gatingNetwork.registerExpert(jsExpert);

    // Additional experts can be registered here
    // this.gatingNetwork.registerExpert(new PythonExpert());
    // this.gatingNetwork.registerExpert(new SecurityExpert());
    // etc.
  }

  private setupRequestHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_code',
          description: 'Analyze code using multiple specialized experts',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The code to analyze'
              },
              language: {
                type: 'string',
                description: 'Programming language of the code'
              },
              framework: {
                type: 'string',
                description: 'Framework used (if any)'
              }
            },
            required: ['code', 'language']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'analyze_code') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const { code, language, framework } = request.params.arguments as {
        code: string;
        language: string;
        framework?: string;
      };

      try {
        const analysis = await this.analyzeCode(code, language, framework);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analysis, null, 2)
            }
          ]
        };
      } catch (error: unknown) {
        throw new McpError(
          ErrorCode.InternalError,
          `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };
  }

  private async analyzeCode(
    code: string,
    language: string,
    framework?: string
  ): Promise<ExpertAnalysis[]> {
    // Create context for this analysis
    const contextId = await this.contextManager.createContext(
      code,
      language,
      framework
    );

    // Get context
    const context = await this.contextManager.getContext(contextId);
    if (!context) {
      throw new Error('Failed to create analysis context');
    }

    // Select appropriate experts
    const characteristics = new Map<string, number>();
    characteristics.set('security_risk', 0.5); // Default values
    characteristics.set('performance_critical', 0.5);

    const selectedExperts = await this.gatingNetwork.selectExperts(
      language,
      characteristics
    );

    // Perform analysis with selected experts
    const analysisPromises = selectedExperts.map((expert) =>
      expert.analyze(code, context)
    );

    // Wait for all analyses to complete
    const analyses = await Promise.all(analysisPromises);

    // Clean up context
    await this.contextManager.pruneContext(contextId);

    return analyses;
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Code Review MCP server running on stdio');
  }
}

// Start the server
const server = new CodeReviewMCP();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
