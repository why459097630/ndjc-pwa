import { readPwaPrivacyCloudProfile } from '@/lib/privacy/readPwaPrivacyCloudProfile'
import {
  buildPwaPrivacyPolicyPageModel,
  renderPwaPrivacyPolicyText
} from '@/lib/privacy/pwaPrivacyPolicyTemplate'

export const dynamic = 'force-dynamic'

export default async function PrivacyPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params

  const cloudProfile = await readPwaPrivacyCloudProfile(storeId)

  const model = buildPwaPrivacyPolicyPageModel({
    storeId,
    appName: cloudProfile?.appName || 'This App',
    merchantEmail: cloudProfile?.merchantEmail || 'Not provided',
    effectiveDate: '2026-04-20'
  })

  const policyText = renderPwaPrivacyPolicyText(model)

  return (
    <main
      style={{
        width: '100%',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: '#ffffff',
        color: '#171717',
        boxSizing: 'border-box',
        padding: '28px 18px 44px',
        fontFamily:
          'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 760,
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#171717',
            fontSize: 28,
            lineHeight: '34px',
            fontWeight: 800,
            letterSpacing: '-0.03em'
          }}
        >
          Privacy Policy
        </h1>

        <section
          style={{
            width: '100%',
            marginTop: 22,
            padding: 18,
            border: '1px solid #e5e7eb',
            borderRadius: 18,
            background: '#f9fafb',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              color: '#6b7280',
              fontSize: 13,
              lineHeight: '18px',
              fontWeight: 500
            }}
          >
            App Name
          </div>
          <div
            style={{
              marginTop: 4,
              color: '#171717',
              fontSize: 17,
              lineHeight: '24px',
              fontWeight: 700
            }}
          >
            {model.appName}
          </div>

          <div
            style={{
              marginTop: 14,
              color: '#6b7280',
              fontSize: 13,
              lineHeight: '18px',
              fontWeight: 500
            }}
          >
            Contact
          </div>
          <div
            style={{
              marginTop: 4,
              color: '#171717',
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 600,
              wordBreak: 'break-word'
            }}
          >
            {model.merchantEmail}
          </div>

          <div
            style={{
              marginTop: 14,
              color: '#6b7280',
              fontSize: 13,
              lineHeight: '18px',
              fontWeight: 500
            }}
          >
            Effective Date
          </div>
          <div
            style={{
              marginTop: 4,
              color: '#171717',
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 600
            }}
          >
            {model.effectiveDate}
          </div>
        </section>

        <section
          style={{
            width: '100%',
            marginTop: 22,
            padding: 18,
            border: '1px solid #e5e7eb',
            borderRadius: 18,
            background: '#ffffff',
            boxSizing: 'border-box'
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#374151',
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: '24px'
            }}
          >
            {policyText}
          </pre>
        </section>
      </section>
    </main>
  )
}