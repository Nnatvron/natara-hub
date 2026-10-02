import {
  Bell,
  CheckCheck,
  FileQuestion,
  LockOpen,
  Bookmark,
  Trophy,
  CircleCheck,
} from "lucide-react";

function getNotificationIcon(type) {
  switch (type) {
    case "material":
      return <CircleCheck size={17} />;

    case "unlock":
      return <LockOpen size={17} />;

    case "quiz":
      return <FileQuestion size={17} />;

    case "bookmark":
      return <Bookmark size={17} />;

    case "milestone":
      return <Trophy size={17} />;

    default:
      return <Bell size={17} />;
  }
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diff = Math.floor(
    (now - date) / 1000
  );

  if (diff < 60) {
    return "Baru saja";
  }

  if (diff < 3600) {
    return `${Math.floor(
      diff / 60
    )} menit lalu`;
  }

  if (diff < 86400) {
    return `${Math.floor(
      diff / 3600
    )} jam lalu`;
  }

  if (diff < 604800) {
    return `${Math.floor(
      diff / 86400
    )} hari lalu`;
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function NotificationPanel({
  notifications = [],
  unreadCount = 0,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}) {
  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <div>
          <h3>Notifikasi</h3>

          {unreadCount > 0 && (
            <span>
              {unreadCount} belum dibaca
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="notification-read-all"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck size={15} />
            Tandai semua
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              <Bell size={22} />
            </div>

            <strong>
              Tidak ada notifikasi
            </strong>

            <span>
              Belum ada aktivitas baru untuk kamu.
            </span>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                type="button"
                key={notification.id}
                className={`notification-item ${
                  !notification.read
                    ? "unread"
                    : ""
                }`}
                onClick={() =>
                  onNotificationClick(
                    notification
                  )
                }
              >
                <div
                  className={`notification-icon notification-icon-${notification.type}`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <strong>
                      {notification.title}
                    </strong>

                    {!notification.read && (
                      <span className="notification-unread-dot" />
                    )}
                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <time>
                    {formatTime(
                      notification.createdAt
                    )}
                  </time>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;