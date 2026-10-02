import { auth } from "../firebase/config";

import materials from "../data/materials";

import {
  getCompletedMaterials,
} from "./storage";

import {
  createNotification,
} from "./notification";

/*
|--------------------------------------------------------------------------
| SYNC LEARNING NOTIFICATIONS
|--------------------------------------------------------------------------
|
| Membuat notifikasi berdasarkan progress
| user yang sedang login.
|
*/

function syncLearningNotifications() {
  /*
   * Guest tidak memiliki
   * notifikasi belajar.
   */

  if (!auth.currentUser) {
    return;
  }

  /*
   * Ambil progress milik user
   * yang sedang login.
   */

  const completedMaterials =
    getCompletedMaterials();

  if (
    !Array.isArray(
      completedMaterials
    )
  ) {
    return;
  }

  /*
   |--------------------------------------------------------------------------
   | MATERIAL COMPLETED
   |--------------------------------------------------------------------------
   */

  completedMaterials.forEach(
    (materialId) => {
      const material =
        materials.find(
          (item) =>
            item.id === materialId
        );

      if (!material) {
        return;
      }

      createNotification({
        id: `material-completed-${material.id}`,
        type: "material",
        title: "Materi selesai",
        message: `Kamu telah menyelesaikan ${material.title}.`,
        link: `/material/${material.id}`,
      });
    }
  );

  /*
   |--------------------------------------------------------------------------
   | NEXT MATERIAL UNLOCKED
   |--------------------------------------------------------------------------
   */

  completedMaterials.forEach(
    (materialId) => {
      const material =
        materials.find(
          (item) =>
            item.id === materialId
        );

      if (!material) {
        return;
      }

      /*
       * Ambil semua materi
       * dalam course yang sama.
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
       * Kalau masih ada materi
       * berikutnya.
       */

      if (
        currentIndex === -1 ||
        currentIndex >=
          courseMaterials.length - 1
      ) {
        return;
      }

      const nextMaterial =
        courseMaterials[
          currentIndex + 1
        ];

      /*
       * Kalau materi berikutnya
       * belum selesai, berarti
       * sudah terbuka.
       */

      const nextAlreadyCompleted =
        completedMaterials.includes(
          nextMaterial.id
        );

      if (
        !nextAlreadyCompleted
      ) {
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
  );

  /*
  |--------------------------------------------------------------------------
  | LEARNING MILESTONES
  |--------------------------------------------------------------------------
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
        completedMaterials.length ===
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
}

export {
  syncLearningNotifications,
};