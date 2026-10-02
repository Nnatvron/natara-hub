import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

import {
  getQuizScore,
  getQuizScores,
  saveQuizScore,
} from "../utils/storage";

import materials from "../data/materials";

import {
  createNotification,
} from "../utils/notification";

function useQuiz() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [scores, setScores] =
    useState({});

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);

          /*
           * Guest tidak memiliki
           * nilai quiz.
           */

          if (!user) {
            setScores({});
            return;
          }

          /*
           * Ambil nilai quiz berdasarkan
           * akun Firebase yang login.
           */

          setScores(
            getQuizScores()
          );
        }
      );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH QUIZ DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!currentUser) {
      setScores({});
      return;
    }

    const refreshScores = () => {
      setScores(
        getQuizScores()
      );
    };

    window.addEventListener(
      "storage",
      refreshScores
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshScores
      );
    };
  }, [currentUser]);

  /*
  |--------------------------------------------------------------------------
  | SAVE QUIZ SCORE
  |--------------------------------------------------------------------------
  */

  const saveScore = (
    quizId,
    score
  ) => {
    /*
     * Guest tidak boleh menyimpan
     * nilai quiz.
     */

    if (!auth.currentUser) {
      return;
    }

    const updated =
      saveQuizScore(
        quizId,
        score
      );

    setScores(updated);

    /*
     * Cari materi terkait quiz.
     */

    const material =
      materials.find(
        (item) =>
          item.id === quizId
      );

    if (!material) {
      return;
    }

    /*
     * QUIZ LULUS
     */

    if (score >= 100) {
      createNotification({
        id: `quiz-passed-${material.id}`,
        type: "quiz",
        title: "Quiz berhasil",
        message: `Kamu mendapatkan nilai 100 pada quiz ${material.title}.`,
        link: `/material/${material.id}`,
      });

      return;
    }

    /*
     * QUIZ BELUM LULUS
     */

    createNotification({
      id: `quiz-failed-${material.id}-${score}`,
      type: "quiz",
      title: "Quiz belum lulus",
      message: `Nilai kamu ${score}/100. Coba lagi untuk mendapatkan nilai 100.`,
      link: `/material/${material.id}`,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | GET SCORE
  |--------------------------------------------------------------------------
  */

  const getScore = (
    quizId
  ) => {
    if (!currentUser) {
      return null;
    }

    return (
      scores[quizId] ??
      getQuizScore(quizId)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    currentUser,
    scores,
    saveScore,
    getScore,
  };
}

export default useQuiz;