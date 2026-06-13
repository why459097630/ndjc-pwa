export type PwaPrivacyPolicyPageModel = {
  appName: string
  storeId: string
  merchantEmail: string
  effectiveDate: string
}

export const PWA_PRIVACY_POLICY_TEMPLATE = `Privacy Policy

Effective Date: {{effectiveDate}}

This Progressive Web App ("{{appName}}", or "the App") is operated by the app owner (the "Merchant", "we", "us", or "our").

Think It Done provides the technology platform and cloud infrastructure used to operate this App. The merchant is responsible for how they use customer information submitted through their App.

We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how information is collected, used, stored, and managed when you use the App.

--------------------------------------------------

1. App Structure and User Roles

The App is operated by the merchant and distributed to end users as a Progressive Web App.

There are two types of users:

(1) Merchant (App Owner)
The merchant creates and manages the App and must log in to access management features.

The merchant may:
• Publish products or services
• Upload product or service images
• Manage categories, prices, recommendation status, and visibility status
• Post announcements or promotional content
• Upload announcement images
• Manage business profile information
• Manage logo, cover image, business description, business scope, location, business hours, and contact information
• Communicate with users via in-app chat
• Send and receive chat images, product references, and appointment references
• Manage booking or appointment requests
• Confirm, cancel, or review appointment records
• Manage push notification settings
• Send notifications, such as chat replies, announcements, booking confirmations, and booking cancellations
• Manage the App through the merchant administration area

(2) Guest Users (No Login Required)
End users (guests) can install and use the App without creating an account.

Guest users may:
• Browse store information
• View products or services
• View product images, prices, categories, and recommendation labels
• Read announcements
• Save favorite items
• Submit booking or appointment requests
• Cancel eligible appointment requests
• Communicate with the merchant via in-app chat
• Send chat messages or chat images, if image messaging is enabled
• Open product references or appointment references inside chat
• Enable or disable push notifications
• Use the App in online, offline, or limited-connectivity conditions

--------------------------------------------------

2. Information We Collect

Depending on how you use the App, we may collect or process the following types of information:

• Merchant Account and Administration Data
  - Merchant email or login identifier
  - Merchant session information
  - Store identifier
  - Store membership or authorization information
  - Administrative actions needed to manage the App
  - App version and configuration information
  - Cloud service status needed to operate the App

• Merchant Business Profile Data
  - Business name
  - Business description
  - Business logo
  - Business cover image
  - Business scope
  - Location and map-related information
  - Business hours
  - Contact information
  - Additional business profile sections displayed in the App

• Product or Service Data
  - Product or service title
  - Description
  - Price
  - Original price or discounted price, if provided
  - Category
  - Images
  - Recommendation status
  - Visibility status
  - Created and updated timestamps
  - Display order and related management information

• Announcement Data
  - Announcement title
  - Announcement body
  - Announcement images
  - Publication status
  - View count
  - Created and updated timestamps

• Booking or Appointment Data
  - Customer name
  - Customer contact information
  - Selected service or related product
  - Preferred date
  - Preferred time
  - Optional note submitted by the customer
  - Appointment status
  - Cancellation status
  - Cancellation actor
  - Cancellation time
  - Source item snapshots, such as service title, price, image, category, and recommendation status
  - Created and updated timestamps
  - Chat references or appointment references related to the booking

• Chat and Conversation Data
  - Chat messages between customers and the merchant
  - Text messages
  - Image messages
  - Product references
  - Appointment references
  - Message status
  - Read status
  - Conversation identifiers
  - Sender and receiver role information
  - Created and updated timestamps
  - Chat search and media display data needed to provide chat features

• Guest User Data
  - Optional contact information submitted through chat or booking forms
  - Messages sent to the merchant
  - Booking or appointment details submitted by the guest
  - Saved or favorite items stored on the user's device
  - Notification preferences
  - Device installation information used to keep guest features working without requiring account login

• Device, Browser, and Notification Information
  - Push notification token
  - Device installation identifier
  - Notification audience type
  - Client identifier or merchant identifier needed to route notifications
  - Conversation identifier needed to route chat notifications
  - Platform information
  - Browser information
  - App version
  - Last-seen timestamp
  - Basic technical and usage data needed to operate, secure, cache, and synchronize the App

• Uploaded Content
  - Product or service images uploaded by the merchant
  - Business logo or cover image uploaded by the merchant
  - Announcement images uploaded by the merchant
  - Chat images submitted by the merchant or guest user, if image messaging is enabled

--------------------------------------------------

3. How We Use the Information

We use the collected information to:

• Provide core app functionality
• Display store information, products, services, prices, categories, images, and announcements
• Enable the merchant to manage business profile content
• Enable communication between the merchant and users
• Send, receive, display, search, and synchronize chat messages
• Display chat image messages, product references, and appointment references
• Process booking or appointment requests
• Allow eligible appointment cancellation
• Show appointment status, confirmation status, and cancellation status
• Store saved or favorite items
• Process basic interaction records, such as item click counts, announcement view counts, read status, unread counts, and last-seen timestamps, to provide app features and maintain service reliability
• Send push notifications, including chat replies, announcements, booking confirmations, booking cancellations, and other service-related updates
• Maintain offline access and improve app performance
• Cache app content so the Progressive Web App can load faster
• Queue pending offline actions and synchronize them when the network is available
• Protect the App from abuse, unauthorized access, and data isolation issues
• Maintain store-level separation between different merchants
• Diagnose technical issues and maintain service reliability

--------------------------------------------------

4. Progressive Web App Storage and Offline Use

Because the App is a Progressive Web App, some data may be stored on the user's device using browser storage, IndexedDB, Cache Storage, localStorage, or service worker storage.

This may include:

• App shell files
• Store content
• Merchant profile information
• Products or services
• Product or service images
• Announcements
• Announcement images
• Chat messages
• Chat image metadata
• Booking or appointment records
• Saved or favorite items
• Notification preferences
• Merchant login convenience data, such as remembered login name, where applicable
• Drafts
• Local cache records
• Pending offline actions

This local storage helps the App load faster, support offline access, keep recent content available, and sync pending actions when the network is available.

Users can clear browser storage from their device. Clearing browser storage may remove local App data, saved items, cached content, offline data, notification preferences, or login convenience data.

--------------------------------------------------

5. Cloud Data Storage and Infrastructure

Data may be stored securely using cloud services, including:

• Supabase for database, authentication, storage, and cloud functions
• Web Push services provided by the user's browser or operating system for push notifications
• Browser and operating system services needed to install, cache, and run the Progressive Web App

Supabase may be used to store and process:
• Store records
• Merchant account and session-related records
• Products or services
• Images and uploaded files
• Announcements
• Chat messages
• Appointment records
• Notification records
• Device installation records
• Store-scoped cloud data needed to operate the App

Web Push services may be used to process:
• Push notification subscription endpoints and keys
• Notification delivery data
• Device or browser information required to deliver notifications
• Notification events such as chat replies, announcements, booking confirmations, and booking cancellations

These services may process data in accordance with their own privacy policies.

Data is stored only as necessary to provide app functionality, maintain service reliability, protect the App, and comply with applicable service rules.

--------------------------------------------------

6. Notifications

The App may send push notifications, including:

• Chat messages from the merchant
• Chat replies
• Announcements or promotional updates
• Booking confirmations
• Booking cancellations
• Other service-related updates

If notifications are enabled, the App may collect and store push notification tokens, device installation identifiers, notification audience type, client or merchant identifiers, conversation identifiers, platform, app version, notification preference, and last-seen timestamps.

Push notification tokens and device identifiers are used only to deliver notifications, maintain notification preferences, route relevant app events, and keep notification delivery working.

Users may disable notifications through browser or device settings.

--------------------------------------------------

7. Saved Items

The App may allow users to save or favorite products or services.

Saved or favorite items may be stored locally on the user's device to provide the Saved feature.

If the user clears browser storage, changes device, changes browser, or uninstalls the App, saved items stored locally may be removed.

--------------------------------------------------

8. Data Sharing

We do not sell personal data.

We may share limited data with third-party infrastructure services only when required to operate the App, including:

• Supabase for database, authentication, storage, and cloud functions
• Web Push services provided by the user's browser or operating system for push notifications
• Browser and operating system services needed to install, cache, and run the Progressive Web App

The merchant may view and use customer information submitted through their App, such as chat messages, booking requests, appointment contact information, and related service records.

The merchant is responsible for using that information appropriately.

--------------------------------------------------

9. Store-Level Data Separation

The App is designed to keep data separated by store or merchant.

Store identifiers may be used to make sure that products, appointments, announcements, chat messages, uploaded files, notification records, and merchant administration data are connected to the correct store.

This helps prevent data from one merchant's App from being mixed with another merchant's App.

--------------------------------------------------

10. User Rights and Choices

Users may:

• Stop using the App at any time
• Disable notifications through browser or device settings
• Clear browser storage from their device
• Delete or uninstall the Progressive Web App from their device
• Contact the merchant to request access, correction, or deletion of information submitted through the App, if applicable

Some information may be required to provide core App features. For example, booking requests require contact information so the merchant can respond, and push notifications require a push token to deliver notifications.

--------------------------------------------------

11. Platform Provider

Think It Done provides the technology platform and cloud infrastructure used to operate this App.

Think It Done may provide the App framework, cloud connection, storage integration, notification integration, offline support, update support, and technical infrastructure needed to run the App.

The merchant is responsible for how they use customer information submitted through their App.

--------------------------------------------------

12. Data Retention

Data may be retained while the merchant's cloud service is active.

Cloud service data may be deleted after the service expires according to the applicable service rules.

Some data stored locally on a user's device may remain until the user clears browser storage, uninstalls the App, changes browser, changes device, or the browser removes stored data.

Chat messages, booking records, appointment records, uploaded images, announcements, product records, notification records, and merchant profile records may be retained as needed to operate the App, provide customer service, maintain records, and support service reliability.

--------------------------------------------------

13. Security

We use technical and organizational measures designed to protect App data.

These measures may include store-level data separation, authentication for merchant administration, cloud access rules, secure storage, and browser-based security controls.

No online service can guarantee absolute security.

--------------------------------------------------

14. Children's Privacy

The App is not intended for children under 13.

The App does not knowingly collect personal information from children under 13.

--------------------------------------------------

15. Changes to This Policy

We may update this Privacy Policy from time to time.

The updated version may be posted inside the App.

Continued use of the App after updates means the updated Privacy Policy applies.

--------------------------------------------------

16. Contact

For any questions, please contact the app owner:

{{merchantEmail}}`

function normalizeText(value: string, fallback: string): string {
  const normalized = value.trim()
  return normalized || fallback
}

export function buildPwaPrivacyPolicyPageModel(input: {
  storeId: string
  appName: string
  merchantEmail: string
  effectiveDate: string
}): PwaPrivacyPolicyPageModel {
  return {
    appName: normalizeText(input.appName, 'This App'),
    storeId: normalizeText(input.storeId, 'unknown'),
    merchantEmail: normalizeText(input.merchantEmail, 'Not provided'),
    effectiveDate: normalizeText(input.effectiveDate, '2026-04-20')
  }
}

function replaceTemplateValue(text: string, key: string, value: string): string {
  return text.split(key).join(value)
}

export function renderPwaPrivacyPolicyText(model: PwaPrivacyPolicyPageModel): string {
  return replaceTemplateValue(
    replaceTemplateValue(
      replaceTemplateValue(PWA_PRIVACY_POLICY_TEMPLATE, '{{appName}}', model.appName),
      '{{effectiveDate}}',
      model.effectiveDate
    ),
    '{{merchantEmail}}',
    model.merchantEmail
  )
}