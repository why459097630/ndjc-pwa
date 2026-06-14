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
  StoreInfoLine,
  copyTextToClipboard
} from './showcaseCommonComponents'
import {
  AppointmentCatalogItemCard,
  CustomerBookingDetailsBottomSheet
} from './showcaseBookingScreens'

export function NdjcConversationPageScaffold({
  title,
  subtitle,
  actions,
  toolbar,
  children,
  footer,
  className,
  showTopBar = true,
  isSelectionMode = false,
  selectedCount = 0,
  topBarActions,
  contentPaddingTop = 12,
  contentPaddingBottom = 20,
  contentPaddingX = APK_CHAT_UI.bodyPaddingX,
  verticalItemSpacing = 8,
  wrapWithUnifiedBackground = true,
  fillContentWhenEmpty = false,
  contentScrollKey,
  contentAutoScrollToBottom = true,
  contentForceScrollToBottomSignal = 0,
  contentPreserveScrollAnchorKey = null,
  contentTrailingSpacerHeight = 0,
  onContentScroll
}: {
  title: string
  subtitle?: string | null
  actions: Pick<ShowcaseChatActions, 'onBack' | 'onBackToHome'>
  toolbar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showTopBar?: boolean
  isSelectionMode?: boolean
  selectedCount?: number
  topBarActions?: React.ReactNode
  contentPaddingTop?: number
  contentPaddingBottom?: number
  contentPaddingX?: number
  verticalItemSpacing?: number
  wrapWithUnifiedBackground?: boolean
  fillContentWhenEmpty?: boolean
  contentScrollKey?: string | number | null
  contentAutoScrollToBottom?: boolean
  contentForceScrollToBottomSignal?: string | number | null
  contentPreserveScrollAnchorKey?: string | number | null
  contentTrailingSpacerHeight?: number
  onContentScroll?: (event: React.UIEvent<HTMLElement>) => void
}) {
  const bodyRef = React.useRef<HTMLElement | null>(null)
  const preserveScrollAnchorRef = React.useRef<{
    key: string | number | null
    scrollHeight: number
    scrollTop: number
  } | null>(null)
  const isChatThreadScreen = typeof className === 'string' && className.includes('ndjc-chat-thread-screen')

  function animateScrollBodyToBottom(
    body: HTMLElement,
    durationMs = 260
  ): () => void {
    let cancelled = false
    let frameId: number | null = null

    const startTop = body.scrollTop
    const targetTop = Math.max(0, body.scrollHeight - body.clientHeight)
    const distance = targetTop - startTop

    if (Math.abs(distance) <= 1) {
      body.scrollTop = targetTop
      return () => {
        cancelled = true
      }
    }

    const startTime = window.performance.now()

    const easeOutCubic = (value: number) => {
      return 1 - Math.pow(1 - value, 3)
    }

    const step = (now: number) => {
      if (cancelled) return

      const progress = Math.min(1, Math.max(0, (now - startTime) / durationMs))
      const eased = easeOutCubic(progress)
      body.scrollTop = startTop + distance * eased

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
        return
      }

      body.scrollTop = Math.max(0, body.scrollHeight - body.clientHeight)
    }

    frameId = window.requestAnimationFrame(step)

    return () => {
      cancelled = true

      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }

React.useLayoutEffect(() => {
  const body = bodyRef.current
  if (!body || contentPreserveScrollAnchorKey == null) return

  const previous = preserveScrollAnchorRef.current
  const nextScrollHeight = body.scrollHeight

  if (
    previous &&
    previous.key !== contentPreserveScrollAnchorKey &&
    previous.scrollTop <= 120
  ) {
    const heightDelta = nextScrollHeight - previous.scrollHeight

    if (heightDelta > 0) {
      body.scrollTop = previous.scrollTop + heightDelta
    }
  }

  preserveScrollAnchorRef.current = {
    key: contentPreserveScrollAnchorKey,
    scrollHeight: body.scrollHeight,
    scrollTop: body.scrollTop
  }
}, [contentPreserveScrollAnchorKey, children])

React.useLayoutEffect(() => {
  if (contentScrollKey == null || !contentAutoScrollToBottom) return

  const body = bodyRef.current
  if (!body) return

  let cancelled = false
  let activeCancelScroll: (() => void) | null = null
  let firstTimeoutId: number | null = null
  let secondTimeoutId: number | null = null

  const scrollToBottom = (durationMs = 220) => {
    if (cancelled) return

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    activeCancelScroll = animateScrollBodyToBottom(body, durationMs)
  }

  const scheduleScrollToBottom = () => {
    scrollToBottom(220)

    if (firstTimeoutId == null) {
      firstTimeoutId = window.setTimeout(() => {
        firstTimeoutId = null
        scrollToBottom(180)
      }, 80)
    }

    if (secondTimeoutId == null) {
      secondTimeoutId = window.setTimeout(() => {
        secondTimeoutId = null
        scrollToBottom(160)
      }, 180)
    }
  }

  scheduleScrollToBottom()

  window.addEventListener('ndjc:keyboard-viewport-change', scheduleScrollToBottom)

  return () => {
    cancelled = true

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    if (firstTimeoutId != null) {
      window.clearTimeout(firstTimeoutId)
    }

    if (secondTimeoutId != null) {
      window.clearTimeout(secondTimeoutId)
    }

    window.removeEventListener('ndjc:keyboard-viewport-change', scheduleScrollToBottom)
  }
}, [contentScrollKey, contentAutoScrollToBottom])

React.useLayoutEffect(() => {
  if (!contentForceScrollToBottomSignal) return

  const body = bodyRef.current
  if (!body) return

  let cancelled = false
  let activeCancelScroll: (() => void) | null = null
  let firstTimeoutId: number | null = null
  let secondTimeoutId: number | null = null
  let thirdTimeoutId: number | null = null

  const scrollToBottom = (durationMs = 300) => {
    if (cancelled) return

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    activeCancelScroll = animateScrollBodyToBottom(body, durationMs)
  }

  scrollToBottom(300)

  firstTimeoutId = window.setTimeout(() => {
    firstTimeoutId = null
    scrollToBottom(240)
  }, 90)

  secondTimeoutId = window.setTimeout(() => {
    secondTimeoutId = null
    scrollToBottom(200)
  }, 210)

  thirdTimeoutId = window.setTimeout(() => {
    thirdTimeoutId = null
    body.scrollTop = Math.max(0, body.scrollHeight - body.clientHeight)
  }, 380)

  return () => {
    cancelled = true

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    if (firstTimeoutId != null) {
      window.clearTimeout(firstTimeoutId)
    }

    if (secondTimeoutId != null) {
      window.clearTimeout(secondTimeoutId)
    }

    if (thirdTimeoutId != null) {
      window.clearTimeout(thirdTimeoutId)
    }
  }
}, [contentForceScrollToBottomSignal])

const content = (
  <section
    className={cx('ndjc-conversation-page-scaffold', className)}
    style={{
      width: '100%',
      height: isChatThreadScreen ? 'var(--ndjc-stable-viewport-height, 100dvh)' : '100%',
      minHeight: 0,
      maxHeight: isChatThreadScreen ? 'var(--ndjc-stable-viewport-height, 100dvh)' : undefined,
      display: 'grid',
      gridTemplateRows: `${showTopBar ? 'auto ' : ''}minmax(0, 1fr) auto`,
      background: APK_CHAT_UI.pageBg,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}
  >
      {showTopBar ? (
        <section
          className="ndjc-conversation-top-surface"
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: 'env(safe-area-inset-top)',
            background: APK_CHAT_UI.pageBg,
            boxShadow: 'none',
            boxSizing: 'border-box'
          }}
        >
          <nav
            className="ndjc-conversation-top-bar"
            style={{
              width: '100%',
              height: APK_CHAT_UI.headerHeight,
              padding: `${APK_CHAT_UI.headerTopPadding}px ${APK_CHAT_UI.headerPaddingX}px ${APK_CHAT_UI.headerBottomPadding}px`,
              display: 'grid',
              gridTemplateColumns: `${APK_SHELL_UI.backButtonSize}px minmax(0, 1fr) ${APK_SHELL_UI.backButtonSize}px`,
              alignItems: 'center',
              gap: APK_CHAT_UI.headerGap,
              boxSizing: 'border-box'
            }}
            aria-label="Conversation header"
          >
            <span
              style={{
                width: APK_SHELL_UI.backButtonSize,
                height: APK_SHELL_UI.backButtonSize,
                display: 'block'
              }}
              aria-hidden="true"
            />

            <div
              className="ndjc-conversation-title-block"
              style={{
                minWidth: 0,
                display: 'grid',
                gap: 1,
                textAlign: 'center'
              }}
            >
              {isSelectionMode ? (
                <h1
                  style={{
                    ...apkConversationTitleStyle,
                    color: APK_CHAT_UI.black85
                  }}
                >
                  Selected {selectedCount}
                </h1>
              ) : (
                <>
                  <h1
                    style={{
                      ...apkConversationTitleStyle,
                      color: APK_CHAT_UI.black85
                    }}
                  >
                    {title || 'Chat'}
                  </h1>

                  {subtitle?.trim() ? (
                    <p
                      style={{
                        ...apkConversationSubtitleStyle,
                        color: APK_CHAT_UI.black55
                      }}
                    >
                      {subtitle}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div
              style={{
                width: APK_SHELL_UI.backButtonSize,
                minWidth: APK_SHELL_UI.backButtonSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6
              }}
            >
              {topBarActions}
            </div>
          </nav>

          <div
            style={{
              width: '100%',
              height: 1,
              background: 'rgba(0, 0, 0, 0.10)'
            }}
            aria-hidden="true"
          />
        </section>
      ) : null}

      <section
        ref={bodyRef}
        className="ndjc-conversation-body"
        onScroll={onContentScroll}
        style={{
          minHeight: 0,
          padding: `0 ${contentPaddingX}px`,
          display: 'grid',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0))',
          WebkitOverflowScrolling: 'touch',
          boxSizing: 'border-box',
          scrollBehavior: 'auto'
        }}
      >
        <section
          className="ndjc-conversation-lazy-content"
          style={{
            minHeight: '100%',
            height: fillContentWhenEmpty ? '100%' : undefined,
            padding: `${contentPaddingTop}px 0 ${contentPaddingBottom}px`,
            display: 'grid',
            alignContent: fillContentWhenEmpty ? 'stretch' : 'start',
            gridTemplateRows: fillContentWhenEmpty ? 'minmax(0, 1fr)' : undefined,
            gap: verticalItemSpacing,
            boxSizing: 'border-box'
          }}
        >
          {toolbar ? (
            <section
              className="ndjc-conversation-toolbar"
              style={{
                width: '100%',
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {toolbar}
            </section>
          ) : null}

          {children}

          {contentTrailingSpacerHeight > 0 ? (
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: '100%',
                height: contentTrailingSpacerHeight,
                minHeight: contentTrailingSpacerHeight
              }}
            />
          ) : null}
        </section>
      </section>

      {footer ? (
        <section className="ndjc-conversation-footer">
          {footer}
        </section>
      ) : null}
    </section>
  )

  if (!wrapWithUnifiedBackground) {
    return content
  }

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome,
        iconOnly: true,
        iconTint: APK_SHELL_UI.brand
      }}
    >
      {content}
    </NdjcUnifiedBackground>
  )
}
export function NdjcConversationTimePill({
  text
}: {
  text: string
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <div
      className="ndjc-conversation-time-pill-wrap"
      style={{
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: `${APK_CHAT_UI.timePillWrapPaddingY}px 0`
      }}
    >
      <span
        className="ndjc-conversation-time-pill"
        style={{
          borderRadius: APK_CHAT_UI.timePillRadius,
          padding: `${APK_CHAT_UI.timePillPaddingY}px ${APK_CHAT_UI.timePillPaddingX}px`,
          color: APK_CHAT_UI.black55,
          background: 'rgba(255, 255, 255, 0.72)',
          fontSize: 11,
          lineHeight: 1,
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}
      >
        {cleanText}
      </span>
    </div>
  )
}

function NdjcProductCardBubble({
  product,
  available,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
}) {
  const cleanImageUrl = product.imageUrl?.trim() || null
  const cleanTitle = product.title?.trim() || 'Selected item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null

  return (
    <section
      className="ndjc-product-card-bubble"
      style={apkProductBubbleStyle}
    >
      <section style={apkChatProductCardShellStyle}>
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpen(product.dishId)}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>
    </section>
  )
}

function ChatProductBubble({
  product,
  available,
  outgoing,
  selected,
  focused,
  matched,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onOpen: (dishId: string) => void
}) {
  return (
    <section
      className={cx(
        'ndjc-chat-product-bubble-frame',
        outgoing && 'is-outgoing',
        selected && 'is-selected',
        focused && 'is-focused',
        matched && 'is-matched'
      )}
      style={apkChatRichBubbleFrameStyle({
        outgoing,
        selected,
        focused,
        matched
      })}
    >
      <NdjcProductCardBubble
        product={product}
        available={available}
        onOpen={onOpen}
      />
    </section>
  )
}
function chatAppointmentShareToCard(appointment: ShowcaseChatAppointmentShare): ShowcaseAppointmentCard {
  return {
    id: appointment.appointmentId,
    customerName: appointment.customerName || 'Customer',
    customerContact: appointment.customerContact || '',
    serviceTitle: appointment.title || 'General appointment',
    preferredDate: appointment.preferredDate,
    preferredTime: appointment.preferredTime,
    note: appointment.note || '',
    statusLabel: appointment.statusLabel || 'Pending',
    cancelledBy: appointment.cancelledBy,
    cancelledAt: appointment.cancelledAt,
    canCancelByCustomer: false,
    createdAtText: appointment.createdAtText || '',
    imageUrl: appointment.imageUrl,
    sourceDishId: appointment.sourceDishId,
    priceText: appointment.priceText,
    originalPriceText: appointment.originalPriceText,
    discountPriceText: appointment.discountPriceText,
    categoryText: appointment.categoryText,
    isRecommended: false,
    itemAvailable: appointment.itemAvailable
  }
}

function appointmentShareStatusDisplayLabel(appointment: ShowcaseChatAppointmentShare): string {
  const status = appointment.statusLabel?.trim() || 'Pending'

  if (status === 'Cancelled' && appointment.cancelledBy === 'customer') {
    return 'Cancelled by customer'
  }

  return status
}

function appointmentShareCompactStatusBadgeLabel(appointment: ShowcaseChatAppointmentShare): string {
  const status = appointment.statusLabel?.trim() || 'Pending'
  const normalizedStatus = status.toLowerCase()
  const cancelledBy = String(appointment.cancelledBy || '').trim().toLowerCase()

  if (
    normalizedStatus === 'cancelled by customer' ||
    normalizedStatus === 'booking cancelled by customer' ||
    (normalizedStatus === 'cancelled' && cancelledBy === 'customer')
  ) {
    return 'Cancelled by customer'
  }

  if (normalizedStatus === 'cancelled') {
    return 'Cancelled'
  }

  if (
    normalizedStatus === 'confirmed' ||
    normalizedStatus === 'confirmed by merchant'
  ) {
    return 'Confirmed'
  }

  if (
    normalizedStatus === 'pending' ||
    normalizedStatus === 'pending confirmation'
  ) {
    return 'Pending'
  }

  return status
}

export function appointmentShareSummaryText(appointment: ShowcaseChatAppointmentShare): string {
  const status = appointmentShareStatusDisplayLabel(appointment)
  const title = appointment.title?.trim() || 'General appointment'
  const timeText = appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)
  const parts = [
    status === 'Pending' ? '' : status,
    title,
    timeText
  ].map(value => value.trim()).filter(Boolean)

  return parts.join(' · ')
}

function NdjcAppointmentCardBubble({
  appointment,
  onOpen
}: {
  appointment: ShowcaseChatAppointmentShare
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  const cleanImageUrl = appointment.imageUrl?.trim() || null
  const cleanTitle = appointment.title?.trim() || 'General appointment'
  const cleanStatus = appointmentShareCompactStatusBadgeLabel(appointment)

  return (
    <section
      className="ndjc-appointment-card-bubble"
      style={apkProductBubbleStyle}
    >
      <section style={apkChatProductCardShellStyle}>
        <AppointmentCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          priceTextValue={appointment.priceText}
          originalPriceTextValue={appointment.originalPriceText}
          discountPriceTextValue={appointment.discountPriceText}
          categoryText={null}
          itemAvailable={true}
          allowClickWhenUnavailable
          onOpen={() => onOpen(appointment)}
          bottom={
            <>
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black75,
                  fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)}
              </span>

              <div style={{ height: 4 }} aria-hidden="true" />

              <NdjcPillBadge selected allowOverflow>
                {cleanStatus}
              </NdjcPillBadge>
            </>
          }
        />
      </section>
    </section>
  )
}

function ChatAppointmentBubble({
  appointment,
  outgoing,
  selected,
  focused,
  matched,
  onOpen
}: {
  appointment: ShowcaseChatAppointmentShare
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  return (
    <section
      className={cx(
        'ndjc-chat-appointment-bubble-frame',
        outgoing && 'is-outgoing',
        selected && 'is-selected',
        focused && 'is-focused',
        matched && 'is-matched'
      )}
      style={apkChatRichBubbleFrameStyle({
        outgoing,
        selected,
        focused,
        matched
      })}
    >
      <NdjcAppointmentCardBubble
        appointment={appointment}
        onOpen={onOpen}
      />
    </section>
  )
}

function NdjcPendingAppointmentBar({
  appointment,
  onOpen,
  onSend,
  onClear
}: {
  appointment: ShowcaseChatAppointmentShare
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
  onSend: () => void
  onClear: () => void
}) {
  const cleanImageUrl = appointment.imageUrl?.trim() || null
  const cleanTitle = appointment.title?.trim() || 'General appointment'
  const cleanStatus = appointmentShareCompactStatusBadgeLabel(appointment)

  return (
    <section className="ndjc-pending-appointment-bar" style={apkPendingProductBarStyle}>
      <span style={apkPendingProductSideBarStyle} aria-hidden="true" />

      <section
        style={apkPendingProductPreviewCardStyle}
      >
        <AppointmentCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          priceTextValue={null}
          categoryText={null}
          itemAvailable={appointment.itemAvailable && Boolean(appointment.sourceDishId)}
          allowClickWhenUnavailable
          onOpen={() => onOpen(appointment)}
          bottom={
            <>
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black75,
                  fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)}
              </span>

              <div style={{ height: 4 }} aria-hidden="true" />

              <NdjcPillBadge selected>
                {cleanStatus}
              </NdjcPillBadge>
            </>
          }
        />
      </section>

      <section
        className="ndjc-pending-appointment-actions"
        style={apkPendingProductActionColumnStyle}
      >
        <button
          type="button"
          style={apkPendingProductIconButtonStyle('close')}
          onClick={onClear}
          aria-label="Cancel"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            style={{
              width: 24,
              height: 24,
              display: 'block'
            }}
          >
            <path
              d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.3-6.29Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          type="button"
          style={apkPendingProductIconButtonStyle('send')}
          onClick={onSend}
          aria-label="Send"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            style={{
              width: 24,
              height: 24,
              display: 'block'
            }}
          >
            <path
              d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>
    </section>
  )
}
function NdjcChatSingleImageBubble({
  url,
  blurDataUrl,
  outgoing,
  shouldSuppressClick,
  onOpen
}: {
  url: string
  blurDataUrl?: string | null
  outgoing?: boolean
  shouldSuppressClick?: () => boolean
  onOpen: (url: string) => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-chat-single-image-bubble', outgoing && 'is-outgoing')}
      style={{
        ...apkChatImageButtonBaseStyle,
        width: APK_CHAT_UI.singleImageWidth,
        height: APK_CHAT_UI.singleImageHeight
      }}
      onClick={event => {
        if (shouldSuppressClick?.()) {
          event.preventDefault()
          event.stopPropagation()
          return
        }

        onOpen(url)
      }}
    >
      <NdjcShimmerImage
        src={url}
        alt="Chat image"
        placeholderCornerRadius={APK_CHAT_UI.imageRadius}
        contentScale="cover"
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        imageWidth={APK_CHAT_UI.singleImageWidth}
        imageHeight={APK_CHAT_UI.singleImageHeight}
        sizes="min(72vw, 260px)"
        blurDataUrl={blurDataUrl}
      />
    </button>
  )
}

function NdjcChatImageBubbleUi({
  url,
  onOpen
}: {
  url: string
  onOpen: (url: string) => void
}) {
  return (
    <button
      type="button"
      className="ndjc-chat-image-bubble-ui"
      style={{
        ...apkChatImageButtonBaseStyle,
        width: APK_CHAT_UI.gridImageSize,
        height: APK_CHAT_UI.gridImageSize
      }}
      onClick={() => onOpen(url)}
    >
      <NdjcShimmerImage
        src={url}
        alt="Chat image"
        placeholderCornerRadius={APK_CHAT_UI.imageRadius}
        contentScale="cover"
      />
    </button>
  )
}

function NdjcChatImagesGridUi({
  urls,
  previewUrls,
  blurDataUrls,
  outgoing,
  previewPool,
  shouldSuppressClick,
  onOpen
}: {
  urls: string[]
  previewUrls?: string[]
  blurDataUrls?: Array<string | null | undefined>
  outgoing?: boolean
  previewPool: string[]
  shouldSuppressClick?: () => boolean
  onOpen: (url: string, pool: string[]) => void
}) {
  const cleanUrls = urls.map(url => url.trim()).filter(Boolean)
  const cleanPreviewUrls = (previewUrls || []).map(url => url.trim()).filter(Boolean)
  const cleanPreviewPool = previewPool.map(url => url.trim()).filter(Boolean)
  if (!cleanUrls.length) return null

  return (
    <section
      className={cx('ndjc-chat-images-bubble-list', outgoing && 'is-outgoing')}
      style={{
        width: '100%',
        display: 'grid',
        justifyItems: outgoing ? 'end' : 'start',
        gap: 8
      }}
    >
      {cleanUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="ndjc-chat-image-bubble-row"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: outgoing ? 'flex-end' : 'flex-start',
            paddingTop: index === 0 ? 6 : 8,
            boxSizing: 'border-box'
          }}
        >
          <NdjcChatSingleImageBubble
            url={url}
            blurDataUrl={blurDataUrls?.[index] || null}
            outgoing={outgoing}
            shouldSuppressClick={shouldSuppressClick}
            onOpen={() => {
              const previewUrl = cleanPreviewUrls[index] || url
              const pool = cleanPreviewPool.length ? cleanPreviewPool : cleanPreviewUrls.length ? cleanPreviewUrls : cleanUrls
              onOpen(previewUrl, pool)
            }}
          />
        </div>
      ))}
    </section>
  )
}

function NdjcComposerTextQuoteBar({
  text,
  onClick,
  onCancel
}: {
  text: string
  onClick?: () => void
  onCancel: () => void
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <section
      className="ndjc-composer-text-quote-bar"
      style={{
        width: '100%',
        paddingBottom: 10,
        boxSizing: 'border-box'
      }}
    >
      <section
        style={{
          width: '100%',
          minWidth: 0,
          padding: `8px 6px 8px ${APK_CHAT_UI.quotedBarPaddingX + APK_CHAT_UI.quoteRailWidth + APK_CHAT_UI.quoteRailGap}px`,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 32px',
          alignItems: 'stretch',
          color: APK_CHAT_UI.black,
          backgroundColor: APK_CHAT_UI.white,
          backgroundImage: `linear-gradient(to right, ${APK_CHAT_UI.brand} 0px, ${APK_CHAT_UI.brand} ${APK_CHAT_UI.quoteRailWidth}px, transparent ${APK_CHAT_UI.quoteRailWidth}px, transparent 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${APK_CHAT_UI.quoteRailWidth}px calc(100% - 16px)`,
          backgroundPosition: `${APK_CHAT_UI.quotedBarPaddingX}px 8px`,
          border: '1px solid rgba(0, 0, 0, 0.18)',
          borderRadius: 12,
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          style={{
            minWidth: 0,
            alignSelf: 'center',
            border: 0,
            padding: 0,
            display: 'grid',
            gap: 2,
            textAlign: 'left',
            background: 'transparent',
            cursor: onClick ? 'pointer' : 'default'
          }}
          onClick={onClick}
          disabled={!onClick}
        >
          <span
            style={{
              color: APK_CHAT_UI.black55,
              fontSize: 11,
              lineHeight: 1.2,
              fontWeight: 500
            }}
          >
            Replying to
          </span>

          <strong
            style={{
              color: APK_CHAT_UI.black85,
              fontSize: 13,
              lineHeight: 1.25,
              fontWeight: 600,
              minWidth: 0,
              maxWidth: '100%',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word'
            }}
          >
            {cleanText}
          </strong>
        </button>

        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            alignSelf: 'center',
            border: 0,
            borderRadius: 999,
            color: APK_CHAT_UI.black55,
            background: 'transparent',
            fontSize: 18,
            lineHeight: 1
          }}
          onClick={onCancel}
          aria-label="Cancel reply"
        >
          ×
        </button>
      </section>
    </section>
  )
}

function NdjcComposerProductQuoteBar({
  product,
  available,
  onClick,
  onCancel
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onClick: () => void
  onCancel: () => void
}) {
  const cleanTitle = product.title?.trim() || 'Shared item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null
  const cleanImageUrl = product.imageUrl?.trim() || null

  return (
    <section
      className="ndjc-composer-product-quote-bar"
      style={{
        width: '100%',
        padding: '10px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 36px',
        gap: 8,
        alignItems: 'center',
        color: APK_CHAT_UI.black,
        background: APK_CHAT_UI.softSurface,
        borderRadius: 16,
        boxSizing: 'border-box'
      }}
    >
      <section
        style={{
          minWidth: 0,
          borderRadius: 14,
          overflow: 'hidden'
        }}
      >
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={onClick}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>

      <button
        type="button"
        style={{
          width: 36,
          height: 36,
          border: 0,
          borderRadius: 999,
          color: APK_CHAT_UI.black65,
          background: 'transparent',
          fontSize: 20,
          lineHeight: 1
        }}
        onClick={onCancel}
        aria-label="Cancel Quote"
      >
        ×
      </button>
    </section>
  )
}

function NdjcChatQuoteBlock({
  text,
  onClick
}: {
  text: string
  onClick?: () => void
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <button
      type="button"
      className="ndjc-chat-quote-block"
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        border: 0,
        borderRadius: APK_CHAT_UI.quotedBarRadius,
        padding: 0,
        display: 'block',
        textAlign: 'left',
        color: APK_CHAT_UI.black,
        background: APK_CHAT_UI.white,
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box'
      }}
      onClick={onClick}
      disabled={!onClick}
    >
      <span
        style={{
          width: '100%',
          minWidth: 0,
          border: '1px solid rgba(0, 0, 0, 0.18)',
          borderRadius: APK_CHAT_UI.quotedBarRadius,
          padding: `${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX}px ${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX + APK_CHAT_UI.quoteRailWidth + APK_CHAT_UI.quoteRailGap}px`,
          display: 'flex',
          alignItems: 'stretch',
          color: APK_CHAT_UI.black,
          backgroundColor: APK_CHAT_UI.white,
          backgroundImage: `linear-gradient(to right, ${APK_CHAT_UI.brand} 0px, ${APK_CHAT_UI.brand} ${APK_CHAT_UI.quoteRailWidth}px, transparent ${APK_CHAT_UI.quoteRailWidth}px, transparent 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${APK_CHAT_UI.quoteRailWidth}px calc(100% - ${APK_CHAT_UI.quotedBarPaddingY * 2}px)`,
          backgroundPosition: `${APK_CHAT_UI.quotedBarPaddingX}px ${APK_CHAT_UI.quotedBarPaddingY}px`,
          boxSizing: 'border-box'
        }}
      >
        <span
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
            display: 'grid',
            gap: 2
          }}
        >
          <span
            style={{
              color: APK_CHAT_UI.black55,
              fontSize: APK_CHAT_UI.quoteLabelSize,
              lineHeight: 1.2,
              fontWeight: 500
            }}
          >
            Replying to
          </span>

          <strong
            style={{
              color: APK_CHAT_UI.black70,
              fontSize: APK_CHAT_UI.quoteTextSize,
              lineHeight: 1.25,
              fontWeight: 600,
              minWidth: 0,
              maxWidth: '100%',
              display: 'block',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word'
            }}
          >
            {cleanText}
          </strong>
        </span>
      </span>
    </button>
  )
}

function NdjcChatQuotedProductBlock({
  product,
  available,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
}) {
  const cleanTitle = product.title?.trim() || 'Shared item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null
  const cleanImageUrl = product.imageUrl?.trim() || null

  return (
    <section
      className="ndjc-chat-quoted-product-block"
      style={{
        width: '100%',
        maxWidth: APK_CHAT_UI.productQuoteMaxWidth,
        border: '1px solid rgba(0, 0, 0, 0.18)',
        borderRadius: APK_CHAT_UI.productRadius,
        padding: 2,
        background: APK_CHAT_UI.white,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <NdjcLinkedCatalogItemCard
        title={cleanTitle}
        imageUrl={cleanImageUrl}
        price={cleanPrice}
        originalPrice={cleanOriginalPrice}
        discountPrice={cleanDiscountPrice}
        available={available}
        allowClickWhenUnavailable={false}
        onOpen={() => {
          if (available) {
            onOpen(product.dishId)
          }
        }}
        middle={
          <NdjcItemStatusBadgeRow
            recommended={product.isRecommended}
            hidden={false}
          />
        }
      />
    </section>
  )
}

function NdjcChatTextBubbleFrame({
  children,
  outgoing,
  selected,
  focused,
  matched
}: {
  children: React.ReactNode
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
}) {
  return (
    <div
      className="ndjc-chat-text-bubble"
      style={{
        ...apkChatTextBubbleStyle(
          outgoing,
          selected,
          focused,
          matched
        ),
        width: 'fit-content',
        minWidth: 0,
        maxWidth: '100%',
        display: 'grid',
        gap: APK_CHAT_UI.richBubblePadding,
        overflow: 'visible',
        boxSizing: 'border-box',
        justifySelf: outgoing ? 'end' : 'start'
      }}
    >
      {children}
    </div>
  )
}
function NdjcChatBodyText({
  body,
  outgoing
}: {
  body: string
  outgoing?: boolean
}) {
  const cleanBody = body.trim()
  if (!cleanBody) return null

  return (
    <p
      style={{
        ...apkChatTextStyle,
        width: 'auto',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: `${APK_CHAT_UI.textBubblePaddingY}px ${APK_CHAT_UI.textBubblePaddingX}px`,
        color: outgoing ? NDJC_GLOBAL_UI_TOKENS.colors.surface : NDJC_GLOBAL_UI_TOKENS.colors.textBody,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
      }}
    >
      {cleanBody}
    </p>
  )
}

function NdjcChatPlainTextBubble({
  body,
  outgoing,
  selected,
  focused,
  matched
}: {
  body: string
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
}) {
  const cleanBody = body.trim()
  if (!cleanBody) return null

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} outgoing={outgoing} />
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcChatTextQuoteBubble({
  body,
  quoteText,
  outgoing,
  selected,
  focused,
  matched,
  onJumpToQuote
}: {
  body: string
  quoteText: string
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onJumpToQuote: () => void
}) {
  const cleanBody = body.trim()
  const cleanQuoteText = quoteText.trim()

  if (!cleanBody && !cleanQuoteText) return null

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} outgoing={outgoing} />

      {cleanQuoteText ? (
        <section
          className="ndjc-chat-quote-width-shell"
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <NdjcChatQuoteBlock
            text={cleanQuoteText}
            onClick={onJumpToQuote}
          />
        </section>
      ) : null}
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcChatProductQuoteBubble({
  body,
  quoteProduct,
  outgoing,
  selected,
  focused,
  matched,
  isProductAvailable,
  onOpenProduct
}: {
  body: string
  quoteProduct: ShowcaseChatProductShare
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  isProductAvailable?: (dishId: string) => boolean
  onOpenProduct: (dishId: string) => void
}) {
  const cleanBody = body.trim()

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} outgoing={outgoing} />

<section
  className="ndjc-chat-product-quote-shell"
  style={{
    width: '100%',
    maxWidth: `min(100%, ${APK_CHAT_UI.productQuoteMaxWidth}px)`,
    minWidth: 0,
    boxSizing: 'border-box'
  }}
>
        <NdjcChatQuotedProductBlock
          product={quoteProduct}
          available={
            isProductAvailable
              ? isProductAvailable(quoteProduct.dishId)
              : true
          }
          onOpen={onOpenProduct}
        />
      </section>
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcPendingProductBar({
  product,
  available,
  onOpen,
  onSend,
  onClear
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
  onSend: () => void
  onClear: () => void
}) {
  const cleanImageUrl = product.imageUrl?.trim() || null
  const cleanTitle = product.title?.trim() || 'Selected item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null

  return (
    <section className="ndjc-pending-product-bar" style={apkPendingProductBarStyle}>
      <span style={apkPendingProductSideBarStyle} aria-hidden="true" />

      <section
        style={apkPendingProductPreviewCardStyle}
      >
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpen(product.dishId)}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>

      <section
        className="ndjc-pending-product-actions"
        style={apkPendingProductActionColumnStyle}
      >
        <button
          type="button"
          style={apkPendingProductIconButtonStyle('close')}
          onClick={onClear}
          aria-label="Cancel"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            style={{
              width: 24,
              height: 24,
              display: 'block'
            }}
          >
            <path
              d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.3-6.29Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          type="button"
          style={{
            ...apkPendingProductIconButtonStyle('send'),
            opacity: available ? 1 : 0.45,
            cursor: available ? 'pointer' : 'not-allowed'
          }}
          disabled={!available}
          onClick={() => {
            if (available) {
              onSend()
            }
          }}
          aria-label="Send"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            style={{
              width: 24,
              height: 24,
              display: 'block'
            }}
          >
            <path
              d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>
    </section>
  )
}



function ChatMessageBubble({
  message,
  actions,
  quotePreviewText,
  quoteProduct,
  imagePreviewPool,
  selectionMode,
  focused,
  matched,
  flashing,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
  onOpenImagePreview,
  onOpenAppointmentDetail
}: {
  message: ShowcaseChatMessage
  actions: ShowcaseChatActions
  quotePreviewText: string
  quoteProduct: ShowcaseChatProductShare | null
  imagePreviewPool: string[]
  selectionMode: boolean
  focused?: boolean
  matched?: boolean
  flashing?: boolean
  menuOpen: boolean
  onOpenMenu: () => void
  onCloseMenu: () => void
  onOpenImagePreview: (url: string, pool: string[]) => void
  onOpenAppointmentDetail: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  const articleRef = React.useRef<HTMLElement | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const longPressReleaseTimerRef = React.useRef<number | null>(null)
  const pointerStartRef = React.useRef<{
    pointerId: number
    x: number
    y: number
  } | null>(null)
  const suppressClickUntilRef = React.useRef(0)
  const longPressTriggeredRef = React.useRef(false)
  const [menuPlacement, setMenuPlacement] = React.useState<NdjcChatMessageMenuPlacement>('below')

  const unavailable = Boolean(
    actions.isProductAvailable &&
    message.product &&
    !actions.isProductAvailable(message.product.dishId)
  )

  const isProductBubble = Boolean(message.product)
  const isAppointmentBubble = Boolean(message.appointment)
  const isImageOnlyBubble = Boolean(message.imageUrls.length && !message.body.trim() && !message.product && !message.appointment)

  function shouldSuppressClick(): boolean {
    return longPressTriggeredRef.current || Date.now() < suppressClickUntilRef.current
  }

  function suppressNextClick(): void {
    suppressClickUntilRef.current = Date.now() + 760
  }

  function estimateMessageMenuHeight(): number {
    const itemCount = isProductBubble || isAppointmentBubble || isImageOnlyBubble
      ? 1
      : message.body.trim()
        ? 2
        : 1

    return (
      APK_CHAT_UI.messageMenuPadding * 2 +
      APK_CHAT_UI.messageMenuItemHeight * itemCount +
      Math.max(0, itemCount - 1) * 2
    )
  }

  function updateMessageMenuPlacement(): void {
    const article = articleRef.current

    if (!article || typeof window === 'undefined') {
      setMenuPlacement('below')
      return
    }

    const stack = article.querySelector('.ndjc-chat-message-stack')
    const anchor = stack instanceof HTMLElement ? stack : article
    const anchorRect = anchor.getBoundingClientRect()
    const scrollBody = article.closest('.ndjc-conversation-body')
    const boundaryRect = scrollBody instanceof HTMLElement
      ? scrollBody.getBoundingClientRect()
      : null

    const boundaryTop = boundaryRect?.top ?? 0
    const boundaryBottom = boundaryRect?.bottom ?? window.innerHeight
    const menuHeight = estimateMessageMenuHeight()
    const menuGap = 4
    const safetyGap = 10
    const availableBelow = boundaryBottom - anchorRect.bottom
    const availableAbove = anchorRect.top - boundaryTop

    if (
      availableBelow < menuHeight + menuGap + safetyGap &&
      availableAbove > availableBelow
    ) {
      setMenuPlacement('above')
      return
    }

    setMenuPlacement('below')
  }

  function clearLongPressTimer() {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  function clearLongPressReleaseTimer() {
    if (longPressReleaseTimerRef.current != null) {
      window.clearTimeout(longPressReleaseTimerRef.current)
      longPressReleaseTimerRef.current = null
    }
  }

  function openMessageMenu() {
    clearLongPressTimer()
    clearLongPressReleaseTimer()
    longPressTriggeredRef.current = true
    suppressNextClick()
    updateMessageMenuPlacement()
    onOpenMenu()
  }

  function closeMessageMenu() {
    clearLongPressTimer()
    onCloseMenu()
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    clearLongPressTimer()
    clearLongPressReleaseTimer()
    longPressTriggeredRef.current = false

    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY
    }

    longPressTimerRef.current = window.setTimeout(() => {
      openMessageMenu()
      longPressTimerRef.current = null
    }, 460)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const pointerStart = pointerStartRef.current
    if (!pointerStart || pointerStart.pointerId !== event.pointerId) return

    const deltaX = event.clientX - pointerStart.x
    const deltaY = event.clientY - pointerStart.y
    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY))

    if (distance > 10 && !longPressTriggeredRef.current) {
      clearLongPressTimer()
      pointerStartRef.current = null
    }
  }

  function handlePointerEnd() {
    clearLongPressTimer()
    pointerStartRef.current = null

    if (longPressTriggeredRef.current) {
      suppressNextClick()
      clearLongPressReleaseTimer()

      longPressReleaseTimerRef.current = window.setTimeout(() => {
        longPressTriggeredRef.current = false
        longPressReleaseTimerRef.current = null
      }, 780)
    }
  }

  function handleClickCapture(event: React.MouseEvent<HTMLElement>) {
    const target = event.target

    if (
      target instanceof Element &&
      target.closest('[data-ndjc-chat-message-menu="true"]')
    ) {
      return
    }

    if (!shouldSuppressClick()) return

    event.preventDefault()
    event.stopPropagation()
  }

  async function handleCopy() {
    const text = message.body.trim()

    await copyTextToClipboard(text)

    closeMessageMenu()
  }

  function handleQuote() {
    actions.onQuoteMessage(message.id)
    closeMessageMenu()
  }

  function handleSendAgain() {
    if (message.product) {
      actions.onUseProductCardAsPending(message.product)
      closeMessageMenu()
      return
    }

    if (message.appointment) {
      actions.onUseAppointmentCardAsPending(message.appointment)
      closeMessageMenu()
      return
    }

    if (message.imageUrls.length) {
      actions.onPickImages(message.imageUrls)
      closeMessageMenu()
      return
    }

    closeMessageMenu()
  }

  React.useEffect(() => {
    return () => {
      clearLongPressTimer()
      clearLongPressReleaseTimer()
    }
  }, [])

  const hasQuotedTextBlock = Boolean(message.quotedMessageId && !quoteProduct)
  const hasQuotedProductBlock = Boolean(message.quotedMessageId && quoteProduct)
  const hasTextOrQuoteBubble = Boolean(message.body || hasQuotedTextBlock || hasQuotedProductBlock)
  const isRichRetryBubble = Boolean(message.product || message.appointment)

  const shouldShowRetryButton = Boolean(
    message.outgoing &&
    message.failed
  )

  const messageBubbleContent = (
    <>
      {message.product ? (
        <ChatProductBubble
          product={message.product}
          available={!unavailable}
          outgoing={message.outgoing}
          selected={message.selected}
          focused={focused}
          matched={matched}
          onOpen={actions.onOpenProductDetail}
        />
      ) : null}

      {message.appointment ? (
        <ChatAppointmentBubble
          appointment={message.appointment}
          outgoing={message.outgoing}
          selected={message.selected}
          focused={focused}
          matched={matched}
          onOpen={onOpenAppointmentDetail}
        />
      ) : null}

      <NdjcChatImagesGridUi
        urls={
          selectShowcaseImageVariantList(message.imageVariants, 'chatThumb').length
            ? selectShowcaseImageVariantList(message.imageVariants, 'chatThumb')
            : selectChatImageUrls(message.imageUrls, 'chatThumb')
        }
        previewUrls={
          selectShowcaseImageVariantList(message.imageVariants, 'chatPreview').length
            ? selectShowcaseImageVariantList(message.imageVariants, 'chatPreview')
            : selectChatImageUrls(message.imageUrls, 'chatPreview')
        }
        blurDataUrls={(message.imageVariants || []).map(item => selectShowcaseImageBlurDataUrl(item))}
        outgoing={message.outgoing}
        previewPool={imagePreviewPool}
        shouldSuppressClick={shouldSuppressClick}
        onOpen={onOpenImagePreview}
      />

      {hasTextOrQuoteBubble ? (
        hasQuotedProductBlock && quoteProduct ? (
          <NdjcChatProductQuoteBubble
            body={message.body}
            quoteProduct={quoteProduct}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
            isProductAvailable={actions.isProductAvailable}
            onOpenProduct={actions.onOpenProductDetail}
          />
        ) : hasQuotedTextBlock ? (
          <NdjcChatTextQuoteBubble
            body={message.body}
            quoteText={quotePreviewText || 'Quoted message'}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
            onJumpToQuote={() => actions.onJumpToMessage(message.quotedMessageId || '')}
          />
        ) : (
          <NdjcChatPlainTextBubble
            body={message.body}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
          />
        )
      ) : null}
    </>
  )

  return (
    <article
      ref={articleRef}
      id={`chat-message-${message.id}`}
      data-ndjc-chat-message-bubble="true"
      data-ndjc-chat-message-id={message.id}
      className={cx(
        'ndjc-chat-message-row',
        message.outgoing && 'is-outgoing',
        message.selected && 'is-selected',
        message.failed && 'is-failed',
        unavailable && 'is-unavailable',
        flashing && 'is-flashing'
      )}
      style={{
        ...apkChatMessageRowStyle(message.outgoing, message.selected, message.failed),
        animation: flashing ? 'ndjc-chat-message-flash 900ms ease-out 1' : undefined,
        borderRadius: APK_CHAT_UI.textBubbleRadius,
        willChange: flashing ? 'filter, transform' : undefined
      }}
      onContextMenu={event => {
        event.preventDefault()
        openMessageMenu()
      }}
      onDoubleClick={openMessageMenu}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    >
      <div
        className="ndjc-chat-message-content-row"
        style={apkChatMessageContentRowStyle(message.outgoing)}
      >
        <div
          className="ndjc-chat-message-stack"
          style={apkChatMessageStackStyle(message.outgoing, message.failed)}
        >
          {shouldShowRetryButton ? (
            isRichRetryBubble ? (
              <div
                className="ndjc-chat-rich-retry-bubble-host"
                style={apkChatRichRetryBubbleHostStyle()}
              >
                <button
                  type="button"
                  className="ndjc-chat-retry-button"
                  style={{
                    ...apkChatRetryButtonStyle(),
                    ...apkChatRichRetryButtonOverlayStyle()
                  }}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()

                    if (message.failed) {
                      actions.onRetry(message.id)
                    }
                  }}
                  onPointerDown={event => {
                    event.stopPropagation()
                  }}
                  aria-label="Retry failed message"
                  title="Retry"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={apkChatRetryIconStyle}
                  >
                    <path
                      d="M18.2 7.8A7.4 7.4 0 0 0 12.4 5C8.3 5 5 8.3 5 12.4C5 16.5 8.3 19.8 12.4 19.8C15.3 19.8 17.9 18.1 19.1 15.5C19.3 15 19.1 14.4 18.6 14.2C18.1 14 17.5 14.2 17.3 14.7C16.4 16.6 14.5 17.8 12.4 17.8C9.4 17.8 7 15.4 7 12.4C7 9.4 9.4 7 12.4 7C13.9 7 15.3 7.6 16.3 8.7H14.3C13.7 8.7 13.3 9.1 13.3 9.7C13.3 10.3 13.7 10.7 14.3 10.7H19.2C19.8 10.7 20.2 10.3 20.2 9.7V4.8C20.2 4.2 19.8 3.8 19.2 3.8C18.6 3.8 18.2 4.2 18.2 4.8V7.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {messageBubbleContent}
              </div>
            ) : (
              <div className="ndjc-chat-failed-bubble-row" style={apkChatFailedBubbleRowStyle()}>
                <button
                  type="button"
                  className="ndjc-chat-retry-button"
                  style={apkChatRetryButtonStyle()}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()

                    if (message.failed) {
                      actions.onRetry(message.id)
                    }
                  }}
                  onPointerDown={event => {
                    event.stopPropagation()
                  }}
                  aria-label="Retry failed message"
                  title="Retry"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={apkChatRetryIconStyle}
                  >
                    <path
                      d="M18.2 7.8A7.4 7.4 0 0 0 12.4 5C8.3 5 5 8.3 5 12.4C5 16.5 8.3 19.8 12.4 19.8C15.3 19.8 17.9 18.1 19.1 15.5C19.3 15 19.1 14.4 18.6 14.2C18.1 14 17.5 14.2 17.3 14.7C16.4 16.6 14.5 17.8 12.4 17.8C9.4 17.8 7 15.4 7 12.4C7 9.4 9.4 7 12.4 7C13.9 7 15.3 7.6 16.3 8.7H14.3C13.7 8.7 13.3 9.1 13.3 9.7C13.3 10.3 13.7 10.7 14.3 10.7H19.2C19.8 10.7 20.2 10.3 20.2 9.7V4.8C20.2 4.2 19.8 3.8 19.2 3.8C18.6 3.8 18.2 4.2 18.2 4.8V7.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <span
                  style={{
                    width: APK_CHAT_UI.retryButtonGap,
                    minWidth: APK_CHAT_UI.retryButtonGap
                  }}
                  aria-hidden="true"
                />

                <div
                  className="ndjc-chat-bubble-only-stack"
                  style={apkChatBubbleOnlyStackStyle(message.outgoing, false)}
                >
                  {messageBubbleContent}
                </div>
              </div>
            )
          ) : (
            messageBubbleContent
          )}

          {message.outgoing && message.statusText ? (
            <span className="ndjc-chat-message-status" style={apkChatTimeTextStyle}>
              {message.statusText}
            </span>
          ) : null}

          {menuOpen ? (
            <section
              data-ndjc-chat-message-menu="true"
              className="ndjc-chat-message-menu"
              style={apkChatMessageMenuStyle(message.outgoing, menuPlacement)}
              role="menu"
              onPointerDown={event => {
                event.stopPropagation()
              }}
              onPointerUp={event => {
                event.stopPropagation()
              }}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              {isProductBubble || isAppointmentBubble || isImageOnlyBubble ? (
                <button
                  type="button"
                  style={apkChatMessageMenuItemStyle(false)}
                  onPointerDown={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleSendAgain()
                  }}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  role="menuitem"
                >
                  Send again
                </button>
              ) : (
                <>
                  {message.body.trim() ? (
                    <button
                      type="button"
                      style={apkChatMessageMenuItemStyle(false)}
                      onPointerDown={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        void handleCopy()
                      }}
                      onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      role="menuitem"
                    >
                      Copy
                    </button>
                  ) : null}

                  <button
                    type="button"
                    style={apkChatMessageMenuItemStyle(false)}
                    onPointerDown={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleQuote()
                    }}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    role="menuitem"
                  >
                    Quote
                  </button>
                </>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ChatFindBar({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  if (!state.findQuery && !state.findResultIds.length) return null

  return (
    <section className="ndjc-chat-find-bar" style={apkChatFindBarStyle}>
      <NdjcTextField
        value={state.findQuery}
        onChange={actions.onFindQueryChange}
        placeholder="Find in chat"
      />

      <NdjcChatToolButton label="Prev" icon="↑" onClick={actions.onFindPrev} />
      <NdjcChatToolButton label="Next" icon="↓" onClick={actions.onFindNext} />
      <NdjcChatToolButton label="Close" icon="×" onClick={actions.onCloseFind} />
    </section>
  )
}
function apkMerchantThreadMenuItemStyle(disabled = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 44,
    border: 0,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: disabled ? 'rgba(0, 0, 0, 0.34)' : 'rgba(0, 0, 0, 0.90)',
    background: APK_CHAT_UI.white,
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 400,
    textAlign: 'left',
    cursor: disabled ? 'default' : 'pointer'
  }
}
function MerchantChatThreadRow({
  thread,
  actions,
  onRequestDelete,
  onRequestRename
}: {
  thread: ShowcaseChatThreadSummaryUi
  actions: ShowcaseMerchantChatListActions
  onRequestDelete: (threadId: string, title: string) => void
  onRequestRename: (threadId: string, title: string) => void
}) {
  const [menuExpanded, setMenuExpanded] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const longPressTimerRef = React.useRef<number | null>(null)
  const hasUnread = thread.unreadCount > 0
  const previewText = thread.lastMessage || 'No messages yet'

  function clearLongPressTimer(): void {
    if (longPressTimerRef.current == null) return

    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function openMenu(): void {
    clearLongPressTimer()
    setMenuExpanded(true)
  }

  function closeMenu(): void {
    clearLongPressTimer()
    setMenuExpanded(false)
  }

  function startLongPressTimer(): void {
    clearLongPressTimer()

    longPressTimerRef.current = window.setTimeout(() => {
      setMenuExpanded(true)
      longPressTimerRef.current = null
    }, 520)
  }

  React.useEffect(() => {
    return () => clearLongPressTimer()
  }, [])

  return (
    <section
      className={cx('ndjc-merchant-thread-row-wrap', thread.pinned && 'is-pinned', hasUnread && 'has-unread')}
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0
      }}
      onContextMenu={event => {
        event.preventDefault()
        openMenu()
      }}
    >
      <button
        type="button"
        className="ndjc-merchant-thread-row"
        style={{
          width: '100%',
          minWidth: 0,
          border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
          borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
          padding: APK_SHOWCASE_ITEM_UI.catalogCardPadding,
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
          color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
          background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
          boxShadow: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
          transformOrigin: 'center center',
          transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
        onPointerDown={() => {
          setPressed(true)
          startLongPressTimer()
        }}
        onPointerUp={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onPointerCancel={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onPointerLeave={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onClick={() => {
          setPressed(false)

          if (menuExpanded) {
            closeMenu()
            return
          }

          actions.onOpenThread(thread.conversationId, thread.title)
        }}
      >
        <section
          className="ndjc-merchant-thread-title-row"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: 12
          }}
        >
          <section
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                fontWeight: hasUnread ? 700 : 600
              }}
            >
              {thread.title}
            </span>

            {thread.pinned ? (
              <>
                <span style={{ width: 8, flexShrink: 0 }} />

                <span
                  aria-label="Pinned"
                  title="Pinned"
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    display: 'inline-grid',
                    placeItems: 'center',
                    color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                    fontSize: 13,
                    lineHeight: 1
                  }}
                >
                  📌
                </span>
              </>
            ) : null}
          </section>

          <span
            style={{
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
              fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
              lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
              fontWeight: hasUnread ? 600 : APK_EDIT_ITEM_UI.bodySmallFontWeight,
              whiteSpace: 'nowrap'
            }}
          >
            {thread.lastMessageAtText}
          </span>
        </section>

        <section
          className="ndjc-merchant-thread-preview-row"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: hasUnread ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
            alignItems: 'center',
            gap: hasUnread ? 10 : 0
          }}
        >
          <span
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
              fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
              lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
              fontWeight: hasUnread ? 600 : APK_EDIT_ITEM_UI.bodySmallFontWeight
            }}
          >
            {previewText}
          </span>

          {hasUnread ? (
            <span
              className="ndjc-merchant-thread-unread"
              style={{
                minWidth: 22,
                height: 22,
                borderRadius: 999,
                padding: '0 8px',
                boxSizing: 'border-box',
                display: 'inline-grid',
                placeItems: 'center',
                color: NDJC_GLOBAL_UI_TOKENS.colors.surface,
                background: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                fontSize: 11,
                lineHeight: 1,
                fontWeight: 700
              }}
            >
              {thread.unreadCount}
            </span>
          ) : null}
        </section>
      </button>

      {menuExpanded ? (
        <>
          <button
            type="button"
            aria-label="Dismiss conversation menu"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 20,
              border: 0,
              padding: 0,
              background: 'transparent',
              cursor: 'default'
            }}
            onClick={closeMenu}
          />

          <section
            className="ndjc-merchant-thread-menu"
            style={{
              position: 'absolute',
              zIndex: 21,
              top: 38,
              right: 8,
              width: 220,
              borderRadius: 14,
              padding: '6px 0',
              display: 'grid',
              gap: 0,
              color: APK_CHAT_UI.black,
              background: APK_CHAT_UI.white,
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
              overflow: 'hidden'
            }}
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                onRequestDelete(thread.conversationId, thread.title)
              }}
            >
              Delete conversation
            </button>

            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                onRequestRename(thread.conversationId, thread.title)
              }}
            >
              Rename
            </button>

            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                actions.onTogglePin(thread.conversationId, !thread.pinned)
              }}
            >
              {thread.pinned ? 'Unpin' : 'Pin'}
            </button>
          </section>
        </>
      ) : null}
    </section>
  )
}

export function ShowcaseMerchantChatListScreen({
  threads,
  searchQuery,
  refreshing,
  pagination,
  actions
}: {
  threads: ShowcaseChatThreadSummaryUi[]
  searchQuery: string
  refreshing: boolean
  pagination: ShowcasePaginationUiState
  actions: ShowcaseMerchantChatListActions
}) {
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [renameThreadId, setRenameThreadId] = React.useState<string | null>(null)
  const [renameText, setRenameText] = React.useState('')
  const [pendingDeleteThreadId, setPendingDeleteThreadId] = React.useState<string | null>(null)
  const [pendingDeleteThreadTitle, setPendingDeleteThreadTitle] = React.useState('')
  const [threadSubmittingAction, setThreadSubmittingAction] = React.useState<'rename' | 'delete' | null>(null)
  const chatListPaddingX = '25px'
  const chatListExpandedHeaderContentHeight = 165
  const chatListCollapsedHeaderContentHeight = 110
  const {
    collapsed: chatListHeaderCollapsed,
    headerRef,
    headerBottomPadding: chatListHeaderBottomPadding,
    headerTotalHeight: chatListHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: chatListExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: chatListCollapsedHeaderContentHeight,
    measureKey: [
      threads.length,
      searchQuery,
      pagination.isLoadingMore,
      pagination.hasMore
    ].join('|')
  })

  function openRenameDialog(threadId: string, title: string): void {
    setRenameThreadId(threadId)
    setRenameText(title)
    setRenameDialogOpen(true)
  }

  function closeRenameDialog(): void {
    if (threadSubmittingAction) return

    setRenameDialogOpen(false)
    setRenameThreadId(null)
    setRenameText('')
  }

  function requestDeleteThread(threadId: string, title: string): void {
    setPendingDeleteThreadId(threadId)
    setPendingDeleteThreadTitle(title)
  }

  function dismissDeleteThreadDialog(): void {
    if (threadSubmittingAction) return

    setPendingDeleteThreadId(null)
    setPendingDeleteThreadTitle('')
  }

  const visibleThreads = threads
  const queryIsBlank = searchQuery.trim().length === 0

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-merchant-chat-list-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={refreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-merchant-chat-list-scroll"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              background: '#e9efed',
              padding: `${listTopPadding}px ${chatListPaddingX} calc(var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px) + ${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px)`,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
              boxSizing: 'border-box'
            }}
            onScroll={event => {
              handleCollapseScroll(event)

              ndjcHandleLoadMoreScroll(
                event,
                pagination,
                actions.onLoadMore
              )
            }}
          >
            {visibleThreads.length ? (
              <section
                className="ndjc-merchant-chat-list-items"
                style={{
                  width: '100%',
                  maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
                }}
              >
                {visibleThreads.map(thread => (
                  <MerchantChatThreadRow
                    key={thread.conversationId}
                    thread={thread}
                    actions={actions}
                    onRequestDelete={requestDeleteThread}
                    onRequestRename={openRenameDialog}
                  />
                ))}

                <NdjcPaginationFooter
                  pagination={pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more conversations"
                  onLoadMore={actions.onLoadMore}
                />
              </section>
            ) : (
              <section
                className="ndjc-merchant-chat-list-empty-wrap"
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
                  title={queryIsBlank ? 'No messages yet' : 'No results'}
                  message={queryIsBlank
                    ? 'New conversations will appear here.'
                    : 'Try a different name.'}
                  verticalPadding={0}
                />
              </section>
            )}
          </section>

          <section
            className="ndjc-merchant-chat-header-wrap"
            style={{
              position: 'absolute',
              zIndex: 3,
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: chatListHeaderHeight,
              boxSizing: 'border-box',
              background: APK_SHELL_UI.pageBg,
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
              padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${chatListHeaderBottomPadding}px`,
              overflow: 'hidden',
              transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            <section
              ref={headerRef}
              className="ndjc-merchant-chat-header-column"
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: chatListHeaderCollapsed
                  ? 4
                  : APK_EDIT_ITEM_UI.sectionCardGap,
                transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              <section
                className="ndjc-merchant-chat-title-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: chatListHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
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
                    transform: chatListHeaderCollapsed
                      ? 'translateY(-3px) scale(0.78)'
                      : 'translateY(0) scale(1)',
                    willChange: 'transform',
                    transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  Customer messages
                </h1>

                <p
                  style={{
                    margin: 0,
                    height: chatListHeaderCollapsed ? 0 : 21,
                    color: APK_EDIT_ITEM_UI.body70,
                    fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                    opacity: chatListHeaderCollapsed ? 0 : 1,
                    overflow: 'hidden',
                    transform: chatListHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                    willChange: 'opacity, transform',
                    transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  Manage conversations.
                </p>

                <p
                  style={{
                    margin: 0,
                    height: chatListHeaderCollapsed ? 0 : 17,
                    color: APK_EDIT_ITEM_UI.body55,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                    opacity: chatListHeaderCollapsed ? 0 : 1,
                    overflow: 'hidden',
                    transform: chatListHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                    willChange: 'opacity, transform',
                    transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  {visibleThreads.length} conversations
                </p>
              </section>

              <NdjcTextField
                value={searchQuery}
                onChange={actions.onSearchQueryChange}
                label="Search customers"
                placeholder="Search customers"
                singleLine
                leadingIcon={(
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.1 16.1 21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              />
            </section>
          </section>
        </NdjcAdminPullRefreshContainer>

        {renameDialogOpen ? (
          <NdjcBaseDialog
            title="Rename conversation"
            confirmText="Save"
            dismissText="Cancel"
            confirmEnabled={renameText.trim().length > 0 && !threadSubmittingAction}
            confirmLoading={threadSubmittingAction === 'rename'}
            onConfirmClick={() => {
              const id = renameThreadId

              if (!id?.trim() || threadSubmittingAction) return

              setThreadSubmittingAction('rename')
              void Promise.resolve(actions.onRenameThread(id, renameText))
                .then(() => {
                  setRenameDialogOpen(false)
                  setRenameThreadId(null)
                  setRenameText('')
                })
                .finally(() => {
                  setThreadSubmittingAction(null)
                })
            }}
            onDismissClick={closeRenameDialog}
            onDismissRequest={closeRenameDialog}
            textContent={
              <NdjcTextField
                value={renameText}
                onChange={setRenameText}
                label="Name"
                singleLine
              />
            }
          />
        ) : null}

        {pendingDeleteThreadId ? (
          <NdjcBaseDialog
            title="Delete conversation?"
            message="This will remove this conversation from the list on this device and delete all local chat messages, local draft images, and local temporary files related to this conversation."
            confirmText="Delete"
            dismissText="Cancel"
            destructiveConfirm
            confirmEnabled={!threadSubmittingAction}
            confirmLoading={threadSubmittingAction === 'delete'}
            onConfirmClick={() => {
              const id = pendingDeleteThreadId

              if (!id.trim() || threadSubmittingAction) return

              setThreadSubmittingAction('delete')
              void Promise.resolve(actions.onDeleteThread(id))
                .then(() => {
                  setPendingDeleteThreadId(null)
                  setPendingDeleteThreadTitle('')
                })
                .finally(() => {
                  setThreadSubmittingAction(null)
                })
            }}
            onDismissClick={dismissDeleteThreadDialog}
            onDismissRequest={dismissDeleteThreadDialog}
          />
        ) : null}
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseChatSearchResults({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  const results = state.searchResults
  const [pressedSearchResultKey, setPressedSearchResultKey] = React.useState<string | null>(null)
  const chatSearchListPaddingX = '25px'
  const chatSearchExpandedHeaderContentHeight = 165
  const chatSearchCollapsedHeaderContentHeight = 110
  const {
    collapsed: chatSearchHeaderCollapsed,
    headerRef,
    headerBottomPadding: chatSearchHeaderBottomPadding,
    headerTotalHeight: chatSearchHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: chatSearchExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: chatSearchCollapsedHeaderContentHeight,
    measureKey: [
      state.findQuery,
      results.length,
      state.searchPagination.isLoadingMore,
      state.searchPagination.hasMore
    ].join('|')
  })

  const hint = state.findQuery.trim()
    ? `${results.length} result${results.length === 1 ? '' : 's'}`
    : 'Type a keyword to search your chat history'

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-search-results-screen"
      topNav={{
        onBack: actions.onCloseSearchResults,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-chat-search-results-shell"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-chat-search-results-list-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            minHeight: 0,
            background: '#e9efed',
            padding: `${listTopPadding}px ${chatSearchListPaddingX} calc(var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px) + ${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px)`,
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
              state.searchPagination,
              actions.onLoadMoreSearchResults
            )
          }}
        >
          {results.length ? (
            <section
              className="ndjc-chat-search-results-list"
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
              }}
            >
              {results.map(result => {
                const resultKey = `${result.conversationId}-${result.messageId || 'name'}-${result.createdAtText}`
                const pressed = pressedSearchResultKey === resultKey

                return (
                  <section
                    key={resultKey}
                    className="ndjc-chat-search-result-row"
                    style={{
                      width: '100%',
                      border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
                      borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
                      background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
                      boxShadow: 'none',
                      overflow: 'hidden',
                      transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
                      transformOrigin: 'center center',
                      transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: '100%',
                        border: 0,
                        padding: APK_SHOWCASE_ITEM_UI.catalogCardPadding,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                        background: 'transparent',
                        boxShadow: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                      }}
                      onPointerDown={() => {
                        setPressedSearchResultKey(resultKey)
                      }}
                      onPointerUp={() => {
                        setPressedSearchResultKey(null)
                      }}
                      onPointerCancel={() => {
                        setPressedSearchResultKey(null)
                      }}
                      onPointerLeave={() => {
                        setPressedSearchResultKey(null)
                      }}
                      onClick={() => {
                        setPressedSearchResultKey(null)
                        actions.onOpenThreadFromSearch(result.conversationId, result.messageId)
                      }}
                    >
                      <section
                        style={{
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                          alignItems: 'center',
                          gap: APK_EDIT_ITEM_UI.fieldGap
                        }}
                      >
                        <span
                          style={{
                            minWidth: 0,
                            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                            fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                            lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {result.senderLabel}
                        </span>

                        <span
                          style={{
                            flexShrink: 0,
                            color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                            fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                            lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                            fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {result.createdAtText}
                        </span>
                      </section>

                      <div style={{ height: APK_SHOWCASE_ITEM_UI.adminItemsListGap, flexShrink: 0 }} />

                      <p
                        style={{
                          margin: 0,
                          color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                          fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                          lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                          fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {highlightQueryText(result.snippet, state.findQuery)}
                      </p>
                    </button>
                  </section>
                )
              })}

              <NdjcPaginationFooter
                pagination={state.searchPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText="No more results"
                onLoadMore={actions.onLoadMoreSearchResults}
              />
            </section>
          ) : state.findQuery.trim() && !state.searchPagination.isLoadingMore ? (
            <section
              className="ndjc-chat-search-results-empty-wrap"
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
                title="No results found"
                message="Try a different keyword."
                verticalPadding={0}
              />
            </section>
          ) : state.findQuery.trim() ? (
            <section
              className="ndjc-chat-search-results-pagination-wrap"
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto'
              }}
            >
              <NdjcPaginationFooter
                pagination={state.searchPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText=""
                onLoadMore={actions.onLoadMoreSearchResults}
              />
            </section>
          ) : (
            <section
              className="ndjc-chat-search-results-empty-wrap"
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
                title="Search your chat history"
                message="Enter a keyword to find messages in this conversation."
                verticalPadding={0}
              />
            </section>
          )}
        </section>

        <section
          className="ndjc-chat-search-results-header-card"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: chatSearchHeaderHeight,
            boxSizing: 'border-box',
            background: APK_SHELL_UI.pageBg,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${chatSearchHeaderBottomPadding}px`,
            overflow: 'hidden',
            transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-chat-search-results-header-column"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: chatSearchHeaderCollapsed
                ? 4
                : APK_EDIT_ITEM_UI.sectionCardGap,
              transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            <section
              className="ndjc-chat-search-results-title-block"
              style={{
                width: '100%',
                display: 'grid',
                gap: chatSearchHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
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
                  transform: chatSearchHeaderCollapsed
                    ? 'translateY(-3px) scale(0.78)'
                    : 'translateY(0) scale(1)',
                  willChange: 'transform',
                  transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                Chat history
              </h1>

              <p
                style={{
                  margin: 0,
                  height: chatSearchHeaderCollapsed ? 0 : 21,
                  color: APK_EDIT_ITEM_UI.body70,
                  fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                  opacity: chatSearchHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: chatSearchHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                Search your conversation history.
              </p>

              <p
                style={{
                  margin: 0,
                  height: chatSearchHeaderCollapsed ? 0 : 17,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                  opacity: chatSearchHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: chatSearchHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                {hint}
              </p>
            </section>

            <NdjcTextField
              value={state.findQuery}
              onChange={actions.onFindQueryChange}
              label="Search messages"
              placeholder="Search messages"
              singleLine
              leadingIcon={(
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.1 16.1 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            />
          </section>
        </section>
      </section>
    </NdjcUnifiedBackground>
  )
}
export function ShowcaseChatThread({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  const [plusMenuExpanded, setPlusMenuExpanded] = React.useState(false)
  const [chatImagePreview, setChatImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const photoLibraryInputRef = React.useRef<HTMLInputElement | null>(null)
  const cameraInputRef = React.useRef<HTMLInputElement | null>(null)
  const plusMenuButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const plusMenuPanelRef = React.useRef<HTMLElement | null>(null)
  const chatComposerTextareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const draftImageRowRef = React.useRef<HTMLElement | null>(null)
  const draftImageRowPointerRef = React.useRef<{
    pointerId: number
    startX: number
    startScrollLeft: number
    dragging: boolean
  } | null>(null)
  const draftImageClickSuppressUntilRef = React.useRef(0)
  const [activeFlashMessageId, setActiveFlashMessageId] = React.useState<string | null>(null)
  const [appointmentDetailsItem, setAppointmentDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const [activeMessageMenuId, setActiveMessageMenuId] = React.useState<string | null>(null)

  const closeAppointmentDetailsSheet = React.useCallback(() => {
    setAppointmentDetailsItem(null)
  }, [])

  const previewDraftImages = React.useMemo(() => {
    return Array.from(new Set(
      state.draftImageUrls
        .map(url => String(url || '').trim())
        .filter(Boolean)
    )).slice(0, 9)
  }, [state.draftImageUrls])

  const canSend = !state.isSending && Boolean(
    state.draft.trim() ||
    previewDraftImages.length ||
    state.pendingProduct ||
    state.pendingAppointment
  )

  const resizeChatComposerTextarea = React.useCallback((textarea: HTMLTextAreaElement) => {
    const minHeight = APK_CHAT_UI.inputMinHeight - APK_CHAT_UI.inputPaddingY * 2
    const maxHeight = APK_CHAT_UI.inputMaxHeight - APK_CHAT_UI.inputPaddingY * 2

    textarea.style.height = 'auto'

    const nextHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight)
    )

    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [])

  React.useLayoutEffect(() => {
    const textarea = chatComposerTextareaRef.current
    if (!textarea) return

    resizeChatComposerTextarea(textarea)
  }, [resizeChatComposerTextarea, state.draft])

  React.useEffect(() => {
    if (!plusMenuExpanded) return
    if (typeof document === 'undefined') return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null
      if (!target) return

      const button = plusMenuButtonRef.current
      const panel = plusMenuPanelRef.current

      if (button?.contains(target)) return
      if (panel?.contains(target)) return

      setPlusMenuExpanded(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPlusMenuExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [plusMenuExpanded])

  function openPhotoLibrary(): void {
    setPlusMenuExpanded(false)
    photoLibraryInputRef.current?.click()
  }

  function openCameraCapture(): void {
    setPlusMenuExpanded(false)
    cameraInputRef.current?.click()
  }

  function handlePhotoLibraryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.currentTarget.files || [])
    event.currentTarget.value = ''
    setPlusMenuExpanded(false)

    if (!files.length) return

    actions.onPickImages(files)
  }

  function handleCameraCaptureChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    setPlusMenuExpanded(false)

    actions.onCameraCaptured(file)
  }

  function handleDraftImageRowPointerDown(event: React.PointerEvent<HTMLElement>): void {
    const row = draftImageRowRef.current
    if (!row) return

    draftImageRowPointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: row.scrollLeft,
      dragging: false
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handleDraftImageRowPointerMove(event: React.PointerEvent<HTMLElement>): void {
    const row = draftImageRowRef.current
    const pointer = draftImageRowPointerRef.current

    if (!row || !pointer || pointer.pointerId !== event.pointerId) return

    const deltaX = event.clientX - pointer.startX

    if (Math.abs(deltaX) > 4) {
      pointer.dragging = true
      draftImageClickSuppressUntilRef.current = Date.now() + 220
    }

    if (!pointer.dragging) return

    event.preventDefault()
    row.scrollLeft = pointer.startScrollLeft - deltaX
  }

  function handleDraftImageRowPointerEnd(event: React.PointerEvent<HTMLElement>): void {
    const pointer = draftImageRowPointerRef.current

    if (!pointer || pointer.pointerId !== event.pointerId) {
      draftImageRowPointerRef.current = null
      return
    }

    const wasDragging = pointer.dragging

    if (wasDragging) {
      draftImageClickSuppressUntilRef.current = Date.now() + 220
      draftImageRowPointerRef.current = null
      return
    }

    const target = event.target instanceof HTMLElement ? event.target : null
    const previewTarget = target?.closest('[data-draft-image-preview-url]') as HTMLElement | null
    const previewUrl = previewTarget?.dataset.draftImagePreviewUrl || ''

    draftImageRowPointerRef.current = null

    if (!previewUrl) return

    openChatImagePreview(previewUrl, previewDraftImages)
  }

  function shouldSuppressDraftImageClick(): boolean {
    return Date.now() < draftImageClickSuppressUntilRef.current
  }

  function minuteKey(value: string) {
    return value.trim().replace(/\s+/g, ' ')
  }

  function timeHeaderText(value: string) {
    return value.trim().replace(/\s+/g, ' ')
  }

  const messageById = React.useMemo(() => {
    const map = new Map<string, ShowcaseChatMessage>()
    state.messages.forEach(message => {
      map.set(message.id, message)
    })
    return map
  }, [state.messages])

  const allThreadImageUrls = React.useMemo(() => {
    return Array.from(new Set(
      state.messages.flatMap(message => {
        const variantUrls = selectShowcaseImageVariantList(message.imageVariants, 'chatPreview')
        return variantUrls.length ? variantUrls : selectChatImageUrls(message.imageUrls, 'chatPreview')
      })
    ))
  }, [state.messages])

  function openChatImagePreview(urlInput: string, poolInput: string[]): void {
    const url = urlInput.trim()
    if (!url) return

    const pool = Array.from(new Set(
      (poolInput.length ? poolInput : [url])
        .map(item => item.trim())
        .filter(Boolean)
    ))

    const index = pool.indexOf(url)

    setChatImagePreview({
      images: pool.length ? pool : [url],
      startIndex: index >= 0 ? index : 0
    })
  }

  function openAppointmentShareDetails(appointment: ShowcaseChatAppointmentShare): void {
    setAppointmentDetailsItem(chatAppointmentShareToCard(appointment))
  }

  const [chatIsNearBottom, setChatIsNearBottom] = React.useState(true)

  const chatScrollKey = [
    state.messages[state.messages.length - 1]?.id || 'empty',
    previewDraftImages.length,
    state.pendingProduct?.dishId || 'no-product',
    state.pendingAppointment?.appointmentId || 'no-appointment',
    state.quotedMessageId || 'no-quote'
  ].join('|')

  const chatPreserveScrollAnchorKey = [
    state.messages[0]?.id || 'empty',
    state.messages.length
  ].join('|')

  const chatHasPendingMessageJump = Boolean(
    state.scrollToMessageId?.trim() &&
    state.scrollToMessageSignal
  )

  const chatShouldBlockAutoScrollToBottom = Boolean(
    state.windowMode === 'aroundMessage' ||
    chatHasPendingMessageJump
  )

  const chatShouldAutoScrollToBottom = Boolean(
    chatIsNearBottom &&
    !chatShouldBlockAutoScrollToBottom
  )

  function handleChatContentScroll(event: React.UIEvent<HTMLElement>): void {
    const element = event.currentTarget
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    const isNearBottom = distanceFromBottom <= 120

    setChatIsNearBottom(isNearBottom)

    ndjcHandleLoadOlderScroll(
      event,
      state.pagination,
      actions.onLoadOlderMessages
    )

    if (
      state.windowMode === 'aroundMessage' &&
      state.hasNewerMessages &&
      !state.isLoadingNewerMessages &&
      isNearBottom
    ) {
      void Promise.resolve(actions.onLoadNewerMessages())
    }
  }

  React.useLayoutEffect(() => {
    const targetId = state.scrollToMessageId?.trim()

    if (!targetId || !state.scrollToMessageSignal) return

    let cancelled = false

    const scrollToTarget = () => {
      if (cancelled) return

      const target = document.getElementById(`chat-message-${targetId}`)
      if (!target) return

      target.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      })
    }

    scrollToTarget()

    const frameId = window.requestAnimationFrame(() => {
      scrollToTarget()

      window.requestAnimationFrame(scrollToTarget)
    })

    const timeoutId = window.setTimeout(scrollToTarget, 120)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [state.scrollToMessageId, state.scrollToMessageSignal, state.messages.length])

  React.useEffect(() => {
    const targetId = state.flashMessageId?.trim()

    if (!targetId || !state.flashSignal) return

    setActiveFlashMessageId(targetId)

    const timeoutId = window.setTimeout(() => {
      setActiveFlashMessageId(current => current === targetId ? null : current)
    }, 950)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [state.flashMessageId, state.flashSignal])

  React.useEffect(() => {
    if (!activeMessageMenuId) return

    function handleDocumentPointerDown(event: PointerEvent): void {
      const target = event.target instanceof HTMLElement ? event.target : null
      if (!target) return

      if (target.closest('[data-ndjc-chat-message-menu="true"]')) return

      setActiveMessageMenuId(null)
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
    }
  }, [activeMessageMenuId])

  React.useEffect(() => {
    setActiveMessageMenuId(null)
  }, [
    state.messages.length,
    state.selectionMode,
    state.focusedMessageId,
    state.findQuery,
    state.scrollToMessageId
  ])

  function quoteProductFor(message: ShowcaseChatMessage): ShowcaseChatProductShare | null {
    const directQuotePreview = String(message.quotePreviewText || '').trim()
    const parsedQuoteProduct = directQuotePreview
      ? parseNdjcProductBlock(directQuotePreview)
      : null

    if (parsedQuoteProduct) {
      return chatProductShareFromParsedProduct(parsedQuoteProduct)
    }

    const quotedId = message.quotedMessageId?.trim()
    if (!quotedId) return null

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage?.product) return null

    return quotedMessage.product
  }

  function quotePreviewFor(message: ShowcaseChatMessage): string {
    const directQuotePreview = String(message.quotePreviewText || '').trim()
    const directQuoteProduct = directQuotePreview
      ? parseNdjcProductBlock(directQuotePreview)
      : null

    if (directQuoteProduct) return directQuoteProduct.title || 'Shared item'
    if (directQuotePreview) return directQuotePreview

    const quotedId = message.quotedMessageId?.trim()
    if (!quotedId) return ''

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage) return ''

    return quotePreviewTextFromMessage(quotedMessage)
  }

  function composerQuoteProduct(): ShowcaseChatProductShare | null {
    const quotedId = state.quotedMessageId?.trim()
    if (!quotedId) return null

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage?.product) return null

    return quotedMessage.product
  }

  function composerQuotePreviewText(): string {
    const quotedId = state.quotedMessageId?.trim()
    if (!quotedId) return ''

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage) return 'Selected message'

    return quotePreviewTextFromMessage(quotedMessage)
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-keyboard-shell"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <NdjcConversationPageScaffold
        wrapWithUnifiedBackground={false}
        showTopBar
        title={state.title}
        subtitle={undefined}
        actions={actions}
        className="ndjc-chat-thread-screen"
        isSelectionMode={state.selectionMode}
        selectedCount={state.selectedMessageIds.length}
        contentPaddingTop={12}
        contentPaddingBottom={0}
        contentPaddingX={APK_CHAT_UI.bodyPaddingX}
        verticalItemSpacing={APK_CHAT_UI.messageRowGap}
        contentScrollKey={chatScrollKey}
        contentAutoScrollToBottom={chatShouldAutoScrollToBottom}
        contentForceScrollToBottomSignal={state.scrollToBottomSignal}
        contentPreserveScrollAnchorKey={chatPreserveScrollAnchorKey}
        contentTrailingSpacerHeight={APK_CHAT_UI.chatBubbleToDividerGap}
        onContentScroll={handleChatContentScroll}
        topBarActions={
          state.selectionMode ? (
            <>
              <button
                type="button"
                style={{
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: APK_CHAT_UI.danger,
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onDeleteSelected}
                aria-label="Delete Selected"
              >
                ×
              </button>

              <button
                type="button"
                style={{
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: APK_CHAT_UI.black65,
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onExitSelection}
                aria-label="Exit Selection"
              >
                ✕
              </button>
            </>
          ) : null
        }

        footer={
          <section
            className="ndjc-chat-composer-column"
            style={{
              width: '100%',
              minWidth: 0,
              padding: `${APK_CHAT_UI.composerTopPadding}px ${APK_CHAT_UI.footerPaddingX}px calc(${APK_CHAT_UI.composerBottomPadding}px + env(safe-area-inset-bottom))`,
              display: 'grid',
              gap: 8,
              background: APK_CHAT_UI.pageBg,
              borderTop: '1px solid rgba(0, 0, 0, 0.10)',
              boxSizing: 'border-box'
            }}
          >
          {state.selectionMode ? (
            <section
              className="ndjc-chat-selection-footer"
              style={{
                width: '100%',
                height: 52,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <button
                type="button"
                style={{
                  width: 40,
                  height: 40,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#ffffff',
                  background: APK_CHAT_UI.danger,
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onDeleteSelected}
                aria-label="Delete selected"
              >
                ×
              </button>
            </section>
          ) : (
            <>
              {state.quotedMessageId ? (
                composerQuoteProduct() ? (
                  <NdjcComposerProductQuoteBar
                    product={composerQuoteProduct() as ShowcaseChatProductShare}
                    available={
                      actions.isProductAvailable
                        ? actions.isProductAvailable((composerQuoteProduct() as ShowcaseChatProductShare).dishId)
                        : true
                    }
                    onCancel={actions.onCancelQuote}
                    onClick={() => {
                      const product = composerQuoteProduct()
                      if (product) {
                        actions.onOpenProductDetail(product.dishId)
                      }
                    }}
                  />
                ) : (
                  <NdjcComposerTextQuoteBar
                    text={composerQuotePreviewText()}
                    onCancel={actions.onCancelQuote}
                    onClick={() => actions.onJumpToMessage(state.quotedMessageId || '')}
                  />
                )
              ) : null}

              {previewDraftImages.length ? (
                <section
                  ref={draftImageRowRef}
                  className="ndjc-chat-draft-image-row"
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: 10,
                    paddingBottom: 10,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x',
                    cursor: previewDraftImages.length > 1 ? 'grab' : 'default',
                    userSelect: 'none'
                  }}
                  onPointerDown={handleDraftImageRowPointerDown}
                  onPointerMove={handleDraftImageRowPointerMove}
                  onPointerUp={handleDraftImageRowPointerEnd}
                  onPointerCancel={handleDraftImageRowPointerEnd}
                  onPointerLeave={handleDraftImageRowPointerEnd}
                >
                  {previewDraftImages.map((url, index) => (
                    <span
                      key={`${url}-${index}`}
                      style={{
                        position: 'relative',
                        width: APK_CHAT_UI.draftPreviewSize,
                        minWidth: APK_CHAT_UI.draftPreviewSize,
                        height: APK_CHAT_UI.draftPreviewSize,
                        borderRadius: APK_CHAT_UI.draftPreviewCorner,
                        display: 'block',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.10)',
                        background: 'rgba(255, 255, 255, 0.92)',
                        boxShadow: 'none'
                      }}
                    >
                      <button
                        type="button"
                        data-draft-image-preview-url={url}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 0,
                          padding: 0,
                          display: 'block',
                          background: 'transparent',
                          boxShadow: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (shouldSuppressDraftImageClick()) return

                          openChatImagePreview(url, previewDraftImages)
                        }}
                        aria-label="Preview draft image"
                      >
                        <NdjcShimmerImage
                          src={url}
                          alt="Draft image"
                          placeholderCornerRadius={APK_CHAT_UI.draftPreviewCorner}
                          contentScale="cover"
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                        />
                      </button>

                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: APK_CHAT_UI.draftPreviewRemoveButtonSize,
                          height: APK_CHAT_UI.draftPreviewRemoveButtonSize,
                          border: 0,
                          borderRadius: 999,
                          padding: 0,
                          display: 'grid',
                          placeItems: 'center',
                          color: APK_CHAT_UI.white,
                          background: 'rgba(0, 0, 0, 0.55)',
                          boxShadow: 'none',
                          fontSize: APK_CHAT_UI.draftPreviewRemoveIconSize,
                          lineHeight: 1,
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                        onPointerDown={event => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onPointerUp={event => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onClick={event => {
                          event.preventDefault()
                          event.stopPropagation()
                          actions.onRemoveDraftImage(url)
                        }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>

                      {previewDraftImages.length > 1 ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: 4,
                            bottom: 4,
                            borderRadius: APK_CHAT_UI.draftPreviewCountRadius,
                            padding: `${APK_CHAT_UI.draftPreviewCountPaddingY}px ${APK_CHAT_UI.draftPreviewCountPaddingX}px`,
                            color: APK_CHAT_UI.white,
                            background: 'rgba(0, 0, 0, 0.45)',
                            fontSize: 11,
                            lineHeight: 1.2,
                            fontWeight: 500
                          }}
                        >
                          {index + 1}/{previewDraftImages.length}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </section>
              ) : null}

              {state.pendingProduct ? (
                <NdjcPendingProductBar
                  product={state.pendingProduct}
                  available={actions.isProductAvailable(state.pendingProduct.dishId)}
                  onOpen={actions.onOpenProductDetail}
                  onSend={actions.onSendPendingProduct}
                  onClear={actions.onClearPendingProduct}
                />
              ) : null}

              {state.pendingAppointment ? (
                <NdjcPendingAppointmentBar
                  appointment={state.pendingAppointment}
                  onOpen={openAppointmentShareDetails}
                  onSend={actions.onSendPendingAppointment}
                  onClear={actions.onClearPendingAppointment}
                />
              ) : null}

              {state.statusMessage?.trim() ? (
                <p
                  className="ndjc-chat-composer-status-message"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    margin: 0,
                    color: APK_CHAT_UI.danger,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxSizing: 'border-box'
                  }}
                >
                  {state.statusMessage}
                </p>
              ) : null}

              <section
                className="ndjc-chat-composer-row"
                style={{
                  position: 'relative',
                  width: '100%',
                  minWidth: 0,
                  display: 'grid',
                  gridTemplateColumns: `${APK_CHAT_UI.attachButtonSize}px minmax(0, 1fr) ${APK_CHAT_UI.toolButtonWidth}px`,
                  gap: 8,
                  alignItems: 'end',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  ref={photoLibraryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handlePhotoLibraryChange}
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleCameraCaptureChange}
                />

                <button
                  ref={plusMenuButtonRef}
                  type="button"
                  style={{
                    width: APK_CHAT_UI.attachButtonSize,
                    height: APK_CHAT_UI.attachButtonSize,
                    border: 0,
                    borderRadius: 999,
                    padding: 0,
                    display: 'grid',
                    placeItems: 'center',
                    color: APK_CHAT_UI.black65,
                    background: 'transparent',
                    boxShadow: 'none',
                    lineHeight: 1
                  }}
                  onClick={() => setPlusMenuExpanded(value => !value)}
                  aria-expanded={plusMenuExpanded}
                  aria-label="Attachments"
                >
                  <svg
                    width={APK_CHAT_UI.attachIconSize}
                    height={APK_CHAT_UI.attachIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.25 12.75L14.95 6.05C16.25 4.75 18.35 4.75 19.65 6.05C20.95 7.35 20.95 9.45 19.65 10.75L10.65 19.75C8.55 21.85 5.15 21.85 3.05 19.75C0.95 17.65 0.95 14.25 3.05 12.15L12.35 2.85"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {plusMenuExpanded ? (
                  <section
                    ref={plusMenuPanelRef}
                    className="ndjc-chat-plus-menu"
                    style={apkChatPlusMenuStyle}
                  >
                    {state.canTogglePinned ? (
                      <button
                        type="button"
                        style={apkChatPlusMenuItemStyle(false)}
                        onClick={() => {
                          setPlusMenuExpanded(false)
                          actions.onTogglePinned()
                        }}
                      >
                        {state.pinned ? 'Unpin chat' : 'Pin chat'}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        setPlusMenuExpanded(false)
                        actions.onOpenMediaGallery()
                      }}
                    >
                      View photos
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        setPlusMenuExpanded(false)
                        actions.onOpenSearchResults()
                      }}
                    >
                      Search messages
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        openPhotoLibrary()
                      }}
                    >
                      Photo library
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        actions.onOpenCamera()
                        openCameraCapture()
                      }}
                    >
                      Camera
                    </button>
                  </section>
                ) : null}

                <span
                  className="ndjc-chat-input-surface"
                  style={apkChatInputShellStyle}
                >
                  <textarea
                    ref={chatComposerTextareaRef}
                    className="ndjc-chat-input"
                    style={apkChatTextareaStyle}
                    value={state.draft}
                    placeholder={state.inputPlaceholder || 'Message'}
                    onChange={event => {
                      resizeChatComposerTextarea(event.currentTarget)
                      actions.onDraftChange(event.currentTarget.value)
                    }}
                    rows={1}
                  />
                </span>

                <button
                  type="button"
                  style={{
                    width: APK_CHAT_UI.toolButtonWidth,
                    minWidth: APK_CHAT_UI.toolButtonWidth,
                    maxWidth: APK_CHAT_UI.toolButtonWidth,
                    height: APK_CHAT_UI.toolButtonHeight,
                    minHeight: APK_CHAT_UI.toolButtonHeight,
                    maxHeight: APK_CHAT_UI.toolButtonHeight,
                    border: 0,
                    borderRadius: APK_CHAT_UI.toolButtonRadius,
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    placeItems: 'center',
                    color: canSend ? NDJC_GLOBAL_UI_TOKENS.colors.surface : NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
                    background: canSend ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis : NDJC_GLOBAL_UI_TOKENS.colors.controlDisabledSurface,
                    boxShadow: canSend ? '0 2px 6px rgba(0, 0, 0, 0.10)' : 'none',
                    fontSize: 14,
                    lineHeight: 1,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    opacity: 1,
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                  disabled={!canSend}
                  onClick={() => {
                    if (!canSend) return
                    actions.onSend()
                  }}
                >
                  {state.isSending ? (
                    <NdjcSpinner size={16} stroke={2} tone="light" />
                  ) : (
                    <span
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        placeItems: 'center',
                        lineHeight: 1,
                        textAlign: 'center'
                      }}
                    >
                      Send
                    </span>
                  )}
                </button>
              </section>
            </>
          )}
        </section>
        }
      >
      <style>
        {`
          @keyframes ndjc-chat-message-flash {
            0% {
              filter: brightness(1);
              transform: scale(1);
            }
            18% {
              filter: brightness(1.08);
              transform: scale(1.018);
            }
            38% {
              filter: brightness(1);
              transform: scale(1);
            }
            58% {
              filter: brightness(1.08);
              transform: scale(1.014);
            }
            100% {
              filter: brightness(1);
              transform: scale(1);
            }
          }
        `}
      </style>

      <ChatFindBar state={state} actions={actions} />

      <NdjcPaginationFooter
        pagination={state.pagination}
        idleText="Load earlier messages"
        loadingText="Loading earlier messages..."
        endText=""
        onLoadMore={actions.onLoadOlderMessages}
      />

      {state.messages.length ? (
        state.messages.map((message, index) => {
          const currentKey = minuteKey(message.createdAtText)
          const previousKey = index > 0 ? minuteKey(state.messages[index - 1].createdAtText) : ''
          const showMinuteHeader = currentKey && currentKey !== previousKey

          return (
            <React.Fragment key={message.id}>
              {showMinuteHeader ? (
                <NdjcConversationTimePill text={timeHeaderText(message.createdAtText)} />
              ) : null}

              <ChatMessageBubble
                message={message}
                actions={actions}
                quotePreviewText={quotePreviewFor(message)}
                quoteProduct={quoteProductFor(message)}
                imagePreviewPool={allThreadImageUrls}
                selectionMode={state.selectionMode}
                focused={state.focusedMessageId === message.id}
                matched={state.findResultIds.includes(message.id)}
                flashing={activeFlashMessageId === message.id}
                menuOpen={activeMessageMenuId === message.id}
                onOpenMenu={() => setActiveMessageMenuId(message.id)}
                onCloseMenu={() => setActiveMessageMenuId(current => current === message.id ? null : current)}
                onOpenImagePreview={openChatImagePreview}
                onOpenAppointmentDetail={openAppointmentShareDetails}
              />
            </React.Fragment>
          )
        })
      ) : null}

      {state.windowMode === 'aroundMessage' ? (
        <NdjcPaginationFooter
          pagination={{
            hasMore: state.hasNewerMessages,
            isLoadingMore: state.isLoadingNewerMessages
          }}
          idleText="Load newer messages"
          loadingText="Loading newer messages..."
          endText=""
          onLoadMore={actions.onLoadNewerMessages}
        />
      ) : null}

      {chatImagePreview ? (
        <NdjcFullscreenImageViewerScreen
          images={chatImagePreview.images}
          startIndex={chatImagePreview.startIndex}
          onDismiss={() => setChatImagePreview(null)}
          onSave={actions.onSavePreviewImage}
        />
      ) : null}

      <CustomerBookingDetailsBottomSheet
        item={appointmentDetailsItem}
        onClose={closeAppointmentDetailsSheet}
        onOpenProduct={actions.onOpenProductDetail}
        onCopy={actions.onCopy}
      />
    </NdjcConversationPageScaffold>
  </NdjcUnifiedBackground>
  )
}
export function ShowcaseMerchantChatList({
  threads,
  searchQuery,
  refreshing,
  pagination,
  actions
}: {
  threads: ShowcaseChatThreadSummaryUi[]
  searchQuery: string
  refreshing: boolean
  pagination: ShowcasePaginationUiState
  actions: ShowcaseMerchantChatListActions
}) {
  return (
    <ShowcaseMerchantChatListScreen
      threads={threads}
      searchQuery={searchQuery}
      refreshing={refreshing}
      pagination={pagination}
      actions={actions}
    />
  )
}

export function ShowcaseChatMedia({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatMediaActions
}) {
  const [preview, setPreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const chatMediaListPaddingX = '25px'
  const chatMediaExpandedHeaderContentHeight = 80
  const chatMediaCollapsedHeaderContentHeight = 30
  const {
    collapsed: chatMediaHeaderCollapsed,
    headerRef,
    headerBottomPadding: chatMediaHeaderBottomPadding,
    headerTotalHeight: chatMediaHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: chatMediaExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: chatMediaCollapsedHeaderContentHeight,
    measureKey: [
      state.mediaItems.length,
      state.mediaPagination.isLoadingMore,
      state.mediaPagination.hasMore
    ].join('|')
  })

  const mediaItems = state.mediaItems

  const mediaByDate = React.useMemo(() => {
    const grouped = new Map<string, typeof mediaItems>()

    mediaItems.forEach(item => {
      const current = grouped.get(item.dayKey) || []
      current.push(item)
      grouped.set(item.dayKey, current)
    })

    return Array.from(grouped.entries()).sort((left, right) => right[0].localeCompare(left[0]))
  }, [mediaItems])

  const allImagesSorted = React.useMemo(() => {
    return mediaItems.map(item => item.url)
  }, [mediaItems])

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-media-gallery-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-chat-media-gallery-shell"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-chat-media-gallery-list-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            minHeight: 0,
            background: '#e9efed',
            padding: `${listTopPadding}px ${chatMediaListPaddingX} calc(var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px) + ${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px)`,
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
              state.mediaPagination,
              actions.onLoadMoreMediaItems
            )
          }}
        >
          {mediaItems.length > 0 ? (
            <section
              className="ndjc-chat-media-gallery-groups"
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
              }}
            >
              {mediaByDate.map(([dayKey, itemsInDay]) => (
                <section
                  key={dayKey}
                  className="ndjc-chat-media-gallery-group"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
                  }}
                >
                  <section
                    style={{
                      width: 'fit-content',
                      minHeight: 28,
                      borderRadius: NDJC_ADMIN_TOOL_UI.segmentedOuterRadius,
                      padding: '0 10px',
                      boxSizing: 'border-box',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                      background: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft
                    }}
                  >
                    <span
                      style={{
                        color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
                        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                        fontWeight: 600,
                        display: 'block'
                      }}
                    >
                      {dayKey}
                    </span>
                  </section>

                  <section
                    className="ndjc-chat-media-gallery-grid"
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
                    }}
                  >
                    {itemsInDay.map(item => {
                      const startIndex = allImagesSorted.indexOf(item.url)

                      return (
                        <button
                          key={`${item.messageId}-${item.url}`}
                          type="button"
                          className="ndjc-chat-media-gallery-tile"
                          style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
                            borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
                            padding: 0,
                            display: 'block',
                            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
                            background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
                            boxShadow: 'none',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transform: 'scale(1)',
                            transition: 'transform 120ms ease, border-color 120ms ease'
                          }}
                          onPointerDown={event => {
                            event.currentTarget.style.transform = 'scale(0.97)'
                            event.currentTarget.style.borderColor = `rgba(43, 48, 51, 0.18)`
                          }}
                          onPointerUp={event => {
                            event.currentTarget.style.transform = 'scale(1)'
                            event.currentTarget.style.borderColor = NDJC_GLOBAL_UI_TOKENS.colors.divider
                          }}
                          onPointerCancel={event => {
                            event.currentTarget.style.transform = 'scale(1)'
                            event.currentTarget.style.borderColor = NDJC_GLOBAL_UI_TOKENS.colors.divider
                          }}
                          onPointerLeave={event => {
                            event.currentTarget.style.transform = 'scale(1)'
                            event.currentTarget.style.borderColor = NDJC_GLOBAL_UI_TOKENS.colors.divider
                          }}
                          onClick={() => {
                            setPreview({
                              images: allImagesSorted,
                              startIndex: startIndex >= 0 ? startIndex : 0
                            })
                          }}
                        >
                          <NdjcShimmerImage
                            src={item.url}
                            alt="Shared photo"
                            placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.catalogCardRadius}
                            contentScale="cover"
                          />
                        </button>
                      )
                    })}
                  </section>
                </section>
              ))}

              <NdjcPaginationFooter
                pagination={state.mediaPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText="No more photos"
                onLoadMore={actions.onLoadMoreMediaItems}
              />
            </section>
          ) : !state.mediaPagination.isLoadingMore ? (
            <section
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
                title="No photos yet"
                message="Photos shared here will appear automatically."
                verticalPadding={0}
              />
            </section>
          ) : (
            <section
              style={{
                width: '100%',
                maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
                margin: '0 auto'
              }}
            >
              <NdjcPaginationFooter
                pagination={state.mediaPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText=""
                onLoadMore={actions.onLoadMoreMediaItems}
              />
            </section>
          )}
        </section>

        <section
          className="ndjc-chat-media-gallery-header-card"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: chatMediaHeaderHeight,
            boxSizing: 'border-box',
            background: APK_SHELL_UI.pageBg,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${chatMediaHeaderBottomPadding}px`,
            overflow: 'hidden',
            transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-chat-media-gallery-header-column"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              margin: '0 auto',
              display: 'grid',
              gap: chatMediaHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint,
              transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
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
                transform: chatMediaHeaderCollapsed
                  ? 'translateY(-3px) scale(0.78)'
                  : 'translateY(0) scale(1)',
                willChange: 'transform',
                transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              Shared photos
            </h1>

            <p
              style={{
                margin: 0,
                height: chatMediaHeaderCollapsed ? 0 : 21,
                color: APK_EDIT_ITEM_UI.body70,
                fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                opacity: chatMediaHeaderCollapsed ? 0 : 1,
                overflow: 'hidden',
                transform: chatMediaHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                willChange: 'opacity, transform',
                transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              Images exchanged in this conversation.
            </p>

            <p
              style={{
                margin: 0,
                height: chatMediaHeaderCollapsed ? 0 : 17,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                opacity: chatMediaHeaderCollapsed ? 0 : 1,
                overflow: 'hidden',
                transform: chatMediaHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                willChange: 'opacity, transform',
                transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              {mediaItems.length} photos
            </p>
          </section>
        </section>
      </section>

      {preview ? (
        <NdjcFullscreenImageViewerScreen
          images={preview.images}
          startIndex={preview.startIndex}
          onDismiss={() => setPreview(null)}
          onSave={actions.onSavePreviewImage}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}
