const COMPLETED_KEY = "natarahub_completed_materials";
const BOOKMARK_KEY = "natarahub_bookmarks";

export function getCompletedMaterials() {
  try {
    const data = localStorage.getItem(COMPLETED_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setCompletedMaterials(materialIds) {
  localStorage.setItem(
    COMPLETED_KEY,
    JSON.stringify(materialIds)
  );
}

export function markMaterialCompleted(materialId) {
  const completed = getCompletedMaterials();

  if (!completed.includes(materialId)) {
    completed.push(materialId);
    setCompletedMaterials(completed);
  }

  return completed;
}

export function removeCompletedMaterial(materialId) {
  const completed = getCompletedMaterials();

  const updated = completed.filter(
    (id) => id !== materialId
  );

  setCompletedMaterials(updated);

  return updated;
}

export function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARK_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setBookmarks(bookmarkIds) {
  localStorage.setItem(
    BOOKMARK_KEY,
    JSON.stringify(bookmarkIds)
  );
}

export function toggleBookmark(materialId) {
  const bookmarks = getBookmarks();

  if (bookmarks.includes(materialId)) {
    const updated = bookmarks.filter(
      (id) => id !== materialId
    );

    setBookmarks(updated);

    return updated;
  }

  const updated = [...bookmarks, materialId];

  setBookmarks(updated);

  return updated;
}

export function isBookmarked(materialId) {
  return getBookmarks().includes(materialId);
}