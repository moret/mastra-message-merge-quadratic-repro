# MessageList merge is quadratic in the part count

Minimal reproduction for a `@mastra/core` bug: merging an assistant message with many parts is O(n²) and blocks the event loop.

## Expected vs actual

**Expected:** `MessageList.add` merges an incoming assistant message in time roughly linear in its number of parts.

**Actual:** `MessageMerger.pushNewPart` rebuilds the cache key of every part of both messages for each part it inserts, so the merge is quadratic. Doubling the parts quadruples the time. All of it is synchronous, so the event loop is blocked for the whole merge.

## Steps

Requires Node 22.

```bash
npm install
npm run repro            # reasoning parts with an itemId only
npm run repro:encrypted  # reasoning parts with ~1KB of encrypted content, like OpenAI Responses items
```

`npm run repro` triggers the bug: it times the second `list.add(...)` for 1,000, 2,000 and 4,000 reasoning parts.

## Output

Apple M4 Pro, macOS 26.6.2, Node 22.23.2, npm 10.9.8, `@mastra/core@1.78.0`:

```text
$ npm run repro
1000 parts: 1357ms
2000 parts: 5453ms
4000 parts: 22239ms

$ npm run repro:encrypted
1000 parts: 9908ms
2000 parts: 39645ms
```

On `@mastra/core@1.76.0`, the same scripts give 7.3s for 4,000 parts (`repro`) and 1.8s for 2,000 parts (`repro:encrypted`).

## Environment

```text
  System:
    OS: macOS 26.6.2
    CPU: (12) arm64 Apple M4 Pro
    Memory: 470.63 MB / 24.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 22.23.2 - ~/.asdf/installs/nodejs/22.23.2/bin/node
    npm: 10.9.8 - ~/.asdf/plugins/nodejs/shims/npm
    pnpm: 8.10.2 - ~/.asdf/shims/pnpm
  npmPackages:
    @mastra/core: 1.78.0 => 1.78.0
    tsx: 4.23.15 => 4.23.15
    zod: 4.6.7 => 4.6.7
```
