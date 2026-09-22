# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

InfoPi is a single-page Angular 22 kiosk app that shows live data (clock, weather, train departures, waste collection, electricity prices, FX rates, OpenHAB devices, RSS news). It is bundled with Electron into a `.deb` for a Raspberry Pi driving a full-HD monitor in **portrait** orientation.

## Setup

Package manager is Yarn 4 via corepack (`corepack enable`, then `yarn install`).

`src/environments/config.ts` is **git-ignored but required for any build**. If it is missing:

```bash
cp src/environments/config.sample.ts src/environments/config.ts
```

## Commands

```bash
yarn lint                 # ESLint over src/**/*.ts and src/**/*.html
yarn test                 # ng test -> @angular/build:unit-test (vitest + jsdom)
yarn build                # development build
yarn build:prod           # production build into dist/
yarn start                # ng serve (see CORS caveat below)
yarn electron             # prod build + launch the kiosk window (Ctrl+Q quits, Ctrl+Shift+I devtools)
yarn package              # prod build + Electron bundle + .deb into dist/installers (x64 + arm64)
yarn deploy               # package, scp/dpkg to the `infopi` SSH host, reboot it
```

Running a subset of tests (options go to the Angular unit-test builder):

```bash
yarn test --include src/app/info-blocks/fx-rates/fx-rates.component.spec.ts
yarn test --filter '^FxRates'      # matches suite/test names
yarn test --watch=false            # watch defaults to on in a TTY
```

CI (`.github/workflows/angular.yml`, on `master` and `dev`) copies the sample config, then runs lint, test and package.

## Architecture

**Config-driven composition.** `src/app/core/config/config.ts` defines one `*Config` interface per info block (all extending `InfoBlockConfig` with `enabled` + `refreshRate`), the aggregate `InfoPiConfig`, and `InfoPiConfigImpl` holding the disabled-by-default fallbacks. `APP_CONFIG` is an `InjectionToken` whose factory wraps `environment.configuration`, which comes from the user-supplied `src/environments/config.ts`. `AppComponent` injects `APP_CONFIG` and its template renders each block only when `config.<block>.enabled`, passing the block's config slice down as an `input.required`. The `production` build configuration swaps `environment.ts` for `environment.prod.ts`; both import the same `config.ts`.

**Info block pattern** (`src/app/info-blocks/<name>/`). Every block is a standalone signal-based component and follows the same shape:

1. `readonly config = input.required<XConfig>()`.
2. An `httpResource(...)` (or `httpResource.text(...)` for XML) built from a reactive URL/params callback.
3. `computed()` signals mapping the raw API payload into display models — raw response shapes live in the block's `models.ts` and are prefixed `Raw*`; the mapped shapes are plain view models.
4. A constructor `effect(onCleanup => ...)` subscribing `timer(0, this.config().refreshRate)` to call `resource.reload()`, unsubscribing in `onCleanup`. This is the refresh idiom everywhere — follow it rather than inventing a new one.
5. The template's root element is `<section (click)="xResource.reload()" [class.outdated]="xResource.error()" [appSpinner]="xResource.isLoading()">` — tap-to-refresh, dimming on error and the loading animation, all wired to the same resource.

To add a block: add its config interface + `InfoPiConfig` member + `InfoPiConfigImpl` default, add a sample entry to `config.sample.ts`, create the component, then import it in `AppComponent` and guard it with `enabled` in `app.component.html`.

**XML APIs** (ECB FX rates, RSS) go through `XmlParserService`, which runs `xml-js` in compact mode with `textKey: 'text'`, `attributesKey: 'attr'`. Raw interfaces therefore model elements as `{text: string}` (`TextNode` in `core/gen-types.ts`) and attributes as `attr: {...}` / `Attributes`.

**Electron shell.** `bootstrap.js` opens a kiosk `BrowserWindow` with `webSecurity: false` and loads `dist/index.html` from the file system. That disabled web security is what lets the components call third-party APIs (Buienradar, NS, ECB, stroomperuur, mijnafvalwijzer, OpenHAB) directly from the renderer — under `yarn start` the same requests hit CORS failures, so `yarn electron` is the realistic way to run the app. `package.js` drives `@electron/packager` + `electron-installer-debian`. `display-ctl` is a helper script for DPMS screen on/off on the Pi.

**Styling.** Global `src/styles.scss` defines a dark kiosk theme plus a hand-rolled 12-column flex grid (`.row`, `.w-1`…`.w-12`, `.pl-*`/`.pr-*`, `.ruler*`) used by the layout; shared SCSS variables live in `src/_vars.scss` and are consumed via `@use "vars"`. Component styles are SCSS with `src` and `node_modules` on the include path, and are capped at 6 kB (warning) / 10 kB (error) by the production budgets. Weather glyphs come from the `weather-icons` font; `WeatherComponent.iconToWiClassMap` maps Buienradar icon file names to `wi-*` classes.

**Tests** are vitest specs with Angular `TestBed`; the typical spec just creates the component, `setInput('config', {...})` and asserts it renders. `tsconfig.spec.json` sets `strict: false` and vitest globals. `no-only-tests` is configured to fail on both `.only` and `.skip`.

## Conventions

- 4-space indentation, single quotes, mandatory semicolons and braces (`curly: all`) — enforced partly by `eslint.config.mjs`.
- Modern Angular only: standalone components with `imports`, `inject()` over constructor params, signals (`input`, `computed`, `linkedSignal`, `effect`), and `@if`/`@for` control flow in templates. No NgModules, no decorated `@Input()`/`@Output()`.
- Strict TS and strict Angular templates are on for app code.
- `stream` is a real dependency despite having no import in `src`: `xml-js` pulls in `sax`, which does `require('stream')`. Don't "clean" it away.

## Git

**Never commit automatically.** Commits, amends, branch pushes and tags are made by the repo owner, or by Claude only when explicitly asked for in that message. Leave finished work in the working tree and report what changed instead — an unprompted `git commit` is a bug, even when the change is small and the tests pass.
