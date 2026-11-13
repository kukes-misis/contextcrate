# Validation

Validated locally on macOS Apple Silicon with Node 24:

- 29 unit tests: context selection, export reassessment, secret patterns, budgets, import limits, ZIP traversal and decompression filtering.
- TypeScript and production Vite build passed.
- Production dependency audit reported zero known vulnerabilities at validation time.
- Safari: workbench renders, the full brief preview opens, explicit-consent local save succeeds, and the saved-pack view displays the result.
- Safari imported a synthetic ZIP with two text files and a `.env`; the secret file was blocked and export remained disabled until a task and files were selected.
- The browser-downloaded ZIP was opened independently: TASK.md and manifest.json were present, four selected files were included, and the blocked example file was absent.
- Responsive Safari preview at 390 × 844 rendered the mobile layout without horizontal overflow.
- GitHub Actions completed testing, building and Pages deployment successfully. Public HTML, JavaScript, CSS and favicon returned HTTP 200. The live Pages app was also verified in Safari over HTTPS.
- Independent agent source review found no high/medium blocker in the normal UI flow.

The OpenCode free provider returned HTTP 429 (`provider.free-limit`) during a review attempt. No paid fallback was used. Implementation and independent review were completed by the available Codex agents. OpenCode availability is not required to use this browser application.

Secret screening is heuristic. Token counts and business projections are estimates, not measured provider savings or earned revenue.
