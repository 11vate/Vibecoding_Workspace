/**
 * Test Local Models
 * 
 * Test script to verify all local models are working correctly.
 */

import { createOllamaClient } from '../integrations/local-models/ollama-client';
import { createOllamaVisionService } from '../integrations/local-models/ollama-vision';
import { createLocalStableDiffusionService } from '../integrations/local-models/local-stable-diffusion';
import { createSentenceTransformersService } from '../integrations/local-models/sentence-transformers';
import { createModelManager } from '../integrations/local-models/model-manager';

async function testOllama() {
  console.log('\n🤖 Testing Ollama...');
  try {
    const client = createOllamaClient();
    const available = await client.checkAvailability();
    
    if (!available) {
      console.log('❌ Ollama not available. Install from https://ollama.ai');
      return false;
    }

    console.log('✅ Ollama is running');

    // Test model availability
    const hasModel = await client.hasModel('llama3.1:8b');
    if (!hasModel) {
      console.log('⚠️  Recommended model not found. Run: ollama pull llama3.1:8b');
    } else {
      console.log('✅ Llama 3.1 8B model available');
    }

    // Test generation
    const response = await client.generate({
      model: 'llama3.1:8b',
      prompt: 'Say "Hello, local AI!"',
      options: { num_predict: 10 }
    });

    console.log('✅ Text generation working:', response.response.substring(0, 50));
    return true;
  } catch (error) {
    console.error('❌ Ollama test failed:', error);
    return false;
  }
}

async function testOllamaVision() {
  console.log('\n👁️  Testing Ollama Vision...');
  try {
    const vision = createOllamaVisionService();
    
    // Create a simple test image (1x1 pixel)
    const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    
    const analysis = await vision.analyzeImage(testImage, 'Describe this image');
    console.log('✅ Vision analysis working');
    return true;
  } catch (error) {
    console.error('❌ Vision test failed:', error);
    return false;
  }
}

async function testLocalStableDiffusion() {
  console.log('\n🎨 Testing Local Stable Diffusion...');
  try {
    const sd = createLocalStableDiffusionService({
      type: (process.env.SD_TYPE || "comfyui") as "comfyui" | "automatic1111" | "fooocus",
      baseUrl: process.env.SD_BASE_URL
    });

    const available = await sd.checkAvailability();
    if (!available) {
      console.log('⚠️  Local Stable Diffusion not available');
      console.log('   Install ComfyUI, Automatic1111, or Fooocus');
      return false;
    }

    console.log('✅ Local Stable Diffusion is running');
    return true;
  } catch (error) {
    console.error('❌ Local SD test failed:', error);
    return false;
  }
}

async function testSentenceTransformers() {
  console.log('\n🔤 Testing Sentence Transformers...');
  try {
    const st = createSentenceTransformersService();
    await st.initialize();
    
    const result = await st.generateEmbedding('test embedding');
    console.log('✅ Embeddings working, dimension:', result.dimension);
    return true;
  } catch (error) {
    console.error('❌ Sentence Transformers test failed:', error);
    console.log('   Install: npm install @xenova/transformers');
    return false;
  }
}

async function testModelManager() {
  console.log('\n📦 Testing Model Manager...');
  try {
    const manager = createModelManager();
    await manager.initialize();

    const models = await manager.listOllamaModels();
    console.log(`✅ Model manager working, found ${models.length} models`);
    return true;
  } catch (error) {
    console.error('❌ Model manager test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Local AI Models\n');
  console.log('=' .repeat(50));

  const results = {
    ollama: await testOllama(),
    vision: await testOllamaVision(),
    stableDiffusion: await testLocalStableDiffusion(),
    embeddings: await testSentenceTransformers(),
    modelManager: await testModelManager()
  };

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`Ollama: ${results.ollama ? '✅' : '❌'}`);
  console.log(`Vision: ${results.vision ? '✅' : '❌'}`);
  console.log(`Stable Diffusion: ${results.stableDiffusion ? '✅' : '❌'}`);
  console.log(`Embeddings: ${results.embeddings ? '✅' : '❌'}`);
  console.log(`Model Manager: ${results.modelManager ? '✅' : '❌'}`);

  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All local models are working!');
  } else {
    console.log('\n⚠️  Some models are not available. See setup instructions in LOCAL_MODELS_GUIDE.md');
  }
}

main().catch(console.error);









