# Publishing Guide for @morpho-dev/subsquid-evm-processor

This guide provides step-by-step instructions for publishing this package to npm.

## Prerequisites

### 1. NPM Account Setup

Ensure you have:
- An npm account (create at https://www.npmjs.com/signup)
- Access to the `@morpho-dev` organization on npm
- npm CLI installed and authenticated

```bash
# Check if you're logged in
npm whoami

# If not logged in, authenticate
npm login
```

### 2. Organization Access

Verify you have publish access to `@morpho-dev`:

```bash
npm org ls @morpho-dev
```

If you don't have access, request it from the organization admin.

## Pre-Publishing Checklist

### 1. Version Management

Update the version in `package.json` following [Semantic Versioning](https://semver.org/):

- **Patch** (1.28.x): Bug fixes, minor improvements
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
# Option 1: Manual edit in package.json
# Current version: 1.28.0

# Option 2: Use npm version
npm version patch  # 1.28.0 -> 1.28.1
npm version minor  # 1.28.0 -> 1.29.0
npm version major  # 1.28.0 -> 2.0.0
```

### 2. Update CHANGELOG

Document changes in `CHANGELOG.md`:

```markdown
## [1.28.0] - 2025-11-07

### Added
- Exponential retry for ALL errors (not just connection errors)
- `retryAllErrors` configuration option
- `useExponentialBackoff` configuration option
- `exponentialBackoffInitialDelay` configuration option
- `maxBackoff` configuration option
- `retryJitter` configuration option
- Comprehensive retry documentation

### Changed
- Enhanced RPC client retry mechanism
- Improved error handling and logging

### Based On
- @subsquid/evm-processor v1.27.3
```

## Building the Package

### 1. Install Dependencies

Since this is a monorepo, you might need to install dependencies from the root:

```bash
# From the monorepo root
cd ../..
npm install

# Or if using rush
rush install
```

### 2. Build TypeScript

```bash
# From evm/evm-processor directory
cd evm/evm-processor
npm run build
```

This will:
- Remove old `lib/` directory
- Compile TypeScript to JavaScript
- Generate type definitions

### 3. Verify Build Output

Check that `lib/` directory was created:

```bash
ls -la lib/
```

You should see:
- `index.js` and `index.d.ts`
- All compiled source files
- Matching directory structure to `src/`

## Testing Before Publishing

### 1. Test Local Package

Create a tarball and inspect it:

```bash
npm pack

# This creates @morpho-dev-subsquid-evm-processor-1.28.0.tgz
# Extract and inspect
tar -tzf morpho-dev-subsquid-evm-processor-1.28.0.tgz
```

Verify the tarball includes:
- ✅ `lib/` (compiled JavaScript)
- ✅ `src/` (TypeScript sources)
- ✅ `package.json`
- ✅ `README.md`
- ✅ `RETRY_CONFIGURATION.md`
- ✅ `CHANGELOG.md`
- ❌ NOT `node_modules/`
- ❌ NOT `tsconfig.json`
- ❌ NOT `*.test.ts`

### 2. Test in Another Project

```bash
# In a test project
npm install ./path/to/morpho-dev-subsquid-evm-processor-1.28.0.tgz

# Test the import
node -e "const {EvmBatchProcessor} = require('@morpho-dev/subsquid-evm-processor'); console.log(EvmBatchProcessor)"
```

## Publishing

### Option 1: Standard Publishing (Recommended for First Release)

```bash
# Dry run to see what would be published
npm publish --dry-run

# Review the output carefully, then publish
npm publish --access public
```

### Option 2: Two-Factor Authentication

If 2FA is enabled (recommended):

```bash
npm publish --access public --otp=123456
# Replace 123456 with your current OTP code
```

### Option 3: CI/CD Publishing

For automated publishing, use npm tokens:

```bash
# Create an automation token at https://www.npmjs.com/settings/[username]/tokens
# Add token as NPM_TOKEN secret in GitHub Actions

# In GitHub Actions workflow:
- name: Publish to npm
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publishing

### 1. Verify Publication

```bash
# Check if package is live
npm view @morpho-dev/subsquid-evm-processor

# Check specific version
npm view @morpho-dev/subsquid-evm-processor@1.28.0

# Test installation
npm install @morpho-dev/subsquid-evm-processor
```

### 2. Create Git Tag

```bash
cd ../..
git add .
git commit -m "chore: publish @morpho-dev/subsquid-evm-processor v1.28.0"
git tag evm-processor-v1.28.0
git push origin master --tags
```

### 3. Create GitHub Release

1. Go to https://github.com/morpho-org/morpho-squid-sdk/releases/new
2. Choose tag: `evm-processor-v1.28.0`
3. Release title: `@morpho-dev/subsquid-evm-processor v1.28.0`
4. Description: Copy from CHANGELOG.md
5. Publish release

## Troubleshooting

### Error: "You do not have permission to publish"

**Solution**: Verify organization access:
```bash
npm org ls @morpho-dev
```

Request access from organization admin if needed.

### Error: "Package name too similar to existing package"

**Solution**: This shouldn't happen with `@morpho-dev` scope, but if it does:
1. Verify the exact package name
2. Check for typos in `package.json`

### Error: "Version already exists"

**Solution**: You cannot republish the same version:
```bash
# Increment version
npm version patch
npm publish --access public
```

### Build Errors

**Solution**: Ensure dependencies are installed:
```bash
# From monorepo root
npm install

# Or
rush install
rush build --to @morpho-dev/subsquid-evm-processor
```

### TypeScript Errors

**Solution**: Check TypeScript version:
```bash
npx tsc --version
# Should be ~5.5.4 as specified in package.json
```

## Unpublishing (Use with Caution!)

If you need to unpublish within 72 hours:

```bash
# Unpublish specific version
npm unpublish @morpho-dev/subsquid-evm-processor@1.28.0

# Unpublish entire package (DANGEROUS!)
npm unpublish @morpho-dev/subsquid-evm-processor --force
```

⚠️ **Warning**: Unpublishing is permanent and can break dependent projects!

## Versioning Strategy

### For Updates from Upstream (@subsquid/evm-processor)

When syncing with upstream:

```bash
# If upstream releases v1.27.4
# Morpho version should be 1.28.1 (or next available)

# Document in CHANGELOG.md:
## [1.28.1] - YYYY-MM-DD
### Changed
- Synced with @subsquid/evm-processor v1.27.4

### Added
- (Morpho-specific features remain)
```

### For Morpho-Specific Features

```bash
# Minor version bump for new features
npm version minor  # 1.28.0 -> 1.29.0

# Patch version for bug fixes
npm version patch  # 1.28.0 -> 1.28.1
```

## Maintenance

### Regular Tasks

1. **Monitor npm downloads**:
   ```bash
   npm view @morpho-dev/subsquid-evm-processor
   ```

2. **Check for security vulnerabilities**:
   ```bash
   npm audit
   ```

3. **Keep dependencies updated**:
   ```bash
   npm outdated
   npm update
   ```

4. **Sync with upstream**: Periodically check [@subsquid/evm-processor](https://www.npmjs.com/package/@subsquid/evm-processor) for updates

## Support

- **Issues**: https://github.com/morpho-org/morpho-squid-sdk/issues
- **npm Package**: https://www.npmjs.com/package/@morpho-dev/subsquid-evm-processor
- **Documentation**: See README.md and RETRY_CONFIGURATION.md

## License

This package is licensed under GPL-3.0-or-later, same as the upstream @subsquid/evm-processor.
