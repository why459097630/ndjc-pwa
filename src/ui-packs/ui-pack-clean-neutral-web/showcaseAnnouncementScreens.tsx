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
import {
  NdjcConversationPageScaffold,
  NdjcConversationTimePill
} from './showcaseChatScreens'

function AnnouncementTimePill({ timeText }: { timeText: string }) {
  return (
    <div
      className="ndjc-announcement-time-pill-wrap"
      style={{
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: `${APK_ANNOUNCEMENT_UI.timePillWrapPaddingY}px 0`
      }}
    >
      <span className="ndjc-announcement-time-pill" style={apkAnnouncementTimePillStyle}>
        {timeText || 'Just now'}
      </span>
    </div>
  )
}

function AnnouncementDraftCard({
  item,
  selected,
  onOpen,
  onPreview,
  onToggleSelect
}: {
  item: ShowcaseAnnouncementCard
  selected: boolean
  onOpen: (id: string) => void
  onPreview: (id: string) => void
  onToggleSelect: (id: string) => void
}) {
  const coverUrl = selectAnnouncementCoverUrl(item, 'announcementCard')
  const previewText = String(item.bodyPreview || item.bodyText || 'This is a short preview...').trim()
  const timeText = String(item.timeText || 'Draft').trim()

  return (
    <NdjcLinkedCatalogItemCard
      title="Draft announcement"
      titleStyle={{
        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
        fontSize: 15,
        lineHeight: 1.25,
        fontWeight: 700,
        letterSpacing: '-0.15px'
      }}
      imageUrl={coverUrl}
      selected={selected}
      available={Boolean(coverUrl)}
      allowClickWhenUnavailable
      imageUnavailableText="No image"
      showSelectedOutline={false}
      onOpen={() => onPreview(item.id)}
      middle={
        <span
          className="ndjc-announcement-draft-preview"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'block',
            color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
            fontSize: 12,
            lineHeight: 1.25,
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {previewText}
        </span>
      }
      bottom={
        <span
          className="ndjc-announcement-draft-meta-row"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'block',
            color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
            fontSize: 12,
            lineHeight: 1.25,
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {timeText}
        </span>
      }
      trailing={
        <span
          className="ndjc-announcement-draft-trailing"
          style={{
            height: APK_SHOWCASE_ITEM_UI.catalogImageSize,
            minWidth: APK_CORE_UI.checkboxSize,
            display: 'grid',
            gridTemplateRows: `${APK_CORE_UI.checkboxSize}px 1fr auto`,
            alignItems: 'start',
            justifyItems: 'end'
          }}
          onPointerDown={event => {
            event.stopPropagation()
          }}
          onClick={event => {
            event.stopPropagation()
          }}
        >
          <NdjcSelectionCheckbox
            selected={selected}
            onClick={() => onToggleSelect(item.id)}
            label="Select announcement draft"
          />

          <span aria-hidden="true" />

          <button
            type="button"
            className="ndjc-announcement-draft-edit-button"
            style={{
              border: 0,
              borderRadius: 0,
              padding: 0,
              display: 'block',
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              background: 'transparent',
              boxShadow: 'none',
              fontSize: 12,
              lineHeight: 1.25,
              fontWeight: 700,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            onPointerDown={event => {
              event.stopPropagation()
            }}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              onOpen(item.id)
            }}
          >
            Edit
          </button>
        </span>
      }
    />
  )
}

function findNearestVerticalScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null

  while (current) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    const canScrollY = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'

    if (canScrollY && current.scrollHeight > current.clientHeight) {
      return current
    }

    current = current.parentElement
  }

  return null
}

function AnnouncementFeedCard({
  card,
  forceExpand,
  onOpenAnnouncement,
  onExpandAnnouncement,
  onOpenImagePreview
}: {
  card: ShowcaseAnnouncementCard
  forceExpand?: boolean
  onOpenAnnouncement: () => void
  onExpandAnnouncement: () => void
  onOpenImagePreview: (url: string) => void
}) {
  const [expanded, setExpanded] = React.useState(Boolean(forceExpand))
  const cardRef = React.useRef<HTMLElement | null>(null)
  const restoreScrollFrameRef = React.useRef<number | null>(null)
  const hasBody = card.bodyText.trim().length > 0
  const cleanCoverUrl = selectAnnouncementCoverUrl(card, 'announcementFeed') || ''

  React.useEffect(() => {
    if (forceExpand) {
      setExpanded(true)
    }
  }, [forceExpand])

  React.useEffect(() => {
    return () => {
      if (restoreScrollFrameRef.current != null) {
        window.cancelAnimationFrame(restoreScrollFrameRef.current)
        restoreScrollFrameRef.current = null
      }
    }
  }, [])

  function toggleExpandedText(): void {
    const nextExpanded = !expanded
    const cardElement = cardRef.current
    const scrollParent = findNearestVerticalScrollParent(cardElement)

    const previousScrollTop = scrollParent?.scrollTop ?? 0
    const previousCardTop = cardElement?.getBoundingClientRect().top ?? 0

    setExpanded(nextExpanded)

    if (nextExpanded) {
      onExpandAnnouncement()
    }

    if (restoreScrollFrameRef.current != null) {
      window.cancelAnimationFrame(restoreScrollFrameRef.current)
      restoreScrollFrameRef.current = null
    }

    restoreScrollFrameRef.current = window.requestAnimationFrame(() => {
      restoreScrollFrameRef.current = null

      if (!scrollParent || !cardElement) return

      const nextCardTop = cardElement.getBoundingClientRect().top
      const cardTopDelta = nextCardTop - previousCardTop

      scrollParent.scrollTop = previousScrollTop + cardTopDelta
    })
  }

  return (
    <section ref={cardRef}>
      <NdjcWhiteCard
        className={cx('ndjc-announcement-feed-card', forceExpand && 'is-focused')}
        style={{
          ...apkAnnouncementFeedCardStyle,
          outline: '0 solid transparent',
          transition: 'none'
        }}
      >
        {cleanCoverUrl ? (
          <button
            type="button"
            className="ndjc-announcement-cover-button"
            style={apkAnnouncementFeedImageButtonStyle}
            onClick={() => onOpenImagePreview(cleanCoverUrl)}
          >
            <NdjcShimmerImage
              src={cleanCoverUrl}
              alt="Announcement cover"
              className="ndjc-announcement-cover-image"
              placeholderCornerRadius={APK_ANNOUNCEMENT_UI.feedImageRadius}
              contentScale="cover"
            />
          </button>
        ) : (
          <button
            type="button"
            className="ndjc-announcement-cover-placeholder"
            style={apkAnnouncementFeedPlaceholderStyle}
            onClick={onOpenAnnouncement}
          >
            <span>No cover image</span>
          </button>
        )}

        <section
          className="ndjc-announcement-card-body"
          style={{
            ...apkAnnouncementFeedInnerStyle,
            transition: 'height 160ms ease'
          }}
        >
          <div className="ndjc-announcement-divider" style={apkAnnouncementFeedDividerStyle} />

          <div className="ndjc-announcement-meta-row" style={apkAnnouncementMetaRowStyle}>
            <span style={apkAnnouncementMetaTextStyle}>
              {card.viewCount} views
            </span>

            <span style={{ flex: '1 1 auto' }} aria-hidden="true" />

            {hasBody ? (
              <button
                type="button"
                style={apkAnnouncementExpandButtonStyle}
                onPointerDown={event => {
                  event.preventDefault()
                }}
                onClick={toggleExpandedText}
                aria-label={expanded ? 'Collapse announcement' : 'Expand announcement'}
              >
                <NdjcAnnouncementExpandIcon expanded={expanded} />
              </button>
            ) : null}
          </div>

          {hasBody ? (
            <section
              className={cx('ndjc-announcement-body-text', expanded && 'is-expanded')}
              style={apkAnnouncementExpandedBodyOuterStyle(expanded)}
              aria-hidden={!expanded}
            >
              <section style={apkAnnouncementExpandedBodyInnerStyle}>
                <section style={apkAnnouncementExpandedBodyStyle}>
                  <p style={apkAnnouncementBodyTextStyle}>
                    {card.bodyText}
                  </p>
                </section>
              </section>
            </section>
          ) : null}
        </section>
      </NdjcWhiteCard>
    </section>
  )
}

function ShowcaseAnnouncementsPreview({
  item,
  onClose,
  onOpenImage
}: {
  item: ShowcaseAnnouncementCard | null
  onClose: () => void
  onOpenImage?: (url: string) => void
}) {
  if (!item) return null

  return (
    <section className="ndjc-sheet-backdrop">
      <section className="ndjc-announcement-preview-sheet">
        <header className="ndjc-sheet-header" style={apkSheetHeaderRootStyle}>
          <div className="ndjc-sheet-header-row" style={apkSheetHeaderRowStyle}>
            <div className="ndjc-sheet-header-copy" style={apkSheetHeaderCopyStyle}>
              <h2 id="ndjc-announcement-preview-sheet-title" style={apkSheetHeaderTitleStyle}>
                Announcement preview
              </h2>

              <p style={apkSheetHeaderSubtitleStyle}>
                {item.timeText}
              </p>
            </div>

            <button
              type="button"
              className="ndjc-sheet-close-button"
              style={apkSheetCloseButtonStyle}
              onClick={onClose}
              aria-label="Close sheet"
            >
              ×
            </button>
          </div>

          <div className="ndjc-sheet-header-divider" style={apkSheetDividerStyle} aria-hidden="true" />
        </header>

        <AnnouncementFeedCard
          card={item}
          forceExpand
          onOpenAnnouncement={() => {}}
          onExpandAnnouncement={() => {}}
          onOpenImagePreview={url => onOpenImage?.(url)}
        />
      </section>
    </section>
  )
}

function ShowcaseAdminAnnouncementEditPreview({
  item,
  onClose,
  onOpenImage
}: {
  item: ShowcaseAnnouncementCard | null
  onClose: () => void
  onOpenImage?: (url: string) => void
}) {
  if (!item) return null

  return (
    <section
      className="ndjc-admin-announcement-preview-dialog-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        padding: '0 16px',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0, 0, 0, 0.34)'
      }}
      onClick={onClose}
    >
      <section
        className="ndjc-admin-announcement-preview-dialog-card"
        style={{
          width: '100%',
          maxWidth: 420,
          minWidth: 0
        }}
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <AnnouncementFeedCard
          card={item}
          forceExpand
          onOpenAnnouncement={() => {}}
          onExpandAnnouncement={() => {}}
          onOpenImagePreview={url => onOpenImage?.(url)}
        />
      </section>
    </section>
  )
}

export function ShowcaseAnnouncementsScreen({
  state,
  actions
}: {
  state: ShowcaseAnnouncementsUiState
  actions: ShowcaseAnnouncementsActions
}) {
  const [previewImage, setPreviewImage] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const itemRefs = React.useRef<Record<string, HTMLElement | null>>({})
  const handleSavePreviewImage = React.useCallback(() => {}, [])

  React.useLayoutEffect(() => {
    const targetId = state.focusedAnnouncementId
    if (!targetId) return

    const exists = state.items.some(item => item.id === targetId)
    if (!exists) return

    itemRefs.current[targetId]?.scrollIntoView({
      block: 'start',
      behavior: 'auto'
    })

    actions.onOpenAnnouncement(targetId)
    actions.onConsumeFocusedAnnouncement()
  }, [
    state.focusedAnnouncementId,
    state.items,
    actions.onOpenAnnouncement,
    actions.onConsumeFocusedAnnouncement
  ])

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Announcements"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <NdjcConversationPageScaffold
        wrapWithUnifiedBackground={false}
        showTopBar
        title={state.title || 'Announcements'}
        subtitle={undefined}
        actions={actions}
        className="ndjc-apk-announcements-screen"
        contentPaddingTop={12}
        contentPaddingBottom={16}
        contentTrailingSpacerHeight={40}
        verticalItemSpacing={10}
        fillContentWhenEmpty={state.items.length === 0 && !state.isLoading}
        onContentScroll={(event: React.UIEvent<HTMLElement>) => ndjcHandleLoadMoreScroll(
          event,
          state.pagination,
          actions.onLoadMore
        )}
      >
        {state.items.length === 0 && !state.isLoading ? (
          <NdjcInlineEmptyState
            title="No updates yet"
            message="New announcements will appear here when the business posts them."
            verticalPadding={0}
            fillParentMaxSize
          />
        ) : (
          <>
            {state.items.map(item => (
              <section
                key={item.id}
                ref={node => {
                  itemRefs.current[item.id] = node
                }}
                className="ndjc-apk-announcement-feed-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: 8,
                  boxSizing: 'border-box'
                }}
              >
                <NdjcConversationTimePill text={item.timeText} />

                <AnnouncementFeedCard
                  card={item}
                  forceExpand={state.focusedAnnouncementId === item.id}
                  onOpenAnnouncement={() => actions.onOpenAnnouncement(item.id)}
                  onExpandAnnouncement={() => actions.onTrackAnnouncementView(item.id)}
                  onOpenImagePreview={url => {
                    actions.onOpenAnnouncementImage(item.id)
                    setPreviewImage({
                      images: [url],
                      startIndex: 0
                    })
                  }}
                />
              </section>
            ))}

            <NdjcPaginationFooter
              pagination={state.pagination}
              idleText="Load more"
              loadingText="Loading more..."
              endText="No more updates"
              onLoadMore={actions.onLoadMore}
            />
          </>
        )}

        {previewImage ? (
          <NdjcFullscreenImageViewerScreen
            images={previewImage.images}
            startIndex={previewImage.startIndex}
            onDismiss={() => setPreviewImage(null)}
            onSave={handleSavePreviewImage}
          />
        ) : null}
      </NdjcConversationPageScaffold>
    </NdjcUnifiedBackground>
  )
}
export function ShowcaseAdminAnnouncementEdit({
  state,
  actions
}: {
  state: ShowcaseAnnouncementEditUiState
  actions: ShowcaseAnnouncementEditActions
}) {
  const [coverPreview, setCoverPreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const [showDeleteDraftConfirm, setShowDeleteDraftConfirm] = React.useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = React.useState(false)
  const [announcementComposerCollapsedByUser, setAnnouncementComposerCollapsedByUser] = React.useState(false)
  const [isAnnouncementEditorCompact, setIsAnnouncementEditorCompact] = React.useState(false)
  const announcementCoverInputRef = React.useRef<HTMLInputElement | null>(null)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    if (!state.composerExpanded) {
      setAnnouncementComposerCollapsedByUser(false)
    }
  }, [state.composerExpanded])
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 480px)')

    const updateCompactState = () => {
      setIsAnnouncementEditorCompact(mediaQuery.matches)
    }

    updateCompactState()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateCompactState)

      return () => {
        mediaQuery.removeEventListener('change', updateCompactState)
      }
    }

    mediaQuery.addListener(updateCompactState)

    return () => {
      mediaQuery.removeListener(updateCompactState)
    }
  }, [])
  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.setTimeout(updateHeight, 0)
      return
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [
    state.bodyDraft,
    state.coverDraftUrl,
    state.composerExpanded,
    state.canStartNew,
    state.canDeleteSelected,
    state.canSaveDraft,
    state.canPublish,
    state.isSubmitting,
    state.isBlockingInput,
    state.selectedIds.length
  ])

  function openAnnouncementCoverPicker(): void {
    if (state.isBlockingInput) return

    announcementCoverInputRef.current?.click()
  }

  function handleAnnouncementCoverFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!file) return

    actions.onPickCover(file)
  }

  const maxChars = 100
  const body = state.bodyDraft
  const cover = state.coverDraftUrl
  const selectedDraftCount = state.selectedIds.length
  const hasEditorCover = Boolean(cover?.trim())
  const showAnnouncementComposer = state.composerExpanded && !announcementComposerCollapsedByUser
  const canStartNewAnnouncement = (state.canStartNew || announcementComposerCollapsedByUser) && !state.isSubmitting
  const canPublishFromEditor = showAnnouncementComposer && hasEditorCover && selectedDraftCount === 0
  const canPublishSelectedDraft = !hasEditorCover && selectedDraftCount === 1
  const canPublishAnnouncement = (canPublishFromEditor || canPublishSelectedDraft) && !state.isSubmitting
  const publishText = canPublishSelectedDraft ? 'Publish 1' : 'Publish'
  const announcementEditHeaderBottomPadding = APK_EDIT_ITEM_UI.sectionCardGap
  const announcementEditListPaddingX = '25px'
  const announcementContentFieldHeight = isAnnouncementEditorCompact ? 100 : 120
  const listTopPadding = headerHeight + APK_SHOWCASE_ITEM_UI.adminItemsListGap
  const deleteText = `Delete ${state.selectedIds.length}`

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-admin-announcement-edit-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <input
          ref={announcementCoverInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAnnouncementCoverFileChange}
        />

        <section
          className="ndjc-admin-announcement-grid-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            minHeight: 0,
            background: APK_SHELL_UI.pageBg,
            padding: `${listTopPadding}px ${announcementEditListPaddingX} calc(${APK_PAGE_SHELL_UI.screenPadding}px + env(safe-area-inset-bottom))`,
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: state.draftItems.length || state.isSubmitting ? undefined : 'minmax(0, 1fr)',
            gridAutoRows: state.draftItems.length || state.isSubmitting ? 'max-content' : undefined,
            alignContent: state.draftItems.length || state.isSubmitting ? 'start' : 'stretch',
            gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
          }}
          onScroll={event => ndjcHandleLoadMoreScroll(
            event,
            state.pagination,
            actions.onLoadMore
          )}
        >
          {state.draftItems.length || state.isSubmitting ? (
            <>
              {state.draftItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    width: '100%',
                    minWidth: 0,
                    gridColumn: '1 / -1'
                  }}
                >
                  <AnnouncementDraftCard
                    item={item}
                    selected={state.selectedIds.includes(item.id)}
                    onOpen={id => {
                      setAnnouncementComposerCollapsedByUser(false)
                      actions.onOpenItem(id)
                    }}
                    onPreview={actions.onPreviewItem}
                    onToggleSelect={actions.onToggleSelect}
                  />
                </div>
              ))}

              <div
                style={{
                  gridColumn: '1 / -1'
                }}
              >
                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more drafts"
                  onLoadMore={actions.onLoadMore}
                />
              </div>
            </>
          ) : (
            <section
              style={{
                gridColumn: '1 / -1',
                width: '100%',
                height: '100%',
                minHeight: 0,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <NdjcInlineEmptyState
                title="No drafts yet"
                message="Tap New to create an announcement draft."
                verticalPadding={0}
              />
            </section>
          )}
        </section>

        <section
          ref={headerRef}
          className="ndjc-admin-announcement-header-wrap"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            boxSizing: 'border-box',
            background: APK_SHELL_UI.pageBg,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${announcementEditHeaderBottomPadding}px`
          }}
        >
          <section
            className="ndjc-admin-announcement-header-column"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: APK_EDIT_ITEM_UI.fieldGap
            }}
          >
            <section
              className="ndjc-admin-announcement-title-action-row"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_EDIT_ITEM_UI.sectionCardGap
              }}
            >
              <section
                className="ndjc-admin-announcement-title-block"
                style={{
                  minWidth: 0,
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.titleToHint
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
                    textRendering: 'geometricPrecision'
                  }}
                >
                  <span style={{ display: 'block' }}>Publish</span>
                  <span style={{ display: 'block' }}>announcement</span>
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
                  Only one announcement can be published at a time.
                </p>

                <p
                  style={{
                    margin: 0,
                    color: APK_EDIT_ITEM_UI.body55,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  {state.draftItems.length} drafts
                </p>
              </section>

              <section
                className="ndjc-admin-announcement-new-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: APK_EDIT_ITEM_UI.fieldGap,
                  alignItems: 'center'
                }}
              >
                <NdjcControlPillButton
                  disabled={!canStartNewAnnouncement}
                  active={canStartNewAnnouncement}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (!canStartNewAnnouncement) return
                    setAnnouncementComposerCollapsedByUser(false)
                    actions.onStartNew()
                  }}
                >
                  New
                </NdjcControlPillButton>

                <NdjcControlPillButton
                  disabled={!canPublishAnnouncement}
                  active={canPublishAnnouncement}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (!canPublishAnnouncement) return
                    setShowPublishConfirm(true)
                  }}
                >
                  {state.submittingAction === 'publish' ? 'Publishing...' : publishText}
                </NdjcControlPillButton>
              </section>
            </section>

            {showAnnouncementComposer ? (
              <section
                className="ndjc-admin-announcement-composer-inline"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: APK_EDIT_ITEM_UI.sectionCardGap
                }}
              >
                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
                    gap: APK_EDIT_ITEM_UI.fieldGap,
                    alignItems: 'start'
                  }}
                >
                  <section
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 7
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
                        fontSize: APK_EDIT_ITEM_UI.labelFontSize,
                        lineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
                        fontWeight: APK_EDIT_ITEM_UI.labelFontWeight
                      }}
                    >
                      Cover image *
                    </p>

                    <NdjcSingleEditableImage
                      src={cover}
                      label="Cover"
                      enabled={!state.isBlockingInput}
                      onPick={openAnnouncementCoverPicker}
                      onRemove={actions.onRemoveCover}
                      onPreview={cover?.trim() ? () => {
                        const cleanCoverUrl = cover.trim()
                        if (!cleanCoverUrl) return

                        setCoverPreview({
                          images: [cleanCoverUrl],
                          startIndex: 0
                        })
                      } : undefined}
                    />

                    {state.coverUploadErrorMessage ? (
                      <p
                        style={{
                          margin: 0,
                          color: APK_EDIT_ITEM_UI.error80,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {state.coverUploadErrorMessage}
                      </p>
                    ) : null}
                  </section>

                  <section
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: APK_EDIT_ITEM_UI.fieldGap
                    }}
                  >
                    <NdjcTextField
                      value={body}
                      onChange={value => actions.onBodyChange(value.slice(0, maxChars))}
                      label="Content"
                      placeholder="Write details"
                      singleLine={false}
                      minLines={3}
                      fieldMinHeightOverride={announcementContentFieldHeight}
                      fieldHeightOverride={announcementContentFieldHeight}
                    />

                    <section
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0 }} />

                      <span
                        style={{
                          color: APK_EDIT_ITEM_UI.body55,
                          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {Math.min(body.length, maxChars)}/{maxChars}
                      </span>
                    </section>
                  </section>
                </section>

                <section
                  className="ndjc-admin-announcement-editor-action-row"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: APK_EDIT_ITEM_UI.fieldGap
                  }}
                >
                  <NdjcControlPillButton
                    disabled={!state.canSaveDraft || state.isSubmitting}
                    active={state.canSaveDraft && !state.isSubmitting}
                    tone="adminAction"
                    fullWidth
                    onClick={() => {
                      if (state.isSubmitting) return
                      actions.onSaveDraft()
                    }}
                  >
                    {state.submittingAction === 'save' ? 'Saving...' : 'Save draft'}
                  </NdjcControlPillButton>

                  <NdjcControlPillButton
                    disabled={state.isSubmitting}
                    active={!state.isSubmitting}
                    tone="adminAction"
                    fullWidth
                    onClick={() => {
                      if (state.isSubmitting) return
                      setAnnouncementComposerCollapsedByUser(true)
                    }}
                  >
                    Collapse
                  </NdjcControlPillButton>
                </section>
              </section>
            ) : null}

            <section
              className="ndjc-admin-announcement-selection-tools"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: APK_EDIT_ITEM_UI.fieldGap,
                alignItems: 'center'
              }}
            >
              <NdjcControlPillButton
                disabled={!state.selectedIds.length}
                active={Boolean(state.selectedIds.length)}
                tone="adminAction"
                fullWidth
                onClick={actions.onClearSelection}
              >
                Clear
              </NdjcControlPillButton>

              <NdjcControlPillButton
                disabled={!state.canDeleteSelected || state.isSubmitting}
                active={state.canDeleteSelected && !state.isSubmitting}
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (state.isSubmitting) return
                  setShowDeleteDraftConfirm(true)
                }}
              >
                {state.submittingAction === 'delete' ? 'Deleting...' : deleteText}
              </NdjcControlPillButton>
            </section>
          </section>
        </section>

        <NdjcSnackbarHost message={state.statusMessage || state.successMessage} />

        <ShowcaseAdminAnnouncementEditPreview
          item={state.previewVisible ? state.previewItem : null}
          onClose={actions.onDismissPreview}
          onOpenImage={url => {
            const cleanUrl = url.trim()
            if (!cleanUrl) return

            setCoverPreview({
              images: [cleanUrl],
              startIndex: 0
            })
          }}
        />

        {coverPreview ? (
          <NdjcFullscreenImageViewerScreen
            images={coverPreview.images}
            startIndex={coverPreview.startIndex}
            onDismiss={() => setCoverPreview(null)}
          />
        ) : null}

      {state.pendingExitTarget ? (
        <NdjcBaseDialog
          title="Discard unsaved changes?"
          message="You have unsaved item changes. Leave this page and discard them?"
          confirmText="Discard"
          dismissText="Stay"
          destructiveConfirm
          onConfirmClick={actions.onConfirmExit}
          onDismissClick={actions.onDismissExitConfirm}
          onDismissRequest={actions.onDismissExitConfirm}
        />
      ) : null}

        {showDeleteDraftConfirm ? (
          <NdjcBaseDialog
            title="Delete selected drafts?"
            message={`This will permanently delete ${state.selectedIds.length} selected draft item(s).`}
            confirmText="Delete"
            dismissText="Cancel"
            destructiveConfirm
            confirmEnabled={!state.isSubmitting}
            confirmLoading={state.submittingAction === 'delete'}
            onConfirmClick={() => {
              if (state.isSubmitting) return

              void Promise.resolve(actions.onDeleteSelected())
                .then(() => {
                  setShowDeleteDraftConfirm(false)
                })
            }}
            onDismissClick={() => {
              if (state.isSubmitting) return
              setShowDeleteDraftConfirm(false)
            }}
            onDismissRequest={() => {
              if (state.isSubmitting) return
              setShowDeleteDraftConfirm(false)
            }}
          />
        ) : null}

        {showPublishConfirm ? (
          <NdjcBaseDialog
            title="Publish announcement?"
            message="This will publish the current announcement immediately."
            confirmText="Publish"
            dismissText="Cancel"
            confirmEnabled={!state.isSubmitting}
            confirmLoading={state.submittingAction === 'publish'}
            onConfirmClick={() => {
              if (state.isSubmitting) return

              void Promise.resolve(actions.onPushNow())
                .then(() => {
                  setShowPublishConfirm(false)
                })
            }}
            onDismissClick={() => {
              if (state.isSubmitting) return
              setShowPublishConfirm(false)
            }}
            onDismissRequest={() => {
              if (state.isSubmitting) return
              setShowPublishConfirm(false)
            }}
          />
        ) : null}

      </section>
    </NdjcUnifiedBackground>
  )
}