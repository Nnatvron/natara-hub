import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

export async function createUserProfile(user, name) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: name,
      email: user.email,
      createdAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}