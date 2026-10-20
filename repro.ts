import { MessageList } from '@mastra/core/agent';

const message = (parts: any[]) => ({
  id: 'assistant-1',
  role: 'assistant' as const,
  createdAt: new Date(),
  content: { format: 2 as const, parts },
});

for (const n of [1000, 2000, 4000]) {
  const reasoning = Array.from({ length: n }, (_, i) => ({
    type: 'reasoning',
    reasoning: '',
    details: [],
    providerMetadata: { openai: { itemId: `rs_${i}` } },
  }));
  const list = new MessageList();
  list.add(message([{ type: 'step-start' }]), 'response');
  const started = performance.now();
  list.add(message([{ type: 'step-start' }, ...reasoning]), 'response');
  console.log(`${n} parts: ${Math.round(performance.now() - started)}ms`);
}
