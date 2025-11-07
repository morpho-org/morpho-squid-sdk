# Standalone Build and Publishing Guide

Since this package is part of a Rush monorepo but needs to be published independently, follow these steps for standalone building and publishing.

## Quick Build & Publish

### 1. Install Dependencies Locally

```bash
cd evm/evm-processor

# Install TypeScript and build dependencies
npm install typescript@5.5.4 --save-dev --no-save

# Or use npx to avoid installing
```

### 2. Build the Package

```bash
# Option 1: Using local TypeScript
npx typescript --project tsconfig.json

# Option 2: Direct tsc if installed
./node_modules/.bin/tsc

# This will create the lib/ directory
```

### 3. Verify Build

```bash
ls -la lib/
# Should see compiled .js and .d.ts files
```

### 4. Test Package Creation

```bash
npm pack

# Inspect the created tarball
tar -tzf morpho-dev-subsquid-evm-processor-*.tgz
```

### 5. Publish to npm

```bash
# Login to npm (if not already)
npm whoami || npm login

# Publish
npm publish --access public
```

## Alternative: Use Rush for Building

If you want to keep using the monorepo tools:

### 1. Update rush.json

Update the entry in `rush.json`:

```json
{
  "packageName": "@morpho-dev/subsquid-evm-processor",
  "projectFolder": "evm/evm-processor",
  "shouldPublish": true,
  "versionPolicyName": "npm"
}
```

### 2. Run Rush Update

```bash
cd ../..
rush update
```

### 3. Build with Rush

```bash
rush build --to @morpho-dev/subsquid-evm-processor
```

## Recommended: Docker-Based Build (Most Reliable)

For consistent builds, use Docker:

### 1. Create Dockerfile.build

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json tsconfig.json ./
COPY src ./src

# Install dependencies
RUN npm install typescript@5.5.4

# Build
RUN npx tsc

# Output will be in /app/lib
```

### 2. Build with Docker

```bash
# Build
docker build -f Dockerfile.build -t evm-processor-build .

# Extract lib/ directory
docker create --name temp evm-processor-build
docker cp temp:/app/lib ./
docker rm temp
```

### 3. Publish

```bash
npm publish --access public
```

## Dependencies Note

This package depends on other @subsquid packages. When publishing:

1. **Dependencies are external**: Users will need to install:
   - @subsquid/http-client
   - @subsquid/logger
   - @subsquid/rpc-client (⚠️ with your modifications)
   - Other @subsquid/* packages

2. **Consider bundling**: If you've modified @subsquid/rpc-client, you might need to:
   - Fork and publish @morpho-dev/rpc-client separately
   - Or bundle the modified rpc-client into this package

## Important: RPC Client Dependency

⚠️ **Critical**: This package includes modifications to `@subsquid/rpc-client`. You have two options:

### Option 1: Publish Modified RPC Client (Recommended)

```bash
# Navigate to rpc-client
cd ../../util/rpc-client

# Update package.json
{
  "name": "@morpho-dev/subsquid-rpc-client",
  "version": "4.15.0"
}

# Build and publish
npm run build
npm publish --access public

# Then update evm-processor dependency
cd ../../evm/evm-processor
# Update package.json:
{
  "dependencies": {
    "@subsquid/rpc-client": "^4.15.0"  // Change to @morpho-dev/subsquid-rpc-client
  }
}
```

### Option 2: Use Patch Package

Use `patch-package` to maintain patches:

```bash
npm install patch-package --save-dev

# In package.json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

Then users can apply your patches automatically.

## Publishing Checklist

- [ ] Built `lib/` directory exists and is complete
- [ ] `package.json` has correct name: `@morpho-dev/subsquid-evm-processor`
- [ ] Version is updated appropriately
- [ ] README.md is updated
- [ ] CHANGELOG.md is updated
- [ ] All dependencies are published and accessible
- [ ] `.npmignore` excludes development files
- [ ] Tested `npm pack` output
- [ ] Tested installation in a separate project
- [ ] Logged into npm with organization access
- [ ] Published with `--access public`

## Troubleshooting

### "Cannot find module" after publishing

**Cause**: Build files not included in package

**Fix**: Verify `package.json` includes:
```json
{
  "files": ["lib", "src"]
}
```

### "Peer dependency not met"

**Cause**: Users need to install @subsquid dependencies

**Fix**: Document peer dependencies in README:
```bash
npm install @morpho-dev/subsquid-evm-processor @subsquid/http-client @subsquid/logger ...
```

### Build fails in CI

**Cause**: Missing TypeScript or dependencies

**Fix**: Ensure CI installs all dependencies:
```yaml
- run: npm install
- run: npm run build
```
