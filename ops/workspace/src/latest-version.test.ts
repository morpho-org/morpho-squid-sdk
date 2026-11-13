import assert from 'assert/strict'
import {afterEach, test} from 'node:test'
import {latestVersion} from './latest-version'


let originalFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = originalFetch })

let metadata = {
    'dist-tags': {latest: '2.0.0', next: '3.0.0-beta.1'},
    versions: {'1.0.0': {}, '1.2.0': {}, '2.0.0': {}, '3.0.0-beta.1': {}}
}

test('uses the latest tag and URL-encodes scoped package names', async () => {
    globalThis.fetch = async url => {
        assert.equal(url, 'https://registry.npmjs.org/%40subsquid%2Flogger')
        return Response.json(metadata)
    }
    assert.equal(await latestVersion('@Subsquid/logger'), '2.0.0')
})

test('selects the highest matching version, exact version or tag', async () => {
    globalThis.fetch = async () => Response.json(metadata)
    assert.equal(await latestVersion('example', {version: '^1.0.0'}), '1.2.0')
    assert.equal(await latestVersion('example', {version: '~1.0.0'}), '1.0.0')
    assert.equal(await latestVersion('example', {version: '1.0.0'}), '1.0.0')
    assert.equal(await latestVersion('example', {version: 'next'}), '3.0.0-beta.1')
})

test('rejects empty metadata and missing versions', async () => {
    globalThis.fetch = async () => Response.json({})
    await assert.rejects(latestVersion('example'), /could not be found/)
    globalThis.fetch = async () => Response.json(metadata)
    await assert.rejects(latestVersion('example', {version: '^4.0.0'}), /could not be found/)
})

test('rejects HTTP errors', async () => {
    globalThis.fetch = async () => new Response(null, {status: 404})
    await assert.rejects(latestVersion('example'), /HTTP 404/)
})

test('propagates network and JSON errors', async () => {
    globalThis.fetch = async () => { throw new Error('network unavailable') }
    await assert.rejects(latestVersion('example'), /network unavailable/)
    globalThis.fetch = async () => new Response('not JSON')
    await assert.rejects(latestVersion('example'), SyntaxError)
})
