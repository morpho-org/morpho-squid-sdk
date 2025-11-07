# Exponential Retry Configuration for RPC Calls

This document describes the enhanced retry mechanism implemented for RPC calls in `@morpho-dev/subsquid-evm-processor`.

## Overview

The RPC client now supports exponential backoff retry for **all errors**, not just connection errors. This provides better resilience against transient failures, rate limiting, and various RPC provider issues.

## Key Features

### 1. **Retry All Errors** (New!)
- **Before**: Only connection errors (429, 502, 503, 504, 521-524) were retried
- **After**: ALL errors can be retried, including RpcError, RpcProtocolError, and any other failures

### 2. **Exponential Backoff** (New!)
- True exponential backoff: delays double on each retry (100ms → 200ms → 400ms → 800ms → 1600ms...)
- Configurable initial delay and maximum backoff
- Prevents indefinite growth with `maxBackoff` limit

### 3. **Jitter** (New!)
- Adds randomization to prevent thundering herd problem
- Actual delay randomized between 50% and 100% of calculated delay
- Example: 800ms delay becomes random value between 400ms and 800ms

### 4. **Backward Compatible**
- Legacy fixed retry schedule still supported
- Default behavior unchanged (only retries connection errors)
- All new features are opt-in

## Configuration Options

### Basic Configuration

```typescript
import {EvmBatchProcessor} from '@morpho-dev/subsquid-evm-processor'

const processor = new EvmBatchProcessor()
    .setRpcEndpoint({
        url: 'https://eth.llamarpc.com',

        // Maximum retry attempts (default: infinite)
        retryAttempts: 10,

        // Request timeout in milliseconds
        requestTimeout: 30000,

        // Concurrent request capacity
        capacity: 10,
    })
```

### Exponential Backoff Configuration

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',

    // Enable exponential backoff (default: false)
    useExponentialBackoff: true,

    // Initial delay for exponential backoff (default: 100ms)
    exponentialBackoffInitialDelay: 100,

    // Maximum backoff delay (default: 60000ms = 60 seconds)
    maxBackoff: 60000,

    // Enable jitter to prevent thundering herd (default: true)
    retryJitter: true,

    // Maximum retry attempts
    retryAttempts: 10,
})
```

### Retry All Errors Configuration

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',

    // Retry ALL errors, not just connection errors (default: false)
    retryAllErrors: true,

    // Enable exponential backoff for all errors
    useExponentialBackoff: true,

    // Maximum retry attempts
    retryAttempts: 10,

    // Maximum backoff delay
    maxBackoff: 60000,
})
```

## Retry Behavior Examples

### Example 1: Connection Errors Only (Default)

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 5,
})

// Retries:
// - HTTP 429, 502, 503, 504, 521, 522, 523, 524
// - Connection timeouts
// - Network errors
//
// Does NOT retry:
// - RpcError (invalid method, invalid params, etc.)
// - RpcProtocolError (malformed JSON, protocol violations)
// - HTTP 400, 401, 403, 500, etc.
```

### Example 2: All Errors with Exponential Backoff

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAllErrors: true,
    useExponentialBackoff: true,
    exponentialBackoffInitialDelay: 100,
    maxBackoff: 30000, // 30 seconds max
    retryAttempts: 8,
})

// Retry schedule with jitter (50-100% of calculated delay):
// Attempt 1: 50-100ms
// Attempt 2: 100-200ms
// Attempt 3: 200-400ms
// Attempt 4: 400-800ms
// Attempt 5: 800-1600ms
// Attempt 6: 1600-3200ms
// Attempt 7: 3200-6400ms
// Attempt 8: 6400-12800ms (capped at maxBackoff if needed)
//
// Retries ALL errors:
// - Connection errors (as before)
// - RpcError (server returned error)
// - RpcProtocolError (protocol violations)
// - Any other error
```

### Example 3: Fixed Schedule (Legacy)

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 10,
    // Uses default retry schedule: [10, 100, 500, 2000, 10000, 20000]
})

// Retry schedule:
// Attempt 1: 10ms
// Attempt 2: 100ms
// Attempt 3: 500ms
// Attempt 4: 2000ms (2 seconds)
// Attempt 5: 10000ms (10 seconds)
// Attempt 6+: 20000ms (20 seconds) - stays at this value
```

## Use Cases

### 1. **Unreliable RPC Provider**
If your RPC provider frequently has transient errors:

```typescript
processor.setRpcEndpoint({
    url: 'https://unreliable-rpc.example.com',
    retryAllErrors: true,
    useExponentialBackoff: true,
    retryAttempts: 15,
    maxBackoff: 60000,
})
```

### 2. **Rate-Limited Endpoint**
If you're hitting rate limits:

```typescript
processor.setRpcEndpoint({
    url: 'https://rate-limited-rpc.example.com',
    retryAllErrors: true,
    useExponentialBackoff: true,
    exponentialBackoffInitialDelay: 500, // Start slower
    maxBackoff: 120000, // Allow up to 2 minutes
    retryAttempts: 20,
    rateLimit: 10, // Limit to 10 requests per second
})
```

### 3. **Production Critical System**
For maximum resilience in production:

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAllErrors: true,
    useExponentialBackoff: true,
    exponentialBackoffInitialDelay: 100,
    maxBackoff: 60000,
    retryJitter: true,
    retryAttempts: Number.MAX_SAFE_INTEGER, // Retry indefinitely
    capacity: 15,
    requestTimeout: 45000,
})
```

### 4. **Fast Development / Testing**
For quick iteration during development:

```typescript
processor.setRpcEndpoint({
    url: 'http://localhost:8545',
    retryAttempts: 3, // Fail fast
    requestTimeout: 5000,
    useExponentialBackoff: false,
})
```

## Error Types and Retry Behavior

| Error Type | Default Retry | With `retryAllErrors: true` |
|------------|---------------|----------------------------|
| HTTP 429 (Rate Limit) | ✅ Yes | ✅ Yes |
| HTTP 502, 503, 504 (Server Error) | ✅ Yes | ✅ Yes |
| HTTP 521, 522, 523, 524 (Cloudflare) | ✅ Yes | ✅ Yes |
| HTTP Timeout | ✅ Yes | ✅ Yes |
| Connection Error | ✅ Yes | ✅ Yes |
| RpcError (Invalid method) | ❌ No | ✅ Yes |
| RpcError (Invalid params) | ❌ No | ✅ Yes |
| RpcProtocolError | ❌ No | ✅ Yes |
| HTTP 400, 401, 403 | ❌ No | ✅ Yes |
| HTTP 500 | ❌ No | ✅ Yes |

## Monitoring

The RPC client emits metrics that can be monitored:

```typescript
const metrics = processor.getChain().client.getMetrics()

console.log({
    url: metrics.url,
    requestsServed: metrics.requestsServed,
    connectionErrors: metrics.connectionErrors,
    avgResponseTime: metrics.avgResponseTime,
})
```

## Best Practices

### 1. **Start Conservative**
Begin with default settings and only enable aggressive retries if needed:

```typescript
// Start with this
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 5,
})

// Escalate if needed
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAllErrors: true,
    useExponentialBackoff: true,
    retryAttempts: 10,
})
```

### 2. **Monitor Error Rates**
Track error rates and adjust retry settings accordingly:

```typescript
// Log errors to understand patterns
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAllErrors: true,
    retryAttempts: 10,
})

// Check metrics regularly
setInterval(() => {
    const metrics = processor.getChain().client.getMetrics()
    const errorRate = metrics.connectionErrors / metrics.requestsServed
    console.log(`Error rate: ${(errorRate * 100).toFixed(2)}%`)
}, 60000)
```

### 3. **Consider Cost**
More retries = more RPC calls = higher costs with some providers:

```typescript
// Balance between reliability and cost
processor.setRpcEndpoint({
    url: 'https://expensive-rpc.example.com',
    retryAttempts: 5, // Don't retry forever
    maxBackoff: 30000, // Don't wait too long
})
```

### 4. **Use Jitter**
Always enable jitter in production to prevent thundering herd:

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    useExponentialBackoff: true,
    retryJitter: true, // This is the default, but make it explicit
})
```

## Migration Guide

### From Previous Version

**No changes required!** The default behavior is unchanged:
- Only connection errors are retried
- Uses fixed retry schedule
- Same retry attempts configuration

### To Enable New Features

```typescript
// Before (still works)
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 10,
})

// After (with new features)
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 10,
    retryAllErrors: true,           // NEW: retry all errors
    useExponentialBackoff: true,    // NEW: exponential backoff
    maxBackoff: 60000,              // NEW: cap backoff delay
    retryJitter: true,              // NEW: add jitter
})
```

## Troubleshooting

### Issue: Too Many Retries

**Symptom**: Logs show excessive retry attempts

**Solution**: Reduce `retryAttempts` or disable `retryAllErrors`:

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAttempts: 5,  // Reduce from default
    retryAllErrors: false,  // Only retry connection errors
})
```

### Issue: Slow Processing

**Symptom**: Data ingestion is slower than expected

**Solution**: Reduce `maxBackoff` or disable exponential backoff:

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    useExponentialBackoff: false,  // Use fixed schedule
    maxBackoff: 10000,  // Cap at 10 seconds
})
```

### Issue: Still Seeing Connection Errors

**Symptom**: Errors not being retried

**Solution**: Ensure `retryAllErrors` is enabled:

```typescript
processor.setRpcEndpoint({
    url: 'https://eth.llamarpc.com',
    retryAllErrors: true,  // Must enable to retry all errors
    retryAttempts: 10,
})
```

## Technical Details

### Exponential Backoff Formula

```
delay = min(initialDelay * 2^(attempt - 1), maxBackoff)

// With jitter:
actualDelay = delay * random(0.5, 1.0)
```

### Example Calculation

With `initialDelay=100`, `maxBackoff=60000`:

| Attempt | Base Delay | With Jitter (50-100%) |
|---------|------------|----------------------|
| 1 | 100ms | 50-100ms |
| 2 | 200ms | 100-200ms |
| 3 | 400ms | 200-400ms |
| 4 | 800ms | 400-800ms |
| 5 | 1,600ms | 800-1,600ms |
| 6 | 3,200ms | 1,600-3,200ms |
| 7 | 6,400ms | 3,200-6,400ms |
| 8 | 12,800ms | 6,400-12,800ms |
| 9 | 25,600ms | 12,800-25,600ms |
| 10 | 51,200ms | 25,600-51,200ms |
| 11+ | 60,000ms (capped) | 30,000-60,000ms |

## Related Documentation

- [RpcClient Options](../../util/rpc-client/src/client.ts) - Full RpcClientOptions interface
- [Processor API](./src/processor.ts) - EvmBatchProcessor API documentation
- [Error Types](../../util/rpc-client/src/errors.ts) - RPC error definitions
