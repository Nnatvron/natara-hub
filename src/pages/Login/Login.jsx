import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ArrowLeft,
} from "lucide-react";

import {
  loginUser,
  resetPassword,
} from "../../firebase/auth";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(
        cleanEmail,
        password,
        rememberMe
      );

      const from =
        location.state?.from || "/";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError(
            "Email atau password salah."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Format email tidak valid."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Terlalu banyak percobaan. Coba lagi nanti."
          );
          break;

        case "auth/user-disabled":
          setError(
            "Akun ini telah dinonaktifkan."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Koneksi internet bermasalah. Periksa koneksi kamu."
          );
          break;

        default:
          setError(
            "Login gagal. Silakan coba lagi."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Masukkan email terlebih dahulu."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(
        "Format email tidak valid."
      );
      return;
    }

    try {
      setResetLoading(true);

      await resetPassword(
        cleanEmail
      );

      setSuccess(
        "Link reset password sudah dikirim ke email kamu. Silakan cek inbox atau folder Spam."
      );
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-email":
          setError(
            "Format email tidak valid."
          );
          break;

        case "auth/user-not-found":
          setError(
            "Email tersebut belum terdaftar."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Terlalu banyak permintaan. Silakan coba lagi nanti."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Koneksi internet bermasalah. Periksa koneksi kamu."
          );
          break;

        default:
          setError(
            "Gagal mengirim link reset password. Silakan coba lagi."
          );
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <div className="login-logo">
            N
          </div>

          <div>
            <strong>
              NATARA HUB
            </strong>

            <span>
              Academic Learning Platform
            </span>
          </div>
        </div>

        {!showForgotPassword ? (
          <>
            <div className="login-header">
              <h1>
                Selamat datang kembali
              </h1>

              <p>
                Login untuk melanjutkan perjalanan
                belajar kamu.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="login-field">
                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="login-password">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );

                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-options">

                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                    disabled={loading}
                  />

                  <span>
                    Remember Me
                  </span>
                </label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={() => {
                    setShowForgotPassword(
                      true
                    );

                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                >
                  Lupa Password?
                </button>

              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="login-success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="login-spinner"
                    />

                    Masuk...
                  </>
                ) : (
                  "Login"
                )}
              </button>

            </form>

            <div className="login-footer">
              <span>
                Belum punya akun?
              </span>

              <Link to="/register">
                Buat akun
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="login-header">
              <h1>
                Lupa password?
              </h1>

              <p>
                Masukkan email akun kamu.
                Kami akan mengirimkan link
                untuk membuat password baru.
              </p>
            </div>

            <div className="login-form">

              <div className="login-field">
                <label htmlFor="reset-email">
                  Email
                </label>

                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  disabled={resetLoading}
                />
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="login-success">
                  {success}
                </div>
              )}

              <button
                type="button"
                className="login-submit"
                onClick={
                  handleForgotPassword
                }
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="login-spinner"
                    />

                    Mengirim...
                  </>
                ) : (
                  <>
                    <Mail size={18} />

                    Kirim Link Reset
                  </>
                )}
              </button>

              <button
                type="button"
                className="login-back"
                onClick={() => {
                  setShowForgotPassword(
                    false
                  );

                  setError("");
                  setSuccess("");
                }}
                disabled={resetLoading}
              >
                <ArrowLeft size={17} />

                Kembali ke Login
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;