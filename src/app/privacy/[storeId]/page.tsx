export default async function PrivacyPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: 24, fontFamily: 'inherit' }}>
      <h1>Privacy Policy</h1>
      <p>Store: {storeId}</p>
      <p>
        This page is the PWA-side privacy policy placeholder. Replace it with the generated NDJC
        per-store privacy template during assembly.
      </p>
    </main>
  )
}
