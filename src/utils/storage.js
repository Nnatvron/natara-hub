import { auth } from "../firebase/config";

/*
|--------------------------------------------------------------------------
| GET CURRENT USER ID
|--------------------------------------------------------------------------
*/

function getCurrentUserId() {
  return auth.currentUser?.uid || null;
}

/*
|--------------------------------------------------------------------------
| SAFE STORAGE HELPERS
|--------------------------------------------------------------------------
*/

function readJson(
  key,
  fallback
) {
  if (!key) {
    return fallback;
  }

  try {
    const data =
      localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function writeJson(
  key,
  value
) {
  if (!key) {
    return false;
  }

  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| USER-SPECIFIC STORAGE KEYS
|--------------------------------------------------------------------------
*/

function getCompletedKey() {
  const uid =
    getCurrentUserId();

  if (!uid) {
    return null;
  }

  return `natarahub_completed_materials_${uid}`;
}

function getBookmarkKey() {
  const uid =
    getCurrentUserId();

  if (!uid) {
    return null;
  }

  return `natarahub_bookmarks_${uid}`;
}

function getQuizScoreKey() {
  const uid =
    getCurrentUserId();

  if (!uid) {
    return null;
  }

  return `natarahub_quiz_scores_${uid}`;
}

function getRecentMaterialKey() {
  const uid =
    getCurrentUserId();

  if (!uid) {
    return null;
  }

  return `natarahub_recent_materials_${uid}`;
}

/*
|--------------------------------------------------------------------------
| COMPLETED MATERIALS
|--------------------------------------------------------------------------
*/

export function getCompletedMaterials() {
  const key =
    getCompletedKey();

  const data =
    readJson(key, []);

  return Array.isArray(data)
    ? data
    : [];
}

export function setCompletedMaterials(
  materialIds
) {
  const key =
    getCompletedKey();

  if (!key) {
    return;
  }

  const safeMaterialIds =
    Array.isArray(materialIds)
      ? materialIds
      : [];

  writeJson(
    key,
    safeMaterialIds
  );
}

export function markMaterialCompleted(
  materialId
) {
  if (!materialId) {
    return getCompletedMaterials();
  }

  const completed =
    getCompletedMaterials();

  if (
    !completed.includes(
      materialId
    )
  ) {
    completed.push(materialId);

    setCompletedMaterials(
      completed
    );
  }

  return completed;
}

export function removeCompletedMaterial(
  materialId
) {
  const completed =
    getCompletedMaterials();

  const updated =
    completed.filter(
      (id) =>
        id !== materialId
    );

  setCompletedMaterials(
    updated
  );

  return updated;
}

/*
|--------------------------------------------------------------------------
| BOOKMARKS
|--------------------------------------------------------------------------
*/

export function getBookmarks() {
  const key =
    getBookmarkKey();

  const data =
    readJson(key, []);

  return Array.isArray(data)
    ? data
    : [];
}

export function setBookmarks(
  bookmarkIds
) {
  const key =
    getBookmarkKey();

  if (!key) {
    return;
  }

  const safeBookmarkIds =
    Array.isArray(bookmarkIds)
      ? bookmarkIds
      : [];

  writeJson(
    key,
    safeBookmarkIds
  );
}

export function toggleBookmark(
  materialId
) {
  if (!materialId) {
    return getBookmarks();
  }

  const bookmarks =
    getBookmarks();

  if (
    bookmarks.includes(
      materialId
    )
  ) {
    const updated =
      bookmarks.filter(
        (id) =>
          id !== materialId
      );

    setBookmarks(updated);

    return updated;
  }

  const updated = [
    ...bookmarks,
    materialId,
  ];

  setBookmarks(updated);

  return updated;
}

export function isBookmarked(
  materialId
) {
  return getBookmarks().includes(
    materialId
  );
}

/*
|--------------------------------------------------------------------------
| QUIZ SCORES
|--------------------------------------------------------------------------
*/

export function getQuizScores() {
  const key =
    getQuizScoreKey();

  const data =
    readJson(key, {});

  if (
    !data ||
    Array.isArray(data) ||
    typeof data !== "object"
  ) {
    return {};
  }

  return data;
}

export function saveQuizScore(
  quizId,
  score
) {
  const key =
    getQuizScoreKey();

  if (!key || !quizId) {
    return getQuizScores();
  }

  const scores =
    getQuizScores();

  scores[quizId] = score;

  writeJson(
    key,
    scores
  );

  return scores;
}

export function getQuizScore(
  quizId
) {
  const scores =
    getQuizScores();

  return (
    scores[quizId] ??
    null
  );
}

/*
|--------------------------------------------------------------------------
| RECENT MATERIALS / LEARNING HISTORY
|--------------------------------------------------------------------------
|
| Menyimpan maksimal 10 materi terakhir
| yang dibuka oleh user.
|
*/

export function getRecentMaterials() {
  const key =
    getRecentMaterialKey();

  const data =
    readJson(key, []);

  return Array.isArray(data)
    ? data
    : [];
}

export function addRecentMaterial(
  materialId
) {
  if (!materialId) {
    return getRecentMaterials();
  }

  const recent =
    getRecentMaterials();

  /*
   * Hapus material yang sama terlebih dahulu
   * supaya material yang baru dibuka
   * selalu berada di posisi paling atas.
   */

  const filtered =
    recent.filter(
      (id) =>
        id !== materialId
    );

  const updated = [
    materialId,
    ...filtered,
  ].slice(0, 10);

  writeJson(
    getRecentMaterialKey(),
    updated
  );

  return updated;
}

export function clearRecentMaterials() {
  const key =
    getRecentMaterialKey();

  if (!key) {
    return;
  }

  localStorage.removeItem(key);
}
/*
|--------------------------------------------------------------------------
| LAST VIEWED MATERIAL
|--------------------------------------------------------------------------
|
| Alias untuk kompatibilitas dengan MaterialDetail.jsx.
| Menyimpan material terakhir yang dibuka user.
|
*/

export function saveLastViewedMaterial(
  materialId
) {
  return addRecentMaterial(
    materialId
  );
}