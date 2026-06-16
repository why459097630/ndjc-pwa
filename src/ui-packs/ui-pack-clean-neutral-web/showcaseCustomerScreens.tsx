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
  selectStoreLogoPreviewUrl,
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
  NdjcPasswordVisibilityToggle,
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

export function ShowcaseDishDetail({
  state,
  actions
}: {
  state: ShowcaseDetailUiState
  actions: ShowcaseDetailActions
}) {
  return <DetailScreen state={state} actions={actions} />
}

export function ShowcaseLogin({
  state,
  actions
}: {
  state: ShowcaseLoginUiState
  actions: ShowcaseLoginActions
}) {
  return <LoginScreen state={state} actions={actions} />
}
export function ShowcaseFavorites({
  state,
  actions
}: {
  state: ShowcaseFavoritesUiState
  actions: ShowcaseFavoritesActions
}) {
  return <ShowcaseFavoritesScreen state={state} actions={actions} />
}
export function PlaceholderScreen({
  title,
  actions
}: {
  title: string
  actions?: BackHomeActions
}) {
  return (
    <ScreenScaffold
      title={title}
      subtitle="This screen will be connected in the next UI pass."
      actions={actions}
    >
      <EmptyState
        title={title}
        message="The renderer route is ready. The APK-matched layout will replace this placeholder."
      />
    </ScreenScaffold>
  )
}

function DishCard({
  dish,
  onOpen
}: {
  dish: DemoDish
  onOpen: (id: string) => void
}) {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = dish.discountPrice
  const safeOriginalPrice = Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : 0
  const hasDiscount =
    typeof discountPrice === 'number' &&
    discountPrice > 0 &&
    discountPrice < safeOriginalPrice
  const primaryText = hasDiscount ? priceText(discountPrice) : priceText(safeOriginalPrice)
  const secondaryText = hasDiscount ? priceText(safeOriginalPrice) : null

  return (
    <NdjcHomeStyleMediaCard
      title={titleForDish(dish)}
      imageUrl={dishImage(dish)}
      primaryText={primaryText}
      secondaryText={secondaryText}
      badgeText={dish.isRecommended ? APK_SHOWCASE_ITEM_UI.homeBadgeText : null}
      onClick={() => onOpen(dish.id)}
      trailingOverlay={
        dish.isFavorite ? (
          <span
            className="ndjc-apk-dish-fav is-active"
            style={apkHomeFavoriteIconStyle}
            aria-hidden="true"
          >
            ♥
          </span>
        ) : null}
    />
  )
}
export function ShowcaseHome({
  state,
  actions
}: {
  state: ShowcaseHomeUiState
  actions: ShowcaseHomeActions
}) {
  const rows: ShowcaseHomeDish[][] = []
  const [snackbarVisible, setSnackbarVisible] = React.useState(false)
  const [homeDraftRecommendedOnly, setHomeDraftRecommendedOnly] = React.useState(state.filterRecommendedOnly)
  const [homeDraftOnSaleOnly, setHomeDraftOnSaleOnly] = React.useState(state.filterOnSaleOnly)
  const [homeDraftPriceMin, setHomeDraftPriceMin] = React.useState(state.priceMinDraft)
  const [homeDraftPriceMax, setHomeDraftPriceMax] = React.useState(state.priceMaxDraft)

  React.useEffect(() => {
    setSnackbarVisible(Boolean(state.statusMessage?.trim()))
  }, [state.statusMessage])

  React.useEffect(() => {
    if (!state.showFilterMenu) {
      setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
      setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
      setHomeDraftPriceMin(state.priceMinDraft)
      setHomeDraftPriceMax(state.priceMaxDraft)
    }
  }, [state.showFilterMenu, state.filterRecommendedOnly, state.filterOnSaleOnly, state.priceMinDraft, state.priceMaxDraft])

  for (let index = 0; index < state.dishes.length; index += 2) {
    rows.push(state.dishes.slice(index, index + 2))
  }

  const filterActive = state.filterRecommendedOnly
    || state.filterOnSaleOnly
    || state.appliedMinPrice != null
    || state.appliedMaxPrice != null

  return (
    <NdjcUnifiedBackground
      snackbar={
        <NdjcSnackbarHost
          message={snackbarVisible ? state.statusMessage : null}
          onDismiss={() => setSnackbarVisible(false)}
        />
      }
    >
      <NdjcCustomerPullRefreshContainer
        refreshing={state.isLoading}
        onRefresh={actions.onRefresh}
      >
        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

        <section
          className="ndjc-apk-home ndjc-apk-home-web-scaffold"
          style={apkHomeRootStyle}
          data-web-equivalent="compose-scaffold"
        >
          <section className="ndjc-apk-home-controls" style={apkHomeControlsStyle}>
            <section
              className="ndjc-home-search-admin-row"
              style={{
                width: '100%',
                padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px`,
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 48px',
                gap: APK_EDIT_ITEM_UI.fieldGap,
                alignItems: 'end'
              }}
            >
              <NdjcTextField
                value={state.searchQuery}
                onChange={actions.onSearchQueryChange}
                placeholder="Search by item name"
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

              <NdjcFilterIconButton
                label="Open store admin"
                onClick={actions.onProfileClick}
                icon={(
                  <NdjcTopSearchStorefrontIcon />
                )}
              />
            </section>

            <div style={apkHomeControlsGapStyle} aria-hidden="true" />

            <section
              className="ndjc-home-sort-filter-row"
              style={{
                width: '100%',
                padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px`,
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 48px',
                gap: APK_EDIT_ITEM_UI.fieldGap,
                alignItems: 'center'
              }}
            >
              <SortRow
                columns={3}
                variant="segmented"
                ariaLabel="Sort home items"
              >
                <SortNavEqualItem
                  text="Default"
                  selected={state.sortMode === 'Default'}
                  onClick={() => actions.onSortModeChange('Default')}
                  variant="segmented"
                />

                <SortNavEqualItem
                  text="Low–High"
                  selected={state.sortMode === 'PriceAsc'}
                  onClick={() => actions.onSortModeChange('PriceAsc')}
                  variant="segmented"
                />

                <SortNavEqualItem
                  text="High–Low"
                  selected={state.sortMode === 'PriceDesc'}
                  onClick={() => actions.onSortModeChange('PriceDesc')}
                  variant="segmented"
                />
              </SortRow>

              <NdjcFilterIconButton
                active={filterActive}
                label="Open item filters"
                onClick={() => {
                  setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
                  setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
                  setHomeDraftPriceMin(state.priceMinDraft)
                  setHomeDraftPriceMax(state.priceMaxDraft)
                  actions.onShowFilterMenuChange(true)
                }}
              />
            </section>

            <section style={apkHomeCategoryWrapStyle}>
              <CategoryChipsRow
                selectedCategory={state.selectedCategory}
                manualCategories={state.manualCategories}
                onCategorySelected={actions.onCategorySelected}
                showAllChip
                useOuterHorizontalPadding={false}
              />
            </section>
          </section>

          <NdjcFilterBottomSheet
            open={state.showFilterMenu}
            title="Filter"
            clearText="Clear"
            applyText="Apply"
            priceMinDraft={homeDraftPriceMin}
            onPriceMinDraftChange={setHomeDraftPriceMin}
            priceMaxDraft={homeDraftPriceMax}
            onPriceMaxDraftChange={setHomeDraftPriceMax}
            showPriceFields
            showHeaderDivider={false}
            onClose={() => {
              setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
              setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
              setHomeDraftPriceMin(state.priceMinDraft)
              setHomeDraftPriceMax(state.priceMaxDraft)
              actions.onShowFilterMenuChange(false)
            }}
            onClear={() => {
              setHomeDraftRecommendedOnly(false)
              setHomeDraftOnSaleOnly(false)
              setHomeDraftPriceMin('')
              setHomeDraftPriceMax('')
            }}
            onApply={() => {
              actions.onApplyHomeFilters({
                recommendedOnly: homeDraftRecommendedOnly,
                onSaleOnly: homeDraftOnSaleOnly,
                minPriceDraft: homeDraftPriceMin,
                maxPriceDraft: homeDraftPriceMax
              })
            }}
          >
            <NdjcToggleRow
              label="Pick"
              checked={homeDraftRecommendedOnly}
              onCheckedChange={setHomeDraftRecommendedOnly}
            />

            <NdjcToggleRow
              label="On sale"
              checked={homeDraftOnSaleOnly}
              onCheckedChange={setHomeDraftOnSaleOnly}
            />
          </NdjcFilterBottomSheet>

          <section
            className="ndjc-apk-home-grid"
            style={{
              ...apkHomeListStyle,
              alignContent: rows.length ? 'start' : 'stretch',
              gridTemplateRows: rows.length ? undefined : 'minmax(0, 1fr)'
            }}
            onScroll={event => ndjcHandleLoadMoreScroll(
              event,
              state.pagination,
              actions.onLoadMore
            )}
          >
            {rows.length ? (
              <>
                {rows.map((row, rowIndex) => (
                  <div
                    key={`home-row-${rowIndex}`}
                    className="ndjc-apk-home-grid-row"
                    style={apkHomeGridRowStyle}
                  >
                    <DishListCard
                      dish={row[0]}
                      onOpen={actions.onDishSelected}
                      priorityImage={rowIndex === 0}
                    />

                    {row[1] ? (
                      <DishListCard
                        dish={row[1]}
                        onOpen={actions.onDishSelected}
                        priorityImage={rowIndex === 0}
                      />
                    ) : (
                      <div className="ndjc-apk-dish-card-placeholder" style={apkHomeGridPlaceholderStyle} />
                    )}
                  </div>
                ))}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more items"
                  onLoadMore={actions.onLoadMore}
                />
              </>
            ) : (
              <NdjcInlineEmptyState
                title="No items yet"
                message="Items will appear here after the business adds them."
                verticalPadding={0}
                fillParentMaxSize
              />
            )}
          </section>
        </section>

      </NdjcCustomerPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

export function DetailScreen({
  state,
  actions
}: {
  state: ShowcaseDetailUiState
  actions: ShowcaseDetailActions
}) {
  const cleanImages = state.imageUrls.map(url => url.trim()).filter(Boolean)
  const safeStartIndex = cleanImages.length
    ? Math.min(Math.max(state.safeImageIndex, 0), cleanImages.length - 1)
    : 0
  const imageStripRef = React.useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(safeStartIndex)
  const [descExpanded, setDescExpanded] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  React.useEffect(() => {
    if (!cleanImages.length) {
      setCurrentIndex(0)
      return
    }

    const nextIndex = safeStartIndex
    setCurrentIndex(nextIndex)

    window.requestAnimationFrame(() => {
      const node = imageStripRef.current
      if (!node) return

      const pageWidth = Math.max(1, node.clientWidth)
      node.scrollLeft = pageWidth * nextIndex
    })
  }, [state.dishId, safeStartIndex, cleanImages.length])

  React.useEffect(() => {
    if (!cleanImages.length) return
    actions.onImageIndexChanged(currentIndex)
  }, [currentIndex, cleanImages.length, actions])

  React.useEffect(() => {
    setDescExpanded(false)
  }, [state.dishId])

  const hasDiscount = Boolean(state.discountPrice?.trim())
  const cleanDescription = state.description.trim()

  return (
<NdjcUnifiedBackground
  topNav={{
    onBack: actions.onBack,
    onHome: actions.onBackToHome,
    iconOnly: true,
    iconTint: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
  }}
>
      <section className="ndjc-apk-detail" style={apkDetailRootStyle}>
        <NdjcSystemBarsTransparent darkIcons />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

        <section className="ndjc-apk-detail-scroll" style={apkDetailScrollStyle}>
          <section className="ndjc-apk-detail-hero" style={apkDetailHeroStyle}>
            {cleanImages.length ? (
              <section
                ref={imageStripRef}
                className="ndjc-apk-detail-image-row"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'stretch',
                  gap: 0,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'auto',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehaviorX: 'contain',
                  touchAction: 'pan-x',
                  boxSizing: 'border-box',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onScroll={event => {
                  const node = event.currentTarget
                  const width = Math.max(1, node.clientWidth)
                  const nextIndex = Math.min(
                    cleanImages.length - 1,
                    Math.max(0, Math.round(node.scrollLeft / width))
                  )

                  if (nextIndex !== currentIndex) {
                    setCurrentIndex(nextIndex)
                  }
                }}
              >
                {cleanImages.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    className="ndjc-apk-detail-image-button"
                    draggable={false}
                    style={{
                      ...apkDetailHeroImageButtonStyle,
                      width: '100%',
                      height: '100%',
                      minWidth: '100%',
                      maxWidth: '100%',
                      flex: '0 0 100%',
                      scrollSnapAlign: 'start',
                      scrollSnapStop: 'always',
                      boxSizing: 'border-box',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onDragStart={event => {
                      event.preventDefault()
                    }}
                    onClick={() => {
                      setImagePreview({
                        images: cleanImages,
                        startIndex: currentIndex
                      })
                    }}
                  >
                    <NdjcShimmerImage
                      className="ndjc-apk-detail-hero-image"
                      src={url}
                      alt={state.title || 'Item image'}
                      placeholderCornerRadius={0}
                      contentScale="cover"
                    />
                  </button>
                ))}
              </section>
            ) : (
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 14,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                No image
              </span>
            )}

            {cleanImages.length > 1 ? (
              <span className="ndjc-apk-detail-counter" style={apkDetailHeroCounterStyle}>
                {currentIndex + 1}/{cleanImages.length}
              </span>
            ) : null}
          </section>

          <section className="ndjc-apk-detail-content" style={apkDetailContentStyle}>
            <div
              className="ndjc-apk-detail-hero-actions"
              style={{
                ...apkDetailHeroActionsStyle,
                gridTemplateColumns: state.canBookAppointment
                  ? 'repeat(2, minmax(0, 1fr))'
                  : 'minmax(0, 1fr)'
              }}
            >
              <NdjcDetailHeroActionButton
                label={state.isFavorite ? 'Saved' : 'Save'}
                ariaLabel={state.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                icon={<DetailFavoriteIcon selected={state.isFavorite} />}
                onClick={actions.onToggleFavorite}
              />

              {state.canBookAppointment ? (
                <NdjcDetailHeroActionButton
                  label="Book"
                  ariaLabel="Book appointment"
                  icon={<NdjcAdminEntryIcon name="appointments" />}
                  onClick={actions.onBookAppointment}
                />
              ) : null}
            </div>
            <section style={apkDetailTitleBlockStyle}>
              {state.isRecommended ? (
                <span style={apkDetailPickBadgeStyle}>
                  <ApkPickBadgeIcon />
                  <span style={apkDetailPickBadgeTextStyle}>
                    Pick
                  </span>
                </span>
              ) : null}

              <h1 style={apkDetailTitleStyle}>
                {state.title}
              </h1>

              <div className="ndjc-apk-detail-price-row" style={apkDetailPriceRowStyle}>
                {hasDiscount ? (
                  <>
                    <strong style={apkDetailPrimaryPriceStyle}>
                      {state.discountPrice}
                    </strong>

                    <span style={apkDetailOriginalPriceStyle}>
                      {state.price}
                    </span>
                  </>
                ) : (
                  <strong style={apkDetailNormalPriceStyle}>
                    {state.price}
                  </strong>
                )}
              </div>


            </section>

            <div style={apkDetailDividerStyle} aria-hidden="true" />

            {cleanDescription ? (
              <section className="ndjc-apk-detail-section" style={apkDetailSectionStyle}>
                <h2 style={apkDetailSectionLabelStyle}>Description</h2>

                <p
                  style={{
                    ...apkDetailDescriptionStyle,
                    display: descExpanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: descExpanded ? undefined : APK_DETAIL_PAGE_UI.descriptionCollapsedLines,
                    WebkitBoxOrient: descExpanded ? undefined : 'vertical',
                    overflow: descExpanded ? 'visible' : 'hidden'
                  }}
                >
                  {cleanDescription}
                </p>

                <button
                  type="button"
                  style={apkDetailShowMoreButtonStyle}
                  onClick={() => setDescExpanded(value => !value)}
                >
                  {descExpanded ? 'Show less' : 'Show more'}
                </button>
              </section>
            ) : null}

            {state.category?.trim() || state.isUnavailable ? (
              <section className="ndjc-apk-detail-section" style={apkDetailSectionStyle}>
                {state.category?.trim() ? (
                  <>
                    <h2 style={apkDetailSectionLabelStyle}>Category</h2>

                    <div style={apkDetailTagsRowStyle}>
                      <NdjcPillButton selected>
                        {state.category}
                      </NdjcPillButton>
                    </div>
                  </>
                ) : null}

                {state.isUnavailable ? (
                  <span
                    style={{
                      color: APK_DETAIL_PAGE_UI.unavailableColor,
                      fontSize: APK_DETAIL_PAGE_UI.unavailableSize,
                      lineHeight: APK_DETAIL_PAGE_UI.unavailableLineHeight,
                      fontWeight: APK_DETAIL_PAGE_UI.unavailableWeight
                    }}
                  >
                    Unavailable
                  </span>
                ) : null}
              </section>
            ) : null}

          </section>
        </section>

        {imagePreview ? (
          <NdjcFullscreenImageViewerScreen
            images={imagePreview.images}
            startIndex={imagePreview.startIndex}
            onDismiss={() => setImagePreview(null)}
            onSave={actions.onSavePreviewImage}
          />
        ) : null}
      </section>
    </NdjcUnifiedBackground>
  )
}

export function LoginScreen({
  state,
  actions
}: {
  state: ShowcaseLoginUiState
  actions: ShowcaseLoginActions
}) {
  const [passwordVisible, setPasswordVisible] = React.useState(false)

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-login-screen"
      topNav={{
        onBack: actions.onBackToHome,
        onHome: actions.onBackToHome
      }}
    >


      <section
        className="ndjc-apk-login-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          minHeight: 0,
          padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px calc(${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom}px + env(safe-area-inset-bottom))`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <section
          className="ndjc-apk-login-card"
          style={{
            width: '100%',
            maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
            alignSelf: 'center',
            boxSizing: 'border-box',
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 0,
            padding: 0
          }}
        >
          <section
            className="ndjc-apk-login-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#2b3033',
                fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                textRendering: 'geometricPrecision'
              }}
            >
              Sign in
            </h1>

            <div style={{ height: APK_EDIT_ITEM_UI.titleToHint, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body70,
                fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight
              }}
            >
              Use your account to manage content and settings.
            </p>

            <div style={{ height: APK_EDIT_ITEM_UI.sectionBottom, flexShrink: 0 }} />

            <NdjcTextField
              value={state.usernameDraft}
              onChange={actions.onUsernameDraftChange}
              label="Email"
              placeholder="Enter email"
              singleLine
              autoComplete="username"
            />

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <NdjcTextField
              value={state.passwordDraft}
              onChange={actions.onPasswordDraftChange}
              label="Password"
              placeholder="Enter password"
              type={passwordVisible ? 'text' : 'password'}
              singleLine
              autoComplete="new-password"
              trailingIcon={
                <NdjcPasswordVisibilityToggle
                  visible={passwordVisible}
                  disabled={state.isLoading}
                  onToggle={() => setPasswordVisible(current => !current)}
                />
              }
            />

            {state.loginError ? (
              <>
                <div style={{ height: 10, flexShrink: 0 }} />

                <p
                  className="ndjc-error-text"
                  style={{
                    margin: 0,
                    color: APK_EDIT_ITEM_UI.error80,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  {state.loginError}
                </p>
              </>
            ) : null}

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcToggleRow
              label="Remember this device"
              checked={state.rememberMe}
              onCheckedChange={actions.onRememberMeChange}
              labelColor={APK_CORE_UI.black}
            />

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonTopGap, flexShrink: 0 }} />

            <NdjcControlPillButton
              active
              tone="adminAction"
              fullWidth
              disabled={!state.canLogin || state.isLoading}
              onClick={() => actions.onLogin(state.usernameDraft, state.passwordDraft)}
            >
              {state.isLoading ? 'Signing in...' : 'Sign in'}
            </NdjcControlPillButton>

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonBottomGap, flexShrink: 0 }} />

            <p
              className="ndjc-apk-login-security-note"
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
              }}
            >
              Access is limited to administrators.
            </p>
          </section>
        </section>
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseStoreProfileView({
  state,
  actions
}: {
  state: ShowcaseStoreProfileUiState
  actions: ShowcaseStoreProfileActions
}) {
  const selectedStoreCoverUrl = state.coverUrl?.trim()
    ? state.coverUrl
    : selectStoreCoverUrl(state) || ''
  const selectedStoreLogoUrl = selectStoreLogoUrl(state) || state.logoUrl
  const selectedStoreLogoPreviewUrl = selectStoreLogoPreviewUrl(state) || selectedStoreLogoUrl

  const covers = selectedStoreCoverUrl
    .replace(/\\n/g, '\n')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 9)

  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const [activeCoverIndex, setActiveCoverIndex] = React.useState(0)
  const coverHorizontalScroll = useNdjcHorizontalDragScroll()

  React.useEffect(() => {
    setActiveCoverIndex(0)
    if (coverHorizontalScroll.scrollRef.current) {
      coverHorizontalScroll.scrollRef.current.scrollLeft = 0
    }
  }, [selectedStoreCoverUrl])

  const handleCoverScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const row = event.currentTarget
    const firstCard = row.querySelector('[data-cover-index="0"]') as HTMLElement | null
    const cardWidth = firstCard?.offsetWidth || APK_STORE_PROFILE_UI.coverCardWidth
    const step = cardWidth + APK_STORE_PROFILE_UI.coverGap
    const nextIndex = Math.max(
      0,
      Math.min(covers.length - 1, Math.round(row.scrollLeft / Math.max(1, step)))
    )

    setActiveCoverIndex(nextIndex)
  }

  function openCoverPreview(images: string[], startIndex: number): void {
    const cleanImages = images
      .map(url => url.trim())
      .filter(Boolean)

    if (!cleanImages.length) return

    setImagePreview({
      images: cleanImages,
      startIndex: Math.max(0, Math.min(startIndex, cleanImages.length - 1))
    })
  }

  const brandInfoDivider = (
    <div
      style={{
        width: '100%',
        height: 1,
        background: NDJC_GLOBAL_UI_TOKENS.colors.divider
      }}
      aria-hidden="true"
    />
  )

  const snackbarMessage =
    state.successMessage ||
    state.errorMessage ||
    state.statusMessage ||
    ''

  const [snackbarVisible, setSnackbarVisible] = React.useState(false)

  React.useEffect(() => {
    setSnackbarVisible(Boolean(snackbarMessage.trim()))
  }, [snackbarMessage])

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome,
        iconOnly: true,
        iconTint: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Store"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <NdjcCustomerPullRefreshContainer
        refreshing={state.isRefreshing}
        onRefresh={actions.onRefresh}
      >
        <section
          className="ndjc-apk-store-profile"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 0,
            background: APK_SHELL_UI.pageBg,
            overflow: 'hidden'
          }}
        >
        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

          <section
            className="ndjc-apk-store-profile-scroll"
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              minHeight: 0,
              padding: `60px ${APK_PAGE_SHELL_UI.screenPadding}px calc(${APK_PAGE_SHELL_UI.noBottomBarReserve}px + 16px)`,
              background: APK_SHELL_UI.pageBg,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorY: 'none',
              overscrollBehaviorX: 'none',
              touchAction: 'auto',
              boxSizing: 'border-box'
            }}
          >
          <section
            className="ndjc-apk-store-cover-layer"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: APK_STORE_PROFILE_UI.coverHeight,
              background: APK_SHELL_UI.pageBg,
              boxSizing: 'border-box'
            }}
          >
            <span
              className="ndjc-apk-store-cover-header-bg"
              style={{
                position: 'absolute',
                left: -APK_PAGE_SHELL_UI.screenPadding,
                right: -APK_PAGE_SHELL_UI.screenPadding,
                top: -60,
                height: APK_STORE_PROFILE_UI.coverHeight + 78,
                zIndex: 0,
                display: 'block',
                background: APK_SHELL_UI.pageBg,
                pointerEvents: 'none'
              }}
              aria-hidden="true"
            />

            {covers.length ? (
              <div
                ref={coverHorizontalScroll.scrollRef}
                className="ndjc-apk-store-cover-row"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 1,
                  width: '100%',
                  height: APK_STORE_PROFILE_UI.coverHeight,
                  borderRadius: APK_SHELL_UI.whiteCardRadius,
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: APK_STORE_PROFILE_UI.coverGap,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x',
                  userSelect: 'none',
                  cursor: covers.length > 1 ? 'grab' : 'pointer',
                  boxSizing: 'border-box',
                  pointerEvents: 'auto',
                  paddingRight: covers.length > 1 ? APK_STORE_PROFILE_UI.coverGap : 0
                }}
                onPointerDown={coverHorizontalScroll.onPointerDown}
                onPointerMove={coverHorizontalScroll.onPointerMove}
                onPointerUp={coverHorizontalScroll.onPointerUp}
                onPointerCancel={coverHorizontalScroll.onPointerCancel}
                onPointerLeave={coverHorizontalScroll.onPointerLeave}
                onScroll={handleCoverScroll}
              >
                {covers.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    data-cover-index={index}
                    className="ndjc-apk-store-cover-card"
                    style={{
                      width: APK_STORE_PROFILE_UI.coverCardWidth,
                      minWidth: APK_STORE_PROFILE_UI.coverCardWidth,
                      height: '100%',
                      border: 0,
                      borderRadius: APK_STORE_PROFILE_UI.coverCardRadius,
                      padding: 0,
                      display: 'block',
                      overflow: 'hidden',
                      background: APK_STORE_PROFILE_UI.softSurface,
                      boxShadow: 'none',
                      transition: 'transform 120ms ease',
                      cursor: 'pointer',
                      touchAction: 'pan-x',
                      userSelect: 'none'
                    }}
                    draggable={false}
                    onDragStart={event => {
                      event.preventDefault()
                    }}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      if (coverHorizontalScroll.shouldSuppressClick()) return
                      openCoverPreview(covers, index)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        if (coverHorizontalScroll.shouldSuppressClick()) return
                        openCoverPreview(covers, index)
                      }
                    }}
                  >
                    <span
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    >
                      <NdjcShimmerImage
                        src={url}
                        alt={`Cover ${index + 1}`}
                        placeholderCornerRadius={APK_STORE_PROFILE_UI.coverCardRadius}
                        contentScale="cover"
                      />

                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.30))',
                          pointerEvents: 'none'
                        }}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="ndjc-apk-store-cover-placeholder-row"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 1,
                  width: '100%',
                  height: APK_STORE_PROFILE_UI.coverHeight,
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 84px',
                  gap: APK_STORE_PROFILE_UI.coverGap,
                  boxSizing: 'border-box'
                }}
              >
                <UniversalStoreCoverPlaceholderCard />
                <UniversalStoreCoverPlaceholderCard />
              </div>
            )}

            {covers.length > 1 ? (
              <span
                className="ndjc-apk-store-cover-count"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: APK_STORE_PROFILE_UI.coverHeight - 30,
                  zIndex: 3,
                  borderRadius: 999,
                  padding: '4px 8px',
                  color: '#FFFFFF',
                  background: 'rgba(0, 0, 0, 0.42)',
                  fontSize: 12,
                  lineHeight: 1,
                  fontWeight: 650,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {Math.min(activeCoverIndex + 1, covers.length)}/{covers.length}
              </span>
            ) : null}

            <span
              className="ndjc-apk-store-cover-info-divider"
              style={{
                position: 'absolute',
                left: -APK_PAGE_SHELL_UI.screenPadding,
                right: -APK_PAGE_SHELL_UI.screenPadding,
                top: APK_STORE_PROFILE_UI.coverHeight + 18,
                zIndex: 2,
                height: 1,
                display: 'block',
                background: NDJC_GLOBAL_UI_TOKENS.colors.divider,
                boxShadow: 'none',
                pointerEvents: 'none'
              }}
              aria-hidden="true"
            />

            <section
              className="ndjc-apk-store-white-card-wrap"
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                paddingTop: APK_STORE_PROFILE_UI.coverHeight + 38,
                boxSizing: 'border-box',
                pointerEvents: 'none'
              }}
            >
              <section
                className="ndjc-apk-store-profile-content"
                style={{
                  width: '100%',
                  paddingLeft: Math.max(0, NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX - APK_PAGE_SHELL_UI.screenPadding),
                  paddingRight: Math.max(0, NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX - APK_PAGE_SHELL_UI.screenPadding),
                  background: APK_SHELL_UI.pageBg,
                  boxSizing: 'border-box',
                  display: 'grid',
                  gap: NDJC_GLOBAL_UI_TOKENS.rhythm.sectionToSection,
                  pointerEvents: 'auto'
                }}
              >
                <UniversalStoreBrandHeader
                  coverUrl=""
                  logoUrl={selectedStoreLogoUrl || ''}
                  logoPreviewUrl={selectedStoreLogoPreviewUrl || ''}
                  title={state.title || ''}
                  subtitle={state.subtitle || ''}
                  businessStatus={state.businessStatus || ''}
                  onPreview={openCoverPreview}
                />

                {brandInfoDivider}

                <UniversalStoreAboutSection description={state.description} />

                <UniversalStoreServicesSection services={state.services} />

                <UniversalStoreLocationSection
                  address={state.address}
                  hours={state.hours}
                  mapUrl={state.mapUrl}
                  onOpenMap={actions.onOpenMap}
                />

                <UniversalStoreExtraContactsSection
                  extraContacts={state.extraContacts}
                  onCopyAccountValue={actions.onCopy}
                />

                <UniversalStoreAppAboutSection
                  appName={state.appName}
                  merchantEmail={state.merchantEmail}
                  privacyUrl={state.privacyUrl}
                  poweredByUrl={state.poweredByUrl}
                  onOpenPrivacy={actions.onOpenMap}
                  onOpenPoweredBy={actions.onOpenWebsite}
                />
              </section>
            </section>
          </section>

          <div style={{ height: 32 }} aria-hidden="true" />
        </section>

        <NdjcSnackbarHost
          message={snackbarVisible ? snackbarMessage : null}
          onDismiss={() => setSnackbarVisible(false)}
        />

        {imagePreview ? (
          <NdjcFullscreenImageViewerScreen
            images={imagePreview.images}
            startIndex={imagePreview.startIndex}
            onDismiss={() => setImagePreview(null)}
            onSave={actions.onSavePreviewImage}
          />
        ) : null}
        </section>
      </NdjcCustomerPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

function FavoriteCard({
  item,
  selected,
  onOpen,
  onToggle
}: {
  item: ShowcaseFavoriteCard
  selected: boolean
  onOpen: (id: string) => void
  onToggle: (id: string) => void
}) {
  const canOpenDetail = Boolean(item.itemAvailable)

  return (
    <NdjcLinkedCatalogItemCard
      title={item.title}
      imageUrl={item.imageUrl}
      subtitle={undefined}
      price={item.discountPriceText ? undefined : item.priceText}
      selected={selected}
      available={item.itemAvailable}
      allowClickWhenUnavailable={false}
      showSelectedOutline={false}
      onOpen={
        canOpenDetail
          ? () => onOpen(item.dishId)
          : undefined
      }
      onToggleSelect={() => onToggle(item.dishId)}
      bottom={
        item.discountPriceText ? (
          <span
            className="ndjc-linked-catalog-price-row"
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap
            }}
          >
            <b style={apkCatalogPriceStyle}>
              {item.discountPriceText}
            </b>

            <span style={apkCatalogOriginalPriceStyle}>
              {item.originalPriceText}
            </span>
          </span>
        ) : (
          <span className="ndjc-catalog-price-row" style={apkCatalogPriceRowStyle}>
            <b style={apkCatalogPriceStyle}>
              {item.priceText}
            </b>
          </span>
        )
      }
      middle={
        <NdjcItemStatusBadgeRow
          recommended={item.isRecommended}
          hidden={false}
        />
      }
    />
  )
}

export function ShowcaseFavoritesScreen({
  state,
  actions
}: {
  state: ShowcaseFavoritesUiState
  actions: ShowcaseFavoritesActions
}) {
  const hasSelection = state.selectedIds.length > 0
  const savedListPaddingX = '25px'
  const savedExpandedHeaderContentHeight = 340
  const savedCollapsedHeaderContentHeight = 238
  const {
    collapsed: savedHeaderCollapsed,
    headerRef,
    headerBottomPadding: savedHeaderBottomPadding,
    headerTotalHeight: savedHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: savedExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: savedCollapsedHeaderContentHeight,
    measureKey: [
      state.items.length,
      state.query,
      state.selectedCategory || '',
      state.sortMode,
      state.selectedIds.join(','),
      state.categories.join(','),
      state.showFilterMenu,
      state.filterRecommendedOnly,
      state.filterOnSaleOnly,
      state.appliedMinPrice ?? '',
      state.appliedMaxPrice ?? ''
    ].join('|')
  })
  const [favoritesDraftRecommendedOnly, setFavoritesDraftRecommendedOnly] = React.useState(state.filterRecommendedOnly)
  const [favoritesDraftOnSaleOnly, setFavoritesDraftOnSaleOnly] = React.useState(state.filterOnSaleOnly)
  const [favoritesDraftPriceMin, setFavoritesDraftPriceMin] = React.useState(state.priceMinDraft)
  const [favoritesDraftPriceMax, setFavoritesDraftPriceMax] = React.useState(state.priceMaxDraft)

  React.useEffect(() => {
    if (!state.showFilterMenu) {
      setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
      setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
      setFavoritesDraftPriceMin(state.priceMinDraft)
      setFavoritesDraftPriceMax(state.priceMaxDraft)
    }
  }, [state.showFilterMenu, state.filterRecommendedOnly, state.filterOnSaleOnly, state.priceMinDraft, state.priceMaxDraft])

  const filterActive =
    state.filterRecommendedOnly ||
    state.filterOnSaleOnly ||
    state.appliedMinPrice != null ||
    state.appliedMaxPrice != null

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Favorites"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <section
        className="ndjc-apk-favorites-source-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-apk-favorites-list-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            minHeight: 0,
            background: '#e9efed',
            padding: `${listTopPadding}px ${savedListPaddingX} calc(var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px) + ${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px)`,
            display: 'grid',
            alignContent: state.items.length ? 'start' : 'stretch',
            gridTemplateRows: state.items.length ? undefined : 'minmax(0, 1fr)',
            gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box'
          }}
          onScroll={handleCollapseScroll}
        >
          {state.items.length ? (
            <>
              {state.items.map(item => (
                <FavoriteCard
                  key={item.dishId}
                  item={item}
                  selected={state.selectedIds.includes(item.dishId)}
                  onOpen={actions.onOpenDetail}
                  onToggle={actions.onToggleSelect}
                />
              ))}

              <NdjcNoMoreListFooter text="No more saved items" />
            </>
          ) : (
            <NdjcInlineEmptyState
              title="No saved items yet"
              message="Tap the save button on an item's details page to save it here."
              verticalPadding={0}
              fillParentMaxSize
            />
          )}
        </section>

        <section
          className="ndjc-apk-favorites-header-card"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: savedHeaderHeight,
            boxSizing: 'border-box',
            background: APK_SHELL_UI.pageBg,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${savedHeaderBottomPadding}px`,
            overflow: 'hidden',
            transition: 'height 180ms cubic-bezier(0.2, 0, 0, 1), padding-bottom 180ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-apk-favorites-header-column"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: savedHeaderCollapsed
                ? 4
                : APK_EDIT_ITEM_UI.sectionCardGap,
              transition: 'gap 180ms cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            <section
              className="ndjc-apk-favorites-title-block"
              style={{
                width: '100%',
                display: 'grid',
                gap: savedHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
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
                  transform: savedHeaderCollapsed
                    ? 'translateY(-3px) scale(0.78)'
                    : 'translateY(0) scale(1)',
                  willChange: 'transform',
                  transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                Saved
              </h1>

              <p
                style={{
                  margin: 0,
                  height: savedHeaderCollapsed ? 0 : 21,
                  color: APK_EDIT_ITEM_UI.body70,
                  fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
                  opacity: savedHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: savedHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                Your saved items.
              </p>

              <span
                style={{
                  height: savedHeaderCollapsed ? 0 : 17,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                  opacity: savedHeaderCollapsed ? 0 : 1,
                  overflow: 'hidden',
                  transform: savedHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
                  willChange: 'opacity, transform',
                  transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                {state.items.length} saved items
              </span>
            </section>

            <section
              className="ndjc-apk-favorites-search-filter-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 48px',
                gap: APK_EDIT_ITEM_UI.fieldGap,
                alignItems: 'end'
              }}
            >
              <NdjcTextField
                label="Search saved"
                value={state.query}
                onChange={actions.onQueryChange}
                placeholder="Search saved"
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

              <NdjcFilterIconButton
                active={filterActive}
                label="Open saved filters"
                onClick={() => {
                  setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
                  setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
                  setFavoritesDraftPriceMin(state.priceMinDraft)
                  setFavoritesDraftPriceMax(state.priceMaxDraft)
                  actions.onShowFilterMenuChange(true)
                }}
              />
            </section>

            <SortRow
              columns={3}
              variant="segmented"
              ariaLabel="Sort saved items"
            >
              <SortNavEqualItem
                text="Default"
                selected={state.sortMode === 'Default'}
                onClick={() => actions.onSortModeChange('Default')}
                variant="segmented"
              />

              <SortNavEqualItem
                text="Low–High"
                selected={state.sortMode === 'PriceAsc'}
                onClick={() => actions.onSortModeChange('PriceAsc')}
                variant="segmented"
              />

              <SortNavEqualItem
                text="High–Low"
                selected={state.sortMode === 'PriceDesc'}
                onClick={() => actions.onSortModeChange('PriceDesc')}
                variant="segmented"
              />
            </SortRow>

            <CategoryChipsRow
              selectedCategory={state.selectedCategory}
              manualCategories={state.manualCategories}
              onCategorySelected={actions.onCategorySelected}
              showAllChip
              useOuterHorizontalPadding={false}
            />

            <p
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
              }}
            >
              Select items to delete or clear selection.
            </p>

            <section
              className="ndjc-apk-favorites-bulk-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: APK_EDIT_ITEM_UI.fieldGap
              }}
            >
              <NdjcControlPillButton
                disabled={!hasSelection}
                active={hasSelection}
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (!hasSelection) return
                  actions.onClearSelection()
                }}
              >
                Clear
              </NdjcControlPillButton>

              <NdjcControlPillButton
                disabled={!hasSelection}
                active={hasSelection}
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (!hasSelection) return
                  actions.onDeleteSelected()
                }}
              >
                Delete {state.selectedIds.length}
              </NdjcControlPillButton>
            </section>
          </section>
        </section>

        <NdjcFilterBottomSheet
          open={state.showFilterMenu}
          title="Filter"
          clearText="Clear"
          applyText="Apply"
          priceMinDraft={favoritesDraftPriceMin}
          onPriceMinDraftChange={setFavoritesDraftPriceMin}
          priceMaxDraft={favoritesDraftPriceMax}
          onPriceMaxDraftChange={setFavoritesDraftPriceMax}
          showPriceFields
          showHeaderDivider={false}
          onClose={() => {
            setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
            setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
            setFavoritesDraftPriceMin(state.priceMinDraft)
            setFavoritesDraftPriceMax(state.priceMaxDraft)
            actions.onShowFilterMenuChange(false)
          }}
          onClear={() => {
            setFavoritesDraftRecommendedOnly(false)
            setFavoritesDraftOnSaleOnly(false)
            setFavoritesDraftPriceMin('')
            setFavoritesDraftPriceMax('')
          }}
          onApply={() => {
            actions.onFilterRecommendedOnlyChange(favoritesDraftRecommendedOnly)
            actions.onFilterOnSaleOnlyChange(favoritesDraftOnSaleOnly)
            actions.onPriceMinDraftChange(favoritesDraftPriceMin)
            actions.onPriceMaxDraftChange(favoritesDraftPriceMax)
            window.setTimeout(() => {
              actions.onApplyPriceRange()
              actions.onShowFilterMenuChange(false)
            }, 0)
          }}
        >
          <NdjcToggleRow
            label="Pick"
            checked={favoritesDraftRecommendedOnly}
            onCheckedChange={setFavoritesDraftRecommendedOnly}
          />

          <NdjcToggleRow
            label="On sale"
            checked={favoritesDraftOnSaleOnly}
            onCheckedChange={setFavoritesDraftOnSaleOnly}
          />
        </NdjcFilterBottomSheet>

        <NdjcSnackbarHost message={state.statusMessage} />
      </section>
    </NdjcUnifiedBackground>
  )
}
