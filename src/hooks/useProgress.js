import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

import {
  getCompletedMaterials,
  markMaterialCompleted,
  removeCompletedMaterial,
} from "../utils/storage";

import materials from "../data/materials";

import {
  createNotification,
} from "../utils/notification";

function useProgress() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [completedMaterials, setCompletedMaterials] =
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
           * Guest tidak memiliki progress.
           */

          if (!user) {
            setCompletedMaterials([]);
            return;
          }

          /*
           * Ambil progress berdasarkan
           * akun Firebase yang sedang login.
           */

          setCompletedMaterials(
            getCompletedMaterials()
          );
        }
      );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH PROGRESS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!currentUser) {
      setCompletedMaterials([]);
      return;
    }

    const refreshProgress = () => {
      setCompletedMaterials(
        getCompletedMaterials()
      );
    };

    window.addEventListener(
      "storage",
      refreshProgress
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshProgress
      );
    };
  }, [currentUser]);

  /*
  |--------------------------------------------------------------------------
  | MARK COMPLETED
  |--------------------------------------------------------------------------
  */

  const markCompleted = (
    materialId
  ) => {
    /*
     * Guest tidak boleh menyimpan
     * progress.
     */

    if (!auth.currentUser) {
      return;
    }

    const alreadyCompleted =
      completedMaterials.includes(
        materialId
      );

    const updated =
      markMaterialCompleted(
        materialId
      );

    setCompletedMaterials(
      updated
    );

    /*
     * Jika sudah selesai sebelumnya,
     * jangan buat notifikasi lagi.
     */

    if (alreadyCompleted) {
      return;
    }

    const material =
      materials.find(
        (item) =>
          item.id === materialId
      );

    if (!material) {
      return;
    }

    /*
     * NOTIFICATION:
     * Materi selesai.
     */

    createNotification({
      id: `material-completed-${material.id}`,
      type: "material",
      title: "Materi selesai",
      message: `Kamu telah menyelesaikan ${material.title}.`,
      link: `/material/${material.id}`,
    });

    /*
     * CARI MATERI DALAM COURSE
     */

    const courseMaterials =
      materials.filter(
        (item) =>
          item.courseId ===
          material.courseId
      );

    const currentIndex =
      courseMaterials.findIndex(
        (item) =>
          item.id === materialId
      );

    /*
     * NOTIFICATION:
     * Materi berikutnya terbuka.
     */

    if (
      currentIndex !== -1 &&
      currentIndex <
        courseMaterials.length - 1
    ) {
      const nextMaterial =
        courseMaterials[
          currentIndex + 1
        ];

      const nextAlreadyCompleted =
        updated.includes(
          nextMaterial.id
        );

      if (!nextAlreadyCompleted) {
        createNotification({
          id: `material-unlocked-${nextMaterial.id}`,
          type: "unlock",
          title:
            "Materi berikutnya terbuka",
          message: `${nextMaterial.title} sekarang sudah bisa kamu pelajari.`,
          link: `/material/${nextMaterial.id}`,
        });
      }
    }

    /*
     * MILESTONE
     */

    const milestones = [
      1,
      5,
      10,
      20,
    ];

    milestones.forEach(
      (milestone) => {
        if (
          updated.length ===
          milestone
        ) {
          createNotification({
            id: `milestone-${milestone}`,
            type: "milestone",
            title:
              "Progress belajar bertambah",
            message: `Kamu sudah menyelesaikan ${milestone} materi. Terus lanjutkan belajarnya!`,
            link: "/progress",
          });
        }
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MARK INCOMPLETE
  |--------------------------------------------------------------------------
  */

  const markIncomplete = (
    materialId
  ) => {
    /*
     * Guest tidak boleh mengubah
     * progress.
     */

    if (!auth.currentUser) {
      return;
    }

    const updated =
      removeCompletedMaterial(
        materialId
      );

    setCompletedMaterials(
      updated
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK COMPLETED
  |--------------------------------------------------------------------------
  */

  const isCompleted = (
    materialId
  ) => {
    return completedMaterials.includes(
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
    completedMaterials,
    markCompleted,
    markIncomplete,
    isCompleted,
  };
}

export default useProgress;