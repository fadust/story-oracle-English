# Story Oracle — English

Discuss the current story in a separate window, plan story arcs, inspect or edit lorebooks, repair replies and MVU variables, and create characters in the Character Workshop. Edits retain the existing preview, apply, and undo workflows.

An English adaptation of [namelessone88/story-oracle](https://github.com/namelessone88/story-oracle). Original authors and public interfaces remain credited and compatible.

## Install

In SillyTavern, open **Extensions → Install extension** and enter:

```text
https://github.com/fadust/story-oracle-English
```

Reload SillyTavern. Keep one copy of this extension enabled: the English fork uses the same settings and chat-data keys as upstream. Back up settings and chats before replacing an existing installation. A ZIP installation should be extracted into one folder under `public/scripts/extensions/third-party/`; built runtime files are already included.

## First use

Open the wand menu → Story Oracle → More → Settings. Under Connection, select Direct (custom URL), enter https://nano-gpt.com/api/v1, your NanoGPT key, and a model available to your account. If the browser reports a CORS error, enable Send through SillyTavern. A SillyTavern connection profile is also supported.

Generated descriptions, summaries, explanations, and actions are requested in English. Proper names, quoted evidence, JSON keys, macros, IDs, and saved structures stay unchanged. Existing custom prompts remain yours; exact built-in prompts are migrated only where a matching legacy value can be identified safely.

## Development and verification

```sh
npm ci
npm test
```

See [the full feature guide](GUIDE.md), [localization notes](LOCALIZATION.md), and [original Chinese documentation](README.zh-CN.md).
