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
  loginWithGoogle,
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

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOGIN EMAIL & PASSWORD
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | GOOGLE LOGIN
  |--------------------------------------------------------------------------
  */

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      const user = await loginWithGoogle(
        rememberMe
      );

      console.log(
        "Google login berhasil:",
        user
      );

      const from =
        location.state?.from || "/";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError(
            "Login Google dibatalkan."
          );
          break;

        case "auth/popup-blocked":
          setError(
            "Popup Google diblokir browser. Izinkan popup untuk melanjutkan."
          );
          break;

        case "auth/cancelled-popup-request":
          setError(
            "Permintaan login Google dibatalkan."
          );
          break;

        case "auth/account-exists-with-different-credential":
          setError(
            "Email Google ini sudah terdaftar dengan metode login lain."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Koneksi internet bermasalah. Periksa koneksi kamu."
          );
          break;

        default:
          setError(
            "Login dengan Google gagal. Silakan coba lagi."
          );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORGOT PASSWORD
  |--------------------------------------------------------------------------
  */

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
                  disabled={
                    loading ||
                    googleLoading
                  }
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
                    disabled={
                      loading ||
                      googleLoading
                    }
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
                    disabled={
                      loading ||
                      googleLoading
                    }
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
                    disabled={
                      loading ||
                      googleLoading
                    }
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
                  disabled={
                    loading ||
                    googleLoading
                  }
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
                disabled={
                  loading ||
                  googleLoading
                }
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

            {/* GOOGLE LOGIN */}

            <div className="login-divider">
              <span>atau</span>
            </div>

            <button
              type="button"
              className="login-google"
              onClick={handleGoogleLogin}
              disabled={
                loading ||
                googleLoading
              }
            >
              {googleLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="login-spinner"
                  />

                  Menghubungkan Google...
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.75Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.86A5.85 5.85 0 0 1 6.24 12c0-.64.11-1.26.3-1.86v-2.5H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.5Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.11c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.16 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.39l3.24 2.5C7.31 7.83 9.46 6.11 12 6.11Z"
                    />
                  </svg>

                  Lanjutkan dengan Google
                </>
              )}
            </button>

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