import { Link } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  Trophy,
  XCircle,
} from "lucide-react";

import semesters from "../../data/semesters";
import courses from "../../data/courses";
import materials from "../../data/materials";
import quizzes from "../../data/quiz";

import useProgress from "../../hooks/useProgress";
import useQuiz from "../../hooks/useQuiz";

import "./Progress.css";

function Progress() {
  const { completedMaterials } = useProgress();
  const { scores } = useQuiz();

  /* =========================================
     OVERALL PROGRESS
  ========================================= */

  const totalMaterials = materials.length;

  const completedCount = materials.filter(
    (material) =>
      completedMaterials.includes(material.id)
  ).length;

  const overallProgress = totalMaterials
    ? Math.round(
        (completedCount / totalMaterials) * 100
      )
    : 0;

  /* =========================================
     SEMESTER PROGRESS
  ========================================= */

  const semesterProgress = semesters.map(
    (semester) => {
      const semesterCourses = courses.filter(
        (course) =>
          course.semester === semester.id
      );

      const semesterMaterials =
        materials.filter((material) =>
          semesterCourses.some(
            (course) =>
              course.id === material.courseId
          )
        );

      const completed =
        semesterMaterials.filter((material) =>
          completedMaterials.includes(material.id)
        ).length;

      const total = semesterMaterials.length;

      const progress = total
        ? Math.round((completed / total) * 100)
        : 0;

      return {
        ...semester,
        completed,
        total,
        progress,
      };
    }
  );

  /* =========================================
     COURSE PROGRESS
  ========================================= */

  const courseProgress = courses
    .map((course) => {
      const courseMaterials = materials.filter(
        (material) =>
          material.courseId === course.id
      );

      const completed = courseMaterials.filter(
        (material) =>
          completedMaterials.includes(material.id)
      ).length;

      const total = courseMaterials.length;

      const progress = total
        ? Math.round((completed / total) * 100)
        : 0;

      return {
        ...course,
        completed,
        total,
        progress,
        isStarted: completed > 0,
        isCompleted:
          total > 0 && completed === total,
      };
    })
    .filter((course) => course.total > 0);

  /* =========================================
     RECENT MATERIAL ACTIVITY
  ========================================= */

  const recentActivity = [...completedMaterials]
    .reverse()
    .map((materialId) =>
      materials.find(
        (material) => material.id === materialId
      )
    )
    .filter(Boolean)
    .slice(0, 5);

  /* =========================================
     QUIZ PERFORMANCE
  ========================================= */

  const availableQuizzes = quizzes.filter(
    (quiz) =>
      materials.some(
        (material) =>
          material.id === quiz.materialId
      )
  );

  const attemptedQuizzes =
    availableQuizzes.filter(
      (quiz) =>
        scores[quiz.id] !== undefined
    );

  const quizScores = attemptedQuizzes.map(
    (quiz) => scores[quiz.id]
  );

  const quizCount = attemptedQuizzes.length;

  const quizAverage = quizCount
    ? Math.round(
        quizScores.reduce(
          (total, score) => total + score,
          0
        ) / quizCount
      )
    : 0;

  const highestQuizScore = quizCount
    ? Math.max(...quizScores)
    : 0;

  const passedQuizCount =
    attemptedQuizzes.filter(
      (quiz) => scores[quiz.id] === 100
    ).length;

  /*
   * Storage saat ini belum menyimpan timestamp.
   * Jadi urutan quiz di sini mengikuti urutan
   * data quiz yang tersedia, bukan waktu pengerjaan
   * sebenarnya.
   */

  const quizResults = attemptedQuizzes
    .slice()
    .reverse()
    .slice(0, 5)
    .map((quiz) => {
      const material = materials.find(
        (item) => item.id === quiz.materialId
      );

      const course = material
        ? courses.find(
            (item) =>
              item.id === material.courseId
          )
        : null;

      const score = scores[quiz.id];

      return {
        ...quiz,
        material,
        course,
        score,
        passed: score === 100,
      };
    });

  return (
    <div className="progress-page">
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="progress-page-header">
        <div>
          <span className="progress-eyebrow">
            Learning Analytics
          </span>

          <h1>Progress Belajar</h1>

          <p>
            Pantau perkembangan materi dan hasil quiz
            selama perjalanan belajarmu.
          </p>
        </div>
      </div>

      {/* =========================================
          OVERALL PROGRESS
      ========================================= */}

      <section className="progress-overview">
        <div className="progress-overview-main">
          <div>
            <span>Overall Progress</span>

            <h2>{overallProgress}%</h2>

            <p>
              {completedCount} dari{" "}
              {totalMaterials} materi telah selesai
            </p>
          </div>

          <div className="progress-overview-circle">
            <svg
              viewBox="0 0 120 120"
              className="progress-circle-svg"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                className="progress-circle-bg"
              />

              <circle
                cx="60"
                cy="60"
                r="50"
                className="progress-circle-fill"
                style={{
                  strokeDashoffset:
                    314 -
                    (314 * overallProgress) /
                      100,
                }}
              />
            </svg>

            <strong>{overallProgress}%</strong>
          </div>
        </div>

        <div className="progress-overview-stats">
          <div className="progress-stat">
            <div className="progress-stat-icon">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Materi Selesai</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="progress-stat">
            <div className="progress-stat-icon">
              <BookOpen size={19} />
            </div>

            <div>
              <span>Total Materi</span>
              <strong>{totalMaterials}</strong>
            </div>
          </div>

          <div className="progress-stat">
            <div className="progress-stat-icon">
              <BarChart3 size={19} />
            </div>

            <div>
              <span>Quiz Dikerjakan</span>
              <strong>{quizCount}</strong>
            </div>
          </div>

          <div className="progress-stat">
            <div className="progress-stat-icon">
              <Trophy size={19} />
            </div>

            <div>
              <span>Rata-rata Quiz</span>
              <strong>{quizAverage}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          QUIZ PERFORMANCE
      ========================================= */}

      <section className="progress-section quiz-performance-section">
        <div className="progress-section-header">
          <div>
            <span>Quiz Performance</span>

            <h2>Performa Quiz</h2>

            <p>
              Lihat perkembangan hasil pemahamanmu
              melalui Quick Check di setiap materi.
            </p>
          </div>

          <div className="quiz-performance-summary">
            <div>
              <span>Rata-rata</span>

              <strong>
                {quizAverage}/100
              </strong>
            </div>

            <div>
              <span>Tertinggi</span>

              <strong>
                {highestQuizScore}/100
              </strong>
            </div>

            <div>
              <span>Lulus</span>

              <strong>
                {passedQuizCount}/{quizCount}
              </strong>
            </div>
          </div>
        </div>

        {quizResults.length > 0 ? (
          <div className="quiz-results-list">
            {quizResults.map((quiz) => (
              <Link
                to={`/material/${quiz.materialId}`}
                className="quiz-result-card"
                key={quiz.id}
              >
                <div className="quiz-result-card-icon">
                  {quiz.passed ? (
                    <Trophy size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>

                <div className="quiz-result-card-content">
                  <span>
                    {quiz.course?.title ||
                      "Mata Kuliah"}
                  </span>

                  <h3>
                    {quiz.material?.title ||
                      "Materi"}
                  </h3>

                  <p>
                    Quick Check ·{" "}
                    {quiz.passed
                      ? "Lulus"
                      : "Belum Lulus"}
                  </p>
                </div>

                <div className="quiz-result-score">
                  <strong>{quiz.score}</strong>
                  <span>/100</span>
                </div>

                <ArrowRight
                  size={17}
                  className="quiz-result-arrow"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="quiz-empty-state">
            <div className="quiz-empty-icon">
              <Trophy size={23} />
            </div>

            <div>
              <h3>Belum ada hasil quiz</h3>

              <p>
                Kerjakan Quick Check di materi yang
                tersedia untuk melihat performamu di
                halaman ini.
              </p>
            </div>

            <Link to="/semester">
              Mulai Belajar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* =========================================
          SEMESTER PROGRESS
      ========================================= */}

      <section className="progress-section">
        <div className="progress-section-header">
          <div>
            <span>Semester Progress</span>

            <h2>Progress Semester</h2>

            <p>
              Perkembangan belajar berdasarkan
              semester.
            </p>
          </div>
        </div>

        <div className="semester-progress-list">
          {semesterProgress.map((semester) => (
            <div
              className="semester-progress-item"
              key={semester.id}
            >
              <div className="semester-progress-top">
                <div>
                  <span>
                    Semester {semester.number}
                  </span>

                  <strong>
                    {semester.title}
                  </strong>
                </div>

                <strong>
                  {semester.progress}%
                </strong>
              </div>

              <div className="semester-progress-bar">
                <div
                  style={{
                    width: `${semester.progress}%`,
                  }}
                />
              </div>

              <div className="semester-progress-bottom">
                <span>
                  {semester.completed}/
                  {semester.total} materi selesai
                </span>

                <Link
                  to={`/semester/${semester.id}`}
                >
                  Lihat
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          COURSE PROGRESS
      ========================================= */}

      <section className="progress-section">
        <div className="progress-section-header">
          <div>
            <span>Course Progress</span>

            <h2>Progress Mata Kuliah</h2>

            <p>
              Detail perkembangan dari setiap mata
              kuliah yang sudah memiliki materi.
            </p>
          </div>
        </div>

        <div className="course-progress-grid">
          {courseProgress.map((course) => (
            <Link
              to={`/course/${course.id}`}
              className="course-progress-card"
              key={course.id}
            >
              <div className="course-progress-card-top">
                <div className="course-progress-icon">
                  {course.isCompleted ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <BookOpen size={18} />
                  )}
                </div>

                <strong>
                  {course.progress}%
                </strong>
              </div>

              <h3>{course.title}</h3>

              <p>
                Semester {course.semester}
              </p>

              <div className="course-progress-bar">
                <div
                  style={{
                    width: `${course.progress}%`,
                  }}
                />
              </div>

              <div className="course-progress-meta">
                <span>
                  {course.completed}/
                  {course.total} selesai
                </span>

                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================
          RECENT ACTIVITY
      ========================================= */}

      <section className="progress-section">
        <div className="progress-section-header">
          <div>
            <span>Recent Activity</span>

            <h2>Aktivitas Terbaru</h2>

            <p>
              Materi yang terakhir kamu tandai sebagai
              selesai.
            </p>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="recent-activity-list">
            {recentActivity.map((material) => {
              const course = courses.find(
                (item) =>
                  item.id === material.courseId
              );

              return (
                <Link
                  to={`/material/${material.id}`}
                  className="recent-activity-item"
                  key={material.id}
                >
                  <div className="recent-activity-icon">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <span>
                      {course?.title ||
                        "Mata Kuliah"}
                    </span>

                    <strong>
                      {material.title}
                    </strong>
                  </div>

                  <ArrowRight size={17} />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="progress-empty-state">
            <Clock3 size={22} />

            <div>
              <h3>Belum ada aktivitas</h3>

              <p>
                Selesaikan materi pertama untuk mulai
                mencatat progress belajarmu.
              </p>
            </div>

            <Link to="/semester">
              Mulai Belajar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Progress;