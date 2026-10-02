import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase/config";

import semesters from "../../data/semesters";
import courses from "../../data/courses";
import materials from "../../data/materials";

import useProgress from "../../hooks/useProgress";

import "./SemesterDetail.css";

function SemesterDetail() {
  const { id } = useParams();

  const [currentUser, setCurrentUser] = useState(null);

  const semester = semesters.find(
    (item) => item.id === Number(id)
  );

  const { completedMaterials } = useProgress();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const isLoggedIn = currentUser !== null;

  if (!semester) {
    return (
      <div className="semester-detail-not-found">
        <h2>Semester tidak ditemukan</h2>

        <p>
          Semester yang kamu cari tidak tersedia.
        </p>

        <Link to="/semester">
          <ArrowLeft size={17} />
          Kembali ke Semester
        </Link>
      </div>
    );
  }

  const semesterCourses = courses.filter(
    (course) => course.semester === semester.id
  );

  const semesterMaterials = materials.filter(
    (material) =>
      semesterCourses.some(
        (course) => course.id === material.courseId
      )
  );

  const completedSemesterMaterials = isLoggedIn
    ? semesterMaterials.filter((material) =>
        completedMaterials.includes(material.id)
      )
    : [];

  const completedCount =
    completedSemesterMaterials.length;

  const totalMaterials =
    isLoggedIn ? semesterMaterials.length : 0;

  const progress =
    totalMaterials > 0
      ? Math.round(
          (completedCount / totalMaterials) * 100
        )
      : 0;

  const totalDuration = semesterCourses.reduce(
    (total, course) => {
      const materialsInCourse = materials.filter(
        (material) =>
          material.courseId === course.id
      );

      return total + materialsInCourse.length;
    },
    0
  );

  return (
    <div className="semester-detail-page">
      {/* BACK */}

      <Link
        to="/semester"
        className="semester-detail-back"
      >
        <ArrowLeft size={17} />
        Semua Semester
      </Link>

      {/* HERO */}

      <section className="semester-detail-hero">
        <div className="semester-detail-hero-content">
          <div className="semester-detail-number">
            {semester.number}
          </div>

          <div>
            <span className="semester-detail-eyebrow">
              Learning Path
            </span>

            <h1>{semester.title}</h1>

            <p>{semester.description}</p>
          </div>
        </div>

        <div className="semester-detail-progress-box">
          <div className="semester-detail-progress-top">
            <span>Progress</span>

            <strong>{progress}%</strong>
          </div>

          <div className="semester-detail-progress-bar">
            <div
              className="semester-detail-progress-fill"
              style={{
                width: progress + "%",
              }}
            />
          </div>

          <p>
            {totalMaterials > 0
              ? completedCount +
                " dari " +
                totalMaterials +
                " materi selesai"
              : "Belum ada materi tersedia"}
          </p>
        </div>
      </section>

      {/* SUMMARY */}

      <section className="semester-detail-summary">
        <div className="semester-summary-item">
          <div className="semester-summary-icon">
            <BookOpen size={19} />
          </div>

          <div>
            <span>Mata Kuliah</span>

            <strong>
              {semesterCourses.length}
            </strong>
          </div>
        </div>

        <div className="semester-summary-item">
          <div className="semester-summary-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Materi Selesai</span>

            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="semester-summary-item">
          <div className="semester-summary-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Materi Tersedia</span>

            <strong>{totalDuration}</strong>
          </div>
        </div>
      </section>

      {/* COURSES */}

      <section className="semester-courses-section">
        <div className="semester-courses-header">
          <div>
            <span>Course List</span>

            <h2>
              Mata Kuliah Semester {semester.number}
            </h2>

            <p>
              {isLoggedIn
                ? "Pilih mata kuliah untuk mulai mempelajari materinya."
                : "Login terlebih dahulu untuk membuka materi pembelajaran."}
            </p>
          </div>

          <span className="semester-course-count">
            {semesterCourses.length} Mata Kuliah
          </span>
        </div>

        {semesterCourses.length > 0 ? (
          <div className="semester-course-list">
            {semesterCourses.map((course) => {
              const courseMaterials =
                materials.filter(
                  (material) =>
                    material.courseId === course.id
                );

              const completedCourseMaterials =
                isLoggedIn
                  ? courseMaterials.filter(
                      (material) =>
                        completedMaterials.includes(
                          material.id
                        )
                    )
                  : [];

              const courseCompleted =
                completedCourseMaterials.length;

              const courseTotal =
                isLoggedIn
                  ? courseMaterials.length
                  : courseMaterials.length;

              const courseProgress =
                courseTotal > 0
                  ? Math.round(
                      (courseCompleted /
                        courseTotal) *
                        100
                    )
                  : 0;

              const courseStarted =
                isLoggedIn &&
                courseCompleted > 0;

              const courseFinished =
                isLoggedIn &&
                courseTotal > 0 &&
                courseCompleted ===
                  courseTotal;

              const courseCardContent = (
                <>
                  <div className="semester-course-card-top">
                    <div className="semester-course-icon">
                      {!isLoggedIn ? (
                        <LockKeyhole size={19} />
                      ) : courseFinished ? (
                        <CheckCircle2 size={20} />
                      ) : courseStarted ? (
                        <BookOpen size={20} />
                      ) : (
                        <LockKeyhole size={19} />
                      )}
                    </div>

                    <span>
                      {!isLoggedIn
                        ? "Login untuk membuka"
                        : courseTotal > 0
                        ? courseProgress + "%"
                        : "Belum tersedia"}
                    </span>
                  </div>

                  <h3>{course.title}</h3>

                  <p>{course.description}</p>

                  <div className="semester-course-meta">
                    <span>
                      <BookOpen size={14} />

                      {courseTotal > 0
                        ? courseTotal + " materi"
                        : "Belum ada materi"}
                    </span>

                    <span>
                      <Clock3 size={14} />

                      {course.duration}
                    </span>
                  </div>

                  {courseTotal > 0 && (
                    <div className="semester-course-progress">
                      <div className="semester-course-progress-bar">
                        <div
                          className="semester-course-progress-fill"
                          style={{
                            width:
                              courseProgress +
                              "%",
                          }}
                        />
                      </div>

                      <span>
                        {courseCompleted}/
                        {courseTotal} selesai
                      </span>
                    </div>
                  )}

                  <div className="semester-course-arrow">
                    {!isLoggedIn
                      ? "Login untuk Belajar"
                      : courseFinished
                      ? "Course Selesai"
                      : courseStarted
                      ? "Lanjut Belajar"
                      : "Mulai Belajar"}

                    {!isLoggedIn ? (
                      <LockKeyhole size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </div>
                </>
              );

              if (!isLoggedIn) {
                return (
                  <Link
                    key={course.id}
                    to="/login"
                    state={{
                      from:
                        "/semester/" +
                        semester.id,
                    }}
                    className="semester-course-card"
                  >
                    {courseCardContent}
                  </Link>
                );
              }

              return (
                <Link
                  key={course.id}
                  to={"/course/" + course.id}
                  className="semester-course-card"
                >
                  {courseCardContent}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="semester-course-empty">
            <BookOpen size={25} />

            <h3>Belum ada mata kuliah</h3>

            <p>
              Mata kuliah untuk semester ini belum
              tersedia.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SemesterDetail;