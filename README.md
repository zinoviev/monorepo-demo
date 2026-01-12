# Monorepo Demo

A demonstration monorepo with pnpm workspaces and changesets.

## Project Structure

```
monorepo-demo/
├── apps/
│   └── host/              # Vite + React 19 application
├── packages/
│   └── ui/                # UI library (@monorepo/ui)
├── .changeset/            # Changesets configuration
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

#### 2. Version Packages

When it's time to release new versions:

```bash
pnpm version-packages
```

This command will:

- Read all changeset files
- Update versions in package.json of affected packages
- Update CHANGELOG.md files
- Delete consumed changeset files

#### 3. Publish (Optional)

If you want to publish packages to npm:

```bash
pnpm release
```

### Change Types (Semantic Versioning)

- **patch** (1.0.0 → 1.0.1): Bug fixes, backwards compatible changes
- **minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **major** (1.0.0 → 2.0.0): Breaking changes

### Example Workflow

```bash
# 1. Make changes to the code
# 2. Create a changeset
pnpm changeset

# 3. Commit changes along with the changeset file
git add .
git commit -m "feat: add new button variant"

# 4. When ready to release, version the packages
pnpm version-packages

# 5. Commit the updated versions
git add .
git commit -m "chore: version packages"

# 6. Publish (if needed)
pnpm release
```

## Packages

### @monorepo/ui

UI component library. Contains:

- `Button` — a red button

Usage:

```tsx
import { Button } from "@monorepo/ui";

function App() {
  return <Button onClick={() => alert("Clicked!")}>Click me</Button>;
}
```

### @monorepo/host

Demo application built with Vite + React 19, using components from `@monorepo/ui`.
