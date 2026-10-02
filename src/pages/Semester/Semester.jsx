import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  BookOpen,
  ChevronRight,
  LockKeyhole,
  Search,
  X,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase/config";

import semesters from "../../data/semesters";
import courses from "../../data/courses";
import materials from "../../data/materials";

import useProgress from "../../hooks/useProgress";

import "./Semester.css";

function Semester() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [currentUser, setCurrentUser] =
    useState(null);

  const { completedMaterials } = useProgress();

  const searchQuery =
    searchParams.get("search")?.trim() || "";

  const normalizedQuery =
    searchQuery.toLowerCase();

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

  /* =========================================
     COURSE COUNT
  ========================================= */

  const getCourseCount = (semesterId) => {
    return courses.filter(
      (course) => course.semester === semesterId
    ).length;
  };

  /* =========================================
     SEMESTER MATERIALS
  ========================================= */

  const getSemesterMaterials = (semesterId) => {
    const semesterCourses = courses
      .filter(
        (course) => course.semester === semesterId
      )
      .map((course) => course.id);

    return materials.filter((material) =>
      semesterCourses.includes(material.courseId)
    );
  };

  /* =========================================
     SEMESTER PROGRESS
  ========================================= */

  const getSemesterProgress = (semesterId) => {
    if (!isLoggedIn) {
      return 0;
    }

    const semesterMaterials =
      getSemesterMaterials(semesterId);

    if (!semesterMaterials.length) {
      return 0;
    }

    const completedCount =
      semesterMaterials.filter((material) =>
        completedMaterials.includes(material.id)
      ).length;

    return Math.round(
      (completedCount / semesterMaterials.length) * 100
    );
  };

  /* =========================================
     MATERIAL LOCK CHECK
  ========================================= */

  const isMaterialLocked = (material) => {
    if (!isLoggedIn) {
      return true;
    }

    const courseMaterials = materials.filter(
      (item) =>
        item.courseId === material.courseId
    );

    const currentIndex =
      courseMaterials.findIndex(
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

  /* =========================================
     SEARCH RESULTS
  ========================================= */

  const getSearchResults = () => {
    if (!normalizedQuery) {
      return [];
    }

    const results = [];

    courses.forEach((course) => {
      const semester = semesters.find(
        (item) => item.id === course.semester
      );

      const courseMaterials = materials.filter(
        (material) =>
          material.courseId === course.id
      );

      /* -------------------------------------
         COURSE SEARCH
      ------------------------------------- */

      const courseMatch =
        course.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        course.description
          .toLowerCase()
          .includes(normalizedQuery);

      if (courseMatch) {
        results.push({
          type: "course",
          id: course.id,
          title: course.title,
          description: course.description,
          semester: semester?.title || "",
          locked: !isLoggedIn,
        });
      }

      /* -------------------------------------
         MATERIAL SEARCH
      ------------------------------------- */

      courseMaterials.forEach((material) => {
        const materialMatch =
          material.title
            .toLowerCase()
            .includes(normalizedQuery) ||
          material.description
            .toLowerCase()
            .includes(normalizedQuery);

        if (materialMatch) {
          results.push({
            type: "material",
            id: material.id,
            title: material.title,
            description: material.description,
            semester: semester?.title || "",
            course: course.title,
            locked:
              !isLoggedIn ||
              isMaterialLocked(material),
          });
        }
      });
    });

    return results;
  };

  const searchResults = getSearchResults();

  /* =========================================
     CLEAR SEARCH
  ========================================= */

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="semester-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="semester-header">
        <span className="semester-eyebrow">
          Learning Path
        </span>

        <h1>
          {searchQuery
            ? "Hasil Pencarian"
            : "Semua Semester"}
        </h1>

        <p>
          {searchQuery
            ? 'Menampilkan hasil untuk "' +
              searchQuery +
              '".'
            : "Jelajahi materi perkuliahan berdasarkan semester dan bangun pemahamanmu secara bertahap dari dasar hingga proyek akhir."}
        </p>
      </div>

      {/* =========================================
          SEARCH RESULTS
      ========================================= */}

      {searchQuery ? (
        <div className="semester-search-results">
          <div className="semester-search-header">
            <div>
              <span className="semester-eyebrow">
                Search
              </span>

              <h2>
                {searchResults.length} hasil ditemukan
              </h2>
            </div>

            <button
              type="button"
              className="semester-clear-search"
              onClick={clearSearch}
            >
              <X size={15} />
              Hapus pencarian
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="semester-search-list">
              {searchResults.map((result) => {
                const resultContent = (
                  <>
                    <div
                      className={
                        "semester-search-icon" +
                        (result.locked
                          ? " locked"
                          : "")
                      }
                    >
                      {result.locked ? (
                        <LockKeyhole size={18} />
                      ) : (
                        <BookOpen size={18} />
                      )}
                    </div>

                    <div className="semester-search-content">
                      <div className="semester-search-meta">
                        <span>
                          {result.type === "course"
                            ? result.locked
                              ? "Mata Kuliah · Terkunci"
                              : "Mata Kuliah"
                            : result.locked
                            ? "Materi · Terkunci"
                            : "Materi"}
                        </span>

                        <span>
                          {result.semester}
                        </span>
                      </div>

                      <h3>{result.title}</h3>

                      <p>
                        {result.description}
                      </p>

                      {result.course && (
                        <small>
                          {result.course}
                        </small>
                      )}

                      {result.locked && (
                        <small className="semester-search-locked-text">
                          {isLoggedIn
                            ? "Selesaikan materi sebelumnya terlebih dahulu."
                            : "Login terlebih dahulu untuk membuka materi."}
                        </small>
                      )}
                    </div>

                    {result.locked ? (
                      <LockKeyhole
                        size={18}
                        className="semester-search-lock"
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                        className="semester-search-arrow"
                      />
                    )}
                  </>
                );

                const resultKey =
                  result.type + "-" + result.id;

                /* ---------------------------------
                   LOCKED RESULT
                --------------------------------- */

                if (result.locked) {
                  return (
                    <Link
                      key={resultKey}
                      to="/login"
                      state={{
                        from:
                          result.type === "course"
                            ? "/course/" + result.id
                            : "/material/" + result.id,
                      }}
                      className="semester-search-card locked"
                    >
                      {resultContent}
                    </Link>
                  );
                }

                /* ---------------------------------
                   OPEN RESULT
                --------------------------------- */

                return (
                  <Link
                    key={resultKey}
                    to={
                      result.type === "course"
                        ? "/course/" + result.id
                        : "/material/" + result.id
                    }
                    className="semester-search-card"
                  >
                    {resultContent}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="semester-empty-search">
              <div className="semester-empty-icon">
                <Search size={22} />
              </div>

              <h2>Materi tidak ditemukan</h2>

              <p>
                Coba gunakan kata kunci lain seperti
                nama mata kuliah atau materi.
              </p>

              <button
                type="button"
                onClick={clearSearch}
              >
                Kembali ke semua semester
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =========================================
           SEMESTER LIST
        ========================================= */

        <div className="semester-grid">
          {semesters.map((semester) => {
            const courseCount =
              getCourseCount(semester.id);

            const progress =
              getSemesterProgress(semester.id);

            return (
              <Link
                to={"/semester/" + semester.id}
                className="semester-card"
                key={semester.id}
              >
                <div className="semester-card-top">
                  <div className="semester-number">
                    {String(semester.number).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="semester-arrow">
                    <ChevronRight size={17} />
                  </div>
                </div>

                <h2>{semester.title}</h2>

                <p className="semester-card-description">
                  {semester.description}
                </p>

                <div className="semester-card-info">
                  <div className="semester-info-item">
                    <BookOpen size={15} />

                    <span>
                      {courseCount} Mata Kuliah
                    </span>
                  </div>
                </div>

                <div className="semester-progress">
                  <div className="semester-progress-header">
                    <span>Progress</span>

                    <strong>
                      {progress}%
                    </strong>
                  </div>

                  <div className="semester-progress-bar">
                    <div
                      className="semester-progress-fill"
                      style={{
                        width: progress + "%",
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Semester;