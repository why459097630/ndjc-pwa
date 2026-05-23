import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const errors = []
const warnings = []

function toAbsolutePath(relativePath) {
  return path.join(rootDir, relativePath)
}

function normalizePath(relativePath) {
  return relativePath.split(path.sep).join('/')
}

function fileExists(relativePath) {
  return fs.existsSync(toAbsolutePath(relativePath)) && fs.statSync(toAbsolutePath(relativePath)).isFile()
}

function readText(relativePath) {
  return fs.readFileSync(toAbsolutePath(relativePath), 'utf8')
}

function addError(message) {
  errors.push(message)
}

function addWarning(message) {
  warnings.push(message)
}

function requireFile(relativePath, reason) {
  if (!fileExists(relativePath)) {
    addError(`Missing required file: ${normalizePath(relativePath)}${reason ? ` (${reason})` : ''}`)
    return false
  }

  return true
}

function requireText(relativePath, matcher, message) {
  if (!fileExists(relativePath)) {
    addError(`Cannot inspect missing file: ${normalizePath(relativePath)}`)
    return
  }

  const text = readText(relativePath)
  const matched = typeof matcher === 'string' ? text.includes(matcher) : matcher.test(text)

  if (!matched) {
    addError(`${normalizePath(relativePath)}: ${message}`)
  }
}

function warnText(relativePath, matcher, message) {
  if (!fileExists(relativePath)) {
    return
  }

  const text = readText(relativePath)
  const matched = typeof matcher === 'string' ? text.includes(matcher) : matcher.test(text)

  if (!matched) {
    addWarning(`${normalizePath(relativePath)}: ${message}`)
  }
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath))
  } catch (error) {
    addError(`${normalizePath(relativePath)}: invalid JSON (${error instanceof Error ? error.message : String(error)})`)
    return null
  }
}

function readPngSize(relativePath) {
  const buffer = fs.readFileSync(toAbsolutePath(relativePath))
  const pngSignature = '89504e470d0a1a0a'

  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) {
    return null
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  }
}

function requirePngSize(relativePath, expectedWidth, expectedHeight) {
  if (!requireFile(relativePath, `${expectedWidth}x${expectedHeight} PNG icon`)) {
    return
  }

  const size = readPngSize(relativePath)

  if (!size) {
    addError(`${normalizePath(relativePath)}: expected PNG file`)
    return
  }

  if (size.width !== expectedWidth || size.height !== expectedHeight) {
    addError(`${normalizePath(relativePath)}: expected ${expectedWidth}x${expectedHeight}, got ${size.width}x${size.height}`)
  }
}

function validateRequiredFiles() {
  requireFile('package.json', 'project scripts and dependencies')
  requireFile('next.config.mjs', 'Next.js project config')
  requireFile('tsconfig.json', 'TypeScript project config')
  requireFile('src/app/layout.tsx', 'root PWA metadata')
  requireFile('src/app/manifest.ts', 'root PWA manifest')
  requireFile('src/app/page.tsx', 'root app entry')
  requireFile('src/app/pwa/[storeId]/page.tsx', 'store PWA entry')
  requireFile('src/app/pwa/[storeId]/manifest.webmanifest/route.ts', 'store-specific PWA manifest route')
  requireFile('src/pwa/registerServiceWorker.ts', 'service worker registration helper')
  requireFile('src/pwa/storePwaManifest.ts', 'store-specific manifest builder')
  requireFile('public/sw.js', 'service worker')
  requireFile('public/offline.html', 'offline fallback page')
}

function validatePackageJson() {
  const packageJson = readJson('package.json')

  if (!packageJson) {
    return
  }

  const requiredScripts = {
    build: 'next build',
    start: 'next start',
    typecheck: 'tsc --noEmit',
    validate: 'node scripts/validate-template.mjs'
  }

  const scripts = packageJson.scripts || {}

  Object.entries(requiredScripts).forEach(([name, expectedValue]) => {
    if (scripts[name] !== expectedValue) {
      addError(`package.json scripts.${name}: expected "${expectedValue}", got ${JSON.stringify(scripts[name])}`)
    }
  })

  const requiredDependencies = ['next', 'react', 'react-dom', 'typescript', '@supabase/supabase-js', 'firebase']
  const dependencies = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  }

  requiredDependencies.forEach(dependencyName => {
    if (!dependencies[dependencyName]) {
      addError(`package.json: missing dependency "${dependencyName}"`)
    }
  })
}

function validateIcons() {
  requirePngSize('public/icons/icon-192.png', 192, 192)
  requirePngSize('public/icons/icon-512.png', 512, 512)
  requirePngSize('public/icons/maskable-192.png', 192, 192)
  requirePngSize('public/icons/maskable-512.png', 512, 512)
  requirePngSize('public/icons/apple-touch-icon.png', 180, 180)
}

function validateRootLayout() {
  requireText('src/app/layout.tsx', /manifest:\s*['"]\/manifest\.webmanifest['"]/, 'metadata.manifest must point to /manifest.webmanifest')
  requireText('src/app/layout.tsx', /appleWebApp:\s*{/, 'metadata.appleWebApp must be configured')
  requireText('src/app/layout.tsx', /viewportFit:\s*['"]cover['"]/, 'viewport.viewportFit must be cover for mobile safe-area support')
  requireText('src/app/layout.tsx', /themeColor:\s*['"]#[0-9a-fA-F]{6}['"]/, 'viewport.themeColor must be configured')
  requireText('src/app/layout.tsx', /mobile-web-app-capable/, 'mobile-web-app-capable meta must be configured')
  requireText('src/app/layout.tsx', /apple-mobile-web-app-capable/, 'apple-mobile-web-app-capable meta must be configured')
}

function validateRootManifest() {
  requireText('src/app/manifest.ts', /display:\s*['"]standalone['"]/, 'manifest display must be standalone')
  requireText('src/app/manifest.ts', /start_url:\s*['"]\/['"]/, 'manifest start_url must be /')
  requireText('src/app/manifest.ts', /scope:\s*['"]\/['"]/, 'manifest scope must be /')
  requireText('src/app/manifest.ts', /theme_color:\s*['"]#[0-9a-fA-F]{6}['"]/, 'manifest theme_color must be configured')
  requireText('src/app/manifest.ts', /background_color:\s*['"]#[0-9a-fA-F]{6}['"]/, 'manifest background_color must be configured')
  requireText('src/app/manifest.ts', /src:\s*['"]\/icons\/icon-192\.png['"]/, 'manifest must include /icons/icon-192.png')
  requireText('src/app/manifest.ts', /src:\s*['"]\/icons\/icon-512\.png['"]/, 'manifest must include /icons/icon-512.png')
  requireText('src/app/manifest.ts', /src:\s*['"]\/icons\/maskable-192\.png['"]/, 'manifest must include /icons/maskable-192.png')
  requireText('src/app/manifest.ts', /src:\s*['"]\/icons\/maskable-512\.png['"]/, 'manifest must include /icons/maskable-512.png')
  requireText('src/app/manifest.ts', /purpose:\s*['"]maskable['"]/, 'manifest must include maskable icons')
}

function validateStoreManifestRoute() {
  requireText('src/app/pwa/[storeId]/manifest.webmanifest/route.ts', /buildStorePwaManifest/, 'store manifest route must use buildStorePwaManifest')
  requireText('src/app/pwa/[storeId]/manifest.webmanifest/route.ts', /Content-Type['"]?\s*:\s*['"]application\/manifest\+json; charset=utf-8['"]/, 'store manifest route must return application/manifest+json')
  requireText('src/app/pwa/[storeId]/manifest.webmanifest/route.ts', /Cache-Control['"]?\s*:\s*['"]public, max-age=300, stale-while-revalidate=86400['"]/, 'store manifest route must set a bounded public cache policy')
}

function validateServiceWorker() {
  requireText('public/sw.js', /NDJC_SW_VERSION/, 'service worker version constant is required')
  requireText('public/sw.js', /NDJC_OFFLINE_URL\s*=\s*['"]\/offline\.html['"]/, 'service worker must define /offline.html fallback')
  requireText('public/sw.js', /cache\.addAll\(NDJC_APP_SHELL_URLS\)/, 'service worker must precache app shell URLs')
  requireText('public/sw.js', /self\.addEventListener\(['"]install['"]/, 'service worker must handle install')
  requireText('public/sw.js', /self\.addEventListener\(['"]activate['"]/, 'service worker must handle activate')
  requireText('public/sw.js', /self\.addEventListener\(['"]fetch['"]/, 'service worker must handle fetch')
  requireText('public/sw.js', /request\.mode\s*===\s*['"]navigate['"]/, 'service worker must detect navigation requests')
  requireText('public/sw.js', /navigationCache\.match\(request\)/, 'service worker must serve cached navigation pages while offline')
  requireText('public/sw.js', /staticCache\.match\(NDJC_OFFLINE_URL\)/, 'service worker must serve offline fallback page')
  requireText('public/sw.js', /self\.addEventListener\(['"]push['"]/, 'service worker must handle push notifications')
  requireText('public/sw.js', /self\.addEventListener\(['"]notificationclick['"]/, 'service worker must handle notification clicks')

  warnText('public/sw.js', /pathname\.startsWith\(['"]\/pwa\/['"]\).*manifest\.webmanifest|manifest\.webmanifest.*pathname\.startsWith\(['"]\/pwa\/['"]\)/s, 'dynamic /pwa/{storeId}/manifest.webmanifest is not explicitly runtime-cached')
}

function validateOfflinePage() {
  requireText('public/offline.html', /<html/i, 'offline page must be valid HTML')
  requireText('public/offline.html', /viewport/i, 'offline page must include a viewport meta tag')
  requireText('public/offline.html', /offline|离线/i, 'offline page must include an offline message')
}

function validateServiceWorkerRegistration() {
  requireText('src/pwa/registerServiceWorker.ts', /navigator\.serviceWorker\.register\(['"]\/sw\.js['"]/, 'service worker registration must register /sw.js')
  requireText('src/pwa/registerServiceWorker.ts', /serviceWorker'\s+in\s+navigator|['"]serviceWorker['"]\s+in\s+navigator/, 'service worker registration must check browser support')
}

function printResult() {
  warnings.forEach(message => {
    console.warn(`⚠ ${message}`)
  })

  if (errors.length > 0) {
    console.error('\nNDJC PWA template validation failed:')
    errors.forEach(message => {
      console.error(`✖ ${message}`)
    })
    process.exit(1)
  }

  console.log('NDJC PWA template validation passed.')

  if (warnings.length > 0) {
    console.log(`${warnings.length} warning(s) found. These are not blocking, but should be reviewed before commercial freeze.`)
  }
}

validateRequiredFiles()
validatePackageJson()
validateIcons()
validateRootLayout()
validateRootManifest()
validateStoreManifestRoute()
validateServiceWorker()
validateOfflinePage()
validateServiceWorkerRegistration()
printResult()