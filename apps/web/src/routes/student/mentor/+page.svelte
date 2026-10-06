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
    Shield,
    HeartHandshake
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
      text: 'Hello Anaya! I am your Socratic Guide. I will never simply give away direct answers or do your homework for you, but I will help you break down tricky STEM, spatial, and mathematical problems step-by-step. What question or mission are you working through today?'
    }
  ]);

  let inputQuery = $state('');
  let isSending = $state(false);

  const samplePrompts = [
    'How do I balance an equation when variables are on both sides?',
    'Why do edge cubes on a 3×3×3 cube have exactly two painted faces?',
    'How does gear teeth ratio change rotational speed and torque?'
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
          text: 'Let us pause and look at what you already know: what is the single most critical variable given in your problem?'
        }
      ];
    } finally {
      isSending = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-(--border-subtle) pb-4">
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-(--accent-primary)" />
        <h1 class="text-xl font-bold text-(--text-primary)">Socratic AI Guide</h1>
      </div>
      <p class="text-xs text-(--text-secondary)">
        Thoughtful step-by-step problem decomposition • Child safety & zero answer dumping
      </p>
    </div>

    <div class="flex items-center gap-1.5 text-xs text-(--accent-success) font-medium px-2.5 py-1 rounded-full bg-(--accent-success-subtle)">
      <Shield class="w-3.5 h-3.5" />
      <span>DPDP Guarded</span>
    </div>
  </div>

  <!-- Chat History Window -->
  <div class="surface-card p-6 space-y-4 min-h-105 max-h-140 overflow-y-auto">
    {#each messages as msg}
      <div class="flex items-start gap-3 {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if msg.role === 'assistant'}
          <div class="w-8 h-8 rounded-full bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center shrink-0 border border-(--border-subtle)">
            <Bot class="w-4 h-4" />
          </div>
        {/if}

        <div class="space-y-2 max-w-[80%]">
          <div class="p-4 rounded-2xl text-sm leading-relaxed {msg.role === 'user' ? 'bg-(--accent-primary) text-white font-medium rounded-tr-none' : 'surface-card rounded-tl-none text-(--text-primary)'}">
            {msg.text}
          </div>

          {#if msg.observation}
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full badge-growth text-[11px] font-medium">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Evidence Captured: [{msg.observation.competency}] — {msg.observation.note}</span>
            </div>
          {/if}
        </div>

        {#if msg.role === 'user'}
          <div class="w-8 h-8 rounded-full bg-(--surface-sunken) border border-(--border-subtle) flex items-center justify-center text-(--text-primary) shrink-0 font-semibold text-xs">
            AV
          </div>
        {/if}
      </div>
    {/each}

    {#if isSending}
      <div class="flex items-center gap-2 text-xs text-(--accent-primary) pl-11">
        <div class="w-2 h-2 rounded-full bg-(--accent-primary) animate-pulse"></div>
        <span>Thinking about your question...</span>
      </div>
    {/if}
  </div>

  <!-- Prompt Starters -->
  <div class="space-y-2">
    <span class="text-xs text-(--text-muted) font-medium flex items-center gap-1.5">
      <Lightbulb class="w-3.5 h-3.5 text-(--accent-warning)" />
      <span>Suggested Reasoning Questions</span>
    </span>
    <div class="flex flex-wrap gap-2">
      {#each samplePrompts as prompt}
        <button
          type="button"
          onclick={() => handleSend(prompt)}
          class="px-3.5 py-1.5 rounded-lg surface-card text-xs text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-primary) transition-colors text-left cursor-pointer"
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
    class="flex items-center gap-2 p-2 rounded-xl surface-card"
  >
    <input
      type="text"
      bind:value={inputQuery}
      placeholder="Ask about a problem, concept, or project mission constraint..."
      class="flex-1 bg-transparent px-4 py-2.5 text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none"
    />
    <button
      type="submit"
      disabled={!inputQuery.trim() || isSending}
      class="px-5 py-2.5 rounded-lg bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
    >
      <span>Ask</span>
      <Send class="w-4 h-4" />
    </button>
  </form>
</div>
