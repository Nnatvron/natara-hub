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

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);

          /*
           * Guest tidak memiliki
           * bookmark.
           */

          if (!user) {
            setBookmarks([]);
            return;
          }

          /*
           * Ambil bookmark berdasarkan
           * akun Firebase yang login.
           */

          setBookmarks(
            getBookmarks()
          );
        }
      );

    return () => unsubscribe();
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
      setBookmarks(
        getBookmarks()
      );
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

    const wasBookmarked =
      bookmarks.includes(
        materialId
      );

    const updated =
      toggleBookmark(
        materialId
      );

    setBookmarks(updated);

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
    toggle,
    isBookmarked,
  };
}

export default useBookmark;