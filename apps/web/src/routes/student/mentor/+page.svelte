<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Sparkles,
    Send,
    Bot,
    User,
    BrainCircuit,
    Lightbulb,
    CheckCircle2,
    Shield
  } from 'lucide-svelte';

  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    observation?: { competency: string; note: string };
  }

  let messages = $state<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'Hello Anaya! I am your Core_OS Socratic Mentor. I won’t give you direct answers or write out homework solutions, but I will help you break down tricky STEM, spatial, or reasoning problems step-by-step. What are you investigating today?'
    }
  ]);

  let inputQuery = $state('');
  let isSending = $state(false);

  const samplePrompts = [
    'How do I balance an equation with variables on both sides?',
    'Why do 12 unit cubes on a 3x3x3 painted cube have exactly two painted faces?',
    'How does gear teeth count affect rotation speed?'
  ];

  async function handleSend(textToSend?: string) {
    const text = textToSend || inputQuery;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text
    };

    messages = [...messages, userMsg];
    inputQuery = '';
    isSending = true;

    try {
      const res = await fetch('/api/v1/ai/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          history: messages.map((m) => ({ role: m.role, content: m.text }))
        })
      });

      if (!res.ok) throw new Error('Mentor API error');

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: data.reply,
        observation: data.observation
      };

      messages = [...messages, assistantMsg];
    } catch (err) {
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Let’s pause and look at what you already know: what is the single most critical variable given in your problem?'
        }
      ];
    } finally {
      isSending = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 rounded-xl glass-panel">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
        <Sparkles class="w-5 h-5" />
      </div>
      <div>
        <h1 class="text-base font-bold text-white leading-tight">Socratic AI Mentor</h1>
        <p class="text-[11px] text-slate-400 font-mono">Guiding Decomposition • Zero Answer Dumping • Evidence Extracting</p>
      </div>
    </div>

    <div class="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
      <Shield class="w-3.5 h-3.5 text-cyan-400" />
      <span>DPDP Safe Guardrails</span>
    </div>
  </div>

  <!-- Chat History Window -->
  <div class="p-6 rounded-xl glass-panel space-y-4 min-h-[420px] max-h-[580px] overflow-y-auto">
    {#each messages as msg}
      <div class="flex items-start gap-3 {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if msg.role === 'assistant'}
          <div class="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Bot class="w-4 h-4" />
          </div>
        {/if}

        <div class="space-y-2 max-w-[82%]">
          <div class="p-4 rounded-xl text-sm leading-relaxed {msg.role === 'user' ? 'bg-cyan-500 text-slate-950 font-medium' : 'bg-white/5 border border-white/8 text-slate-200'}">
            {msg.text}
          </div>

          {#if msg.observation}
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300">
              <CheckCircle2 class="w-3.5 h-3.5 text-purple-400" />
              <span>Evidence Captured: [{msg.observation.competency}] — {msg.observation.note}</span>
            </div>
          {/if}
        </div>

        {#if msg.role === 'user'}
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white shrink-0 font-bold text-xs">
            AV
          </div>
        {/if}
      </div>
    {/each}

    {#if isSending}
      <div class="flex items-center gap-2 text-xs font-mono text-cyan-400 pl-11">
        <div class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
        <span>Decomposing reasoning prompt...</span>
      </div>
    {/if}
  </div>

  <!-- Prompt Starters -->
  <div class="space-y-2">
    <span class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
      <Lightbulb class="w-3.5 h-3.5 text-amber-400" />
      <span>Suggested Reasoning Questions</span>
    </span>
    <div class="flex flex-wrap gap-2">
      {#each samplePrompts as prompt}
        <button
          type="button"
          onclick={() => handleSend(prompt)}
          class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-xs text-slate-300 hover:text-white transition-colors text-left"
        >
          {prompt}
        </button>
      {/each}
    </div>
  </div>

  <!-- Message Input Bar -->
  <form
    onsubmit={(e) => {
      e.preventDefault();
      handleSend();
    }}
    class="flex items-center gap-2 p-2 rounded-xl glass-panel-elevated"
  >
    <input
      type="text"
      bind:value={inputQuery}
      placeholder="Ask about a problem, concept, or project mission constraint..."
      class="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
    />
    <button
      type="submit"
      disabled={!inputQuery.trim() || isSending}
      class="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
    >
      <span>Ask</span>
      <Send class="w-4 h-4" />
    </button>
  </form>
</div>
