import { Link } from "react-router-dom";

import {
  Bookmark,
  BookOpen,
  Clock3,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  XCircle,
} from "lucide-react";

import materials from "../../data/materials";
import courses from "../../data/courses";

import useBookmark from "../../hooks/useBookmark";
import useProgress from "../../hooks/useProgress";

import "./Bookmark.css";

function BookmarkPage() {
  const {
    bookmarks,
    loading: bookmarkLoading,
    error: bookmarkError,
  } = useBookmark();

  const {
    completedMaterials,
    loading: progressLoading,
    error: progressError,
  } = useProgress();

  const learningDataLoading =
    bookmarkLoading || progressLoading;

  const learningError =
    bookmarkError || progressError;

  if (learningDataLoading) {
    return (
      <div className="bookmark-page">
        <div className="bookmark-loading-state">
          <div className="bookmark-loading-spinner" />

          <div>
            <h2>Memuat bookmark...</h2>
            <p>
              Data bookmark dan progress sedang disiapkan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bookmarkedMaterials = materials.filter(
    (material) => bookmarks.includes(material.id)
  );

  /*
   * Cek apakah sebuah materi boleh dibuka.
   *
   * Materi pertama dalam sebuah course selalu bisa
   * dibuka. Materi berikutnya hanya bisa dibuka jika
   * materi sebelumnya sudah selesai.
   */
  const isMaterialLocked = (material) => {
    const courseMaterials = materials.filter(
      (item) => item.courseId === material.courseId
    );

    const currentIndex = courseMaterials.findIndex(
      (item) => item.id === material.id
    );

    if (currentIndex <= 0) {
      return false;
    }

    const previousMaterial =
      courseMaterials[currentIndex - 1];

    return !completedMaterials.includes(
      previousMaterial.id
    );
  };

  return (
    <div className="bookmark-page">
      <div className="bookmark-header">
        <span className="bookmark-eyebrow">
          Your Library
        </span>

        <h1>Bookmark</h1>

        <p>
          Simpan materi yang ingin kamu baca kembali
          kapan saja.
        </p>
      </div>

      {learningError && (
        <div className="bookmark-error-state">
          <div className="bookmark-error-icon">
            <XCircle size={18} />
          </div>

          <div>
            <strong>
              Data bookmark belum dapat dimuat
            </strong>

            <p>{learningError}</p>
          </div>
        </div>
      )}

      {bookmarkedMaterials.length > 0 ? (
        <div className="bookmark-list">
          {bookmarkedMaterials.map((material) => {
            const course = courses.find(
              (item) => item.id === material.courseId
            );

            const locked =
              isMaterialLocked(material);

            const completed =
              completedMaterials.includes(
                material.id
              );

            /*
             * Materi terkunci tidak menggunakan Link.
             * Jadi bookmark tidak bisa menjadi jalan
             * untuk melewati urutan materi.
             */
            if (locked) {
              return (
                <div
                  className="bookmark-card locked"
                  key={material.id}
                  aria-disabled="true"
                >
                  <div className="bookmark-icon">
                    <LockKeyhole size={18} />
                  </div>

                  <div className="bookmark-content">
                    <span className="bookmark-course">
                      {course?.title ||
                        "Mata Kuliah"}
                    </span>

                    <h2>{material.title}</h2>

                    <p>
                      Materi ini akan terbuka setelah
                      materi sebelumnya diselesaikan.
                    </p>

                    <div className="bookmark-meta">
                      <span>
                        <Clock3 size={13} />
                        {material.duration}
                      </span>

                      <span>
                        <BookOpen size={13} />
                        {material.type || "Reading"}
                      </span>

                      <span className="bookmark-lock-status">
                        <LockKeyhole size={13} />
                        Terkunci
                      </span>
                    </div>
                  </div>

                  <div className="bookmark-arrow">
                    <LockKeyhole size={17} />
                  </div>
                </div>
              );
            }

            return (
              <Link
                to={`/material/${material.id}`}
                className={`bookmark-card ${
                  completed ? "completed" : ""
                }`}
                key={material.id}
              >
                <div className="bookmark-icon">
                  {completed ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </div>

                <div className="bookmark-content">
                  <span className="bookmark-course">
                    {course?.title ||
                      "Mata Kuliah"}
                  </span>

                  <h2>{material.title}</h2>

                  <p>
                    {material.description}
                  </p>

                  <div className="bookmark-meta">
                    <span>
                      <Clock3 size={13} />
                      {material.duration}
                    </span>

                    <span>
                      <BookOpen size={13} />
                      {material.type || "Reading"}
                    </span>

                    {completed && (
                      <span className="bookmark-completed-status">
                        <CheckCircle2 size={13} />
                        Selesai
                      </span>
                    )}
                  </div>
                </div>

                <div className="bookmark-arrow">
                  <ArrowRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bookmark-empty">
          <div className="bookmark-empty-icon">
            <Bookmark size={23} />
          </div>

          <h2>Belum ada bookmark</h2>

          <p>
            Simpan materi yang menurutmu penting agar
            mudah ditemukan kembali.
          </p>

          <Link to="/semester">
            Jelajahi Materi
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default BookmarkPage;