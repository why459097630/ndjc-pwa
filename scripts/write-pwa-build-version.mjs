import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

function sanitizeVersionPart(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createBuildVersion() {
  const explicitVersion = sanitizeVersionPart(process.env.NDJC_PWA_BUILD_VERSION)

  if (explicitVersion) {
    return `ndjc-pwa-${explicitVersion}`
  }

  const vercelGitSha = sanitizeVersionPart(process.env.VERCEL_GIT_COMMIT_SHA)
  const vercelDeploymentId = sanitizeVersionPart(process.env.VERCEL_DEPLOYMENT_ID)
  const npmVersion = sanitizeVersionPart(process.env.npm_package_version)
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

  if (vercelGitSha) {
    return `ndjc-pwa-${timestamp}-${vercelGitSha.slice(0, 12)}`
  }

  if (vercelDeploymentId) {
    return `ndjc-pwa-${timestamp}-${vercelDeploymentId.slice(0, 24)}`
  }

  if (npmVersion) {
    return `ndjc-pwa-${npmVersion}-${timestamp}`
  }

  return `ndjc-pwa-${timestamp}`
}

async function main() {
  const swPath = resolve(process.cwd(), 'public', 'sw.js')
  const source = await readFile(swPath, 'utf8')
  const nextVersion = createBuildVersion()
  const nextSource = source.replace(
    /const NDJC_SW_VERSION = ['"`][^'"`]+['"`]/,
    `const NDJC_SW_VERSION = '${nextVersion}'`
  )

  if (nextSource === source) {
    throw new Error('Failed to update NDJC_SW_VERSION in public/sw.js.')
  }

  await writeFile(swPath, nextSource, 'utf8')
  console.log(`NDJC PWA build version written: ${nextVersion}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})