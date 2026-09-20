# Patient Assessment — OPQRST-AA

A guided, one-question-at-a-time patient assessment tool built around the
**OPQRST-AA** framework:

- **O**nset
- **P**rovocation / Palliation
- **Q**uality
- **R**egion / Radiation
- **S**everity
- **T**ime
- **A**ssociated symptoms
- **A**ggravating / Alleviating factors

Built with Vite, React, and TypeScript, per the project brief. This is a
**frontend-only** draft — there is no backend or persistent storage yet.
Everything a user enters (including photos) stays in the browser and is
lost on a hard refresh unless it's still in the browser's local storage
draft, which is a convenience, not real data storage.

## Design idea

Instead of a generic "Step 3 of 8" progress bar, the navigation trail at
the top of the screen *is* the mnemonic itself — the letters O P Q R S T A A
light up as you move through the assessment, so the framework you're using
is always visible.

## What's implemented

- The full OPQRST-AA question flow, one question per screen
- A "Listen" button on every question that reads it aloud using the
  browser's built-in text-to-speech (no AI model, no backend — this is the
  free `speechSynthesis` API already in every modern browser)
- Photo upload on the Region/Radiation step, with local preview
- A summary screen at the end showing everything that was entered, with
  per-question "Edit" links and a print-to-PDF button
- Answers are saved to `localStorage` as a draft so a refresh doesn't wipe
  an in-progress assessment
- Support for English, French, and Kinyarwanda as a language selector
  (note: actual spoken Kinyarwanda depends on whether the user's device has
  a Kinyarwanda voice installed — most don't yet, so it will fall back to a
  default voice)

## Ideas not yet built (backend-dependent)

Per the brief, these need a backend and are left for a later pass:

- Actually translating text between languages (e.g. with Meta's NLLB/MMS
  models)
- AI-generated suggestions or image analysis (e.g. a multimodal model
  behind a vLLM server)
- Persisting assessments anywhere beyond the current browser tab

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

To type-check and produce a production build:

```bash
npm run build
```

## Project structure

```
src/
  data/opqrstaa.ts       the question sequence and answer options
  types/assessment.ts    shared TypeScript types
  hooks/useSpeech.ts      wraps the browser's text-to-speech API
  hooks/useLocalDraft.ts  saves/restores a draft from localStorage
  components/            one component per screen/UI piece
  App.tsx                wires the intro -> questions -> summary flow together
```
