import { useLocation, useNavigate } from "react-router-dom";

import { LockKeyhole, LogIn } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./ProtectedRoute.css";

function ProtectedRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // Firebase masih mengecek session
  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading-spinner" />
        <p>Memuat...</p>
      </div>
    );
  }

  // Sudah login
  if (user) {
    return children;
  }

  // Belum login
  return (
    <div className="protected-page">

      {/* Konten halaman tetap ditampilkan */}
      <div className="protected-content">
        {children}
      </div>

      {/* Blur + overlay */}
      <div className="protected-overlay">

        <div className="protected-card">

          <div className="protected-icon">
            <LockKeyhole size={24} />
          </div>

          <span className="protected-badge">
            Login diperlukan
          </span>

          <h2>
            Akses terbatas
          </h2>

          <p>
            Anda harus login terlebih dahulu
            untuk mengakses halaman ini.
          </p>

          <button
            type="button"
            className="protected-login-button"
            onClick={() => {
              navigate("/login", {
                state: {
                  from: location,
                },
              });
            }}
          >
            <LogIn size={17} />

            Login Sekarang
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProtectedRoute;