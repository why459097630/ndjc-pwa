'use client'

import React from 'react'
import {
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import {
  APK_EDIT_ITEM_UI,
  APK_FILTER_UI
} from './showcaseControls'
import { NdjcSpinner } from './showcaseLayout'
import { NDJC_ADMIN_TOOL_UI } from './showcaseAdmin'

const CATEGORY_TEXT_CHIP_PADDING_X = 12
const CATEGORY_TEXT_CHIP_FONT_SIZE = 12


function categoryPillButtonStyle(selected?: boolean, disabled?: boolean): React.CSSProperties {
  return {
    height: APK_FILTER_UI.chipHeight,
    minHeight: APK_FILTER_UI.chipHeight,
    flex: '0 0 auto',
    maxWidth: 'none',
    border: 0,
    borderRadius: APK_FILTER_UI.chipRadius,
    padding: `0 ${CATEGORY_TEXT_CHIP_PADDING_X}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: selected ? APK_FILTER_UI.chipSelectedTextColor : APK_FILTER_UI.chipTextColor,
    background: selected ? APK_FILTER_UI.chipSelectedBg : APK_FILTER_UI.chipUnselectedBg,
    boxShadow: 'none',
    fontSize: CATEGORY_TEXT_CHIP_FONT_SIZE,
    lineHeight: 1,
    fontWeight: selected ? 700 : APK_FILTER_UI.chipTextWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    ['--ndjc-pill-pressed-scale' as string]: String(APK_FILTER_UI.chipPressedScale)
  } as React.CSSProperties
}

function CategoryPillButton({
  children,
  selected,
  onClick,
  disabled,
  className
}: {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-pill-button', selected && 'is-selected', className)}
      style={categoryPillButtonStyle(selected, disabled)}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
      aria-pressed={selected}
    >
      <span
        style={{
          minWidth: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          lineHeight: 1,
          transform: 'translateY(1px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </span>
    </button>
  )
}

export function useNdjcHorizontalDragScroll() {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const dragRef = React.useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    dragging: false,
    movedEnoughToSuppressClick: false,
    suppressClickUntil: 0
  })

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const element = scrollRef.current
    if (!element) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: element.scrollLeft,
      dragging: false,
      movedEnoughToSuppressClick: false,
      suppressClickUntil: dragRef.current.suppressClickUntil
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>): void {
    const element = scrollRef.current
    const state = dragRef.current

    if (!element || state.pointerId !== event.pointerId) return

    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (!state.dragging && absX < 8) return
    if (!state.dragging && absY > absX) return

    state.dragging = true
    element.scrollLeft = state.startScrollLeft - deltaX

    if (absX >= 14 && absX > absY + 4) {
      state.movedEnoughToSuppressClick = true
      state.suppressClickUntil = Date.now() + 180
      event.preventDefault()
    }
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>): void {
    const state = dragRef.current

    if (state.pointerId !== event.pointerId) return

    dragRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      dragging: false,
      movedEnoughToSuppressClick: false,
      suppressClickUntil: state.movedEnoughToSuppressClick ? Date.now() + 180 : 0
    }
  }

  function shouldSuppressClick(): boolean {
    return Date.now() < dragRef.current.suppressClickUntil
  }

  return {
    scrollRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
    onPointerLeave: onPointerEnd,
    shouldSuppressClick
  }
}
export function CategoryChipsRow({
  selectedCategory,
  manualCategories,
  onCategorySelected,
  showAllChip = true,
  useOuterHorizontalPadding = true,
  chipVariant = 'pill'
}: {
  selectedCategory: string | null
  manualCategories: string[]
  onCategorySelected: (value: string | null) => void
  showAllChip?: boolean
  useOuterHorizontalPadding?: boolean
  chipVariant?: 'pill' | 'textOnly'
}) {
  const [expanded, setExpanded] = React.useState(false)
  const [morePressed, setMorePressed] = React.useState(false)
  const [pressedTextOnlyCategoryKey, setPressedTextOnlyCategoryKey] = React.useState<string | null>(null)
  const horizontalScroll = useNdjcHorizontalDragScroll()
  const maxVisibleCategories = 6
  const shouldShowMore = manualCategories.length > maxVisibleCategories
  const visibleCategories = shouldShowMore ? manualCategories.slice(0, maxVisibleCategories) : manualCategories
  const remainingCategories = shouldShowMore ? manualCategories.slice(maxVisibleCategories) : []
  const useTextOnlyChips = chipVariant === 'textOnly'
  const textOnlyCategoryChipStyle = (selected: boolean, pressed: boolean): React.CSSProperties => ({
    height: APK_FILTER_UI.chipHeight,
    minHeight: APK_FILTER_UI.chipHeight,
    flex: '0 0 auto',
    maxWidth: 'none',
    border: 0,
    borderRadius: 0,
    padding: `0 ${CATEGORY_TEXT_CHIP_PADDING_X}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: selected ? NDJC_ADMIN_TOOL_UI.emphasis : NDJC_ADMIN_TOOL_UI.weakText,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: CATEGORY_TEXT_CHIP_FONT_SIZE,
    lineHeight: 1,
    fontWeight: selected ? 700 : 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: pressed ? 0.72 : 1,
    cursor: 'pointer',
    boxSizing: 'border-box',
    appearance: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    transform: pressed ? 'scale(0.97)' : 'scale(1)',
    transition: 'color 140ms ease, font-weight 140ms ease, opacity 120ms ease, transform 120ms ease'
  })

  return (
    <section
      className="ndjc-category-chips-block"
      style={{
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: APK_FILTER_UI.expandedCategoryGap,
        overflow: 'visible',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="ndjc-category-chips-row"
        style={{
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          padding: useOuterHorizontalPadding ? `0 ${APK_FILTER_UI.pagePaddingX}px` : 0,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <div
          ref={horizontalScroll.scrollRef}
          className="ndjc-category-chips-scroll"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
            height: APK_FILTER_UI.chipHeight + 4,
            minHeight: APK_FILTER_UI.chipHeight + 4,
            display: 'block',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehaviorX: 'contain',
            padding: '2px 0',
            boxSizing: 'border-box'
          }}
          role="list"
          aria-label="Categories"
          onPointerDown={horizontalScroll.onPointerDown}
          onPointerMove={horizontalScroll.onPointerMove}
          onPointerUp={horizontalScroll.onPointerUp}
          onPointerCancel={horizontalScroll.onPointerCancel}
          onPointerLeave={horizontalScroll.onPointerLeave}
        >
          <div
            style={{
              width: 'max-content',
              minWidth: 'max-content',
              height: APK_FILTER_UI.chipHeight,
              minHeight: APK_FILTER_UI.chipHeight,
              display: 'flex',
              alignItems: 'center',
              gap: APK_FILTER_UI.chipGap
            }}
          >
            {showAllChip ? (
              <span
                style={{
                  flex: '0 0 auto',
                  height: APK_FILTER_UI.chipHeight,
                  minHeight: APK_FILTER_UI.chipHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {useTextOnlyChips ? (
                  <button
                    type="button"
                    className={cx('ndjc-category-text-chip', selectedCategory == null && 'is-selected')}
                    style={textOnlyCategoryChipStyle(selectedCategory == null, pressedTextOnlyCategoryKey === '__all__')}
                    onPointerDown={() => setPressedTextOnlyCategoryKey('__all__')}
                    onPointerUp={() => setPressedTextOnlyCategoryKey(null)}
                    onPointerCancel={() => setPressedTextOnlyCategoryKey(null)}
                    onPointerLeave={() => setPressedTextOnlyCategoryKey(null)}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(null)
  setExpanded(false)
}}
                    aria-pressed={selectedCategory == null}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        lineHeight: 1,
                        transform: 'translateY(1px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      All
                    </span>
                  </button>
                ) : (
                  <CategoryPillButton
                    selected={selectedCategory == null}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(null)
  setExpanded(false)
}}
                  >
                    All
                  </CategoryPillButton>
                )}
              </span>
            ) : null}

            {visibleCategories.map(category => {
              const selected = selectedCategory === category

              return (
                <span
                  key={category}
                  style={{
                    flex: '0 0 auto',
                    height: APK_FILTER_UI.chipHeight,
                    minHeight: APK_FILTER_UI.chipHeight,
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {useTextOnlyChips ? (
                    <button
                      type="button"
                      className={cx('ndjc-category-text-chip', selected && 'is-selected')}
                      style={textOnlyCategoryChipStyle(selected, pressedTextOnlyCategoryKey === category)}
                      onPointerDown={() => setPressedTextOnlyCategoryKey(category)}
                      onPointerUp={() => setPressedTextOnlyCategoryKey(null)}
                      onPointerCancel={() => setPressedTextOnlyCategoryKey(null)}
                      onPointerLeave={() => setPressedTextOnlyCategoryKey(null)}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(category)
  setExpanded(false)
}}
                      aria-pressed={selected}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          lineHeight: 1,
                          transform: 'translateY(1px)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {category}
                      </span>
                    </button>
                  ) : (
                    <CategoryPillButton
                      selected={selected}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(category)
  setExpanded(false)
}}
                    >
                      {category}
                    </CategoryPillButton>
                  )}
                </span>
              )
            })}

            {shouldShowMore ? (
              <span
                style={{
                  flex: '0 0 auto',
                  height: APK_FILTER_UI.chipHeight,
                  minHeight: APK_FILTER_UI.chipHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <button
                  type="button"
                  className="ndjc-category-more-chip"
                  style={{
                    width: APK_FILTER_UI.chipHeight,
                    minWidth: APK_FILTER_UI.chipHeight,
                    height: APK_FILTER_UI.chipHeight,
                    border: `${APK_FILTER_UI.chipBorderWidth}px solid ${APK_FILTER_UI.chipBorderColor}`,
                    borderRadius: APK_FILTER_UI.moreChipRadius,
                    padding: 0,
                    display: 'inline-grid',
                    flex: '0 0 auto',
                    placeItems: 'center',
                    color: APK_FILTER_UI.chipTextColor,
                    background: APK_FILTER_UI.chipUnselectedBg,
                    boxShadow: 'none',
                    fontSize: 18,
                    lineHeight: 1,
                    cursor: 'pointer',
                    transform: morePressed ? `scale(${APK_FILTER_UI.chipPressedScale})` : 'scale(1)',
                    transition: 'transform 120ms ease, background 120ms ease',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  onPointerDown={() => setMorePressed(true)}
                  onPointerUp={() => setMorePressed(false)}
                  onPointerCancel={() => setMorePressed(false)}
                  onPointerLeave={() => setMorePressed(false)}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  setExpanded(value => !value)
}}
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Collapse categories' : 'Expand categories'}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={{
                      display: 'block',
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 120ms ease'
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
                    />
                  </svg>
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {expanded && remainingCategories.length ? (
        <div
          className="ndjc-category-chips-expanded"
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            padding: useOuterHorizontalPadding ? `0 ${APK_FILTER_UI.pagePaddingX}px` : 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: APK_FILTER_UI.chipGap,
            overflow: 'visible',
paddingBottom: 2,
            boxSizing: 'border-box'
          }}
          role="list"
          aria-label="More categories"
        >
          {remainingCategories.map(category => {
            const selected = selectedCategory === category

            return (
              <CategoryPillButton
                key={category}
                selected={selected}
                onClick={() => {
                  onCategorySelected(category)
                  setExpanded(false)
                }}
              >
                {category}
              </CategoryPillButton>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export function SectionDivider() {
  return (
    <div
      className="ndjc-section-divider"
      style={{
        width: '100%',
        height: 1,
        background: 'rgba(0, 0, 0, 0.12)',
        flexShrink: 0
      }}
    />
  )
}

export function EditItemSpacer({ height }: { height: number }) {
  return <div style={{ height, flexShrink: 0 }} />
}

export function EditItemHeaderText({
  title,
  subtitle
}: {
  title: string
  subtitle: string
}) {
  return (
    <section
      className="ndjc-apk-edit-header"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_EDIT_ITEM_UI.smallGap
      }}
    >
      <h1
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.black,
          fontSize: APK_EDIT_ITEM_UI.titleFontSize,
          lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
          letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
          textRendering: 'geometricPrecision',
          whiteSpace: 'pre-line'
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.body70,
          fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
          lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight
        }}
      >
        {subtitle}
      </p>
    </section>
  )
}

export function EditItemSectionTitle({
  title,
  subtitle
}: {
  title: string
  subtitle?: string | null
}) {
  return (
    <section
      className="ndjc-apk-edit-section-title"
      style={{
        width: '100%',
        display: 'grid',
        gap: subtitle ? APK_EDIT_ITEM_UI.titleToHint : 0
      }}
    >
      <h2
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.sectionLabelColor,
          fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
          lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
        }}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          style={{
            margin: 0,
            color: APK_EDIT_ITEM_UI.body55,
            fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
            lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
            fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </section>
  )
}

export function EditItemBodySmallText({
  children,
  color = APK_EDIT_ITEM_UI.body55
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <p
      style={{
        margin: 0,
        color,
        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
        fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
      }}
    >
      {children}
    </p>
  )
}

export function EditItemErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        color: APK_EDIT_ITEM_UI.error80,
        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
        fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
      }}
    >
      {children}
    </p>
  )
}

export const EditItemFieldBlock = React.forwardRef<HTMLElement, {
  children: React.ReactNode
}>(function EditItemFieldBlock(
  {
    children
  },
  ref
) {
  return (
    <section
      ref={ref}
      className="ndjc-apk-edit-field-block"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_EDIT_ITEM_UI.labelGap
      }}
    >
      {children}
    </section>
  )
})

export function EditItemSectionCard({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cx('ndjc-apk-edit-section-card', className)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: 0,
        padding: 0,
        background: 'transparent',
        boxShadow: 'none',
        display: 'grid',
        gap: APK_EDIT_ITEM_UI.sectionCardGap
      }}
    >
      {children}
    </section>
  )
}

export function EditItemModernTextField({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  multiline = false,
  disabled = false,
  isError = false,
  singleLine,
  minLines = 1,
  inputMode,
  autoComplete
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  type?: string
  multiline?: boolean
  disabled?: boolean
  isError?: boolean
  singleLine?: boolean
  minLines?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const isMultiline = multiline || singleLine === false
  const fieldMinHeight = isMultiline
    ? Math.max(APK_EDIT_ITEM_UI.fieldMinHeight, APK_EDIT_ITEM_UI.fieldMinHeight + Math.max(0, minLines - 1) * 28)
    : APK_EDIT_ITEM_UI.fieldMinHeight

  const borderColor = isError
    ? APK_EDIT_ITEM_UI.fieldErrorBorderColor
    : isFocused
      ? APK_EDIT_ITEM_UI.fieldFocusBorderColor
      : APK_EDIT_ITEM_UI.fieldBorderColor

  const nativeFieldStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: isMultiline ? Math.max(72, fieldMinHeight - APK_EDIT_ITEM_UI.fieldPaddingY * 2) : 24,
    height: isMultiline ? 'auto' : 24,
    boxSizing: 'border-box',
    border: 0,
    outline: 0,
    padding: 0,
    color: disabled ? NDJC_GLOBAL_UI_TOKENS.colors.textDisabled : NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
    caretColor: 'rgba(15, 23, 42, 0.82)',
    background: 'transparent',
    boxShadow: 'none',
    fontFamily: 'inherit',
    fontSize: 16,
    lineHeight: isMultiline ? 1.45 : '24px',
    fontWeight: 500,
    letterSpacing: 0,
    resize: 'none',
    appearance: 'none',
    WebkitAppearance: 'none'
  }

  return (
    <label
      className={cx('ndjc-apk-edit-modern-field', disabled && 'is-disabled', isError && 'is-error')}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        display: 'grid',
        gap: 7,
        opacity: disabled ? 0.72 : 1
      }}
    >
      <span
        className="ndjc-apk-edit-modern-field-label"
        style={{
          color: isError ? APK_EDIT_ITEM_UI.error80 : NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
          fontSize: APK_EDIT_ITEM_UI.labelFontSize,
          lineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.labelFontWeight
        }}
      >
        {label}
      </span>

      <span
        className="ndjc-apk-edit-modern-field-shell"
        style={{
          width: '100%',
          minHeight: fieldMinHeight,
          boxSizing: 'border-box',
          borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
          border: `${APK_EDIT_ITEM_UI.fieldBorderWidth}px solid ${borderColor}`,
          background: isFocused
            ? APK_EDIT_ITEM_UI.fieldFocusedBackground
            : APK_EDIT_ITEM_UI.fieldBackground,
          padding: `${APK_EDIT_ITEM_UI.fieldPaddingY}px ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
          display: 'grid',
          alignItems: isMultiline ? 'start' : 'center',
          transition: `border-color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, box-shadow ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, background ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`,
          boxShadow: isError
            ? APK_EDIT_ITEM_UI.fieldErrorShadow
            : isFocused
              ? APK_EDIT_ITEM_UI.fieldFocusShadow
              : 'none'
        }}
      >
        {isMultiline ? (
          <textarea
            className="ndjc-apk-edit-modern-textarea"
            style={nativeFieldStyle}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isError}
            autoComplete={autoComplete}
            rows={Math.max(1, minLines)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={event => onChange(event.target.value)}
          />
        ) : (
          <input
            className="ndjc-apk-edit-modern-input"
            style={nativeFieldStyle}
            value={value}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isError}
            autoComplete={autoComplete}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={event => onChange(event.target.value)}
          />
        )}
      </span>
    </label>
  )
}

export function EditItemSubmitButton({
  children,
  disabled,
  isLoading,
  onClick
}: {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}) {
  const blocked = Boolean(disabled || isLoading)
  const [pressed, setPressed] = React.useState(false)
  const enabled = !blocked
  const isPressed = Boolean(pressed && enabled)

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <button
      type="button"
      className="ndjc-apk-edit-submit-button"
      disabled={blocked}
      aria-busy={isLoading || undefined}
      onPointerDown={() => {
        if (blocked) return
        setPressed(true)
      }}
      onPointerUp={releasePressState}
      onPointerCancel={releasePressState}
      onPointerLeave={releasePressState}
      onBlur={releasePressState}
      onClick={() => {
        if (blocked) return
        onClick?.()
      }}
      style={{
        width: '100%',
        minHeight: APK_EDIT_ITEM_UI.submitButtonHeight,
        border: 0,
        borderRadius: APK_EDIT_ITEM_UI.submitButtonRadius,
        padding: '0 18px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: enabled ? '#FFFFFF' : APK_EDIT_ITEM_UI.submitButtonDisabledText,
        background: enabled
          ? isPressed
            ? NDJC_GLOBAL_UI_TOKENS.colors.brandStrongPressed
            : NDJC_GLOBAL_UI_TOKENS.colors.brandStrong
          : APK_EDIT_ITEM_UI.submitButtonDisabledBg,
        boxShadow: enabled
          ? isPressed
            ? APK_EDIT_ITEM_UI.submitButtonPressedShadow
            : APK_EDIT_ITEM_UI.submitButtonShadow
          : 'none',
        fontSize: APK_EDIT_ITEM_UI.submitButtonFontSize,
        lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`,
        fontWeight: APK_EDIT_ITEM_UI.submitButtonFontWeight,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
        transform: isPressed
          ? `scale(${NDJC_GLOBAL_UI_TOKENS.motion.pressScale})`
          : 'scale(1)',
        transformOrigin: 'center center',
        transition: `transform ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, box-shadow ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, background ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`,
        opacity: isLoading ? 0.9 : 1,
        cursor: enabled ? 'pointer' : 'not-allowed',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      {isLoading ? (
        <>
          <NdjcSpinner
            className="ndjc-apk-edit-submit-spinner"
            size={18}
            stroke={2}
            tone="light"
          />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: APK_EDIT_ITEM_UI.submitButtonLineHeight,
              lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`
            }}
          >
            Saving...
          </span>
        </>
      ) : (
        <span
          style={{
            minWidth: 0,
            minHeight: APK_EDIT_ITEM_UI.submitButtonLineHeight,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`
          }}
        >
          {children}
        </span>
      )}
    </button>
  )
}
