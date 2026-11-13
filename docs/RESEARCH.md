# ContextCrate: product evidence and boundaries

Research reviewed on 12 November 2026. This document separates observed evidence from product and business hypotheses. It is not proof of willingness to pay.

## Why build a context handoff tool

The [2026 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2026/ai) reports broad use of coding assistants and agents, with many users working with them daily. Respondents also emphasize validating output and using AI on work they understand. These observations support testing a tool that makes task context reviewable. They do not establish that developers will buy ContextCrate.

The same survey reports that output quality is a more common reason for switching AI tools than lower cost. ContextCrate therefore focuses its proposition on relevant files, explicit completion criteria, and understandable handoffs. A lower estimated context size is useful feedback, but cannot honestly be advertised as measured token savings or better coding accuracy without an experiment.

## Existing alternatives

[Repomix](https://github.com/yamadashy/repomix) already packages repositories into AI-friendly files and has a developed ecosystem. Its existence confirms a mature category and a strong free alternative, not an uncontested market. Other substitutes include selecting files manually, a team's existing agent instructions, and the context features of coding tools themselves.

ContextCrate's testable positioning is a browser-first, task-scoped workflow: inspect what is excluded, select a bounded set of files, write acceptance criteria, and download a portable handoff. It should not claim to replace Repomix's broader capabilities. A credible customer conversation starts with a team's current process and why it is insufficient.

## Delivery constraints

[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) exclude using Pages primarily for running an online business, commercial transactions, or commercial SaaS. The proposed Pages deployment is a free open-source utility, with no checkout or account-based paid feature. A separately sold implementation service is not evidence that GitHub has approved a particular deployment; keep the public utility's primary purpose intact and reassess hosting before adding commerce.

A browser-only app avoids a source-upload backend and provider API credentials. It does not remove all privacy considerations: the host sees ordinary HTTP requests, local browser storage can retain explicitly saved packs, exports can contain sensitive code, and users decide where to share a downloaded pack. Filename and regex detection cannot guarantee the absence of secrets.

## Design source

The design guidance comes from [Anthropic's frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design). It encourages deliberate typography, layout, content, and accessible responsive behavior. Attribution records a design reference; it does not imply model-provider integration or endorsement.

## What remains unproven

- No sales, revenue, conversion rate, retention, or customer testimonial has been established.
- Token figures are heuristic estimates, not counts from a provider tokenizer or observed subscription consumption.
- The effectiveness of file recommendations needs real task comparisons with human-reviewed outcomes.
- Team maintenance pricing needs customer interviews and paid trials.
- Payment acceptance, merchant onboarding, tax handling, support capacity, and any future commercial hosting are owner operations; a static repository cannot provision them by itself.

## Small validation study

Use ten representative coding tasks with permissioned or synthetic repositories. Compare each team's current brief with a ContextCrate brief using the same agent model and settings. Record included context, missing dependencies, time to first acceptable patch, review defects, and the reviewer's explanation of failures. Keep measured values distinct from estimated tokens and avoid selecting only successful examples. Ask whether a team would pay for maintaining its workflow before quoting a recurring contract.
