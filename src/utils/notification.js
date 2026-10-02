import { auth } from "../firebase/config";

/*
|--------------------------------------------------------------------------
| NOTIFICATION EVENT
|--------------------------------------------------------------------------
*/

const NOTIFICATION_EVENT =
  "natarahub:notifications-updated";

/*
|--------------------------------------------------------------------------
| GET CURRENT USER ID
|--------------------------------------------------------------------------
*/

function getCurrentUserId() {
  return auth.currentUser?.uid || null;
}

/*
|--------------------------------------------------------------------------
| USER-SPECIFIC NOTIFICATION KEY
|--------------------------------------------------------------------------
*/

function getNotificationKey() {
  const uid = getCurrentUserId();

  if (!uid) {
    return null;
  }

  return `natarahub_notifications_${uid}`;
}

/*
|--------------------------------------------------------------------------
| GET NOTIFICATIONS
|--------------------------------------------------------------------------
*/

function getNotifications() {
  const key =
    getNotificationKey();

  /*
   * Guest tidak memiliki
   * notifikasi.
   */

  if (!key) {
    return [];
  }

  try {
    const data =
      localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsed =
      JSON.parse(data);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

/*
|--------------------------------------------------------------------------
| SAVE NOTIFICATIONS
|--------------------------------------------------------------------------
*/

function saveNotifications(
  notifications
) {
  const key =
    getNotificationKey();

  /*
   * Guest tidak boleh menyimpan
   * notifikasi.
   */

  if (!key) {
    return [];
  }

  localStorage.setItem(
    key,
    JSON.stringify(
      notifications
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      NOTIFICATION_EVENT
    )
  );

  return notifications;
}

/*
|--------------------------------------------------------------------------
| CREATE NOTIFICATION
|--------------------------------------------------------------------------
*/

function createNotification({
  id,
  type,
  title,
  message,
  link = null,
}) {
  /*
   * Jangan membuat notifikasi
   * kalau belum login.
   */

  if (!getCurrentUserId()) {
    return [];
  }

  const notifications =
    getNotifications();

  /*
   * Hindari notifikasi duplikat
   * berdasarkan ID.
   */

  const existing =
    notifications.find(
      (item) =>
        item.id === id
    );

  if (existing) {
    return notifications;
  }

  const notification = {
    id,
    type,
    title,
    message,
    createdAt:
      new Date().toISOString(),
    read: false,
    link,
  };

  const updated = [
    notification,
    ...notifications,
  ];

  return saveNotifications(
    updated
  );
}

/*
|--------------------------------------------------------------------------
| MARK NOTIFICATION AS READ
|--------------------------------------------------------------------------
*/

function markNotificationAsRead(
  id
) {
  /*
   * Guest tidak memiliki
   * notifikasi.
   */

  if (!getCurrentUserId()) {
    return [];
  }

  const notifications =
    getNotifications();

  const updated =
    notifications.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
    );

  return saveNotifications(
    updated
  );
}

/*
|--------------------------------------------------------------------------
| MARK ALL NOTIFICATIONS AS READ
|--------------------------------------------------------------------------
*/

function markAllNotificationsAsRead() {
  /*
   * Guest tidak memiliki
   * notifikasi.
   */

  if (!getCurrentUserId()) {
    return [];
  }

  const notifications =
    getNotifications();

  const updated =
    notifications.map(
      (item) => ({
        ...item,
        read: true,
      })
    );

  return saveNotifications(
    updated
  );
}

/*
|--------------------------------------------------------------------------
| DELETE NOTIFICATION
|--------------------------------------------------------------------------
*/

function deleteNotification(
  id
) {
  /*
   * Guest tidak memiliki
   * notifikasi.
   */

  if (!getCurrentUserId()) {
    return [];
  }

  const notifications =
    getNotifications();

  const updated =
    notifications.filter(
      (item) =>
        item.id !== id
    );

  return saveNotifications(
    updated
  );
}

/*
|--------------------------------------------------------------------------
| GET UNREAD COUNT
|--------------------------------------------------------------------------
*/

function getUnreadNotificationCount() {
  if (!getCurrentUserId()) {
    return 0;
  }

  return getNotifications().filter(
    (item) => !item.read
  ).length;
}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export {
  NOTIFICATION_EVENT,
  getNotifications,
  saveNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
};