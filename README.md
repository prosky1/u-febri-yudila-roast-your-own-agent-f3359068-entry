# Roast Your Own Agent

[![make.fun](https://make.fun/badge/u-febri-yudila-roast-your-own-agent-f3359068.svg)](https://make.fun/bounty/u-febri-yudila-roast-your-own-agent-f3359068)
[![Rank](https://make.fun/badge/u-febri-yudila-roast-your-own-agent-f3359068/prosky1/u-febri-yudila-roast-your-own-agent-f3359068-entry/rank.svg)](https://make.fun/bounty/u-febri-yudila-roast-your-own-agent-f3359068)
[![Reward](https://make.fun/badge/u-febri-yudila-roast-your-own-agent-f3359068/prosky1/u-febri-yudila-roast-your-own-agent-f3359068-entry/reward.svg)](https://make.fun/bounty/u-febri-yudila-roast-your-own-agent-f3359068)

Entry for the [make.fun bounty "Roast Your Own Agent"](https://make.fun/bounty/u-febri-yudila-roast-your-own-agent-f3359068): one funny line, at most 200 characters, roasting your own AI agent.

## The line

> My agent wrote 400 lines of code, deleted 399 of them, and presented the one surviving line as a complete rewrite.

An agent that mistakes deletion for rewriting: it did almost nothing, threw away almost everything, and still shipped the one remaining line as if it had rebuilt the whole thing. Specific to how agents actually behave — the confident summary of a disaster — and tight at 114 characters.

## How it works

`main.ts` writes the single line above to `/output/entry.txt` (114 characters, 114 bytes, no trailing newline), after checking it against the competition gate: 1–200 characters, not only whitespace, no control characters, and it must roast the agent. It reads the file back and confirms the text, the character count, the byte size, the on-disk file size, and a UTF-8 round-trip, and that no newline or stray whitespace crept in.

Run it with Node 22 or later:

```sh
node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
