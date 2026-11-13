import * as semver from 'semver'


export async function latestVersion(name: string, options: {version?: string} = {}): Promise<string> {
    let response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name.toLowerCase())}`, {
        headers: {accept: 'application/vnd.npm.install-v1+json'},
        signal: AbortSignal.timeout(30_000)
    })
    if (!response.ok) {
        throw new Error(`Failed to fetch package ${name}: HTTP ${response.status}`)
    }
    let data: {versions?: Record<string, unknown>, 'dist-tags'?: Record<string, string>} = await response.json()
    let requested = options.version || 'latest'
    let version = data['dist-tags']?.[requested]
        || (data.versions?.[requested] ? requested : semver.maxSatisfying(Object.keys(data.versions || {}), requested))
    if (!version || !semver.valid(version) || !data.versions?.[version]) {
        throw new Error(`Version ${requested} for package ${name} could not be found`)
    }
    return version
}
