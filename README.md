# Monorepo Demo

A demonstration monorepo with pnpm workspaces and changesets. This project showcases an automated release workflow using GitHub Actions.

## Project Structure

```
monorepo-demo/
├── apps/
│   ├── app/               # Vite + React application
│   └── shell/             # Shell application
├── packages/
│   ├── ui/                # UI library (@monorepo/ui)
│   ├── client/            # Client library (@monorepo/client)
│   └── platform/          # Platform library (@monorepo/platform)
├── .changeset/            # Changesets configuration
├── .github/workflows/     # GitHub Actions (CI + Release)
├── pnpm-workspace.yaml    # Workspaces configuration
└── package.json           # Root package.json
```

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run the Application

```bash
pnpm dev
```

The application will be available at http://localhost:5173

---

## 🚀 Try the Changesets Workflow

This repository demonstrates an automated versioning and release workflow. Follow these steps to experience it yourself:

### Step 1: Fork and Clone

```bash
# Fork this repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/monorepo-demo.git
cd monorepo-demo
pnpm install
```

### Step 2: Create a Feature Branch

```bash
git checkout -b feature/my-awesome-change
```

### Step 3: Make Changes to a Package

For example, add a new component to `@monorepo/ui`:

```bash
# Edit packages/ui/src/Button.tsx or add a new component
```

### Step 4: Generate a Changeset

```bash
pnpm changeset
```

The interactive CLI will ask you to:

1. **Select packages** — choose which packages were modified
2. **Choose bump type** — patch, minor, or major
3. **Write a summary** — describe what changed

This creates a markdown file in `.changeset/` describing your changes.

### Step 5: Commit and Push

```bash
git add .
git commit -m "feat: add new feature to ui package"
git push origin feature/my-awesome-change
```

### Step 6: Create a Pull Request

Open a PR from your feature branch to `main`. The CI workflow will run and validate your changes.

### Step 7: Merge and Watch the Magic ✨

Once your PR is merged to `main`, the **Release workflow** automatically:

1. **Detects changesets** in the `.changeset/` folder
2. **Creates a "Version Packages" PR** that:
   - Bumps package versions according to your changesets
   - Updates `CHANGELOG.md` for each affected package
   - Removes the consumed changeset files
3. When you merge the "Version Packages" PR, it **publishes the new versions** to GitHub Packages

### Visual Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   Feature Branch                    main branch                         │
│   ──────────────                    ───────────                         │
│                                                                         │
│   1. Make changes to packages                                           │
│   2. Run `pnpm changeset`                                               │
│   3. Commit & Push                                                      │
│          │                                                              │
│          ▼                                                              │
│   ┌──────────────┐                                                      │
│   │  Create PR   │────────────────────┐                                 │
│   └──────────────┘                    │                                 │
│                                       ▼                                 │
│                              ┌─────────────────┐                        │
│                              │   Merge to main │                        │
│                              └────────┬────────┘                        │
│                                       │                                 │
│                                       ▼                                 │
│                          ┌────────────────────────┐                     │
│                          │  GitHub Action runs    │                     │
│                          │  changesets/action     │                     │
│                          └───────────┬────────────┘                     │
│                                      │                                  │
│                    ┌─────────────────┴─────────────────┐                │
│                    ▼                                   ▼                │
│         ┌───────────────────┐              ┌────────────────────┐       │
│         │ Changesets exist? │──── Yes ────▶│ Create Version PR  │       │
│         │                   │              │ (bumps versions,   │       │
│         │                   │              │  updates changelog)│       │
│         └───────────────────┘              └─────────┬──────────┘       │
│                    │                                 │                  │
│                    No                                ▼                  │
│                    │                       ┌─────────────────┐          │
│                    ▼                       │ Merge Version PR│          │
│         ┌───────────────────┐              └────────┬────────┘          │
│         │ Publish packages  │◀──────────────────────┘                   │
│         │ to GitHub Packages│                                           │
│         └───────────────────┘                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Working with Changesets

Changesets is a tool for managing package versions in a monorepo.

### Main Commands

#### 1. Create a Changeset

When you make changes to packages, create a changeset to document the changes:

```bash
pnpm changeset
```

The command will start an interactive dialog:

1. Select the packages that were changed
2. Specify the type of change (major/minor/patch)
3. Write a description of the changes

After that, a new file describing the changes will appear in the `.changeset/` folder.

#### 2. Version Packages (Automated via CI)

In this repository, versioning is handled automatically by GitHub Actions. When you merge to `main`, the action creates a "Version Packages" PR.

For local development/testing, you can run:

```bash
pnpm version-packages
```

This command will:

- Read all changeset files
- Update versions in package.json of affected packages
- Update CHANGELOG.md files
- Delete consumed changeset files

#### 3. Publish (Automated via CI)

Publishing is also automated. When the "Version Packages" PR is merged, packages are published to GitHub Packages.

For manual publishing:

```bash
pnpm release
```

### Change Types (Semantic Versioning)

- **patch** (1.0.0 → 1.0.1): Bug fixes, backwards compatible changes
- **minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **major** (1.0.0 → 2.0.0): Breaking changes

---

## Packages

### @monorepo/ui

UI component library with reusable React components.

```tsx
import { Button } from "@monorepo/ui";

function App() {
  return <Button onClick={() => alert("Clicked!")}>Click me</Button>;
}
```

### @monorepo/client

Client-side utilities and context providers.

### @monorepo/platform

Platform-level components and container utilities.

---

## Apps

### apps/app

Main Vite + React application using the shared packages.

### apps/shell

Shell application for module federation or standalone use.
