<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    MiniMap,
    type Node,
    type Edge,
    type NodeTypes,
    Position
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import PathwayNode from './PathwayNode.svelte';
  import SkillPrerequisiteNode from './SkillPrerequisiteNode.svelte';

  interface Props {
    pathways: any[];
    selectedPathwayId?: string;
    learner?: any;
    onselect?: (pathwayId: string) => void;
  }

  let {
    pathways = [],
    selectedPathwayId = 'PATH-ROBOTICS',
    learner,
    onselect
  }: Props = $props();

  const nodeTypes: NodeTypes = {
    pathwayNode: PathwayNode as any,
    skillNode: SkillPrerequisiteNode as any
  };

  // Build reactive graph nodes and edges
  let graphData = $derived.by(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const skillSet = new Map<string, { label: string; minimumLevel: number; demonstrated: number; delta: number }>();

    // First pass: aggregate all skills required across pathways
    pathways.forEach((pathway) => {
      (pathway.requirements || []).forEach((req: any) => {
        const demonstrated = learner?.competencies?.[req.competency]?.score ?? 2.5;
        const delta = Math.round((demonstrated - req.minimumLevel) * 10) / 10;
        const label = req.competency
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        if (!skillSet.has(req.competency)) {
          skillSet.set(req.competency, {
            label,
            minimumLevel: req.minimumLevel,
            demonstrated,
            delta
          });
        }
      });
    });

    // Place Skill nodes on the left & middle tiers
    const skillKeys = Array.from(skillSet.keys());
    skillKeys.forEach((key, index) => {
      const skill = skillSet.get(key)!;
      const isCol1 = index % 2 === 0;
      const row = Math.floor(index / 2);

      nodes.push({
        id: `skill-${key}`,
        type: 'skillNode',
        position: {
          x: isCol1 ? 30 : 310,
          y: row * 115 + 45
        },
        data: {
          ...skill,
          key
        }
      });
    });

    // Place Pathway nodes on the right tier
    pathways.forEach((pathway, pIndex) => {
      let metCount = 0;
      (pathway.requirements || []).forEach((req: any) => {
        const demonstrated = learner?.competencies?.[req.competency]?.score ?? 2.5;
        if (demonstrated >= req.minimumLevel) metCount++;
      });

      const isSelected = pathway.id === selectedPathwayId;

      nodes.push({
        id: pathway.id,
        type: 'pathwayNode',
        position: {
          x: 630,
          y: pIndex * 170 + 55
        },
        data: {
          id: pathway.id,
          title: pathway.title,
          field: pathway.field,
          metCount,
          totalCount: (pathway.requirements || []).length,
          selected: isSelected
        }
      });

      // Connect skill nodes to this pathway with high-contrast edges in both themes
      (pathway.requirements || []).forEach((req: any) => {
        const demonstrated = learner?.competencies?.[req.competency]?.score ?? 2.5;
        const isMet = demonstrated >= req.minimumLevel;

        edges.push({
          id: `edge-${req.competency}-${pathway.id}`,
          source: `skill-${req.competency}`,
          target: pathway.id,
          type: 'straight',
          animated: isSelected && isMet,
          style: isSelected
            ? isMet
              ? 'stroke: var(--mint); stroke-width: 2.5px;'
              : 'stroke: var(--attention); stroke-width: 2px; stroke-dasharray: 4,4;'
            : 'stroke: var(--border-strong); stroke-width: 1.25px; opacity: 0.75;'
        });
      });
    });

    return { nodes, edges };
  });

  function handleNodeClick({ node }: { node: Node }) {
    if (node.type === 'pathwayNode') {
      onselect?.(node.id);
    }
  }
</script>

<div class="w-full h-140 rounded-sm border border-border bg-surface dark:bg-canvas relative overflow-hidden shadow-xs">
  <SvelteFlow
    nodes={graphData.nodes}
    edges={graphData.edges}
    {nodeTypes}
    defaultEdgeOptions={{ type: 'straight' }}
    fitView
    minZoom={0.4}
    maxZoom={1.5}
    onnodeclick={handleNodeClick}
    class="carbon-flow-canvas"
  >
    <Controls
      class="bg-surface! border! border-border! rounded-sm! shadow-sm! [&>button]:bg-surface! [&>button]:border-border! [&>button]:text-ink! hover:[&>button]:bg-surface-raised!"
    />
    <Background
      gap={24}
      size={1.2}
    />
    <MiniMap
      nodeColor={(n) => (n.type === 'pathwayNode' ? 'var(--brand)' : 'var(--border-strong)')}
      class="bg-surface! border! border-border! rounded-sm! overflow-hidden shadow-xs"
    />
  </SvelteFlow>

  <!-- High-Contrast Legend Overlay -->
  <div class="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-sm bg-surface/95 dark:bg-surface-raised/95 backdrop-blur-xs border border-border text-[10px] font-mono flex items-center gap-4 text-ink select-none shadow-xs">
    <div class="flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-2xs bg-mint shadow-2xs"></span>
      <span class="font-medium">Demonstrated Foundation</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-2xs bg-attention shadow-2xs"></span>
      <span class="font-medium">In Progress</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-2xs border-2 border-brand bg-brand-subtle"></span>
      <span class="font-medium">Target Pathway</span>
    </div>
  </div>
</div>

<style>
  /* stylelint-disable-next-line selector-class-pattern */
  :global(.carbon-flow-canvas .svelte-flow__edge-path) {
    transition: stroke var(--duration-standard, 200ms) ease;
  }
</style>
