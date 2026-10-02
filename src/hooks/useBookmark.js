import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

import {
  getBookmarks,
  toggleBookmark,
} from "../utils/storage";

import materials from "../data/materials";

import {
  createNotification,
} from "../utils/notification";

function useBookmark() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [bookmarks, setBookmarks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          if (!mounted) {
            return;
          }

          try {
            setError(null);
            setCurrentUser(user);

            /*
             * Guest tidak memiliki
             * bookmark.
             */

            if (!user) {
              setBookmarks([]);
              setLoading(false);
              return;
            }

            /*
             * Ambil bookmark berdasarkan
             * akun Firebase yang login.
             */

            const savedBookmarks =
              getBookmarks();

            setBookmarks(
              Array.isArray(
                savedBookmarks
              )
                ? savedBookmarks
                : []
            );

            setLoading(false);
          } catch (err) {
            console.error(
              "Bookmark load error:",
              err
            );

            setBookmarks([]);

            setError(
              "Bookmark tidak dapat dimuat."
            );

            setLoading(false);
          }
        },
        (err) => {
          if (!mounted) {
            return;
          }

          console.error(
            "Auth listener error:",
            err
          );

          setCurrentUser(null);
          setBookmarks([]);

          setError(
            "Terjadi masalah saat memuat akun."
          );

          setLoading(false);
        }
      );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH BOOKMARK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      return;
    }

    const refreshBookmarks = () => {
      try {
        const savedBookmarks =
          getBookmarks();

        setBookmarks(
          Array.isArray(
            savedBookmarks
          )
            ? savedBookmarks
            : []
        );

        setError(null);
      } catch (err) {
        console.error(
          "Bookmark refresh error:",
          err
        );

        setError(
          "Bookmark tidak dapat diperbarui."
        );
      }
    };

    window.addEventListener(
      "storage",
      refreshBookmarks
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshBookmarks
      );
    };
  }, [currentUser]);

  /*
  |--------------------------------------------------------------------------
  | TOGGLE BOOKMARK
  |--------------------------------------------------------------------------
  */

  const toggle = (
    materialId
  ) => {
    /*
     * Guest tidak boleh menyimpan
     * bookmark.
     */

    if (!auth.currentUser) {
      return;
    }

    try {
      const wasBookmarked =
        bookmarks.includes(
          materialId
        );

      const updated =
        toggleBookmark(
          materialId
        );

      setBookmarks(
        Array.isArray(updated)
          ? updated
          : []
      );

      setError(null);

      /*
       * Cari materi.
       */

      const material =
        materials.find(
          (item) =>
            item.id === materialId
        );

      if (!material) {
        return;
      }

      /*
       * Notifikasi hanya ketika
       * materi baru ditambahkan.
       */

      if (!wasBookmarked) {
        createNotification({
          id: `bookmark-${material.id}`,
          type: "bookmark",
          title: "Materi disimpan",
          message: `${material.title} telah ditambahkan ke bookmark.`,
          link: `/material/${material.id}`,
        });
      }
    } catch (err) {
      console.error(
        "Toggle bookmark error:",
        err
      );

      setError(
        "Bookmark tidak dapat diperbarui."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK BOOKMARK
  |--------------------------------------------------------------------------
  */

  const isBookmarked = (
    materialId
  ) => {
    return bookmarks.includes(
      materialId
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    currentUser,
    bookmarks,
    loading,
    error,
    toggle,
    isBookmarked,
  };
}

export default useBookmark;