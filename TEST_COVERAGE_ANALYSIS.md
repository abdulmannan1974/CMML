# Test Coverage Analysis: CMML State-of-the-Art Review

## Executive Summary

This project currently has **zero test coverage** — no test files, no testing framework, no CI pipeline, and no test scripts. This document analyzes every module in the codebase and proposes a prioritized testing plan.

---

## Current State

| Metric | Value |
|---|---|
| Test files | 0 |
| Test framework | None configured |
| CI/CD pipeline | None |
| `test` script in package.json | Missing |
| Source files | 7 (.tsx/.ts) |
| Total source lines | ~890 |

---

## Recommended Testing Infrastructure

### Framework: Vitest + React Testing Library + jsdom

Since the project already uses Vite, **Vitest** is the natural choice — it shares Vite's config, transforms, and plugin ecosystem with no extra bundler setup. Pair it with **React Testing Library** for component tests and **jsdom** for DOM simulation.

**Packages to install:**
```
vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Additional mocks needed:**
- `@react-three/fiber` and `@react-three/drei` (WebGL/Canvas cannot run in jsdom)
- `framer-motion` (optional — can test with real library or mock animations)
- `window.scrollTo`, `getBoundingClientRect`, `IntersectionObserver`

---

## Module-by-Module Analysis

### 1. `components/CMMLDiagrams.tsx` (362 lines) — **HIGH PRIORITY**

This is the most logic-dense file in the project. It contains 8 exported components, several of which have interactive state and computed output.

#### Components with testable logic:

**`DiagnosticChecklist`** — Interactive toggle checklist
- State: `checked` array toggled by clicking items
- Logic: `isDiagnosed` computed via `prerequisites.every(p => checked.includes(p.id))`
- Tests needed:
  - Renders all 3 prerequisite items
  - Clicking a prerequisite toggles its checked state (visual class change)
  - Clicking a checked item un-checks it
  - "All Prerequisite Criteria Met" message appears only when all 3 are checked
  - Message disappears when any item is un-checked

**`GenomicGrid`** — Hover-activated gene category cards
- State: `activeCat` index, set on hover
- Tests needed:
  - Renders all 4 gene categories with correct labels
  - Each category shows the correct gene list
  - Hovering a card displays its detail text
  - Only one detail is visible at a time

**`PrognosisScoreboard`** — CPSSmol risk calculator
- State: `blasts` selector, `mutated` array
- Logic: Score computation (0–3) and risk classification
- Tests needed:
  - Default state shows "Low" risk (score 0)
  - Selecting `>=5%` blasts adds 1 to score
  - Toggling ASXL1 adds 1 to score
  - Toggling SETBP1/NRAS/RUNX1 adds 1 to score (but not cumulative — any one of the three adds the point)
  - Risk labels map correctly: 0=Low, 1=Intermediate-1, 2=Intermediate-2, 3=High
  - Un-toggling a mutation reduces the score

**`TreatmentTree`** — Hover-activated treatment paths
- State: `activePath` string
- Tests needed:
  - Renders all 4 treatment paths
  - Hovering a path highlights it and shows therapy details
  - Leaving a path removes the highlight

**`DifferentialDiagnosisTable`** — Static table
- Tests needed:
  - Renders the two columns (Malignant / Non-Malignant)
  - Contains expected diagnostic items

**`SubtypeComparison`** — Static comparison cards
- Tests needed:
  - Renders both MD-CMML and MP-CMML variants
  - Shows correct WBC thresholds

**`TreatmentIndications`** — Static grid
- Tests needed:
  - Renders all 6 indication cards
  - Each card displays correct title and description

**`FutureTherapies`** — Static list
- Tests needed:
  - Renders all 4 therapy targets
  - Each entry shows name, target, type, and description

---

### 2. `App.tsx` (404 lines) — **MEDIUM PRIORITY**

The main application shell. Contains navigation, layout, scroll behavior, and composition of all sub-components.

#### Testable areas:

**`scrollToSection`** — Smooth scroll navigation
- Logic: Calculates offset position and calls `window.scrollTo`
- Tests needed:
  - Clicking a nav link calls `scrollTo` with the correct offset
  - `setMenuOpen(false)` is called (menu closes on navigation)

**Scroll-based header styling**
- Logic: `scrolled` state driven by `window.scrollY > 50`
- Tests needed:
  - Header starts transparent (scrolled=false)
  - Firing a scroll event past 50px changes header to opaque
  - Scroll listener is cleaned up on unmount

**Mobile menu toggle**
- Logic: `menuOpen` state toggled by hamburger button
- Tests needed:
  - Menu button renders
  - Clicking toggles between Menu and X icons

**`BloodDoctorLogo`** — Simple presentational component
- Tests needed:
  - Renders "Blood" and "Doctor" text
  - Accepts and applies className prop

**`AuthorBadge`** — Simple presentational component
- Tests needed:
  - Renders name and affiliation props

**Section composition**
- Tests needed:
  - All major sections render (pathophysiology, diagnosis, prognosis, therapy, future, authors)
  - Navigation links correspond to section IDs

---

### 3. `components/HematologyScene.tsx` (83 lines) — **LOW PRIORITY**

3D WebGL scene using Three.js via react-three-fiber. This is inherently difficult to unit test because it depends on WebGL context.

#### Recommended approach:
- **Mock the entire Canvas** and verify component composition
- Tests needed:
  - `HematologyScene` renders without crashing (with mocked Canvas)
  - Correct number of `BloodCell` elements rendered (5)
  - `Monocyte` is rendered at origin position
  - Props passed to BloodCell (position, color, scale) are correct

---

### 4. `types.ts` (19 lines) — **LOW PRIORITY**

Type definitions only. No runtime logic. Testing value is limited to TypeScript compilation checks, which the build already validates.

- No dedicated tests needed (covered by `tsc --noEmit`)

---

### 5. `components/Diagrams.tsx` (5 lines) & `components/QuantumScene.tsx` (4 lines) — **NOT NEEDED**

These are empty placeholder/stub files. They should either be deleted or left untested.

---

## Prioritized Test Plan

### Phase 1: Setup & High-Value Logic Tests
1. Install Vitest, React Testing Library, jsdom
2. Configure `vitest.config.ts` and add `test` script to `package.json`
3. Create mocks for `@react-three/fiber`, `@react-three/drei`, and `three`
4. Write tests for `PrognosisScoreboard` (most complex logic: score calculation + risk mapping)
5. Write tests for `DiagnosticChecklist` (interactive toggle + conditional rendering)

### Phase 2: Interactive Component Tests
6. Write tests for `TreatmentTree` (hover state)
7. Write tests for `GenomicGrid` (hover state + detail display)
8. Write tests for App scroll behavior and navigation
9. Write tests for mobile menu toggle

### Phase 3: Static Rendering Tests
10. Write tests for `DifferentialDiagnosisTable`, `SubtypeComparison`, `TreatmentIndications`, `FutureTherapies`
11. Write tests for `BloodDoctorLogo` and `AuthorBadge`
12. Write smoke test for full App render

### Phase 4: 3D Scene (Optional)
13. Write mocked render tests for `HematologyScene`

---

## Specific Logic That Deserves Unit Tests

The `PrognosisScoreboard` contains the most important testable business logic in the app. Its risk calculation deserves thorough unit testing because it represents a clinical decision-support tool:

```
Score computation:
  +1 if blasts >= 5%
  +1 if ASXL1 mutated
  +1 if any of [SETBP1, NRAS, RUNX1] mutated

Risk mapping:
  0 → Low
  1 → Intermediate-1
  2 → Intermediate-2
  3 → High
```

This logic could be extracted into a pure function for easier unit testing:

```typescript
// Extractable pure function
function calculateCPSSmolRisk(blasts: string, mutated: string[]): { score: number; risk: string } {
  let score = 0;
  if (blasts === '>=5%') score += 1;
  if (mutated.includes('ASXL1')) score += 1;
  if (mutated.includes('SETBP1') || mutated.includes('NRAS') || mutated.includes('RUNX1')) score += 1;

  const risk = score === 0 ? 'Low'
    : score === 1 ? 'Intermediate-1'
    : score === 2 ? 'Intermediate-2'
    : 'High';

  return { score, risk };
}
```

---

## Summary of Recommendations

| Priority | Area | Estimated Tests | Rationale |
|---|---|---|---|
| HIGH | `PrognosisScoreboard` | 8-10 | Clinical calculator with branching logic |
| HIGH | `DiagnosticChecklist` | 5-6 | Interactive state + conditional UI |
| MEDIUM | `GenomicGrid` | 4-5 | Hover-driven detail display |
| MEDIUM | `TreatmentTree` | 3-4 | Hover-driven UI state |
| MEDIUM | App navigation/scroll | 5-6 | Core UX behavior |
| MEDIUM | App mobile menu | 2-3 | Responsive behavior |
| LOW | Static components (4) | 4-8 | Rendering correctness |
| LOW | `BloodDoctorLogo` / `AuthorBadge` | 2-3 | Simple prop rendering |
| LOW | `HematologyScene` | 2-3 | Smoke test with mocked 3D |
| SKIP | `types.ts`, stubs | 0 | No runtime logic |

**Total recommended tests: ~35-48**

---

## Key Observations

1. **The PrognosisScoreboard's risk calculation is embedded in a React component.** Extracting it into a pure utility function would make it testable without rendering React components, and is the single highest-value refactor for testability.

2. **No component data is fetched from APIs** — all medical data is hardcoded. This simplifies testing (no API mocking needed) but means tests will primarily verify rendering and interaction logic.

3. **The 3D scene (`HematologyScene`) is decorative** and contributes no clinical logic. Testing it provides low value relative to the mocking complexity required.

4. **Dead code exists** (`Diagrams.tsx`, `QuantumScene.tsx`) that should be removed rather than tested.

5. **The `vite.config.ts` references `GEMINI_API_KEY`** but no component uses it. This is likely leftover from a template. It does not affect testing but is worth cleaning up.
