export function parseShowcaseDateInput(value: string | number | Date | null | undefined): Date | null {
  if (value == null) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const source = String(value || '').trim()
  if (!source) return null

  const ymdMatch = source.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (ymdMatch) {
    const date = new Date(Number(ymdMatch[1]), Number(ymdMatch[2]) - 1, Number(ymdMatch[3]))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const date = new Date(source)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatShowcaseDateTime(value: string | number | Date | null | undefined): string {
  const date = parseShowcaseDateInput(value)
  if (!date) return ''

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${datePart}, ${timePart}`
}

export function formatShowcaseDateAndTimeParts(
  dateInput: string | number | Date | null | undefined,
  timeInput: string | null | undefined
): string {
  const rawTime = String(timeInput || '').trim()
  const date = parseShowcaseDateInput(dateInput)

  if (!date && !rawTime) return ''

  if (!date) return rawTime

  const time24Match = rawTime.match(/^(\d{1,2}):(\d{2})$/)

  if (time24Match) {
    date.setHours(Number(time24Match[1]), Number(time24Match[2]), 0, 0)
    return formatShowcaseDateTime(date)
  }

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return [datePart, rawTime].filter(Boolean).join(', ')
}