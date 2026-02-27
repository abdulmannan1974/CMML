<div align="center">

# Blood Doctor

**Hematology Education Platform**

An interactive clinical education platform with disease modules, diagnostic tools, case-based learning, and reference calculators for practicing hematologists and pathologists.

</div>

## Features

- **Disease Modules** — Comprehensive educational content for blood disorders (CMML available, AML/MDS/MPN coming soon)
- **Diagnostic Assistant** — Interactive diagnostic workflows with criteria checklists and differential diagnosis
- **Case-Based Learning** — Clinical case presentations with lab interpretation and interactive questions
- **Reference Dashboard** — Scoring calculators, classification criteria, and treatment algorithms

## Tech Stack

- React 19 + TypeScript
- Vite 6
- React Router v7
- Tailwind CSS v4
- Framer Motion
- Three.js + React Three Fiber (3D visualizations)

## Run Locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Project Structure

```
src/
├── components/
│   ├── disease/       # Disease-specific display components
│   ├── layout/        # Navbar, Footer, Sidebar, PageLayout
│   ├── ui/            # Shared UI primitives (Card, Badge, Button, etc.)
│   └── visualization/ # 3D scene components
├── data/
│   ├── diseases/      # Disease module data (add new diseases here)
│   └── types.ts       # TypeScript interfaces
├── hooks/             # Custom React hooks
├── pages/             # Route pages
├── App.tsx            # Router setup
├── main.tsx           # Entry point
└── index.css          # Tailwind + global styles
```

## Adding a New Disease Module

1. Create a new file in `src/data/diseases/` following the `cmml.ts` pattern
2. Register it in `src/data/diseases/index.ts`
3. The disease automatically appears across all features (pages, diagnostic, reference)

---

*Produced for clinical education by Dr Abdul Mannan (FRCPath FCPS)*
