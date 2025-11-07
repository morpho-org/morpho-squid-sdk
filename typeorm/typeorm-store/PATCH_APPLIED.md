# TypeORM Store Patch Applied

## Date
November 7, 2025

## Source
Patch from: `/Users/florian/morpho/morpho-blue-api/patches/@subsquid__typeorm-store.patch`

## Changes Applied

### 1. database.ts
- Added `RollbackHook` type: `(block: number) => Promise<void>`
- Added `customTypeOrmOptions?: DataSourceOptions` to `TypeormDatabaseOptions` interface
- Added `rollbackHook?: RollbackHook` to `TypeormDatabaseOptions` interface
- Added private fields to `TypeormDatabase` class:
  - `private customTypeOrmOptions?: DataSourceOptions`
  - `private rollbackHook?: RollbackHook`
- Updated constructor to initialize these new fields
- Modified `connect()` method to use `customTypeOrmOptions` if provided, otherwise fallback to `createOrmConfig()`
- Updated all `rollbackBlock()` calls to pass `this.rollbackHook` parameter (lines 139 and 173)

### 2. hot.ts
- Added import: `import {RollbackHook} from './database'`
- Updated `rollbackBlock()` function signature to accept optional `rollbackHook?: RollbackHook` parameter
- Added hook execution at the end of `rollbackBlock()`:
  ```typescript
  if (rollbackHook) {
      await rollbackHook(blockHeight)
  }
  ```

## Purpose
These changes enable:
1. **Custom TypeORM Configuration**: Allows passing custom TypeORM DataSource options instead of using the default configuration
2. **Rollback Hook**: Allows registering a callback function that gets called whenever a block is rolled back, enabling custom cleanup or notification logic

## Build Status
✅ TypeScript compilation successful
✅ Generated type definitions correct
⚠️  Tests skipped (Docker not running)

## Files Modified
- src/database.ts
- src/hot.ts

## Generated Files
- lib/database.d.ts
- lib/database.js
- lib/database.d.ts.map
- lib/database.js.map
- lib/hot.d.ts
- lib/hot.js
- lib/hot.d.ts.map
- lib/hot.js.map
