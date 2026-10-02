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
  const [sendingVerification, setSendingVerification] =
    useState(false);
  const [checkingVerification, setCheckingVerification] =
    useState(false);

  const passwordRules =
    validatePassword(password);

  /*
    Membuat akun Firebase dan
    mengirim email verifikasi.
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
        Kalau akun belum dibuat,
        buat akun Firebase terlebih dahulu.
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
        Firebase mengirim link
        verifikasi ke email user.
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
    Mengecek apakah user sudah
    klik link verifikasi di email.
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
    Membuat profile setelah email
    benar-benar terverifikasi.
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

      const user =
        await checkEmailVerification();

      if (!user) {
        setError(
          "Email belum terverifikasi."
        );
        return;
      }

      const firebaseUser =
        await import("../../firebase/config");

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

        <div className="register-header">
          <h1>
            Buat akun
          </h1>

          <p>
            Mulai perjalanan belajar kamu
            bersama NATARA HUB.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

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
                emailCreated
              }
            />
          </div>

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
                  emailCreated
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
                    sendingVerification
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
                    sendingVerification
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
                    loading
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
                      <Check size={16} />
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
                  emailCreated
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
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

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
                  emailCreated
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
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {success && (
            <div className="register-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="register-submit"
            disabled={
              loading ||
              !emailVerified
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