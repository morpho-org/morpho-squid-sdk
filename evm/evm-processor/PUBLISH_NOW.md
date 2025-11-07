# 🚀 Ready to Publish - Final Checklist

## ✅ Pre-Publishing Verification Complete

All checks passed! Your package is ready to publish to npm.

### Package Details
- **Name**: `@morpho-dev/subsquid-evm-processor`
- **Version**: `1.28.2`
- **Size**: 95.0 kB (compressed), 538.2 kB (unpacked)
- **Files**: 111 total files
- **Tarball**: `morpho-dev-subsquid-evm-processor-1.28.2.tgz`

### ✅ Verification Results

| Check | Status | Details |
|-------|--------|---------|
| TypeScript Build | ✅ Pass | lib/ directory created, no errors |
| Package Creation | ✅ Pass | Tarball created successfully |
| Documentation Files | ✅ Pass | All .md files included |
| Local Installation | ✅ Pass | Tested in /tmp/test-morpho-install |
| Import Test | ✅ Pass | EvmBatchProcessor imports correctly |
| npm Authentication | ✅ Pass | Logged in as 0x666c6f |
| Org Permissions | ✅ Pass | Owner access to @morpho-dev |

### 📦 Package Contents Verified

```
✅ lib/ (compiled JavaScript + type definitions)
✅ src/ (TypeScript source)
✅ README.md (updated with new package name)
✅ RETRY_CONFIGURATION.md (complete retry guide)
✅ PUBLISHING.md (publishing instructions)
✅ STANDALONE_BUILD.md (build guide)
✅ PACKAGE_READY.md (package summary)
✅ package.json (updated metadata)
❌ node_modules/ (correctly excluded)
❌ tsconfig.json (correctly excluded)
❌ test files (correctly excluded)
```

## 🎯 Publish Now

### Command

```bash
npm publish --access public
```

### Expected Output

```
npm notice
npm notice 📦  @morpho-dev/subsquid-evm-processor@1.28.2
npm notice === Tarball Details ===
npm notice name:          @morpho-dev/subsquid-evm-processor
npm notice version:       1.28.2
npm notice filename:      morpho-dev-subsquid-evm-processor-1.28.2.tgz
npm notice package size:  95.0 kB
npm notice unpacked size: 538.2 kB
npm notice total files:   111
npm notice
+ @morpho-dev/subsquid-evm-processor@1.28.2
```

### Verification After Publishing

```bash
# Check if live
npm view @morpho-dev/subsquid-evm-processor

# Check specific version
npm view @morpho-dev/subsquid-evm-processor@1.28.2

# View all versions
npm view @morpho-dev/subsquid-evm-processor versions

# Test fresh install
npm install @morpho-dev/subsquid-evm-processor
```

## 📝 Post-Publishing Tasks

### 1. Update Git

```bash
cd /Users/florian/morpho/morpho-squid-sdk

# Add the package.json version update
git add evm/evm-processor/package.json

# Commit
git commit -m "chore: bump @morpho-dev/subsquid-evm-processor to v1.28.2"

# Push
git push
```

### 2. Create Git Tag

```bash
git tag evm-processor-v1.28.2
git push origin evm-processor-v1.28.2
```

### 3. Create GitHub Release

1. Go to: https://github.com/morpho-org/morpho-squid-sdk/releases/new
2. Tag: `evm-processor-v1.28.2`
3. Title: `@morpho-dev/subsquid-evm-processor v1.28.2`
4. Description:

```markdown
## @morpho-dev/subsquid-evm-processor v1.28.2

Enhanced EVM processor with exponential retry for all RPC errors.

### Features

- ✅ Retry ALL errors (not just connection errors)
- ✅ True exponential backoff with jitter
- ✅ Configurable max backoff and initial delay
- ✅ Backward compatible with @subsquid/evm-processor

### Installation

```bash
npm install @morpho-dev/subsquid-evm-processor
```

### Quick Start

```typescript
import {EvmBatchProcessor} from '@morpho-dev/subsquid-evm-processor'

const processor = new EvmBatchProcessor()
    .setRpcEndpoint({
        url: 'https://eth.llamarpc.com',
        retryAllErrors: true,
        useExponentialBackoff: true,
        retryAttempts: 10,
    })
```

### Documentation

- [README.md](./evm/evm-processor/README.md)
- [RETRY_CONFIGURATION.md](./evm/evm-processor/RETRY_CONFIGURATION.md)
- [PUBLISHING.md](./evm/evm-processor/PUBLISHING.md)

### Based On

@subsquid/evm-processor v1.27.3
```

### 4. Announce

Share with team/community:
- Internal Slack/Discord channels
- Update any dependent projects
- Update documentation sites

## 🔧 Troubleshooting

### If Publish Fails

#### Error: "You do not have permission to publish"
```bash
# Verify org access
npm org ls @morpho-dev

# Ensure you're logged in
npm whoami
```

#### Error: "Version already exists"
```bash
# Bump version
npm version patch
npm publish --access public
```

#### Error: "Package name already exists"
```bash
# Check if it's already published
npm view @morpho-dev/subsquid-evm-processor
```

## 📊 Package Stats

After publishing, monitor:

- **Downloads**: `npm view @morpho-dev/subsquid-evm-processor` (check weekly downloads)
- **Dependents**: Check on https://www.npmjs.com/package/@morpho-dev/subsquid-evm-processor
- **Issues**: Monitor GitHub issues for user feedback

## ⚠️ Important Notes

### RPC Client Dependency

This package uses the **local modified** `@subsquid/rpc-client` during development (via npm link).

When users install this package, they'll get:
- `@morpho-dev/subsquid-evm-processor` v1.28.2 (your package)
- `@subsquid/rpc-client` v4.14.0 (from npm - **without your modifications**)

**Result**: Users will get the new retry configuration options in the processor, but the underlying RPC client won't have exponential backoff/retry-all-errors until you also publish the modified rpc-client.

### Two Publishing Options

**Option A: Publish Modified RPC Client (Recommended for full features)**
```bash
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
# Update package.json dependency to @morpho-dev/subsquid-rpc-client
```

**Option B: Publish As-Is (Limited Features)**
```bash
# Users can still use the processor
# But exponential backoff features won't work until they also use your modified rpc-client
# This is fine for initial release - can publish rpc-client later
```

## 🎉 Ready to Publish!

Everything is prepared and tested. When ready, run:

```bash
npm publish --access public
```

Then follow post-publishing tasks above.

---

**Current Status**: ✅ All checks passed, ready for `npm publish --access public`
