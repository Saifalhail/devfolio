# 📘 Comprehensive Project Blueprint + AI‑Agent Rules

> **Purpose:** A reusable master template for any modern React (+ Firebase) project, with multilingual support, mobile‑first foundations, CI/CD, and strict AI‑agent governance.

---

## 🗺️ Table of Contents
1. Technical Blueprint  
   1‑A Objectives & Scope  
   1‑B Folder Skeleton  
   1‑C Step‑by‑Step Kick‑Off Plan  
   1‑D Styling & Theme Tokens  
   1‑E Routing & Layout  
   1‑F State · Auth · Data  
   1‑G Forms & Validation  
   1‑H Internationalisation  
   1‑I Lint · Format · Test  
   1‑J Version Control Strategy  
   1‑K CI/CD Workflow  
   1‑L Observability & Analytics  
   1‑M Accessibility & SEO Baseline  
   1‑N Performance Budget  
   1‑O Documentation & Knowledge Base  
2. AI‑Agent Contribution Rules  
   2‑A Golden Rules  
   2‑B Allowed Actions  
   2‑C Forbidden Actions  
   2‑D Commit Message Convention  
   2‑E Mandatory Checklist (Pre‑PR)  
   2‑F Conflict Resolution Protocol  
   2‑G Escalation Path  

---

## 🧱 1 · TECHNICAL BLUEPRINT

### 1‑A · Objectives & Scope
- Launch a secure, performant, **mobile‑first** React application.
- Offer multi‑language UI (e.g. EN + AR with RTL capability).
- Maintain WCAG 2.1 AA, SEO, and performance budgets throughout.

---

### 1‑B · Folder Skeleton

```plaintext
/public
/src
├── assets/                 # images, icons, fonts
├── components/
│   ├── Common/             # Button, Card, Modal, Loader, ...
│   ├── Layout/             # Navbar, Footer, wrappers
│   └── Pages/              # feature‑ or route‑scoped components
├── contexts/               # React Contexts (Auth, Theme, Locale)
├── hooks/                  # custom hooks (useAuth, useToggle, ...)
├── locales/                # JSON dictionaries for i18n
├── routes/                 # route configs + guards
├── styles/                 # theme.ts, GlobalStyle.ts, mixins
├── utils/                  # Firebase config, API clients, helpers
├── __tests__/              # Jest + RTL tests
└── index.tsx / App.tsx     # entry & root
```

---

### 1‑C · Step‑by‑Step Kick‑Off Plan

| Phase | Core Tasks | Deliverable |
|-------|------------|-------------|
| **0 · Pre‑Flight** | Install Node LTS & PNPM/NPM.<br>Create repo, push empty `main`. | Clean baseline |
| **1 · Tooling** | Configure ESLint, Prettier, Husky, lint‑staged.<br>Add Jest + RTL.<br>Add GitHub Actions skeleton (install → lint → test). | CI pipeline & code‑style gate |
| **2 · Tokens** | Create `/styles/theme.ts` placeholders.<br>Add `GlobalStyle.ts` reset & base. | Central design tokens |
| **3 · Skeleton App** | Scaffold `App.tsx`, `index.tsx`.<br>Wrap with `<ThemeProvider>` & `<I18nextProvider>`.<br>Add `<BrowserRouter>`. | Blank app running |
| **4 · Routing Shell** | Create `/routes/index.tsx` with dummy `Home` + `404`.<br>Implement `PublicLayout` (Navbar+Footer placeholders). | Navigation functional |
| **5 · Common Components** | Stub `Button`, `Input`, `Card`, `Loader` in `/Common/`.<br>Optional Storybook setup. | Reusable atoms ready |
| **6 · i18n** | Add `locales/en.json`, `ar.json` with sample keys.<br>Implement `LanguageToggle` in `Navbar`. | Language switch & RTL flip |
| **7 · Auth Setup** | Init Firebase project.<br>Create `/utils/firebase.ts` & `.env.local`.<br>Implement `AuthContext`, `useAuth()` with anonymous sign‑in test. | Auth provider live |
| **8 · Dashboard Skeleton** | Protected route `/dashboard` with guard.<br>Add `AuthLayout` wrapper & placeholder content. | Auth flow verified |
| **9 · Form Pattern** | Build `ContactForm` via `react‑hook‑form` + `Yup` using Common inputs.<br>Submit to dummy Cloud Function. | Reference form pattern |
| **10 · CI Deploy** | Configure Firebase Hosting preview channels on PR.<br>Merge → auto‑deploy to staging. | Continuous delivery proven |

Repeat mini‑cycle (design → build → test → PR) for every new feature.

---

### 1‑D · Styling & Theme Tokens
*(central design tokens, no hard‑coded colors; see Phase 2)*

---

### 1‑E · Routing & Layout
- Central array of route objects `{ path, element, private }`.
- `<RequireAuth />` HOC for guards.
- Layout wrappers: `PublicLayout`, `AuthLayout`.

---

### 1‑F · State · Auth · Data
| Concern | Tool | Note |
|---------|------|------|
| Auth    | Firebase Auth | Google, Email/Pass, Phone |
| Global  | React Context + hooks | Add Zustand/Redux only if scale demands |
| DB      | Firestore | Use typed converters & security rules |
| Server  | Cloud Functions | Isolate secrets & heavy logic |

---

### 1‑G · Forms & Validation
- **react‑hook‑form** + **Yup**.
- Show loading, inline errors, and success toast.
- Reuse Common field components.

---

### 1‑H · Internationalisation
- Library: **react‑i18next**.
- Strings live in `/locales/*.json`.
- `dir={i18n.dir()}` for RTL/LTR.

---

### 1‑I · Lint · Format · Test
| Tool | Purpose |
|------|---------|
| ESLint | Code‑style |
| Prettier | Formatting |
| Husky + lint‑staged | Pre‑commit guard |
| Jest + RTL | Tests (≥ 80 % coverage) |

---

### 1‑J · Version Control Strategy
- Default branch `main`.
- Conventional Commit messages.
- PR template with checklist (tests, lint, storybook screens).

---

### 1‑K · CI/CD Workflow
- GitHub Actions jobs: Install → Lint → Test → Build → Deploy.
- PR previews to Firebase Hosting.

---

### 1‑L · Observability & Analytics
- Sentry (errors), Web Vitals, GA4/Plausible.

---

### 1‑M · Accessibility & SEO Baseline
- Lighthouse ≥ 90.
- ARIA, keyboard nav, semantic landmarks.
- Open Graph tags, Schema.org.

---

### 1‑N · Performance Budget
| Metric | Target |
|--------|--------|
| LCP | < 2.5 s |
| CLS | < 0.1 |
| JS Bundle | < 250 KB gz |

---

### 1‑O · Documentation & Knowledge Base
- `README.md` quick‑start.
- `ARCHITECTURE.md` diagrams.
- `CHANGELOG.md` (auto from Conventional Commits).
- Inline JSDoc/TSDoc on utilities.

---


### 1‑R · Reusable Component Catalogue (Reference)

All generic UI atoms/molecules live in **`/src/components/Common/`**.  
Before you build a new UI element, **search here first**.

| Component                | Core Props / Variants                     | Typical Usage                                  |
|--------------------------|-------------------------------------------|-----------------------------------------------|
| **Button**               | `variant` (primary/secondary/text/icon)  | Calls to action, dialog actions               |
| **Input / TextArea**     | `type`, `label`, `error`, `icon`         | Forms, search bars                            |
| **Select / Dropdown**    | `options[]`, `multiple`, `searchable`     | Country pickers, filters                      |
| **DatePicker**           | `mode` (single/range), `min`, `max`       | Scheduling, forms                             |
| **Modal / Dialog**       | `open`, `onClose`, `size`                 | Confirmations, forms, walkthroughs            |
| **Snackbar / Toast**     | `severity` (info/success/error/warn)      | Global feedback                               |
| **Tooltip**              | `content`, `placement`                    | Icon hints, truncated text                    |
| **Accordion**            | `openItem`, `onToggle`                    | FAQs, collapsible panels                      |
| **Tabs**                 | `activeKey`, `onChange`, `lazy`           | Settings pages, dashboards                    |
| **Table**                | `columns[]`, `data[]`, `sortable`         | Lists, admin grids                            |
| **Pagination**           | `page`, `pageSize`, `total`, `onChange`   | Data tables, search results                   |
| **Avatar**               | `src`, `name`, `size`                     | User profile, lists                           |
| **Badge / Chip**         | `color`, `icon`, `dismissible`            | Status indicators, tags                       |
| **Breadcrumbs**          | `items[]`, `onNavigate`                   | Hierarchical navigation                       |
| **Loader / Spinner**     | `size`, `variant`                         | Full‑screen or inline loading                 |

> 🗒️ **Guidelines**
> 1. **Variants > new components** – extend props before cloning.
> 2. Expose only semantic props (e.g., `severity="error"` not red hex).
> 3. Write a Storybook story for every new Common component.
> 4. Accessibility: ensure focus trap in `Modal`, ARIA roles in `Tabs`, keyboard nav in `Accordion`, etc.
> 5. Keep all motion (e.g., slide in Toast) in a single `motion.ts` util for consistency.


## 🤖 2 · AI‑AGENT CONTRIBUTION RULES

### 2‑A · Golden Rules
1. **Search first** – never duplicate components/files.
2. All visible text → translation keys in every locale.
3. Styles must use theme tokens; **no hard‑coded colors**.
5. Reuse or extend components listed in the *Reusable Component Catalogue*.
4. Run `npm run lint && npm test` locally before committing.

---

### 2‑B · Allowed Actions
| Action | Conditions |
|--------|------------|
| Create new components | Must live in `/components/Common` or `/components/Pages/**` |
| Add dependency | Via PR titled `chore(dep): add <pkg>@<ver> – rationale`; wait for human approval |
| Update Firebase rules | Edit `firebase.rules` file, include reason in PR |

---

### 2‑C · Forbidden Actions
- `git push --force` to `main` or protected branches.
- Hard‑coding secrets, API keys, URLs, or hex colors.
- Skipping CI with `--no‑verify`.
- Editing CI workflow files without explicit ticket.

---

### 2‑D · Commit Message Convention
```
feat(component): add <ComponentName>
fix(auth): token refresh bug
docs(readme): improve installation section
refactor(utils): streamline date formatter
chore(dep): bump react‑query@5
```

---

### 2‑E · Mandatory Checklist (Pre‑PR)
- [ ] Read **PROJECT_BUILDING_TASKS.md**.
- [ ] Verify **lint** & **tests** pass locally.
- [ ] Ensure responsive & RTL behaviour.
- [ ] Add/modify translation keys.
- [ ] Update docs if public API changed.
- [ ] Push branch & open PR; do **not** self‑merge.

---

### 2‑F · Conflict Resolution Protocol
1. Rebase atop latest `main`.
2. Resolve conflicts favouring newer code.
3. Re‑run lint & tests.
4. Force‑push branch (allowed on feature branch).

---

### 2‑G · Escalation Path
If requirements or architecture are ambiguous, **pause** and request human clarification rather than guessing.

---

**End of Blueprint** – use this file as the single source of truth for project setup and AI‑driven collaboration.


---

## 1‑P · Internationalisation (Extended Details)

### Core Library Setup
1. Install:
   ```bash
   pnpm add i18next react-i18next i18next-browser-languagedetector
   ```
2. Create `/src/i18n/index.ts`:
   ```ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';

   import en from '../locales/en.json';
   import ar from '../locales/ar.json';

   i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       resources: { en: { translation: en }, ar: { translation: ar } },
       fallbackLng: 'en',
       interpolation: { escapeValue: false },
     });

   export default i18n;
   ```

### Locale File Conventions
- Each locale file (`en.json`, `ar.json`, …) mirrors the same key hierarchy:
  ```json
  {
    "header": {
      "home": "Home",
      "services": "Services"
    },
    "cta": {
      "contact": "Contact Me"
    }
  }
  ```
- **Arabic example (`ar.json`)**:
  ```json
  {
    "header": {
      "home": "الرئيسية",
      "services": "الخدمات"
    },
    "cta": {
      "contact": "تواصل معي"
    }
  }
  ```

### RTL Utilities
1. Create `/src/utils/rtl.ts`:
   ```ts
   import i18n from '../i18n';

   export const isRTL = (): boolean => i18n.dir() === 'rtl';

   // Usage helpers
   export const logicalMargin = (ltr: string, rtl: string) =>
     isRTL() ? rtl : ltr;
   ```
2. Apply in components:
   ```tsx
   import { isRTL } from '../../utils/rtl';

   const Wrapper = styled.div`
     direction: ${isRTL() ? 'rtl' : 'ltr'};
     text-align: ${isRTL() ? 'right' : 'left'};
   `;
   ```

### Pluralisation & Date/Time
- Add `i18next-plural-postprocessor` or `i18next-icu` for complex plurals.
- Use `date-fns` with `date-fns/locale` or `Intl.DateTimeFormat` for language‑aware dates.

### Translation Workflow
| Step | Responsibility |
|------|----------------|
| Add string key in English file |
| Copy key to all other locale files (value can be placeholder) |
| Run `npm run i18n:report` (optional script with i18next-parser) to detect missing keys |
| Always include translation updates in PRs for new features |

---

## 1‑Q · Additional Development Safeguards

### Error Boundaries
- Implement global `<ErrorBoundary>` around route outlet to catch runtime errors.

### Lazy Loading & Code‑Splitting
- Use `React.lazy` + `Suspense` for route‑level bundles to keep main chunk small.

### Feature Flags
- Introduce simple flag util (e.g. launchdarkly or boolean env flags) for gradual roll‑outs.

### Environment Configuration
- Keep example `.env.example` synced with required variables.
- Document each variable in `README.md`.

### Release & Versioning
- Semantic Versioning (`MAJOR.MINOR.PATCH`).
- Each merge to `main` triggers GitHub Release notes via Conventional Changelog.

### Dependency Hygiene
- Renovate or Dependabot weekly PRs.
- CI runs `pnpm audit` to block vulnerable deps.

### Backup & Disaster Recovery (Serverless)
- Schedule Firestore export to Cloud Storage via Cloud Scheduler job.

### Monitoring Cloud Functions
- Enable Cloud Monitoring metrics & alerts for high latency, errors.

### PWA & Offline (Optional)
- Add `workbox` or Vite PWA plugin for installable app & offline assets.

### Image Optimisation
- Use next‑gen formats (AVIF/WebP).
- Compress via CI (sharp/imagmin) before commit or during build.

---

## 🤖 2 · AI‑AGENT RULES (Refined)

**Additional Must‑Dos**

- ❗ When adding UI text, create **both** EN & AR values *even if using placeholder Arabic*.
- ❗ If a component needs direction‑dependent padding/margins, import helpers from `rtl.ts` rather than writing ternaries inline.
- ✅ Run `npm run i18n:lint` (if configured) to ensure no missing translation keys.
- 🚫 Do **not** introduce new locale JSON files without product‑owner approval.
- 🚫 Never inline translations in JSX (`<p>Some text</p>` ✗).

**Extended Pre‑PR Checklist**

- [ ] `i18n` keys present for **all** new strings.
- [ ] `rtl.ts` helpers used for directional styles.
- [ ] **Code‑Split** heavy new pages using `React.lazy`.
- [ ] Added/updated tests for Error Boundaries if touched.
- [ ] Updated `.env.example` if new env vars introduced.
