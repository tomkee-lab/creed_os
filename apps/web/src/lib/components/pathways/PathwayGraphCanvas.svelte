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
          x: isCol1 ? 40 : 280,
          y: row * 110 + 60
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
          x: 560,
          y: pIndex * 180 + 70
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

      // Connect skill nodes to this pathway
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
              ? 'stroke: var(--mint); stroke-width: 2px;'
              : 'stroke: var(--yellow); stroke-width: 1.5px; stroke-dasharray: 4,4;'
            : 'stroke: var(--border-subtle); stroke-width: 1px;'
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

<div class="w-full h-135 rounded-none border border-border-subtle bg-background relative overflow-hidden">
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
      class="bg-surface-2! border! border-border-subtle! rounded-none! shadow-hairline! [&>button]:bg-surface-2! [&>button]:border-border-subtle! [&>button]:text-foreground! hover:[&>button]:bg-surface-3!"
    />
    <Background
      gap={20}
      size={1}
      patternColor="oklch(0.285 0.022 255 / 0.5)"
    />
    <MiniMap
      nodeColor={(n) => (n.type === 'pathwayNode' ? 'oklch(0.82 0.19 165)' : 'oklch(0.285 0.022 255)')}
      class="bg-surface-2! border! border-border-subtle! rounded-none! overflow-hidden"
    />
  </SvelteFlow>

  <!-- Legend Overlay -->
  <div class="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-none bg-surface-2/90 backdrop-blur-xs border border-border-subtle text-[11px] flex items-center gap-3">
    <div class="flex items-center gap-1.5 text-foreground-secondary">
      <span class="w-2 h-2 rounded-none bg-mint"></span>
      <span>Demonstrated Foundation</span>
    </div>
    <div class="flex items-center gap-1.5 text-foreground-secondary">
      <span class="w-2 h-2 rounded-none bg-yellow"></span>
      <span>In Progress</span>
    </div>
    <div class="flex items-center gap-1.5 text-foreground-secondary">
      <span class="w-2 h-2 rounded-none border border-mint"></span>
      <span>Target Milestone</span>
    </div>
  </div>
</div>

<style>
  /* stylelint-disable-next-line selector-class-pattern */
  :global(.carbon-flow-canvas .svelte-flow__edge-path) {
    transition: stroke var(--motion-micro) ease;
  }
</style>
