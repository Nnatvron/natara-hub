import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import {
  getQuizScore,
  getQuizScores,
  saveQuizScore,
} from "../utils/storage";
import materials from "../data/materials";
import { createNotification } from "../utils/notification";

function useQuiz() {
  /*
  |--------------------------------------------------------------------------
  | AUTH USER
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] = useState(null);
  const [scores, setScores] = useState({});

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!mounted) return;

        try {
          setError(null);
          setCurrentUser(user);

          /*
           * Guest tidak memiliki
           * nilai quiz.
           */
          if (!user) {
            setScores({});
            setLoading(false);
            return;
          }

          /*
           * Ambil nilai quiz berdasarkan
           * akun Firebase yang login.
           */
          const savedScores = getQuizScores();

          setScores(
            savedScores && typeof savedScores === "object"
              ? savedScores
              : {}
          );

          setLoading(false);
        } catch (err) {
          console.error("Quiz load error:", err);

          setScores({});
          setError("Data quiz tidak dapat dimuat.");
          setLoading(false);
        }
      },
      (err) => {
        if (!mounted) return;

        console.error("Auth listener error:", err);

        setCurrentUser(null);
        setScores({});
        setError("Terjadi masalah saat memuat akun.");
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
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
      try {
        const savedScores = getQuizScores();

        setScores(
          savedScores && typeof savedScores === "object"
            ? savedScores
            : {}
        );

        setError(null);
      } catch (err) {
        console.error("Quiz refresh error:", err);

        setError("Data quiz tidak dapat diperbarui.");
      }
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

  const saveScore = (quizId, score) => {
    /*
     * Guest tidak boleh menyimpan
     * nilai quiz.
     */
    if (!auth.currentUser) {
      return;
    }

    try {
      const updated = saveQuizScore(
        quizId,
        score
      );

      setScores(
        updated && typeof updated === "object"
          ? updated
          : {}
      );

      setError(null);

      /*
       * Cari materi terkait quiz.
       */
      const material = materials.find(
        (item) => item.id === quizId
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
    } catch (err) {
      console.error("Save quiz score error:", err);

      setError("Nilai quiz tidak dapat disimpan.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET SCORE
  |--------------------------------------------------------------------------
  */

  const getScore = (quizId) => {
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
    loading,
    error,
    saveScore,
    getScore,
  };
}

export default useQuiz;