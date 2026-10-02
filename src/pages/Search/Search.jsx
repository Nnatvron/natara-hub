import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  BarChart3,
  User,
  Search,
  LockKeyhole,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import NotificationBell from "../components/Notification/NotificationBell";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";
import { logoutUser } from "../firebase/auth";

import semesters from "../data/semesters";
import courses from "../data/courses";
import materials from "../data/materials";

import "../App.css";
import "./MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

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

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await logoutUser();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH RESULT
  |--------------------------------------------------------------------------
  */

  const getSearchResults = () => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (!query) {
      return [];
    }

    const results = [];

    /*
    |--------------------------------------------------------------------------
    | SEARCH COURSE
    |--------------------------------------------------------------------------
    */

    courses.forEach((course) => {
      const semester =
        semesters.find(
          (item) =>
            item.id === course.semester
        );

      const title =
        course.title?.toLowerCase() || "";

      const description =
        course.description?.toLowerCase() || "";

      const isMatch =
        title.includes(query) ||
        description.includes(query);

      if (isMatch) {
        results.push({
          type: "course",
          id: course.id,
          title: course.title,
          description: course.description,
          semester:
            semester?.title || "",
          locked:
            !currentUser,
        });
      }
    });

    /*
    |--------------------------------------------------------------------------
    | SEARCH MATERIAL
    |--------------------------------------------------------------------------
    */

    materials.forEach((material) => {
      const course =
        courses.find(
          (item) =>
            item.id === material.courseId
        );

      const semester =
        semesters.find(
          (item) =>
            item.id === course?.semester
        );

      const title =
        material.title?.toLowerCase() || "";

      const description =
        material.description?.toLowerCase() || "";

      const isMatch =
        title.includes(query) ||
        description.includes(query);

      if (isMatch) {
        results.push({
          type: "material",
          id: material.id,
          title: material.title,
          description:
            material.description,
          semester:
            semester?.title || "",
          course:
            course?.title || "",
          locked:
            !currentUser,
        });
      }
    });

    /*
    |--------------------------------------------------------------------------
    | LIMIT RESULTS
    |--------------------------------------------------------------------------
    */

    return results.slice(0, 8);
  };

  const searchResults =
    getSearchResults();

  /*
  |--------------------------------------------------------------------------
  | SEARCH SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    setShowSearchResults(false);

    navigate(
      "/semester?search=" +
        encodeURIComponent(query)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH CHANGE
  |--------------------------------------------------------------------------
  */

  const handleSearchChange = (
    event
  ) => {
    const value =
      event.target.value;

    setSearchQuery(value);

    setShowSearchResults(
      value.trim().length > 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH RESULT CLICK
  |--------------------------------------------------------------------------
  */

  const handleSearchResultClick = (
    result
  ) => {
    setShowSearchResults(false);

    if (result.locked) {
      navigate("/login", {
        state: {
          from:
            result.type === "course"
              ? "/course/" + result.id
              : "/material/" + result.id,
        },
      });

      return;
    }

    navigate(
      result.type === "course"
        ? "/course/" + result.id
        : "/material/" + result.id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | USER DISPLAY
  |--------------------------------------------------------------------------
  */

  const userName =
    currentUser?.displayName ||
    "Guest";

  const userInitial =
    currentUser?.displayName
      ?.charAt(0)
      .toUpperCase() || "G";

  return (
    <div className="app">

      {/* =========================================
          SIDEBAR DESKTOP
      ========================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            N
          </div>

          <div>
            <h1>
              NATARA
            </h1>

            <span>
              HUB
            </span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <p className="nav-label">
            MENU
          </p>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-item " +
              (isActive
                ? "active"
                : "")
            }
          >
            <LayoutDashboard
              size={19}
            />

            <span>
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/semester"
            className={({ isActive }) =>
              "nav-item " +
              (isActive
                ? "active"
                : "")
            }
          >
            <BookOpen size={19} />

            <span>
              Materi
            </span>
          </NavLink>

          <NavLink
            to="/bookmark"
            className={({ isActive }) =>
              "nav-item " +
              (isActive
                ? "active"
                : "")
            }
          >
            <Bookmark size={19} />

            <span>
              Bookmark
            </span>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              "nav-item " +
              (isActive
                ? "active"
                : "")
            }
          >
            <BarChart3 size={19} />

            <span>
              Progress
            </span>
          </NavLink>

          <p className="nav-label second">
            LAINNYA
          </p>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              "nav-item " +
              (isActive
                ? "active"
                : "")
            }
          >
            <User size={19} />

            <span>
              Profile
            </span>
          </NavLink>

        </nav>

        {/* =========================================
            SIDEBAR PROFILE
        ========================================= */}

        <div className="sidebar-bottom">

          <NavLink
            to="/profile"
            className="mini-profile"
          >

            <div className="avatar">
              {userInitial}
            </div>

            <div>

              <strong>
                {authLoading
                  ? "Memuat..."
                  : userName}
              </strong>

              <span>
                {currentUser
                  ? "Mahasiswa"
                  : "Belum login"}
              </span>

            </div>

          </NavLink>

        </div>

      </aside>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="mobile-brand">

            <div className="brand-logo">
              N
            </div>

            <strong>
              NATARA HUB
            </strong>

          </div>

          {/* =========================================
              SEARCH
          ========================================= */}

          <div className="search-wrapper">

            <form
              className="search-box"
              onSubmit={
                handleSearchSubmit
              }
            >

              <Search size={18} />

              <input
                type="text"
                value={searchQuery}
                onChange={
                  handleSearchChange
                }
                onFocus={() => {
                  if (
                    searchQuery.trim()
                  ) {
                    setShowSearchResults(
                      true
                    );
                  }
                }}
                placeholder="Cari materi, mata kuliah..."
                aria-label="Cari materi atau mata kuliah"
              />

            </form>

            {/* =========================================
                LIVE SEARCH RESULTS
            ========================================= */}

            {showSearchResults &&
              searchQuery.trim() && (
                <div className="search-results-dropdown">

                  {searchResults.length > 0 ? (

                    <div className="search-results-list">

                      {searchResults.map(
                        (result) => {

                          const resultKey =
                            result.type +
                            "-" +
                            result.id;

                          return (
                            <button
                              type="button"
                              key={
                                resultKey
                              }
                              className={
                                "search-result-item" +
                                (result.locked
                                  ? " locked"
                                  : "")
                              }
                              onClick={() =>
                                handleSearchResultClick(
                                  result
                                )
                              }
                            >

                              <div
                                className={
                                  "search-result-icon" +
                                  (result.locked
                                    ? " locked"
                                    : "")
                                }
                              >

                                {result.locked ? (
                                  <LockKeyhole
                                    size={17}
                                  />
                                ) : (
                                  <BookOpen
                                    size={17}
                                  />
                                )}

                              </div>

                              <div className="search-result-content">

                                <div className="search-result-meta">

                                  <span>
                                    {result.type ===
                                    "course"
                                      ? "Mata Kuliah"
                                      : "Materi"}
                                  </span>

                                  <span>
                                    {
                                      result.semester
                                    }
                                  </span>

                                </div>

                                <strong>
                                  {
                                    result.title
                                  }
                                </strong>

                                {result.course && (
                                  <small>
                                    {
                                      result.course
                                    }
                                  </small>
                                )}

                              </div>

                              {result.locked && (
                                <LockKeyhole
                                  size={15}
                                  className="search-result-lock"
                                />
                              )}

                            </button>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="search-no-results">

                      <Search size={19} />

                      <div>
                        <strong>
                          Tidak ada hasil
                        </strong>

                        <span>
                          Coba kata kunci lain.
                        </span>
                      </div>

                    </div>

                  )}

                  {searchResults.length > 0 && (
                    <button
                      type="button"
                      className="search-view-all"
                      onClick={() => {
                        setShowSearchResults(
                          false
                        );

                        navigate(
                          "/semester?search=" +
                            encodeURIComponent(
                              searchQuery.trim()
                            )
                        );
                      }}
                    >
                      Lihat semua hasil pencarian
                    </button>
                  )}

                </div>
              )}

          </div>

          <div className="topbar-actions">

            <NotificationBell />

            {/* PROFILE MENU */}

            <div className="profile-menu">

              <button
                type="button"
                className="top-avatar"
                aria-label="Profile menu"
              >
                {currentUser?.displayName
                  ? currentUser.displayName
                      .charAt(0)
                      .toUpperCase()
                  : "G"}
              </button>

              {!authLoading && (
                <div className="profile-dropdown">

                  {currentUser ? (
                    <>

                      <div className="profile-dropdown-user">

                        <div className="profile-dropdown-avatar">

                          {currentUser.displayName
                            ? currentUser.displayName
                                .charAt(0)
                                .toUpperCase()
                            : "G"}

                        </div>

                        <div className="profile-dropdown-info">

                          <strong>
                            {currentUser.displayName ||
                              "User"}
                          </strong>

                          <span>
                            {currentUser.email}
                          </span>

                        </div>

                      </div>

                      <div className="profile-dropdown-divider" />

                      <NavLink
                        to="/profile"
                        className="profile-dropdown-item"
                      >
                        <span>
                          👤
                        </span>

                        <span>
                          Profil
                        </span>
                      </NavLink>

                      <button
                        type="button"
                        className="profile-dropdown-item logout-item"
                        onClick={
                          handleLogout
                        }
                      >
                        <span>
                          🚪
                        </span>

                        <span>
                          Logout
                        </span>
                      </button>

                    </>

                  ) : (

                    <>

                      <div className="profile-dropdown-title">

                        <strong>
                          Selamat datang
                        </strong>

                        <span>
                          Login untuk mulai belajar
                        </span>

                      </div>

                      <div className="profile-dropdown-divider" />

                      <NavLink
                        to="/profile"
                        className="profile-dropdown-item"
                      >
                        <span>
                          👤
                        </span>

                        <span>
                          Profile
                        </span>
                      </NavLink>

                      <NavLink
                        to="/login"
                        className="profile-dropdown-item"
                      >
                        <span>
                          🔑
                        </span>

                        <span>
                          Login
                        </span>
                      </NavLink>

                      <NavLink
                        to="/register"
                        className="profile-dropdown-item"
                      >
                        <span>
                          ✨
                        </span>

                        <span>
                          Sign Up
                        </span>
                      </NavLink>

                    </>

                  )}

                </div>
              )}

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <div className="page-content">
          <Outlet />
        </div>

      </main>

      {/* =========================================
          MOBILE NAVIGATION
      ========================================= */}

      <nav className="mobile-nav">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "mobile-nav-item " +
            (isActive
              ? "active"
              : "")
          }
        >
          <LayoutDashboard
            size={20}
          />

          <span>
            Home
          </span>
        </NavLink>

        <NavLink
          to="/semester"
          className={({ isActive }) =>
            "mobile-nav-item " +
            (isActive
              ? "active"
              : "")
          }
        >
          <BookOpen size={20} />

          <span>
            Materi
          </span>
        </NavLink>

        <NavLink
          to="/bookmark"
          className={({ isActive }) =>
            "mobile-nav-item " +
            (isActive
              ? "active"
              : "")
          }
        >
          <Bookmark size={20} />

          <span>
            Saved
          </span>
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            "mobile-nav-item " +
            (isActive
              ? "active"
              : "")
          }
        >
          <BarChart3 size={20} />

          <span>
            Progress
          </span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            "mobile-nav-item " +
            (isActive
              ? "active"
              : "")
          }
        >
          <User size={20} />

          <span>
            Profile
          </span>
        </NavLink>

      </nav>

    </div>
  );
}

export default MainLayout;