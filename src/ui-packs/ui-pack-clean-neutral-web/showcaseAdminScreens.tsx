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

function AdminDishRow({
  dish,
  selected,
  actions
}: {
  dish: DemoDish
  selected: boolean
  actions: ShowcaseAdminActions
}) {
  return (
    <NdjcCatalogItemCard
      dish={dish}
      selected={selected}
      onOpen={actions.onEditDish}
      metaText={`${dish.clickCount} views`}
      showCategory={false}
      trailing={
        <NdjcSelectionCheckbox
          checked={selected}
          onCheckedChange={() => actions.onToggleSelectDish(dish.id)}
        />
      }
    />
  )
}
export function ShowcaseAdmin({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <NdjcAdminPullRefreshContainer
        isRefreshing={state.syncOverviewState === 'Syncing'}
        onRefresh={actions.onRefresh}
      >
        <section
          className="ndjc-apk-admin-scroll-column"
          style={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflowY: 'auto',
            padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <section
            className="ndjc-apk-admin-root-panel"
            style={{
              width: '100%',
              maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
              alignSelf: 'center',
              boxSizing: 'border-box'
            }}
          >
            <section
              className="ndjc-apk-admin-card-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_ADMIN_UI.cardGap
              }}
            >
              <section
                className="ndjc-admin-title-sync-block"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flexShrink: 0
                }}
              >
                <AdminTitleText>
                  Admin
                </AdminTitleText>

                {state.syncOverviewState !== 'Syncing' && state.syncNoticeLabel ? (
                  <AdminSyncNoticeText>
                    {state.syncNoticeLabel}
                  </AdminSyncNoticeText>
                ) : (
                  <div style={{ height: 0, flexShrink: 0 }} aria-hidden="true" />
                )}
              </section>

{state.cloudStatus ? (
  <>
    <AdminSpacer height={10} />

    <section
      className="ndjc-apk-admin-section ndjc-apk-admin-cloud-section"
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: NDJC_GLOBAL_UI_TOKENS.components.card.radius,
        padding: `${NDJC_GLOBAL_UI_TOKENS.components.card.paddingTop}px ${NDJC_GLOBAL_UI_TOKENS.components.card.paddingX}px ${NDJC_GLOBAL_UI_TOKENS.components.card.paddingBottom}px`,
        boxSizing: 'border-box',
        background: NDJC_GLOBAL_UI_TOKENS.colors.cardBackground,
        boxShadow: NDJC_GLOBAL_UI_TOKENS.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: NDJC_GLOBAL_UI_TOKENS.spacing.lg
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: NDJC_GLOBAL_UI_TOKENS.spacing.xl,
          top: NDJC_GLOBAL_UI_TOKENS.spacing.lg,
          color: `rgba(${NDJC_GLOBAL_UI_TOKENS.colors.brandStrongRgb}, 0.075)`,
          pointerEvents: 'none'
        }}
      >
        <NdjcAdminCloudMark />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        <AdminCloudTitleText>
          Cloud status
        </AdminCloudTitleText>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          {state.cloudStatus.daysRemainingLabel ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 24,
                padding: '0 10px',
                borderRadius: 999,
                background: `rgba(${APK_SHOWCASE_COLOR_TOKENS.primaryRgb}, 0.08)`,
                color: APK_SHOWCASE_COLOR_TOKENS.primary,
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 650
              }}
            >
              {state.cloudStatus.daysRemainingLabel}
            </span>
          ) : null}

          <AdminBodySmallText color={APK_ADMIN_UI.cloudStatusColor}>
            {state.cloudStatus.statusLabel}
          </AdminBodySmallText>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <span
            style={{
              color: '#667085',
              fontSize: 12,
              lineHeight: 1.25,
              fontWeight: 500
            }}
          >
            {state.cloudStatus.planLabel} plan
          </span>

          <span
            style={{
              color: APK_ADMIN_UI.cloudPlanColor,
              fontSize: 13,
              lineHeight: 1.35,
              fontWeight: 500,
              overflowWrap: 'anywhere'
            }}
          >
            {state.cloudStatus.storeId}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '58px minmax(0, 1fr)',
            rowGap: 6,
            columnGap: 10,
            alignItems: 'baseline'
          }}
        >
          {state.cloudStatus.serviceEndAtLabel ? (
            <>
              <span
                style={{
                  color: '#98A2B3',
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 500
                }}
              >
                Expires
              </span>

              <span
                style={{
                  color: APK_ADMIN_UI.cloudDateColor,
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 500
                }}
              >
                {state.cloudStatus.serviceEndAtLabel}
              </span>
            </>
          ) : null}

          {state.cloudStatus.deleteAtLabel ? (
            <>
              <span
                style={{
                  color: '#98A2B3',
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 500
                }}
              >
                Deletes
              </span>

              <span
                style={{
                  color: APK_ADMIN_UI.cloudDateColor,
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 500
                }}
              >
                {state.cloudStatus.deleteAtLabel}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </section>

    <AdminSpacer height={APK_ADMIN_UI.spacer6} />
  </>
) : null}

              <AdminSpacer height={18} />

              <section
                className="ndjc-apk-admin-action-group"
                style={{
                  width: '100%',
                  marginLeft: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <AdminSectionLabel>
                  Quick action
                </AdminSectionLabel>

                <NdjcAdminEntryButton
                  iconName="add"
                  description="Create a new product or service"
                  onClick={actions.onAddNewDish}
                >
                  Add Item
                </NdjcAdminEntryButton>
              </section>

              <AdminSpacer height={22} />

              <section
                className="ndjc-apk-admin-catalog-group"
                style={{
                  width: '100%',
                  marginLeft: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <AdminSectionLabel>
                  Catalog
                </AdminSectionLabel>

                <NdjcAdminEntryButton
                  iconName="items"
                  description="Manage products, prices and visibility"
                  onClick={actions.onOpenItemsManager}
                >
                  Items
                </NdjcAdminEntryButton>

                <NdjcAdminEntryButton
                  iconName="categories"
                  description="Organize your catalog"
                  onClick={actions.onOpenCategoriesManager}
                >
                  Categories
                </NdjcAdminEntryButton>
              </section>

              <AdminSpacer height={22} />

              <section
                className="ndjc-apk-admin-store-group"
                style={{
                  width: '100%',
                  marginLeft: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <AdminSectionLabel>
                  Store
                </AdminSectionLabel>

                <NdjcAdminEntryButton
                  iconName="store"
                  description="Profile, opening hours and contact"
                  onClick={actions.onOpenStoreProfile}
                >
                  Store settings
                </NdjcAdminEntryButton>

                <NdjcAdminEntryButton
                  iconName="messages"
                  description={
                    state.unreadMessageCount > 0
                      ? `${state.unreadMessageCount} unread conversations`
                      : 'Customer conversations'
                  }
                  onClick={actions.onOpenMerchantChatList}
                >
                  Messages
                </NdjcAdminEntryButton>

                <NdjcAdminEntryButton
                  iconName="announcements"
                  description="Post updates and promotions"
                  onClick={actions.onOpenAnnouncementPublisher}
                >
                  Announcements
                </NdjcAdminEntryButton>

                <NdjcAdminEntryButton
                  iconName="appointments"
                  description={
                    state.pendingAppointmentCount > 0
                      ? `${state.pendingAppointmentCount} pending bookings`
                      : 'Manage customer bookings'
                  }
                  onClick={actions.onOpenAppointmentManager}
                >
                  Appointments
                </NdjcAdminEntryButton>
              </section>

              <AdminSpacer height={22} />

              <section
                className="ndjc-apk-admin-account-group"
                style={{
                  width: '100%',
                  marginLeft: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <AdminSectionLabel>
                  Account
                </AdminSectionLabel>

                <NdjcAdminEntryButton
                  iconName="password"
                  description="Update merchant password"
                  onClick={actions.onOpenChangePassword}
                >
                  Password
                </NdjcAdminEntryButton>

                <NdjcAdminEntryButton
                  iconName="signOut"
                  description="Leave merchant mode"
                  onClick={actions.onLogout}
                >
                  Sign out
                </NdjcAdminEntryButton>
              </section>
            </section>
          </section>

          {state.statusMessage ? (
            <>
              <AdminSpacer height={APK_ADMIN_UI.statusSpacer} />

              <AdminStatusMessageText>
                {state.statusMessage}
              </AdminStatusMessageText>
            </>
          ) : null}
        </section>
      </NdjcAdminPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminItems({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  const [showItemsFilterSheet, setShowItemsFilterSheet] = React.useState(false)
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = React.useState(false)
  const [itemsDraftRecommended, setItemsDraftRecommended] = React.useState(state.filterRecommended)
  const [itemsDraftHiddenOnly, setItemsDraftHiddenOnly] = React.useState(state.filterHiddenOnly)
  const [itemsDraftDiscountOnly, setItemsDraftDiscountOnly] = React.useState(state.filterDiscountOnly)
  const [itemsDraftPriceMin, setItemsDraftPriceMin] = React.useState(state.priceMinDraft)
  const [itemsDraftPriceMax, setItemsDraftPriceMax] = React.useState(state.priceMaxDraft)

  React.useEffect(() => {
    if (!showItemsFilterSheet) {
      setItemsDraftRecommended(state.filterRecommended)
      setItemsDraftHiddenOnly(state.filterHiddenOnly)
      setItemsDraftDiscountOnly(state.filterDiscountOnly)
      setItemsDraftPriceMin(state.priceMinDraft)
      setItemsDraftPriceMax(state.priceMaxDraft)
    }
  }, [showItemsFilterSheet, state.filterRecommended, state.filterHiddenOnly, state.filterDiscountOnly, state.priceMinDraft, state.priceMaxDraft])

  const selectedCount = state.selectedDishIds.length
  const singleSelectedDishTitle = selectedCount === 1
    ? state.dishes.find(dish => dish.id === state.selectedDishIds[0])?.title || ''
    : ''

  const defaultSelected = state.itemsSortMode === 'Default'
  const lowHighSelected = state.itemsSortMode === 'PriceAsc'
  const highLowSelected = state.itemsSortMode === 'PriceDesc'

  const filterActive =
    state.filterRecommended ||
    state.filterHiddenOnly ||
    state.filterDiscountOnly ||
    state.appliedMinPrice != null ||
    state.appliedMaxPrice != null

  const adminItemsListPaddingX = '25px'
  const adminItemsExpandedHeaderContentHeight = 340
  const adminItemsCollapsedHeaderContentHeight = 238
  const {
    collapsed: adminItemsHeaderCollapsed,
    headerRef: adminItemsHeaderRef,
    headerBottomPadding: adminItemsHeaderBottomPadding,
    headerTotalHeight: adminItemsHeaderHeight,
    listTopPadding,
    handleCollapseScroll
  } = useNdjcCollapsibleAdminHeader({
    headerBottomPadding: APK_EDIT_ITEM_UI.sectionCardGap,
    collapsedHeaderBottomPadding: 8,
    expandedHeaderContentHeight: adminItemsExpandedHeaderContentHeight,
    collapsedHeaderContentHeight: adminItemsCollapsedHeaderContentHeight,
    measureKey: [
      state.dishes.length,
      state.itemsSearchQuery,
      state.selectedCategory || '',
      state.itemsSortMode,
      state.selectedDishIds.join(','),
      state.manualCategories.join(','),
      state.filterRecommended,
      state.filterHiddenOnly,
      state.filterDiscountOnly,
      state.appliedMinPrice ?? '',
      state.appliedMaxPrice ?? ''
    ].join('|')
  })
  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-items-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-admin-items-overlay-root"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={state.isLoading}
          onRefresh={actions.onRefresh}
        >
<section
  className="ndjc-apk-admin-items-list-layer"
  style={{
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    background: '#e9efed',
    padding: `${listTopPadding}px ${adminItemsListPaddingX} calc(${APK_SHOWCASE_ITEM_UI.adminItemsListGap}px + env(safe-area-inset-bottom))`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain'
  }}
  onScroll={event => {
    handleCollapseScroll(event)

    ndjcHandleLoadMoreScroll(
      event,
      state.itemsPagination,
      actions.onLoadMoreItems
    )
  }}
>
          {state.dishes.length ? (
            <>
              {state.dishes.map(dish => (
                <AdminDishRow
                  key={dish.id}
                  dish={dish}
                  selected={state.selectedDishIds.includes(dish.id)}
                  actions={actions}
                />
              ))}

              <NdjcPaginationFooter
                pagination={state.itemsPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText="No more items"
                onLoadMore={actions.onLoadMoreItems}
                style={{
                  padding: '15px 0'
                }}
              />
            </>
          ) : (
            <NdjcInlineEmptyState
              title="No items yet"
              message="Add your first product from Admin → Add Item."
              verticalPadding={0}
              fillParentMaxSize
            />
          )}
        </section>



<section
  className="ndjc-apk-admin-items-header-card"
  style={{
    position: 'absolute',
    zIndex: 3,
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: adminItemsHeaderHeight,
    boxSizing: 'border-box',
    background: APK_SHELL_UI.pageBg,
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
    padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px ${adminItemsHeaderBottomPadding}px`,
    overflow: 'hidden',
    contain: 'layout paint',
    transition: 'none'
  }}
>
<section
  ref={adminItemsHeaderRef}
  className="ndjc-apk-admin-items-header-column"
  style={{
    width: '100%',
    maxWidth: NDJC_GLOBAL_UI_TOKENS.layout.contentMaxWidth,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: adminItemsHeaderCollapsed ? 4 : APK_EDIT_ITEM_UI.sectionCardGap
  }}
>
<section
  className="ndjc-apk-admin-items-title-block"
  style={{
    width: '100%',
    display: 'grid',
    gap: adminItemsHeaderCollapsed ? 0 : APK_EDIT_ITEM_UI.titleToHint
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
    transform: adminItemsHeaderCollapsed ? 'translateY(-3px) scale(0.78)' : 'translateY(0) scale(1)',
    willChange: 'transform',
    transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1)'
  }}
>
  Items
</h1>

  <p
    style={{
      margin: 0,
      height: adminItemsHeaderCollapsed ? 0 : 21,
      color: APK_EDIT_ITEM_UI.body70,
      fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
      lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
      fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
      opacity: adminItemsHeaderCollapsed ? 0 : 1,
      overflow: 'hidden',
      transform: adminItemsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
      willChange: 'opacity, transform',
      transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
    }}
  >
    Manage your product catalog and visibility.
  </p>

  <p
    style={{
      margin: 0,
      height: adminItemsHeaderCollapsed ? 0 : 17,
      color: APK_EDIT_ITEM_UI.body55,
      fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
      lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
      fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
      opacity: adminItemsHeaderCollapsed ? 0 : 1,
      overflow: 'hidden',
      transform: adminItemsHeaderCollapsed ? 'translateY(-4px)' : 'translateY(0)',
      willChange: 'opacity, transform',
      transition: 'opacity 160ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)'
    }}
  >
    {state.dishes.length} items • Loaded locally
  </p>
</section>

            <section
              className="ndjc-admin-items-search-filter-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 48px',
                gap: APK_EDIT_ITEM_UI.fieldGap,
                alignItems: 'end'
              }}
            >
              <NdjcTextField
                value={state.itemsSearchQuery}
                onChange={actions.onItemsSearchQueryChange}
                label="Search items"
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
                active={filterActive}
                label="Open item filters"
                onClick={() => {
                  setItemsDraftRecommended(state.filterRecommended)
                  setItemsDraftHiddenOnly(state.filterHiddenOnly)
                  setItemsDraftDiscountOnly(state.filterDiscountOnly)
                  setItemsDraftPriceMin(state.priceMinDraft)
                  setItemsDraftPriceMax(state.priceMaxDraft)
                  setShowItemsFilterSheet(true)
                }}
              />
            </section>

            <SortRow
              columns={3}
              variant="segmented"
              ariaLabel="Sort items"
            >
              <SortNavEqualItem
                text="Default"
                selected={defaultSelected}
                onClick={() => actions.onItemsSortModeChange('Default')}
                variant="segmented"
              />

              <SortNavEqualItem
                text="Low–High"
                selected={lowHighSelected}
                onClick={() => actions.onItemsSortModeChange('PriceAsc')}
                variant="segmented"
              />

              <SortNavEqualItem
                text="High–Low"
                selected={highLowSelected}
                onClick={() => actions.onItemsSortModeChange('PriceDesc')}
                variant="segmented"
              />
            </SortRow>

            <CategoryChipsRow
              selectedCategory={state.selectedCategory}
              manualCategories={state.manualCategories}
              onCategorySelected={actions.onSelectCategory}
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
              className="ndjc-admin-items-bulk-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: APK_EDIT_ITEM_UI.fieldGap
              }}
            >
              <NdjcControlPillButton
                disabled={selectedCount <= 0}
                active={selectedCount > 0}
                tone="adminAction"
                fullWidth
                onClick={actions.onClearSelectedDishes}
              >
                Clear
              </NdjcControlPillButton>

              <NdjcControlPillButton
                disabled={selectedCount <= 0}
                active={selectedCount > 0}
                tone="adminAction"
                fullWidth
                onClick={() => setShowDeleteSelectedConfirm(true)}
              >
                Delete {selectedCount}
              </NdjcControlPillButton>
            </section>
          </section>
        </section>
        </NdjcAdminPullRefreshContainer>
      </section>

      <NdjcFilterBottomSheet
        open={showItemsFilterSheet}
        title="Filter"
        priceMinDraft={itemsDraftPriceMin}
        onPriceMinDraftChange={setItemsDraftPriceMin}
        priceMaxDraft={itemsDraftPriceMax}
        onPriceMaxDraftChange={setItemsDraftPriceMax}
        showPriceFields
        showHeaderDivider={false}
        onClose={() => {
          setItemsDraftRecommended(state.filterRecommended)
          setItemsDraftHiddenOnly(state.filterHiddenOnly)
          setItemsDraftDiscountOnly(state.filterDiscountOnly)
          setItemsDraftPriceMin(state.priceMinDraft)
          setItemsDraftPriceMax(state.priceMaxDraft)
          setShowItemsFilterSheet(false)
        }}
        onClear={() => {
          setItemsDraftRecommended(false)
          setItemsDraftHiddenOnly(false)
          setItemsDraftDiscountOnly(false)
          setItemsDraftPriceMin('')
          setItemsDraftPriceMax('')
        }}
        onApply={() => {
          actions.onApplyItemsFilters({
            recommendedOnly: itemsDraftRecommended,
            hiddenOnly: itemsDraftHiddenOnly,
            discountOnly: itemsDraftDiscountOnly,
            minPriceDraft: itemsDraftPriceMin,
            maxPriceDraft: itemsDraftPriceMax
          })
          setShowItemsFilterSheet(false)
        }}
      >
        <NdjcToggleRow
          label="Pick"
          checked={itemsDraftRecommended}
          onChange={setItemsDraftRecommended}
        />

        <NdjcToggleRow
          label="Hidden"
          checked={itemsDraftHiddenOnly}
          onChange={setItemsDraftHiddenOnly}
        />

        <NdjcToggleRow
          label="On sale"
          checked={itemsDraftDiscountOnly}
          onChange={setItemsDraftDiscountOnly}
        />
      </NdjcFilterBottomSheet>

      {showDeleteSelectedConfirm && selectedCount > 0 ? (
        <NdjcBaseDialog
          title={selectedCount === 1 ? 'Delete selected item?' : 'Delete selected items?'}
          message={selectedCount === 1 ? `This will permanently remove "${singleSelectedDishTitle}".` : `This will permanently remove ${selectedCount} selected items.`}
          confirmText="Delete"
          dismissText="Cancel"
          onConfirmClick={() => {
            setShowDeleteSelectedConfirm(false)
            actions.onDeleteSelectedDishes()
          }}
          onDismissClick={() => setShowDeleteSelectedConfirm(false)}
          onDismissRequest={() => setShowDeleteSelectedConfirm(false)}
          destructiveConfirm
        />
      ) : null}

      {state.pendingDeleteDishId ? (
        <DeleteConfirmDialog
          title="Delete item?"
          message="This item will be removed from the catalog."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={actions.onConfirmPendingDelete}
          onCancel={actions.onDismissPendingDelete}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminCategories({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  const [newCategory, setNewCategory] = React.useState('')
  const [selectedCategoryName, setSelectedCategoryName] = React.useState<string | null>(null)
  const [showRenameDialog, setShowRenameDialog] = React.useState(false)
  const [renameFrom, setRenameFrom] = React.useState<string | null>(null)
  const [renameTo, setRenameTo] = React.useState('')

  const categorySubmittingAction = state.categorySubmittingAction
  const categorySubmitting = Boolean(categorySubmittingAction)

  function closeRenameDialog(): void {
    setShowRenameDialog(false)
    setRenameFrom(null)
    setRenameTo('')
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-categories-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-admin-categories-box"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={state.isLoading}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-apk-admin-categories-scroll-column"
            style={{
              width: '100%',
              height: '100%',
              minHeight: 0,
              overflowY: 'auto',
              padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px calc(${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom}px + env(safe-area-inset-bottom))`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              WebkitOverflowScrolling: 'touch'
            }}
          >
          <section
            className="ndjc-apk-admin-categories-root-card"
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
              className="ndjc-apk-admin-categories-card-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
                  fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                  letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                  textRendering: 'geometricPrecision'
                }}
              >
                Categories
              </h1>

              <div style={{ height: APK_EDIT_ITEM_UI.titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                }}
              >
                Create, rename, or delete item categories.
              </p>

              <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.sectionLabelColor,
                  fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
                }}
              >
                Create category
              </h2>

              <div style={{ height: APK_EDIT_ITEM_UI.titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                }}
              >
                Category names must be unique.
              </p>

              <div style={{ height: APK_EDIT_ITEM_UI.hintToContent, flexShrink: 0 }} />

              <NdjcTextField
                value={newCategory}
                onChange={setNewCategory}
                label="Category name"
                placeholder="Enter category name"
                singleLine
              />

              <div style={{ height: APK_EDIT_ITEM_UI.submitButtonTopGap, flexShrink: 0 }} />

              <NdjcControlPillButton
                disabled={!newCategory.trim() || categorySubmitting}
                active={Boolean(newCategory.trim()) && !categorySubmitting}
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (categorySubmitting) return
                  actions.onAddCategory(newCategory)
                  setNewCategory('')
                }}
              >
                {categorySubmittingAction === 'add' ? 'Adding...' : 'Add category'}
              </NdjcControlPillButton>

              <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.sectionLabelColor,
                  fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
                }}
              >
                Manage categories
              </h2>

              <div style={{ height: APK_EDIT_ITEM_UI.titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                }}
              >
                Select one category below, then rename or delete it.
              </p>

              <div style={{ height: APK_EDIT_ITEM_UI.hintToContent, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-selected-row"
                style={{
                  width: '100%',
                  minHeight: 28,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 8
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    color: APK_EDIT_ITEM_UI.body55,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  Selected category
                </span>

                <NdjcPillBadge selected={Boolean(selectedCategoryName)}>
                  {selectedCategoryName || 'None'}
                </NdjcPillBadge>
              </section>

              <div style={{ height: APK_EDIT_ITEM_UI.submitButtonTopGap, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-action-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: APK_EDIT_ITEM_UI.fieldGap
                }}
              >
                <NdjcControlPillButton
                  disabled={!selectedCategoryName || categorySubmitting}
                  active={Boolean(selectedCategoryName) && !categorySubmitting}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (categorySubmitting) return
                    const name = selectedCategoryName
                    if (!name) return
                    setRenameFrom(name)
                    setRenameTo(name)
                    setShowRenameDialog(true)
                  }}
                >
                  {categorySubmittingAction === 'rename' ? 'Renaming...' : 'Rename'}
                </NdjcControlPillButton>

                <NdjcControlPillButton
                  disabled={!selectedCategoryName || categorySubmitting}
                  active={Boolean(selectedCategoryName) && !categorySubmitting}
                  tone="adminAction"
                  fullWidth
                  onClick={() => {
                    if (categorySubmitting) return
                    const name = selectedCategoryName
                    if (!name) return
                    actions.onRequestDeleteCategory(name)
                  }}
                >
                  {categorySubmittingAction === 'delete' ? 'Deleting...' : 'Delete'}
                </NdjcControlPillButton>
              </section>

              <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.sectionLabelColor,
                  fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
                }}
              >
                All categories
              </h2>

              <div style={{ height: APK_EDIT_ITEM_UI.titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: APK_EDIT_ITEM_UI.body55,
                  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                }}
              >
                Tap a category to select it for management.
              </p>

              <div style={{ height: APK_EDIT_ITEM_UI.hintToContent, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-flow-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: APK_EDIT_ITEM_UI.chipGap
                }}
              >
                {state.adminCategories.map(category => (
                  <NdjcPillButton
                    key={category}
                    selected={selectedCategoryName === category}
                    disabled={categorySubmitting}
                    onClick={() => {
                      if (categorySubmitting) return
                      setSelectedCategoryName(category)
                    }}
                  >
                    {category}
                  </NdjcPillButton>
                ))}
              </section>
            </section>
          </section>
          </section>
        </NdjcAdminPullRefreshContainer>

        <NdjcSnackbarHost message={state.statusMessage} />
      </section>

      {showRenameDialog && renameFrom ? (
        <NdjcBaseDialog
          title="Rename category"
          confirmText="Rename"
          dismissText="Cancel"
          confirmEnabled={renameTo.trim().length > 0 && !categorySubmitting}
          confirmLoading={categorySubmittingAction === 'rename'}
          onConfirmClick={() => {
            if (categorySubmitting) return
            actions.onRenameCategory(renameFrom, renameTo)
            closeRenameDialog()
          }}
          onDismissClick={() => {
            if (categorySubmitting) return
            closeRenameDialog()
          }}
          onDismissRequest={() => {
            if (categorySubmitting) return
            closeRenameDialog()
          }}
          textContent={
            <NdjcTextField
              value={renameTo}
              onChange={setRenameTo}
              label="Category name"
              placeholder="Enter category name"
              singleLine
            />
          }
        />
      ) : null}

      {state.pendingDeleteCategory ? (
        <NdjcBaseDialog
          title="Delete category?"
          message={`This will delete "${state.pendingDeleteCategory}".`}
          confirmText="Delete"
          dismissText="Cancel"
          destructiveConfirm
          confirmEnabled={!categorySubmitting}
          confirmLoading={categorySubmittingAction === 'delete'}
          onConfirmClick={() => {
            if (categorySubmitting) return
            actions.onConfirmPendingDeleteCategory()
          }}
          onDismissClick={() => {
            if (categorySubmitting) return
            actions.onDismissCategoryDeleteDialogs()
          }}
          onDismissRequest={() => {
            if (categorySubmitting) return
            actions.onDismissCategoryDeleteDialogs()
          }}
        />
      ) : null}

      {state.cannotDeleteCategory ? (
        <NdjcBaseDialog
          title="Cannot delete"
          message={`Category "${state.cannotDeleteCategory}" still has items. Remove/move those items first.`}
          confirmText="OK"
          onConfirmClick={actions.onDismissCategoryDeleteDialogs}
          onDismissRequest={actions.onDismissCategoryDeleteDialogs}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseEditDish({
  state,
  actions
}: {
  state: ShowcaseEditDishUiState
  actions: ShowcaseEditDishActions
}) {
  const [isDraggingImages, setIsDraggingImages] = React.useState(false)
  const editImageInputRef = React.useRef<HTMLInputElement | null>(null)
  const editScrollRef = React.useRef<HTMLElement | null>(null)
  const nameFieldRef = React.useRef<HTMLElement | null>(null)
  const priceFieldRef = React.useRef<HTMLElement | null>(null)
  const discountFieldRef = React.useRef<HTMLElement | null>(null)
  const descriptionFieldRef = React.useRef<HTMLElement | null>(null)
  const categoryFieldRef = React.useRef<HTMLElement | null>(null)
  const imagesFieldRef = React.useRef<HTMLElement | null>(null)
  const lastValidationScrollSignatureRef = React.useRef('')

  function openEditImagePicker(): void {
    editImageInputRef.current?.click()
  }

  function handleEditImageFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files || [])

    files.forEach(file => {
      actions.onImagePicked(file)
    })

    event.target.value = ''
  }

  const descriptionMax = 200
  const descriptionText = state.description
  const descriptionLength = Math.min(descriptionText.length, descriptionMax)



  function scrollEditFieldIntoView(target: HTMLElement | null): void {
    const scrollRoot = editScrollRef.current

    if (!target || !scrollRoot) return

    const fieldShell = target.closest('.ndjc-apk-edit-modern-field')
    const scrollTarget = fieldShell instanceof HTMLElement ? fieldShell : target

    const rootRect = scrollRoot.getBoundingClientRect()
    const targetRect = scrollTarget.getBoundingClientRect()
    const safeTop = NDJC_GLOBAL_UI_TOKENS.layout.keyboardFocusTopGap
    const safeBottom = Math.max(rootRect.height * 0.58, safeTop + 180)

    const targetTopInRoot = targetRect.top - rootRect.top
    const targetBottomInRoot = targetRect.bottom - rootRect.top

    if (targetTopInRoot >= safeTop && targetBottomInRoot <= safeBottom) return

    const nextTop = scrollRoot.scrollTop + targetTopInRoot - safeTop

    scrollRoot.scrollTo({
      top: Math.max(0, nextTop),
      behavior: 'smooth'
    })
  }

  function handleEditScrollFocusCapture(event: React.FocusEvent<HTMLElement>): void {
    const target = event.target

    if (!(target instanceof HTMLElement)) return

    const tagName = target.tagName.toLowerCase()
    const isEditableTarget =
      tagName === 'input' ||
      tagName === 'textarea' ||
      target.getAttribute('contenteditable') === 'true'

    if (!isEditableTarget) return

    window.setTimeout(() => {
      scrollEditFieldIntoView(target)
    }, 120)
  }

  React.useEffect(() => {
    if (state.isBlocking || state.isSaving) return

    const validationSignature = [
      state.nameRequiredError ? 'name' : '',
      state.priceRequiredError ? 'price-required' : '',
      state.priceErrorText ? 'price-invalid' : '',
      state.discountValidationError ? 'discount-invalid' : '',
      state.descriptionRequiredError ? 'description' : '',
      state.categoryRequiredError ? 'category' : '',
      state.imagesRequiredError ? 'images' : ''
    ]
      .filter(Boolean)
      .join('|')

    if (!validationSignature) {
      lastValidationScrollSignatureRef.current = ''
      return
    }

    if (lastValidationScrollSignatureRef.current === validationSignature) return

    lastValidationScrollSignatureRef.current = validationSignature

    const targetRef =
      state.nameRequiredError ? nameFieldRef :
      state.priceRequiredError || state.priceErrorText ? priceFieldRef :
      state.discountValidationError ? discountFieldRef :
      state.descriptionRequiredError ? descriptionFieldRef :
      state.categoryRequiredError ? categoryFieldRef :
      state.imagesRequiredError ? imagesFieldRef :
      null

    window.requestAnimationFrame(() => {
      scrollEditFieldIntoView(targetRef?.current || null)
    })
  }, [
    state.nameRequiredError,
    state.priceRequiredError,
    state.priceErrorText,
    state.discountValidationError,
    state.descriptionRequiredError,
    state.categoryRequiredError,
    state.imagesRequiredError,
    state.isBlocking,
    state.isSaving
  ])

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-edit-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <input
        ref={editImageInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleEditImageFileChange}
      />

      <section
        ref={editScrollRef}
        className="ndjc-apk-edit-scroll-column"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: state.isBlocking || isDraggingImages ? 'hidden' : 'auto',
          padding: `${APK_EDIT_ITEM_UI.topContentPadding}px ${APK_EDIT_ITEM_UI.screenPadding}px calc(${APK_EDIT_ITEM_UI.bottomContentPadding}px + env(safe-area-inset-bottom))`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          touchAction: isDraggingImages ? 'none' : 'pan-y',
          scrollPaddingTop: NDJC_GLOBAL_UI_TOKENS.layout.keyboardFocusTopGap,
          scrollPaddingBottom: APK_EDIT_ITEM_UI.bottomContentPadding,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
        onFocusCapture={handleEditScrollFocusCapture}
      >
        <section
          className="ndjc-apk-edit-root-card"
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
            className="ndjc-apk-edit-card-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <EditItemHeaderText
              title={state.isNew ? 'Create item' : 'Edit item'}
              subtitle={state.isNew
                ? 'Set details, category, and visibility.'
                : 'Update details, category, and visibility.'}
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionBottom} />

            <EditItemSectionCard className="ndjc-apk-edit-details-card">
              <EditItemSectionTitle
                title="Details"
                subtitle="Fields marked * are required. Sale price is optional."
              />

              <section
                className="ndjc-apk-edit-fields-column"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.fieldGap
                }}
              >
                <EditItemFieldBlock ref={nameFieldRef}>
                  <NdjcTextField
                    value={state.name}
                    onChange={actions.onNameChange}
                    label="Name *"
                    placeholder="Item name"
                    singleLine
                    isError={state.nameRequiredError}
                  />

                  {state.nameRequiredError ? (
                    <EditItemErrorText>
                      Name is required.
                    </EditItemErrorText>
                  ) : null}
                </EditItemFieldBlock>

                <EditItemFieldBlock ref={priceFieldRef}>
                  <NdjcTextField
                    value={state.originalPrice}
                    onChange={actions.onPriceChange}
                    label="Price *"
                    placeholder="0"
                    type="text"
                    inputMode="decimal"
                    singleLine
                    isError={state.priceRequiredError || Boolean(state.priceErrorText)}
                  />

                  {state.priceRequiredError || state.priceErrorText ? (
                    <EditItemErrorText>
                      {state.priceErrorText || 'Price is required.'}
                    </EditItemErrorText>
                  ) : null}
                </EditItemFieldBlock>

                <EditItemFieldBlock ref={discountFieldRef}>
                  <NdjcTextField
                    value={state.discountPrice}
                    onChange={actions.onDiscountPriceChange}
                    label="Sale price"
                    placeholder="Optional"
                    type="text"
                    inputMode="decimal"
                    singleLine
                    isError={Boolean(state.discountErrorText)}
                  />

                  <section
                    className="ndjc-apk-edit-helper-block"
                    style={{
                      width: '100%',
                      display: 'grid',
                      gap: APK_EDIT_ITEM_UI.labelGap
                    }}
                  >
                    <EditItemBodySmallText>
                      Leave empty if no discount. If set, it should be lower than Price.
                    </EditItemBodySmallText>

                    {state.discountErrorText ? (
                      <EditItemErrorText>
                        {state.discountErrorText}
                      </EditItemErrorText>
                    ) : null}
                  </section>
                </EditItemFieldBlock>

                <EditItemSpacer height={Math.max(0, APK_EDIT_ITEM_UI.midGap - APK_EDIT_ITEM_UI.fieldGap)} />

                <EditItemFieldBlock ref={descriptionFieldRef}>
                  <NdjcTextField
                    value={descriptionText}
                    onChange={value => actions.onDescriptionChange(value.slice(0, descriptionMax))}
                    label="Description *"
                    placeholder="Description"
                    multiline
                    minLines={3}
                    isError={state.descriptionRequiredError}
                  />

                  {state.descriptionRequiredError ? (
                    <EditItemErrorText>
                      Description is required.
                    </EditItemErrorText>
                  ) : null}
                </EditItemFieldBlock>

                <section
                  className="ndjc-apk-edit-description-helper-row"
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
                      Appears on the item detail page.
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
                    {descriptionLength}/{descriptionMax}
                  </span>
                </section>
              </section>
            </EditItemSectionCard>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionCard className="ndjc-apk-edit-organization-card">
              <EditItemSectionTitle
                title="Organization"
                subtitle="Required. You can select an existing category or type to create a new one."
              />

              <EditItemFieldBlock ref={categoryFieldRef}>
                <NdjcTextField
                  value={state.category || ''}
                  onChange={value => actions.onCategorySelected(value || null)}
                  label="Category *"
                  placeholder="Category"
                  singleLine
                  isError={state.categoryRequiredError}
                />

                {state.categoryRequiredError ? (
                  <EditItemErrorText>
                    Category is required.
                  </EditItemErrorText>
                ) : null}
              </EditItemFieldBlock>

              {state.availableCategories.length > 0 ? (
                <section
                  className="ndjc-apk-edit-category-panel"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.spacer8
                  }}
                >
                  <EditItemBodySmallText>
                    Or select an existing category:
                  </EditItemBodySmallText>

                  <section
                    className="ndjc-apk-edit-category-chip-row"
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: APK_EDIT_ITEM_UI.chipGap
                    }}
                  >
                    {state.availableCategories.map(category => (
                      <NdjcPillButton
                        key={category}
                        selected={state.category === category}
                        onClick={() => actions.onCategorySelected(category)}
                      >
                        {category}
                      </NdjcPillButton>
                    ))}
                  </section>
                </section>
              ) : null}
            </EditItemSectionCard>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionCard className="ndjc-apk-edit-media-card">
              <EditItemSectionTitle
                title="Media"
                subtitle="Images displayed on the item detail page."
              />

              <section
                ref={imagesFieldRef}
                className="ndjc-apk-edit-images-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.labelGap
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: state.imagesRequiredError
                      ? APK_EDIT_ITEM_UI.error80
                      : APK_EDIT_ITEM_UI.sectionLabelColor,
                    fontSize: APK_EDIT_ITEM_UI.labelFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.labelFontWeight
                  }}
                >
                  Images *
                </h2>

                <EditItemBodySmallText>
                  Add images displayed on the item detail page. At least 1 image is required. The first image is used as the cover. Up to 9 images. JPG, PNG, or WebP. Up to 12MB per image.
                </EditItemBodySmallText>

                <EditItemSpacer height={APK_EDIT_ITEM_UI.mediaGridTop} />

                <NdjcEditableImageGrid
                  imageUrls={state.imageUrls}
                  maxImages={state.maxImages}
                  onPickImage={openEditImagePicker}
                  onRemoveImage={actions.onRemoveImage}
                  onMoveImage={actions.onMoveImage}
                  onDraggingChange={setIsDraggingImages}
                />

                {state.imageUploadErrorMessage ? (
                  <EditItemErrorText>
                    {state.imageUploadErrorMessage}
                  </EditItemErrorText>
                ) : null}

                {state.imagesRequiredError ? (
                  <EditItemErrorText>
                    At least 1 image is required.
                  </EditItemErrorText>
                ) : null}
              </section>
            </EditItemSectionCard>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionCard className="ndjc-apk-edit-visibility-card">
              <EditItemSectionTitle
                title="Visibility"
                subtitle="Choose how this item appears in the list."
              />

              <section
                className="ndjc-apk-edit-visibility-column"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: APK_EDIT_ITEM_UI.midGap
                }}
              >
                <section
                  className="ndjc-apk-edit-toggle-block"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.smallGap
                  }}
                >
                  <NdjcToggleRow
                    label="Pick"
                    checked={state.isRecommended}
                    onChange={actions.onToggleRecommended}
                  />

                  <EditItemBodySmallText>
                    Marks this item as Pick in the list.
                  </EditItemBodySmallText>
                </section>

                <section
                  className="ndjc-apk-edit-toggle-block"
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_EDIT_ITEM_UI.smallGap
                  }}
                >
                  <NdjcToggleRow
                    label="Hidden from list"
                    checked={state.isHidden}
                    onChange={actions.onToggleHidden}
                  />

                  <EditItemBodySmallText>
                    Hides this item from customers. It can still be edited.
                  </EditItemBodySmallText>
                </section>
              </section>
            </EditItemSectionCard>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.saveHintTop} />

            <section
              className="ndjc-apk-edit-submit-area"
              style={{
                width: '100%',
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.submitButtonTopGap
              }}
            >
              <EditItemBodySmallText>
                {state.isNew
                  ? 'After creation, the item is visible unless Hidden from list is enabled.'
                  : 'Changes take effect after saving.'}
              </EditItemBodySmallText>

              <NdjcControlPillButton
                active
                tone="adminAction"
                fullWidth
                disabled={state.isBlocking || state.isSaving}
                onClick={() => {
                  actions.onSave()
                }}
              >
                {state.isSaving ? 'Saving...' : state.isNew ? 'Create' : 'Save'}
              </NdjcControlPillButton>
            </section>


          </section>
        </section>
      </section>

      <NdjcSnackbarHost message={state.statusMessage} />

      {state.showErrorDialog && state.errorMessage ? (
        <NdjcBaseDialog
          title="Cannot save item"
          message={state.errorMessage}
          confirmText="OK"
          onConfirmClick={actions.onDismissError}
          onDismissRequest={actions.onDismissError}
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
    </NdjcUnifiedBackground>
  )
}
function ProfileField({
  label,
  value,
  onChange,
  multiline,
  enabled = true,
  isError = false,
  errorText,
  placeholder
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  enabled?: boolean
  isError?: boolean
  errorText?: string | null
  placeholder?: string
}) {
  return (
    <section
      className="ndjc-apk-field-block"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.fieldGap
      }}
    >
      <NdjcTextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline={multiline}
        disabled={!enabled}
        isError={isError}
        minLines={multiline ? 4 : 1}
      />

      {errorText ? (
        <p
          style={{
            margin: 0,
            color: APK_STORE_EDIT_UI.error80,
            fontSize: 12,
            lineHeight: 1.35,
            fontWeight: 400
          }}
        >
          {errorText}
        </p>
      ) : null}
    </section>
  )
}

function StoreEditSectionTitle({
  children,
  subtitle
}: {
  children: React.ReactNode
  subtitle?: string | null
}) {
  return (
    <section
      className="ndjc-store-edit-section-title"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      <h2 style={apkStoreEditSectionTitleStyle}>{children}</h2>

      {subtitle?.trim() ? (
        <p style={apkStoreEditSectionSubtitleStyle}>{subtitle}</p>
      ) : null}

      <div style={apkStoreEditSectionBottomSpacerStyle} aria-hidden="true" />
    </section>
  )
}

function StoreEditDescriptionCounterRow({
  current,
  max
}: {
  current: number
  max: number
}) {
  return (
    <section
      className="ndjc-store-edit-description-counter-row"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span
        style={{
          flex: 1,
          minWidth: 0
        }}
      />

      <span
        style={{
          color: APK_STORE_EDIT_UI.black55,
          fontSize: APK_STORE_EDIT_UI.subtitleSize,
          lineHeight: APK_STORE_EDIT_UI.subtitleLineHeight,
          fontWeight: APK_STORE_EDIT_UI.subtitleWeight,
          whiteSpace: 'nowrap'
        }}
      >
        {current}/{max}
      </span>
    </section>
  )
}

const STORE_PROFILE_HOURS_MAX_BYTES = 100

function storeProfileUtf8ByteLength(value: string): number {
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

function trimStoreProfileTextToUtf8Bytes(value: string, maxBytes: number): string {
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

export function ShowcaseStoreProfileEdit({
  state,
  actions
}: {
  state: ShowcaseStoreProfileUiState
  actions: ShowcaseStoreProfileActions
}) {
  const [serviceDraft, setServiceDraft] = React.useState('')
  const [extraNewName, setExtraNewName] = React.useState('')
  const [extraNewValue, setExtraNewValue] = React.useState('')
  const [extraLocalError, setExtraLocalError] = React.useState<string | null>(null)
  const [isDraggingCoverImages, setIsDraggingCoverImages] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  const logoInputRef = React.useRef<HTMLInputElement | null>(null)
  const coverInputRef = React.useRef<HTMLInputElement | null>(null)
  const titleFieldRef = React.useRef<HTMLElement | null>(null)
  const addressFieldRef = React.useRef<HTMLElement | null>(null)
  const mapUrlFieldRef = React.useRef<HTMLElement | null>(null)
  const contactsFieldRef = React.useRef<HTMLElement | null>(null)

  const storeProfileErrorMessage = state.errorMessage || state.validationError || null
  const titleRequiredError = storeProfileErrorMessage === 'Store title is required.'
  const addressRequiredError = storeProfileErrorMessage === 'Address is required when Map URL is set.'
  const contactRequiredError = storeProfileErrorMessage === 'Contact name and value must both be filled, or both be empty.'
  const contactDuplicateError = storeProfileErrorMessage === 'This contact is already added.'
  const businessScopeDuplicateError = storeProfileErrorMessage === 'This business scope is already added.'
  const mapUrlInvalidError = storeProfileErrorMessage === 'Map URL must start with http:// or https://.'

  React.useEffect(() => {
    const target = titleRequiredError
      ? titleFieldRef.current
      : addressRequiredError
        ? addressFieldRef.current
        : mapUrlInvalidError
          ? mapUrlFieldRef.current
          : contactRequiredError
            ? contactsFieldRef.current
            : null

    if (!target) return

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, [titleRequiredError, addressRequiredError, mapUrlInvalidError, contactRequiredError])

  function openLogoPicker(): void {
    logoInputRef.current?.click()
  }

  function openCoverPicker(): void {
    coverInputRef.current?.click()
  }

  function handleLogoFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = Array.from(event.target.files || [])[0]

    if (file) {
      actions.onLogoImagePicked(file)
    }

    event.target.value = ''
  }

  function handleCoverFilesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files || [])

    if (files.length) {
      actions.onCoverImagesPicked(files)
    }

    event.target.value = ''
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-store-edit-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >


      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleLogoFileChange}
      />

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleCoverFilesChange}
      />

      <section
        className="ndjc-apk-store-edit-scroll-column"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: isDraggingCoverImages ? 'hidden' : 'auto',
          padding: `${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop}px ${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX}px calc(${NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom}px + env(safe-area-inset-bottom))`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <section
          className="ndjc-apk-store-edit-root-card"
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
            className="ndjc-apk-store-edit-card-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}
          >
            <h1
              style={{
                margin: 0,
                color: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
                fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                textRendering: 'geometricPrecision'
              }}
            >
              Edit Store Profile
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
              Update your public store information shown to customers.
            </p>

            <div style={{ height: APK_EDIT_ITEM_UI.hintToContent, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="Displayed at the top of your public profile.">
              Brand
            </StoreEditSectionTitle>

            <section ref={titleFieldRef}>
              <ProfileField
                label="Title *"
                value={state.draftTitle}
                onChange={actions.onTitleChange}
                placeholder="Enter store title"
                isError={titleRequiredError}
                errorText={titleRequiredError ? 'Store title is required.' : null}
              />
            </section>

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <ProfileField
              label="Subtitle"
              value={state.draftSubtitle}
              onChange={actions.onSubtitleChange}
              placeholder="Enter short subtitle"
            />

            <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="This description appears in your public profile.">
              About
            </StoreEditSectionTitle>

            <ProfileField
              label="Description"
              value={state.draftDescription}
              onChange={actions.onDescriptionChange}
              placeholder="Describe your store"
              multiline
            />

            <StoreEditDescriptionCounterRow
              current={Math.min(state.draftDescription.length, 200)}
              max={200}
            />

            <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="List the services or categories you provide. Empty entries will not be saved.">
              Business Scope
            </StoreEditSectionTitle>

            <StoreServicesEditor
              services={state.draftServices}
              onChange={actions.onServiceChange}
              onRemove={actions.onRemoveService}
            />

            <div style={{ height: 10, flexShrink: 0 }} />

            <section
              className="ndjc-store-service-new-row"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_EDIT_ITEM_UI.fieldGap
              }}
            >
              <NdjcTextField
                value={serviceDraft}
                onChange={value => {
                  setServiceDraft(value)
                }}
                label="Add new service"
                placeholder="Enter service name"
                singleLine
              />

              {businessScopeDuplicateError ? (
                <p
                  style={{
                    margin: '-10px 0 0 0',
                    color: APK_EDIT_ITEM_UI.error80,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  This business scope is already added.
                </p>
              ) : null}

              <section
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                  gap: APK_STORE_EDIT_UI.rowGap
                }}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />

                <NdjcControlPillButton
                  active
                  tone="adminAction"
                  fullWidth
                  disabled={!serviceDraft.trim()}
                  onClick={() => {
                    const added = actions.onAddService(serviceDraft)

                    if (added) {
                      setServiceDraft('')
                    }
                  }}
                >
                  Add
                </NdjcControlPillButton>
              </section>
            </section>

            <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="If left empty, this section will not appear in your public profile.">
              Location & Hours
            </StoreEditSectionTitle>

            <section ref={addressFieldRef}>
              <ProfileField
                label="Address"
                value={state.draftAddress}
                onChange={actions.onAddressChange}
                placeholder="Enter store address"
                isError={addressRequiredError}
                errorText={addressRequiredError ? 'Address is required when Map URL is filled.' : null}
              />
            </section>

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <ProfileField
              label="Hours"
              value={state.draftHours}
              onChange={value => actions.onHoursChange(trimStoreProfileTextToUtf8Bytes(value, STORE_PROFILE_HOURS_MAX_BYTES))}
              placeholder={`Mon - Fri: 10:00 AM - 7:00 PM
Sat: 10:00 AM - 6:00 PM
Sun: Closed`}
              multiline
            />

            <StoreEditDescriptionCounterRow
              current={Math.min(storeProfileUtf8ByteLength(state.draftHours), STORE_PROFILE_HOURS_MAX_BYTES)}
              max={STORE_PROFILE_HOURS_MAX_BYTES}
            />

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <section ref={mapUrlFieldRef}>
              <ProfileField
                label="Map URL (optional)"
                value={state.draftMapUrl}
                onChange={actions.onMapUrlChange}
                placeholder="Paste map URL"
                isError={mapUrlInvalidError}
                errorText={mapUrlInvalidError ? 'Map URL must start with http:// or https://.' : null}
              />
            </section>

            <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="These details will be visible to customers in your profile.">
              Contact
            </StoreEditSectionTitle>

            <section ref={contactsFieldRef}>
              <StoreExtraContactsEditor>
                {state.draftExtraContacts.map(contact => (
                  <StoreExtraContactsEditorRow
                    key={contact.id}
                    name={contact.name}
                    value={contact.value}
                    onNameChange={value => actions.onExtraContactNameChange(contact.id, value)}
                    onValueChange={value => actions.onExtraContactValueChange(contact.id, value)}
                    onRemove={() => actions.onRemoveExtraContact(contact.id)}
                  />
                ))}

              <section
                className="ndjc-store-extra-contact-new-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: `minmax(0, ${APK_STORE_EDIT_UI.nameColumnFlex}fr) minmax(0, ${APK_STORE_EDIT_UI.valueColumnFlex}fr)`,
                    gap: APK_STORE_EDIT_UI.rowGap,
                    alignItems: 'end'
                  }}
                >
                  <NdjcTextField
                    value={extraNewName}
                    onChange={value => {
                      setExtraNewName(value)
                      setExtraLocalError(null)
                    }}
                    placeholder="Contact name"
                    label="Name"
                    singleLine
                  />

                  <NdjcTextField
                    value={extraNewValue}
                    onChange={value => {
                      setExtraNewValue(value)
                      setExtraLocalError(null)
                    }}
                    placeholder="Phone, email, or link"
                    label="Value"
                    singleLine
                  />
                </section>

                {contactRequiredError || contactDuplicateError || extraLocalError ? (
                  <p
                    style={{
                      margin: 0,
                      color: APK_EDIT_ITEM_UI.error80,
                      fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                      lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                      fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                    }}
                  >
                    {contactRequiredError
                      ? 'A contact item is incomplete (Name/Value). Please complete it or remove it before saving.'
                      : contactDuplicateError
                        ? 'This contact is already added.'
                        : extraLocalError}
                  </p>
                ) : null}

                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                    gap: APK_STORE_EDIT_UI.rowGap
                  }}
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />

                  <NdjcControlPillButton
                    active
                    tone="adminAction"
                    fullWidth
                    disabled={!extraNewName.trim() || !extraNewValue.trim()}
                    onClick={() => {
                      const name = extraNewName.trim()
                      const value = extraNewValue.trim()
                      const added = actions.onAddExtraContact(name, value)

                      if (added) {
                        setExtraNewName('')
                        setExtraNewValue('')
                      }
                    }}
                  >
                    Add
                  </NdjcControlPillButton>
                </section>
              </section>
              </StoreExtraContactsEditor>
            </section>

            <div style={{ height: APK_EDIT_ITEM_UI.sectionTop, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="Images displayed in your public profile. The first cover image is featured prominently. Up to 9 images.">
              Media
            </StoreEditSectionTitle>

            <StoreProfileCoverPicker
              src={state.draftCoverUrl}
              enabled={!state.isSaving}
              errorMessage={state.coverUploadErrorMessage}
              onPick={openCoverPicker}
              onRemove={actions.onRemoveCover}
              onMove={actions.onMoveCover}
              onDraggingChange={value => {
                setIsDraggingCoverImages(value)
                actions.onCoverDraggingChange(value)
              }}
              onPreview={(images, startIndex) => {
                setImagePreview({
                  images,
                  startIndex
                })
              }}
            />

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <StoreProfileLogoPicker
              src={state.draftLogoUrl}
              enabled={!state.isSaving}
              errorMessage={state.logoUploadErrorMessage}
              onPick={openLogoPicker}
              onRemove={actions.onRemoveLogo}
              onPreview={(images, startIndex) => {
                setImagePreview({
                  images,
                  startIndex
                })
              }}
            />

            <div style={{ height: APK_EDIT_ITEM_UI.mediaGridTop, flexShrink: 0 }} />

            {storeProfileErrorMessage &&
            !titleRequiredError &&
            !addressRequiredError &&
            !mapUrlInvalidError &&
            !contactRequiredError &&
            !contactDuplicateError &&
            !businessScopeDuplicateError ? (
              <>
                <div style={{ height: 8, flexShrink: 0 }} />

                <p
                  className="ndjc-error-text"
                  style={{
                    margin: 0
                  }}
                >
                  {storeProfileErrorMessage}
                </p>
              </>
            ) : null}

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonTopGap, flexShrink: 0 }} />

            <NdjcControlPillButton
              active
              tone="adminAction"
              fullWidth
              disabled={state.isSaving}
              onClick={() => {
                const name = extraNewName.trim()
                const value = extraNewValue.trim()
                const halfFilled =
                  (name.length === 0 && value.length > 0) ||
                  (name.length > 0 && value.length === 0)

                if (halfFilled) {
                  setExtraLocalError('A contact item is incomplete (Name/Value). Please complete it or remove it before saving.')
                  contactsFieldRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  })
                  return
                }

                actions.onSave()
              }}
            >
              {state.isSaving ? 'Saving...' : 'Save'}
            </NdjcControlPillButton>

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonBottomGap, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
              }}
            >
              Changes are saved immediately and reflected in your public profile.
            </p>
          </section>
        </section>
      </section>

      <NdjcSnackbarHost message={state.statusMessage || state.successMessage} />

      {imagePreview ? (
        <NdjcFullscreenImageViewerScreen
          images={imagePreview.images}
          startIndex={imagePreview.startIndex}
          onDismiss={() => setImagePreview(null)}
        />
      ) : null}

      {state.pendingExitTarget ? (
        <NdjcBaseDialog
          title="Discard unsaved changes?"
          message="You have unsaved merchant profile changes. Leave this page and discard them?"
          confirmText="Discard"
          dismissText="Stay"
          destructiveConfirm
          onConfirmClick={actions.onConfirmExit}
          onDismissClick={actions.onDismissExitConfirm}
          onDismissRequest={actions.onDismissExitConfirm}
        />
      ) : null}


    </NdjcUnifiedBackground>
  )
}

export function ShowcaseChangePassword({
  state,
  actions
}: {
  state: ShowcaseChangePasswordUiState
  actions: ShowcaseChangePasswordActions
}) {
  const [currentPasswordVisible, setCurrentPasswordVisible] = React.useState(false)
  const [nextPasswordVisible, setNextPasswordVisible] = React.useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false)

  const currentPasswordReady = state.current.trim().length > 0
  const nextPasswordReady = state.next.trim().length >= 8
  const confirmPasswordReady = state.confirm.trim().length > 0
  const passwordsMatch = state.next === state.confirm
  const canSubmitPasswordChange = currentPasswordReady && nextPasswordReady && confirmPasswordReady && passwordsMatch && !state.isSaving

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-change-password-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-change-password-content"
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
            className="ndjc-apk-change-password-column"
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
                color: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
                fontSize: APK_EDIT_ITEM_UI.titleFontSize,
                lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.titleFontWeight,
                letterSpacing: APK_EDIT_ITEM_UI.titleLetterSpacing,
                textRendering: 'geometricPrecision'
              }}
            >
              Change password
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
              Update your credentials for this account.
            </p>

            <div style={{ height: APK_EDIT_ITEM_UI.hintToContent, flexShrink: 0 }} />

            <NdjcTextField
              value={state.current}
              onChange={actions.onCurrentChange}
              label="Current password"
              placeholder="Enter current password"
              type={currentPasswordVisible ? 'text' : 'password'}
              singleLine
              autoComplete="current-password"
              trailingIcon={
                <NdjcPasswordVisibilityToggle
                  visible={currentPasswordVisible}
                  disabled={state.isSaving}
                  onToggle={() => setCurrentPasswordVisible(current => !current)}
                />
              }
            />

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <NdjcTextField
              value={state.next}
              onChange={actions.onNextChange}
              label="New password"
              placeholder="Enter new password"
              type={nextPasswordVisible ? 'text' : 'password'}
              singleLine
              autoComplete="new-password"
              trailingIcon={
                <NdjcPasswordVisibilityToggle
                  visible={nextPasswordVisible}
                  disabled={state.isSaving}
                  onToggle={() => setNextPasswordVisible(current => !current)}
                />
              }
            />

            <div style={{ height: 6, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
              }}
            >
              Use at least 8 characters. Avoid common passwords.
            </p>

            <div style={{ height: APK_EDIT_ITEM_UI.fieldGap, flexShrink: 0 }} />

            <NdjcTextField
              value={state.confirm}
              onChange={actions.onConfirmChange}
              label="Confirm new password"
              placeholder="Confirm new password"
              type={confirmPasswordVisible ? 'text' : 'password'}
              singleLine
              autoComplete="new-password"
              trailingIcon={
                <NdjcPasswordVisibilityToggle
                  visible={confirmPasswordVisible}
                  disabled={state.isSaving}
                  onToggle={() => setConfirmPasswordVisible(current => !current)}
                />
              }
            />

            <div style={{ height: 4, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: APK_EDIT_ITEM_UI.body55,
                fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
              }}
            >
              Must match the new password.
            </p>

            {state.error ? (
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
                  {state.error}
                </p>
              </>
            ) : null}

            {state.success ? (
              <>
                <div style={{ height: 10, flexShrink: 0 }} />

                <p
                  style={{
                    margin: 0,
                    color: APK_EDIT_ITEM_UI.body70,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
                  }}
                >
                  {state.success}
                </p>
              </>
            ) : null}

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonTopGap, flexShrink: 0 }} />

            <NdjcControlPillButton
              active
              tone="adminAction"
              fullWidth
              disabled={!canSubmitPasswordChange || state.isSaving}
              onClick={actions.onSubmit}
            >
              {state.isSaving ? 'Updating...' : 'Update password'}
            </NdjcControlPillButton>

            <div style={{ height: APK_EDIT_ITEM_UI.submitButtonBottomGap, flexShrink: 0 }} />

          </section>
        </section>
      </section>
    </NdjcUnifiedBackground>
  )
}
