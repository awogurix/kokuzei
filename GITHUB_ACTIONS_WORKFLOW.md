# GitHub Actions Workflow Setup Instructions

Due to GitHub App permissions, the workflow file needs to be added manually through the GitHub web interface.

## Steps to Enable Automatic Deployment:

1. **Enable GitHub Pages**:
   - Go to your repository: https://github.com/awogurix/kokuzei
   - Click on "Settings" tab
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Create the Workflow File**:
   - Go to the "Actions" tab in your repository
   - Click "set up a workflow yourself" or "New workflow"
   - Replace the content with the code below
   - Save the file as `.github/workflows/deploy.yml`

## Workflow File Content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build with Next.js
        run: npm run build
        env:
          NODE_ENV: production

      - name: Add .nojekyll file
        run: touch ./out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## After Setup:

Once the workflow is added and Pages is enabled, your site will be automatically deployed to:
https://awogurix.github.io/kokuzei/

Every push to the main branch will trigger a new deployment.
