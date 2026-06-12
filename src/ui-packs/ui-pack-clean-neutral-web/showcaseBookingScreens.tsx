'use client'

import React from 'react'
import type {
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAnnouncementCard,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointmentCard,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseChangePasswordActions,
  ShowcaseChangePasswordUiState,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
  ShowcaseChatMediaActions,
  ShowcaseChatMessage,
  ShowcaseChatProductShare,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseCustomerBookingsActions,
  ShowcaseCustomerBookingsUiState,
  ShowcaseDetailActions,
  ShowcaseDetailUiState,
  ShowcaseEditDishActions,
  ShowcaseEditDishUiState,
  ShowcaseFavoriteCard,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeDish,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseLoginUiState,
  ShowcaseMerchantChatListActions,
  ShowcasePaginationUiState,
  ShowcaseStoreProfileActions,
  ShowcaseStoreUnavailableUiState,
  ShowcaseStoreProfileUiState
} from '@/features/feature-showcase-web/showcaseUiContract'
import type { DemoDish } from '@/features/feature-showcase-web/showcaseModels'
import { getDishPrice, getDishTitle } from '@/features/feature-showcase-web/showcaseModels'
import {
  selectAnnouncementCoverUrl,
  selectChatImageUrls,
  selectDishImageUrl,
  selectShowcaseImageBlurDataUrl,
  selectShowcaseImageVariantList,
  selectStoreCoverUrl,
  selectStoreLogoUrl
} from '@/features/feature-showcase-web/showcaseImageVariants'
import {
  mapMarkerSvgUrl,
  BackHomeActions,
  BottomActions,
  ShowcaseBottomBarTab,
  NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  NdjcBottomBarHostContext,
  cx,
  dishImage,
  priceText,
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS,
  sortLabel,
  APK_FILTER_UI,
  apkFilterLazyRowStyle,
  apkFilterChipBaseStyle,
  apkFilterChipStyle,
  apkSortNavOuterItemStyle,
  apkSortNavItemStyle,
  apkSortNavTextStyle,
  apkSmallActiveChipTextStyle,
  apkSheetBackdropStyle,
  apkSheetSurfaceStyle,
  apkSheetHeaderRootStyle,
  apkSheetHeaderRowStyle,
  apkSheetHeaderCopyStyle,
  apkSheetHeaderTitleStyle,
  apkSheetHeaderSubtitleStyle,
  apkSheetDividerStyle,
  apkSheetCloseButtonStyle,
  apkSheetContentStyle,
  apkSheetDragHandleWrapStyle,
  apkSheetDragHandleStyle,
  apkSheetFooterStyle,
  apkVisuallyHiddenStyle,
  APK_MEDIA_UI,
  apkImageRootStyle,
  apkImageFillStyle,
  apkImagePlaceholderStyle,
  apkImageFailurePlaceholderStyle,
  apkImageFailureIconStyle,
  apkImageFailureTextStyle,
  apkImageShimmerLayerStyle,
  apkImageShimmerKeyframes,
  apkEditableImageTileStyle,
  apkUploadTileStyle,
  apkRemoveCornerButtonStyle,
  apkEditableGridStyle,
  apkFullscreenBackdropStyle,
  apkFullscreenTopActionsStyle,
  apkFullscreenDownloadButtonStyle,
  apkFullscreenCloseButtonStyle,
  apkFullscreenCloseIconStyle,
  apkFullscreenImageStyle,
  apkFullscreenPagerButtonStyle,
  apkFullscreenPageIndicatorStyle,
  APK_STORE_PROFILE_UI,
  apkStoreSectionStyle,
  apkStoreSectionHeaderStyle,
  apkStoreSectionHeaderBarStyle,
  apkStoreSectionTitleStyle,
  apkStoreBodyTextStyle,
  apkStoreMutedTextStyle,
  apkStoreLabelStyle,
  apkStoreValueStyle,
  apkStoreInfoLineButtonStyle,
  apkStoreCardSurfaceStyle,
  apkStoreContactCardStyle,
  StoreProfileSectionHeader,
  APK_EDIT_ITEM_UI,
  APK_STORE_EDIT_UI,
  apkStoreEditSectionTitleStyle,
  apkStoreEditSectionSubtitleStyle,
  apkStoreEditSectionBottomSpacerStyle,
  apkStoreEditColumnStyle,
  apkStoreEditRowStyle,
  apkStoreEditRemoveRowStyle,
  apkStoreEditRemoveButtonStyle,
  apkStoreEditLabelStyle,
  apkStoreEditCardStyle,
  apkStoreEditPickerHeaderStyle,
  apkStoreEditPickerTitleStyle,
  apkStoreEditPickerHintStyle,
  APK_APPOINTMENT_UI,
  apkAppointmentColumnStyle,
  apkAppointmentDetailLineStyle,
  apkAppointmentDetailLabelStyle,
  apkAppointmentDetailValueStyle,
  apkAppointmentDatePillStyle,
  apkAppointmentFlowRowStyle,
  apkAppointmentSectionTitleStyle,
  apkAppointmentSheetSurfaceStyle,
  apkAppointmentSheetContentStyle,
  apkAppointmentCalendarGridStyle,
  apkAppointmentSubmitInfoBoxStyle,
  apkAppointmentWarningBoxStyle,
  appointmentDetailTimeText,
  appointmentListTimeText,
  APK_SHELL_UI,
  apkShellScreenStyle,
  apkPhoneSurfaceStyle,
  apkUnifiedBackgroundSurfaceStyle,
  apkWhiteCardStyle,
  apkBackButtonStyle,
  apkBackButtonIconWrapStyle,
  apkBackButtonTextIconStyle,
  NdjcBackArrowSvgIcon,
  apkTopNavOverlayStyle,
  apkBgCircleStyle,
  apkPullRefreshRootStyle,
  apkPullRefreshIndicatorWrapStyle,
  apkPullRefreshIndicatorStyle,
  apkPullRefreshHintStyle,
  apkPullRefreshHintPillStyle,
  apkHomeEntryOverlayStyle,
  apkScreenHeaderStyle,
  apkTitleBlockStyle,
  apkScreenContentStyle,
  APK_HOME_PAGE_UI,
  APK_PAGE_SHELL_UI,
  apkHomeRootStyle,
  apkHomeControlsStyle,
  apkHomeControlsGapStyle,
  apkHomeTagsWrapStyle,
  apkHomeSortWrapStyle,
  apkHomeCategoryWrapStyle,
  apkHomeListStyle,
  apkHomeGridRowStyle,
  apkHomeGridPlaceholderStyle,
  apkHomeBottomBarHostStyle,
  apkHomeEmptyWrapStyle,
  apkHomeRefreshIndicatorWrapStyle,
  APK_DETAIL_PAGE_UI,
  apkDetailRootStyle,
  apkDetailScrollStyle,
  apkDetailHeroStyle,
  apkDetailHeroImageButtonStyle,
  apkDetailHeroCounterStyle,
  apkDetailHeaderRowStyle,
  apkDetailFavoriteWrapStyle,
  apkPickBadgeStyle,
  apkPickBadgeIconStyle,
  apkPickBadgeTextStyle,
  ApkPickBadgeIcon,
  ApkHiddenBadgeIcon,
  NdjcItemStatusBadge,
  NdjcItemStatusBadgeRow,
  apkDetailPickBadgeStyle,
  apkDetailPickBadgeTextStyle,
  apkDetailFavoriteButtonStyle,
  DetailFavoriteIcon,
  apkDetailContentStyle,
  apkDetailTitleBlockStyle,
  apkDetailHeroActionsStyle,
  apkDetailHeroActionItemStyle,
  apkDetailHeroActionButtonStyle,
  apkDetailHeroActionLabelStyle,
  NdjcDetailHeroActionButton,
  apkDetailTitleStyle,
  apkDetailPriceRowStyle,
  apkDetailPrimaryPriceStyle,
  apkDetailNormalPriceStyle,
  apkDetailOriginalPriceStyle,
  apkDetailDividerStyle,
  apkDetailSectionStyle,
  apkDetailSectionLabelStyle,
  apkDetailDescriptionStyle,
  apkDetailShowMoreButtonStyle,
  apkDetailTagsRowStyle,
  APK_HOME_NAV_UI,
  APK_CORE_UI,
  apkTopSearchOuterStyle,
  apkTopSearchBarStyle,
  apkTopSearchInnerRowStyle,
  apkTopSearchInputWrapStyle,
  apkTopSearchIconStyle,
  apkTopSearchInputStyle,
  apkTopSearchFilterButtonStyle,
  apkTopSearchRoundButtonStyle,
  NdjcSearchOutlinedIcon,
  NdjcAccountCircleOutlinedIcon,
  NdjcTopSearchStorefrontIcon,
  NdjcStorefrontIcon,
  NdjcChatBubbleIcon,
  NdjcBookingsIcon,
  NdjcNotificationsIcon,
  NdjcBookmarkIcon,
  apkBottomBarStyle,
  apkBottomBarDividerStyle,
  apkBottomBarRowStyle,
  apkBottomTabStyle,
  apkBottomTabIconBoxStyle,
  apkBottomTabIconStyle,
  apkBottomTabDotStyle,
  apkBottomTabLabelStyle,
  apkPrimaryButtonStyle,
  apkPillButtonStyle,
  NDJC_ADMIN_TOOL_UI,
  apkAdminActionButtonStyle,
  apkControlPillButtonStyle,
  apkInlineTabStyle,
  apkDialogBackdropStyle,
  apkDialogSurfaceStyle,
  apkDialogTitleStyle,
  apkDialogMessageStyle,
  apkDialogContentStyle,
  apkDialogTextButtonStyle,
  apkDialogActionsStyle,
  apkInlineEmptyStateRootStyle,
  apkInlineEmptyStateColumnStyle,
  apkInlineEmptyStateTitleStyle,
  apkInlineEmptyStateMessageStyle,
  apkNoMoreListFooterStyle,
  apkSnackbarHostStyle,
  apkSnackbarSurfaceStyle,
  apkSnackbarTextStyle,
  apkSyncErrorBannerOuterStyle,
  apkSyncErrorBannerSurfaceStyle,
  apkSyncErrorBannerTextStyle,
  apkSyncErrorBannerButtonStyle,
  APK_CHAT_UI,
  apkChatScreenStyle,
  apkConversationSurfaceStyle,
  apkConversationTopBarStyle,
  apkConversationTitleBlockStyle,
  apkConversationTitleStyle,
  apkConversationSubtitleStyle,
  apkConversationBodyStyle,
  apkConversationFooterStyle,
  apkConversationToolbarStyle,
  apkChatInputShellStyle,
  apkChatTextareaStyle,
  apkChatToolButtonStyle,
  apkChatPlusMenuStyle,
  apkChatPlusMenuItemStyle,
  apkChatMessageRowStyle,
  apkChatMessageContentRowStyle,
  apkChatRetryButtonStyle,
  apkChatRetryIconStyle,
  NDJC_CHAT_RETRY_BUTTON_PREVIEW,
  apkChatMessageStackStyle,
  apkChatFailedBubbleRowStyle,
  apkChatBubbleOnlyStackStyle,
  apkChatRichRetryBubbleHostStyle,
  apkChatRichRetryButtonOverlayStyle,
  NdjcChatMessageMenuPlacement,
  apkChatMessageMenuStyle,
  apkChatMessageMenuItemStyle,
  apkChatTextBubbleStyle,
  apkChatTextStyle,
  apkChatTimeTextStyle,
  apkChatImageButtonBaseStyle,
  apkProductBubbleStyle,
  apkChatProductCardShellStyle,
  apkPendingProductBarStyle,
  apkPendingProductSideBarStyle,
  apkPendingProductActionColumnStyle,
  apkPendingProductIconButtonStyle,
  apkPendingProductPreviewCardStyle,
  apkQuotedProductBarStyle,
  apkChatQuoteBlockStyle,
  apkChatQuoteBlockRailStyle,
  getNdjcChatMeasureContext,
  getApkChatViewportWidthPx,
  measureChatTextWidthPx,
  computeApkChatTextQuoteContentWidthPx,
  apkChatRichBubbleFrameStyle,
  apkChatFindBarStyle,
  apkMerchantThreadRowStyle,
  APK_SHOWCASE_ITEM_UI,
  APK_ANNOUNCEMENT_UI,
  apkHomeMediaCardStyle,
  apkHomeMediaCardButtonStyle,
  apkHomeMediaImageWrapStyle,
  apkHomeMediaBodyStyle,
  apkHomeMediaTitleStyle,
  apkHomePriceRowStyle,
  apkHomePrimaryPriceStyle,
  apkHomeSecondaryPriceStyle,
  apkHomeBadgeStyle,
  apkHomeBadgeTextStyle,
  apkHomeFavoriteOverlayStyle,
  apkHomeFavoriteIconStyle,
  apkCatalogCardStyle,
  apkCatalogMainButtonStyle,
  apkCatalogMediaStyle,
  apkCatalogBodyStyle,
  apkCatalogTitleStyle,
  apkCatalogSpacerStyle,
  apkCatalogPriceStackStyle,
  apkCatalogPriceRowStyle,
  apkCatalogPriceStyle,
  apkCatalogOriginalPriceStyle,
  apkCatalogMetaTextStyle,
  apkCatalogCategoryChipStyle,
  apkAdminCatalogBottomStackStyle,
  apkAdminCatalogPriceMetaRowStyle,
  apkAdminCatalogViewsStyle,
  apkAnnouncementTimePillStyle,
  apkAnnouncementFeedCardStyle,
  apkAnnouncementFeedImageButtonStyle,
  apkAnnouncementFeedPlaceholderStyle,
  apkAnnouncementFeedInnerStyle,
  apkAnnouncementFeedDividerStyle,
  apkAnnouncementMetaRowStyle,
  apkAnnouncementMetaTextStyle,
  apkAnnouncementExpandButtonStyle,
  apkAnnouncementExpandedBodyStyle,
  apkAnnouncementExpandedBodyOuterStyle,
  apkAnnouncementExpandedBodyInnerStyle,
  apkAnnouncementBodyTextStyle,
  NdjcAnnouncementExpandIcon,
  apkMutedTextStyle,
  titleForDish,
  categoryForDish,
  ScreenScaffold,
  ShowcaseBottomBar,
  ShowcaseBottomBarHost,
  NdjcCard,
  NdjcButton,
  NdjcTextField,
  EmptyState,
  NoMoreFooter,
  NdjcIconButtonProps,
  NdjcDialogActions,
  NdjcSystemBars,
  NdjcSystemBarsTransparent,
  isNdjcInteractivePointerTarget,
  shouldSkipNdjcPullRefreshPointer,
  getNdjcKeyboardViewportHeightPx,
  getNdjcVisualViewportOffsetTopPx,
  syncNdjcKeyboardViewportCssVars,
  clearNdjcKeyboardViewportCssVars,
  NdjcChatKeyboardDebugPanel,
  NdjcUnifiedBackground,
  NDJC_TOP_SCROLL_FADE_MASK_HEIGHT,
  NDJC_TOP_SCROLL_FADE_MASK_COLOR,
  NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR,
  NdjcTopScrollFadeMask,
  NdjcWhiteCard,
  NdjcHomeOutlineIcon,
  NdjcCardBackButton,
  NdjcTopNavOverlay,
  NdjcSpinner,
  NdjcPrimaryActionButton,
  NdjcAdminEntryIconName,
  NdjcAdminEntryIcon,
  NdjcAdminEntryButton,
  NdjcPillButton,
  NdjcPillBadge,
  NdjcControlPillButton,
  NdjcFilterIconButton,
  NdjcInlineTextTab,
  NdjcToggleRow,
  NdjcSelectionCheckbox,
  NdjcInlineEmptyState,
  NdjcPaginationFooter,
  NdjcNoMoreListFooter,
  ndjcShouldLoadMoreFromScroll,
  ndjcShouldLoadOlderFromScroll,
  ndjcHandleLoadMoreScroll,
  NdjcCollapsibleAdminHeaderOptions,
  NdjcCollapsibleAdminHeaderState,
  useNdjcCollapsibleAdminHeader,
  ndjcHandleLoadOlderScroll,
  NdjcSnackbarHost,
  NdjcSyncErrorBanner,
  normalizeStoreUnavailableLinkHref,
  renderStoreUnavailableMessageLine,
  NdjcStoreUnavailableOverlay,
  NdjcOfflineStatusBanner,
  notificationOptInMessageText,
  NdjcPwaUpdateBanner,
  NdjcNotificationOptInPanel,
  NdjcNotificationOptInFloatingButton,
  NdjcBaseDialog,
  DeleteConfirmDialog,
  DeleteConfirmDialogPreview,
  SheetHeader,
  NdjcFilterBottomSheet,
  SmallActiveChip,
  SortNavEqualItem,
  SortRow,
  ActiveSortFilterRow,
  TopSearchBar,
  NdjcShimmerImage,
  FullscreenImagePreviewDialog,
  NdjcFullscreenImageViewerScreen,
  UploadTile,
  ImageTile,
  NdjcSingleEditableImage,
  NdjcEditableImageGrid,
  NdjcHomeStyleMediaCard,
  NdjcCatalogItemCard,
  NdjcLinkedCatalogItemCard,
  NdjcChatToolButton,
  MutedText,
  BgCircle,
  NdjcAdminPageProgressSlot,
  NdjcPullRefreshHintSpinner,
  NdjcPullRefreshContainer,
  NdjcAdminPullRefreshContainer,
  NdjcCustomerPullRefreshContainer,
  withUsd,
  ndjcMoneyTrim2,
  colors,
  neuOutlinedTextFieldColors,
  requestExit,
  scrollToField,
  hasHalfFilled,
  normalizeAppointmentTimeText,
  splitAppointmentAvailableHours,
  appointmentTimeOptions,
  appointmentFilterDateLabel,
  appointmentHistoryDateLabel,
  appointmentCalendarMonthTitle,
  appointmentCalendarDateValue,
  moveHistoryCalendarMonth,
  parseTimeMsFromTimeText,
  NdjcParsedChatPayloadUi,
  NdjcProductCardUi,
  NdjcParsedQuoteUi,
  NDJC_QUOTE_START_UI,
  NDJC_QUOTE_END_UI,
  NDJC_PRODUCT_START_UI,
  NDJC_PRODUCT_END_UI,
  findBetween,
  parseNdjcProductBlock,
  parseNdjcQuotePayloadUi,
  parseNdjcChatPayloadUi,
  fallbackFindQuotedMessageId,
  chatProductShareFromParsedProduct,
  quotePreviewTextFromMessage,
  resetDragState,
  findTargetIndex,
  movePreview,
  rememberFindHighlightStyle,
  highlightQueryText,
  alignLastBubbleToFooterLine,
  DishListCard,
  FavSortChip,
  FavoritesSortChip,
  AppointmentDatePill,
  AppointmentTimeSettingRow,
  AppointmentHistoryDatePickerSheet,
  AppointmentDetailSectionTitle,
  AppointmentContactCopyLine,
  NdjcBottomTabVertical,
  NdjcStaticMapPreview,
  StoreProfileMapPreview,
  UniversalStoreCoverPlaceholderCard,
  UniversalStoreLogoPlaceholder,
  UniversalStoreBrandHeader,
  UniversalStoreEmptyInfoText,
  UniversalStoreAboutSection,
  UniversalStoreAppAboutSection,
  UniversalStoreLocationSection,
  UniversalStoreServicesSection,
  UniversalContactRow,
  UniversalStoreExtraContactsSection,
  ProfileReadOnlyRow,
  ProfileReadOnlyRowIfNotBlank,
  StoreExtraContactsEditorRow,
  StoreExtraContactsEditor,
  StoreOtherContactMethodsEditor,
  StoreServicesEditor,
  StoreProfileLogoPicker,
  StoreProfileCoverPicker,
  StoreProfileHeaderBlock,
  TagsFilterRow,
  HomeSortNavEqualRow,
  useNdjcHorizontalDragScroll,
  CategoryChipsRow,
  SectionDivider,
  APK_ADMIN_UI,
  AdminSpacer,
  AdminTitleText,
  AdminInlineSyncSpinner,
  AdminInlineSyncStatus,
  AdminSyncNoticeText,
  AdminCloudTitleText,
  AdminSectionLabel,
  AdminBodySmallText,
  AdminTitleMediumText,
  NdjcAdminCloudMark,
  AdminStatusMessageText,
  EditItemSpacer,
  EditItemHeaderText,
  EditItemSectionTitle,
  EditItemBodySmallText,
  EditItemErrorText,
  EditItemFieldBlock,
  EditItemSectionCard,
  EditItemModernTextField,
  EditItemSubmitButton,
  StoreSectionTitle,
  StoreInfoLine
} from './showcaseCommonComponents'

function appointmentDisplayTime(preferredDate: string, preferredTime: string): string {
  const date = preferredDate.trim()
  const time = preferredTime.trim()

  if (date && time) return `Time · ${date}, ${time}`
  if (date) return `Time · ${date}`
  if (time) return `Time · ${time}`

  return 'Time · Not selected'
}

function statusClassName(status: string): string {
  const value = status.trim().toLowerCase()

  if (value.includes('confirm')) return 'is-confirmed'
  if (value.includes('complete')) return 'is-completed'
  if (value.includes('cancel')) return 'is-cancelled'
  if (value.includes('no')) return 'is-no-show'

  return 'is-pending'
}

function AppointmentFilterRow({
  label,
  options,
  selected,
  optionText,
  onSelected
}: {
  label: string
  options: string[]
  selected: string
  optionText?: (value: string) => string
  onSelected: (value: string) => void
}) {
  const horizontalScroll = useNdjcHorizontalDragScroll()

  if (!options.length) return null

  return (
    <section
      className="ndjc-appointment-filter-row"
      style={{
        width: '100%',
        maxWidth: '100%',
        minHeight: APK_CORE_UI.pillHeight + 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflow: 'hidden'
      }}
    >
      <span
        className="ndjc-appointment-filter-label"
        style={{
          width: 48,
          minWidth: 48,
          maxWidth: 48,
          flex: '0 0 48px',
          color: APK_CORE_UI.black,
          fontSize: APK_APPOINTMENT_UI.labelSmallSize,
          lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <div
        ref={horizontalScroll.scrollRef}
        className="ndjc-appointment-filter-options"
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          maxWidth: '100%',
          height: APK_CORE_UI.pillHeight + 4,
          minHeight: APK_CORE_UI.pillHeight + 4,
          display: 'block',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-y',
          overscrollBehaviorX: 'contain',
          boxSizing: 'border-box',
          padding: '2px 0'
        }}
        role="list"
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
            height: APK_CORE_UI.pillHeight,
            minHeight: APK_CORE_UI.pillHeight,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {options.map(option => {
            const isSelected = selected === option
            const text = optionText ? optionText(option) : option

            return (
              <span
                key={option}
                style={{
                  flex: '0 0 auto',
                  height: APK_CORE_UI.pillHeight,
                  minHeight: APK_CORE_UI.pillHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
<NdjcPillButton
  selected={isSelected}
  onClick={() => {
    if (horizontalScroll.shouldSuppressClick()) return
    onSelected(option)
  }}
>
  {text}
</NdjcPillButton>
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export function AppointmentCatalogItemCard({
  title,
  imageUrl,
  priceTextValue,
  originalPriceTextValue,
  discountPriceTextValue,
  categoryText,
  isRecommended = false,
  showRecommendedBadge = false,
  itemAvailable = true,
  allowClickWhenUnavailable = false,
  onOpen,
  middle,
  bottom,
  trailing
}: {
  title: string
  imageUrl: string | null
  priceTextValue?: string | null
  originalPriceTextValue?: string | null
  discountPriceTextValue?: string | null
  categoryText?: string | null
  isRecommended?: boolean
  showRecommendedBadge?: boolean
  itemAvailable?: boolean
  allowClickWhenUnavailable?: boolean
  onOpen?: () => void
  middle?: React.ReactNode
  bottom?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <NdjcLinkedCatalogItemCard
      title={title || 'General appointment'}
      imageUrl={imageUrl}
      subtitle={categoryText || undefined}
      price={priceTextValue || undefined}
      originalPrice={originalPriceTextValue || undefined}
      discountPrice={discountPriceTextValue || undefined}
      available={itemAvailable}
      allowClickWhenUnavailable={allowClickWhenUnavailable}
      onOpen={onOpen}
      middle={
        middle || (
          showRecommendedBadge ? (
            <NdjcItemStatusBadgeRow
              recommended={isRecommended}
              hidden={false}
            />
          ) : null
        )
      }
      bottom={bottom}
      trailing={trailing}
    />
  )
}

function AppointmentBookingProductSection({
  product,
  enabled,
  onOpenProductDetail
}: {
  product: ShowcaseAppointmentsUiState['product']
  enabled: boolean
  onOpenProductDetail: (dishId: string) => void
}) {
  return (
    <section className="ndjc-appointment-booking-product-section" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        Booking for
      </h3>

      {product ? (
        <AppointmentCatalogItemCard
          title={product.title}
          imageUrl={product.imageUrl}
          priceTextValue={product.priceText}
          originalPriceTextValue={product.originalPriceText}
          discountPriceTextValue={product.discountPriceText}
          categoryText={null}
          isRecommended={product.isRecommended}
          showRecommendedBadge
          itemAvailable={enabled}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpenProductDetail(product.dishId)}
        />
      ) : (
        <section style={apkAppointmentWarningBoxStyle}>
          <p
            style={{
              margin: 0,
              fontSize: APK_APPOINTMENT_UI.bodySmallSize,
              lineHeight: APK_APPOINTMENT_UI.bodySmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.bodySmallWeight
            }}
          >
            Please open an item first, then book from its detail page.
          </p>
        </section>
      )}
    </section>
  )
}

function AppointmentCalendarDayButton({
  title,
  subtitle,
  selected,
  disabled,
  onClick
}: {
  title: string
  subtitle?: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  const enabled = !disabled

  return (
    <button
      type="button"
      className={cx('ndjc-appointment-calendar-day-button', selected && 'is-selected')}
      style={apkAppointmentDatePillStyle(selected, enabled)}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      <strong
        style={{
          maxWidth: '100%',
          color: 'currentColor',
          fontSize: APK_APPOINTMENT_UI.labelMediumSize,
          lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
          fontWeight: APK_APPOINTMENT_UI.labelMediumWeight,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </strong>

      {subtitle ? (
        <span
          style={{
            maxWidth: '100%',
            color: selected ? 'rgba(255, 255, 255, 0.88)' : enabled ? APK_APPOINTMENT_UI.secondaryText : APK_APPOINTMENT_UI.disabledText,
            fontSize: APK_APPOINTMENT_UI.labelSmallSize,
            lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
            fontWeight: APK_APPOINTMENT_UI.bodySmallWeight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {subtitle}
        </span>
      ) : null}
    </button>
  )
}

export function AppointmentCalendarMonthDayButton({
  text,
  active,
  onClick
}: {
  text: string
  active: boolean
  onClick: () => void
}) {
  const daySize = APK_APPOINTMENT_UI.calendarDayHeight

  return (
    <span
      className={cx('ndjc-appointment-calendar-month-day-button', active && 'is-selected')}
      style={{
        width: '100%',
        height: daySize,
        minHeight: daySize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <button
        type="button"
        className={cx('ndjc-appointment-calendar-month-day-inner-button', active && 'is-selected')}
        style={{
          width: daySize,
          height: daySize,
          minWidth: daySize,
          maxWidth: daySize,
          padding: 0,
          border: `${active ? 0 : APK_CORE_UI.pillBorderWidth}px solid ${APK_CORE_UI.border}`,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? APK_CORE_UI.white : APK_CORE_UI.black,
          background: active ? APK_CORE_UI.brand : APK_CORE_UI.chipUnselectedBg,
          boxShadow: 'none',
          fontSize: APK_CORE_UI.pillFontSize,
          lineHeight: 1,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          boxSizing: 'border-box',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          ['--ndjc-pill-pressed-scale' as string]: String(APK_FILTER_UI.chipPressedScale)
        } as React.CSSProperties}
        onClick={onClick}
        aria-pressed={active}
      >
        <span
          style={{
            width: '100%',
            height: '100%',
            minWidth: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            transform: 'translateY(1px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {text}
        </span>
      </button>
    </span>
  )
}

function AppointmentCustomerDateRow({
  title,
  options,
  selected,
  enabled,
  onSelected
}: {
  title: string
  options: ShowcaseAppointmentsUiState['dateOptions']
  selected: string
  enabled: boolean
  onSelected: (value: string) => void
}) {
  const horizontalScroll = useNdjcHorizontalDragScroll()

  if (!options.length) {
    return (
      <section className="ndjc-appointment-customer-date-row" style={apkAppointmentColumnStyle}>
        <h3 style={apkAppointmentSectionTitleStyle}>
          {title}
        </h3>

        <MutedText>No booking dates are available.</MutedText>
      </section>
    )
  }

  return (
    <section className="ndjc-appointment-customer-date-row" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        {title}
      </h3>

      <div
        ref={horizontalScroll.scrollRef}
        onPointerDown={horizontalScroll.onPointerDown}
        onPointerMove={horizontalScroll.onPointerMove}
        onPointerUp={horizontalScroll.onPointerUp}
        onPointerCancel={horizontalScroll.onPointerCancel}
        onPointerLeave={horizontalScroll.onPointerLeave}
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-x',
          overscrollBehaviorX: 'contain',
          cursor: 'grab'
        }}
      >
        {options.map(option => (
          <span
            key={option.value}
            style={{
              flex: '0 0 auto',
              display: 'inline-flex',
              whiteSpace: 'nowrap'
            }}
          >
            <AppointmentDatePill
              title={option.title}
              subtitle={option.reason?.trim() ? option.reason : option.subtitle}
              selected={selected === option.value}
              disabled={!enabled || !option.available}
              onClick={() => {
                if (horizontalScroll.shouldSuppressClick()) return
                if (enabled && option.available) {
                  onSelected(option.value)
                }
              }}
            />
          </span>
        ))}
      </div>
    </section>
  )
}
function AppointmentCustomerTimeGrid({
  title,
  options,
  selected,
  emptyText,
  enabled,
  onSelected
}: {
  title: string
  options: string[]
  selected: string
  emptyText: string
  enabled: boolean
  onSelected: (value: string) => void
}) {
  return (
    <section className="ndjc-appointment-customer-time-grid" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        {title}
      </h3>

      {!options.length ? (
        <MutedText>{emptyText}</MutedText>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          {options.map(option => {
            const normalized = normalizeAppointmentTimeText(option)
            const active = selected === option

            return (
              <NdjcPillButton
                key={option}
                selected={active}
                disabled={!enabled}
                onClick={() => {
                  if (enabled) {
                    onSelected(option)
                  }
                }}
              >
                {normalized}
              </NdjcPillButton>
            )
          })}
        </div>
      )}
    </section>
  )
}

function AppointmentSubmitConfirmLine({
  enabled,
  canSubmit,
  isSubmitting,
  onSubmit
}: {
  enabled: boolean
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
}) {
  const submitDisabled = !enabled || !canSubmit || isSubmitting

  return (
    <NdjcControlPillButton
      disabled={submitDisabled}
      active={!submitDisabled}
      tone="adminAction"
      fullWidth
      onClick={() => {
        if (submitDisabled) return
        onSubmit()
      }}
    >
      {isSubmitting ? 'Submitting...' : 'Submit request'}
    </NdjcControlPillButton>
  )
}

function AppointmentSubmitConfirmInfo({
  label,
  value,
  maxLines = 2
}: {
  label: string
  value: string
  maxLines?: number | null
}) {
  const cleanValue = value.trim()
  if (!cleanValue) return null

  return (
    <CustomerBookingDetailInfoLine
      label={label}
      value={cleanValue}
      maxLines={maxLines}
    />
  )
}

function AppointmentDetailInfoLine({
  label,
  value
}: {
  label: string
  value: string | null | undefined
}) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue) return null

  return (
    <section className="ndjc-appointment-detail-info-line" style={apkAppointmentDetailLineStyle}>
      <span style={apkAppointmentDetailLabelStyle}>{label}</span>
      <strong style={apkAppointmentDetailValueStyle}>{cleanValue}</strong>
    </section>
  )
}

function CustomerBookingDetailInfoLine({
  label,
  value,
  valueNode,
  maxLines = 2
}: {
  label: string
  value?: string | null
  valueNode?: React.ReactNode
  maxLines?: number | null
}) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue && !valueNode) return null

  const valueStyle: React.CSSProperties = {
    margin: 0,
    minWidth: 0,
    color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
    fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
    lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
    fontWeight: 650,
    overflowWrap: 'anywhere'
  }

  if (typeof maxLines === 'number') {
    valueStyle.overflow = 'hidden'
    valueStyle.textOverflow = 'ellipsis'
    valueStyle.display = '-webkit-box'
    valueStyle.WebkitLineClamp = maxLines
    valueStyle.WebkitBoxOrient = 'vertical'
  }

  return (
    <section
      className="ndjc-customer-booking-detail-info-line"
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '92px minmax(0, 1fr)',
        gap: APK_EDIT_ITEM_UI.fieldGap,
        alignItems: 'start'
      }}
    >
      <span
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.body55,
          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
          fontWeight: 650,
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      {valueNode ? (
        <span
          style={{
            minWidth: 0,
            display: 'inline-flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {valueNode}
        </span>
      ) : (
        <strong style={valueStyle}>
          {cleanValue}
        </strong>
      )}
    </section>
  )
}

function isAppointmentCancelledByCustomer(item: ShowcaseAppointmentCard): boolean {
  return item.statusLabel === 'Cancelled' && item.cancelledBy === 'customer'
}

function appointmentStatusDisplayLabel(item: ShowcaseAppointmentCard): string {
  if (isAppointmentCancelledByCustomer(item)) {
    return 'Cancelled by customer'
  }

  return item.statusLabel || 'Pending'
}

function AppointmentDetailsBottomSheet({
  item,
  onClose,
  onOpenProduct,
  adminActions,
  statusSubmittingId = null
}: {
  item: ShowcaseAppointmentCard | null
  onClose: () => void
  onOpenProduct?: (dishId: string) => void
  adminActions?: Pick<ShowcaseAdminAppointmentsActions, 'onCopy' | 'onPending' | 'onConfirm' | 'onComplete' | 'onCancel' | 'onNoShow' | 'onContactCustomer'>
  statusSubmittingId?: string | null
}) {
  const [draftStatus, setDraftStatus] = React.useState(item?.statusLabel || 'Pending')

  React.useEffect(() => {
    setDraftStatus(item?.statusLabel || 'Pending')
  }, [item?.id, item?.statusLabel])

  if (!item) return null

  const sourceDishId = item.sourceDishId?.trim() || ''
  const canOpenProduct = Boolean(item.itemAvailable && sourceDishId && onOpenProduct)
  const statusSubmitting = Boolean(adminActions && statusSubmittingId === item.id)
  const customerCancelledLock = Boolean(adminActions && isAppointmentCancelledByCustomer(item))
  const statusActionDisabled = statusSubmitting || customerCancelledLock
  const displayStatusLabel = appointmentStatusDisplayLabel(item)
  const appointmentDetailInnerPaddingX = Math.max(
    0,
    APK_EDIT_ITEM_UI.screenPadding - APK_FILTER_UI.sheetContentPaddingX
  )
  const appointmentDetailProductCardPaddingX = Math.max(
    0,
    25 - APK_FILTER_UI.sheetContentPaddingX
  )
  const appointmentDetailTitlePaddingX = APK_EDIT_ITEM_UI.screenPadding

  return (
    <NdjcFilterBottomSheet
      open={Boolean(item)}
      title={adminActions ? 'Appointment details' : 'Booking details'}
      clearText=""
      applyText="Done"
      showPriceFields={false}
      showHeaderAction={false}
      showHeaderDivider={false}
      headerPaddingX={appointmentDetailTitlePaddingX}
      showApplyButton={false}
      onClose={onClose}
      onClear={onClose}
      onApply={onClose}
    >
      <section
        className="ndjc-appointment-detail-content"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'grid',
          gap: APK_EDIT_ITEM_UI.sectionCardGap
        }}
      >
        <section
          className="ndjc-appointment-detail-product-wrap"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: appointmentDetailProductCardPaddingX,
            paddingRight: appointmentDetailProductCardPaddingX
          }}
        >
          <AppointmentCatalogItemCard
            title={item.serviceTitle || 'General appointment'}
            imageUrl={item.imageUrl}
            priceTextValue={item.priceText}
            originalPriceTextValue={item.originalPriceText}
            discountPriceTextValue={item.discountPriceText}
            categoryText={null}
            isRecommended={item.isRecommended}
            showRecommendedBadge
            itemAvailable={item.itemAvailable && Boolean(sourceDishId)}
            allowClickWhenUnavailable={false}
            onOpen={canOpenProduct
              ? () => {
                  onClose()
                  onOpenProduct?.(sourceDishId)
                }
              : undefined}
          />
        </section>

        <EditItemSectionCard className="ndjc-appointment-detail-info-card">
          <section
            className="ndjc-appointment-detail-info-inner"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: appointmentDetailInnerPaddingX,
              paddingRight: appointmentDetailInnerPaddingX,
              display: 'grid',
              gap: APK_EDIT_ITEM_UI.sectionCardGap
            }}
          >
            <EditItemSectionTitle
              title={adminActions ? 'Appointment info' : 'Booking info'}
              subtitle={adminActions
                ? 'Review the customer appointment details.'
                : 'Review your appointment details.'}
            />

            <section
              className="ndjc-appointment-detail-info-list"
              style={{
                width: '100%',
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.fieldGap
              }}
            >
              <CustomerBookingDetailInfoLine
                label="Status"
                valueNode={(
                  <NdjcPillBadge selected>
                    {displayStatusLabel}
                  </NdjcPillBadge>
                )}
              />

              <CustomerBookingDetailInfoLine
                label="Time"
                value={appointmentDetailTimeText(item.preferredDate, item.preferredTime)}
              />

              {item.createdAtText ? (
                <CustomerBookingDetailInfoLine
                  label="Requested"
                  value={item.createdAtText}
                  maxLines={2}
                />
              ) : null}

              <CustomerBookingDetailInfoLine
                label="Customer"
                value={item.customerName || 'Customer'}
              />

              {item.customerContact ? (
                <AppointmentContactCopyLine
                  label="Contact"
                  value={item.customerContact}
                  onCopy={adminActions?.onCopy}
                />
              ) : (
                <CustomerBookingDetailInfoLine
                  label="Contact"
                  value="No contact provided"
                />
              )}

              {item.note ? (
                <CustomerBookingDetailInfoLine
                  label="Note"
                  value={item.note}
                  maxLines={null}
                />
              ) : null}
            </section>
          </section>
        </EditItemSectionCard>

        {adminActions ? (
          <EditItemSectionCard className="ndjc-appointment-detail-action-card">
            <section
              className="ndjc-appointment-detail-action-inner"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: appointmentDetailInnerPaddingX,
                paddingRight: appointmentDetailInnerPaddingX,
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.sectionCardGap
              }}
            >
              <EditItemSectionTitle
                title="Appointment status"
                subtitle="The number on Admin Appointments shows Pending bookings. Change a Pending booking to another status to clear it."
              />

              <section
                style={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No-show'].map(status => (
                  <NdjcPillButton
                    key={status}
                    selected={draftStatus === status}
                    disabled={statusActionDisabled}
                    onClick={() => {
                      if (statusActionDisabled) return
                      setDraftStatus(status)
                    }}
                  >
                    {status}
                  </NdjcPillButton>
                ))}
              </section>

              {customerCancelledLock ? (
                <section
                  style={{
                    width: '100%',
                    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
                    padding: `${APK_EDIT_ITEM_UI.fieldPaddingY}px ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
                    boxSizing: 'border-box',
                    color: APK_EDIT_ITEM_UI.body70,
                    background: APK_EDIT_ITEM_UI.fieldBackground,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  This booking was cancelled by the customer and can no longer be changed.
                </section>
              ) : null}

              <NdjcControlPillButton
                disabled={statusActionDisabled}
                active={!statusActionDisabled}
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (statusActionDisabled) return

                  let actionResult: void | Promise<void> | null = null

                  if (draftStatus === 'Pending') actionResult = adminActions.onPending(item.id)
                  if (draftStatus === 'Confirmed') actionResult = adminActions.onConfirm(item.id)
                  if (draftStatus === 'Cancelled') actionResult = adminActions.onCancel(item.id)
                  if (draftStatus === 'Completed') actionResult = adminActions.onComplete(item.id)
                  if (draftStatus === 'No-show') actionResult = adminActions.onNoShow(item.id)

                  void Promise.resolve(actionResult).finally(() => {
                    onClose()
                  })
                }}
              >
                {statusSubmitting ? 'Saving...' : 'Save status'}
              </NdjcControlPillButton>
            </section>
          </EditItemSectionCard>
        ) : null}
      </section>
    </NdjcFilterBottomSheet>
  )
}

export function CustomerBookingDetailsBottomSheet({
  item,
  onClose,
  onOpenProduct,
  onCancelBooking,
  onCopy,
  cancellationSubmittingId
}: {
  item: ShowcaseAppointmentCard | null
  onClose: () => void
  onOpenProduct?: (dishId: string) => void
  onCancelBooking?: (id: string) => void | Promise<void>
  onCopy?: (label: string, value: string) => void
  cancellationSubmittingId?: string | null
}) {
  const [cancelSelected, setCancelSelected] = React.useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    setCancelSelected(false)
    setCancelConfirmOpen(false)
  }, [item?.id])

  if (!item) return null

const sourceDishId = item.sourceDishId?.trim() || ''
const canOpenProduct = Boolean(item.itemAvailable && sourceDishId && onOpenProduct)
const canCancelBooking = Boolean(item.canCancelByCustomer && onCancelBooking)
  const isCancelling = cancellationSubmittingId === item.id
  const submitChangeDisabled = !cancelSelected || isCancelling
  const customerBookingDetailInnerPaddingX = Math.max(
    0,
    APK_EDIT_ITEM_UI.screenPadding - APK_FILTER_UI.sheetContentPaddingX
  )
  const customerBookingDetailAppointmentCardPaddingX = Math.max(
    0,
    25 - APK_FILTER_UI.sheetContentPaddingX
  )
  const customerBookingDetailTitlePaddingX = APK_EDIT_ITEM_UI.screenPadding

  return (
    <>
      <NdjcFilterBottomSheet
        open={Boolean(item)}
        title="Booking details"
        clearText=""
        applyText="Done"
        showPriceFields={false}
        showHeaderAction={false}
        showHeaderDivider={false}
        headerPaddingX={customerBookingDetailTitlePaddingX}
        showApplyButton={false}
        onClose={onClose}
        onClear={onClose}
        onApply={onClose}
      >
        <section
          className="ndjc-customer-booking-detail-content"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            display: 'grid',
            gap: APK_EDIT_ITEM_UI.sectionCardGap
          }}
        >
          <section
            className="ndjc-customer-booking-detail-product-wrap"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: customerBookingDetailAppointmentCardPaddingX,
              paddingRight: customerBookingDetailAppointmentCardPaddingX
            }}
          >
            <AppointmentCatalogItemCard
              title={item.serviceTitle || 'General appointment'}
              imageUrl={item.imageUrl}
              priceTextValue={item.priceText}
              originalPriceTextValue={item.originalPriceText}
              discountPriceTextValue={item.discountPriceText}
              categoryText={null}
              isRecommended={item.isRecommended}
              showRecommendedBadge
              itemAvailable={item.itemAvailable && Boolean(sourceDishId)}
              allowClickWhenUnavailable={false}
              onOpen={canOpenProduct
                ? () => {
                    onClose()
                    onOpenProduct?.(sourceDishId)
                  }
                : undefined}
            />
          </section>

          <EditItemSectionCard className="ndjc-customer-booking-detail-info-card">
            <section
              className="ndjc-customer-booking-detail-info-inner"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: customerBookingDetailInnerPaddingX,
                paddingRight: customerBookingDetailInnerPaddingX,
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.sectionCardGap
              }}
            >
              <EditItemSectionTitle
                title="Booking info"
                subtitle="Review your appointment details."
              />

              <section
                className="ndjc-customer-booking-detail-info-list"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.fieldGap
                }}
              >
<CustomerBookingDetailInfoLine
  label="Status"
  valueNode={(
    <NdjcPillBadge selected>
      {appointmentStatusDisplayLabel(item)}
    </NdjcPillBadge>
  )}
/>

<CustomerBookingDetailInfoLine
  label="Time"
  value={appointmentDetailTimeText(item.preferredDate, item.preferredTime)}
/>

{item.createdAtText ? (
  <CustomerBookingDetailInfoLine
    label="Requested"
    value={item.createdAtText}
    maxLines={2}
  />
) : null}

<CustomerBookingDetailInfoLine
  label="Customer"
  value={item.customerName || 'Customer'}
/>

{item.customerContact ? (
  <AppointmentContactCopyLine
    label="Contact"
    value={item.customerContact}
    onCopy={onCopy}
  />
) : (
  <CustomerBookingDetailInfoLine
    label="Contact"
    value="No contact provided"
  />
)}

{item.note ? (
  <CustomerBookingDetailInfoLine
    label="Note"
    value={item.note}
    maxLines={null}
  />
) : null}
              </section>
            </section>
          </EditItemSectionCard>

          {canCancelBooking ? (
            <EditItemSectionCard className="ndjc-customer-booking-detail-action-card">
              <section
                className="ndjc-customer-booking-detail-action-inner"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: customerBookingDetailInnerPaddingX,
                  paddingRight: customerBookingDetailInnerPaddingX,
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.sectionCardGap
                }}
              >
                <EditItemSectionTitle
                  title="Booking action"
                  subtitle="Select cancellation, then submit the change."
                />

                <button
                  type="button"
                  role="checkbox"
                  aria-checked={cancelSelected}
                  disabled={isCancelling}
                  className="ndjc-customer-booking-cancel-choice"
                  style={{
                    width: '100%',
                    minHeight: APK_EDIT_ITEM_UI.fieldMinHeight,
                    border: 0,
                    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
                    padding: '0 2px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    gap: APK_EDIT_ITEM_UI.fieldGap,
                    color: isCancelling
                      ? NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText
                      : NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                    background: 'transparent',
                    boxShadow: 'none',
                    cursor: isCancelling ? 'default' : 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  onClick={() => {
                    if (isCancelling) return
                    setCancelSelected(value => !value)
                  }}
                >
<span
  aria-hidden="true"
  style={{
    position: 'relative',
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: 999,
    boxSizing: 'border-box',
    display: 'block',
    border: `1.5px solid ${
      cancelSelected
        ? APK_APPOINTMENT_UI.brand
        : NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText
    }`,
    background: cancelSelected
      ? APK_APPOINTMENT_UI.brand
      : 'transparent',
    transition: 'background 140ms ease, border-color 140ms ease'
  }}
>
  {cancelSelected ? (
    <span
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 7,
        height: 7,
        borderRadius: 999,
        background: '#ffffff',
        transform: 'translate(-50%, -50%)'
      }}
    />
  ) : null}
</span>

                  <span
                    style={{
                      minWidth: 0,
                      color: cancelSelected
                        ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
                        : APK_EDIT_ITEM_UI.body70,
                      fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                      lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                  >
                    Cancel this booking
                  </span>
                </button>

                <NdjcControlPillButton
                  disabled={submitChangeDisabled}
                  active={!submitChangeDisabled}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (submitChangeDisabled) return
                    setCancelConfirmOpen(true)
                  }}
                >
                  {isCancelling ? 'Submitting...' : 'Submit change'}
                </NdjcControlPillButton>
              </section>
            </EditItemSectionCard>
          ) : null}
        </section>
      </NdjcFilterBottomSheet>

      {cancelConfirmOpen ? (
        <NdjcBaseDialog
          title="Confirm cancellation"
          message="Are you sure you want to cancel this booking?"
          confirmText="Confirm"
          cancelText="Keep booking"
          destructiveConfirm
          confirmLoading={isCancelling}
          confirmEnabled={!isCancelling}
          onConfirm={() => {
            if (isCancelling) return

            void Promise.resolve(onCancelBooking?.(item.id)).finally(() => {
              setCancelConfirmOpen(false)
              onClose()
            })
          }}
          onCancel={() => {
            if (isCancelling) return
            setCancelConfirmOpen(false)
          }}
          onDismissRequest={() => {
            if (isCancelling) return
            setCancelConfirmOpen(false)
          }}
        />
      ) : null}
    </>
  )
}

function AppointmentCard({
  item,
  onOpenDetails,
  onContactMerchant
}: {
  item: ShowcaseAppointmentCard
  onOpenProduct?: (dishId: string) => void
  onOpenDetails?: (item: ShowcaseAppointmentCard) => void
  onContactMerchant?: (id: string) => void
}) {
  const linkedItemAvailable = Boolean(item.itemAvailable && item.sourceDishId)

  return (
    <AppointmentCatalogItemCard
      title={item.serviceTitle || 'General appointment'}
      imageUrl={item.imageUrl}
      priceTextValue={null}
      categoryText={null}
      isRecommended={item.isRecommended}
      itemAvailable={linkedItemAvailable}
      allowClickWhenUnavailable
      onOpen={() => onOpenDetails?.(item)}
      middle={
        <span
          style={{
            color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
            fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
            lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {appointmentListTimeText(item.preferredDate, item.preferredTime)}
        </span>
      }
      bottom={
        <NdjcPillBadge selected>
          {appointmentStatusDisplayLabel(item)}
        </NdjcPillBadge>
      }
      trailing={
        onContactMerchant && linkedItemAvailable ? (
          <button
            type="button"
            aria-label="Chat merchant"
            title="Chat merchant"
            style={{
              width: 40,
              height: 40,
              border: 0,
              borderRadius: 999,
              padding: 0,
              display: 'grid',
              placeItems: 'center',
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              background: 'transparent',
              boxShadow: 'none',
              cursor: 'pointer'
            }}
            onClick={event => {
              event.stopPropagation()
              onContactMerchant(item.id)
            }}
          >
            <NdjcChatBubbleIcon />
          </button>
        ) : null
      }
    />
  )
}

export function ShowcaseCustomerBookingsScreen({
  state,
  actions
}: {
  state: ShowcaseCustomerBookingsUiState
  actions: ShowcaseCustomerBookingsActions
}) {
  const [detailsItem, setDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const bookingsListPaddingX = '25px'
  const bookingsExpandedHeaderContentHeight = 185
  const bookingsCollapsedHeaderContentHeight = 130
  const {
    collapsed: bookingsHeaderCollapsed,
    headerRef,
    headerBottomPadding: bookingsHeaderBottomPadding,
    headerTotalHeight: bookingsHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: bookingsExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: bookingsCollapsedHeaderContentHeight,
    measureKey: [
      state.items.length,
      state.selectedDateFilter,
      state.selectedStatusFilter,
      state.selectedServiceFilter,
      state.dateFilterOptions.join(','),
      state.statusFilterOptions.join(','),
      state.serviceFilterOptions.join(',')
    ].join('|')
  })

return (
  <NdjcUnifiedBackground
    topNav={{
      onBack: actions.onBack,
      onHome: actions.onBackToHome
    }}
    bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Appointments"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
    }
  >
      <section
        className="ndjc-apk-bookings-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcCustomerPullRefreshContainer
          isRefreshing={state.isRefreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-bookings-list"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              background: '#e9efed',
              padding: `${listTopPadding}px ${bookingsListPaddingX} calc(var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, 84px) + ${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px)`,
              display: 'grid',
              alignContent: state.items.length ? 'start' : 'stretch',
              gridTemplateRows: state.items.length ? undefined : 'minmax(0, 1fr)',
              gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              boxSizing: 'border-box'
            }}
            onScroll={event => {
              handleCollapseScroll(event)

              ndjcHandleLoadMoreScroll(
                event,
                state.pagination,
                actions.onLoadMore
              )
            }}
          >
            {state.items.length ? (
              <section
                className="ndjc-bookings-list-items"
                style={{
                  width: '100%',
                  maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
                }}
              >
                {state.items.map(item => (
                  <AppointmentCard
                    key={item.id}
                    item={item}
                    onOpenProduct={actions.onOpenAppointmentProductDetail}
                    onOpenDetails={setDetailsItem}
                    onContactMerchant={actions.onContactMerchant}
                  />
                ))}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more bookings"
                  onLoadMore={actions.onLoadMore}
                />
              </section>
            ) : (
              <section
                className="ndjc-bookings-empty-wrap"
                style={{
                  width: '100%',
                  maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                  height: '100%',
                  minHeight: 0,
                  margin: '0 auto',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <NdjcInlineEmptyState
                  title="No bookings yet"
                  message="Your appointment requests will appear here after you submit a booking."
                  verticalPadding={0}
                />
              </section>
            )}
          </section>
        </NdjcCustomerPullRefreshContainer>

        <section
          className="ndjc-bookings-filter-card-wrap"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: bookingsHeaderHeight,
            boxSizing: 'border-box',
            background: APK_SHELL_UI.pageBg,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${bookingsHeaderBottomPadding}px`,
            overflow: 'hidden',
            transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-bookings-filter-card"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: bookingsHeaderCollapsed
                ? 4
                : 8,
              transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            <section
              className="ndjc-bookings-title-block"
              style={{
                width: '100%',
                display: 'grid',
                gap: bookingsHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: NDJC_ADMIN_TOOL_UI.emphasis,
                  fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                  letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                  textRendering: 'geometricPrecision',
                  transformOrigin: 'left top',
                  transform: bookingsHeaderCollapsed
                    ? 'translateY(-3px) scale(0.78)'
                    : 'translateY(0) scale(1)',
                  willChange: 'transform',
                  transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                My bookings
              </h1>

              <p
                style={{
                  margin: 0,
                  height: bookingsHeaderCollapsed ? 0 : 21,
                  color: APK_EDIT_ITEM_UI.body70,
                  fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                  opacity: bookingsHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: bookingsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                Manage your appointment requests.
              </p>

              <p
                style={{
                  margin: 0,
                  height: bookingsHeaderCollapsed ? 0 : 17,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                  opacity: bookingsHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: bookingsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                {state.items.length} bookings
              </p>
            </section>

            <section
              className="ndjc-bookings-filter-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: bookingsHeaderCollapsed ? 2 : 6,
                transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              <AppointmentFilterRow
                label="Date"
                options={state.dateFilterOptions}
                selected={state.selectedDateFilter}
                optionText={appointmentFilterDateLabel}
                onSelected={actions.onDateFilterChange}
              />

              <AppointmentFilterRow
                label="Status"
                options={state.statusFilterOptions}
                selected={state.selectedStatusFilter}
                onSelected={actions.onStatusFilterChange}
              />

              <AppointmentFilterRow
                label="Item"
                options={state.serviceFilterOptions}
                selected={state.selectedServiceFilter}
                onSelected={actions.onServiceFilterChange}
              />
            </section>
          </section>
        </section>

        <NdjcSnackbarHost
          message={state.statusMessage?.toLowerCase() === 'no data.'
            ? null
            : state.statusMessage}
        />

        <CustomerBookingDetailsBottomSheet
          item={detailsItem}
          onClose={() => setDetailsItem(null)}
          onOpenProduct={actions.onOpenAppointmentProductDetail}
          onCancelBooking={actions.onCancelBooking}
          onCopy={actions.onCopy}
          cancellationSubmittingId={state.cancellationSubmittingId}
        />
      </section>
    </NdjcUnifiedBackground>
  )
}
const NDJC_APPOINTMENT_NOTE_MAX_BYTES = 100

function ndjcUtf8ByteLength(value: string): number {
  let bytes = 0

  for (const char of value) {
    const codePoint = char.codePointAt(0) ?? 0

    if (codePoint <= 0x7f) {
      bytes += 1
    } else if (codePoint <= 0x7ff) {
      bytes += 2
    } else if (codePoint <= 0xffff) {
      bytes += 3
    } else {
      bytes += 4
    }
  }

  return bytes
}

function ndjcTrimToUtf8Bytes(value: string, maxBytes: number): string {
  let bytes = 0
  let endIndex = 0

  for (const char of value) {
    const codePoint = char.codePointAt(0) ?? 0
    const charBytes = codePoint <= 0x7f
      ? 1
      : codePoint <= 0x7ff
        ? 2
        : codePoint <= 0xffff
          ? 3
          : 4

    if (bytes + charBytes > maxBytes) {
      break
    }

    bytes += charBytes
    endIndex += char.length
  }

  return value.slice(0, endIndex)
}

export function ShowcaseAppointmentsScreen({
  state,
  actions
}: {
  state: ShowcaseAppointmentsUiState
  actions: ShowcaseAppointmentsActions
}) {
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = React.useState(false)

  const confirmProductTitle = state.product?.title?.trim() || 'Selected item'
  const confirmTime = appointmentDetailTimeText(state.dateDraft, state.timeDraft)
  const confirmCustomer = state.nameDraft.trim() || 'Customer'
  const confirmContact = state.contactDraft.trim() || 'No contact provided'
  const confirmNote = ndjcTrimToUtf8Bytes(state.noteDraft, NDJC_APPOINTMENT_NOTE_MAX_BYTES).trim()

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      {showSubmitConfirmDialog ? (
        <NdjcBaseDialog
          title="Confirm booking request"
          dismissText="Edit"
          confirmText="Confirm booking request"
          confirmEnabled={state.canSubmit && !state.isSubmitting}
          confirmLoading={state.isSubmitting}
          destructiveConfirm={false}
          onDismissRequest={() => {
            if (state.isSubmitting) return
            setShowSubmitConfirmDialog(false)
          }}
          onDismissClick={() => {
            if (state.isSubmitting) return
            setShowSubmitConfirmDialog(false)
          }}
          onConfirmClick={() => {
            if (state.isSubmitting) return

            void Promise.resolve(actions.onSubmit())
              .then(() => {
                setShowSubmitConfirmDialog(false)
              })
          }}
          textContent={
            <section
              style={{
                width: '100%',
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.sectionCardGap
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.body70,
                  fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight
                }}
              >
                Please review your booking details before sending this request.
              </p>

              <section
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.fieldGap
                }}
              >
                <AppointmentSubmitConfirmInfo
                  label="Booking for"
                  value={confirmProductTitle}
                />

                <AppointmentSubmitConfirmInfo
                  label="Time"
                  value={confirmTime}
                />

                <AppointmentSubmitConfirmInfo
                  label="Customer"
                  value={confirmCustomer}
                />

                <AppointmentSubmitConfirmInfo
                  label="Contact"
                  value={confirmContact}
                />

                {confirmNote ? (
                  <AppointmentSubmitConfirmInfo
                    label="Note"
                    value={confirmNote}
                    maxLines={null}
                  />
                ) : null}
              </section>
            </section>
          }
        />
      ) : null}

      <section
        className="ndjc-appointment-form-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-appointment-form-layer"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            minHeight: 0,
            padding: `${APK_EDIT_ITEM_UI.topContentPadding}px ${APK_EDIT_ITEM_UI.screenPadding}px calc(${APK_EDIT_ITEM_UI.bottomContentPadding}px + env(safe-area-inset-bottom))`,
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <section
            className="ndjc-appointment-form-root-card"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              alignSelf: 'center',
              boxSizing: 'border-box',
              borderRadius: 0,
              padding: 0,
              background: 'transparent',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <section
              className="ndjc-appointment-form-card-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <EditItemHeaderText
                title={'Book\nappointment'}
                subtitle="Send a booking request. The business can confirm or contact you later."
              />

              <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionBottom} />

              <EditItemSectionCard className="ndjc-appointment-form-details-card">
                <EditItemSectionTitle
                  title="Details"
                  subtitle="Fields marked * are required. Optional note can help the business understand your request."
                />

              {!state.enabled ? (
                <section
                  style={{
                    width: '100%',
                    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
                    padding: '10px 12px',
                    boxSizing: 'border-box',
                    color: NDJC_GLOBAL_UI_TOKENS.colors.warning,
                    background: NDJC_GLOBAL_UI_TOKENS.colors.warningSoft
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: NDJC_GLOBAL_UI_TOKENS.colors.warning,
                      fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                      lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                      fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight
                    }}
                  >
                    Appointment booking is currently disabled.
                  </p>
                </section>
              ) : null}

              <AppointmentBookingProductSection
                product={state.product}
                enabled={state.enabled}
                onOpenProductDetail={actions.onOpenProductDetail}
              />

              <NdjcTextField
                value={state.nameDraft}
                onChange={actions.onNameChange}
                disabled={!state.enabled}
                label="Your name *"
                placeholder="Enter your name"
                singleLine
              />

              <NdjcTextField
                value={state.contactDraft}
                onChange={actions.onContactChange}
                disabled={!state.enabled}
                label="Phone, email, or social account *"
                placeholder="Enter phone, email, or social account"
                singleLine
              />

              <section
                style={{
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: APK_EDIT_ITEM_UI.fieldGap
                }}
              >
                <NdjcTextField
                  value={ndjcTrimToUtf8Bytes(state.noteDraft, NDJC_APPOINTMENT_NOTE_MAX_BYTES)}
                  onChange={value => actions.onNoteChange(ndjcTrimToUtf8Bytes(value, NDJC_APPOINTMENT_NOTE_MAX_BYTES))}
                  disabled={!state.enabled}
                  label="Optional note"
                  placeholder="Add details for the business"
                  singleLine={false}
                  minLines={3}
                />

                <section
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: APK_EDIT_ITEM_UI.fieldGap
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    <EditItemBodySmallText>
                      Share anything the business should know before confirming. Up to 100 bytes.
                    </EditItemBodySmallText>
                  </span>

                  <span
                    style={{
                      color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
                      fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                      lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                      fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {Math.min(ndjcUtf8ByteLength(state.noteDraft), NDJC_APPOINTMENT_NOTE_MAX_BYTES)}/{NDJC_APPOINTMENT_NOTE_MAX_BYTES}
                  </span>
                </section>
              </section>
            </EditItemSectionCard>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionCard className="ndjc-appointment-form-schedule-card">
              <EditItemSectionTitle
                title="Schedule"
                subtitle="Choose an available date and time."
              />

              <AppointmentCustomerDateRow
                title="Date"
                options={state.dateOptions}
                selected={state.dateDraft}
                enabled={state.enabled}
                onSelected={actions.onDateChange}
              />

              <AppointmentCustomerTimeGrid
                title="Time"
                options={state.timeOptions}
                selected={state.timeDraft}
                emptyText={state.dateDraft.trim()
                  ? 'No available times for this date.'
                  : 'Select an available date first.'}
                enabled={state.enabled && Boolean(state.dateDraft.trim())}
                onSelected={actions.onTimeChange}
              />

              {state.errorMessage ? (
                <p
                  style={{
                    margin: 0,
                    color: NDJC_GLOBAL_UI_TOKENS.colors.danger,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  {state.errorMessage}
                </p>
              ) : null}

              {state.successMessage ? (
                <p
                  style={{
                    margin: 0,
                    color: NDJC_GLOBAL_UI_TOKENS.colors.success,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  {state.successMessage}
                </p>
              ) : null}

              <AppointmentSubmitConfirmLine
                enabled={state.enabled}
                canSubmit={state.canSubmit}
                isSubmitting={state.isSubmitting}
                onSubmit={() => setShowSubmitConfirmDialog(true)}
              />
              </EditItemSectionCard>
            </section>
          </section>
        </section>
      </section>
    </NdjcUnifiedBackground>
  )
}
export function ShowcaseAdminAppointmentManager({
  state,
  actions
}: {
  state: ShowcaseAdminAppointmentsUiState
  actions: ShowcaseAdminAppointmentsActions
}) {
  const [detailsItem, setDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const [showBookingSettingsSheet, setShowBookingSettingsSheet] = React.useState(false)
  const [editingAvailableTimeTarget, setEditingAvailableTimeTarget] = React.useState<'start' | 'end' | null>(null)
  const [pendingAvailableTimeValue, setPendingAvailableTimeValue] = React.useState<string | null>(null)
  const [showHistoryDatePicker, setShowHistoryDatePicker] = React.useState(false)
  const [bookingSettingsDraft, setBookingSettingsDraft] = React.useState(() => ({
    enabled: state.enabled,
    bookingWindowDays: state.bookingWindowDays,
    availableHoursText: state.availableHoursText,
    slotIntervalMinutes: state.slotIntervalMinutes,
    closedDays: state.closedDays,
    minimumNotice: state.minimumNotice
  }))
  const adminAppointmentsListPaddingX = '25px'
  const adminAppointmentsExpandedHeaderContentHeight = 350
  const adminAppointmentsCollapsedHeaderContentHeight = 250
  const {
    collapsed: adminAppointmentsHeaderCollapsed,
    headerRef,
    headerBottomPadding: adminAppointmentsHeaderBottomPadding,
    headerTotalHeight: adminAppointmentsHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: adminAppointmentsExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: adminAppointmentsCollapsedHeaderContentHeight,
    measureKey: [
      state.enabled,
      state.bookingWindowDays,
      state.availableHoursText,
      state.slotIntervalMinutes,
      state.minimumNotice,
      state.closedDays.join(','),
      state.historyDateFilter,
      state.selectedDateFilter,
      state.selectedStatusFilter,
      state.selectedServiceFilter,
      state.dateFilterOptions.join(','),
      state.statusFilterOptions.join(','),
      state.serviceFilterOptions.join(',')
    ].join('|')
  })

  function resetBookingSettingsDraftFromState(): void {
    setBookingSettingsDraft({
      enabled: state.enabled,
      bookingWindowDays: state.bookingWindowDays,
      availableHoursText: state.availableHoursText,
      slotIntervalMinutes: state.slotIntervalMinutes,
      closedDays: state.closedDays,
      minimumNotice: state.minimumNotice
    })
  }

  function openBookingSettingsSheet(): void {
    if (state.settingsSubmitting) return
    setBookingSettingsDraft({
      enabled: state.enabled,
      bookingWindowDays: state.bookingWindowDays,
      availableHoursText: state.availableHoursText,
      slotIntervalMinutes: state.slotIntervalMinutes,
      closedDays: state.closedDays,
      minimumNotice: state.minimumNotice
    })
    setShowBookingSettingsSheet(true)
  }

  function updateBookingSettingsDraft(
    patch: Partial<typeof bookingSettingsDraft>
  ): void {
    setBookingSettingsDraft(current => ({
      ...current,
      ...patch
    }))
  }

  function toggleBookingClosedDayDraft(day: string): void {
    setBookingSettingsDraft(current => {
      const nextClosedDays = current.closedDays.includes(day)
        ? current.closedDays.filter(item => item !== day)
        : [...current.closedDays, day]

      return {
        ...current,
        closedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(item => nextClosedDays.includes(item))
      }
    })
  }

  React.useEffect(() => {
    if (showBookingSettingsSheet) return
    resetBookingSettingsDraftFromState()
  }, [
    showBookingSettingsSheet,
    state.enabled,
    state.bookingWindowDays,
    state.availableHoursText,
    state.slotIntervalMinutes,
    state.minimumNotice,
    state.closedDays.join(',')
  ])

  const bookingSettingsSummary = [
    state.enabled ? 'On' : 'Off',
    `${state.bookingWindowDays} days`,
    state.availableHoursText.replace(' - ', '-'),
    `${state.slotIntervalMinutes} min`,
    state.minimumNotice
  ].filter(Boolean).join(' · ')
  const bookingClosedDaysSummary = state.closedDays.length
    ? `Closed ${state.closedDays.join(', ')}`
    : 'No closed days'
  const [availableHoursStart, availableHoursEnd] = splitAppointmentAvailableHours(bookingSettingsDraft.availableHoursText)
  const bookingSettingsSheetInnerPaddingX = Math.max(
    0,
    APK_EDIT_ITEM_UI.screenPadding - APK_FILTER_UI.sheetContentPaddingX
  )
  const bookingSettingsSheetTitlePaddingX = APK_EDIT_ITEM_UI.screenPadding

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-admin-appointments-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          isRefreshing={state.isRefreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-admin-appointments-list-layer"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              background: '#e9efed',
              padding: `${listTopPadding}px ${adminAppointmentsListPaddingX} calc(${APK_PAGE_SHELL_UI.screenPadding}px + env(safe-area-inset-bottom))`,
              boxSizing: 'border-box',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
            }}
            onScroll={event => {
              handleCollapseScroll(event)

              ndjcHandleLoadMoreScroll(
                event,
                state.pagination,
                actions.onLoadMore
              )
            }}
          >
            {state.items.length ? (
              <section
                className="ndjc-admin-appointments-list-items"
                style={{
                  width: '100%',
                  maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
                }}
              >
                {state.items.map(item => {
                  const linkedItemAvailable = Boolean(
  item.itemAvailable &&
  item.sourceDishId &&
  item.imageUrl &&
  item.priceText
)

                  return (
                    <AppointmentCatalogItemCard
                      key={item.id}
                      title={item.serviceTitle || 'General appointment'}
                      imageUrl={item.imageUrl}
                      priceTextValue={null}
                      categoryText={null}
                      isRecommended={item.isRecommended}
                      itemAvailable={linkedItemAvailable}
                      allowClickWhenUnavailable
                      onOpen={() => setDetailsItem(item)}
                      middle={
                        <span
                          style={{
                            color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                            fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                            lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {appointmentListTimeText(item.preferredDate, item.preferredTime)}
                        </span>
                      }
                      bottom={
                        <NdjcPillBadge selected>
                          {appointmentStatusDisplayLabel(item)}
                        </NdjcPillBadge>
                      }
                      trailing={
                        linkedItemAvailable ? (
                          <button
                            type="button"
                            aria-label="Chat customer"
                            title="Chat customer"
                            style={{
                              width: 40,
                              height: 40,
                              border: 0,
                              borderRadius: 999,
                              padding: 0,
                              display: 'grid',
                              placeItems: 'center',
                              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                              background: 'transparent',
                              boxShadow: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={event => {
                              event.stopPropagation()
                              actions.onContactCustomer(item.id)
                            }}
                          >
                            <NdjcChatBubbleIcon />
                          </button>
                        ) : null
                      }
                    />
                  )
                })}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more appointments"
                  onLoadMore={actions.onLoadMore}
                />
              </section>
            ) : (
              <section
                className="ndjc-admin-appointments-empty-wrap"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 0,
                  maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                  margin: '0 auto',
                  display: 'grid',
                  placeItems: 'center',
                  boxSizing: 'border-box'
                }}
              >
                <NdjcInlineEmptyState
                  title="No appointment requests yet"
                  message="New customer requests will appear here after customers submit a booking."
                  verticalPadding={0}
                />
              </section>
            )}
          </section>

          <section
            className="ndjc-admin-appointments-header-wrap"
            style={{
              position: 'absolute',
              zIndex: 3,
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: adminAppointmentsHeaderHeight,
              boxSizing: 'border-box',
              background: APK_SHELL_UI.pageBg,
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
              padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${adminAppointmentsHeaderBottomPadding}px`,
              overflow: 'hidden',
              transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            <section
              ref={headerRef}
              className="ndjc-admin-appointments-header-column"
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: adminAppointmentsHeaderCollapsed
                  ? 4
                  : APK_EDIT_ITEM_UI.sectionCardGap,
                transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              <section
                className="ndjc-admin-appointments-title-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: adminAppointmentsHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    color: NDJC_ADMIN_TOOL_UI.emphasis,
                    fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                    letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                    textRendering: 'geometricPrecision',
                    transformOrigin: 'left top',
                    transform: adminAppointmentsHeaderCollapsed
                      ? 'translateY(-3px) scale(0.78)'
                      : 'translateY(0) scale(1)',
                    willChange: 'transform',
                    transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  Appointments
                </h1>

                <p
                  style={{
                    margin: 0,
                    height: adminAppointmentsHeaderCollapsed ? 0 : 21,
                    color: APK_EDIT_ITEM_UI.body70,
                    fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                    opacity: adminAppointmentsHeaderCollapsed ? 0 : 1,
                    overflow: 'hidden',
                    transform: adminAppointmentsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                    willChange: 'opacity, transform',
                    transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  Manage customer appointment requests.
                </p>

                <p
                  style={{
                    margin: 0,
                    height: adminAppointmentsHeaderCollapsed ? 0 : 17,
                    color: APK_EDIT_ITEM_UI.body55,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                    opacity: adminAppointmentsHeaderCollapsed ? 0 : 1,
                    overflow: 'hidden',
                    transform: adminAppointmentsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                    willChange: 'opacity, transform',
                    transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  {state.items.length} appointments
                </p>
              </section>

              <section
                className="ndjc-admin-appointments-settings-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  gap: APK_EDIT_ITEM_UI.fieldGap,
                  alignItems: 'center'
                }}
              >
                <section
                  className="ndjc-admin-appointments-settings-summary-card"
                  role="button"
                  tabIndex={state.settingsSubmitting ? -1 : 0}
                  aria-label="Open booking settings"
                  style={{
                    minWidth: 0,
                    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
                    padding: adminAppointmentsHeaderCollapsed ? '5px 10px' : '7px 10px',
                    boxSizing: 'border-box',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto',
                    gap: APK_EDIT_ITEM_UI.fieldGap,
                    alignItems: 'center',
                    color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                    background: APK_EDIT_ITEM_UI.fieldBackground,
                    cursor: state.settingsSubmitting ? 'not-allowed' : 'pointer',
                    opacity: state.settingsSubmitting ? 0.62 : 1,
                    transition: 'padding 180ms cubic-bezier(0.2, 0, 0, 1), gap 180ms cubic-bezier(0.2, 0, 0, 1), opacity 120ms ease'
                  }}
                  onClick={() => {
                    if (state.settingsSubmitting) return
                    openBookingSettingsSheet()
                  }}
                  onKeyDown={event => {
                    if (state.settingsSubmitting) return
                    if (event.key !== 'Enter' && event.key !== ' ') return
                    event.preventDefault()
                    openBookingSettingsSheet()
                  }}
                >
                  <section
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: adminAppointmentsHeaderCollapsed ? 2 : 6,
                      transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
                    }}
                  >
                    <span
                      style={{
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                        fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                        lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Booking settings
                    </span>

                    <section
                      style={{
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: adminAppointmentsHeaderCollapsed ? 0 : 2,
                        transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
                      }}
                    >
                      <span
                        style={{
                          color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {bookingSettingsSummary}
                      </span>

                      <span
                        style={{
                          color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {bookingClosedDaysSummary}
                      </span>
                    </section>
                  </section>

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                    style={{
                      color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                      opacity: adminAppointmentsHeaderCollapsed ? 0 : 0.72,
                      transform: adminAppointmentsHeaderCollapsed ? 'translateX(2px)' : 'translateX(0)',
                      transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                    }}
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </section>
              </section>

                <section
                  className="ndjc-admin-appointments-filter-title-row"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 48px',
                    gap: adminAppointmentsHeaderCollapsed ? 8 : APK_EDIT_ITEM_UI.fieldGap,
                    alignItems: 'center',
                    transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  <section
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: adminAppointmentsHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint,
                      transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
                    }}
                  >
                    <span
                      style={{
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Filters
                    </span>

                    <span
                      style={{
                        height: adminAppointmentsHeaderCollapsed ? 0 : 17,
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                        fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                        opacity: adminAppointmentsHeaderCollapsed ? 0 : 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        transform: adminAppointmentsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                        willChange: 'opacity, transform',
                        transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                      }}
                    >
                      Filter past bookings by date.
                    </span>
                  </section>

                  <NdjcFilterIconButton
                    active={Boolean(state.historyDateFilter)}
                    label={state.historyDateFilter ? 'Clear date filter' : 'Open calendar filter'}
                    onClick={() => {
                      if (state.historyDateFilter) {
                        actions.onHistoryDateClear()
                        return
                      }

                      setShowHistoryDatePicker(true)
                    }}
                    icon={state.historyDateFilter ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7.2 7.2 16.8 16.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.8 7.2 7.2 16.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 4.8v2.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17 4.8v2.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5.8 8.6h12.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.8 6.2h10.4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6.8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.4 12.2h.1M12 12.2h.1M15.6 12.2h.1M8.4 15.4h.1M12 15.4h.1"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  />
                </section>

                <section
                  className="ndjc-admin-appointments-filter-column"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: adminAppointmentsHeaderCollapsed ? 2 : 6,
                    transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
{state.historyDateFilter ? (
  <AppointmentFilterRow
    label="Date"
    options={[state.historyDateFilter]}
    selected={state.historyDateFilter}
    optionText={appointmentHistoryDateLabel}
    onSelected={() => setShowHistoryDatePicker(true)}
  />
) : (
  <AppointmentFilterRow
    label="Date"
    options={state.dateFilterOptions}
    selected={state.selectedDateFilter}
    optionText={appointmentFilterDateLabel}
    onSelected={actions.onDateFilterChange}
  />
)}

                  <AppointmentFilterRow
                    label="Status"
                    options={state.statusFilterOptions}
                    selected={state.selectedStatusFilter}
                    onSelected={actions.onStatusFilterChange}
                  />

                  <AppointmentFilterRow
                    label="Item"
                    options={state.serviceFilterOptions}
                    selected={state.selectedServiceFilter}
                    onSelected={actions.onServiceFilterChange}
                  />
                </section>
              </section>
            </section>
        </NdjcAdminPullRefreshContainer>

        <NdjcSnackbarHost
          message={state.statusMessage?.toLowerCase() === 'no data.'
            ? null
            : state.statusMessage}
        />

        <AppointmentDetailsBottomSheet
          item={detailsItem}
          onClose={() => setDetailsItem(null)}
          onOpenProduct={actions.onOpenAppointmentProductDetail}
          adminActions={actions}
          statusSubmittingId={state.statusSubmittingId}
        />

        <AppointmentHistoryDatePickerSheet
          open={showHistoryDatePicker}
          selectedDate={state.historyDateFilter || ''}
          onSelect={value => {
            actions.onHistoryDateSelected(value)
            setShowHistoryDatePicker(false)
          }}
          onClose={() => setShowHistoryDatePicker(false)}
        />

        <NdjcFilterBottomSheet
          open={showBookingSettingsSheet}
          title="Booking settings"
          clearText=""
          applyText="Save settings"
          showPriceFields={false}
          showHeaderAction={false}
          showHeaderDivider={false}
          headerPaddingX={bookingSettingsSheetTitlePaddingX}
          showApplyButton={false}
          applyLoading={state.settingsSubmitting}
          onClose={() => {
            if (state.settingsSubmitting) return
            setShowBookingSettingsSheet(false)
            resetBookingSettingsDraftFromState()
          }}
          onApply={() => {
            if (state.settingsSubmitting) return

            void Promise.resolve(actions.onSettingsSave({
              enabled: bookingSettingsDraft.enabled,
              bookingWindowDays: bookingSettingsDraft.bookingWindowDays,
              availableHoursText: bookingSettingsDraft.availableHoursText,
              slotIntervalMinutes: bookingSettingsDraft.slotIntervalMinutes,
              closedDays: bookingSettingsDraft.closedDays,
              minimumNotice: bookingSettingsDraft.minimumNotice
            })).then(() => {
              setShowBookingSettingsSheet(false)
            })
          }}
          onClear={() => {
            if (state.settingsSubmitting) return

            setBookingSettingsDraft(current => ({
              ...current,
              bookingWindowDays: 7,
              availableHoursText: '09:00 - 18:00',
              slotIntervalMinutes: 30,
              closedDays: [],
              minimumNotice: 'No notice'
            }))
          }}
        >
          <section
            className="ndjc-admin-booking-settings-content"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              display: 'grid',
              gap: APK_EDIT_ITEM_UI.sectionCardGap
            }}
          >
            <EditItemSectionCard className="ndjc-admin-booking-settings-card">
              <section
                className="ndjc-admin-booking-settings-inner"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: bookingSettingsSheetInnerPaddingX,
                  paddingRight: bookingSettingsSheetInnerPaddingX,
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.sectionCardGap
                }}
              >
                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <NdjcToggleRow
                    label="Appointment booking"
                    labelNode={<EditItemSectionTitle title="Appointment booking" />}
                    checked={bookingSettingsDraft.enabled}
                    enabled={!state.settingsSubmitting}
                    onCheckedChange={nextEnabled => {
                      setBookingSettingsDraft(current => ({
                        ...current,
                        enabled: nextEnabled
                      }))
                    }}
                  />
                </section>

                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <EditItemSectionTitle title="Booking window" />

                  <section
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(days => (
                      <NdjcPillButton
                        key={days}
                        selected={bookingSettingsDraft.bookingWindowDays === days}
                        disabled={state.settingsSubmitting}
                        onClick={() => {
                          if (state.settingsSubmitting) return
                          updateBookingSettingsDraft({
                            bookingWindowDays: days
                          })
                        }}
                      >
                        {days === 1 ? '1 day' : `${days} days`}
                      </NdjcPillButton>
                    ))}
                  </section>
                </section>

                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <EditItemSectionTitle title="Available hour" />

                  <section
                    className="ndjc-admin-booking-available-hour-row"
                    style={{
                      width: '100%',
                      minHeight: APK_EDIT_ITEM_UI.fieldMinHeight,
                      boxSizing: 'border-box',
                      borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
                      border: `${APK_EDIT_ITEM_UI.fieldBorderWidth}px solid ${APK_EDIT_ITEM_UI.fieldBorderColor}`,
                      background: APK_EDIT_ITEM_UI.fieldBackground,
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 1px minmax(0, 1fr)',
                      alignItems: 'stretch',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      disabled={state.settingsSubmitting}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        minHeight: APK_EDIT_ITEM_UI.fieldMinHeight,
                        border: 0,
                        borderRadius: 0,
                        padding: `${APK_EDIT_ITEM_UI.fieldPaddingY}px ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                        background: 'transparent',
                        boxShadow: 'none',
                        cursor: state.settingsSubmitting ? 'not-allowed' : 'pointer',
                        opacity: state.settingsSubmitting ? 0.62 : 1,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                      }}
                      onClick={() => {
                        if (state.settingsSubmitting) return
                        setPendingAvailableTimeValue(normalizeAppointmentTimeText(availableHoursStart))
                        setEditingAvailableTimeTarget('start')
                      }}
                    >
                      <span
                        style={{
                          margin: 0,
                          color: APK_EDIT_ITEM_UI.body55,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: 650,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Start
                      </span>

                      <strong
                        style={{
                          margin: 0,
                          color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                          fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                          fontWeight: 650,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {normalizeAppointmentTimeText(availableHoursStart)}
                      </strong>
                    </button>

                    <span
                      style={{
                        width: 1,
                        minHeight: '100%',
                        background: APK_EDIT_ITEM_UI.fieldBorderColor
                      }}
                      aria-hidden="true"
                    />

                    <button
                      type="button"
                      disabled={state.settingsSubmitting}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        minHeight: APK_EDIT_ITEM_UI.fieldMinHeight,
                        border: 0,
                        borderRadius: 0,
                        padding: `${APK_EDIT_ITEM_UI.fieldPaddingY}px ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                        background: 'transparent',
                        boxShadow: 'none',
                        cursor: state.settingsSubmitting ? 'not-allowed' : 'pointer',
                        opacity: state.settingsSubmitting ? 0.62 : 1,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                      }}
                      onClick={() => {
                        if (state.settingsSubmitting) return
                        setPendingAvailableTimeValue(normalizeAppointmentTimeText(availableHoursEnd))
                        setEditingAvailableTimeTarget('end')
                      }}
                    >
                      <span
                        style={{
                          margin: 0,
                          color: APK_EDIT_ITEM_UI.body55,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: 650,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        End
                      </span>

                      <strong
                        style={{
                          margin: 0,
                          color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                          fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                          fontWeight: 650,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {normalizeAppointmentTimeText(availableHoursEnd)}
                      </strong>
                    </button>
                  </section>
                </section>

                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <EditItemSectionTitle title="Slot interval" />

                  <section
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {[30, 60].map(minutes => (
                      <NdjcPillButton
                        key={minutes}
                        selected={bookingSettingsDraft.slotIntervalMinutes === minutes}
                        disabled={state.settingsSubmitting}
                        onClick={() => {
                          if (state.settingsSubmitting) return
                          updateBookingSettingsDraft({
                            slotIntervalMinutes: minutes
                          })
                        }}
                      >
                        {minutes} min
                      </NdjcPillButton>
                    ))}
                  </section>
                </section>

                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <EditItemSectionTitle title="Closed days" />

                  <section
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <NdjcPillButton
                        key={day}
                        selected={bookingSettingsDraft.closedDays.includes(day)}
                        disabled={state.settingsSubmitting}
                        onClick={() => {
                          if (state.settingsSubmitting) return
                          toggleBookingClosedDayDraft(day)
                        }}
                      >
                        {day}
                      </NdjcPillButton>
                    ))}
                  </section>
                </section>

                <section
                  className="ndjc-admin-booking-settings-section"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.labelGap
                  }}
                >
                  <EditItemSectionTitle title="Minimum notice" />

                  <section
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {[
                      'No notice',
                      '1 hour',
                      '2 hours',
                      '6 hours',
                      '12 hours',
                      '1 day',
                      '2 days',
                      '3 days'
                    ].map(notice => (
                      <NdjcPillButton
                        key={notice}
                        selected={bookingSettingsDraft.minimumNotice === notice}
                        disabled={state.settingsSubmitting}
                        onClick={() => {
                          if (state.settingsSubmitting) return
                          updateBookingSettingsDraft({
                            minimumNotice: notice
                          })
                        }}
                      >
                        {notice}
                      </NdjcPillButton>
                    ))}
                  </section>
                </section>

                <NdjcControlPillButton
                  disabled={state.settingsSubmitting}
                  active={!state.settingsSubmitting}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (state.settingsSubmitting) return

                    void Promise.resolve(actions.onSettingsSave({
                      enabled: bookingSettingsDraft.enabled,
                      bookingWindowDays: bookingSettingsDraft.bookingWindowDays,
                      availableHoursText: bookingSettingsDraft.availableHoursText,
                      slotIntervalMinutes: bookingSettingsDraft.slotIntervalMinutes,
                      closedDays: bookingSettingsDraft.closedDays,
                      minimumNotice: bookingSettingsDraft.minimumNotice
                    })).then(() => {
                      setShowBookingSettingsSheet(false)
                    })
                  }}
                >
                  {state.settingsSubmitting ? 'Saving...' : 'Save settings'}
                </NdjcControlPillButton>
              </section>
            </EditItemSectionCard>
          </section>
        </NdjcFilterBottomSheet>

        <NdjcFilterBottomSheet
          open={editingAvailableTimeTarget !== null}
          title={editingAvailableTimeTarget === 'start' ? 'Start time' : 'End time'}
          clearText=""
          applyText="Done"
          showPriceFields={false}
          showHeaderAction={false}
          showHeaderDivider={false}
          headerPaddingX={bookingSettingsSheetTitlePaddingX}
          showApplyButton={false}
          onClose={() => {
            setEditingAvailableTimeTarget(null)
            setPendingAvailableTimeValue(null)
          }}
          onApply={() => {
            setEditingAvailableTimeTarget(null)
            setPendingAvailableTimeValue(null)
          }}
          onClear={() => {
            setEditingAvailableTimeTarget(null)
            setPendingAvailableTimeValue(null)
          }}
        >
          <section
            className="ndjc-admin-booking-time-sheet-content"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              display: 'grid',
              gap: APK_EDIT_ITEM_UI.sectionCardGap
            }}
          >
            <EditItemSectionCard className="ndjc-admin-booking-time-sheet-card">
              <section
                className="ndjc-admin-booking-time-sheet-inner"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: bookingSettingsSheetInnerPaddingX,
                  paddingRight: bookingSettingsSheetInnerPaddingX,
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.sectionCardGap
                }}
              >
                <section
                  className="ndjc-admin-booking-time-options"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  {appointmentTimeOptions().map(time => {
                    const currentSelectedTime = pendingAvailableTimeValue
                      || (editingAvailableTimeTarget === 'start'
                        ? normalizeAppointmentTimeText(availableHoursStart)
                        : normalizeAppointmentTimeText(availableHoursEnd))
                    const active = currentSelectedTime === time

                    return (
                      <NdjcPillButton
                        key={time}
                        selected={active}
                        disabled={state.settingsSubmitting}
                        onClick={() => {
                          if (state.settingsSubmitting) return
                          setPendingAvailableTimeValue(time)
                        }}
                      >
                        {time}
                      </NdjcPillButton>
                    )
                  })}
                </section>

                <NdjcControlPillButton
                  disabled={state.settingsSubmitting || !pendingAvailableTimeValue}
                  active={!state.settingsSubmitting && Boolean(pendingAvailableTimeValue)}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (state.settingsSubmitting || !pendingAvailableTimeValue || !editingAvailableTimeTarget) return

                    const nextStart = editingAvailableTimeTarget === 'start'
                      ? pendingAvailableTimeValue
                      : normalizeAppointmentTimeText(availableHoursStart)
                    const nextEnd = editingAvailableTimeTarget === 'end'
                      ? pendingAvailableTimeValue
                      : normalizeAppointmentTimeText(availableHoursEnd)

                    updateBookingSettingsDraft({
                      availableHoursText: `${nextStart} - ${nextEnd}`
                    })
                    setEditingAvailableTimeTarget(null)
                    setPendingAvailableTimeValue(null)
                  }}
                >
                  Done
                </NdjcControlPillButton>
              </section>
            </EditItemSectionCard>
          </section>
        </NdjcFilterBottomSheet>
      </section>
    </NdjcUnifiedBackground>
  )
}
