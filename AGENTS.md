# AGENTS.md

Operating notes for AI coding agents (Claude Code, Codex, Cursor, Copilot and others) working in this repository. Everything here is derived from the files actually in the tree, so trust it over guesses, and update it when the facts change.

## What this repository is

Token launchpad UI template inspired by pump.fun: dark theme, bonding curves, trading panel, 4 pages, pure HTML/CSS/ES modules, no dependencies. Everything shown is mock data; nothing connects to a wallet or a blockchain, and the pages say so.

- Homepage: https://nirholas.github.io/solana-launchpad-ui/
- Source: https://github.com/nirholas/solana-launchpad-ui
- Primary language: HTML
- License: Other (see the LICENSE file)

## Repository layout

- `index.html`, `create.html`, `token.html`, `profile.html`: the four pages
- `styles.css`: all styles, theme tokens in `:root`
- `app.js`: page behaviour as an ES module, dispatched on `<body data-page>`
- `curve.js`: bonding-curve math (BigInt base units)
- `trade-quote.js`: trade-panel quote text
- `format.js`: decimal parsing and number formatting
- `mock-data.js`: mock tokens, the featured token and `MOCK_SOL_USD`
- `test/`: `node:test` suites
- `docs/`: documentation site (`index.html`, `docs.css`, `docs.js`) and guides
- `vercel.json`: security headers, including the Content-Security-Policy
- `.github/workflows/ci.yml`: runs the checks below

## Setup

`package.json` only declares ES modules and scripts; there are no dependencies to install and no build step. Serve the folder over HTTP (`npx serve .`), because browsers do not load ES modules from `file://`.

## Commands

- `npm run check`: `node --check` on every script.
- `npm test`: curve math, formatting, quotes, page structure, CSP and contrast tests.

Both must pass before committing; CI runs them on Node 20, 22 and 24.

## Conventions

- Commit messages follow Conventional Commits (`type(scope): summary`), matching the existing history.
- Read the surrounding code before adding to it, and match its naming, file organisation and error-handling style.
- No inline `<script>`, `on*=` handlers, `<style>` blocks or `style` attributes in the pages; the CSP in `vercel.json` blocks them. Put behaviour in `app.js` and styles in `styles.css`.
- Build DOM with `createElement` and text nodes, never `innerHTML` or other HTML-string APIs.
- Keep the demo notice and the "mock data" wording; do not present invented figures as live.
- Interactive elements are real `<button>`, `<a>` or form controls with accessible names. Keep text colours at WCAG AA contrast (a test checks the tokens).
- If you change `FEATURED` or `MOCK_SOL_USD`, update the figures `test/figures.test.js` points at.
- Keep `README.md` accurate: if a change alters behaviour, commands or configuration, update the docs in the same commit.
- Do not leave TODO comments, stub functions, placeholder data or commented-out code behind. Finish what you start or leave it out.
- Small, focused commits with a subject line that describes the change, not the act of committing.

## Where to raise things

- Bugs and feature requests: https://github.com/nirholas/solana-launchpad-ui/issues
- Questions and ideas: https://github.com/nirholas/solana-launchpad-ui/discussions
- Security issues: report privately at https://github.com/nirholas/solana-launchpad-ui/security/advisories/new, never in a public issue.
