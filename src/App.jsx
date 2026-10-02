import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";

import Semester from "./pages/Semester/Semester";
import SemesterDetail from "./pages/Semester/SemesterDetail";

import CourseDetail from "./pages/Course/CourseDetail";

import MaterialDetail from "./pages/Material/MaterialDetail";

import Bookmark from "./pages/Bookmark/Bookmark";

import Progress from "./pages/Progress/Progress";

import Profile from "./pages/Profile/Profile";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================= */}
        {/* AUTH ROUTES                       */}
        {/* ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================= */}
        {/* PUBLIC ROUTES                     */}
        {/* ================================= */}

        <Route element={<MainLayout />}>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* SEMESTER */}
          <Route
            path="/semester"
            element={<Semester />}
          />

          <Route
            path="/semester/:id"
            element={<SemesterDetail />}
          />

          {/* COURSE */}
          <Route
            path="/course/:id"
            element={<CourseDetail />}
          />

          {/* MATERIAL */}
          {/* Public.
              Isi materi akan blur
              jika belum login. */}
          <Route
            path="/material/:id"
            element={<MaterialDetail />}
          />


          {/* ================================= */}
          {/* LOGIN REQUIRED                    */}
          {/* ================================= */}

          {/* BOOKMARK */}
          <Route
            path="/bookmark"
            element={
              <ProtectedRoute>
                <Bookmark />
              </ProtectedRoute>
            }
          />

          {/* PROGRESS */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;