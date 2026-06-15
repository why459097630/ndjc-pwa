'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './common/showcaseTokens'
export {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  NDJC_GLOBAL_UI_TOKENS,
  cx
}
import {
  APK_SHELL_UI,
  APK_HOME_PAGE_UI,
  APK_PAGE_SHELL_UI,
  NdjcBottomBarHostContext,
  NDJC_TOP_SCROLL_FADE_MASK_COLOR,
  NDJC_TOP_SCROLL_FADE_MASK_HEIGHT,
  NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR,
  NdjcBackArrowSvgIcon,
  NdjcCardBackButton,
  NdjcChatKeyboardDebugPanel,
  NdjcHomeOutlineIcon,
  NdjcSpinner,
  NdjcSystemBars,
  NdjcSystemBarsTransparent,
  NdjcTopNavOverlay,
  NdjcTopScrollFadeMask,
  NdjcWhiteCard,
  apkBackButtonIconWrapStyle,
  apkBackButtonStyle,
  apkBackButtonTextIconStyle,
  apkBgCircleStyle,
  apkHomeBottomBarHostStyle,
  apkHomeCategoryWrapStyle,
  apkHomeControlsGapStyle,
  apkHomeControlsStyle,
  apkHomeEmptyWrapStyle,
  apkHomeEntryOverlayStyle,
  apkHomeGridPlaceholderStyle,
  apkHomeGridRowStyle,
  apkHomeListStyle,
  apkHomeRefreshIndicatorWrapStyle,
  apkHomeRootStyle,
  apkHomeSortWrapStyle,
  apkHomeTagsWrapStyle,
  apkPhoneSurfaceStyle,
  apkPullRefreshHintPillStyle,
  apkPullRefreshHintStyle,
  apkPullRefreshIndicatorStyle,
  apkPullRefreshIndicatorWrapStyle,
  apkPullRefreshRootStyle,
  apkScreenContentStyle,
  apkScreenHeaderStyle,
  apkShellScreenStyle,
  apkTitleBlockStyle,
  apkTopNavOverlayStyle,
  apkUnifiedBackgroundSurfaceStyle,
  apkWhiteCardStyle,
  clearNdjcKeyboardViewportCssVars,
  getNdjcKeyboardViewportHeightPx,
  getNdjcVisualViewportOffsetTopPx,
  isNdjcInteractivePointerTarget,
  shouldSkipNdjcPullRefreshPointer,
  syncNdjcKeyboardViewportCssVars
} from './common/showcaseLayout'
import type {
  BackHomeActions,
  BottomActions,
  ShowcaseBottomBarTab
} from './common/showcaseLayout'
export {
  APK_SHELL_UI,
  APK_HOME_PAGE_UI,
  APK_PAGE_SHELL_UI,
  NdjcBottomBarHostContext,
  NDJC_TOP_SCROLL_FADE_MASK_COLOR,
  NDJC_TOP_SCROLL_FADE_MASK_HEIGHT,
  NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR,
  NdjcBackArrowSvgIcon,
  NdjcCardBackButton,
  NdjcChatKeyboardDebugPanel,
  NdjcHomeOutlineIcon,
  NdjcSpinner,
  NdjcSystemBars,
  NdjcSystemBarsTransparent,
  NdjcTopNavOverlay,
  NdjcTopScrollFadeMask,
  NdjcWhiteCard,
  apkBackButtonIconWrapStyle,
  apkBackButtonStyle,
  apkBackButtonTextIconStyle,
  apkBgCircleStyle,
  apkHomeBottomBarHostStyle,
  apkHomeCategoryWrapStyle,
  apkHomeControlsGapStyle,
  apkHomeControlsStyle,
  apkHomeEmptyWrapStyle,
  apkHomeEntryOverlayStyle,
  apkHomeGridPlaceholderStyle,
  apkHomeGridRowStyle,
  apkHomeListStyle,
  apkHomeRefreshIndicatorWrapStyle,
  apkHomeRootStyle,
  apkHomeSortWrapStyle,
  apkHomeTagsWrapStyle,
  apkPhoneSurfaceStyle,
  apkPullRefreshHintPillStyle,
  apkPullRefreshHintStyle,
  apkPullRefreshIndicatorStyle,
  apkPullRefreshIndicatorWrapStyle,
  apkPullRefreshRootStyle,
  apkScreenContentStyle,
  apkScreenHeaderStyle,
  apkShellScreenStyle,
  apkTitleBlockStyle,
  apkTopNavOverlayStyle,
  apkUnifiedBackgroundSurfaceStyle,
  apkWhiteCardStyle,
  clearNdjcKeyboardViewportCssVars,
  getNdjcKeyboardViewportHeightPx,
  getNdjcVisualViewportOffsetTopPx,
  isNdjcInteractivePointerTarget,
  shouldSkipNdjcPullRefreshPointer,
  syncNdjcKeyboardViewportCssVars
}
export type {
  BackHomeActions,
  BottomActions,
  ShowcaseBottomBarTab
} from './common/showcaseLayout'
import {
  APK_EDIT_ITEM_UI,
  APK_FILTER_UI,
  NdjcPrimaryActionButton,
  apkFilterChipBaseStyle,
  apkFilterChipStyle,
  apkFilterLazyRowStyle,
  apkSheetBackdropStyle,
  apkSheetCloseButtonStyle,
  apkSheetContentStyle,
  apkSheetDividerStyle,
  apkSheetDragHandleStyle,
  apkSheetDragHandleWrapStyle,
  apkSheetFooterStyle,
  apkSheetHeaderCopyStyle,
  apkSheetHeaderRootStyle,
  apkSheetHeaderRowStyle,
  apkSheetHeaderSubtitleStyle,
  apkSheetHeaderTitleStyle,
  apkSheetSurfaceStyle,
  apkSmallActiveChipTextStyle,
  apkSortNavItemStyle,
  apkSortNavOuterItemStyle,
  apkSortNavTextStyle,
  apkVisuallyHiddenStyle,
  sortLabel
} from './common/showcaseControls'
export {
  APK_EDIT_ITEM_UI,
  APK_FILTER_UI,
  NdjcPrimaryActionButton,
  apkFilterChipBaseStyle,
  apkFilterChipStyle,
  apkFilterLazyRowStyle,
  apkSheetBackdropStyle,
  apkSheetCloseButtonStyle,
  apkSheetContentStyle,
  apkSheetDividerStyle,
  apkSheetDragHandleStyle,
  apkSheetDragHandleWrapStyle,
  apkSheetFooterStyle,
  apkSheetHeaderCopyStyle,
  apkSheetHeaderRootStyle,
  apkSheetHeaderRowStyle,
  apkSheetHeaderSubtitleStyle,
  apkSheetHeaderTitleStyle,
  apkSheetSurfaceStyle,
  apkSmallActiveChipTextStyle,
  apkSortNavItemStyle,
  apkSortNavOuterItemStyle,
  apkSortNavTextStyle,
  apkVisuallyHiddenStyle,
  sortLabel
}

import {
  CategoryChipsRow,
  EditItemBodySmallText,
  EditItemErrorText,
  EditItemFieldBlock,
  EditItemHeaderText,
  EditItemModernTextField,
  EditItemSectionCard,
  EditItemSectionTitle,
  EditItemSpacer,
  EditItemSubmitButton,
  SectionDivider,
  useNdjcHorizontalDragScroll
} from './common/showcaseEditItem'
export {
  CategoryChipsRow,
  EditItemBodySmallText,
  EditItemErrorText,
  EditItemFieldBlock,
  EditItemHeaderText,
  EditItemModernTextField,
  EditItemSectionCard,
  EditItemSectionTitle,
  EditItemSpacer,
  EditItemSubmitButton,
  SectionDivider,
  useNdjcHorizontalDragScroll
}
import {
  APK_MEDIA_UI,
  NdjcShimmerImage,
  ImageTile,
  NdjcSingleEditableImage,
  UploadTile,
  apkEditableGridStyle,
  apkEditableImageTileStyle,
  apkFullscreenBackdropStyle,
  apkFullscreenCloseButtonStyle,
  apkFullscreenCloseIconStyle,
  apkFullscreenDownloadButtonStyle,
  apkFullscreenImageStyle,
  apkFullscreenPageIndicatorStyle,
  apkFullscreenPagerButtonStyle,
  apkFullscreenTopActionsStyle,
  apkImageFailureIconStyle,
  apkImageFailurePlaceholderStyle,
  apkImageFailureTextStyle,
  apkImageFillStyle,
  apkImagePlaceholderStyle,
  apkImageRootStyle,
  apkImageShimmerKeyframes,
  apkImageShimmerLayerStyle,
  apkRemoveCornerButtonStyle,
  apkUploadTileStyle
} from './common/showcaseMedia'
export {
  APK_MEDIA_UI,
  NdjcShimmerImage,
  ImageTile,
  NdjcSingleEditableImage,
  UploadTile,
  apkEditableGridStyle,
  apkEditableImageTileStyle,
  apkFullscreenBackdropStyle,
  apkFullscreenCloseButtonStyle,
  apkFullscreenCloseIconStyle,
  apkFullscreenDownloadButtonStyle,
  apkFullscreenImageStyle,
  apkFullscreenPageIndicatorStyle,
  apkFullscreenPagerButtonStyle,
  apkFullscreenTopActionsStyle,
  apkImageFailureIconStyle,
  apkImageFailurePlaceholderStyle,
  apkImageFailureTextStyle,
  apkImageFillStyle,
  apkImagePlaceholderStyle,
  apkImageRootStyle,
  apkImageShimmerKeyframes,
  apkImageShimmerLayerStyle,
  apkRemoveCornerButtonStyle,
  apkUploadTileStyle
}

import {
  FullscreenImagePreviewDialog,
  NdjcEditableImageGrid,
  NdjcFullscreenImageViewerScreen
} from './common/showcaseImageEditor'
export {
  FullscreenImagePreviewDialog,
  NdjcEditableImageGrid,
  NdjcFullscreenImageViewerScreen
}


import {
  APK_SHOWCASE_ITEM_UI,
  ApkHiddenBadgeIcon,
  ApkPickBadgeIcon,
  NdjcHomeStyleMediaCard,
  NdjcItemStatusBadge,
  NdjcItemStatusBadgeRow,
  apkAdminCatalogBottomStackStyle,
  apkAdminCatalogPriceMetaRowStyle,
  apkAdminCatalogViewsStyle,
  apkCatalogBodyStyle,
  apkCatalogCardStyle,
  apkCatalogCategoryChipStyle,
  apkCatalogMainButtonStyle,
  apkCatalogMediaStyle,
  apkCatalogMetaTextStyle,
  apkCatalogOriginalPriceStyle,
  apkCatalogPriceRowStyle,
  apkCatalogPriceStackStyle,
  apkCatalogPriceStyle,
  apkCatalogSpacerStyle,
  apkCatalogTitleStyle,
  apkDetailPickBadgeStyle,
  apkDetailPickBadgeTextStyle,
  apkHomeBadgeStyle,
  apkHomeBadgeTextStyle,
  apkHomeFavoriteIconStyle,
  apkHomeFavoriteOverlayStyle,
  apkHomeMediaBodyStyle,
  apkHomeMediaCardButtonStyle,
  apkHomeMediaCardStyle,
  apkHomeMediaImageWrapStyle,
  apkHomeMediaTitleStyle,
  apkHomePriceRowStyle,
  apkHomePrimaryPriceStyle,
  apkHomeSecondaryPriceStyle,
  apkPickBadgeIconStyle,
  apkPickBadgeStyle,
  apkPickBadgeTextStyle,
  categoryForDish,
  dishImage,
  priceText,
  titleForDish
} from './common/showcaseCatalog'
export {
  APK_SHOWCASE_ITEM_UI,
  ApkHiddenBadgeIcon,
  ApkPickBadgeIcon,
  NdjcHomeStyleMediaCard,
  NdjcItemStatusBadge,
  NdjcItemStatusBadgeRow,
  apkAdminCatalogBottomStackStyle,
  apkAdminCatalogPriceMetaRowStyle,
  apkAdminCatalogViewsStyle,
  apkCatalogBodyStyle,
  apkCatalogCardStyle,
  apkCatalogCategoryChipStyle,
  apkCatalogMainButtonStyle,
  apkCatalogMediaStyle,
  apkCatalogMetaTextStyle,
  apkCatalogOriginalPriceStyle,
  apkCatalogPriceRowStyle,
  apkCatalogPriceStackStyle,
  apkCatalogPriceStyle,
  apkCatalogSpacerStyle,
  apkCatalogTitleStyle,
  apkDetailPickBadgeStyle,
  apkDetailPickBadgeTextStyle,
  apkHomeBadgeStyle,
  apkHomeBadgeTextStyle,
  apkHomeFavoriteIconStyle,
  apkHomeFavoriteOverlayStyle,
  apkHomeMediaBodyStyle,
  apkHomeMediaCardButtonStyle,
  apkHomeMediaCardStyle,
  apkHomeMediaImageWrapStyle,
  apkHomeMediaTitleStyle,
  apkHomePriceRowStyle,
  apkHomePrimaryPriceStyle,
  apkHomeSecondaryPriceStyle,
  apkPickBadgeIconStyle,
  apkPickBadgeStyle,
  apkPickBadgeTextStyle,
  categoryForDish,
  dishImage,
  priceText,
  titleForDish
}

import {
  APK_DETAIL_PAGE_UI,
  DetailFavoriteIcon,
  NdjcDetailHeroActionButton,
  apkDetailContentStyle,
  apkDetailDescriptionStyle,
  apkDetailDividerStyle,
  apkDetailFavoriteButtonStyle,
  apkDetailFavoriteWrapStyle,
  apkDetailHeaderRowStyle,
  apkDetailHeroActionButtonStyle,
  apkDetailHeroActionItemStyle,
  apkDetailHeroActionLabelStyle,
  apkDetailHeroActionsStyle,
  apkDetailHeroCounterStyle,
  apkDetailHeroImageButtonStyle,
  apkDetailHeroStyle,
  apkDetailNormalPriceStyle,
  apkDetailOriginalPriceStyle,
  apkDetailPriceRowStyle,
  apkDetailPrimaryPriceStyle,
  apkDetailRootStyle,
  apkDetailScrollStyle,
  apkDetailSectionLabelStyle,
  apkDetailSectionStyle,
  apkDetailShowMoreButtonStyle,
  apkDetailTagsRowStyle,
  apkDetailTitleBlockStyle,
  apkDetailTitleStyle
} from './common/showcaseDetail'
export {
  APK_DETAIL_PAGE_UI,
  DetailFavoriteIcon,
  NdjcDetailHeroActionButton,
  apkDetailContentStyle,
  apkDetailDescriptionStyle,
  apkDetailDividerStyle,
  apkDetailFavoriteButtonStyle,
  apkDetailFavoriteWrapStyle,
  apkDetailHeaderRowStyle,
  apkDetailHeroActionButtonStyle,
  apkDetailHeroActionItemStyle,
  apkDetailHeroActionLabelStyle,
  apkDetailHeroActionsStyle,
  apkDetailHeroCounterStyle,
  apkDetailHeroImageButtonStyle,
  apkDetailHeroStyle,
  apkDetailNormalPriceStyle,
  apkDetailOriginalPriceStyle,
  apkDetailPriceRowStyle,
  apkDetailPrimaryPriceStyle,
  apkDetailRootStyle,
  apkDetailScrollStyle,
  apkDetailSectionLabelStyle,
  apkDetailSectionStyle,
  apkDetailShowMoreButtonStyle,
  apkDetailTagsRowStyle,
  apkDetailTitleBlockStyle,
  apkDetailTitleStyle
}

import {
  APK_HOME_NAV_UI,
  ActiveSortFilterRow,
  HomeSortNavEqualRow,
  NdjcAccountCircleOutlinedIcon,
  NdjcBookmarkIcon,
  NdjcBookingsIcon,
  NdjcBottomTabVertical,
  NdjcChatBubbleIcon,
  NdjcNotificationsIcon,
  NdjcSearchOutlinedIcon,
  NdjcStorefrontIcon,
  NdjcTopSearchStorefrontIcon,
  ShowcaseBottomBar,
  ShowcaseBottomBarHost,
  SortNavEqualItem,
  SortRow,
  TagsFilterRow,
  TopSearchBar,
  apkBottomBarDividerStyle,
  apkBottomBarRowStyle,
  apkBottomBarStyle,
  apkBottomTabDotStyle,
  apkBottomTabIconBoxStyle,
  apkBottomTabIconStyle,
  apkBottomTabLabelStyle,
  apkBottomTabStyle,
  apkTopSearchBarStyle,
  apkTopSearchFilterButtonStyle,
  apkTopSearchIconStyle,
  apkTopSearchInnerRowStyle,
  apkTopSearchInputStyle,
  apkTopSearchInputWrapStyle,
  apkTopSearchOuterStyle,
  apkTopSearchRoundButtonStyle
} from './common/showcaseHomeNavigation'
export {
  APK_HOME_NAV_UI,
  ActiveSortFilterRow,
  HomeSortNavEqualRow,
  NdjcAccountCircleOutlinedIcon,
  NdjcBookmarkIcon,
  NdjcBookingsIcon,
  NdjcBottomTabVertical,
  NdjcChatBubbleIcon,
  NdjcNotificationsIcon,
  NdjcSearchOutlinedIcon,
  NdjcStorefrontIcon,
  NdjcTopSearchStorefrontIcon,
  ShowcaseBottomBar,
  ShowcaseBottomBarHost,
  SortNavEqualItem,
  SortRow,
  TagsFilterRow,
  TopSearchBar,
  apkBottomBarDividerStyle,
  apkBottomBarRowStyle,
  apkBottomBarStyle,
  apkBottomTabDotStyle,
  apkBottomTabIconBoxStyle,
  apkBottomTabIconStyle,
  apkBottomTabLabelStyle,
  apkBottomTabStyle,
  apkTopSearchBarStyle,
  apkTopSearchFilterButtonStyle,
  apkTopSearchIconStyle,
  apkTopSearchInnerRowStyle,
  apkTopSearchInputStyle,
  apkTopSearchInputWrapStyle,
  apkTopSearchOuterStyle,
  apkTopSearchRoundButtonStyle
}

import {
  APK_STORE_PROFILE_UI,
  APK_STORE_EDIT_UI,
  NdjcStaticMapPreview,
  StoreProfileMapPreview,
  UniversalStoreCoverPlaceholderCard,
  UniversalStoreLogoPlaceholder,
  UniversalStoreBrandHeader,
  UniversalStoreEmptyInfoText,
  UniversalStoreAboutSection,
  UniversalStoreAppAboutSection,
  UniversalStoreLocationSection,
  UniversalContactRow,
  UniversalStoreExtraContactsSection,
  ProfileReadOnlyRow,
  ProfileReadOnlyRowIfNotBlank,
  StoreProfileHeaderBlock,
  StoreSectionTitle,
  StoreInfoLine,
  StoreProfileSectionHeader,
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
  mapMarkerSvgUrl
} from './common/showcaseStoreProfile'
export {
  APK_STORE_PROFILE_UI,
  APK_STORE_EDIT_UI,
  NdjcStaticMapPreview,
  StoreProfileMapPreview,
  UniversalStoreCoverPlaceholderCard,
  UniversalStoreLogoPlaceholder,
  UniversalStoreBrandHeader,
  UniversalStoreEmptyInfoText,
  UniversalStoreAboutSection,
  UniversalStoreAppAboutSection,
  UniversalStoreLocationSection,
  UniversalContactRow,
  UniversalStoreExtraContactsSection,
  ProfileReadOnlyRow,
  ProfileReadOnlyRowIfNotBlank,
  StoreProfileHeaderBlock,
  StoreSectionTitle,
  StoreInfoLine,
  StoreProfileSectionHeader,
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
  mapMarkerSvgUrl
}

import {
  APK_ANNOUNCEMENT_UI,
  NdjcAnnouncementExpandIcon,
  apkAnnouncementBodyTextStyle,
  apkAnnouncementExpandedBodyInnerStyle,
  apkAnnouncementExpandedBodyOuterStyle,
  apkAnnouncementExpandedBodyStyle,
  apkAnnouncementExpandButtonStyle,
  apkAnnouncementFeedCardStyle,
  apkAnnouncementFeedDividerStyle,
  apkAnnouncementFeedImageButtonStyle,
  apkAnnouncementFeedInnerStyle,
  apkAnnouncementFeedPlaceholderStyle,
  apkAnnouncementMetaRowStyle,
  apkAnnouncementMetaTextStyle,
  apkAnnouncementTimePillStyle
} from './common/showcaseAnnouncement'
export {
  APK_ANNOUNCEMENT_UI,
  NdjcAnnouncementExpandIcon,
  apkAnnouncementBodyTextStyle,
  apkAnnouncementExpandedBodyInnerStyle,
  apkAnnouncementExpandedBodyOuterStyle,
  apkAnnouncementExpandedBodyStyle,
  apkAnnouncementExpandButtonStyle,
  apkAnnouncementFeedCardStyle,
  apkAnnouncementFeedDividerStyle,
  apkAnnouncementFeedImageButtonStyle,
  apkAnnouncementFeedInnerStyle,
  apkAnnouncementFeedPlaceholderStyle,
  apkAnnouncementMetaRowStyle,
  apkAnnouncementMetaTextStyle,
  apkAnnouncementTimePillStyle
}

import {
  APK_ADMIN_UI,
  NDJC_ADMIN_TOOL_UI,
  AdminBodySmallText,
  AdminCloudTitleText,
  AdminInlineSyncSpinner,
  AdminInlineSyncStatus,
  AdminSectionLabel,
  AdminSpacer,
  AdminStatusMessageText,
  AdminSyncNoticeText,
  AdminTitleMediumText,
  AdminTitleText,
  NdjcAdminCloudMark,
  NdjcAdminEntryButton,
  NdjcAdminEntryIcon,
  NdjcAdminPageProgressSlot,
  apkAdminActionButtonStyle,
  useNdjcCollapsibleAdminHeader
} from './common/showcaseAdmin'
import type {
  NdjcAdminEntryIconName,
  NdjcCollapsibleAdminHeaderOptions,
  NdjcCollapsibleAdminHeaderState
} from './common/showcaseAdmin'
export {
  APK_ADMIN_UI,
  NDJC_ADMIN_TOOL_UI,
  AdminBodySmallText,
  AdminCloudTitleText,
  AdminInlineSyncSpinner,
  AdminInlineSyncStatus,
  AdminSectionLabel,
  AdminSpacer,
  AdminStatusMessageText,
  AdminSyncNoticeText,
  AdminTitleMediumText,
  AdminTitleText,
  NdjcAdminCloudMark,
  NdjcAdminEntryButton,
  NdjcAdminEntryIcon,
  NdjcAdminPageProgressSlot,
  apkAdminActionButtonStyle,
  useNdjcCollapsibleAdminHeader
}
export type {
  NdjcAdminEntryIconName,
  NdjcCollapsibleAdminHeaderOptions,
  NdjcCollapsibleAdminHeaderState
} from './common/showcaseAdmin'

import {
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
  appointmentListTimeText
} from './common/showcaseBooking'
export {
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
  appointmentListTimeText
}
import {
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
  apkMerchantThreadRowStyle
} from './common/showcaseChat'
import type {
  NdjcChatMessageMenuPlacement
} from './common/showcaseChat'
export {
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
  apkMerchantThreadRowStyle
}
export type {
  NdjcChatMessageMenuPlacement
} from './common/showcaseChat'

import type { ShowcasePwaInstallState } from './ShowcaseUiRenderer'
import type {
  ShowcaseNotificationMessageCode,
  ShowcaseNotificationPermissionState,
  ShowcaseNotificationRegistrationState
} from '@/features/feature-showcase-web/showcasePushRegistrationService'
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


export const APK_CORE_UI = {
  white: '#ffffff',
  black: '#000000',
  ink: '#111827',
  ink2: '#374151',
  muted: '#6b7280',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
  danger: '#e53935',
  border: 'rgba(0, 0, 0, 0.10)',
  borderStrong: 'rgba(0, 0, 0, 0.70)',
  borderDisabled: 'rgba(0, 0, 0, 0.30)',
  softSurface: '#f3f4f6',
  transparent: 'transparent',
  chipUnselectedBg: 'rgba(255, 255, 255, 0.72)',
  chipAccentBorder: 'rgba(142, 92, 255, 0.32)',
  chipSubtleText: 'rgba(0, 0, 0, 0.55)',
  chipSubtleBorder: 'rgba(0, 0, 0, 0.14)',

  fieldRadius: 16,
  fieldMinHeight: 56,
  fieldPaddingX: 14,
  fieldPaddingY: 10,
  fieldLabelSize: 12,
  fieldTextSize: 15,
  fieldIconSize: 20,
  fieldIndicatorWidth: 1.5,

  primaryButtonHeight: 56,
  primaryButtonRadius: 16,
  primaryButtonPaddingX: 18,
  primaryButtonPaddingY: 12,
  primaryButtonFontSize: 16,
  primaryButtonPressedScale: 0.965,
  primaryButtonElevation: '0 6px 14px rgba(0, 0, 0, 0.16)',
  primaryButtonPressedElevation: '0 2px 6px rgba(0, 0, 0, 0.10)',
  primaryButtonDisabledBg: 'rgba(0, 0, 0, 0.10)',
  primaryButtonDisabledText: 'rgba(0, 0, 0, 0.45)',

  pillHeight: 26,
  pillRadius: 999,
  pillPaddingX: 12,
  pillPaddingY: 4,
  pillFontSize: 12,
  pillBorderWidth: 0,
  pillPressedScale: 0.985,

  controlPillPaddingX: 12,
  controlPillPaddingY: 6,
  controlPillBorderWidth: 1,

  inlineTabHeight: 36,
  inlineTabRadius: 10,
  inlineTabPaddingX: 12,
  inlineTabPaddingY: 6,
  inlineTabSelectedColor: APK_SHOWCASE_COLOR_TOKENS.accent,
  inlineTabUnselectedColor: 'rgba(0, 0, 0, 0.55)',
  inlineTabSelectedWeight: 600,
  inlineTabUnselectedWeight: 500,

  checkboxSize: 24,
  checkboxRadius: 7,
  checkboxCheckedColor: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  checkboxUncheckedColor: '#b8c1be',
  checkboxCheckmarkColor: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  checkboxPressedScale: 0.965,

  toggleWidth: 48,
  toggleHeight: 28,
  toggleThumbSize: 22,
  toggleThumbInset: 3,
  toggleCheckedTrackColor: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  toggleCheckedThumbColor: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  toggleUncheckedTrackColor: NDJC_GLOBAL_UI_TOKENS.colors.controlDisabledSurface,
  toggleUncheckedThumbColor: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  toggleLabelColor: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
  toggleDisabledOpacity: 0.55,

  dialogRadius: 24,
  dialogPadding: 24,
  dialogWidth: 340,
  dialogBackdropColor: 'rgba(0, 0, 0, 0.42)',
  dialogContainerColor: '#ffffff',
  dialogContentColor: 'rgba(0, 0, 0, 0.80)',
  dialogTitleColor: '#000000',
  dialogMessageColor: 'rgba(0, 0, 0, 0.70)',
  dialogSecondaryActionColor: 'rgba(0, 0, 0, 0.60)',
  dialogPrimaryActionColor: APK_SHOWCASE_COLOR_TOKENS.primary,
  dialogDisabledActionColor: 'rgba(0, 0, 0, 0.30)',
  dialogDestructiveActionColor: '#e53935',
  dialogElevation: '0 10px 28px rgba(0, 0, 0, 0.22)',
  dialogTitleSize: 22,
  dialogTitleLineHeight: 1.2,
  dialogMessageSize: 14,
  dialogMessageLineHeight: 1.45,
  dialogButtonHeight: 40,
  dialogButtonPaddingX: 12,
  dialogButtonRadius: 999,

  emptyVerticalPadding: 32,
  emptyGap: 4,
  emptyTitleSize: 14,
  emptyTitleLineHeight: 1.35,
  emptyTitleWeight: 400,
  emptyMessageSize: 12,
  emptyMessageLineHeight: 1.35,
  emptyMessageWeight: 400,
  emptyTextColor: 'rgba(0, 0, 0, 0.70)',

  noMoreBalancedEdgeGap: 18,
  noMorePaddingTop: 16,
  noMorePaddingBottom: 24,
  noMoreTextSize: 12,
  noMoreLineHeight: 1.35,
  noMoreTextColor: 'rgba(0, 0, 0, 0.45)',

  snackbarRadius: 16,
  snackbarPaddingX: 16,
  snackbarPaddingY: 14,
  snackbarBottomOffset: 64,
  snackbarShadow: '0 1px 3px rgba(0, 0, 0, 0.18)',
  snackbarBg: '#ffffff',
  snackbarTextColor: '#111827',
  snackbarTextSize: 14,
  snackbarTextLineHeight: 1.35,

  syncBannerRadius: 16,
  syncBannerOuterPaddingX: 12,
  syncBannerOuterPaddingY: 10,
  syncBannerInnerPaddingX: 12,
  syncBannerInnerPaddingY: 10,
  syncBannerElevation: '0 6px 14px rgba(0, 0, 0, 0.12)',
  syncBannerBg: '#ffffff',
  syncBannerTextColor: '#111827',
  syncBannerActionColor: APK_SHOWCASE_COLOR_TOKENS.primary,
  syncBannerTextSize: 14,
  syncBannerTextLineHeight: 1.35
} as const

export function apkPrimaryButtonStyle(
  disabled?: boolean,
  isLoading?: boolean,
  pressed?: boolean
): React.CSSProperties {
  const enabled = !disabled && !isLoading
  const isPressed = Boolean(pressed && enabled)

  return {
    width: '100%',
    minHeight: APK_CORE_UI.primaryButtonHeight,
    border: 0,
    borderRadius: APK_CORE_UI.primaryButtonRadius,
    padding: `${APK_CORE_UI.primaryButtonPaddingY}px ${APK_CORE_UI.primaryButtonPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: enabled ? APK_CORE_UI.white : APK_CORE_UI.primaryButtonDisabledText,
    background: enabled ? APK_HOME_NAV_UI.topBannerGradientBottom : APK_CORE_UI.primaryButtonDisabledBg,
    backgroundClip: 'padding-box',
    boxShadow: enabled
      ? isPressed
        ? APK_CORE_UI.primaryButtonPressedElevation
        : APK_CORE_UI.primaryButtonElevation
      : 'none',
    fontSize: APK_CORE_UI.primaryButtonFontSize,
    lineHeight: 1,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    transform: isPressed
      ? `scale(${APK_CORE_UI.primaryButtonPressedScale})`
      : 'scale(1)',
    transformOrigin: 'center center',
    transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
    willChange: enabled ? 'transform' : undefined,
    opacity: isLoading ? 0.86 : 1,
    cursor: enabled ? 'pointer' : 'not-allowed',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    touchAction: 'manipulation'
  }
}

export function apkPillButtonStyle(selected?: boolean, disabled?: boolean): React.CSSProperties {
  return {
    height: APK_CORE_UI.pillHeight,
    minHeight: APK_CORE_UI.pillHeight,
    flex: '0 0 auto',
    maxWidth: 'none',
    border: 0,
    borderRadius: APK_CORE_UI.pillRadius,
    padding: `0 ${APK_CORE_UI.pillPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: selected ? '#111111' : 'rgba(0, 0, 0, 0.44)',
    background: selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
    boxShadow: 'none',
    fontSize: APK_CORE_UI.pillFontSize,
    lineHeight: 1,
    fontWeight: selected ? 700 : 600,
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

export function apkControlPillButtonStyle(
  active?: boolean,
  disabled?: boolean,
  tone: 'normal' | 'accent' | 'subtle' | 'adminAction' = 'normal',
  fullWidth = false,
  pressed = false
): React.CSSProperties {
  const selected = Boolean(active)

  if (tone === 'adminAction') {
    return apkAdminActionButtonStyle(selected, disabled, fullWidth, pressed)
  }

  const normal = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipUnselectedBg,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.border,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.black,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const accent = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.transparent,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipAccentBorder,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.brand,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const subtle = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.transparent,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipSubtleBorder,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.chipSubtleText,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const palette = tone === 'accent' ? accent : tone === 'subtle' ? subtle : normal

  return {
    width: fullWidth ? '100%' : undefined,
    minHeight: APK_CORE_UI.pillHeight,
    border: `${palette.borderWidth}px solid ${palette.border}`,
    borderRadius: APK_CORE_UI.pillRadius,
    padding: `${APK_CORE_UI.controlPillPaddingY}px ${APK_CORE_UI.controlPillPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: palette.text,
    background: palette.bg,
    boxShadow: 'none',
    fontSize: APK_CORE_UI.pillFontSize,
    lineHeight: 1,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

export function apkInlineTabStyle(selected?: boolean): React.CSSProperties {
  return {
    minHeight: APK_CORE_UI.inlineTabHeight,
    border: 0,
    borderRadius: APK_CORE_UI.inlineTabRadius,
    padding: `${APK_CORE_UI.inlineTabPaddingY}px ${APK_CORE_UI.inlineTabPaddingX}px`,
    display: 'inline-grid',
    placeItems: 'center',
    color: selected ? APK_CORE_UI.inlineTabSelectedColor : APK_CORE_UI.inlineTabUnselectedColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: selected ? APK_CORE_UI.inlineTabSelectedWeight : APK_CORE_UI.inlineTabUnselectedWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  }
}

export const apkDialogBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000002,
  padding: 24,
  display: 'grid',
  placeItems: 'center',
  background: APK_CORE_UI.dialogBackdropColor
}

export const apkDialogSurfaceStyle: React.CSSProperties = {
  width: `min(100%, ${APK_CORE_UI.dialogWidth}px)`,
  borderRadius: APK_CORE_UI.dialogRadius,
  padding: APK_CORE_UI.dialogPadding,
  display: 'grid',
  gap: 18,
  color: APK_CORE_UI.dialogContentColor,
  background: APK_CORE_UI.dialogContainerColor,
  boxShadow: APK_CORE_UI.dialogElevation
}

export const apkDialogTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.dialogTitleColor,
  fontSize: APK_CORE_UI.dialogTitleSize,
  lineHeight: APK_CORE_UI.dialogTitleLineHeight,
  fontWeight: 600
}

export const apkDialogMessageStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.dialogMessageColor,
  fontSize: APK_CORE_UI.dialogMessageSize,
  lineHeight: APK_CORE_UI.dialogMessageLineHeight,
  fontWeight: 400
}

export const apkDialogContentStyle: React.CSSProperties = {
  minWidth: 0,
  color: APK_CORE_UI.dialogContentColor,
  fontSize: APK_CORE_UI.dialogMessageSize,
  lineHeight: APK_CORE_UI.dialogMessageLineHeight,
  fontWeight: 400
}

export function apkDialogTextButtonStyle({
  primary = false,
  destructive = false,
  disabled = false
}: {
  primary?: boolean
  destructive?: boolean
  disabled?: boolean
} = {}): React.CSSProperties {
  return {
    minHeight: APK_CORE_UI.dialogButtonHeight,
    border: 0,
    borderRadius: APK_CORE_UI.dialogButtonRadius,
    padding: `0 ${APK_CORE_UI.dialogButtonPaddingX}px`,
    display: 'inline-grid',
    placeItems: 'center',
    color: disabled
      ? APK_CORE_UI.dialogDisabledActionColor
      : destructive
        ? APK_CORE_UI.dialogDestructiveActionColor
        : primary
          ? APK_CORE_UI.dialogPrimaryActionColor
          : APK_CORE_UI.dialogSecondaryActionColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: primary || destructive ? 600 : 500,
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

export const apkDialogActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8
}

export const apkInlineEmptyStateRootStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_CORE_UI.emptyVerticalPadding}px 0`,
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center'
}

export const apkInlineEmptyStateColumnStyle: React.CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  gap: APK_CORE_UI.emptyGap
}

export const apkInlineEmptyStateTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.emptyTextColor,
  fontSize: APK_CORE_UI.emptyTitleSize,
  lineHeight: APK_CORE_UI.emptyTitleLineHeight,
  fontWeight: APK_CORE_UI.emptyTitleWeight,
  textAlign: 'center'
}

export const apkInlineEmptyStateMessageStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.emptyTextColor,
  fontSize: APK_CORE_UI.emptyMessageSize,
  lineHeight: APK_CORE_UI.emptyMessageLineHeight,
  fontWeight: APK_CORE_UI.emptyMessageWeight,
  textAlign: 'center'
}

export const apkNoMoreListFooterStyle: React.CSSProperties = {
  width: '100%',
  marginTop: APK_CORE_UI.noMoreBalancedEdgeGap,
  padding: `0 0 ${APK_CORE_UI.noMoreBalancedEdgeGap}px`,
  color: APK_CORE_UI.noMoreTextColor,
  fontSize: APK_CORE_UI.noMoreTextSize,
  lineHeight: APK_CORE_UI.noMoreLineHeight,
  fontWeight: 400,
  textAlign: 'center'
}

export const apkSnackbarHostStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  right: 16,
  bottom: `calc(${APK_CORE_UI.snackbarBottomOffset}px + env(safe-area-inset-bottom))`,
  zIndex: 180,
  pointerEvents: 'none',
  boxSizing: 'border-box'
}

export const apkSnackbarSurfaceStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  borderRadius: APK_CORE_UI.snackbarRadius,
  padding: `${APK_CORE_UI.snackbarPaddingY}px ${APK_CORE_UI.snackbarPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'center',
  color: APK_CORE_UI.snackbarTextColor,
  background: APK_CORE_UI.snackbarBg,
  boxShadow: APK_CORE_UI.snackbarShadow,
  pointerEvents: 'auto',
  boxSizing: 'border-box',
  overflow: 'hidden'
}

export const apkSnackbarTextStyle: React.CSSProperties = {
  margin: 0,
  minWidth: 0,
  color: APK_CORE_UI.snackbarTextColor,
  fontSize: APK_CORE_UI.snackbarTextSize,
  lineHeight: APK_CORE_UI.snackbarTextLineHeight,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical'
}

export const apkSyncErrorBannerOuterStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_CORE_UI.syncBannerOuterPaddingY}px ${APK_CORE_UI.syncBannerOuterPaddingX}px`
}

export const apkSyncErrorBannerSurfaceStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_CORE_UI.syncBannerRadius,
  padding: `${APK_CORE_UI.syncBannerInnerPaddingY}px ${APK_CORE_UI.syncBannerInnerPaddingX}px`,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: APK_CORE_UI.syncBannerTextColor,
  background: APK_CORE_UI.syncBannerBg,
  boxShadow: APK_CORE_UI.syncBannerElevation
}

export const apkSyncErrorBannerTextStyle: React.CSSProperties = {
  margin: 0,
  flex: '1 1 auto',
  minWidth: 0,
  color: APK_CORE_UI.syncBannerTextColor,
  fontSize: APK_CORE_UI.syncBannerTextSize,
  lineHeight: APK_CORE_UI.syncBannerTextLineHeight,
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical'
}

export const apkSyncErrorBannerButtonStyle: React.CSSProperties = {
  minHeight: 36,
  border: 0,
  borderRadius: 999,
  padding: '0 8px',
  display: 'inline-grid',
  placeItems: 'center',
  color: APK_CORE_UI.syncBannerActionColor,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  whiteSpace: 'nowrap'
}

export const apkMutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.muted,
  fontSize: 14,
  lineHeight: 1.45,
  fontWeight: 400
}

export function ScreenScaffold({
  title,
  subtitle,
  actions,
  children,
  bottomActions,
  activeTab,
  badgeCount
}: {
  title: string
  subtitle?: string
  actions?: BackHomeActions
  children: React.ReactNode
  bottomActions?: BottomActions
  activeTab?: ShowcaseBottomBarTab
  badgeCount?: number
}) {
  return (
    <main className="ndjc-screen" style={apkShellScreenStyle}>
      <section className="ndjc-phone-surface" style={apkPhoneSurfaceStyle}>
        <header className="ndjc-screen-header" style={apkScreenHeaderStyle}>
          <button
            type="button"
            className="ndjc-top-icon-button"
            style={{
              ...apkBackButtonStyle,
              visibility: actions?.onBack || actions?.onBackToHome ? 'visible' : 'hidden',
              pointerEvents: actions?.onBack || actions?.onBackToHome ? 'auto' : 'none'
            }}
            onClick={actions?.onBack || actions?.onBackToHome}
            aria-label="Back"
          >
            ←
          </button>

          <button
            type="button"
            className="ndjc-top-icon-button"
            style={{
              ...apkBackButtonStyle,
              visibility: actions?.onBackToHome ? 'visible' : 'hidden',
              pointerEvents: actions?.onBackToHome ? 'auto' : 'none'
            }}
            onClick={actions?.onBackToHome}
            aria-label="Home"
          >
            ⌂
          </button>
        </header>

        <section className="ndjc-title-block" style={apkTitleBlockStyle}>
          <div
            style={{
              minWidth: 0,
              display: 'grid',
              gap: APK_SHELL_UI.titleBlockGap
            }}
          >
            <h1
              style={{
                margin: 0,
                color: APK_SHELL_UI.ink,
                fontSize: APK_SHELL_UI.titleSize,
                lineHeight: APK_SHELL_UI.titleLineHeight,
                fontWeight: APK_SHELL_UI.titleWeight,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title}
            </h1>

            {subtitle ? (
              <p
                style={{
                  margin: 0,
                  color: APK_SHELL_UI.muted,
                  fontSize: APK_SHELL_UI.subtitleSize,
                  lineHeight: APK_SHELL_UI.subtitleLineHeight,
                  fontWeight: APK_SHELL_UI.subtitleWeight
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          {typeof badgeCount === 'number' ? (
            <span
              className="ndjc-badge"
              style={{
                minWidth: APK_SHELL_UI.badgeMinSize,
                height: APK_SHELL_UI.badgeMinSize,
                borderRadius: APK_SHELL_UI.badgeRadius,
                padding: '0 8px',
                display: 'grid',
                placeItems: 'center',
                color: APK_SHELL_UI.white,
                background: APK_SHELL_UI.brand,
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 700
              }}
            >
              {badgeCount}
            </span>
          ) : null}
        </section>

        <section className="ndjc-screen-content" style={apkScreenContentStyle}>
          {children}
        </section>

        {bottomActions ? (
          <ShowcaseBottomBar actions={bottomActions} activeTab={activeTab || 'Store'} />
        ) : null}
      </section>
    </main>
  )
}

export function NdjcCard({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx('ndjc-card', className)}>
      {children}
    </section>
  )
}

export function NdjcButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button'
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      className={cx('ndjc-button', `ndjc-button-${variant}`)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function NdjcTextField({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  multiline = false,
  disabled = false,
  isError = false,
  className,
  leadingIcon,
  trailingIcon,
  singleLine,
  minLines = 1,
  fillContentWidth = true,
  fieldMinHeightOverride,
  fieldHeightOverride,
  inputMode,
  autoComplete
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: string
  multiline?: boolean
  disabled?: boolean
  isError?: boolean
  className?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  singleLine?: boolean
  minLines?: number
  fillContentWidth?: boolean
  fieldMinHeightOverride?: number
  fieldHeightOverride?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const isMultiline = multiline || singleLine === false
  const cleanLabel = label?.trim() || ''
  const hasLabel = Boolean(cleanLabel)

  const calculatedFieldMinHeight = isMultiline
    ? Math.max(APK_EDIT_ITEM_UI.fieldMinHeight, APK_EDIT_ITEM_UI.fieldMinHeight + Math.max(0, minLines - 1) * 28)
    : APK_EDIT_ITEM_UI.fieldMinHeight

  const fieldMinHeight = fieldMinHeightOverride ?? calculatedFieldMinHeight
  const fieldFixedHeight = typeof fieldHeightOverride === 'number' && Number.isFinite(fieldHeightOverride)
    ? Math.max(APK_EDIT_ITEM_UI.fieldMinHeight, fieldHeightOverride)
    : null

  const borderColor = isError
    ? APK_EDIT_ITEM_UI.fieldErrorBorderColor
    : isFocused
      ? APK_EDIT_ITEM_UI.fieldFocusBorderColor
      : disabled
        ? NDJC_GLOBAL_UI_TOKENS.colors.divider
        : APK_EDIT_ITEM_UI.fieldBorderColor

  const shellStyle: React.CSSProperties = {
    width: fillContentWidth ? '100%' : 'auto',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    display: 'grid',
    gap: hasLabel ? 7 : 0,
    opacity: disabled ? 0.72 : 1
  }

  const inputShellColumns = leadingIcon && trailingIcon
    ? `${APK_CORE_UI.fieldIconSize}px minmax(0, 1fr) ${APK_CORE_UI.fieldIconSize}px`
    : leadingIcon
      ? `${APK_CORE_UI.fieldIconSize}px minmax(0, 1fr)`
      : trailingIcon
        ? `minmax(0, 1fr) ${APK_CORE_UI.fieldIconSize}px`
        : 'minmax(0, 1fr)'

  const fieldShellStyle: React.CSSProperties = {
    width: fillContentWidth ? '100%' : 'auto',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: fieldFixedHeight ?? fieldMinHeight,
    height: fieldFixedHeight ?? undefined,
    maxHeight: fieldFixedHeight ?? undefined,
    boxSizing: 'border-box',
    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
    border: `${APK_EDIT_ITEM_UI.fieldBorderWidth}px solid ${borderColor}`,
    background: isFocused
      ? APK_EDIT_ITEM_UI.fieldFocusedBackground
      : APK_EDIT_ITEM_UI.fieldBackground,
    padding: `${APK_EDIT_ITEM_UI.fieldPaddingY}px ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
    display: 'grid',
    gridTemplateColumns: inputShellColumns,
    columnGap: leadingIcon || trailingIcon ? 8 : 0,
    alignItems: isMultiline ? 'start' : 'center',
    transition: `border-color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, box-shadow ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, background ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`,
    boxShadow: isError
      ? APK_EDIT_ITEM_UI.fieldErrorShadow
      : isFocused
        ? APK_EDIT_ITEM_UI.fieldFocusShadow
        : 'none',
    overflow: 'hidden'
  }

  const nativeFieldFixedHeight = fieldFixedHeight && isMultiline
    ? Math.max(24, fieldFixedHeight - APK_EDIT_ITEM_UI.fieldPaddingY * 2)
    : null

  const nativeFieldStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: isMultiline ? Math.max(72, fieldMinHeight - APK_EDIT_ITEM_UI.fieldPaddingY * 2) : 24,
    height: nativeFieldFixedHeight ?? (isMultiline ? 'auto' : 24),
    maxHeight: nativeFieldFixedHeight ?? undefined,
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
    overflowY: isMultiline ? 'auto' : undefined,
    WebkitOverflowScrolling: isMultiline ? 'touch' : undefined,
    appearance: 'none',
    WebkitAppearance: 'none'
  }

  const labelStyle: React.CSSProperties = {
    color: isError ? APK_EDIT_ITEM_UI.error80 : NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
    fontSize: APK_EDIT_ITEM_UI.labelFontSize,
    lineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
    fontWeight: APK_EDIT_ITEM_UI.labelFontWeight
  }

  const iconSlotStyle: React.CSSProperties = {
    width: APK_CORE_UI.fieldIconSize,
    height: APK_CORE_UI.fieldIconSize,
    display: 'grid',
    placeItems: 'center',
    color: isError ? APK_EDIT_ITEM_UI.error80 : NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
    fontSize: APK_CORE_UI.fieldIconSize,
    lineHeight: 1
  }

  return (
    <label
      className={cx('ndjc-field-shell', 'ndjc-modern-field-shell', disabled && 'is-disabled', isError && 'is-error', className)}
      style={shellStyle}
    >
      {hasLabel ? (
        <span className="ndjc-field-label ndjc-modern-field-label" style={labelStyle}>
          {cleanLabel}
        </span>
      ) : null}

      <span className="ndjc-text-field-shell ndjc-modern-field-control" style={fieldShellStyle}>
        {leadingIcon ? (
          <span className="ndjc-text-field-leading-icon" style={iconSlotStyle}>
            {leadingIcon}
          </span>
        ) : null}

        {isMultiline ? (
          <textarea
            className="ndjc-text-field ndjc-textarea ndjc-modern-textarea"
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
            className="ndjc-text-field ndjc-modern-input"
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

        {trailingIcon ? (
          <span className="ndjc-text-field-trailing-icon" style={iconSlotStyle}>
            {trailingIcon}
          </span>
        ) : null}
      </span>
    </label>
  )
}

export function NdjcPasswordVisibilityToggle({
  visible,
  onToggle,
  disabled = false
}: {
  visible: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <button
      type="button"
      className="ndjc-password-visibility-toggle"
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onClick={onToggle}
      style={{
        width: APK_CORE_UI.fieldIconSize,
        height: APK_CORE_UI.fieldIconSize,
        minWidth: APK_CORE_UI.fieldIconSize,
        minHeight: APK_CORE_UI.fieldIconSize,
        border: 0,
        borderRadius: 999,
        padding: 0,
        margin: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'inherit',
        background: 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2.75 12C4.7 7.9 7.85 5.85 12 5.85C16.15 5.85 19.3 7.9 21.25 12C19.3 16.1 16.15 18.15 12 18.15C7.85 18.15 4.7 16.1 2.75 12Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 14.65C13.4636 14.65 14.65 13.4636 14.65 12C14.65 10.5364 13.4636 9.35 12 9.35C10.5364 9.35 9.35 10.5364 9.35 12C9.35 13.4636 10.5364 14.65 12 14.65Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {!visible ? (
          <path
            d="M4.5 19.5L19.5 4.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
    </button>
  )
}

export function EmptyState({
  title,
  message,
  action
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <NdjcInlineEmptyState title={title} message={message} action={action} />
  )
}

export function NoMoreFooter({ text }: { text: string }) {
  return <NdjcNoMoreListFooter text={text} />
}



export type NdjcIconButtonProps = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export type NdjcDialogActions = {
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onDismissRequest?: () => void
  confirmEnabled?: boolean
  confirmLoading?: boolean
  destructiveConfirm?: boolean
}

export function NdjcUnifiedBackground({
  children,
  className,
  topNav,
  snackbar,
  bottomBar
}: {
  children: React.ReactNode
  className?: string
  topNav?: {
    onBack?: () => void
    onHome?: () => void
    iconOnly?: boolean
    iconTint?: string
  } | null
  snackbar?: React.ReactNode
  bottomBar?: React.ReactNode
}) {
  const contextBottomBar = React.useContext(NdjcBottomBarHostContext)
  const resolvedBottomBar: React.ReactNode = bottomBar ?? contextBottomBar
  const bottomBarHostRef = React.useRef<HTMLElement | null>(null)
  const [bottomBarHeightPx, setBottomBarHeightPx] = React.useState(0)
  const isChatKeyboardShell = typeof className === 'string' && className.includes('ndjc-chat-keyboard-shell')

  React.useLayoutEffect(() => {
    if (!isChatKeyboardShell) return
    if (typeof window === 'undefined') return

    let frameId: number | null = null
    let firstTimeoutId: number | null = null
    let secondTimeoutId: number | null = null

    const clearScheduledKeyboardViewportSync = () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }

      if (firstTimeoutId != null) {
        window.clearTimeout(firstTimeoutId)
        firstTimeoutId = null
      }

      if (secondTimeoutId != null) {
        window.clearTimeout(secondTimeoutId)
        secondTimeoutId = null
      }
    }

    const syncKeyboardViewportNow = () => {
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportInFrame = () => {
      frameId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportAfterFirstDelay = () => {
      firstTimeoutId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportAfterSecondDelay = () => {
      secondTimeoutId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const scheduleSyncKeyboardViewport = () => {
      syncKeyboardViewportNow()

      if (frameId == null) {
        frameId = window.requestAnimationFrame(syncKeyboardViewportInFrame)
      }

      if (firstTimeoutId == null) {
        firstTimeoutId = window.setTimeout(syncKeyboardViewportAfterFirstDelay, 50)
      }

      if (secondTimeoutId == null) {
        secondTimeoutId = window.setTimeout(syncKeyboardViewportAfterSecondDelay, 150)
      }
    }

    scheduleSyncKeyboardViewport()

    window.visualViewport?.addEventListener('resize', scheduleSyncKeyboardViewport)
    window.visualViewport?.addEventListener('scroll', scheduleSyncKeyboardViewport)
    window.addEventListener('resize', scheduleSyncKeyboardViewport)
    window.addEventListener('orientationchange', scheduleSyncKeyboardViewport)

    return () => {
      clearScheduledKeyboardViewportSync()

      window.visualViewport?.removeEventListener('resize', scheduleSyncKeyboardViewport)
      window.visualViewport?.removeEventListener('scroll', scheduleSyncKeyboardViewport)
      window.removeEventListener('resize', scheduleSyncKeyboardViewport)
      window.removeEventListener('orientationchange', scheduleSyncKeyboardViewport)
      clearNdjcKeyboardViewportCssVars()
    }
  }, [isChatKeyboardShell])

  React.useLayoutEffect(() => {
    if (!resolvedBottomBar) {
      setBottomBarHeightPx(0)
      return
    }

    const element = bottomBarHostRef.current
    if (!element) {
      setBottomBarHeightPx(APK_PAGE_SHELL_UI.tabBottomReserve)
      return
    }

    const updateMeasuredHeight = () => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height)
      setBottomBarHeightPx(nextHeight > 0 ? nextHeight : APK_PAGE_SHELL_UI.tabBottomReserve)
    }

    updateMeasuredHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateMeasuredHeight)
      return () => {
        window.removeEventListener('resize', updateMeasuredHeight)
      }
    }

    const observer = new ResizeObserver(updateMeasuredHeight)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [resolvedBottomBar])

  const bottomBarReservePx = resolvedBottomBar
    ? bottomBarHeightPx || APK_PAGE_SHELL_UI.tabBottomReserve
    : 0

  const screenStyleWithKeyboardInsets = {
    ...apkShellScreenStyle,
    height: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.height,
    minHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.minHeight,
    maxHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.maxHeight,
    transform: isChatKeyboardShell
      ? 'translate3d(0, var(--ndjc-visual-viewport-offset-top, 0px), 0)'
      : apkShellScreenStyle.transform,
    transformOrigin: isChatKeyboardShell ? 'top left' : apkShellScreenStyle.transformOrigin,
    willChange: isChatKeyboardShell ? 'transform' : apkShellScreenStyle.willChange
  } as React.CSSProperties

  const unifiedBackgroundSurfaceStyleWithBottomReserve = {
    ...apkUnifiedBackgroundSurfaceStyle,
    height: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.height,
    minHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.minHeight,
    maxHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.maxHeight,
    [NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR]: `${bottomBarReservePx}px`,
    [NDJC_BOTTOM_BAR_RESERVE_CSS_VAR]: `${bottomBarReservePx}px`
  } as React.CSSProperties

  return (
    <main className={cx('ndjc-screen', className)} style={screenStyleWithKeyboardInsets}>
      <NdjcSystemBarsTransparent darkIcons />

      <style>
        {`
          html,
          body {
            overscroll-behavior: none;
            overscroll-behavior-y: none;
            overflow: hidden;
          }

          .ndjc-screen,
          .ndjc-phone-surface,
          .ndjc-unified-background {
            overscroll-behavior: contain;
            overscroll-behavior-y: contain;
          }

          .ndjc-unified-background,
          .ndjc-unified-background * {
            scrollbar-width: none;
          }

          .ndjc-unified-background::-webkit-scrollbar,
          .ndjc-unified-background *::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }

          .ndjc-unified-background button,
          .ndjc-unified-background a,
          .ndjc-unified-background [role="button"],
          .ndjc-unified-background input,
          .ndjc-unified-background textarea,
          .ndjc-unified-background select {
            -webkit-tap-highlight-color: transparent;
          }

          .ndjc-unified-background input[type="search"]::-webkit-search-cancel-button,
          .ndjc-unified-background input[type="search"]::-webkit-search-decoration,
          .ndjc-unified-background input[type="search"]::-webkit-search-results-button,
          .ndjc-unified-background input[type="search"]::-webkit-search-results-decoration {
            display: none;
            -webkit-appearance: none;
          }

          .ndjc-unified-background input[type="search"] {
            -webkit-appearance: none;
            appearance: none;
          }

          .ndjc-unified-background .ndjc-apk-edit-modern-input::placeholder,
          .ndjc-unified-background .ndjc-apk-edit-modern-textarea::placeholder,
          .ndjc-unified-background .ndjc-modern-input::placeholder,
          .ndjc-unified-background .ndjc-modern-textarea::placeholder {
            color: ${APK_EDIT_ITEM_UI.fieldPlaceholderColor};
            opacity: ${APK_EDIT_ITEM_UI.fieldPlaceholderOpacity};
            font-weight: ${APK_EDIT_ITEM_UI.fieldPlaceholderFontWeight};
          }

          .ndjc-unified-background .ndjc-apk-edit-modern-input::-webkit-input-placeholder,
          .ndjc-unified-background .ndjc-apk-edit-modern-textarea::-webkit-input-placeholder,
          .ndjc-unified-background .ndjc-modern-input::-webkit-input-placeholder,
          .ndjc-unified-background .ndjc-modern-textarea::-webkit-input-placeholder {
            color: ${APK_EDIT_ITEM_UI.fieldPlaceholderColor};
            opacity: ${APK_EDIT_ITEM_UI.fieldPlaceholderOpacity};
            font-weight: ${APK_EDIT_ITEM_UI.fieldPlaceholderFontWeight};
          }

          .ndjc-unified-background button {
            appearance: none;
            -webkit-appearance: none;
            outline: none;
            background-clip: padding-box;
          }

          .ndjc-unified-background button:focus,
          .ndjc-unified-background button:focus-visible,
          .ndjc-unified-background [role="button"]:focus,
          .ndjc-unified-background [role="button"]:focus-visible,
          .ndjc-unified-background a:focus,
          .ndjc-unified-background a:focus-visible {
            outline: none;
          }

          .ndjc-unified-background .ndjc-primary-action-button,
          .ndjc-unified-background .ndjc-button,
          .ndjc-unified-background .ndjc-pill-button,
          .ndjc-unified-background .ndjc-control-pill-button,
          .ndjc-unified-background .ndjc-card-back-button,
          .ndjc-unified-background .ndjc-top-icon-button,
          .ndjc-unified-background .ndjc-bottom-tab-button,
          .ndjc-unified-background .ndjc-bottom-nav-button,
          .ndjc-unified-background button[role="tab"],
          .ndjc-unified-background button[type="button"],
          .ndjc-unified-background button[type="submit"] {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            overflow: hidden;
            background-clip: padding-box;
          }

          .ndjc-unified-background .ndjc-pill-button {
            transform: translateZ(0) scale(1);
            transition: transform 90ms ease-out, background 120ms ease, color 120ms ease, border-color 120ms ease, opacity 120ms ease;
            will-change: transform;
          }

          .ndjc-unified-background .ndjc-pill-button:active:not(:disabled) {
            transform: translateZ(0) scale(var(--ndjc-pill-pressed-scale, 0.92));
            filter: brightness(0.92);
            box-shadow: inset 0 2px 7px rgba(0, 0, 0, 0.20);
          }

          .ndjc-unified-background * {
            -webkit-touch-callout: none;
          }

          @keyframes ndjcAdminProgressSlide {
            0% {
              transform: translateX(-120%);
            }

            55% {
              transform: translateX(65%);
            }

            100% {
              transform: translateX(260%);
            }
          }

          @keyframes ndjcAdminSyncSpinnerRotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes ndjcSpinnerRotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <section
        className="ndjc-phone-surface ndjc-unified-background"
        style={unifiedBackgroundSurfaceStyleWithBottomReserve}
        onPointerDown={event => {
          if (isNdjcInteractivePointerTarget(event.target)) return
          ;(document.activeElement as HTMLElement | null)?.blur?.()
        }}
      >
        {topNav ? (
          <nav className="ndjc-top-nav-overlay" style={apkTopNavOverlayStyle} aria-label="Page navigation">
            <span style={{ pointerEvents: 'auto' }}>
              {topNav.onBack ? (
                <NdjcCardBackButton
                  onClick={topNav.onBack}
                  iconOnly={topNav.iconOnly}
                  iconTint={topNav.iconTint}
                />
              ) : (
                <span
                  style={{
                    width: APK_SHELL_UI.topNavButtonSlotSize,
                    height: APK_SHELL_UI.topNavButtonSlotSize,
                    display: 'block'
                  }}
                  aria-hidden="true"
                />
              )}
            </span>

            <span style={{ pointerEvents: 'auto' }}>
              {topNav.onHome ? (
<NdjcCardBackButton
  onClick={topNav.onHome}
  label="Home"
  icon={<NdjcHomeOutlineIcon color={topNav.iconTint || '#111111'} />}
  iconOnly={topNav.iconOnly}
  iconTint={topNav.iconTint || '#111111'}
/>
              ) : (
                <span
                  style={{
                    width: APK_SHELL_UI.topNavButtonSlotSize,
                    height: APK_SHELL_UI.topNavButtonSlotSize,
                    display: 'block'
                  }}
                  aria-hidden="true"
                />
              )}
            </span>
          </nav>
        ) : null}

        {children}

        {snackbar}

        {resolvedBottomBar ? (
          <section
            ref={bottomBarHostRef}
            className="ndjc-bottom-bar-overlay-host"
            data-web-equivalent="bottom-bar-host"
            style={apkHomeBottomBarHostStyle}
          >
            {resolvedBottomBar}
          </section>
        ) : null}
      </section>
    </main>
  )
}

export function NdjcPillButton({
  children,
  selected,
  onClick,
  disabled,
  className,
  variant = 'default'
}: {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  variant?: 'default' | 'date'
}) {
  const dateVariant = variant === 'date'

  return (
    <button
      type="button"
      className={cx('ndjc-pill-button', selected && 'is-selected', dateVariant && 'is-date-pill', className)}
      style={{
        ...apkPillButtonStyle(selected, disabled),
        ...(dateVariant
          ? {
              minWidth: 76,
              height: 48,
              minHeight: 48,
              padding: '0 14px',
              borderRadius: 16,
              opacity: disabled ? 0.42 : 1
            }
          : null)
      }}
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
          display: dateVariant ? 'grid' : 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: dateVariant ? 'center' : undefined,
          gap: dateVariant ? 2 : undefined,
          height: '100%',
          lineHeight: dateVariant ? undefined : 1,
          transform: dateVariant ? 'none' : 'translateY(1px)',
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

export function NdjcPillBadge({
  children,
  selected,
  disabled,
  className,
  allowOverflow = false
}: {
  children: React.ReactNode
  selected?: boolean
  disabled?: boolean
  className?: string
  allowOverflow?: boolean
}) {
  return (
    <span
      className={cx('ndjc-pill-badge', selected && 'is-selected', className)}
      style={{
        ...apkPillButtonStyle(selected, disabled),
        maxWidth: allowOverflow ? '100%' : 'none',
        overflow: allowOverflow ? 'visible' : 'hidden',
        textOverflow: allowOverflow ? 'clip' : 'ellipsis',
        cursor: 'default',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
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
          overflow: allowOverflow ? 'visible' : 'hidden',
          textOverflow: allowOverflow ? 'clip' : 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </span>
    </span>
  )
}

export function NdjcControlPillButton({
  children,
  className,
  selected,
  active,
  onClick,
  disabled,
  tone = 'normal',
  fullWidth = false
}: {
  children: React.ReactNode
  className?: string
  selected?: boolean
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  tone?: 'normal' | 'accent' | 'subtle' | 'adminAction'
  fullWidth?: boolean
}) {
  const isActive = active ?? selected ?? false
  const [pressed, setPressed] = React.useState(false)

  return (
    <button
      type="button"
      className={cx('ndjc-control-pill-button', isActive && 'is-selected', className)}
      style={apkControlPillButtonStyle(isActive, disabled, tone, fullWidth, pressed)}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => {
        if (!disabled) {
          setPressed(true)
        }
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-pressed={isActive}
    >
      <span
        style={{
          minWidth: 0,
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
export function NdjcFilterIconButton({
  active,
  disabled = false,
  label = 'Open filters',
  icon,
  onClick
}: {
  active?: boolean
  disabled?: boolean
  label?: string
  icon?: React.ReactNode
  onClick: () => void
}) {
  const [pressed, setPressed] = React.useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={Boolean(active)}
      disabled={disabled}
      className={cx('ndjc-filter-icon-button', active && 'is-active')}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      onPointerDown={() => {
        if (!disabled) {
          setPressed(true)
        }
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 48,
        minWidth: 48,
        height: APK_EDIT_ITEM_UI.fieldMinHeight,
        minHeight: APK_EDIT_ITEM_UI.fieldMinHeight,
        border: 0,
        borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
        padding: 0,
        display: 'inline-grid',
        placeItems: 'center',
        color: disabled
          ? NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText
          : NDJC_ADMIN_TOOL_UI.emphasis,
        background: APK_EDIT_ITEM_UI.fieldBackground,
        boxShadow: 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.72 : 1,
        appearance: 'none',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'color 140ms ease, background 140ms ease, opacity 140ms ease, transform 120ms ease'
      }}
    >
      {icon ?? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.8 7.5H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="6"
            cy="7.5"
            r="2.8"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 16.5H15.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="16.5"
            r="2.8"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  )
}
export function NdjcInlineTextTab({
  children,
  text,
  selected,
  onClick
}: {
  children?: React.ReactNode
  text?: string
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-inline-text-tab', selected && 'is-selected')}
      style={apkInlineTabStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span
        style={{
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {text ?? children}
      </span>
    </button>
  )
}

export function NdjcToggleRow({
  label,
  labelNode,
  description,
  checked,
  onChange,
  onCheckedChange,
  enabled = true,
  labelColor
}: {
  label: string
  labelNode?: React.ReactNode
  description?: string
  checked: boolean
  onChange?: (value: boolean) => void
  onCheckedChange?: (value: boolean) => void
  enabled?: boolean
  labelColor?: string
}) {
  const nextChecked = !checked
  const handleChange = () => {
    if (!enabled) return
    onCheckedChange?.(nextChecked)
    onChange?.(nextChecked)
  }

  return (
    <label
      className={cx('ndjc-toggle-row', !enabled && 'is-disabled')}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        color: labelColor || APK_CORE_UI.toggleLabelColor,
        background: 'transparent',
        opacity: enabled ? 1 : APK_CORE_UI.toggleDisabledOpacity,
        cursor: enabled ? 'pointer' : 'not-allowed'
      }}
    >
      <span
        style={{
          minWidth: 0,
          display: 'grid',
          gap: description ? 3 : 0
        }}
      >
        {labelNode ? (
          labelNode
        ) : (
          <strong
            style={{
              color: labelColor || NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </strong>
        )}

        {description ? (
          <em
            style={{
              color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
              fontStyle: 'normal',
              fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontWeight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {description}
          </em>
        ) : null}
      </span>

      <button
        type="button"
        className={cx('ndjc-toggle-switch', checked && 'is-checked')}
        style={{
          position: 'relative',
          width: APK_CORE_UI.toggleWidth,
          minWidth: APK_CORE_UI.toggleWidth,
          height: APK_CORE_UI.toggleHeight,
          border: 0,
          borderRadius: 999,
          padding: 0,
          background: checked ? APK_CORE_UI.toggleCheckedTrackColor : APK_CORE_UI.toggleUncheckedTrackColor,
          boxShadow: 'none',
          transition: 'background 120ms ease',
          cursor: enabled ? 'pointer' : 'not-allowed'
        }}
        disabled={!enabled}
        onClick={handleChange}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          style={{
            position: 'absolute',
            top: APK_CORE_UI.toggleThumbInset,
            left: checked
              ? APK_CORE_UI.toggleWidth - APK_CORE_UI.toggleThumbSize - APK_CORE_UI.toggleThumbInset
              : APK_CORE_UI.toggleThumbInset,
            width: APK_CORE_UI.toggleThumbSize,
            height: APK_CORE_UI.toggleThumbSize,
            borderRadius: 999,
            background: checked ? APK_CORE_UI.toggleCheckedThumbColor : APK_CORE_UI.toggleUncheckedThumbColor,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.22)',
            transition: 'left 120ms ease, background 120ms ease'
          }}
          aria-hidden="true"
        />
      </button>

      <input
        type="checkbox"
        checked={checked}
        disabled={!enabled}
        onChange={event => {
          onCheckedChange?.(event.target.checked)
          onChange?.(event.target.checked)
        }}
        style={apkVisuallyHiddenStyle}
      />
    </label>
  )
}

export function NdjcSelectionCheckbox({
  selected,
  checked,
  onClick,
  onCheckedChange,
  label = 'Select'
}: {
  selected?: boolean
  checked?: boolean
  onClick?: () => void
  onCheckedChange?: (value: boolean) => void
  label?: string
}) {
  const isChecked = checked ?? selected ?? false
  const [pressed, setPressed] = React.useState(false)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault()
    event.stopPropagation()
    onCheckedChange?.(!isChecked)
    onClick?.()
  }

  return (
    <button
      type="button"
      className={cx('ndjc-selection-checkbox', isChecked && 'is-selected')}
      style={{
        width: APK_CORE_UI.checkboxSize,
        height: APK_CORE_UI.checkboxSize,
        alignSelf: 'start',
        border: `1.5px solid ${isChecked ? APK_CORE_UI.checkboxCheckedColor : APK_CORE_UI.checkboxUncheckedColor}`,
        borderRadius: APK_CORE_UI.checkboxRadius,
        padding: 0,
        display: 'grid',
        placeItems: 'center',
        color: APK_CORE_UI.checkboxCheckmarkColor,
        background: isChecked ? APK_CORE_UI.checkboxCheckedColor : APK_CORE_UI.transparent,
        boxShadow: 'none',
        fontSize: 14,
        lineHeight: 1,
        fontWeight: 800,
        transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
        transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onPointerDown={event => {
        event.stopPropagation()
        setPressed(true)
      }}
      onPointerUp={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onPointerCancel={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onPointerLeave={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isChecked}
    >
      {isChecked ? '✓' : ''}
    </button>
  )
}

export function NdjcInlineEmptyState({
  title,
  message,
  action,
  verticalPadding = APK_CORE_UI.emptyVerticalPadding,
  fillParentMaxSize = false
}: {
  title: string
  message: string
  action?: React.ReactNode
  verticalPadding?: number
  fillParentMaxSize?: boolean
}) {
  return (
    <section
      className="ndjc-inline-empty-state"
      style={{
        ...apkInlineEmptyStateRootStyle,
        minHeight: fillParentMaxSize ? 0 : undefined,
        height: fillParentMaxSize ? '100%' : undefined,
        flex: fillParentMaxSize ? '1 1 auto' : undefined,
        alignSelf: fillParentMaxSize ? 'stretch' : undefined,
        padding: `${verticalPadding}px 0`,
        boxSizing: 'border-box'
      }}
    >
      <div style={apkInlineEmptyStateColumnStyle}>
        <p style={apkInlineEmptyStateTitleStyle}>
          {title}
        </p>

        <p style={apkInlineEmptyStateMessageStyle}>
          {message}
        </p>

        {action ? (
          <div
            style={{
              marginTop: 8,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {action}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function NdjcPaginationFooter({
  pagination,
  idleText = 'Load more',
  loadingText = 'Loading more...',
  endText = 'No more items',
  onLoadMore,
  style
}: {
  pagination: ShowcasePaginationUiState
  idleText?: string
  loadingText?: string
  endText?: string
  onLoadMore?: () => Promise<void> | void
  style?: React.CSSProperties
}) {
  const footerStyle: React.CSSProperties = {
    ...apkNoMoreListFooterStyle,
    ...style
  }

  if (pagination.isLoadingMore) {
    return (
      <footer className="ndjc-pagination-footer" style={footerStyle}>
        {loadingText}
      </footer>
    )
  }

  if (pagination.hasMore && idleText.trim()) {
    return (
      <footer className="ndjc-pagination-footer" style={footerStyle}>
        <button
          type="button"
          onClick={() => {
            if (onLoadMore) {
              void Promise.resolve(onLoadMore())
            }
          }}
          style={{
            margin: 0,
            padding: '8px 14px',
            border: 'none',
            borderRadius: 999,
            background: 'transparent',
            color: APK_CORE_UI.noMoreTextColor,
            font: 'inherit',
            cursor: onLoadMore ? 'pointer' : 'default'
          }}
        >
          {idleText}
        </button>
      </footer>
    )
  }

  if (!pagination.hasMore && endText.trim()) {
    return (
      <footer className="ndjc-pagination-footer" style={footerStyle}>
        — {endText} —
      </footer>
    )
  }

  return null
}
export function NdjcNoMoreListFooter({
  text = 'No more items'
}: {
  text?: string
}) {
  return (
    <NdjcPaginationFooter
      pagination={{
        hasMore: false,
        isLoadingMore: false
      }}
      endText={text}
    />
  )
}

export function ndjcShouldLoadMoreFromScroll(
  element: HTMLElement,
  thresholdPx = 120
): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= thresholdPx
}

export function ndjcShouldLoadOlderFromScroll(
  element: HTMLElement,
  thresholdPx = 80
): boolean {
  return element.scrollTop <= thresholdPx
}

export function ndjcHandleLoadMoreScroll(
  event: React.UIEvent<HTMLElement>,
  pagination: ShowcasePaginationUiState,
  onLoadMore: () => Promise<void> | void,
  thresholdPx = 120
): void {
  if (pagination.isLoadingMore || !pagination.hasMore) return

  const element = event.currentTarget

  if (!ndjcShouldLoadMoreFromScroll(element, thresholdPx)) return

  void Promise.resolve(onLoadMore())
}

export function ndjcHandleLoadOlderScroll(
  event: React.UIEvent<HTMLElement>,
  pagination: ShowcasePaginationUiState,
  onLoadOlder: () => Promise<void> | void,
  thresholdPx = 80
): void {
  if (pagination.isLoadingMore || !pagination.hasMore) return

  const element = event.currentTarget

  if (!ndjcShouldLoadOlderFromScroll(element, thresholdPx)) return

  void Promise.resolve(onLoadOlder())
}

export function NdjcSnackbarHost({
  message,
  onDismiss,
  durationMs = 3000
}: {
  message?: string | null
  onDismiss?: () => void
  durationMs?: number
}) {
  const normalizedMessage = String(message || '').trim()
  const [visible, setVisible] = React.useState(false)
  const onDismissRef = React.useRef(onDismiss)

  React.useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  React.useEffect(() => {
    if (!normalizedMessage) {
      setVisible(false)
      return
    }

    setVisible(true)

    const timer = window.setTimeout(() => {
      setVisible(false)
      onDismissRef.current?.()
    }, durationMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [normalizedMessage, durationMs])

  if (!normalizedMessage || !visible) return null

  return (
    <section className="ndjc-snackbar-host" style={apkSnackbarHostStyle} role="status">
      <div style={apkSnackbarSurfaceStyle}>
        <p style={apkSnackbarTextStyle}>
          {normalizedMessage}
        </p>
      </div>
    </section>
  )
}

export function NdjcSyncErrorBanner({
  message,
  onRetry,
  onDismiss
}: {
  message?: string | null
  onRetry?: () => void
  onDismiss?: () => void
}) {
  if (!message) return null

  return (
    <section className="ndjc-sync-error-banner" style={apkSyncErrorBannerOuterStyle}>
      <div style={apkSyncErrorBannerSurfaceStyle}>
        <p style={apkSyncErrorBannerTextStyle}>
          {message}
        </p>

        {onRetry ? (
          <button
            type="button"
            style={apkSyncErrorBannerButtonStyle}
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}

        {onDismiss ? (
          <button
            type="button"
            style={apkSyncErrorBannerButtonStyle}
            onClick={onDismiss}
          >
            Close
          </button>
        ) : null}
      </div>
    </section>
  )
}

export function normalizeStoreUnavailableLinkHref(value: string): string {
  const text = value.trim()

  if (!text) return '#'
  if (text.startsWith('https://') || text.startsWith('http://')) return text

  return `https://${text}`
}

export function renderStoreUnavailableMessageLine(line: string): React.ReactNode {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlPattern.exec(line)) !== null) {
    const matchedText = match[0]
    const start = match.index
    const end = start + matchedText.length

    if (start > lastIndex) {
      parts.push(line.slice(lastIndex, start))
    }

    parts.push(
      <a
        key={`${matchedText}_${start}`}
        href={normalizeStoreUnavailableLinkHref(matchedText)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: APK_CORE_UI.ink,
          fontWeight: 800,
          textDecoration: 'underline',
          textUnderlineOffset: 3
        }}
      >
        {matchedText}
      </a>
    )

    lastIndex = end
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex))
  }

  return parts.length > 0 ? parts : line
}

export function NdjcStoreUnavailableOverlay({
  state,
  children
}: {
  state: ShowcaseStoreUnavailableUiState
  children: React.ReactNode
}) {
  if (!state.visible) return <>{children}</>

  const messageLines = state.message
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: APK_CORE_UI.softSurface
      }}
      aria-label={state.title}
    >
      <style>
        {`
          .ndjc-notification-opt-in-floating-button {
            display: none !important;
          }
        `}
      </style>

      <div
        aria-hidden="true"
        style={{
          minHeight: '100dvh',
          width: '100%',
          filter: 'blur(8px)',
          transform: 'scale(1.015)',
          transformOrigin: 'center',
          opacity: 0.56,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {children}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-store-unavailable-title"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'rgba(15, 23, 42, 0.34)',
          boxSizing: 'border-box',
          pointerEvents: 'auto'
        }}
      >
        <section
          style={{
            width: '100%',
            maxWidth: 360,
            minWidth: 0,
            borderRadius: 28,
            padding: '24px 22px 22px',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid rgba(17, 24, 39, 0.08)',
            boxShadow: '0 28px 80px rgba(15, 23, 42, 0.28)',
            boxSizing: 'border-box',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)'
          }}
        >
          <h1
            id="ndjc-store-unavailable-title"
            style={{
              margin: 0,
              color: APK_CORE_UI.black,
              fontSize: 20,
              lineHeight: 1.25,
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}
          >
            {state.title}
          </h1>

          <section
            style={{
              marginTop: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            {messageLines.map((line, index) => (
              <p
                key={`${line}_${index}`}
                style={{
                  margin: 0,
                  color: 'rgba(17, 24, 39, 0.82)',
                  fontSize: 16,
                  lineHeight: 1.45,
                  fontWeight: 500
                }}
              >
                {renderStoreUnavailableMessageLine(line)}
              </p>
            ))}
          </section>
        </section>
      </div>
    </section>
  )
}

export function NdjcOfflineStatusBanner({
  message
}: {
  message?: string | null
}) {
  const normalizedMessage = String(message || '').trim()

  if (!normalizedMessage) return null

  return (
    <section
      className="ndjc-offline-status-banner"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        top: 'calc(2px + env(safe-area-inset-top))',
        zIndex: 1000001,
        width: 'calc(100% - 24px)',
        maxWidth: 456,
        minWidth: 0,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        transform: 'translateX(-50%)'
      }}
    >
      <div
        style={{
          width: 'fit-content',
          maxWidth: '100%',
          height: 34,
          minHeight: 34,
          borderRadius: 999,
          padding: '0 13px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(17, 24, 39, 0.88)',
          color: '#ffffff',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.22)',
          boxSizing: 'border-box',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 20,
            height: 34,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0,
            lineHeight: 0
          }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
            style={{
              display: 'block'
            }}
          >
            <path
              d="M3.75 8.7A14.5 14.5 0 0 1 12 6.1c2.05 0 4 .43 5.75 1.2"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.1 12.05A8.7 8.7 0 0 1 12 10.55c1.1 0 2.15.2 3.1.58"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.25 15.35A3.85 3.85 0 0 1 12 14.95c.38 0 .75.05 1.1.16"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19.2h.01"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.8 4.8l14.4 14.4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <p
          style={{
            margin: 0,
            minWidth: 0,
            height: 34,
            color: '#ffffff',
            fontSize: 12,
            lineHeight: '34px',
            fontWeight: 900,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {normalizedMessage}
        </p>
      </div>
    </section>
  )
}

export function notificationOptInMessageText(messageCode: ShowcaseNotificationMessageCode): string | null {
  if (messageCode === 'notifications-allowed-auto') {
    return 'Notifications are allowed. This device will stay registered automatically.'
  }

  if (messageCode === 'notifications-blocked-site-settings') {
    return 'Notifications are blocked for this site. Enable them from your browser site settings.'
  }

  if (messageCode === 'notifications-unsupported-browser') {
    return 'Notifications are not supported in this browser.'
  }

  if (messageCode === 'offline-reconnect') {
    return 'You are offline. Please reconnect and try again.'
  }

  if (messageCode === 'notifications-blocked-enable-site-settings') {
    return 'Notifications are blocked. Enable them from your browser site settings.'
  }

  if (messageCode === 'notifications-not-enabled-try-later') {
    return 'Notifications were not enabled. You can try again later.'
  }

  if (messageCode === 'push-registration-failed-after-allowed') {
    return 'Notifications were allowed, but push registration failed.'
  }

  if (messageCode === 'device-registration-failed') {
    return 'Device registration failed. Try again later.'
  }

  if (messageCode === 'notifications-enabled-device') {
    return null
  }

  if (messageCode === 'notifications-active') {
    return null
  }

  if (messageCode === 'push-registration-failed-check-connection') {
    return 'Push registration failed. Check your connection and try again.'
  }

  return null
}

export function NdjcPwaUpdateBanner({
  refreshing,
  onRefresh,
  onDismiss
}: {
  refreshing: boolean
  onRefresh: () => void
  onDismiss: () => void
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 14,
        right: 14,
        top: 'calc(8px + env(safe-area-inset-top))',
        zIndex: 1000002,
        minWidth: 0,
        maxWidth: 'calc(100% - 28px)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <style>
        {`
          .ndjc-pwa-update-banner {
            border: 1px solid rgba(17, 24, 39, 0.07) !important;
            background: rgba(255, 255, 255, 0.98) !important;
          }

          .ndjc-pwa-update-banner::before,
          .ndjc-pwa-update-banner::after {
            display: none !important;
            content: none !important;
          }

          .ndjc-pwa-update-secondary-button {
            width: 72px !important;
            min-width: 72px !important;
            max-width: 72px !important;
            min-height: 32px !important;
            height: 32px !important;
            padding: 0 10px !important;
            border-radius: 999px !important;
            background: #f3f4f6 !important;
            color: #374151 !important;
            border: 1px solid rgba(17, 24, 39, 0.08) !important;
            box-shadow: none !important;
            font-size: 12px !important;
            line-height: 1 !important;
            font-weight: 850 !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .ndjc-pwa-update-primary-button {
            width: 72px !important;
            min-width: 72px !important;
            max-width: 72px !important;
            min-height: 32px !important;
            height: 32px !important;
            padding: 0 10px !important;
            border-radius: 999px !important;
            font-size: 12px !important;
            line-height: 1 !important;
            font-weight: 900 !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .ndjc-pwa-update-secondary-button:active,
          .ndjc-pwa-update-primary-button:active {
            transform: scale(0.98);
          }
        `}
      </style>

      <NdjcWhiteCard
        className="ndjc-pwa-update-banner"
        style={{
          width: '100%',
          maxWidth: 425,
          minWidth: 0,
          borderRadius: 18,
          padding: '9px 10px',
          pointerEvents: 'auto',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.10)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: '28px minmax(0, 1fr) auto',
            gap: 9,
            alignItems: 'center',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F3F4F6',
              color: '#2A2F35',
              boxShadow: 'inset 0 0 0 1px rgba(17, 24, 39, 0.08)',
              lineHeight: 1,
              flexShrink: 0
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
              style={{
                display: 'block',
                transform: 'translateY(0.25px)'
              }}
            >
              <path
                d="M12.85 6.85A4.9 4.9 0 0 0 4.15 4.2L3.35 5"
                stroke="#2A2F35"
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.25 2.9V5h2.1"
                stroke="#2A2F35"
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.15 9.15a4.9 4.9 0 0 0 8.7 2.65l.8-.8"
                stroke="#2A2F35"
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.75 13.1V11h-2.1"
                stroke="#2A2F35"
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
            <h2
              style={{
                margin: 0,
                color: '#111827',
                fontSize: 13,
                lineHeight: 1.18,
                fontWeight: 900,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Update ready
            </h2>

            <p
              style={{
                margin: '3px 0 0',
                color: 'rgba(17, 24, 39, 0.58)',
                fontSize: 11,
                lineHeight: 1.22,
                fontWeight: 650,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Refresh to complete the update.
            </p>
          </div>

          <div
            style={{
              width: 151,
              minWidth: 0,
              maxWidth: 151,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 7,
              flexShrink: 0,
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <NdjcControlPillButton
              className="ndjc-pwa-update-secondary-button"
              active
              tone="adminAction"
              onClick={onDismiss}
              disabled={refreshing}
            >
              Later
            </NdjcControlPillButton>

            <NdjcControlPillButton
              className="ndjc-pwa-update-primary-button"
              active
              tone="adminAction"
              onClick={onRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Updating...' : 'Refresh'}
            </NdjcControlPillButton>
          </div>
        </div>
      </NdjcWhiteCard>
    </div>
  )
}

export function NdjcNotificationOptInPanel({
  open,
  busy,
  registered,
  permissionState,
  registrationState,
  messageCode,
  debugMessage,
  installState,
  installBusy,
  onRegister,
  onInstall,
  onClose
}: {
  open: boolean
  busy: boolean
  registered: boolean
  permissionState: ShowcaseNotificationPermissionState
  registrationState: ShowcaseNotificationRegistrationState
  messageCode: ShowcaseNotificationMessageCode
  debugMessage?: string | null
  installState: ShowcasePwaInstallState
  installBusy: boolean
  onRegister: () => void
  onInstall: () => void
  onClose: () => void
}) {
  const blocked = permissionState === 'denied'
  const failed = registrationState === 'failed'
  const title = 'Notifications'
  const description = registrationState === 'registered'
    ? 'This device can receive chat, booking, and announcement notifications.'
    : blocked
      ? 'Allow notifications in browser settings to receive chat, booking, and announcement updates.'
      : failed
        ? 'Device registration failed. Retry to receive chat, booking, and announcement updates.'
        : 'Enable notifications to receive chat, booking, and announcement updates.'
  const statusLabel = registrationState === 'registered'
    ? 'On'
    : blocked
      ? 'Blocked'
      : failed
        ? 'Failed'
        : 'Off'
  const actionLabel = busy
    ? 'Saving...'
    : registrationState === 'registered'
      ? 'Refresh'
      : blocked || failed
        ? 'Retry'
        : 'Enable'
  const installInstallable = installState === 'installable'
  const installManual = installState === 'ios-manual' || installState === 'safari-required'
  const installGuideDescription = 'Open the browser menu and choose Add to Home Screen or Install app for faster access and better notification support. If you do not see this option, try Chrome, Edge, or Safari. Already added? You can ignore this.'
  const installStatusLabel = installInstallable
    ? 'Ready'
    : installManual
      ? 'Manual'
      : 'Guide'
  const installTitle = 'Add to Home Screen'
  const installDescription = installInstallable
    ? 'Add this customer hub to your device for faster access and better notification support. Already added? You can ignore this.'
    : installManual
      ? 'Tap Share, then Add to Home Screen for faster access and better notification support. Already added? You can ignore this.'
      : installGuideDescription
  const installActionLabel = installBusy ? 'Opening...' : 'Add'
  const normalizedDebugMessage = String(debugMessage || '').trim()

  return (
    <div
      aria-hidden={!open}
      onClick={open ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998,
        pointerEvents: open ? 'auto' : 'none',
        background: 'transparent'
      }}
    >
      <div
        onClick={(event) => {
          event.stopPropagation()
        }}
        style={{
          position: 'absolute',
          right: 'max(16px, calc((100% - 480px) / 2 + 16px))',
          bottom: open ? 'calc(121px + env(safe-area-inset-bottom))' : -1000,
          zIndex: 999999,
          width: 'calc(100% - 32px)',
          maxWidth: 280,
          minWidth: 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'bottom 180ms ease, opacity 160ms ease, transform 160ms ease',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(8px)',
          boxSizing: 'border-box'
        }}
      >
        <NdjcWhiteCard
          className="ndjc-notification-opt-in-panel"
        style={{
          borderRadius: 20,
          padding: '10px 10px 9px',
          border: '1px solid rgba(17, 24, 39, 0.08)',
          background: 'rgba(255, 255, 255, 0.96)',
          boxShadow: '0 14px 38px rgba(15, 23, 42, 0.18)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxSizing: 'border-box'
        }}
      >
        <style>
          {`
            .ndjc-notification-opt-in-panel {
              box-sizing: border-box;
            }

            .ndjc-notification-opt-in-panel::before,
            .ndjc-notification-opt-in-panel::after {
              display: none !important;
              content: none !important;
            }

            .ndjc-notification-action-button {
              min-height: 32px !important;
              height: 32px !important;
              border-radius: 999px !important;
              font-size: 13px !important;
              font-weight: 900 !important;
            }
          `}
        </style>

        <div
          style={{
            display: 'grid',
            gap: 10
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 2
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#111827',
                fontSize: 16,
                lineHeight: 1.18,
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              App setup
            </h2>
            <p
              style={{
                margin: 0,
                color: 'rgba(17, 24, 39, 0.58)',
                fontSize: 11,
                lineHeight: 1.35,
                fontWeight: 700
              }}
            >
              Set up alerts and quick access for this app.
            </p>
          </div>

          <section
            style={{
              borderRadius: 16,
              padding: 10,
              background: 'rgba(248, 250, 252, 0.78)',
              border: '1px solid rgba(15, 23, 42, 0.07)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                gap: 10,
                alignItems: 'start'
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92))',
                  color: '#2A2F35',
                  boxShadow: 'inset 0 0 0 1px rgba(17, 24, 39, 0.08), 0 6px 14px rgba(15, 23, 42, 0.08)',
                  flexShrink: 0,
                  position: 'relative',
                  marginTop: 1
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    display: 'block'
                  }}
                >
                  <path
                    d="M12 3.75c-3.05 0-5.45 2.45-5.45 5.55v2.3c0 1.28-.45 2.52-1.28 3.49L4.35 16.2c-.54.64-.08 1.62.76 1.62h13.78c.84 0 1.3-.98.76-1.62l-.92-1.11a5.37 5.37 0 0 1-1.28-3.49V9.3c0-3.1-2.4-5.55-5.45-5.55Z"
                    stroke="currentColor"
                    strokeWidth="2.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.7 19.25c.42.75 1.22 1.25 2.3 1.25s1.88-.5 2.3-1.25"
                    stroke="currentColor"
                    strokeWidth="2.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.75 6.05c.72.62 1.18 1.52 1.25 2.55"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </svg>
              </div>

              <div
                style={{
                  minWidth: 0,
                  display: 'grid',
                  gap: 8
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    minWidth: 0
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: 15,
                      lineHeight: 1.16,
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      minWidth: 0
                    }}
                  >
                    {title}
                  </h2>

                  <span
                    style={{
                      height: 21,
                      padding: '1px 8px 0',
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      background: registrationState === 'registered'
                        ? 'rgba(236, 253, 245, 0.92)'
                        : blocked || failed
                          ? 'rgba(255, 241, 242, 0.92)'
                          : '#ffffff',
                      color: registrationState === 'registered'
                        ? '#047857'
                        : blocked || failed
                          ? '#be123c'
                          : '#475569',
                      border: registrationState === 'registered'
                        ? '1px solid rgba(4, 120, 87, 0.14)'
                        : blocked || failed
                          ? '1px solid rgba(190, 18, 60, 0.14)'
                          : '1px solid rgba(71, 85, 105, 0.14)',
                      fontSize: 11,
                      lineHeight: '12px',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxSizing: 'border-box'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 999,
                        background: registrationState === 'registered'
                          ? '#10b981'
                          : blocked || failed
                            ? '#fb7185'
                            : '#94a3b8',
                        flexShrink: 0
                      }}
                    />
                    {statusLabel}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(17, 24, 39, 0.66)',
                    fontSize: 12,
                    lineHeight: 1.36,
                    fontWeight: 600
                  }}
                >
                  {description}
                </p>

                {normalizedDebugMessage
                  ? (
                      <pre
                        style={{
                          margin: 0,
                          maxHeight: 112,
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          borderRadius: 12,
                          padding: '8px 9px',
                          background: 'rgba(15, 23, 42, 0.05)',
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          color: 'rgba(17, 24, 39, 0.72)',
                          fontSize: 10,
                          lineHeight: 1.42,
                          fontWeight: 700,
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          boxSizing: 'border-box'
                        }}
                      >
                        {normalizedDebugMessage}
                      </pre>
                    )
                  : null}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <div style={{ width: 116 }}>
                    <NdjcControlPillButton
                      active
                      tone="adminAction"
                      fullWidth
                      onClick={onRegister}
                      disabled={busy}
                    >
                      {busy ? 'Working...' : actionLabel}
                    </NdjcControlPillButton>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              borderRadius: 16,
              padding: 10,
              background: 'rgba(248, 250, 252, 0.78)',
              border: '1px solid rgba(15, 23, 42, 0.07)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                gap: 10,
                alignItems: 'start'
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92))',
                  color: '#2A2F35',
                  boxShadow: 'inset 0 0 0 1px rgba(17, 24, 39, 0.08), 0 6px 14px rgba(15, 23, 42, 0.08)',
                  flexShrink: 0,
                  position: 'relative',
                  marginTop: 1
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    display: 'block'
                  }}
                >
                  <rect
                    x="7"
                    y="2.75"
                    width="10"
                    height="18.5"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M10.25 17.75h3.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.5 6.25h5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>


              </div>

              <div
                style={{
                  minWidth: 0,
                  display: 'grid',
                  gap: 8
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    minWidth: 0
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: 15,
                      lineHeight: 1.16,
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      minWidth: 0
                    }}
                  >
                    {installTitle}
                  </h2>

                  <span
                    style={{
                      height: 21,
                      padding: '1px 8px 0',
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      background: '#ffffff',
                      color: '#374151',
                      border: '1px solid rgba(71, 85, 105, 0.14)',
                      fontSize: 11,
                      lineHeight: '12px',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxSizing: 'border-box'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 999,
                        background: '#374151',
                        flexShrink: 0
                      }}
                    />
                    {installStatusLabel}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(17, 24, 39, 0.66)',
                    fontSize: 12,
                    lineHeight: 1.36,
                    fontWeight: 600
                  }}
                >
                  {installDescription}
                </p>

                {installInstallable ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <div style={{ width: 116 }}>
                      <NdjcControlPillButton
                        active
                        tone="adminAction"
                        fullWidth
                        onClick={onInstall}
                        disabled={installBusy}
                      >
                        {installActionLabel}
                      </NdjcControlPillButton>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
        </NdjcWhiteCard>
      </div>
    </div>
  )
}

export function NdjcNotificationOptInFloatingButton({
  open,
  permissionState,
  registrationState,
  onToggle
}: {
  open: boolean
  permissionState: ShowcaseNotificationPermissionState
  registrationState: ShowcaseNotificationRegistrationState
  onToggle: () => void
}) {
  const registered = registrationState === 'registered'
  const blocked = permissionState === 'denied'
  const failed = registrationState === 'failed'
  const hasProblem = failed || blocked
  const ariaLabel = open ? 'Close app setup' : 'Open app setup'
  const iconTint = '#111111'

  const notificationIcon = open ? (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        color: 'currentColor',
        fontSize: APK_SHELL_UI.backButtonIconSize,
        lineHeight: 1,
        fontWeight: 900,
        transform: 'translateY(-1px)'
      }}
    >
      ×
    </span>
  ) : (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: APK_SHELL_UI.backButtonIconSize,
        height: APK_SHELL_UI.backButtonIconSize,
        display: 'grid',
        placeItems: 'center',
        color: 'currentColor',
        lineHeight: 0
      }}
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{
          display: 'block'
        }}
      >
        <path
          d="M12 3.25c-3.35 0-5.95 2.68-5.95 6.05v2.3c0 1.16-.41 2.29-1.16 3.17l-.92 1.1c-.83.98-.13 2.48 1.15 2.48h13.76c1.28 0 1.98-1.5 1.15-2.48l-.92-1.1a4.9 4.9 0 0 1-1.16-3.17V9.3c0-3.37-2.6-6.05-5.95-6.05Z"
          fill="currentColor"
        />
        <path
          d="M9.3 19.25c.47 1.08 1.42 1.75 2.7 1.75s2.23-.67 2.7-1.75H9.3Z"
          fill="currentColor"
        />
      </svg>

      {registered ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: '#10b981',
            boxShadow: '0 0 0 2px #ffffff'
          }}
        />
      ) : null}

      {hasProblem ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: '#be123c',
            boxShadow: '0 0 0 2px #ffffff'
          }}
        />
      ) : null}
    </span>
  )

  return (
    <div
      className="ndjc-notification-opt-in-floating-button"
      style={{
        position: 'fixed',
        left: 'calc(50vw + min(50vw, 240px) - 50px - 16px)',
        bottom: 'calc(63px + env(safe-area-inset-bottom))',
        zIndex: 1000000,
        width: 50,
        height: 50,
        pointerEvents: 'auto'
      }}
    >
      <NdjcCardBackButton
        onClick={onToggle}
        label={ariaLabel}
        icon={notificationIcon}
        iconOnly={false}
        iconTint={iconTint}
      />
    </div>
  )
}

export function NdjcBaseDialog({
  title,
  message,
  children,
  textContent,
  confirmText = 'OK',
  cancelText = 'Cancel',
  dismissText,
  onConfirm,
  onConfirmClick,
  onCancel,
  onDismissClick,
  onDismissRequest,
  confirmEnabled = true,
  confirmLoading = false,
  destructiveConfirm = false
}: {
  title: string
  message?: string | null
  children?: React.ReactNode
  textContent?: React.ReactNode
  dismissText?: string | null
  onConfirmClick?: () => void
  onDismissClick?: () => void
} & NdjcDialogActions) {
  const resolvedConfirmText = confirmText
  const resolvedDismissText = dismissText ?? cancelText
  const handleDismissRequest = onDismissRequest || onDismissClick || onCancel
  const handleDismissClick = onDismissClick || onCancel
  const handleConfirmClick = onConfirmClick || onConfirm
  const confirmBlocked = !confirmEnabled || confirmLoading

  return (
    <section
      className="ndjc-dialog-backdrop"
      style={apkDialogBackdropStyle}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          if (confirmLoading) return
          handleDismissRequest?.()
        }
      }}
    >
      <section
        className="ndjc-base-dialog"
        style={apkDialogSurfaceStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-base-dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="ndjc-base-dialog-title" style={apkDialogTitleStyle}>
          {title}
        </h2>

        {textContent ? (
          <div className="ndjc-base-dialog-content" style={apkDialogContentStyle}>
            {textContent}
          </div>
        ) : children ? (
          <div className="ndjc-base-dialog-content" style={apkDialogContentStyle}>
            {children}
          </div>
        ) : message?.trim() ? (
          <p style={apkDialogMessageStyle}>
            {message}
          </p>
        ) : null}

        <footer style={apkDialogActionsStyle}>
          {resolvedDismissText && handleDismissClick ? (
            <button
              type="button"
              style={apkDialogTextButtonStyle({
                disabled: confirmLoading
              })}
              disabled={confirmLoading}
              onClick={() => {
                if (confirmLoading) return
                handleDismissClick()
              }}
            >
              {resolvedDismissText}
            </button>
          ) : null}

          {handleConfirmClick ? (
            <button
              type="button"
              style={apkDialogTextButtonStyle({
                primary: !destructiveConfirm,
                destructive: destructiveConfirm,
                disabled: confirmBlocked
              })}
              disabled={confirmBlocked}
              onClick={handleConfirmClick}
              aria-busy={confirmLoading || undefined}
            >
              {confirmLoading ? (
                <NdjcSpinner
                  className="ndjc-dialog-action-spinner"
                  size={16}
                  stroke={2}
                  tone={destructiveConfirm ? 'danger' : 'primary'}
                />
              ) : (
                resolvedConfirmText
              )}
            </button>
          ) : null}
        </footer>
      </section>
    </section>
  )
}

export function DeleteConfirmDialog({
  title = 'Confirm deletion',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onDismissRequest,
  confirmEnabled = true
}: {
  title?: string
  message?: string
} & NdjcDialogActions) {
  const handleDismiss = onDismissRequest || onCancel

  return (
    <section
      className="ndjc-dialog-backdrop ndjc-delete-confirm-dialog-backdrop"
      style={apkDialogBackdropStyle}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          handleDismiss?.()
        }
      }}
    >
      <section
        className="ndjc-base-dialog ndjc-delete-confirm-dialog"
        style={apkDialogSurfaceStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-delete-dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="ndjc-delete-dialog-title" style={{ ...apkDialogTitleStyle, fontSize: 18 }}>
          {title}
        </h2>

        <p style={apkDialogMessageStyle}>
          {message}
        </p>

        <footer style={apkDialogActionsStyle}>
          <button
            type="button"
            style={apkDialogTextButtonStyle({ destructive: true, disabled: !confirmEnabled })}
            disabled={!confirmEnabled}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

          <button
            type="button"
            style={apkDialogTextButtonStyle()}
            onClick={onCancel || onDismissRequest}
          >
            {cancelText}
          </button>
        </footer>
      </section>
    </section>
  )
}

export function DeleteConfirmDialogPreview() {
  return (
    <DeleteConfirmDialog
      title="Confirm deletion"
      message="This action cannot be undone."
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

export function SheetHeader({
  title,
  clearText = 'Clear',
  showAction = true,
  showDivider = true,
  headerPaddingX = APK_FILTER_UI.sheetHeaderPaddingX,
  onClear
}: {
  title: string
  clearText?: string
  showAction?: boolean
  showDivider?: boolean
  headerPaddingX?: number
  onClear?: () => void
}) {
  return (
    <header className="ndjc-sheet-header" style={apkSheetHeaderRootStyle}>
      <div
        className="ndjc-sheet-header-row"
        style={{
          ...apkSheetHeaderRowStyle,
          padding: `${APK_FILTER_UI.sheetHeaderPaddingTop}px ${headerPaddingX}px ${APK_FILTER_UI.sheetHeaderPaddingBottom}px`
        }}
      >
        <h2 id="ndjc-filter-bottom-sheet-title" style={apkSheetHeaderTitleStyle}>
          {title}
        </h2>

        {showAction && onClear ? (
          <NdjcControlPillButton
            active
            tone="adminAction"
            onClick={onClear}
          >
            {clearText}
          </NdjcControlPillButton>
        ) : null}
      </div>

      {showDivider ? (
        <div className="ndjc-sheet-header-divider" style={apkSheetDividerStyle} aria-hidden="true" />
      ) : null}
    </header>
  )
}

export function NdjcFilterBottomSheet({
  open,
  title = 'Filter',
  clearText = 'Clear',
  applyText = 'Apply',
  children,
  onClose,
  onApply,
  onClear,
  priceMinDraft = '',
  onPriceMinDraftChange,
  priceMaxDraft = '',
  onPriceMaxDraftChange,
  showPriceFields = false,
  showHeaderAction = true,
  showHeaderDivider = true,
  headerPaddingX,
  showApplyButton = true,
  applyLoading = false
}: {
  open: boolean
  title?: string
  clearText?: string
  applyText?: string
  children: React.ReactNode
  onClose: () => void
  onApply?: () => void
  onClear?: () => void
  priceMinDraft?: string
  onPriceMinDraftChange?: (value: string) => void
  priceMaxDraft?: string
  onPriceMaxDraftChange?: (value: string) => void
  showPriceFields?: boolean
  showHeaderAction?: boolean
  showHeaderDivider?: boolean
  headerPaddingX?: number
  showApplyButton?: boolean
  applyLoading?: boolean
}) {
  const sheetRef = React.useRef<HTMLElement | null>(null)
  const dragStartYRef = React.useRef<number | null>(null)
  const dragDeltaYRef = React.useRef(0)
  const closeTimerRef = React.useRef<number | null>(null)
  const openFrameRef = React.useRef<number | null>(null)
  const onCloseRef = React.useRef(onClose)
  const [dragOffsetY, setDragOffsetY] = React.useState(0)
  const [sheetVisible, setSheetVisible] = React.useState(false)

  React.useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  React.useEffect(() => {
    if (!open) {
      dragStartYRef.current = null
      dragDeltaYRef.current = 0
      setDragOffsetY(0)
      setSheetVisible(false)
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    setSheetVisible(false)

    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = null
      setSheetVisible(true)
    })

    function handleWindowKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
      }
    }

    window.addEventListener('keydown', handleWindowKeyDown)

    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow

      if (openFrameRef.current != null) {
        window.cancelAnimationFrame(openFrameRef.current)
        openFrameRef.current = null
      }

      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [open])

  if (!open) return null

  function requestClose(): void {
    if (closeTimerRef.current != null) return

    dragStartYRef.current = null
    dragDeltaYRef.current = 0
    setDragOffsetY(0)
    setSheetVisible(false)

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      onCloseRef.current()
    }, 220)
  }

  function handleBackdropPointerDown(event: React.PointerEvent<HTMLElement>): void {
    if (event.target === event.currentTarget) {
      requestClose()
    }
  }

  function handleSheetPointerDown(event: React.PointerEvent<HTMLElement>): void {
    event.stopPropagation()
  }

  function handleDragHandlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    dragStartYRef.current = event.clientY
    dragDeltaYRef.current = 0
    setDragOffsetY(0)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.preventDefault()
    event.stopPropagation()
  }

  function handleDragHandlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    if (dragStartYRef.current == null) return

    const deltaY = Math.max(0, event.clientY - dragStartYRef.current)
    dragDeltaYRef.current = deltaY
    setDragOffsetY(deltaY)
    event.preventDefault()
    event.stopPropagation()
  }

  function finishDrag(): void {
    if (dragStartYRef.current == null) return

    const shouldDismiss = dragDeltaYRef.current >= APK_FILTER_UI.sheetDragDismissThreshold
    dragStartYRef.current = null
    dragDeltaYRef.current = 0

    if (shouldDismiss) {
      requestClose()
      return
    }

    setDragOffsetY(0)
  }

  function handleDragHandlePointerUp(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()
    finishDrag()
  }

  function handleDragHandlePointerCancel(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()
    finishDrag()
  }

  function handleClearClick(): void {
    onClear?.()
  }

  function handleApplyClick(): void {
    onApply?.()
  }

  return (
    <section
      className="ndjc-sheet-backdrop"
      style={{
        ...apkSheetBackdropStyle,
        opacity: sheetVisible ? 1 : 0,
        transition: 'opacity 180ms ease',
        pointerEvents: sheetVisible ? 'auto' : 'none'
      }}
      onPointerDown={handleBackdropPointerDown}
    >
      <section
        ref={sheetRef}
        className="ndjc-filter-bottom-sheet"
        style={{
          ...apkSheetSurfaceStyle,
          transform: sheetVisible
            ? `translateY(${dragOffsetY}px)`
            : 'translateY(calc(100% + 24px))',
          transition: dragStartYRef.current == null
            ? 'transform 220ms cubic-bezier(0.2, 0, 0, 1)'
            : 'none',
          willChange: 'transform'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-filter-bottom-sheet-title"
        onPointerDown={handleSheetPointerDown}
      >
        <div
          className="ndjc-filter-bottom-sheet-drag-handle-wrap"
          style={apkSheetDragHandleWrapStyle}
          onPointerDown={handleDragHandlePointerDown}
          onPointerMove={handleDragHandlePointerMove}
          onPointerUp={handleDragHandlePointerUp}
          onPointerCancel={handleDragHandlePointerCancel}
          aria-hidden="true"
        >
          <div className="ndjc-filter-bottom-sheet-drag-handle" style={apkSheetDragHandleStyle} />
        </div>

        <SheetHeader
          title={title}
          clearText={clearText}
          showAction={showHeaderAction && Boolean(onClear)}
          showDivider={showHeaderDivider}
          headerPaddingX={headerPaddingX}
          onClear={handleClearClick}
        />

        <div className="ndjc-filter-bottom-sheet-content" style={apkSheetContentStyle}>
          {showPriceFields ? (
            <section
              className="ndjc-filter-bottom-sheet-price-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: NDJC_GLOBAL_UI_TOKENS.rhythm.fieldToHelper,
                alignItems: 'start',
                boxSizing: 'border-box'
              }}
            >
              <NdjcTextField
                label="Min price"
                value={priceMinDraft}
                onChange={onPriceMinDraftChange || (() => {})}
                placeholder="0"
                type="number"
                inputMode="decimal"
                singleLine
              />

              <NdjcTextField
                label="Max price"
                value={priceMaxDraft}
                onChange={onPriceMaxDraftChange || (() => {})}
                placeholder="999"
                type="number"
                inputMode="decimal"
                singleLine
              />
            </section>
          ) : null}

          {children}

          {showApplyButton && onApply ? (
            <>
              <div style={{ height: 4 }} aria-hidden="true" />

              <NdjcControlPillButton
                disabled={applyLoading}
                active
                tone="adminAction"
                fullWidth
                onClick={() => {
                  if (applyLoading) return
                  handleApplyClick()
                }}
              >
                {applyLoading ? 'Applying...' : applyText}
              </NdjcControlPillButton>
            </>
          ) : null}
        </div>
      </section>
    </section>
  )
}
export function SmallActiveChip({
  text,
  onClick
}: {
  text: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="ndjc-small-active-chip"
      style={apkFilterChipStyle(false)}
      onClick={onClick}
    >
      <span className="ndjc-small-active-chip-text" style={apkSmallActiveChipTextStyle}>
        {text}
      </span>

      <span
        className="ndjc-small-active-chip-remove"
        style={{
          color: APK_FILTER_UI.chipRemoveColor,
          fontWeight: 700
        }}
        aria-hidden="true"
      >
        ×
      </span>
    </button>
  )
}


export function NdjcCatalogItemCard({
  dish,
  selected,
  onOpen,
  onToggleSelect,
  trailing,
  bottom,
  bottomContent,
  metaText,
  showCategory = true
}: {
  dish: DemoDish
  selected?: boolean
  onOpen?: (id: string) => void
  onToggleSelect?: (id: string) => void
  trailing?: React.ReactNode
  bottom?: React.ReactNode
  bottomContent?: React.ReactNode
  metaText?: string | null
  showCategory?: boolean
}) {
  const title = titleForDish(dish)
  const salePrice = getDishPrice(dish)
  const categoryLabel = categoryForDish(dish)
  const resolvedBottomContent = bottomContent ?? bottom ?? null
  const resolvedMetaText = String(metaText || '').trim()
  const hasDiscount =
    typeof dish.discountPrice === 'number' &&
    dish.discountPrice > 0 &&
    dish.discountPrice < dish.originalPrice
  const [pressed, setPressed] = React.useState(false)

  function handleOpenClick(): void {
    if (!onOpen) return
    onOpen(dish.id)
  }

  function clearPressed(): void {
    setPressed(false)
  }

  return (
    <article
      className={cx('ndjc-catalog-item-card', selected && 'is-selected', dish.isSoldOut && 'is-disabled')}
      style={{
        ...apkCatalogCardStyle(pressed),
        opacity: dish.isSoldOut ? APK_SHOWCASE_ITEM_UI.disabledAlpha : 1,
        outline: '0 solid transparent'
      }}
    >
      <button
        type="button"
        className="ndjc-catalog-item-main"
        style={apkCatalogMainButtonStyle}
        disabled={!onOpen}
        onPointerDown={() => setPressed(true)}
        onPointerUp={clearPressed}
        onPointerCancel={clearPressed}
        onPointerLeave={clearPressed}
        onClick={handleOpenClick}
      >
<span className="ndjc-catalog-item-media" style={apkCatalogMediaStyle}>
  <NdjcShimmerImage
    src={dishImage(dish)}
    alt={title}
    placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.catalogImageRadius}
    contentScale="cover"
  />
</span>

        <span className="ndjc-catalog-item-body" style={apkCatalogBodyStyle}>
          <strong className="ndjc-catalog-item-title" style={apkCatalogTitleStyle}>
            {title}
          </strong>

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <NdjcItemStatusBadgeRow
            recommended={dish.isRecommended}
            hidden={dish.isHidden}
          />

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <span className="ndjc-catalog-price-stack" style={apkCatalogPriceStackStyle}>
            {resolvedBottomContent ? (
              <span
                className="ndjc-catalog-item-bottom-content"
                style={{
                  minWidth: 0,
                  width: '100%',
                  display: 'block',
                  overflow: 'visible'
                }}
              >
                {resolvedBottomContent}
              </span>
            ) : (
              <span
                className="ndjc-catalog-price-meta-row"
                style={{
                  ...apkCatalogPriceRowStyle,
                  width: '100%',
                  alignItems: 'center'
                }}
              >
                <span
                  className="ndjc-catalog-price-row-main"
                  style={apkCatalogPriceRowStyle}
                >
                  <b style={apkCatalogPriceStyle}>{priceText(salePrice)}</b>
                  {hasDiscount ? (
                    <em style={apkCatalogOriginalPriceStyle}>
                      {priceText(dish.originalPrice)}
                    </em>
                  ) : null}
                </span>

                {!trailing && resolvedMetaText ? (
                  <span style={apkCatalogMetaTextStyle}>
                    {resolvedMetaText}
                  </span>
                ) : null}
              </span>
            )}

            {showCategory && categoryLabel ? (
              <span className="ndjc-catalog-category-chip" style={apkCatalogCategoryChipStyle}>
                {categoryLabel}
              </span>
            ) : null}
          </span>
        </span>
      </button>

      {trailing ? (
        <div
          className="ndjc-catalog-item-trailing"
          style={{
            width: 72,
            minWidth: 72,
            minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            alignItems: 'start',
            justifyItems: 'end'
          }}
          onPointerDown={event => event.stopPropagation()}
          onClick={event => event.stopPropagation()}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {trailing}
          </span>

          <span aria-hidden="true" />

          {resolvedMetaText ? (
            <span style={apkCatalogMetaTextStyle}>
              {resolvedMetaText}
            </span>
          ) : null}
        </div>
      ) : null}

      {onToggleSelect ? (
        <NdjcSelectionCheckbox
          selected={Boolean(selected)}
          onClick={() => onToggleSelect(dish.id)}
        />
      ) : null}
    </article>
  )
}

export function NdjcLinkedCatalogItemCard({
  title,
  imageUrl,
  subtitle,
  price,
  originalPrice,
  discountPrice,
  selected,
  available = true,
  allowClickWhenUnavailable = false,
  imageUnavailableText,
  showSelectedOutline = true,
  onOpen,
  onToggleSelect,
  trailing,
  middle,
  bottom,
  titleStyle
}: {
  title: string
  imageUrl?: string | null
  subtitle?: string
  price?: string
  originalPrice?: string | null
  discountPrice?: string | null
  selected?: boolean
  available?: boolean
  allowClickWhenUnavailable?: boolean
  imageUnavailableText?: string | null
  showSelectedOutline?: boolean
  onOpen?: () => void
  onToggleSelect?: () => void
  trailing?: React.ReactNode
  middle?: React.ReactNode
  bottom?: React.ReactNode
  titleStyle?: React.CSSProperties
}) {
  const cleanTitle = title || 'Untitled item'
  const cleanPrice = String(price || '').trim()
  const cleanOriginalPrice = String(originalPrice || '').trim()
  const cleanDiscountPrice = String(discountPrice || '').trim()
  const visiblePrice = cleanDiscountPrice || cleanPrice
  const visibleOriginalPrice = cleanDiscountPrice && cleanOriginalPrice && cleanOriginalPrice !== cleanDiscountPrice
    ? cleanOriginalPrice
    : null
  const cleanImageUnavailableText = String(imageUnavailableText || 'Item no longer available').trim()
  const clickEnabled = available || allowClickWhenUnavailable
  const cardPressEnabled = Boolean(clickEnabled && onOpen)
  const resolvedImageUrl = available ? imageUrl : null
  const selectedOutline = selected && showSelectedOutline
    ? APK_SHOWCASE_ITEM_UI.selectedOutline
    : '0 solid transparent'
  const hasTrailingColumn = Boolean(trailing)
  const hasSelectionColumn = Boolean(onToggleSelect)
  const catalogGridTemplateColumns = hasTrailingColumn && hasSelectionColumn
    ? 'minmax(0, 1fr) auto auto'
    : hasTrailingColumn || hasSelectionColumn
      ? 'minmax(0, 1fr) auto'
      : 'minmax(0, 1fr)'
  const [pressed, setPressed] = React.useState(false)

  function clearPressed(): void {
    setPressed(false)
  }

  return (
    <article
      className={cx('ndjc-linked-catalog-item-card', selected && 'is-selected', !available && 'is-disabled')}
      style={{
        ...apkCatalogCardStyle(pressed),
        gridTemplateColumns: catalogGridTemplateColumns,
        opacity: available ? 1 : APK_SHOWCASE_ITEM_UI.disabledAlpha,
        outline: selectedOutline
      }}
    >
      <button
        type="button"
        className="ndjc-linked-catalog-item-main"
        style={{
          ...apkCatalogMainButtonStyle,
          cursor: cardPressEnabled ? 'pointer' : 'default'
        }}
        disabled={!cardPressEnabled}
        onPointerDown={() => {
          if (cardPressEnabled) {
            setPressed(true)
          }
        }}
        onPointerUp={clearPressed}
        onPointerCancel={clearPressed}
        onPointerLeave={clearPressed}
        onClick={() => {
          if (cardPressEnabled) {
            onOpen?.()
          }
        }}
      >
        <span
          className="ndjc-catalog-item-media"
          style={{
            ...apkCatalogMediaStyle,
            display: 'grid',
            placeItems: 'center',
            background: !available ? APK_SHOWCASE_ITEM_UI.chipBg : apkCatalogMediaStyle.background,
            padding: !available ? 6 : apkCatalogMediaStyle.padding,
            boxSizing: 'border-box'
          }}
        >
          {available ? (
            <NdjcShimmerImage
              src={resolvedImageUrl}
              alt={cleanTitle}
              placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.catalogImageRadius}
              contentScale="cover"
            />
          ) : (
            <span
              style={{
                maxWidth: '100%',
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: APK_SHOWCASE_ITEM_UI.catalogCategorySize,
                lineHeight: 1.2,
                fontWeight: 500,
                textAlign: 'center',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {cleanImageUnavailableText}
            </span>
          )}
        </span>

        <span className="ndjc-catalog-item-body" style={apkCatalogBodyStyle}>
          <strong
            className="ndjc-catalog-item-title"
            style={{
              ...apkCatalogTitleStyle,
              ...titleStyle
            }}
          >
            {cleanTitle}
          </strong>

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          {middle ? (
            <span className="ndjc-linked-catalog-item-middle" style={{ minWidth: 0, display: 'block' }}>
              {middle}
            </span>
          ) : null}

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <span className="ndjc-catalog-price-stack" style={apkCatalogPriceStackStyle}>
            {bottom ? (
              <span className="ndjc-catalog-item-bottom" style={{ minWidth: 0, display: 'block' }}>
                {bottom}
              </span>
            ) : (
              <span className="ndjc-catalog-price-row" style={apkCatalogPriceRowStyle}>
                {visiblePrice ? <b style={apkCatalogPriceStyle}>{visiblePrice}</b> : null}
                {visibleOriginalPrice ? (
                  <em style={apkCatalogOriginalPriceStyle}>
                    {visibleOriginalPrice}
                  </em>
                ) : null}
              </span>
            )}

            {subtitle ? (
              <span className="ndjc-catalog-category-chip" style={apkCatalogCategoryChipStyle}>
                {subtitle}
              </span>
            ) : null}
          </span>
        </span>
      </button>

      {trailing ? (
        <div
          className="ndjc-linked-catalog-trailing"
          style={{
            minWidth: 0,
            display: 'grid',
            placeItems: 'center'
          }}
        >
          {trailing}
        </div>
      ) : null}

      {onToggleSelect ? (
        <NdjcSelectionCheckbox selected={Boolean(selected)} onClick={onToggleSelect} />
      ) : null}
    </article>
  )
}

export function NdjcChatToolButton({
  label,
  icon,
  onClick,
  disabled,
  className
}: NdjcIconButtonProps) {
  return (
    <button
      type="button"
      className={cx('ndjc-chat-tool-button', className)}
      style={apkChatToolButtonStyle(disabled)}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
    >
      <span
        style={{
          width: APK_CHAT_UI.toolButtonIconSize,
          height: APK_CHAT_UI.toolButtonIconSize,
          display: 'grid',
          placeItems: 'center',
          fontSize: APK_CHAT_UI.toolButtonIconSize,
          lineHeight: 1
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <strong
        style={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 600
        }}
      >
        {label}
      </strong>
    </button>
  )
}

export function MutedText({
  children,
  text,
  className
}: {
  children?: React.ReactNode
  text?: string
  className?: string
}) {
  return (
    <p className={cx('ndjc-muted-text', className)} style={apkMutedTextStyle}>
      {text ?? children}
    </p>
  )
}

export function BgCircle({
  className,
  size = APK_SHELL_UI.bgCircleDefaultSize,
  offsetX = 0,
  offsetY = 0,
  colors
}: {
  className?: string
  size?: number | string
  offsetX?: number | string
  offsetY?: number | string
  colors?: readonly string[]
}) {
  return (
    <span
      className={cx('ndjc-bg-circle', className)}
      style={apkBgCircleStyle({ size, offsetX, offsetY, colors })}
      aria-hidden="true"
    />
  )
}
export function NdjcPullRefreshHintSpinner() {
  const bars = Array.from({ length: 12 }, (_, index) => index)

  return (
    <span
      className="ndjc-pull-refresh-hint-spinner"
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 16,
        height: 16,
        display: 'inline-block',
        flexShrink: 0,
        animation: 'ndjcSpinnerRotate 0.85s steps(12, end) infinite'
      }}
    >
      {bars.map((index) => (
        <span
          key={index}
          style={{
            position: 'absolute',
            left: '50%',
            top: 1,
            width: 2,
            height: 4,
            borderRadius: 999,
            background: APK_SHOWCASE_COLOR_TOKENS.primary,
            opacity: 0.22 + index * 0.055,
            transform: `translateX(-50%) rotate(${index * 30}deg)`,
            transformOrigin: '1px 7px'
          }}
        />
      ))}
    </span>
  )
}

export function NdjcPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh,
  showIndicator = true,
  showHint = false
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  showIndicator?: boolean
  showHint?: boolean
}) {
  const activeRefreshing = refreshing ?? isRefreshing
  const [pullHintState, setPullHintState] = React.useState<'idle' | 'pull' | 'release'>('idle')
  const touchStartYRef = React.useRef<number | null>(null)
  const touchStartXRef = React.useRef<number | null>(null)
  const pullDistanceRef = React.useRef(0)
  const refreshLockedRef = React.useRef(false)

  function resetPullState(): void {
    touchStartYRef.current = null
    touchStartXRef.current = null
    pullDistanceRef.current = 0
    setPullHintState('idle')
  }

  function findScrollableParent(target: EventTarget | null): HTMLElement | null {
    let node = target instanceof HTMLElement ? target : null

    while (node) {
      const overflowY = window.getComputedStyle(node).overflowY
      const canScroll = node.scrollHeight > node.clientHeight
      const isScrollable = canScroll && (overflowY === 'auto' || overflowY === 'scroll')

      if (isScrollable) {
        return node
      }

      node = node.parentElement
    }

    return null
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) return

    const touch = event.touches[0]
    if (!touch) return

    const scrollable = findScrollableParent(event.target)
    if (scrollable && scrollable.scrollTop > 0) {
      resetPullState()
      return
    }

    touchStartYRef.current = touch.clientY
    touchStartXRef.current = touch.clientX
    pullDistanceRef.current = 0
    setPullHintState('idle')
  }

  function handleTouchMove(event: React.TouchEvent<HTMLElement>): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) return
    if (touchStartYRef.current == null || touchStartXRef.current == null) return

    const touch = event.touches[0]
    if (!touch) return

    const deltaY = touch.clientY - touchStartYRef.current
    const deltaX = Math.abs(touch.clientX - touchStartXRef.current)

    if (deltaY <= 0 || deltaX > deltaY) {
      pullDistanceRef.current = 0
      setPullHintState('idle')
      return
    }

    const scrollable = findScrollableParent(event.target)
    if (scrollable && scrollable.scrollTop > 0) {
      pullDistanceRef.current = 0
      setPullHintState('idle')
      return
    }

    pullDistanceRef.current = deltaY

    if (deltaY >= 40) {
      setPullHintState('release')
    } else if (deltaY >= 8) {
      setPullHintState('pull')
    } else {
      setPullHintState('idle')
    }
  }

  function handleTouchEnd(): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) {
      resetPullState()
      return
    }

    const shouldRefresh = pullDistanceRef.current >= 40

    resetPullState()

    if (!shouldRefresh) return

    refreshLockedRef.current = true

    try {
      onRefresh()
    } finally {
      window.setTimeout(() => {
        refreshLockedRef.current = false
      }, 900)
    }
  }

  function handleTouchCancel(): void {
    resetPullState()
  }

  const hintText = activeRefreshing
    ? 'Refreshing...'
    : pullHintState === 'release'
      ? 'Release to refresh'
      : pullHintState === 'pull'
        ? 'Pull to refresh'
        : ''

  return (
    <section
      className={cx('ndjc-pull-refresh-container', activeRefreshing && 'is-refreshing')}
      style={apkPullRefreshRootStyle}
      data-refreshing={activeRefreshing ? 'true' : 'false'}
      aria-busy={activeRefreshing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {showHint ? (
        <div
          className="ndjc-pull-refresh-hint-wrap"
          style={apkPullRefreshHintStyle}
          aria-hidden="true"
          data-visible={hintText ? 'true' : 'false'}
        >
          <span
            className="ndjc-pull-refresh-hint-pill"
            style={{
              ...apkPullRefreshHintPillStyle,
              opacity: hintText ? 1 : 0,
              transform: hintText ? 'translateY(18px)' : 'translateY(-120%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: activeRefreshing ? 7 : 0
            }}
          >
            {activeRefreshing ? (
              <NdjcPullRefreshHintSpinner />
            ) : null}

            <span>
              {hintText || 'Pull to refresh'}
            </span>
          </span>
        </div>
      ) : null}

      {activeRefreshing && showIndicator ? (
        <div
          className="ndjc-pull-refresh-indicator-wrap"
          style={apkPullRefreshIndicatorWrapStyle}
          aria-hidden="true"
        >
          <NdjcSpinner
            className="ndjc-pull-refresh-indicator"
            size={APK_SHELL_UI.pullRefreshIndicatorSize}
            stroke={2}
            tone="primary"
            style={apkPullRefreshIndicatorStyle}
          />
        </div>
      ) : null}

      {children}
    </section>
  )
}
export function NdjcAdminPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
}) {
  return (
    <NdjcPullRefreshContainer
      isRefreshing={isRefreshing}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showIndicator={false}
      showHint
    >
      {children}
    </NdjcPullRefreshContainer>
  )
}

export function NdjcCustomerPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
}) {
  return (
    <NdjcPullRefreshContainer
      isRefreshing={isRefreshing}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showIndicator={false}
      showHint
    >
      {children}
    </NdjcPullRefreshContainer>
  )
}
export function withUsd(value: number | string | null | undefined): string {
  const numericValue = typeof value === 'number' ? value : Number(value || 0)
  return priceText(numericValue)
}

export function ndjcMoneyTrim2(value: number): string {
  if (!Number.isFinite(value)) return '0'
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

export function colors() {
  return {
    bg: 'var(--ndjc-apk-bg)',
    card: 'var(--ndjc-apk-card)',
    ink: 'var(--ndjc-apk-ink)',
    muted: 'var(--ndjc-apk-muted)',
    pink: 'var(--ndjc-apk-pink)',
    mint: 'var(--ndjc-apk-mint)'
  }
}

export function neuOutlinedTextFieldColors() {
  return colors()
}

export function requestExit(onBack?: () => void) {
  onBack?.()
}

export function scrollToField(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function hasHalfFilled(name: string, value: string): boolean {
  return Boolean(name.trim()) !== Boolean(value.trim())
}

export function normalizeAppointmentTimeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function splitAppointmentAvailableHours(value: string): [string, string] {
  const normalized = normalizeAppointmentTimeText(value)
  const parts = normalized.split(/[-–—]/).map(item => item.trim()).filter(Boolean)
  return [parts[0] || '09:00', parts[1] || '17:00']
}

export function appointmentTimeOptions(): string[] {
  return Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2)
    const minute = index % 2 === 0 ? '00' : '30'

    return `${String(hour).padStart(2, '0')}:${minute}`
  })
}

export function appointmentFilterDateLabel(value: string): string {
  const raw = String(value || '').trim()

  if (raw.toLowerCase() === 'all') return 'All'

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return raw

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return raw
  }

  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return raw
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function appointmentHistoryDateLabel(value: string): string {
  const raw = String(value || '').trim()

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return raw || 'History date'

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return raw || 'History date'
  }

  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return raw || 'History date'
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export function appointmentCalendarMonthTitle(year: number, month: number): string {
  const date = new Date(year, Math.max(0, month - 1), 1)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

export function appointmentCalendarDateValue(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function moveHistoryCalendarMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(year, Math.max(0, month - 1) + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}



export function parseTimeMsFromTimeText(value: string): number {
  const time = Date.parse(value)
  return Number.isFinite(time) ? time : 0
}

export type NdjcParsedChatPayloadUi = {
  body: string
  productBlock: string | null
  quoteBlock: string | null
  imageUrls: string[]
}

export type NdjcProductCardUi = {
  dishId: string
  title: string
  price: string
  originalPriceText: string | null
  discountPriceText: string | null
  imageUrl: string | null
  isRecommended: boolean
}

export type NdjcParsedQuoteUi = {
  quotedMessageId: string | null
  quotedText: string | null
}

export const NDJC_QUOTE_START_UI = '⟪Q⟫'
export const NDJC_QUOTE_END_UI = '⟪/Q⟫'
export const NDJC_PRODUCT_START_UI = '⟪P⟫'
export const NDJC_PRODUCT_END_UI = '⟪/P⟫'

export function findBetween(text: string, start: string, end: string): string | null {
  const startIndex = text.indexOf(start)
  if (startIndex < 0) return null

  const contentStart = startIndex + start.length
  const endIndex = text.indexOf(end, contentStart)
  if (endIndex < 0) return null

  return text.slice(contentStart, endIndex)
}

export function parseNdjcProductBlock(block: string): NdjcProductCardUi | null {
  const normalized = String(block || '').trim()
  if (!normalized) return null

  const unicodeProductBlock = normalized.includes(NDJC_PRODUCT_START_UI)
    ? findBetween(normalized, NDJC_PRODUCT_START_UI, NDJC_PRODUCT_END_UI)
    : null

  const legacyProductBlock = normalized.includes('[product]')
    ? findBetween(normalized, '[product]', '[/product]')
    : null

  const explicitProductBlock = unicodeProductBlock != null
    ? unicodeProductBlock
    : legacyProductBlock != null
      ? legacyProductBlock
      : normalized

  const productLine = explicitProductBlock
    .trim()
    .split(/\r?\n/)
    .find(item => item.trim()) || ''

  const pipeParts = productLine.split('|')
  const hasPipeProductShape = pipeParts.length >= 2 && (
    Boolean(String(pipeParts[0] || '').trim()) ||
    Boolean(String(pipeParts[1] || '').trim())
  )

  if (unicodeProductBlock != null || legacyProductBlock != null || hasPipeProductShape) {
    if (!hasPipeProductShape) return null

    const dishId = String(pipeParts[0] || '').trim()
    const title = String(pipeParts[1] || '').trim()
    const price = String(pipeParts[2] || '').trim()
    const imageUrl = String(pipeParts[3] || '').trim() || null
    const isRecommended = String(pipeParts[4] || '').trim() === '1'
    const originalPriceText = String(pipeParts[5] || '').trim() || price || null
    const discountPriceText = String(pipeParts[6] || '').trim() || null

    if (!dishId && !title) return null

    return {
      dishId,
      title: title || 'Shared item',
      price,
      originalPriceText,
      discountPriceText,
      imageUrl,
      isRecommended
    }
  }

  const hasLegacyFieldShape =
    normalized.includes('dishId=') ||
    normalized.includes('dishId:') ||
    normalized.includes('title=') ||
    normalized.includes('title:') ||
    normalized.includes('price=') ||
    normalized.includes('price:') ||
    normalized.includes('imageUrl=') ||
    normalized.includes('imageUrl:')

  if (!hasLegacyFieldShape) return null

  const dishId = findBetween(normalized, 'dishId=', ';') || findBetween(normalized, 'dishId:', '\n') || ''
  const title = findBetween(normalized, 'title=', ';') || findBetween(normalized, 'title:', '\n') || ''
  const price = findBetween(normalized, 'price=', ';') || findBetween(normalized, 'price:', '\n') || ''
  const imageUrl = findBetween(normalized, 'imageUrl=', ';') || findBetween(normalized, 'imageUrl:', '\n')

  if (!dishId && !title.trim()) return null

  return {
    dishId,
    title: title.trim() || 'Shared item',
    price,
    originalPriceText: price || null,
    discountPriceText: null,
    imageUrl,
    isRecommended: false
  }
}

export function parseNdjcQuotePayloadUi(text: string): NdjcParsedQuoteUi {
  const source = String(text || '')

  if (source.startsWith(NDJC_QUOTE_START_UI)) {
    const endIndex = source.indexOf(NDJC_QUOTE_END_UI)

    if (endIndex > NDJC_QUOTE_START_UI.length) {
      const quoteRaw = source.slice(NDJC_QUOTE_START_UI.length, endIndex).trim()
      const firstNewLine = quoteRaw.indexOf('\n')
      const quotedMessageId = firstNewLine > 0
        ? quoteRaw.slice(0, firstNewLine).trim() || null
        : null
      const quotedText = firstNewLine > 0
        ? quoteRaw.slice(firstNewLine + 1).replace(/^[\n ]+/, '').trim() || null
        : quoteRaw.trim() || null

      return {
        quotedMessageId,
        quotedText
      }
    }
  }

  return {
    quotedMessageId: findBetween(source, '[quote:', ']'),
    quotedText: findBetween(source, '[quoteText]', '[/quoteText]')
  }
}

export function parseNdjcChatPayloadUi(text: string): NdjcParsedChatPayloadUi {
  const source = String(text || '')
  const productBlock = findBetween(source, NDJC_PRODUCT_START_UI, NDJC_PRODUCT_END_UI)
    || findBetween(source, '[product]', '[/product]')
  const quoteBlock = findBetween(source, NDJC_QUOTE_START_UI, NDJC_QUOTE_END_UI)
    || findBetween(source, '[quote]', '[/quote]')
  const imageUrls = Array.from(source.matchAll(/https?:\/\/\S+?\.(?:png|jpe?g|webp|gif)/gi)).map(match => match[0])
  const body = source
    .replace(/⟪P⟫[\s\S]*?⟪\/P⟫/g, '')
    .replace(/⟪Q⟫[\s\S]*?⟪\/Q⟫/g, '')
    .replace(/\[product\][\s\S]*?\[\/product\]/g, '')
    .replace(/\[quote\][\s\S]*?\[\/quote\]/g, '')
    .trim()

  return { body, productBlock, quoteBlock, imageUrls }
}

export function fallbackFindQuotedMessageId(messages: ShowcaseChatMessage[], text: string): string | null {
  const parsed = parseNdjcQuotePayloadUi(text)

  if (parsed.quotedMessageId) return parsed.quotedMessageId

  const quotedText = parsed.quotedText?.trim()
  if (!quotedText) return null

  return messages.find(message => message.body.includes(quotedText))?.id || null
}

export function chatProductShareFromParsedProduct(product: NdjcProductCardUi): ShowcaseChatProductShare {
  return {
    dishId: product.dishId,
    title: product.title,
    price: product.price,
    originalPriceText: product.originalPriceText,
    discountPriceText: product.discountPriceText,
    imageUrl: product.imageUrl,
    isRecommended: product.isRecommended
  }
}

function appointmentShareStatusDisplayLabel(appointment: ShowcaseChatAppointmentShare): string {
  const status = appointment.statusLabel?.trim()
  if (!status) return 'Pending'

  const normalizedStatus = status.toLowerCase()
  if (normalizedStatus.includes('cancel')) return 'Cancelled'

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

function appointmentShareSummaryText(appointment: ShowcaseChatAppointmentShare): string {
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

export async function copyTextToClipboard(text: string): Promise<boolean> {
  const cleanText = text.trim()
  if (!cleanText) return false

  if (typeof document !== 'undefined') {
    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const textarea = document.createElement('textarea')
    textarea.value = cleanText
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.left = '0'
    textarea.style.top = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    textarea.style.zIndex = '-1'

    document.body.appendChild(textarea)

    try {
      textarea.focus({ preventScroll: true })
    } catch {
      textarea.focus()
    }

    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    try {
      const copied = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (previousActiveElement) {
        try {
          previousActiveElement.focus({ preventScroll: true })
        } catch {
          previousActiveElement.focus()
        }
      }

      if (copied) return true
    } catch {
      document.body.removeChild(textarea)

      if (previousActiveElement) {
        try {
          previousActiveElement.focus({ preventScroll: true })
        } catch {
          previousActiveElement.focus()
        }
      }
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(cleanText)
      return true
    }
  } catch {
    return false
  }

  return false
}

export function quotePreviewTextFromMessage(message: ShowcaseChatMessage): string {
  const directPreview = String(message.quotePreviewText || '').trim()
  if (directPreview) return directPreview

  if (message.body.trim()) return message.body.trim()
  if (message.product) return message.product.title || 'Shared item'
  if (message.appointment) return appointmentShareSummaryText(message.appointment)
  if (message.imageUrls.length) return 'Photo'

  return 'Quoted message'
}

export function resetDragState() {
  return { draggingIndex: -1, targetIndex: -1 }
}

export function findTargetIndex(index: number, length: number): number {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0))
}

export function movePreview<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const safeFrom = findTargetIndex(from, next.length)
  const safeTo = findTargetIndex(to, next.length)
  const [item] = next.splice(safeFrom, 1)

  if (item !== undefined) {
    next.splice(safeTo, 0, item)
  }

  return next
}

export function rememberFindHighlightStyle(isOutgoing: boolean): React.CSSProperties {
  return {
    background: isOutgoing ? 'rgba(255,255,255,.24)' : 'rgba(255,143,151,.18)',
    borderRadius: 6,
    padding: '0 2px'
  }
}

export function highlightQueryText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index < 0) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="ndjc-find-highlight">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  )
}

export function alignLastBubbleToFooterLine() {
  return undefined
}

export function DishListCard({
  dish,
  onOpen,
  priorityImage = false
}: {
  dish: ShowcaseHomeDish
  onOpen: (id: string) => void
  priorityImage?: boolean
}) {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = dish.discountPrice
  const safeOriginalPrice = Number.isFinite(originalPrice) ? originalPrice : 0
  const hasDiscount =
    typeof discountPrice === 'number' &&
    discountPrice > 0 &&
    discountPrice < originalPrice
  const primaryText = hasDiscount ? priceText(discountPrice) : priceText(safeOriginalPrice)
  const secondaryText = hasDiscount ? priceText(safeOriginalPrice) : null

  return (
    <NdjcHomeStyleMediaCard
      title={dish.title}
      imageUrl={selectDishImageUrl(dish, 'home')}
      imageBlurDataUrl={selectShowcaseImageBlurDataUrl(dish.imageVariants)}
      primaryText={primaryText}
      secondaryText={secondaryText}
      badgeText={dish.isRecommended ? APK_SHOWCASE_ITEM_UI.homeBadgeText : null}
      onClick={() => onOpen(dish.id)}
      priorityImage={priorityImage}
trailingOverlay={
  dish.isFavorite ? (
    <svg
      className="ndjc-apk-dish-fav is-active"
      style={apkHomeFavoriteIconStyle}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  ) : null
}
    />
  )
}

export function FavSortChip({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-fav-sort-chip', selected && 'is-selected')}
      style={apkFilterChipStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
    </button>
  )
}

export function FavoritesSortChip({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-favorites-sort-chip', selected && 'is-selected')}
      style={apkFilterChipStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
    </button>
  )
}
export function AppointmentDatePill({
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
  return (
    <NdjcPillButton
      selected={selected}
      disabled={disabled}
      variant="date"
      onClick={onClick}
    >
      <span
        style={{
          minWidth: 0,
          display: 'grid',
          justifyItems: 'center',
          gap: 2
        }}
      >
        <strong
          style={{
            maxWidth: '100%',
            color: 'currentColor',
            fontSize: APK_CORE_UI.pillFontSize,
            lineHeight: 1.1,
            fontWeight: selected ? 700 : 650,
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
              color: selected
                ? 'currentColor'
                : disabled
                  ? APK_APPOINTMENT_UI.disabledText
                  : 'currentColor',
              opacity: selected ? 0.72 : 1,
              fontSize: 12,
              lineHeight: 1.1,
              fontWeight: 550,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </NdjcPillButton>
  )
}

export function AppointmentTimeSettingRow({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <section
      className="ndjc-appointment-time-setting-row"
      style={{
        width: '100%',
        borderRadius: APK_APPOINTMENT_UI.timeSettingRadius,
        color: APK_APPOINTMENT_UI.black,
        background: APK_APPOINTMENT_UI.softSurface,
        boxShadow: 'none'
      }}
    >
      <label
        style={{
          width: '100%',
          padding: `${APK_APPOINTMENT_UI.timeSettingPaddingY}px ${APK_APPOINTMENT_UI.timeSettingPaddingX}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}
      >
        <span
          style={{
            color: APK_APPOINTMENT_UI.black,
            fontSize: APK_APPOINTMENT_UI.labelMediumSize,
            lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
            fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
          }}
        >
          {label}
        </span>

        <input
          value={value}
          inputMode="numeric"
          onChange={event => onChange(event.target.value)}
          style={{
            width: 96,
            border: 0,
            outline: 0,
            padding: 0,
            textAlign: 'right',
            color: APK_APPOINTMENT_UI.brand,
            background: 'transparent',
            fontSize: 16,
            lineHeight: '20px',
            fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
          }}
          aria-label={label}
        />
      </label>
    </section>
  )
}

export function AppointmentHistoryDatePickerSheet({
  open,
  selectedDate,
  onSelect,
  onClose
}: {
  open: boolean
  selectedDate: string
  onSelect: (value: string) => void
  onClose: () => void
}) {
  const today = new Date()
  const initialYear = selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? Number(selectedDate.slice(0, 4))
    : today.getFullYear()
  const initialMonth = selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? Number(selectedDate.slice(5, 7))
    : today.getMonth() + 1

  const [visibleYear, setVisibleYear] = React.useState(initialYear)
  const [visibleMonth, setVisibleMonth] = React.useState(initialMonth)
  const dragStateRef = React.useRef({
    active: false,
    startX: 0,
    offsetX: 0
  })

  React.useEffect(() => {
    if (!open) return

    setVisibleYear(initialYear)
    setVisibleMonth(initialMonth)
  }, [open, initialYear, initialMonth])

  if (!open) return null

  const daysInMonth = new Date(visibleYear, visibleMonth, 0).getDate()
  const firstDay = new Date(visibleYear, visibleMonth - 1, 1).getDay()
  const calendarCells: Array<number | null> = []

  for (let index = 0; index < firstDay; index += 1) {
    calendarCells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarCells.push(day)
  }

  while (calendarCells.length < 42) {
    calendarCells.push(null)
  }

  function moveMonth(delta: number): void {
    const next = moveHistoryCalendarMonth(visibleYear, visibleMonth, delta)
    setVisibleYear(next.year)
    setVisibleMonth(next.month)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      offsetX: 0
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    const dragState = dragStateRef.current
    if (!dragState.active) return

    dragState.offsetX = event.clientX - dragState.startX
  }

  function handlePointerUp(): void {
    const dragState = dragStateRef.current

    if (dragState.active) {
      if (dragState.offsetX > 80) {
        moveMonth(-1)
      } else if (dragState.offsetX < -80) {
        moveMonth(1)
      }
    }

    dragStateRef.current = {
      active: false,
      startX: 0,
      offsetX: 0
    }
  }

  return (
    <NdjcFilterBottomSheet
      open={open}
      title="Select date"
      clearText=""
      applyText="Done"
      showPriceFields={false}
      showHeaderAction={false}
      showApplyButton={false}
      onClose={onClose}
      onClear={onClose}
      onApply={onClose}
    >
      <section
        className="ndjc-appointment-history-date-picker-sheet"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
<section
  className="ndjc-appointment-history-date-picker-month-actions"
  style={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  }}
>
  <NdjcPillButton
    selected={false}
    onClick={() => moveMonth(-1)}
  >
    ◀ Prev
  </NdjcPillButton>

  <NdjcPillButton
    selected={false}
    onClick={() => moveMonth(1)}
  >
    Next ▶
  </NdjcPillButton>
</section>

        <h3
          style={{
            width: '100%',
            margin: 0,
            color: APK_APPOINTMENT_UI.black,
            fontSize: APK_APPOINTMENT_UI.titleSmallSize,
            lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
            fontWeight: APK_APPOINTMENT_UI.titleSmallWeight,
            textAlign: 'center'
          }}
        >
          {appointmentCalendarMonthTitle(visibleYear, visibleMonth)}
        </h3>

        <section
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            touchAction: 'pan-y'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <section
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              columnGap: 6
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span
                key={day}
                style={{
                  color: APK_APPOINTMENT_UI.black55,
                  fontSize: APK_APPOINTMENT_UI.labelSmallSize,
                  lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                {day}
              </span>
            ))}
          </section>

          <section
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              columnGap: 6,
              rowGap: 8
            }}
          >
            {calendarCells.map((day, index) => {
              if (day == null) {
                return <span key={`blank-${index}`} style={{ height: APK_APPOINTMENT_UI.calendarDayHeight }} />
              }

              const value = appointmentCalendarDateValue(visibleYear, visibleMonth, day)
              const selected = selectedDate === value

              return (
                <AppointmentCalendarMonthDayButton
                  key={value}
                  text={String(day)}
                  active={selected}
                  onClick={() => onSelect(value)}
                />
              )
            })}
          </section>
        </section>
      </section>
    </NdjcFilterBottomSheet>
  )
}

function AppointmentCalendarMonthDayButton({
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

export function AppointmentDetailSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="ndjc-appointment-detail-section-title" style={apkAppointmentSectionTitleStyle}>
      {children}
    </h3>
  )
}

export function AppointmentContactCopyLine({
  label,
  value,
  onCopy
}: {
  label: string
  value?: string | null
  onCopy?: (label: string, value: string) => void
}) {
  const cleanValue = value?.trim() || ''
  const [copied, setCopied] = React.useState(false)
  const copiedTimerRef = React.useRef<number | null>(null)
  const canCopy = Boolean(onCopy && cleanValue && cleanValue !== 'No contact provided')

  React.useEffect(() => {
    return () => {
      if (copiedTimerRef.current != null) {
        window.clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  if (!cleanValue) return null

  function markCopied(): void {
    if (typeof window === 'undefined') return

    if (copiedTimerRef.current != null) {
      window.clearTimeout(copiedTimerRef.current)
    }

    setCopied(true)

    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false)
      copiedTimerRef.current = null
    }, 1200)
  }

  function handleCopy(): void {
    if (!canCopy) return

    onCopy?.(label || 'Contact', cleanValue)
    markCopied()
  }

  return (
    <section
      className="ndjc-appointment-contact-copy-line"
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
        {label || 'Contact'}
      </span>

      <section
        style={{
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 12,
          alignItems: 'center'
        }}
      >
        <strong
          style={{
            margin: 0,
            minWidth: 0,
            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
            fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
            lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
            fontWeight: 650,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {cleanValue}
        </strong>

        {canCopy ? (
          <button
            type="button"
            style={{
              border: 0,
              borderRadius: 0,
              padding: 0,
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              background: 'transparent',
              fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
              lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            onClick={handleCopy}
            aria-label={`Copy ${label || 'Contact'}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </section>
    </section>
  )
}
export function UniversalStoreServicesSection({ services }: { services: string[] }) {
  const cleanServices = services.map(service => service.trim()).filter(Boolean)

  return (
    <section className="ndjc-apk-store-section" style={apkStoreSectionStyle}>
      <StoreProfileSectionHeader title="Business Scope" />

      {cleanServices.length ? (
        <div
          className="ndjc-apk-store-services-row"
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: APK_STORE_PROFILE_UI.servicesGap
          }}
          role="list"
        >
          {cleanServices.map((service, index) => (
            <NdjcPillBadge key={`${service}-${index}`} selected>
              {service}
            </NdjcPillBadge>
          ))}
        </div>
      ) : (
        <UniversalStoreEmptyInfoText />
      )}
    </section>
  )
}

export function StoreExtraContactsEditorRow({
  name,
  value,
  onNameChange,
  onValueChange,
  onRemove
}: {
  name: string
  value: string
  onNameChange: (value: string) => void
  onValueChange: (value: string) => void
  onRemove: () => void
}) {
  return (
    <section
      className="ndjc-store-extra-contact-editor-row"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      <section
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `minmax(0, ${APK_STORE_EDIT_UI.nameColumnFlex}fr) minmax(0, ${APK_STORE_EDIT_UI.valueColumnFlex}fr)`,
          columnGap: APK_STORE_EDIT_UI.rowGap,
          rowGap: 0,
          alignItems: 'end'
        }}
      >
        <NdjcTextField
          value={name}
          onChange={onNameChange}
          placeholder="Name"
          label="Name"
          singleLine
        />

        <NdjcTextField
          value={value}
          onChange={onValueChange}
          placeholder="Value"
          label="Value"
          singleLine
        />
      </section>

      <section
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <button
          type="button"
          style={apkStoreEditRemoveButtonStyle}
          onClick={onRemove}
        >
          Remove
        </button>
      </section>
    </section>
  )
}

export function StoreExtraContactsEditor({ children }: { children?: React.ReactNode }) {
  return (
    <section
      className="ndjc-store-extra-contacts-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      {children}
    </section>
  )
}

export function StoreOtherContactMethodsEditor({ children }: { children?: React.ReactNode }) {
  return (
    <section
      className="ndjc-store-other-contact-methods-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.rowGap
      }}
    >
      <h3
        style={{
          margin: 0,
          color: APK_STORE_EDIT_UI.black75,
          fontSize: 14,
          lineHeight: 1.25,
          fontWeight: 600
        }}
      >
        Other contact methods
      </h3>

      <div style={apkStoreEditCardStyle}>
        {children}
      </div>
    </section>
  )
}

export function StoreServicesEditor({
  services,
  onChange,
  onRemove
}: {
  services: string[]
  onChange?: (index: number, value: string) => void
  onRemove?: (index: number) => void
}) {
  return (
    <section
      className="ndjc-store-services-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      {services.map((service, index) => (
        <section
          key={`${index}-${service}`}
          className="ndjc-store-service-editor-row"
          style={{
            width: '100%',
            display: 'grid',
            gap: 0
          }}
        >
          <NdjcTextField
            value={service}
            onChange={value => onChange?.(index, value)}
            label="Service"
            singleLine
          />

          <section
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <button
              type="button"
              style={apkStoreEditRemoveButtonStyle}
              onClick={() => onRemove?.(index)}
              disabled={!onRemove}
            >
              Remove
            </button>
          </section>
        </section>
      ))}
    </section>
  )
}

export function StoreProfileLogoPicker({
  src,
  enabled = true,
  errorMessage,
  onPick,
  onRemove,
  onPreview
}: {
  src?: string | null
  enabled?: boolean
  errorMessage?: string | null
  onPick?: () => void
  onRemove?: () => void
  onPreview?: (images: string[], startIndex: number) => void
}) {
  const logo = src?.trim() || ''

  return (
    <section
      className="ndjc-store-profile-logo-picker"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.labelBottomGap
      }}
    >
      <h3 style={apkStoreEditPickerTitleStyle}>Logo</h3>

      <p
        style={{
          margin: 0,
          color: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
        }}
      >
        JPG, PNG, or WebP. Up to 8MB.
      </p>

      <section
        style={{
          width: '100%',
          minWidth: 0
        }}
      >
        <div
          style={{
            width: `calc((100% - ${APK_STORE_EDIT_UI.imageCellGap * 2}px) / 3)`,
            minWidth: 0
          }}
        >
          <NdjcSingleEditableImage
            src={logo}
            label="Logo"
            enabled={enabled}
            onPick={onPick}
            onRemove={onRemove}
            onPreview={logo ? () => onPreview?.([logo], 0) : undefined}
          />
        </div>
      </section>

      {errorMessage ? (
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
          {errorMessage}
        </p>
      ) : null}
    </section>
  )
}
export function StoreProfileCoverPicker({
  src,
  enabled = true,
  errorMessage,
  onPick,
  onRemove,
  onMove,
  onDraggingChange,
  onPreview
}: {
  src?: string | null
  enabled?: boolean
  errorMessage?: string | null
  onPick?: () => void
  onRemove?: (url: string) => void
  onMove?: (fromIndex: number, toIndex: number) => void
  onDraggingChange?: (isDragging: boolean) => void
  onPreview?: (images: string[], startIndex: number) => void
}) {
  const images = Array.from(
    new Set(
      (src || '')
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
    )
  ).slice(0, APK_STORE_EDIT_UI.maxCoverImages)

  return (
    <section
      className="ndjc-store-profile-cover-picker"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.labelBottomGap
      }}
    >
      <h3 style={apkStoreEditPickerTitleStyle}>Cover (up to 9 images)</h3>

      <p
        style={{
          margin: 0,
          color: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
          fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
          lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
        }}
      >
        JPG, PNG, or WebP. Up to 12MB per image.
      </p>

      <section
        style={{
          width: '100%',
          minHeight: APK_STORE_EDIT_UI.coverPickerMinHeight
        }}
      >
        <NdjcEditableImageGrid
          imageUrls={images}
          maxImages={APK_STORE_EDIT_UI.maxCoverImages}
          enabled={enabled}
          onPickImage={onPick}
          onRemoveImage={onRemove}
          onMoveImage={onMove}
          onDraggingChange={onDraggingChange}
          onPreviewImages={onPreview}
        />
      </section>

      {errorMessage ? (
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
          {errorMessage}
        </p>
      ) : null}
    </section>
  )
}
