import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Play,
  TrendingUp,
} from "lucide-react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../../firebase/config";

import courses from "../../data/courses";
import materials from "../../data/materials";

import {
  getCompletedMaterials,
  getBookmarks,
  getRecentMaterials,
} from "../../utils/storage";

import "./Dashboard.css";

function Dashboard() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | USER LEARNING DATA
  |--------------------------------------------------------------------------
  */

  const [
    completedMaterials,
    setCompletedMaterials,
  ] = useState([]);

  const [
    bookmarks,
    setBookmarks,
  ] = useState([]);

  const [
    recentMaterialIds,
    setRecentMaterialIds,
  ] = useState([]);

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
          setAuthLoading(false);

          /*
           * Guest tidak memiliki
           * progress / bookmark / history.
           */

          if (!user) {
            setCompletedMaterials([]);
            setBookmarks([]);
            setRecentMaterialIds([]);
            return;
          }

          /*
           * Ambil data learning user
           * yang sedang login.
           */

          setCompletedMaterials(
            getCompletedMaterials()
          );

          setBookmarks(
            getBookmarks()
          );

          setRecentMaterialIds(
            getRecentMaterials()
          );
        }
      );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH LEARNING DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!currentUser) {
      setCompletedMaterials([]);
      setBookmarks([]);
      setRecentMaterialIds([]);
      return;
    }

    const refreshData = () => {
      setCompletedMaterials(
        getCompletedMaterials()
      );

      setBookmarks(
        getBookmarks()
      );

      setRecentMaterialIds(
        getRecentMaterials()
      );
    };

    window.addEventListener(
      "storage",
      refreshData
    );

    /*
     * Refresh ketika tab kembali aktif.
     * Berguna ketika user membuka materi
     * dari halaman lain lalu kembali ke dashboard.
     */

    window.addEventListener(
      "focus",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshData
      );

      window.removeEventListener(
        "focus",
        refreshData
      );
    };
  }, [currentUser]);

  /*
  |--------------------------------------------------------------------------
  | OVERALL PROGRESS
  |--------------------------------------------------------------------------
  */

  const completedCount = currentUser
    ? materials.filter(
        (material) =>
          completedMaterials.includes(
            material.id
          )
      ).length
    : 0;

  const totalMaterials = currentUser
    ? materials.length
    : 0;

  const overallProgress =
    currentUser && materials.length
      ? Math.round(
          (completedCount /
            materials.length) *
            100
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | NEXT MATERIAL
  |--------------------------------------------------------------------------
  */

  const nextMaterial = currentUser
    ? materials.find(
        (material) =>
          !completedMaterials.includes(
            material.id
          )
      ) || null
    : null;

  const nextCourse = nextMaterial
    ? courses.find(
        (course) =>
          course.id ===
          nextMaterial.courseId
      )
    : null;

  /*
  |--------------------------------------------------------------------------
  | RECENT COMPLETED
  |--------------------------------------------------------------------------
  */

  const recentCompleted = currentUser
    ? [...completedMaterials]
        .reverse()
        .map((id) =>
          materials.find(
            (material) =>
              material.id === id
          )
        )
        .filter(Boolean)
        .slice(0, 4)
    : [];

  /*
  |--------------------------------------------------------------------------
  | RECENT VIEWED MATERIALS
  |--------------------------------------------------------------------------
  |
  | History berasal dari materi yang benar-benar
  | terakhir dibuka oleh user.
  |
  */

  const recentViewedMaterials =
    currentUser
      ? recentMaterialIds
          .map((id) =>
            materials.find(
              (material) =>
                material.id === id
            )
          )
          .filter(Boolean)
          .slice(0, 4)
      : [];

  /*
  |--------------------------------------------------------------------------
  | MATERIAL LOCK CHECK
  |--------------------------------------------------------------------------
  */

  const isMaterialLocked = (
    material
  ) => {
    const courseMaterials =
      materials.filter(
        (item) =>
          item.courseId ===
          material.courseId
      );

    const currentIndex =
      courseMaterials.findIndex(
        (item) =>
          item.id === material.id
      );

    if (currentIndex <= 0) {
      return false;
    }

    const previousMaterial =
      courseMaterials[
        currentIndex - 1
      ];

    return !completedMaterials.includes(
      previousMaterial.id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RECENT / FEATURED MATERIALS
  |--------------------------------------------------------------------------
  */

  const hasRecentHistory =
    recentViewedMaterials.length > 0;

  const recentMaterials =
    hasRecentHistory
      ? recentViewedMaterials
      : currentUser &&
          recentCompleted.length > 0
        ? recentCompleted
        : materials.slice(0, 4);

  /*
  |--------------------------------------------------------------------------
  | ACTIVE COURSES
  |--------------------------------------------------------------------------
  */

  const activeCourses = courses
    .map((course) => {
      const courseMaterials =
        materials.filter(
          (material) =>
            material.courseId ===
            course.id
        );

      if (!courseMaterials.length) {
        return null;
      }

      const completed =
        currentUser
          ? courseMaterials.filter(
              (material) =>
                completedMaterials.includes(
                  material.id
                )
            ).length
          : 0;

      const progress =
        currentUser
          ? Math.round(
              (completed /
                courseMaterials.length) *
                100
            )
          : 0;

      const isStarted =
        completed > 0;

      const isCompleted =
        completed ===
        courseMaterials.length;

      return {
        ...course,
        materialCount:
          courseMaterials.length,
        completed,
        progress,
        isStarted,
        isCompleted,
      };
    })
    .filter(Boolean);

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              NATARA HUB
            </span>

            <h1>
              Memuat Dashboard...
            </h1>

            <p>
              Menyiapkan data belajar kamu.
            </p>
          </div>
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD
  |--------------------------------------------------------------------------
  */

  return (
    <div className="dashboard-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            NATARA HUB
          </span>

          <h1>
            {currentUser
              ? `Selamat datang, ${
                  currentUser.displayName ||
                  "Mahasiswa"
                } 👋`
              : "Selamat datang 👋"}
          </h1>

          <p>
            {currentUser
              ? "Lanjutkan perjalanan belajar kamu dan pahami materi satu per satu."
              : "Login untuk mulai menyimpan progress dan melanjutkan perjalanan belajar kamu."}
          </p>
        </div>

        <Link
          to="/progress"
          className="dashboard-progress-link"
        >
          <TrendingUp size={17} />
          Lihat Progress
        </Link>
      </section>

      {/* =========================================
          STATS
      ========================================= */}

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>
              Materi Selesai
            </span>

            <strong>
              {completedCount}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>
              Total Materi
            </span>

            <strong>
              {totalMaterials}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Bookmark size={20} />
          </div>

          <div>
            <span>
              Disimpan
            </span>

            <strong>
              {currentUser
                ? bookmarks.length
                : 0}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>
              Progress
            </span>

            <strong>
              {overallProgress}%
            </strong>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTINUE LEARNING
      ========================================= */}

      {nextMaterial && nextCourse ? (
        <section className="dashboard-continue">
          <div className="dashboard-continue-content">
            <span className="dashboard-card-label">
              Continue Learning
            </span>

            <h2>
              {nextMaterial.title}
            </h2>

            <p>
              {nextCourse.title} ·{" "}
              {nextMaterial.duration}
            </p>

            <div className="dashboard-continue-meta">
              <span>
                <BookOpen size={14} />

                {nextMaterial.type ||
                  "Materi"}
              </span>

              <span>
                <Clock3 size={14} />

                {nextMaterial.duration}
              </span>
            </div>

            <Link
              to={`/material/${nextMaterial.id}`}
              className="dashboard-start-button"
            >
              <Play
                size={16}
                fill="currentColor"
              />

              {completedCount > 0
                ? "Lanjutkan Belajar"
                : "Mulai Belajar"}
            </Link>
          </div>

          <div className="dashboard-continue-progress">
            <div className="continue-progress-circle">
              <strong>
                {overallProgress}%
              </strong>
            </div>

            <span>
              Overall Progress
            </span>
          </div>
        </section>
      ) : currentUser &&
        completedCount ===
          materials.length ? (
        <section className="dashboard-empty">
          <div className="dashboard-empty-icon">
            <CheckCircle2 size={24} />
          </div>

          <h2>
            Semua materi selesai 🎉
          </h2>

          <p>
            Kamu sudah menyelesaikan seluruh
            materi yang tersedia di NATARA HUB.
          </p>

          <Link to="/progress">
            Lihat Progress
            <ArrowRight size={16} />
          </Link>
        </section>
      ) : null}

      {/* =========================================
          ACTIVE COURSES
      ========================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>
              Learning Path
            </span>

            <h2>
              Mata Kuliah yang Dipelajari
            </h2>
          </div>

          <Link to="/semester">
            Semua Semester
            <ArrowRight size={15} />
          </Link>
        </div>

        {activeCourses.length > 0 ? (
          <div className="dashboard-course-grid">
            {activeCourses.map(
              (course) => (
                <Link
                  to={`/course/${course.id}`}
                  className="dashboard-course-card"
                  key={course.id}
                >
                  <div className="dashboard-course-top">
                    <div className="dashboard-course-icon">
                      {course.isCompleted ? (
                        <CheckCircle2
                          size={19}
                        />
                      ) : (
                        <BookOpen
                          size={19}
                        />
                      )}
                    </div>

                    <span>
                      Semester{" "}
                      {course.semester}
                    </span>
                  </div>

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    {course.description}
                  </p>

                  <div className="dashboard-course-progress">
                    <div className="dashboard-course-progress-top">
                      <span>
                        {course.completed}/
                        {
                          course.materialCount
                        }{" "}
                        selesai
                      </span>

                      <strong>
                        {course.progress}%
                      </strong>
                    </div>

                    <div className="dashboard-course-bar">
                      <div
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="dashboard-course-status">
                    {course.isCompleted
                      ? "Course Selesai"
                      : course.isStarted
                      ? "Sedang Dipelajari"
                      : "Belum Dimulai"}
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="dashboard-small-empty">
            Belum ada mata kuliah dengan materi
            tersedia.
          </div>
        )}
      </section>

      {/* =========================================
          RECENT / FEATURED MATERIAL
      ========================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>
              Library
            </span>

            <h2>
              {hasRecentHistory
                ? "Terakhir Dipelajari"
                : recentCompleted.length > 0
                ? "Terakhir Dipelajari"
                : "Materi Pilihan"}
            </h2>
          </div>

          <Link to="/semester">
            Lihat Semua
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="dashboard-material-list">
          {recentMaterials.map(
            (material) => {
              const course =
                courses.find(
                  (item) =>
                    item.id ===
                    material.courseId
                );

              const isCompleted =
                completedMaterials.includes(
                  material.id
                );

              const locked =
                !isCompleted &&
                currentUser &&
                isMaterialLocked(
                  material
                );

              const materialContent = (
                <>
                  <div
                    className={`dashboard-material-status ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      locked
                        ? "locked"
                        : ""
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        size={18}
                      />
                    ) : locked ? (
                      <LockKeyhole
                        size={18}
                      />
                    ) : (
                      <BookOpen
                        size={18}
                      />
                    )}
                  </div>

                  <div className="dashboard-material-info">
                    <span>
                      {course?.title ||
                        "Materi"}
                    </span>

                    <h3>
                      {material.title}
                    </h3>

                    <p>
                      {material.duration} ·{" "}
                      {material.type ||
                        "Materi"}
                    </p>

                    {locked && (
                      <small className="dashboard-material-locked-text">
                        Terkunci —
                        selesaikan materi
                        sebelumnya
                        terlebih dahulu.
                      </small>
                    )}
                  </div>

                  {locked ? (
                    <LockKeyhole
                      size={17}
                      className="dashboard-material-lock"
                    />
                  ) : (
                    <ArrowRight
                      size={17}
                    />
                  )}
                </>
              );

              if (locked) {
                return (
                  <div
                    className="dashboard-material-item locked"
                    key={material.id}
                    aria-disabled="true"
                  >
                    {materialContent}
                  </div>
                );
              }

              return (
                <Link
                  to={`/material/${material.id}`}
                  className="dashboard-material-item"
                  key={material.id}
                >
                  {materialContent}
                </Link>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;