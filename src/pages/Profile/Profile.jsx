import { useEffect, useMemo, useState } from "react";

import {
  UserRound,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Trophy,
  ArrowRight,
  LogIn,
  UserPlus,
  LogOut,
  UserRoundCog,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/config";

import materials from "../../data/materials";
import quizzes from "../../data/quiz";

import useProgress from "../../hooks/useProgress";
import useBookmark from "../../hooks/useBookmark";
import useQuiz from "../../hooks/useQuiz";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | AUTH STATE
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | LEARNING DATA
  |--------------------------------------------------------------------------
  */

  const {
    completedMaterials,
  } = useProgress();

  const {
    bookmarks,
  } = useBookmark();

  const {
    scores,
  } = useQuiz();

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
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | ACCOUNT
  |--------------------------------------------------------------------------
  */

  const isLoggedIn =
    currentUser !== null;

  const userName =
    currentUser?.displayName ||
    "Mahasiswa";

  const userInitial =
    currentUser?.displayName
      ?.charAt(0)
      .toUpperCase() ||
    "M";

  /*
  |--------------------------------------------------------------------------
  | MATERIAL STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalMaterials =
    isLoggedIn
      ? materials.length
      : 0;

  const completedCount =
    useMemo(() => {
      if (!isLoggedIn) {
        return 0;
      }

      return materials.filter(
        (material) =>
          completedMaterials.includes(
            material.id
          )
      ).length;
    }, [
      isLoggedIn,
      completedMaterials,
    ]);

  const progress =
    totalMaterials > 0
      ? Math.round(
          (completedCount /
            totalMaterials) *
            100
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | QUIZ STATISTICS
  |--------------------------------------------------------------------------
  |
  | useQuiz menyimpan score menggunakan
  | material.id.
  |
  | Karena itu kita menggunakan
  | quiz.materialId sebagai key.
  |
  */

  const attemptedQuizzes =
    useMemo(() => {
      if (!isLoggedIn) {
        return [];
      }

      return quizzes.filter(
        (quiz) =>
          scores[
            quiz.materialId
          ] !== undefined
      );
    }, [
      isLoggedIn,
      scores,
    ]);

  const passedQuizzes =
    attemptedQuizzes.filter(
      (quiz) =>
        scores[
          quiz.materialId
        ] === 100
    ).length;

  /*
  |--------------------------------------------------------------------------
  | QUIZ AVERAGE
  |--------------------------------------------------------------------------
  */

  const quizAverage =
    attemptedQuizzes.length > 0
      ? Math.round(
          attemptedQuizzes.reduce(
            (total, quiz) =>
              total +
              Number(
                scores[
                  quiz.materialId
                ] ?? 0
              ),
            0
          ) /
            attemptedQuizzes.length
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | BEST QUIZ SCORE
  |--------------------------------------------------------------------------
  */

  const highestQuizScore =
    attemptedQuizzes.length > 0
      ? Math.max(
          ...attemptedQuizzes.map(
            (quiz) =>
              Number(
                scores[
                  quiz.materialId
                ] ?? 0
              )
          )
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | BOOKMARK
  |--------------------------------------------------------------------------
  */

  const bookmarkCount =
    isLoggedIn
      ? bookmarks.length
      : 0;

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async (
    redirectTo
  ) => {
    try {
      await signOut(auth);

      navigate(
        redirectTo,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="profile-page">
      {/* PROFILE HEADER */}

      <section className="profile-card">
        <div className="profile-avatar">
          {isLoggedIn ? (
            <span>
              {userInitial}
            </span>
          ) : (
            <UserRound size={30} />
          )}
        </div>

        <div className="profile-info">
          <span className="profile-eyebrow">
            Student Profile
          </span>

          <h1>
            {isLoggedIn
              ? userName
              : "Guest"}
          </h1>

          <p>
            {isLoggedIn
              ? "Mahasiswa Teknologi Informasi"
              : "Silakan login untuk mulai belajar"}
          </p>
        </div>
      </section>

      {/* LEARNING SUMMARY */}

      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <span>
              Learning Summary
            </span>

            <h2>
              Ringkasan Belajar
            </h2>

            <p>
              Gambaran singkat perkembangan
              belajarmu di NATARA HUB.
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <BookOpen size={19} />
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

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <CheckCircle2 size={19} />
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

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Trophy size={19} />
            </div>

            <div>
              <span>
                Quiz Lulus
              </span>

              <strong>
                {passedQuizzes}
              </strong>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Bookmark size={19} />
            </div>

            <div>
              <span>
                Bookmark
              </span>

              <strong>
                {bookmarkCount}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ PERFORMANCE */}

      {isLoggedIn && (
        <section className="profile-section">
          <div className="profile-section-header">
            <div>
              <span>
                Quiz Performance
              </span>

              <h2>
                Performa Quiz
              </h2>

              <p>
                Ringkasan hasil quiz yang
                sudah kamu kerjakan.
              </p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">
                <BookOpen size={19} />
              </div>

              <div>
                <span>
                  Quiz Dikerjakan
                </span>

                <strong>
                  {attemptedQuizzes.length}
                </strong>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon">
                <Trophy size={19} />
              </div>

              <div>
                <span>
                  Rata-rata Nilai
                </span>

                <strong>
                  {quizAverage}
                </strong>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <span>
                  Nilai Tertinggi
                </span>

                <strong>
                  {highestQuizScore}
                </strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEARNING PROGRESS */}

      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <span>
              Learning Progress
            </span>

            <h2>
              Progress Belajar
            </h2>

            <p>
              Perkembangan materi yang
              sudah kamu selesaikan.
            </p>
          </div>

          <strong className="profile-progress-value">
            {progress}%
          </strong>
        </div>

        <div className="profile-progress-container">
          <div className="profile-progress-bar">
            <div
              style={{
                width:
                  progress + "%",
              }}
            />
          </div>

          <div className="profile-progress-meta">
            <span>
              {completedCount} dari{" "}
              {totalMaterials} materi
              selesai
            </span>

            <span>
              {progress === 100
                ? "Semua materi selesai"
                : "Terus lanjut belajar"}
            </span>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}

      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <span>
              Quick Access
            </span>

            <h2>
              Akses Cepat
            </h2>

            <p>
              Akses halaman yang paling
              sering digunakan.
            </p>
          </div>
        </div>

        <div className="profile-links">
          <Link
            to="/progress"
            className="profile-link-card"
          >
            <div className="profile-link-icon">
              <CheckCircle2
                size={19}
              />
            </div>

            <div>
              <strong>
                Progress Belajar
              </strong>

              <span>
                Lihat perkembangan materi
                dan quiz
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

          <Link
            to="/bookmark"
            className="profile-link-card"
          >
            <div className="profile-link-icon">
              <Bookmark size={19} />
            </div>

            <div>
              <strong>
                Bookmark
              </strong>

              <span>
                Lihat materi yang kamu
                simpan
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>

          <Link
            to="/semester"
            className="profile-link-card"
          >
            <div className="profile-link-icon">
              <BookOpen size={19} />
            </div>

            <div>
              <strong>
                Jelajahi Materi
              </strong>

              <span>
                Lanjutkan pembelajaran
                berdasarkan semester
              </span>
            </div>

            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ACCOUNT */}

      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <span>
              Account
            </span>

            <h2>
              Akun
            </h2>

            <p>
              Kelola akses akun NATARA HUB
              kamu.
            </p>
          </div>
        </div>

        {!authLoading &&
        !isLoggedIn ? (
          <div className="profile-links">
            <Link
              to="/login"
              className="profile-link-card"
            >
              <div className="profile-link-icon">
                <LogIn size={19} />
              </div>

              <div>
                <strong>
                  Login
                </strong>

                <span>
                  Masuk ke akun NATARA HUB
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>

            <Link
              to="/register"
              className="profile-link-card"
            >
              <div className="profile-link-icon">
                <UserPlus
                  size={19}
                />
              </div>

              <div>
                <strong>
                  Sign Up
                </strong>

                <span>
                  Buat akun NATARA HUB baru
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>
          </div>
        ) : !authLoading &&
          isLoggedIn ? (
          <div className="profile-links">
            <button
              type="button"
              className="profile-link-card profile-account-button"
              onClick={() =>
                handleLogout(
                  "/login"
                )
              }
            >
              <div className="profile-link-icon">
                <UserRoundCog
                  size={19}
                />
              </div>

              <div>
                <strong>
                  Ganti Akun
                </strong>

                <span>
                  Keluar dan masuk dengan
                  akun lain
                </span>
              </div>

              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="profile-link-card profile-account-button"
              onClick={() =>
                handleLogout("/")
              }
            >
              <div className="profile-link-icon">
                <LogOut size={19} />
              </div>

              <div>
                <strong>
                  Log Out
                </strong>

                <span>
                  Keluar dari akun NATARA HUB
                </span>
              </div>

              <ArrowRight size={17} />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Profile;