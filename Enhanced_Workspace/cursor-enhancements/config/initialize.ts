/**
 * System Initialization
 * 
 * Initializes all connections and services on startup.
 */

import { loadAPIConfig, validateAPIConfig } from './api-config';
import { loadDatabaseConfig, validateDatabaseConfig } from './database-config';
import { loadLocalConfig, validateLocalConfig } from './local-config';
import { createConnectionManager } from './connection-manager';
import { createModelManager } from '../integrations/local-models/model-manager';

/**
 * System initialization result
 */
export interface InitializationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  services: {
    apis: string[];
    database: boolean;
    localModels: string[];
  };
}

/**
 * Initialize entire system
 */
export async function initializeSystem(): Promise<InitializationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const initializedAPIs: string[] = [];
  const initializedLocalModels: string[] = [];

  // Load configurations
  const apiConfig = loadAPIConfig();
  const dbConfig = loadDatabaseConfig();
  const localConfig = loadLocalConfig();

  // Validate configurations
  const apiValidation = validateAPIConfig(apiConfig);
  if (!apiValidation.valid) {
    errors.push(...apiValidation.errors);
  }
  warnings.push(...apiValidation.warnings);

  const dbValidation = validateDatabaseConfig(dbConfig);
  if (!dbValidation.valid) {
    errors.push(...dbValidation.errors);
  }

  const localValidation = validateLocalConfig(localConfig);
  if (!localValidation.valid) {
    warnings.push(...localValidation.errors);
  }

  // Initialize local models if configured
  if (process.env.USE_LOCAL_MODELS !== "false") {
    try {
      // Initialize Ollama
      if (localConfig.ollama) {
        const { createOllamaClient } = require('../integrations/local-models/ollama-client');
        const ollama = createOllamaClient(localConfig.ollama);
        const available = await ollama.checkAvailability();
        if (available) {
          initializedLocalModels.push("ollama");
          warnings.push("Using local Ollama for LLM and vision tasks");
        } else {
          warnings.push("Ollama not available - install it from https://ollama.ai");
        }
      }

      // Initialize local Stable Diffusion
      if (localConfig.stableDiffusion) {
        const { createLocalStableDiffusionService } = require('../integrations/local-models/local-stable-diffusion');
        const localSD = createLocalStableDiffusionService(localConfig.stableDiffusion);
        const available = await localSD.checkAvailability();
        if (available) {
          initializedLocalModels.push("local-stable-diffusion");
          warnings.push(`Using local ${localConfig.stableDiffusion.type} for image generation`);
        } else {
          warnings.push(`${localConfig.stableDiffusion.type} not available at ${localConfig.stableDiffusion.baseUrl}`);
        }
      }

      // Initialize local embeddings
      if (localConfig.embeddings) {
        try {
          const { createSentenceTransformersService } = require('../integrations/local-models/sentence-transformers');
          const stService = createSentenceTransformersService(localConfig.embeddings);
          await stService.initialize();
          initializedLocalModels.push("sentence-transformers");
          warnings.push("Using local Sentence Transformers for embeddings");
        } catch (error) {
          warnings.push(`Local embeddings not available: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Initialize model manager
      const modelManager = createModelManager();
      await modelManager.initialize();
    } catch (error) {
      warnings.push(`Local model initialization warning: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Initialize connection manager
  const connectionManager = createConnectionManager(apiConfig, dbConfig);

  try {
    // Initialize connections
    await connectionManager.initialize();

    // Check which services are connected
    const statuses = connectionManager.getAllStatuses();
    for (const status of statuses) {
      if (status.connected) {
        initializedAPIs.push(status.service);
      } else {
        warnings.push(`${status.service} is not connected: ${status.error || 'Unknown error'}`);
      }
    }

    // Start health checks
    const healthCheckInterval = parseInt(process.env.HEALTH_CHECK_INTERVAL || "60000");
    connectionManager.startHealthChecks(healthCheckInterval);

    return {
      success: errors.length === 0,
      errors,
      warnings,
      services: {
        apis: initializedAPIs,
        database: statuses.some(s => s.service === "vectorDB" && s.connected),
        localModels: initializedLocalModels
      }
    };
  } catch (error) {
    errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      success: false,
      errors,
      warnings,
      services: {
        apis: [],
        database: false,
        localModels: []
      }
    };
  }
}

/**
 * Initialize knowledge graph system
 */
export async function initializeKnowledgeGraph(): Promise<void> {
  const dbConfig = loadDatabaseConfig();
  
  // Import and initialize knowledge graph
  const { initializeKnowledgeGraph: initKG } = require('../layer-38-knowledge-graph');
  
  await initKG({
    vectorDBType: dbConfig.vectorDB.type,
    vectorDBConfig: {
      connectionString: dbConfig.vectorDB.connectionString,
      apiKey: dbConfig.vectorDB.apiKey
    },
    embeddingModel: dbConfig.embedding.model,
    embeddingApiKey: dbConfig.embedding.apiKey
  });
}

