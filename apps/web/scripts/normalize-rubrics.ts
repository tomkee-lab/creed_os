import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Configure the NVIDIA AI proxy via standard OpenAI provider configuration
const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: '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',
  compatibility: 'compatible'
});

const RAW_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/raw-rubrics');
const NORMALIZED_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/normalized-rubrics');

async function ensureDir() {
  try {
    await fs.mkdir(NORMALIZED_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory exists
  }
}

async function normalizeRubrics() {
  await ensureDir();
  console.log('🚀 Starting LLM Data Normalization with NVIDIA Mistral Large 3...');

  try {
    const files = await fs.readdir(RAW_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('No raw markdown rubrics found. Run the ingestion script first.');
      return;
    }

    for (const file of mdFiles) {
      console.log(`\n📄 Processing: ${file}...`);
      const rawContent = await fs.readFile(path.join(RAW_DIR, file), 'utf-8');

      // Skip very empty files
      if (rawContent.trim().length < 50) {
         console.log(`⚠️ Skipping ${file}: Content too short.`);
         continue;
      }

      const { text } = await generateText({
        model: nvidia.chat('meta/llama-3.2-90b-vision-instruct'),
        prompt: `
          You are an expert psychometrician and robotics curriculum designer for CREED OS.
          I am providing you with raw scraped markdown from a robotics competition rulebook/rubric.
          Extract all the distinct hardware, coding, and logical competencies a student must demonstrate to succeed in this event.
          
          You MUST reply ONLY with a valid JSON object of this exact structure (no markdown fences, no other text):
          {
            "sourceEvent": "Name of competition",
            "competencies": [
              {
                "id": "slugified-unique-id",
                "name": "Human-readable name",
                "description": "Detailed description",
                "level": "L1_NOVICE | L2_BEGINNER | L3_INTERMEDIATE | L4_ADVANCED | L5_EXPERT",
                "evidenceRequired": "What evidence proves this"
              }
            ]
          }
          
          Raw Markdown Data:
          ${rawContent.slice(0, 30000)}
        `,
      });

      const parsedJSON = JSON.parse(text.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim());

      const normalizedFilename = file.replace('.md', '.json');
      await fs.writeFile(
        path.join(NORMALIZED_DIR, normalizedFilename),
        JSON.stringify(parsedJSON, null, 2),
        'utf-8'
      );
      
      console.log(`✅ Extracted ${parsedJSON.competencies.length} competencies.`);
      console.log(`💾 Saved to: ${normalizedFilename}`);
    }

    console.log('\n🎉 Normalization Complete! Data is ready for Supabase seeding.');

  } catch (error) {
    console.error('An error occurred during LLM extraction:', error);
  }
}

normalizeRubrics();
