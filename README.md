# Screen Compare

Compare screenshots in a scalable grid with custom row and column labels. Export to PDF.

**Live app:** https://shanenoormohamed.github.io/screen-compare/

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## How to use

1. **Edit labels** — column headers (e.g. Before (main), After (branch)) and row labels (e.g. iOS Light, iOS Dark).
2. **Add rows / columns** — scale the grid for light/dark, iOS/Android, or any comparison you need.
3. **Drop images** — PNG or JPG into each cell (drag-and-drop or click).
4. **Export PDF** — downloads a landscape table with labels and images.

## Example layout

|  | Before (main) | After (branch) |
| --- | --- | --- |
| iOS Light | image | image |
| iOS Dark | image | image |
| Android Light | image | image |
| Android Dark | image | image |

All processing happens in the browser — images are never uploaded.

## Deploy

Pushes to `main` deploy automatically via GitHub Actions to GitHub Pages.
