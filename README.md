# ContextCrate

**Turn a repository into a focused brief for your coding agent.**

ContextCrate is a free, open-source browser tool for preparing bounded code handoffs. Import a folder or ZIP, describe a task, select useful files, and export a context pack for Codex, Claude, Gemini, or OpenCode. Your source files are processed in your browser; an AI account and API key are not required.

[Workbench](https://kukes-misis.github.io/contextcrate/) · [Report a bug](https://github.com/kukes-misis/contextcrate/issues/new?template=bug.yml) · [Request team setup](https://github.com/kukes-misis/contextcrate/issues/new?template=team-setup.yml)

## What it does

- Imports local source files from a folder or ZIP archive.
- Marks likely secret files, suspicious credentials, generated files, and unsupported binary content before export.
- Recommends a file selection from task keywords and an estimated token budget.
- Combines your goal, acceptance criteria, selected files, constraints, and expected result format into an agent handoff.
- Exports Markdown, a JSON manifest, or a ZIP pack.
- Lets you save packs on your own device and delete them later.

ContextCrate prepares context. It does not run agents, modify your repository, invoke a model, or guarantee the quality of a model's answer. Agent names describe export destinations, not integrations with those providers.

## Quick start

Use Node.js 20.19+ or 22.12+ with npm.

```sh
npm ci --ignore-scripts
npm run dev
```

Open the local URL printed by Vite. Try the included example before importing your own project. For a real task, choose only files you are authorized to share, enter a concrete goal and completion criteria, review the exported text, then give it to your agent.

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

The production static site is written to `dist/`. There is no backend, database, account system, inference bill, or runtime secret to configure.

## Privacy and limits

Imported source is handled locally by the application. It is not uploaded to an AI service or a ContextCrate server. The hosting provider still receives normal website requests and related connection metadata. Opening an external GitHub link takes you to GitHub under its privacy terms.

Saving a pack is an explicit local operation. Saved pack content may contain source code in browser storage on this browser profile; anyone with access to that profile may be able to read it. Use the saved-pack delete controls to remove entries. Clearing the site's browser data also removes saved entries. Downloaded files and clipboard copies must be managed separately.

Secret detection uses filename rules and pattern matching. It can miss secrets and can flag harmless test values. It is not a security audit or a substitute for reviewing an export. Never include `.env` files, credentials, private keys, personal data, or source you lack permission to share. A token count is an estimate rather than a provider tokenizer measurement; the receiving agent's instructions and history consume additional context.

The tool excludes unsupported content rather than promising to understand every repository. Large archives or individual files can be rejected to keep processing bounded. Do not treat a recommended selection as proof that all relevant dependencies have been included.

## Deploy on GitHub Pages

The project is designed as a static, free open-source utility. The repository's Pages workflow builds and deploys `dist/`. Enable GitHub Pages with **GitHub Actions** as the source, then push to `main` or run the deployment workflow. A project fork must update the Vite base path and public repository links for its own repository name.

GitHub Pages is not a host for a commercial SaaS, checkout, or an online business primarily facilitating sales. This site has no paywall or checkout. Any separately agreed implementation work is handled outside the free utility; a future hosted commercial product needs a suitable hosting arrangement. See [GitHub's Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Team setup and support

The free tool remains available under MIT. Teams can [request a scoped setup discussion](https://github.com/kukes-misis/contextcrate/issues/new?template=team-setup.yml) for repository-specific handoff templates and a documented review workflow. A public issue is an inquiry, not a purchase, support contract, or commitment to a delivery date. Never attach private source or credentials to an issue.

There is no active payment gateway, subscription billing, or customer revenue implied by this repository. The owner's commercial assumptions, delivery scope, and launch operations are in [the Russian operator guide](docs/README-BUSINESS.ru.md). Product research and limitations are in [research notes](docs/RESEARCH.md).

## Design and dependencies

The interface was developed using the [frontend-design skill from Anthropic's public skills repository](https://github.com/anthropics/skills/tree/main/skills/frontend-design) as design guidance. Attribution does not imply Anthropic endorsement. The skill's own licensing remains separate from this application's MIT license.

The app uses React, TypeScript, Vite, Lucide icons, and fflate. It is independent of OpenAI, Anthropic, Google, and OpenCode. Provider names belong to their respective owners.

## Contributing

Keep source processing local, preserve accessible keyboard interactions, and test packing and exclusion behavior when changing it. Keep commercial claims separate from observed results. Open a bug report with a synthetic reproduction, not a private repository or real credential.

## License

[MIT](LICENSE). No warranty; review generated packs before sharing them.
