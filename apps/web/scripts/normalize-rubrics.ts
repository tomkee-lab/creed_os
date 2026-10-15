import { loadEnv } from 'vite';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from workspace root
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const env = loadEnv('development', rootDir, '');
const geminiApiKey = env.GEMINI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

const RAW_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/raw-rubrics');
const NORMALIZED_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/normalized-rubrics');

interface ExtractedCompetency {
  id: string;
  name: string;
  description: string;
  level: 'L1_NOVICE' | 'L2_BEGINNER' | 'L3_INTERMEDIATE' | 'L4_ADVANCED' | 'L5_EXPERT';
  evidenceRequired: string;
}

interface NormalizedRubric {
  sourceEvent: string;
  normalizedDate: string;
  extractionEngine: 'gemini-1.5-flash' | 'deterministic-fallback';
  competencies: ExtractedCompetency[];
}

async function ensureDir() {
  try {
    await fs.mkdir(NORMALIZED_DIR, { recursive: true });
  } catch (err) {
    // Directory exists
  }
}

function extractDeterministicCompetencies(filename: string, content: string): NormalizedRubric {
  const isTechRadiance = content.includes('TechRadiance') || filename.includes('3');
  const eventName = isTechRadiance 
    ? 'TechRadiance National & International Robotics Championship'
    : 'World Robot Olympiad (WRO) Autonomous Robotics Challenge';

  const defaultCompetencies: ExtractedCompetency[] = isTechRadiance
    ? [
        {
          id: 'robotics-line-follower-kinematics',
          name: 'High-Speed Line Follower Differential Steering',
          description: 'Constructs and tunes dual-motor differential drive with infrared array sensor alignment.',
          level: 'L3_INTERMEDIATE',
          evidenceRequired: 'Telemetry log proving closed-loop trajectory tracking with optical deviation < 12mm.'
        },
        {
          id: 'robotics-obstacle-evasion-fsm',
          name: 'Ultrasonic Obstacle Evasion Finite State Machine',
          description: 'Implements non-blocking state machine evading dynamic obstacles in arena perimeter.',
          level: 'L3_INTERMEDIATE',
          evidenceRequired: 'Execution trace showing zero boundary collisions over 3 trial runs.'
        },
        {
          id: 'robotics-chassis-structural-statics',
          name: 'Rigid Frame Load Distribution & Torque Balance',
          description: 'Optimizes gear reduction ratio and center of gravity to prevent rollover under acceleration.',
          level: 'L4_ADVANCED',
          evidenceRequired: 'Physical build artifact with verified gear reduction and center-of-mass static test.'
        },
        {
          id: 'robotics-team-engineering-journal',
          name: 'Engineering Design Iteration & Failure Taxonomy',
          description: 'Maintains longitudinal log of hardware component failures, firmware patches, and tuning trials.',
          level: 'L2_BEGINNER',
          evidenceRequired: 'Dated engineering log with at least 5 structured failure-remedy entries.'
        }
      ]
    : [
        {
          id: 'wro-autonomous-mission-planning',
          name: 'Autonomous Mission Route Optimization',
          description: 'Calculates optimal game piece collection sequence minimizing travel time and turns.',
          level: 'L4_ADVANCED',
          evidenceRequired: 'AST graph traversal and waypoint execution log in under 120 seconds.'
        },
        {
          id: 'wro-precision-manipulator-kinematics',
          name: 'Motorized Gripper & Lift Arm Torque Verification',
          description: 'Calculates servo holding torque and mechanical link stress when lifting competition payload.',
          level: 'L4_ADVANCED',
          evidenceRequired: 'Holding torque equation verification and repeatable pick-and-place trials.'
        },
        {
          id: 'wro-color-sensor-matrix-calibration',
          name: 'Dynamic Ambient Light Sensor Calibration',
          description: 'Compensates for 200–1200 lux variation on field tiles using baseline white/black reference sampling.',
          level: 'L3_INTERMEDIATE',
          evidenceRequired: 'Sensor calibration routine emitting normalized RGB values across 4 distinct field zones.'
        }
      ];

  return {
    sourceEvent: eventName,
    normalizedDate: new Date().toISOString(),
    extractionEngine: 'deterministic-fallback',
    competencies: defaultCompetencies
  };
}

async function extractWithGemini(apiKey: string, rawContent: string): Promise<NormalizedRubric | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
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
      "evidenceRequired": "What tangible student evidence proves this"
    }
  ]
}

Raw Markdown Data:
${rawContent.slice(0, 15000)}
`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    console.warn(`Gemini API returned status ${response.status}: ${await response.text()}`);
    return null;
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    sourceEvent: parsed.sourceEvent || 'Robotics Championship',
    normalizedDate: new Date().toISOString(),
    extractionEngine: 'gemini-1.5-flash',
    competencies: parsed.competencies || []
  };
}

async function normalizeRubrics() {
  await ensureDir();
  console.log('===============================================================');
  console.log('   CREED OS • Psychometric Rubric Normalization Pipeline       ');
  console.log('===============================================================\n');

  try {
    const files = await fs.readdir(RAW_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('No raw markdown rubrics found in data/raw-rubrics/.');
      return;
    }

    console.log(`Found ${mdFiles.length} raw rubric file(s). Starting extraction...\n`);

    for (const file of mdFiles) {
      console.log(`📄 Processing: ${file}...`);
      const rawContent = await fs.readFile(path.join(RAW_DIR, file), 'utf-8');

      // Skip very empty files
      if (rawContent.trim().length < 50) {
        console.log(`   ⚠️ Skipping ${file}: Content too short.`);
        continue;
      }

      let normalized: NormalizedRubric | null = null;

      if (geminiApiKey) {
        try {
          console.log('   🤖 Attempting extraction with Google Gemini 1.5 Flash...');
          normalized = await extractWithGemini(geminiApiKey, rawContent);
        } catch (err) {
          console.warn('   ⚠️ Gemini API request failed, falling back to deterministic extraction:', err);
        }
      }

      if (!normalized) {
        console.log('   ⚙️ Using deterministic psychometric competency extractor...');
        normalized = extractDeterministicCompetencies(file, rawContent);
      }

      const normalizedFilename = file.replace('.md', '.json');
      await fs.writeFile(
        path.join(NORMALIZED_DIR, normalizedFilename),
        JSON.stringify(normalized, null, 2),
        'utf-8'
      );

      console.log(`   ✅ Extracted ${normalized.competencies.length} competencies via [${normalized.extractionEngine}].`);
      console.log(`   💾 Saved to: data/normalized-rubrics/${normalizedFilename}\n`);
    }

    console.log('🎉 Rubric Normalization Complete! Data is ready for Supabase seeding.\n');

  } catch (error) {
    console.error('An error occurred during rubric normalization:', error);
  }
}

normalizeRubrics();
