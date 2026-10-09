# AGENTS.md

Operating notes for AI coding agents (Claude Code, Codex, Cursor, Copilot and others) working in this repository. Everything here is derived from the files actually in the tree, so trust it over guesses, and update it when the facts change.

## What this repository is

Token launchpad UI template inspired by pump.fun - dark theme, bonding curves, trading panel, 4 pages, pure HTML/CSS/JS, no dependencies.

- Homepage: https://nirholas.github.io/solana-launchpad-ui/
- Source: https://github.com/nirholas/solana-launchpad-ui
- Primary language: HTML
- License: Other (see the LICENSE file)

## Repository layout

- `docs/`
- `README.md`
- `LICENSE`

## Setup

No package manifest is checked in. Follow the installation steps in `README.md`.

## Commands

No build, test or lint scripts are declared in the tree. Verify changes by running the project as `README.md` describes.

## Conventions

- Commit messages follow Conventional Commits (`type(scope): summary`), matching the existing history.
- Read the surrounding code before adding to it, and match its naming, file organisation and error-handling style.
- Keep `README.md` accurate: if a change alters behaviour, commands or configuration, update the docs in the same commit.
- Do not leave TODO comments, stub functions, placeholder data or commented-out code behind. Finish what you start or leave it out.
- Small, focused commits with a subject line that describes the change, not the act of committing.

## Where to raise things

- Bugs and feature requests: https://github.com/nirholas/solana-launchpad-ui/issues
- Questions and ideas: https://github.com/nirholas/solana-launchpad-ui/discussions
- Security issues: report privately at https://github.com/nirholas/solana-launchpad-ui/security/advisories/new, never in a public issue.
