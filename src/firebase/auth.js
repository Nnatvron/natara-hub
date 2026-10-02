import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./config";

/*
|--------------------------------------------------------------------------
| GOOGLE AUTHENTICATION
|--------------------------------------------------------------------------
*/

const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

/*
|--------------------------------------------------------------------------
| VALIDASI PASSWORD
|--------------------------------------------------------------------------
|
| - Minimal 6 karakter
| - Minimal 1 huruf besar
| - Minimal 1 angka
| - Minimal 1 simbol
|
*/

export function validatePassword(
  password
) {
  const hasMinLength =
    password.length >= 6;

  const hasUppercase =
    /[A-Z]/.test(password);

  const hasNumber =
    /[0-9]/.test(password);

  const hasSymbol =
    /[^A-Za-z0-9]/.test(password);

  return {
    valid:
      hasMinLength &&
      hasUppercase &&
      hasNumber &&
      hasSymbol,

    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSymbol,
  };
}

/*
|--------------------------------------------------------------------------
| REGISTER USER — EMAIL & PASSWORD
|--------------------------------------------------------------------------
*/

export async function registerUser(
  name,
  email,
  password
) {
  const passwordCheck =
    validatePassword(password);

  if (!passwordCheck.valid) {
    throw new Error(
      "Password harus minimal 6 karakter, memiliki 1 huruf besar, 1 angka, dan 1 simbol."
    );
  }

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user =
    userCredential.user;

  await updateProfile(user, {
    displayName: name,
  });

  return user;
}

/*
|--------------------------------------------------------------------------
| GOOGLE LOGIN
|--------------------------------------------------------------------------
|
| Google authentication akan:
|
| 1. Membuka pilihan akun Google.
| 2. Login jika akun NATARA HUB sudah ada.
| 3. Membuat Firebase user jika akun Google
|    tersebut belum pernah digunakan.
|
*/

export async function loginWithGoogle(
  rememberMe = true
) {
  const persistence =
    rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

  await setPersistence(
    auth,
    persistence
  );

  const result =
    await signInWithPopup(
      auth,
      googleProvider
    );

  return result.user;
}

/*
|--------------------------------------------------------------------------
| KIRIM EMAIL VERIFIKASI
|--------------------------------------------------------------------------
*/

export async function sendVerificationEmail() {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "User belum dibuat."
    );
  }

  await sendEmailVerification(
    user
  );
}

/*
|--------------------------------------------------------------------------
| CEK EMAIL VERIFIKASI
|--------------------------------------------------------------------------
*/

export async function checkEmailVerification() {
  const user =
    auth.currentUser;

  if (!user) {
    return false;
  }

  await user.reload();

  return auth.currentUser
    .emailVerified;
}

/*
|--------------------------------------------------------------------------
| LOGIN USER — EMAIL & PASSWORD
|--------------------------------------------------------------------------
*/

export async function loginUser(
  email,
  password,
  rememberMe = false
) {
  const persistence =
    rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

  await setPersistence(
    auth,
    persistence
  );

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export async function logoutUser() {
  await signOut(auth);
}

/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

export async function resetPassword(
  email
) {
  await sendPasswordResetEmail(
    auth,
    email
  );
}