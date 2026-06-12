import type { ShowcaseCloudRepository } from './showcaseCloudRepositoryCore'

export type {
  AuthRequestKind,
  CategoryWriteResult,
  ChatConversation,
  ChatMessage,
  ChatThreadSummary,
  CloudAnnouncement,
  CloudAppointmentFilterRow,
  CloudAppointmentRequest,
  CloudAppointmentSettings,
  CloudCategory,
  CloudDish,
  CloudDishFilterRow,
  CloudStoreProfile,
  CloudStorePwaProfile,
  CloudStoreServiceStatus,
  MerchantAuthSession,
  MerchantBinding,
  MerchantStoreMembership,
  PushDeviceAudience,
  PushDeviceUnregister,
  PushDeviceUpsert,
  PushRequestActor,
  RepositoryBucketNames,
  RepositoryConfigInput,
  RepositoryEdgeFunctionNames,
  RepositoryTableNames,
  ShowcaseRepositoryHttpResult,
  ShowcaseRepositoryJson,
  ShowcaseRepositoryRequestOptions,
  UploadBytesInput
} from './showcaseRepositoryCommon'

export type ShowcaseCatalogRepository = Pick<
  ShowcaseCloudRepository,
  | 'fetchCategoryMap'
  | 'fetchDishImagesByDishIds'
  | 'enrichDishesWithImages'
  | 'fetchDishesPaged'
  | 'fetchDishesByIds'
  | 'searchDishes'
  | 'fetchDishesFilteredPage'
  | 'fetchDishFilterRows'
  | 'getCategoryIdByName'
  | 'hasAnyDishReferencingCategoryId'
  | 'replaceDishImages'
  | 'deleteDishImageByUrl'
  | 'upsertDishFromDemo'
  | 'upsertDishSchemeA'
  | 'deleteDishById'
  | 'deleteCategoryByName'
  | 'setCategorySortOrder'
  | 'incrementDishClickCount'
>

export type ShowcaseBookingRepository = Pick<
  ShowcaseCloudRepository,
  | 'fetchAppointmentSettings'
  | 'upsertAppointmentSettings'
  | 'submitAppointmentRequest'
  | 'fetchAppointmentRequests'
  | 'fetchAppointmentFilterRows'
  | 'fetchAppointmentRequestsForMerchant'
  | 'fetchAppointmentRequestsForClient'
>

export type ShowcaseChatRepository = Pick<
  ShowcaseCloudRepository,
  | 'upsertChatConversation'
  | 'findChatConversation'
  | 'findOrCreateChatConversation'
  | 'fetchChatMessages'
  | 'insertChatMessage'
  | 'touchChatConversation'
  | 'markChatMessagesRead'
  | 'markUserMessagesRead'
  | 'fetchChatThreadSummaries'
  | 'updateChatThreadPinned'
  | 'deleteChatThread'
  | 'dispatchChatPush'
>

export type ShowcaseContentRepository = Pick<
  ShowcaseCloudRepository,
  | 'fetchStoreProfile'
  | 'fetchStorePwaProfile'
  | 'upsertStoreProfile'
  | 'fetchAnnouncements'
  | 'upsertAnnouncement'
  | 'deleteAnnouncement'
  | 'deleteAnnouncements'
  | 'incrementAnnouncementViewCount'
>

export type ShowcaseSystemRepository = Pick<
  ShowcaseCloudRepository,
  | 'upsertPushDevice'
  | 'unregisterPushDevice'
  | 'dispatchAnnouncementPush'
  | 'signInMerchant'
  | 'signOutMerchant'
  | 'fetchMerchantStoreMemberships'
  | 'fetchMerchantBindingForCurrentStore'
  | 'fetchMerchantBindingForStoreAndAuthUser'
  | 'updateMerchantPassword'
  | 'updateMerchantLoginName'
  | 'fetchStoreServiceStatus'
  | 'isStoreWriteAllowed'
  | 'updateStoreServiceStatus'
>

export type ShowcaseStorageRepository = Pick<
  ShowcaseCloudRepository,
  | 'uploadDishImageBytes'
  | 'uploadStoreImageBytes'
  | 'uploadAnnouncementImageBytes'
  | 'uploadChatImageBytes'
>
