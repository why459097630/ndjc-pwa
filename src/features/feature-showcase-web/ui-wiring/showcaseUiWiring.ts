import type {
  ExtraContact,
  ExtraContactDraft,
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
  ShowcaseAppointmentDateOption,
  ShowcaseAppointmentProductCard,
  ShowcaseAppointmentSettingsSaveInput,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseBottomBarUiState,
  ShowcaseBottomNavigationActions,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
  ShowcaseChatMediaActions,
  ShowcaseChatMediaItemUi,
  ShowcaseChatMessage,
  ShowcaseChatProductShare,
  ShowcaseChatSearchResultUi,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseCloudStatusUi,
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
  ShowcaseHomeSortMode,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseMerchantChatListActions,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileDraft,
  ShowcaseStoreProfileUiState,
  ShowcaseSyncOverviewState,
  ShowcaseUiState
} from '../showcaseUiContract'
import { createDefaultShowcaseUiState } from '../showcaseUiState'
import {
  buildBottomNavigationWiringState,
  buildScreenWiringState,
  buildSyncCloudWiringState,
  type ShowcaseUiWiring,
  type ShowcaseUiWiringActions,
  type ShowcaseUiWiringInput
} from './showcaseCommonWiring'
import {
  buildDetailWiringState,
  buildFavoritesWiringState,
  buildHomeWiringState,
  buildStoreProfileWiringState
} from './showcaseCatalogWiring'
import {
  buildAdminWiringState,
  buildEditDishWiringState
} from './showcaseAdminWiring'
import {
  buildChatMediaWiringState,
  buildChatWiringState,
  buildMerchantChatListWiringState
} from './showcaseChatWiring'
import {
  buildAdminAppointmentsWiringState,
  buildAppointmentsWiringState,
  buildCustomerBookingsWiringState
} from './showcaseBookingWiring'
import {
  buildAnnouncementEditWiringState,
  buildAnnouncementsWiringState
} from './showcaseAnnouncementWiring'
import {
  createNoopAdminActions,
  createNoopAdminAppointmentsActions,
  createNoopAnnouncementEditActions,
  createNoopAnnouncementsActions,
  createNoopAppointmentsActions,
  createNoopBottomNavigationActions,
  createNoopChatActions,
  createNoopChatMediaActions,
  createNoopCustomerBookingsActions,
  createNoopDetailActions,
  createNoopEditDishActions,
  createNoopFavoritesActions,
  createNoopHomeActions,
  createNoopLoginActions,
  createNoopMerchantChatListActions,
  createNoopStoreProfileActions
} from './showcaseActionsWiring'

export function createDefaultShowcaseUiWiringActions(
  overrides: Partial<ShowcaseUiWiringActions> = {}
): ShowcaseUiWiringActions {
  return {
    bottomNavigation: createNoopBottomNavigationActions(overrides.bottomNavigation),
    home: createNoopHomeActions(overrides.home),
    login: createNoopLoginActions(overrides.login),
    admin: createNoopAdminActions(overrides.admin),
    detail: createNoopDetailActions(overrides.detail),
    editDish: createNoopEditDishActions(overrides.editDish),
    storeProfile: createNoopStoreProfileActions(overrides.storeProfile),
    favorites: createNoopFavoritesActions(overrides.favorites),
    merchantChatList: createNoopMerchantChatListActions(overrides.merchantChatList),
    chat: createNoopChatActions(overrides.chat),
    chatMedia: createNoopChatMediaActions(overrides.chatMedia),
    appointments: createNoopAppointmentsActions(overrides.appointments),
    adminAppointments: createNoopAdminAppointmentsActions(overrides.adminAppointments),
    customerBookings: createNoopCustomerBookingsActions(overrides.customerBookings),
    announcements: createNoopAnnouncementsActions(overrides.announcements),
    announcementEdit: createNoopAnnouncementEditActions(overrides.announcementEdit)
  }
}

export function createShowcaseUiWiring(input: ShowcaseUiWiringInput = {}): ShowcaseUiWiring {
  const uiState = input.uiState || createDefaultShowcaseUiState()
  const screen = buildScreenWiringState(uiState)
  const home = buildHomeWiringState(uiState)
  const admin = buildAdminWiringState(uiState)
  const detail = buildDetailWiringState(uiState)
  const editDish = buildEditDishWiringState(uiState)
  const favorites = buildFavoritesWiringState(uiState)
  const storeProfile = buildStoreProfileWiringState(uiState)
  const merchantChatList = buildMerchantChatListWiringState(uiState)
  const chat = buildChatWiringState(uiState)
  const chatMedia = buildChatMediaWiringState(uiState)
  const appointments = buildAppointmentsWiringState(uiState)
  const adminAppointments = buildAdminAppointmentsWiringState(uiState)
  const customerBookings = buildCustomerBookingsWiringState(uiState)
  const announcements = buildAnnouncementsWiringState(uiState)
  const announcementEdit = buildAnnouncementEditWiringState(uiState)

  return {
    uiState,
    screen,
    bottomNavigation: screen.bottomNavigation,
    syncCloud: screen.syncCloud,
    home,
    admin,
    detail,
    editDish,
    favorites,
    storeProfile,
    merchantChatList,
    chat,
    chatMedia,
    appointments,
    adminAppointments,
    customerBookings,
    announcements,
    announcementEdit,
    actions: createDefaultShowcaseUiWiringActions(input.actions || {})
  }
}
