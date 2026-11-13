# Validation

Validated locally on macOS Apple Silicon with Node 24:

- 29 unit tests: context selection, export reassessment, secret patterns, budgets, import limits, ZIP traversal and decompression filtering.
- TypeScript and production Vite build passed.
- Production dependency audit reported zero known vulnerabilities at validation time.
- Safari: workbench renders, the full brief preview opens, explicit-consent local save succeeds, and the saved-pack view displays the result.
- Independent agent source review found no high/medium blocker in the normal UI flow.

The OpenCode free provider returned HTTP 429 (`provider.free-limit`) during a review attempt. No paid fallback was used. Implementation and independent review were completed by the available Codex agents. OpenCode availability is not required to use this browser application.

Secret screening is heuristic. Token counts and business projections are estimates, not measured provider savings or earned revenue.
