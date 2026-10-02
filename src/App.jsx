import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

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

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/semester"
            element={<Semester />}
          />

          <Route path="/semester/:id" element={<SemesterDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/course/:id"
            element={<CourseDetail />}
          />

          <Route
            path="/material/:id"
            element={<MaterialDetail />}
          />

          <Route
            path="/bookmark"
            element={<Bookmark />}
          />

          <Route
            path="/progress"
            element={<Progress />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;