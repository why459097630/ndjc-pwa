'use client'

import React from 'react'
import {
  ShowcaseBottomBar,
  type BackHomeActions,
  type BottomActions
} from './showcaseCommonComponents'
import { PlaceholderScreen } from './showcaseCustomerScreens'

export * from './showcaseCustomerScreens'
export * from './showcaseBookingScreens'
export * from './showcaseChatScreens'
export * from './showcaseAdminScreens'
export * from './showcaseAnnouncementScreens'

function PreviewActions(): BackHomeActions & BottomActions {
  return {
    onBack: () => {},
    onBackToHome: () => {},
    onOpenStoreProfileView: () => {},
    onOpenChat: () => {},
    onOpenCustomerBookings: () => {},
    onOpenAnnouncements: () => {},
    onOpenFavorites: () => {}
  }
}

export function ShowcaseLoginPreview() {
  return <PlaceholderScreen title="Login preview" actions={PreviewActions()} />
}

export function ShowcaseDishDetailPreview() {
  return <PlaceholderScreen title="Detail preview" actions={PreviewActions()} />
}

export function ShowcaseEditDishPreview() {
  return <PlaceholderScreen title="Edit item preview" actions={PreviewActions()} />
}

export function ShowcaseAdminPreview() {
  return <PlaceholderScreen title="Admin preview" actions={PreviewActions()} />
}

export function ShowcaseAdminItemsPreview() {
  return <PlaceholderScreen title="Admin items preview" actions={PreviewActions()} />
}

export function ShowcaseStoreProfileViewPreview() {
  return <PlaceholderScreen title="Store profile preview" actions={PreviewActions()} />
}

export function ShowcaseAdminCategoriesPreview() {
  return <PlaceholderScreen title="Admin categories preview" actions={PreviewActions()} />
}

export function ShowcaseHomePreview() {
  return <PlaceholderScreen title="Home preview" actions={PreviewActions()} />
}

export function ShowcaseChatThreadPreview() {
  return <PlaceholderScreen title="Chat preview" actions={PreviewActions()} />
}

export function ShowcaseStoreProfileEditPreview() {
  return <PlaceholderScreen title="Store profile edit preview" actions={PreviewActions()} />
}

export function ShowcaseChatSearchResultsPreview() {
  return <PlaceholderScreen title="Chat search preview" actions={PreviewActions()} />
}

export function ShowcaseChatMediaPreview() {
  return <PlaceholderScreen title="Chat media preview" actions={PreviewActions()} />
}

export function ShowcaseChangePasswordPreview() {
  return <PlaceholderScreen title="Change password preview" actions={PreviewActions()} />
}

export function ShowcaseBottomBarPreview() {
  return <ShowcaseBottomBar actions={PreviewActions()} activeTab="Store" />
}

export function ShowcaseMerchantChatListScreenPreview() {
  return <PlaceholderScreen title="Merchant chat list preview" actions={PreviewActions()} />
}

export function ShowcaseFavoritesScreenPreview() {
  return <PlaceholderScreen title="Favorites preview" actions={PreviewActions()} />
}
