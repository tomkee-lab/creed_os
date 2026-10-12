/**
 * Scratch 3.0 (.sb3 / project.json) Importer for CREED OS
 * Unpacks .sb3 zip archives and translates Scratch AST block graphs
 * into native CREED OS Blockly workspace serialization.
 */

import JSZip from 'jszip';

export interface ScratchImportResult {
  success: boolean;
  workspace?: any;
  projectTitle?: string;
  blockCount?: number;
  sprites?: string[];
  error?: string;
}

export async function importScratchFile(fileOrBlob: Blob | File): Promise<ScratchImportResult> {
  try {
    // 1. Check if input is a plaintext JSON or native CREED project
    const fileName = (fileOrBlob as File).name?.toLowerCase() || '';
    if (fileName.endsWith('.json') || fileName.endsWith('.creed')) {
      const text = await fileOrBlob.text();
      const parsed = JSON.parse(text);
      if (parsed.blocklyWorkspace) {
        return {
          success: true,
          workspace: parsed.blocklyWorkspace,
          projectTitle: parsed.title || 'CREED Project',
          blockCount: Object.keys(parsed.blocklyWorkspace?.blocks?.blocks || {}).length || 1,
          sprites: ['Rover']
        };
      } else if (parsed.targets) {
        return convertScratchToBlockly(parsed);
      }
    }

    // 2. Otherwise treat as a .sb3 ZIP archive with Section 9 security bounds
    const zip = await JSZip.loadAsync(fileOrBlob);
    const fileEntries = Object.keys(zip.files);

    // Security Check: Maximum file count (prevent zip flood)
    if (fileEntries.length > 100) {
      return {
        success: false,
        error: `Security boundary violation: Archive exceeds maximum allowed file count (100 files, received ${fileEntries.length}).`
      };
    }

    // Security Check: Path traversal defense
    for (const path of fileEntries) {
      if (path.includes('../') || path.includes('..\\') || path.startsWith('/') || path.startsWith('\\')) {
        return {
          success: false,
          error: 'Security boundary violation: Malformed path traversal attempt detected in archive.'
        };
      }
    }

    const projectJsonFile = zip.file('project.json');
    if (!projectJsonFile) {
      // Check if it's a raw JSON file zipped
      const firstJson = fileEntries.find((f) => f.endsWith('.json'));
      if (firstJson) {
        const content = await zip.file(firstJson)!.async('string');
        const data = JSON.parse(content);
        if (data.blocklyWorkspace) {
          return {
            success: true,
            workspace: data.blocklyWorkspace,
            projectTitle: data.title || 'Imported Project',
            blockCount: Object.keys(data.blocklyWorkspace?.blocks?.blocks || {}).length || 1
          };
        }
        return convertScratchToBlockly(data);
      }
      return {
        success: false,
        error: 'Invalid .sb3 archive: project.json not found inside package.'
      };
    }

    const projectContent = await projectJsonFile.async('string');
    if (projectContent.length > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'Security boundary violation: project.json exceeds maximum allowed size (10 MB).'
      };
    }

    const projectData = JSON.parse(projectContent);
    return convertScratchToBlockly(projectData);
  } catch (err: any) {
    // Fallback: If zip decompression failed, try parsing as plaintext JSON
    try {
      const text = await fileOrBlob.text();
      const parsed = JSON.parse(text);
      if (parsed.blocklyWorkspace) {
        return {
          success: true,
          workspace: parsed.blocklyWorkspace,
          projectTitle: parsed.title || 'CREED Project',
          blockCount: Object.keys(parsed.blocklyWorkspace?.blocks?.blocks || {}).length || 1,
          sprites: ['Rover']
        };
      }
    } catch {}

    return {
      success: false,
      error: `Failed to decompress or parse project archive: ${err?.message || err}`
    };
  }
}

export function convertScratchToBlockly(projectData: any): ScratchImportResult {
  const targets = projectData?.targets || [];
  if (targets.length === 0) {
    return {
      success: false,
      error: 'No target actors found in Scratch project.'
    };
  }

  // Find primary sprite actor (or stage)
  const primaryTarget = targets.find((t: any) => !t.isStage) || targets[0];
  const blocksMap = primaryTarget?.blocks || {};
  const blockIds = Object.keys(blocksMap);

  if (blockIds.length === 0) {
    return {
      success: false,
      error: 'No code blocks found in Scratch project.'
    };
  }

  // Find top-level hat blocks (parent === null or topLevel === true)
  const topLevelBlockIds = blockIds.filter((id) => {
    const b = blocksMap[id];
    return b && (b.topLevel || !b.parent);
  });

  const convertedBlocks: any[] = [];
  let convertedCount = 0;

  for (const rootId of topLevelBlockIds) {
    const chain = buildBlockChain(rootId, blocksMap);
    if (chain) {
      convertedBlocks.push(chain);
      convertedCount++;
    }
  }

  // Fallback: If no top-level hat blocks found, convert any sequence
  if (convertedBlocks.length === 0 && blockIds.length > 0) {
    const firstId = blockIds[0];
    const chain = buildBlockChain(firstId, blocksMap);
    if (chain) convertedBlocks.push(chain);
  }

  const workspaceJson = {
    blocks: {
      languageVersion: 0,
      blocks: convertedBlocks
    }
  };

  const spriteNames = targets.filter((t: any) => !t.isStage).map((t: any) => t.name || 'Sprite');

  return {
    success: true,
    workspace: workspaceJson,
    projectTitle: primaryTarget?.name || 'Imported Scratch Mission',
    blockCount: blockIds.length,
    sprites: spriteNames
  };
}

function buildBlockChain(blockId: string, blocksMap: Record<string, any>): any | null {
  const raw = blocksMap[blockId];
  if (!raw || typeof raw !== 'object') return null;

  const creedBlock = translateScratchOpcode(raw);
  if (!creedBlock) return null;

  creedBlock.id = blockId;
  if (raw.topLevel) {
    creedBlock.x = Math.max(30, Math.min(600, raw.x || 60));
    creedBlock.y = Math.max(30, Math.min(600, raw.y || 50));
  }

  // Recurse down linear statement chain
  if (raw.next && blocksMap[raw.next]) {
    const nextBlock = buildBlockChain(raw.next, blocksMap);
    if (nextBlock) {
      creedBlock.next = {
        block: nextBlock
      };
    }
  }

  return creedBlock;
}

function translateScratchOpcode(scratchBlock: any): any | null {
  const opcode = scratchBlock.opcode || '';

  switch (opcode) {
    case 'event_whenflagclicked':
      return {
        type: 'event_when_flag'
      };

    case 'event_whenbroadcastreceived':
      return {
        type: 'event_when_broadcast_received',
        fields: {
          MESSAGE: scratchBlock.fields?.BROADCAST_OPTION?.[0] || 'alert'
        }
      };

    case 'event_broadcast':
      return {
        type: 'event_broadcast',
        fields: {
          MESSAGE: scratchBlock.fields?.BROADCAST_OPTION?.[0] || 'alert'
        }
      };

    case 'event_broadcastandwait':
      return {
        type: 'event_broadcast_and_wait',
        fields: {
          MESSAGE: scratchBlock.fields?.BROADCAST_OPTION?.[0] || 'alert'
        }
      };

    case 'motion_movesteps':
      return {
        type: 'robot_drive',
        fields: {
          DIRECTION: 'FORWARD',
          SPEED: 75,
          DURATION: 1.0
        }
      };

    case 'motion_turnright':
      return {
        type: 'robot_turn',
        fields: {
          DIRECTION: 'RIGHT',
          ANGLE: 90
        }
      };

    case 'motion_turnleft':
      return {
        type: 'robot_turn',
        fields: {
          DIRECTION: 'LEFT',
          ANGLE: 90
        }
      };

    case 'control_wait':
      return {
        type: 'robot_sleep',
        fields: {
          SECONDS: 1.0
        }
      };

    case 'control_repeat':
      return {
        type: 'controls_repeat_ext',
        inputs: {
          TIMES: {
            shadow: {
              type: 'math_number',
              fields: { NUM: 10 }
            }
          }
        }
      };

    case 'control_forever':
      return {
        type: 'controls_whileUntil',
        fields: { MODE: 'WHILE' },
        inputs: {
          BOOL: {
            shadow: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } }
          }
        }
      };

    case 'looks_say':
    case 'looks_sayforsecs':
      return {
        type: 'microbit_display_scroll',
        fields: {
          TEXT: scratchBlock.inputs?.MESSAGE?.[1]?.[1] || 'Hello from Scratch!'
        }
      };

    case 'looks_switchcostumeto':
      return {
        type: 'robot_express_emotion',
        fields: {
          EMOTION: 'HAPPY'
        }
      };

    case 'looks_nextcostume':
      return {
        type: 'robot_express_emotion',
        fields: {
          EMOTION: 'SURPRISED'
        }
      };

    case 'motion_pointtowards':
      return {
        type: 'mech_aim_target',
        fields: {
          TARGET: 'CURSOR'
        }
      };

    case 'sound_play':
    case 'sound_playuntildone':
      return {
        type: 'sound_play_tone',
        fields: {
          FREQ: 440,
          DURATION: 300
        }
      };

    case 'pen_penDown':
      return {
        type: 'pen_down'
      };

    case 'pen_penUp':
      return {
        type: 'pen_up'
      };

    case 'pen_clear':
      return {
        type: 'pen_clear'
      };

    case 'pen_setPenColorToColor':
      return {
        type: 'pen_set_color',
        fields: {
          COLOR: '#06b6d4'
        }
      };

    default:
      // Graceful fallback for non-mapped Scratch opcodes to keep flow connected
      return {
        type: 'robot_sleep',
        fields: {
          SECONDS: 0.2
        }
      };
  }
}
