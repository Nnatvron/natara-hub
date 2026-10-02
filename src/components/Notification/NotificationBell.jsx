import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Bell } from "lucide-react";

import { useNavigate } from "react-router-dom";

import useNotification from "../../hooks/useNotification";

import NotificationPanel from "./NotificationPanel";

import "./Notification.css";

function NotificationBell() {
  const navigate = useNavigate();

  const {
    currentUser,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const [isOpen, setIsOpen] =
    useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleNotificationClick = (
    notification
  ) => {
    markAsRead(notification.id);

    setIsOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className="notification-wrapper"
      ref={wrapperRef}
    >
      <button
        type="button"
        className={`icon-button notification-button ${
          isOpen ? "active" : ""
        }`}
        aria-label="Notifikasi"
        title="Notifikasi"
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={
            markAllAsRead
          }
          onNotificationClick={
            handleNotificationClick
          }
          onClose={() =>
            setIsOpen(false)
          }
        />
      )}
    </div>
  );
}

export default NotificationBell;