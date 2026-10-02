import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  Mail,
} from "lucide-react";

import {
  registerUser,
  validatePassword,
  sendVerificationEmail,
  checkEmailVerification,
  loginWithGoogle,
} from "../../firebase/auth";

import {
  createUserProfile,
} from "../../firebase/user";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [emailCreated, setEmailCreated] =
    useState(false);
  const [emailVerified, setEmailVerified] =
    useState(false);

  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [sendingVerification, setSendingVerification] =
    useState(false);

  const [checkingVerification, setCheckingVerification] =
    useState(false);

  const passwordRules =
    validatePassword(password);

  /*
  |--------------------------------------------------------------------------
  | MEMBUAT AKUN + KIRIM EMAIL VERIFIKASI
  |--------------------------------------------------------------------------
  */

  const handleSendVerification = async () => {
    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanName) {
      setError(
        "Nama wajib diisi."
      );
      return;
    }

    if (!cleanEmail) {
      setError(
        "Email wajib diisi."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(
        "Format email tidak valid."
      );
      return;
    }

    if (!passwordRules.valid) {
      setError(
        "Password belum memenuhi semua persyaratan."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    try {
      setSendingVerification(true);

      /*
      |--------------------------------------------------------------------------
      | BUAT AKUN FIREBASE
      |--------------------------------------------------------------------------
      */

      if (!emailCreated) {
        await registerUser(
          cleanName,
          cleanEmail,
          password
        );

        setEmailCreated(true);
      }

      /*
      |--------------------------------------------------------------------------
      | KIRIM EMAIL VERIFIKASI
      |--------------------------------------------------------------------------
      */

      await sendVerificationEmail();

      setSuccess(
        "Email verifikasi sudah dikirim. Silakan cek inbox email kamu dan klik link verifikasi."
      );
    } catch (error) {
      console.error(
        "Verification email error:",
        error
      );

      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "Email tersebut sudah terdaftar. Silakan gunakan email lain atau login."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Format email tidak valid."
          );
          break;

        case "auth/weak-password":
          setError(
            "Password terlalu lemah."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Terlalu banyak percobaan. Silakan tunggu beberapa saat."
          );
          break;

        default:
          setError(
            error.message ||
              "Gagal mengirim email verifikasi."
          );
      }
    } finally {
      setSendingVerification(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CEK EMAIL VERIFIKASI
  |--------------------------------------------------------------------------
  */

  const handleCheckVerification = async () => {
    setError("");
    setSuccess("");

    try {
      setCheckingVerification(true);

      const verified =
        await checkEmailVerification();

      if (!verified) {
        setError(
          "Email belum terverifikasi. Silakan buka email dan klik link verifikasi terlebih dahulu."
        );
        return;
      }

      setEmailVerified(true);

      setSuccess(
        "Email berhasil diverifikasi. Kamu sekarang bisa membuat akun."
      );
    } catch (error) {
      console.error(
        "Check verification error:",
        error
      );

      setError(
        "Gagal mengecek status verifikasi email."
      );
    } finally {
      setCheckingVerification(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GOOGLE SIGN UP
  |--------------------------------------------------------------------------
  */

  const handleGoogleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      /*
      |--------------------------------------------------------------------------
      | GOOGLE LOGIN
      |--------------------------------------------------------------------------
      |
      | loginWithGoogle() juga akan:
      |
      | 1. Membuka Google popup
      | 2. Login / membuat akun Firebase
      | 3. Membuat profile Firestore
      |
      */

      const user =
        await loginWithGoogle(true);

      console.log(
        "Google registration berhasil:",
        user
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Google registration error:",
        error
      );

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError(
            "Pendaftaran Google dibatalkan."
          );
          break;

        case "auth/popup-blocked":
          setError(
            "Popup Google diblokir browser. Izinkan popup untuk melanjutkan."
          );
          break;

        case "auth/cancelled-popup-request":
          setError(
            "Permintaan Google dibatalkan."
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
            "Pendaftaran dengan Google gagal. Silakan coba lagi."
          );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SELESAIKAN REGISTRASI EMAIL
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanName) {
      setError(
        "Nama wajib diisi."
      );
      return;
    }

    if (!cleanEmail) {
      setError(
        "Email wajib diisi."
      );
      return;
    }

    if (!emailCreated) {
      setError(
        "Silakan verifikasi email terlebih dahulu."
      );
      return;
    }

    if (!emailVerified) {
      setError(
        "Email belum terverifikasi."
      );
      return;
    }

    if (!passwordRules.valid) {
      setError(
        "Password belum memenuhi semua persyaratan."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    try {
      setLoading(true);

      const verified =
        await checkEmailVerification();

      if (!verified) {
        setError(
          "Email belum terverifikasi."
        );
        return;
      }

      const firebaseUser =
        await import(
          "../../firebase/config"
        );

      const currentUser =
        firebaseUser.auth.currentUser;

      if (!currentUser) {
        setError(
          "Sesi pendaftaran sudah berakhir. Silakan daftar kembali."
        );
        return;
      }

      await createUserProfile(
        currentUser,
        cleanName
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Complete registration error:",
        error
      );

      setError(
        error.message ||
          "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* BRAND */}

        <div className="register-brand">
          <div className="register-logo">
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

        {/* HEADER */}

        <div className="register-header">
          <h1>
            Buat akun
          </h1>

          <p>
            Mulai perjalanan belajar kamu
            bersama NATARA HUB.
          </p>
        </div>

        {/* REGISTER FORM */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="register-field">
            <label htmlFor="register-name">
              Nama lengkap
            </label>

            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Masukkan nama kamu"
              autoComplete="name"
              disabled={
                loading ||
                emailCreated ||
                googleLoading
              }
            />
          </div>

          {/* EMAIL */}

          <div className="register-field">
            <label htmlFor="register-email">
              Email
            </label>

            <div className="register-verification-email">

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setEmailVerified(
                    false
                  );

                  setError("");
                  setSuccess("");
                }}
                placeholder="nama@email.com"
                autoComplete="email"
                disabled={
                  loading ||
                  sendingVerification ||
                  emailCreated ||
                  googleLoading
                }
              />

              {!emailCreated ? (
                <button
                  type="button"
                  onClick={
                    handleSendVerification
                  }
                  disabled={
                    loading ||
                    sendingVerification ||
                    googleLoading
                  }
                >
                  {sendingVerification ? (
                    <>
                      <Loader2
                        size={16}
                        className="register-spinner"
                      />

                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />

                      Verifikasi
                    </>
                  )}
                </button>
              ) : emailVerified ? (
                <button
                  type="button"
                  disabled
                >
                  <Check size={16} />

                  Terverifikasi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleSendVerification
                  }
                  disabled={
                    loading ||
                    sendingVerification ||
                    googleLoading
                  }
                >
                  {sendingVerification ? (
                    <>
                      <Loader2
                        size={16}
                        className="register-spinner"
                      />

                      Mengirim...
                    </>
                  ) : (
                    "Kirim ulang"
                  )}
                </button>
              )}

            </div>
          </div>

          {/* EMAIL VERIFICATION BOX */}

          {emailCreated &&
            !emailVerified && (
              <div className="register-verification-box">

                <div>
                  <strong>
                    Verifikasi email kamu
                  </strong>

                  <p>
                    Kami sudah mengirim
                    link verifikasi ke:
                  </p>

                  <span>
                    {email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCheckVerification
                  }
                  disabled={
                    checkingVerification ||
                    loading ||
                    googleLoading
                  }
                >
                  {checkingVerification ? (
                    <>
                      <Loader2
                        size={16}
                        className="register-spinner"
                      />

                      Mengecek...
                    </>
                  ) : (
                    <>
                      <Check
                        size={16}
                      />

                      Saya sudah verifikasi
                    </>
                  )}
                </button>

                <small>
                  Buka email kamu lalu klik
                  link verifikasi. Periksa
                  folder Spam jika email belum
                  masuk.
                </small>

              </div>
            )}

          {/* PASSWORD */}

          <div className="register-field">
            <label htmlFor="register-password">
              Password
            </label>

            <div className="register-password">

              <input
                id="register-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Buat password"
                autoComplete="new-password"
                disabled={
                  loading ||
                  emailCreated ||
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

            {/* PASSWORD RULES */}

            <div className="register-password-rules">

              <div
                className={
                  passwordRules.hasMinLength
                    ? "valid"
                    : ""
                }
              >
                {passwordRules.hasMinLength ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}

                Minimal 6 karakter
              </div>

              <div
                className={
                  passwordRules.hasUppercase
                    ? "valid"
                    : ""
                }
              >
                {passwordRules.hasUppercase ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}

                1 huruf besar
              </div>

              <div
                className={
                  passwordRules.hasNumber
                    ? "valid"
                    : ""
                }
              >
                {passwordRules.hasNumber ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}

                1 angka
              </div>

              <div
                className={
                  passwordRules.hasSymbol
                    ? "valid"
                    : ""
                }
              >
                {passwordRules.hasSymbol ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}

                1 simbol
              </div>

            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-field">
            <label htmlFor="register-confirm-password">
              Konfirmasi password
            </label>

            <div className="register-password">

              <input
                id="register-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Ulangi password"
                autoComplete="new-password"
                disabled={
                  loading ||
                  emailCreated ||
                  googleLoading
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
                disabled={
                  loading ||
                  googleLoading
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-success">
              {success}
            </div>
          )}

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-submit"
            disabled={
              loading ||
              !emailVerified ||
              googleLoading
            }
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="register-spinner"
                />

                Membuat akun...
              </>
            ) : emailVerified ? (
              "Buat akun"
            ) : (
              "Verifikasi email terlebih dahulu"
            )}
          </button>

        </form>

        {/* GOOGLE SIGN UP */}

        <div className="register-divider">
          <span>atau</span>
        </div>

        <button
          type="button"
          className="register-google"
          onClick={
            handleGoogleRegister
          }
          disabled={
            loading ||
            sendingVerification ||
            checkingVerification ||
            googleLoading
          }
        >
          {googleLoading ? (
            <>
              <Loader2
                size={18}
                className="register-spinner"
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

              Daftar dengan Google
            </>
          )}
        </button>

        {/* FOOTER */}

        <div className="register-footer">
          <span>
            Sudah punya akun?
          </span>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;