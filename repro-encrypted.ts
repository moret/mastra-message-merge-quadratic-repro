import { MessageList } from '@mastra/core/agent';

// Same as repro.ts, with parts shaped like real OpenAI Responses reasoning items:
// about 1KB of encrypted content each.
const message = (parts: any[]) => ({
  id: 'assistant-1',
  role: 'assistant' as const,
  createdAt: new Date(),
  content: { format: 2 as const, parts },
});

for (const n of [1000, 2000]) {
  const reasoning = Array.from({ length: n }, (_, i) => ({
    type: 'reasoning',
    reasoning: '',
    details: [],
    providerMetadata: { openai: { itemId: `rs_${i}`, reasoningEncryptedContent: 'x'.repeat(1000) + i } },
  }));
  const list = new MessageList();
  list.add(message([{ type: 'step-start' }]), 'response');
  const started = performance.now();
  list.add(message([{ type: 'step-start' }, ...reasoning]), 'response');
  console.log(`${n} parts: ${Math.round(performance.now() - started)}ms`);
}
