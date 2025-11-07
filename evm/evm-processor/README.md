# @morpho-dev/subsquid-evm-processor

Data fetcher and mappings executor for EVM-based chains with enhanced exponential retry mechanism.

This is a Morpho-maintained fork of [@subsquid/evm-processor](https://github.com/subsquid/squid) with additional features:

- ✅ **Exponential retry for ALL errors** (not just connection errors)
- ✅ **True exponential backoff** with configurable limits
- ✅ **Jitter support** to prevent thundering herd
- ✅ **Enhanced retry configuration** options
- ✅ **Backward compatible** with original @subsquid/evm-processor

## Installation

```bash
npm install @morpho-dev/subsquid-evm-processor
```

## Quick Start

```typescript
import {EvmBatchProcessor} from '@morpho-dev/subsquid-evm-processor'

const processor = new EvmBatchProcessor()
    .setRpcEndpoint({
        url: 'https://eth.llamarpc.com',

        // Enable retry for ALL errors
        retryAllErrors: true,

        // Use exponential backoff
        useExponentialBackoff: true,
        exponentialBackoffInitialDelay: 100,
        maxBackoff: 60000,
        retryJitter: true,

        retryAttempts: 10,
    })
    .addLog({
        address: ['0x...'],
        topic0: ['0x...']
    })

processor.run(database, async ctx => {
    // Your processing logic
})
```

## Enhanced Retry Features

See [RETRY_CONFIGURATION.md](./RETRY_CONFIGURATION.md) for comprehensive documentation on:

- Configuration options
- Use cases and examples
- Best practices
- Migration guide
- Troubleshooting

## Original Documentation

For general usage and API documentation, see the original [@subsquid/evm-processor documentation](https://docs.subsquid.io/sdk/reference/processors/evm-batch/).

## Key Differences from @subsquid/evm-processor

| Feature | @subsquid/evm-processor | @morpho-dev/subsquid-evm-processor |
|---------|------------------------|-----------------------------------|
| Retry connection errors | ✅ | ✅ |
| Retry ALL errors | ❌ | ✅ |
| Exponential backoff | ❌ (fixed schedule) | ✅ |
| Jitter support | ❌ | ✅ |
| Configurable max backoff | ❌ | ✅ |

## License

GPL-3.0-or-later

## Upstream

Based on [@subsquid/evm-processor](https://github.com/subsquid/squid) v1.27.3
