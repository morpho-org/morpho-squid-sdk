# Publishing Guide for @morpho-dev/subsquid-typeorm-store

## Pre-Publishing Checklist
✅ Package name updated to @morpho-dev/subsquid-typeorm-store
✅ Version set to 1.5.2
✅ README updated with Morpho branding
✅ Package built successfully
✅ All source files modified correctly

## Publishing Steps

### 1. Login to npm
You need to be logged in to npm with an account that has permission to publish to the @morpho-dev scope.

```bash
npm login
```

This will prompt you for:
- Username
- Password
- Email
- 2FA code (if enabled)

### 2. Verify Your Account
After logging in, verify you're logged in correctly:

```bash
npm whoami
```

### 3. Check Package Contents
Before publishing, verify what will be included in the package:

```bash
npm pack --dry-run
```

This shows you exactly what files will be published without actually creating a tarball.

### 4. Publish to npm

#### Option A: Publish with Tag (Recommended for first release)
Publish with a tag first to test:

```bash
npm publish --tag beta
```

Then install and test:
```bash
npm install @morpho-dev/subsquid-typeorm-store@beta
```

If everything works, promote to latest:
```bash
npm dist-tag add @morpho-dev/subsquid-typeorm-store@1.5.2 latest
```

#### Option B: Direct Publish (Production)
Publish directly as latest:

```bash
npm publish
```

### 5. Verify Publication
Check that the package is published:

```bash
npm view @morpho-dev/subsquid-typeorm-store
```

Visit the package page:
https://www.npmjs.com/package/@morpho-dev/subsquid-typeorm-store

## Package Details

**Name:** @morpho-dev/subsquid-typeorm-store
**Version:** 1.5.2
**Based on:** @subsquid/typeorm-store v1.5.1
**License:** GPL-3.0-or-later

## What Gets Published

The following will be included (as per package.json "files" field):
- `lib/` - Compiled JavaScript and type definitions
- `src/` - TypeScript source files (excluding tests)
- `package.json`
- `README.md`
- `LICENSE` (if present)

## Important Notes

1. **Scope Permissions**: Ensure your npm account has permission to publish to the @morpho-dev scope
   - If this is the first package under @morpho-dev, you may need to create the organization first
   - Run: `npm org set morpho-dev [your-username] developer`

2. **Two-Factor Authentication**: If enabled, you'll need your 2FA code for publishing

3. **Version Bump**: For future updates, remember to bump the version:
   ```bash
   npm version patch  # 1.5.2 -> 1.5.3
   npm version minor  # 1.5.2 -> 1.6.0
   npm version major  # 1.5.2 -> 2.0.0
   ```

4. **Dry Run**: Always test with `npm publish --dry-run` first to see what would be published

## Troubleshooting

### Error: "You do not have permission to publish"
- Verify you're logged in: `npm whoami`
- Check you have access to @morpho-dev scope
- Contact the organization admin to grant you publish rights

### Error: "Package name too similar to existing package"
- The name @morpho-dev/subsquid-typeorm-store is unique enough, shouldn't be an issue

### Error: "Version already exists"
- You cannot republish the same version
- Bump the version in package.json and rebuild

## Post-Publishing

After successful publication:

1. Update your projects to use the new package:
   ```bash
   npm uninstall @subsquid/typeorm-store
   npm install @morpho-dev/subsquid-typeorm-store
   ```

2. Update import statements (if needed - though they should be the same)

3. Test thoroughly in your applications

4. Create a git tag for the release:
   ```bash
   git tag v1.5.2
   git push origin v1.5.2
   ```

## Support

For issues with this package, please open an issue on the repository:
https://github.com/morpho-org/morpho-squid-sdk/issues
