# @morpho-dev/subsquid-typeorm-store

This package provides TypeORM based database access to squid mapping handlers. This is a Morpho-maintained fork of [@subsquid/typeorm-store](https://github.com/subsquid/squid) with additional features.

## Additional Features

This fork includes the following enhancements over the upstream package:

### 1. Custom TypeORM Configuration
Pass custom TypeORM `DataSourceOptions` instead of using the default configuration:

```typescript
import { TypeormDatabase } from '@morpho-dev/subsquid-typeorm-store'

const database = new TypeormDatabase({
  customTypeOrmOptions: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    // ... other TypeORM options
  }
})
```

### 2. Rollback Hook
Register a callback function that executes whenever a block is rolled back:

```typescript
import { TypeormDatabase } from '@morpho-dev/subsquid-typeorm-store'

const database = new TypeormDatabase({
  rollbackHook: async (blockHeight: number) => {
    console.log(`Block ${blockHeight} was rolled back`)
    // Perform custom cleanup or notification logic
  }
})
```

## Installation

```bash
npm install @morpho-dev/subsquid-typeorm-store
```

## Usage

This package is fully compatible with the upstream `@subsquid/typeorm-store` API. You can use it as a drop-in replacement:

```typescript
import { TypeormDatabase } from '@morpho-dev/subsquid-typeorm-store'

const database = new TypeormDatabase({
  supportHotBlocks: true,
  isolationLevel: 'SERIALIZABLE',
  stateSchema: 'squid_processor',
})

await database.connect()
```

## Upstream

Based on [@subsquid/typeorm-store](https://github.com/subsquid/squid) v1.5.1

## License

GPL-3.0-or-later
