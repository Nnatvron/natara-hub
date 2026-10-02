import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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

import courses from "../../data/courses";
import materials from "../../data/materials";
import modules from "../../data/modules";

import useProgress from "../../hooks/useProgress";

import "./CourseDetail.css";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const course = courses.find(
    (item) => item.id === id
  );

  const { completedMaterials } = useProgress();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/course/" + id,
        },
      });
    }
  }, [
    currentUser,
    authLoading,
    navigate,
    id,
  ]);

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Mata kuliah tidak ditemukan</h2>

        <p>
          Mata kuliah yang kamu cari tidak tersedia.
        </p>

        <Link to="/semester">
          <ArrowLeft size={17} />
          Kembali ke Semester
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="course-not-found">
        <h2>Memuat mata kuliah...</h2>

        <p>
          Sedang memeriksa status login kamu.
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const courseMaterials = materials.filter(
    (material) =>
      material.courseId === course.id
  );

  const completedCourseMaterials =
    courseMaterials.filter((material) =>
      completedMaterials.includes(material.id)
    );

  const completedCount =
    completedCourseMaterials.length;

  const totalMaterials =
    courseMaterials.length;

  const progress = totalMaterials
    ? Math.round(
        (completedCount / totalMaterials) * 100
      )
    : 0;

  const courseModules = modules.filter(
    (module) =>
      module.courseId === course.id
  );

  const semester = course.semester;

  /*
    =========================================
    MATERIAL LOCK CHECK
    Materi pertama selalu terbuka.

    Materi berikutnya hanya terbuka jika
    materi sebelumnya sudah selesai.
    =========================================
  */

  const isMaterialLocked = (material) => {
    const globalIndex =
      courseMaterials.findIndex(
        (item) => item.id === material.id
      );

    if (globalIndex <= 0) {
      return false;
    }

    const previousMaterial =
      courseMaterials[globalIndex - 1];

    return !completedMaterials.includes(
      previousMaterial.id
    );
  };

  return (
    <div className="course-detail-page">

      {/* BACK */}

      <Link
        to={"/semester/" + semester}
        className="course-back-link"
      >
        <ArrowLeft size={17} />
        Kembali ke Semester {semester}
      </Link>

      {/* HERO */}

      <section className="course-detail-hero">

        <div className="course-detail-hero-content">

          <span className="course-detail-eyebrow">
            Semester {semester}
          </span>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="course-detail-meta">

            <span>
              <BookOpen size={15} />
              {totalMaterials} materi
            </span>

            <span>
              <Clock3 size={15} />
              {course.duration}
            </span>

            <span>
              <CheckCircle2 size={15} />
              {completedCount} selesai
            </span>

          </div>

        </div>

        <div className="course-detail-progress">

          <div className="course-progress-circle">
            <strong>
              {progress}%
            </strong>
          </div>

          <div>
            <span>
              Progress Belajar
            </span>

            <p>
              {completedCount} dari{" "}
              {totalMaterials} materi selesai
            </p>
          </div>

        </div>

      </section>

      {/* MAIN PROGRESS */}

      <section className="course-main-progress">

        <div className="course-main-progress-header">

          <div>
            <strong>
              Progress Mata Kuliah
            </strong>

            <span>
              {completedCount}/{totalMaterials} materi
            </span>
          </div>

          <strong>
            {progress}%
          </strong>

        </div>

        <div className="course-main-progress-bar">

          <div
            className="course-main-progress-fill"
            style={{
              width: progress + "%",
            }}
          />

        </div>

      </section>

      {/* MODULES */}

      <section className="course-modules-section">

        <div className="course-materials-header">

          <div>

            <span>
              Course Curriculum
            </span>

            <h2>
              Materi Pembelajaran
            </h2>

            <p>
              Pelajari materi secara bertahap dari dasar
              sampai mini project.
            </p>

          </div>

          <span className="course-material-count">
            {courseModules.length} Module
          </span>

        </div>

        {courseModules.length > 0 ? (

          <div className="course-module-list">

            {courseModules.map((module) => {

              const moduleMaterials =
                courseMaterials.filter(
                  (material) =>
                    material.moduleId === module.id
                );

              const moduleCompleted =
                moduleMaterials.filter((material) =>
                  completedMaterials.includes(
                    material.id
                  )
                ).length;

              const moduleTotal =
                moduleMaterials.length;

              const moduleProgress =
                moduleTotal
                  ? Math.round(
                      (moduleCompleted /
                        moduleTotal) *
                        100
                    )
                  : 0;

              return (

                <div
                  className="course-module"
                  key={module.id}
                >

                  {/* MODULE HEADER */}

                  <div className="course-module-header">

                    <div className="course-module-heading">

                      <div className="course-module-number">
                        {String(module.number).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div>

                        <span>
                          Module {module.number}
                        </span>

                        <h3>
                          {module.title}
                        </h3>

                        <p>
                          {module.description}
                        </p>

                      </div>

                    </div>

                    <div className="course-module-progress">

                      <strong>
                        {moduleProgress}%
                      </strong>

                      <span>
                        {moduleCompleted}/
                        {moduleTotal}
                      </span>

                    </div>

                  </div>

                  {/* MODULE PROGRESS */}

                  <div className="course-module-progress-bar">

                    <div
                      className="course-module-progress-fill"
                      style={{
                        width:
                          moduleProgress + "%",
                      }}
                    />

                  </div>

                  {/* MATERIALS */}

                  {moduleMaterials.length > 0 ? (

                    <div className="course-material-list">

                      {moduleMaterials.map(
                        (material) => {

                          const globalIndex =
                            courseMaterials.findIndex(
                              (item) =>
                                item.id ===
                                material.id
                            );

                          const isCompleted =
                            completedMaterials.includes(
                              material.id
                            );

                          const isLocked =
                            isMaterialLocked(
                              material
                            );

                          const materialNumber =
                            String(
                              globalIndex + 1
                            ).padStart(
                              2,
                              "0"
                            );

                          /*
                            --------------------------------
                            LOCKED MATERIAL
                            --------------------------------
                          */

                          if (isLocked) {
                            return (

                              <div
                                className="course-material-item locked"
                                key={material.id}
                                aria-disabled="true"
                              >

                                <div className="material-number">

                                  <LockKeyhole
                                    size={17}
                                  />

                                </div>

                                <div className="course-material-content">

                                  <div className="course-material-type">
                                    {material.type ||
                                      "Materi"}
                                  </div>

                                  <h3>
                                    {material.title}
                                  </h3>

                                  <p>
                                    {
                                      material.description
                                    }
                                  </p>

                                  <span>

                                    <Clock3
                                      size={13}
                                    />

                                    {
                                      material.duration
                                    }

                                  </span>

                                </div>

                                <div className="course-material-arrow locked-arrow">

                                  <LockKeyhole
                                    size={17}
                                  />

                                </div>

                              </div>
                            );
                          }

                          /*
                            --------------------------------
                            OPEN MATERIAL
                            --------------------------------
                          */

                          return (

                            <Link
                              to={
                                "/material/" +
                                material.id
                              }
                              className={
                                "course-material-item " +
                                (
                                  isCompleted
                                    ? "completed"
                                    : ""
                                )
                              }
                              key={material.id}
                            >

                              <div className="material-number">

                                {isCompleted ? (

                                  <CheckCircle2
                                    size={18}
                                  />

                                ) : (

                                  materialNumber

                                )}

                              </div>

                              <div className="course-material-content">

                                <div className="course-material-type">
                                  {material.type ||
                                    "Materi"}
                                </div>

                                <h3>
                                  {material.title}
                                </h3>

                                <p>
                                  {
                                    material.description
                                  }
                                </p>

                                <span>

                                  <Clock3
                                    size={13}
                                  />

                                  {
                                    material.duration
                                  }

                                </span>

                              </div>

                              <div className="course-material-arrow">

                                <ArrowRight
                                  size={18}
                                />

                              </div>

                            </Link>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="course-module-empty">

                      <BookOpen
                        size={20}
                      />

                      <span>
                        Materi untuk module ini
                        belum tersedia.
                      </span>

                    </div>

                  )}

                </div>
              );
            })}

          </div>

        ) : (

          <div className="course-material-empty">

            <BookOpen size={24} />

            <h3>
              Belum ada module
            </h3>

            <p>
              Struktur pembelajaran untuk mata kuliah
              ini belum tersedia.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default CourseDetail;