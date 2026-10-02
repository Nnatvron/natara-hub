import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NOTIFICATION_EVENT,
} from "../utils/notification";

import {
  syncLearningNotifications,
} from "../utils/notificationEvents";

function useNotification() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [notifications, setNotifications] =
    useState([]);

  /*
  |--------------------------------------------------------------------------
  | AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);

          /*
           * Guest = tidak ada notifikasi.
           */

          if (!user) {
            setNotifications([]);
            return;
          }

          /*
           * User login:
           * sinkronkan notifikasi milik
           * akun tersebut.
           */

          syncLearningNotifications();

          setNotifications(
            getNotifications()
          );
        }
      );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | UNREAD COUNT
  |--------------------------------------------------------------------------
  */

  const unreadCount =
    currentUser
      ? notifications.filter(
          (item) => !item.read
        ).length
      : 0;

  /*
  |--------------------------------------------------------------------------
  | REFRESH NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  const refreshNotifications =
    () => {
      if (!auth.currentUser) {
        setNotifications([]);
        return;
      }

      syncLearningNotifications();

      setNotifications(
        getNotifications()
      );
    };

  /*
  |--------------------------------------------------------------------------
  | MARK AS READ
  |--------------------------------------------------------------------------
  */

  const markAsRead = (
    id
  ) => {
    if (!auth.currentUser) {
      return;
    }

    const updated =
      markNotificationAsRead(
        id
      );

    setNotifications(updated);
  };

  /*
  |--------------------------------------------------------------------------
  | MARK ALL AS READ
  |--------------------------------------------------------------------------
  */

  const markAllAsRead = () => {
    if (!auth.currentUser) {
      return;
    }

    const updated =
      markAllNotificationsAsRead();

    setNotifications(updated);
  };

  /*
  |--------------------------------------------------------------------------
  | LISTEN TO NOTIFICATION CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleStorageChange =
      () => {
        refreshNotifications();
      };

    const handleNotificationUpdate =
      () => {
        if (!auth.currentUser) {
          setNotifications([]);
          return;
        }

        setNotifications(
          getNotifications()
        );
      };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      NOTIFICATION_EVENT,
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        NOTIFICATION_EVENT,
        handleNotificationUpdate
      );
    };
  }, [currentUser]);

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    currentUser,
    notifications,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export default useNotification;