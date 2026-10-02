import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  LockKeyhole,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../../firebase/config";

import courses from "../../data/courses";
import materials from "../../data/materials";
import quizzes from "../../data/quiz";

import useProgress from "../../hooks/useProgress";
import useBookmark from "../../hooks/useBookmark";
import useQuiz from "../../hooks/useQuiz";

import {
  saveLastViewedMaterial,
} from "../../utils/storage";

import "./MaterialDetail.css";

function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH
  |--------------------------------------------------------------------------
  */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | LEARNING HOOKS
  |--------------------------------------------------------------------------
  */

  const {
    markCompleted,
    isCompleted,
  } = useProgress();

  const {
    toggle,
    isBookmarked,
  } = useBookmark();

  const {
    getScore,
    saveScore,
  } = useQuiz();

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
          setAuthLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PROTECT MATERIAL PAGE
  |--------------------------------------------------------------------------
  |
  | Guest tidak diperbolehkan masuk ke halaman
  | materi.
  |
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/material/" + id,
        },
      });
    }
  }, [
    currentUser,
    authLoading,
    navigate,
    id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | MATERIAL
  |--------------------------------------------------------------------------
  */

  const material = useMemo(
    () =>
      materials.find(
        (item) => item.id === id
      ),
    [id]
  );

  /*
  |--------------------------------------------------------------------------
  | SAVE LAST VIEWED MATERIAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      authLoading ||
      !currentUser ||
      !material
    ) {
      return;
    }

    saveLastViewedMaterial(
      material.id
    );
  }, [
    authLoading,
    currentUser,
    material,
  ]);

  /*
  |--------------------------------------------------------------------------
  | COURSE
  |--------------------------------------------------------------------------
  */

  const course = useMemo(
    () =>
      material
        ? courses.find(
            (item) =>
              item.id ===
              material.courseId
          )
        : null,
    [material]
  );

  /*
  |--------------------------------------------------------------------------
  | COURSE MATERIALS
  |--------------------------------------------------------------------------
  */

  const courseMaterials = useMemo(
    () =>
      material
        ? materials.filter(
            (item) =>
              item.courseId ===
              material.courseId
          )
        : [],
    [material]
  );

  /*
  |--------------------------------------------------------------------------
  | CURRENT MATERIAL INDEX
  |--------------------------------------------------------------------------
  */

  const currentIndex = useMemo(
    () =>
      courseMaterials.findIndex(
        (item) => item.id === id
      ),
    [courseMaterials, id]
  );

  const previousMaterial =
    currentIndex > 0
      ? courseMaterials[
          currentIndex - 1
        ]
      : null;

  const nextMaterial =
    currentIndex >= 0 &&
    currentIndex <
      courseMaterials.length - 1
      ? courseMaterials[
          currentIndex + 1
        ]
      : null;

  /*
  |--------------------------------------------------------------------------
  | QUIZ
  |--------------------------------------------------------------------------
  */

  const quiz = useMemo(
    () =>
      quizzes.find(
        (item) =>
          item.materialId ===
          material?.id
      ) || null,
    [material?.id]
  );

  /*
  |--------------------------------------------------------------------------
  | QUIZ STATE
  |--------------------------------------------------------------------------
  */

  const [quizScore, setQuizScore] =
    useState(null);

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({});

  const [
    quizSubmitted,
    setQuizSubmitted,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD SAVED QUIZ SCORE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !currentUser ||
      !material ||
      !quiz
    ) {
      setQuizScore(null);
      return;
    }

    const savedScore =
      getScore(material.id);

    setQuizScore(
      savedScore === undefined ||
        savedScore === null
        ? null
        : savedScore
    );
  }, [
    currentUser,
    material,
    quiz,
    getScore,
  ]);

  /*
  |--------------------------------------------------------------------------
  | RESET QUIZ WHEN MATERIAL CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | SEQUENTIAL MATERIAL PROTECTION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      authLoading ||
      !currentUser ||
      !material ||
      !previousMaterial
    ) {
      return;
    }

    if (
      !isCompleted(
        previousMaterial.id
      )
    ) {
      navigate(
        "/material/" +
          previousMaterial.id,
        {
          replace: true,
        }
      );
    }
  }, [
    authLoading,
    currentUser,
    material,
    previousMaterial,
    isCompleted,
    navigate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="material-detail-page">
        <div className="material-not-found">
          <BookOpen size={40} />

          <h2>
            Memuat materi...
          </h2>

          <p>
            Memeriksa akun kamu.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | GUEST
  |--------------------------------------------------------------------------
  */

  if (!currentUser) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | MATERIAL NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!material) {
    return (
      <div className="material-detail-page">
        <div className="material-not-found">
          <BookOpen size={40} />

          <h2>
            Materi tidak ditemukan
          </h2>

          <p>
            Materi yang kamu cari tidak
            tersedia.
          </p>

          <Link
            to="/semester"
            className="material-back-button"
          >
            Kembali ke Semester
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | COURSE NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!course) {
    return (
      <div className="material-detail-page">
        <div className="material-not-found">
          <BookOpen size={40} />

          <h2>
            Mata kuliah tidak ditemukan
          </h2>

          <p>
            Data mata kuliah untuk materi ini
            tidak tersedia.
          </p>

          <Link
            to="/semester"
            className="material-back-button"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MATERIAL STATUS
  |--------------------------------------------------------------------------
  */

  const completed =
    isCompleted(material.id);

  const bookmarked =
    isBookmarked(material.id);

  /*
  |--------------------------------------------------------------------------
  | QUIZ STATUS
  |--------------------------------------------------------------------------
  */

  const hasPassedQuiz =
    !quiz || quizScore === 100;

  const canComplete =
    !quiz || hasPassedQuiz;

  /*
  |--------------------------------------------------------------------------
  | CURRENT QUESTION
  |--------------------------------------------------------------------------
  */

  const question =
    quiz?.questions?.[
      currentQuestion
    ] || null;

  const totalQuestions =
    quiz?.questions?.length || 0;

  const isLastQuestion =
    currentQuestion ===
    totalQuestions - 1;

  /*
  |--------------------------------------------------------------------------
  | CURRENT ANSWER CHECK
  |--------------------------------------------------------------------------
  */

  const currentAnswerCorrect =
    quizSubmitted &&
    selectedAnswer !== null &&
    question &&
    String(selectedAnswer) ===
      String(question.answer);

  /*
  |--------------------------------------------------------------------------
  | SAFE TEXT RENDER
  |--------------------------------------------------------------------------
  */

  const renderSafeText = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(
        (item, index) => (
          <span key={index}>
            {renderSafeText(item)}

            {index <
              value.length - 1 && (
              <br />
            )}
          </span>
        )
      );
    }

    if (
      typeof value === "object"
    ) {
      if ("content" in value) {
        return renderSafeText(
          value.content
        );
      }

      if ("text" in value) {
        return renderSafeText(
          value.text
        );
      }

      const values =
        Object.values(value);

      return values.map(
        (item, index) => (
          <span key={index}>
            {renderSafeText(item)}

            {index <
              values.length - 1 && (
              <br />
            )}
          </span>
        )
      );
    }

    return String(value);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER CODE BLOCK
  |--------------------------------------------------------------------------
  */

  const renderCodeBlock = (
    codeExample
  ) => {
    if (!codeExample) {
      return null;
    }

    let code = "";
    let language = "text";
    let title = "";

    if (
      typeof codeExample ===
      "string"
    ) {
      code = codeExample;
    } else if (
      typeof codeExample ===
      "object"
    ) {
      code =
        codeExample.code ??
        codeExample.content ??
        "";

      language =
        codeExample.language ??
        "text";

      title =
        codeExample.title ??
        "";
    }

    return (
      <div className="material-code-wrapper">

        {title && (
          <div className="material-code-title">
            <span>
              {title}
            </span>

            <span>
              {language}
            </span>
          </div>
        )}

        <pre className="material-code">
          <code>
            {code}
          </code>
        </pre>

      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER QUICK CHECK
  |--------------------------------------------------------------------------
  */

  const renderQuickCheck = (
    quickCheck
  ) => {
    if (!quickCheck) {
      return null;
    }

    if (
      typeof quickCheck ===
      "string"
    ) {
      return (
        <div className="material-quick-check">

          <div className="material-quick-check-header">
            <HelpCircle size={20} />

            <span>
              Quick Check
            </span>
          </div>

          <p>
            {quickCheck}
          </p>

        </div>
      );
    }

    return (
      <div className="material-quick-check">

        <div className="material-quick-check-header">
          <HelpCircle size={20} />

          <span>
            Quick Check
          </span>
        </div>

        {quickCheck.question && (
          <p>
            {renderSafeText(
              quickCheck.question
            )}
          </p>
        )}

        {Array.isArray(
          quickCheck.options
        ) && (
          <div className="quick-check-options">

            {quickCheck.options.map(
              (
                option,
                index
              ) => (
                <div
                  className="quick-check-option"
                  key={index}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                  .{" "}
                  {renderSafeText(
                    option
                  )}
                </div>
              )
            )}

          </div>
        )}

      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER MATERIAL SECTION
  |--------------------------------------------------------------------------
  */

  const renderSection = (
    section,
    index
  ) => {
    if (!section) {
      return null;
    }

    const sectionTitle =
      section.title ??
      section.heading ??
      "Bagian " +
        (index + 1);

    const sectionContent =
      section.content ??
      section.text ??
      "";

    return (
      <section
        className="material-section"
        key={index}
      >

        <h2>
          {renderSafeText(
            sectionTitle
          )}
        </h2>

        {sectionContent && (
          <div className="material-section-content">
            {renderSafeText(
              sectionContent
            )}
          </div>
        )}

        {Array.isArray(
          section.items
        ) && (
          <ul className="material-list">

            {section.items.map(
              (
                item,
                itemIndex
              ) => (
                <li
                  key={itemIndex}
                >
                  {renderSafeText(
                    item
                  )}
                </li>
              )
            )}

          </ul>
        )}

        {section.code &&
          renderCodeBlock(
            section.code
          )}

      </section>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | COMPLETE MATERIAL
  |--------------------------------------------------------------------------
  */

  const handleComplete = () => {
    if (!canComplete) {
      return;
    }

    if (!completed) {
      markCompleted(
        material.id
      );
    }

    if (nextMaterial) {
      navigate(
        "/material/" +
          nextMaterial.id
      );

      return;
    }

    navigate(
      "/course/" +
        course.id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE BOOKMARK
  |--------------------------------------------------------------------------
  */

  const handleBookmark = () => {
    toggle(material.id);
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT QUIZ ANSWER
  |--------------------------------------------------------------------------
  */

  const handleAnswer = (
    answer
  ) => {
    if (quizSubmitted) {
      return;
    }

    setSelectedAnswer(
      answer
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT QUIZ ANSWER
  |--------------------------------------------------------------------------
  */

  const handleSubmitAnswer = () => {
    if (
      !quiz ||
      !question ||
      selectedAnswer === null
    ) {
      return;
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestion]:
        selectedAnswer,
    };

    setSelectedAnswers(
      updatedAnswers
    );

    setQuizSubmitted(true);

    if (!isLastQuestion) {
      return;
    }

    const correctCount =
      quiz.questions.reduce(
        (
          count,
          quizQuestion,
          index
        ) => {
          const answer =
            updatedAnswers[
              index
            ];

          if (
            String(answer) ===
            String(
              quizQuestion.answer
            )
          ) {
            return count + 1;
          }

          return count;
        },
        0
      );

    const finalScore =
      Math.round(
        (correctCount /
          quiz.questions.length) *
          100
      );

    setQuizScore(
      finalScore
    );

    saveScore(
      material.id,
      finalScore
    );
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT QUESTION
  |--------------------------------------------------------------------------
  */

  const handleNextQuestion = () => {
    if (!quizSubmitted) {
      return;
    }

    if (isLastQuestion) {
      return;
    }

    const nextIndex =
      currentQuestion + 1;

    setCurrentQuestion(
      nextIndex
    );

    setSelectedAnswer(
      selectedAnswers[
        nextIndex
      ] ?? null
    );

    setQuizSubmitted(
      false
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS QUESTION
  |--------------------------------------------------------------------------
  */

  const handlePreviousQuestion =
    () => {
      if (
        currentQuestion === 0
      ) {
        return;
      }

      const previousIndex =
        currentQuestion - 1;

      setCurrentQuestion(
        previousIndex
      );

      setSelectedAnswer(
        selectedAnswers[
          previousIndex
        ] ?? null
      );

      setQuizSubmitted(false);
    };

  /*
  |--------------------------------------------------------------------------
  | RETRY QUIZ
  |--------------------------------------------------------------------------
  */

  const handleRetryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS MATERIAL
  |--------------------------------------------------------------------------
  */

  const handlePreviousMaterial =
    () => {
      if (!previousMaterial) {
        return;
      }

      navigate(
        "/material/" +
          previousMaterial.id
      );
    };

  /*
  |--------------------------------------------------------------------------
  | NEXT MATERIAL
  |--------------------------------------------------------------------------
  */

  const handleNextMaterial =
    () => {
      if (
        !nextMaterial ||
        !completed
      ) {
        return;
      }

      navigate(
        "/material/" +
          nextMaterial.id
      );
    };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="material-detail-page">

      {/* TOP NAVIGATION */}

      <div className="material-topbar">

        <button
          type="button"
          className="material-back-link"
          onClick={() =>
            navigate(
              "/course/" +
                course.id
            )
          }
        >
          <ChevronLeft size={18} />

          <span>
            {course.title}
          </span>
        </button>

        <div className="material-top-actions">

          <button
            type="button"
            className={
              "material-bookmark-button " +
              (
                bookmarked
                  ? "active"
                  : ""
              )
            }
            onClick={
              handleBookmark
            }
            aria-label={
              bookmarked
                ? "Hapus bookmark"
                : "Tambah bookmark"
            }
          >
            {bookmarked ? (
              <BookmarkCheck
                size={20}
              />
            ) : (
              <Bookmark
                size={20}
              />
            )}
          </button>

        </div>

      </div>

      {/* MAIN LAYOUT */}

      <div className="material-layout">

        {/* SIDEBAR */}

        <aside className="material-sidebar">

          <div className="material-sidebar-header">
            <span>
              {course.title}
            </span>
          </div>

          <div className="material-sidebar-list">

            {courseMaterials.map(
              (
                item,
                index
              ) => {

                const itemCompleted =
                  isCompleted(
                    item.id
                  );

                const locked =
                  index > 0 &&
                  !isCompleted(
                    courseMaterials[
                      index - 1
                    ].id
                  );

                const active =
                  item.id ===
                  material.id;

                if (locked) {
                  return (
                    <div
                      key={item.id}
                      className={
                        "material-sidebar-item locked " +
                        (
                          active
                            ? "active"
                            : ""
                        )
                      }
                    >

                      <div className="material-sidebar-number">
                        {index + 1}
                      </div>

                      <div className="material-sidebar-info">
                        <span>
                          {item.title}
                        </span>
                      </div>

                      <LockKeyhole
                        size={16}
                      />

                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={
                      "/material/" +
                      item.id
                    }
                    className={
                      "material-sidebar-item " +
                      (
                        active
                          ? "active"
                          : ""
                      )
                    }
                  >

                    <div className="material-sidebar-number">

                      {itemCompleted ? (
                        <Check
                          size={15}
                        />
                      ) : (
                        index + 1
                      )}

                    </div>

                    <div className="material-sidebar-info">

                      <span>
                        {item.title}
                      </span>

                    </div>

                    {itemCompleted && (
                      <CheckCircle2
                        size={16}
                      />
                    )}

                  </Link>
                );
              }
            )}

          </div>

        </aside>

        {/* CONTENT */}

        <main className="material-content">

          {/* MATERIAL HEADER */}

          <div className="material-header">

            <div className="material-breadcrumb">

              <span>
                Semester{" "}
                {course.semester}
              </span>

              <span>
                /
              </span>

              <span>
                {course.title}
              </span>

            </div>

            <div className="material-type-row">

              {material.type && (
                <span className="material-type">
                  {material.type}
                </span>
              )}

              {material.duration && (
                <span className="material-duration">
                  {material.duration}
                </span>
              )}

            </div>

            <h1>
              {material.title}
            </h1>

            {material.description && (
              <p className="material-description">
                {material.description}
              </p>
            )}

            <div className="material-progress-info">

              <span>
                Materi{" "}
                {currentIndex + 1}{" "}
                dari{" "}
                {courseMaterials.length}
              </span>

              {completed && (
                <span className="material-completed-label">

                  <CheckCircle2
                    size={16}
                  />

                  Selesai

                </span>
              )}

            </div>

          </div>

          {/* MATERIAL BODY */}

          <div className="material-body">

            {Array.isArray(
              material.sections
            ) &&
              material.sections.map(
                (
                  section,
                  index
                ) =>
                  renderSection(
                    section,
                    index
                  )
              )}

            {material.codeExample &&
              renderCodeBlock(
                material.codeExample
              )}

            {material.quickCheck &&
              renderQuickCheck(
                material.quickCheck
              )}

          </div>

          {/* QUIZ */}

          {quiz && (
            <section className="material-quiz">

              <div className="material-quiz-header">

                <div>

                  <div className="material-quiz-label">

                    <HelpCircle
                      size={20}
                    />

                    <span>
                      Quiz Materi
                    </span>

                  </div>

                  <h2>
                    Uji pemahaman kamu
                  </h2>

                  <p>
                    Jawab semua
                    pertanyaan untuk
                    menyelesaikan
                    materi ini.
                  </p>

                </div>

                {quizScore !==
                  null && (
                  <div className="material-quiz-score">

                    <span>
                      Nilai
                    </span>

                    <strong>
                      {quizScore}
                    </strong>

                  </div>
                )}

              </div>

              {/* QUIZ CONTENT */}

              <div className="material-quiz-content">

                {question && (
                  <>

                    <div className="material-quiz-progress">

                      <span>
                        Pertanyaan{" "}
                        {currentQuestion +
                          1}{" "}
                        dari{" "}
                        {totalQuestions}
                      </span>

                      <div className="material-quiz-progress-bar">

                        <div
                          style={{
                            width:
                              (
                                (
                                  currentQuestion +
                                  1
                                ) /
                                totalQuestions
                              ) *
                                100 +
                              "%",
                          }}
                        />

                      </div>

                    </div>

                    <div className="material-question">

                      <h3>
                        {
                          question.question
                        }
                      </h3>

                      <div className="material-options">

                        {question.options.map(
                          (
                            option,
                            optionIndex
                          ) => {

                            const isSelected =
                              selectedAnswer ===
                              option;

                            const isCorrect =
                              String(
                                option
                              ) ===
                              String(
                                question.answer
                              );

                            let optionClass =
                              "material-option";

                            if (
                              isSelected
                            ) {
                              optionClass +=
                                " selected";
                            }

                            if (
                              quizSubmitted &&
                              isCorrect
                            ) {
                              optionClass +=
                                " correct";
                            }

                            if (
                              quizSubmitted &&
                              isSelected &&
                              !isCorrect
                            ) {
                              optionClass +=
                                " incorrect";
                            }

                            return (
                              <button
                                type="button"
                                key={
                                  optionIndex
                                }
                                className={
                                  optionClass
                                }
                                onClick={() =>
                                  handleAnswer(
                                    option
                                  )
                                }
                                disabled={
                                  quizSubmitted
                                }
                              >

                                <span className="material-option-letter">

                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}

                                </span>

                                <span className="material-option-text">
                                  {
                                    option
                                  }
                                </span>

                                {quizSubmitted &&
                                  isCorrect && (
                                    <CheckCircle2
                                      size={18}
                                    />
                                  )}

                              </button>
                            );
                          }
                        )}

                      </div>

                    </div>

                    {/* FEEDBACK */}

                    {quizSubmitted && (
                      <div
                        className={
                          "material-quiz-feedback " +
                          (
                            currentAnswerCorrect
                              ? "correct"
                              : "incorrect"
                          )
                        }
                      >

                        {currentAnswerCorrect ? (
                          <>

                            <CheckCircle2
                              size={20}
                            />

                            <div>

                              <strong>
                                Jawaban
                                benar!
                              </strong>

                              <p>
                                Jawaban
                                kamu
                                tepat.
                              </p>

                            </div>

                          </>
                        ) : (
                          <>

                            <HelpCircle
                              size={20}
                            />

                            <div>

                              <strong>
                                Jawaban
                                belum
                                tepat.
                              </strong>

                              <p>
                                Jawaban
                                yang
                                benar
                                adalah:{" "}
                                <strong>
                                  {
                                    question.answer
                                  }
                                </strong>
                              </p>

                            </div>

                          </>
                        )}

                      </div>
                    )}

                    {/* FINAL SCORE */}

                    {quizSubmitted &&
                      isLastQuestion &&
                      quizScore !==
                        null && (
                        <div className="material-quiz-final">

                          <div>

                            <span>
                              Quiz
                              selesai
                            </span>

                            <strong>
                              Nilai
                              kamu:{" "}
                              {
                                quizScore
                              }
                            </strong>

                          </div>

                          {quizScore ===
                          100 ? (
                            <div className="material-quiz-pass">

                              <CheckCircle2
                                size={20}
                              />

                              <span>
                                Kamu
                                lulus
                                quiz!
                                Materi
                                berikutnya
                                sudah
                                terbuka.
                              </span>

                            </div>
                          ) : (
                            <div className="material-quiz-fail">

                              <RotateCcw
                                size={20}
                              />

                              <span>
                                Nilai
                                harus
                                100
                                untuk
                                membuka
                                materi
                                berikutnya.
                              </span>

                            </div>
                          )}

                        </div>
                      )}

                    {/* QUIZ CONTROLS */}

                    <div className="material-quiz-controls">

                      <button
                        type="button"
                        className="material-secondary-button"
                        onClick={
                          handlePreviousQuestion
                        }
                        disabled={
                          currentQuestion ===
                          0
                        }
                      >

                        <ArrowLeft
                          size={18}
                        />

                        Sebelumnya

                      </button>

                      {!quizSubmitted ? (

                        <button
                          type="button"
                          className="material-primary-button"
                          onClick={
                            handleSubmitAnswer
                          }
                          disabled={
                            selectedAnswer ===
                            null
                          }
                        >
                          Jawab

                          <Check
                            size={18}
                          />
                        </button>

                      ) : !isLastQuestion ? (

                        <button
                          type="button"
                          className="material-primary-button"
                          onClick={
                            handleNextQuestion
                          }
                        >
                          Berikutnya

                          <ArrowRight
                            size={18}
                          />
                        </button>

                      ) : quizScore !==
                        100 ? (

                        <button
                          type="button"
                          className="material-primary-button"
                          onClick={
                            handleRetryQuiz
                          }
                        >

                          <RotateCcw
                            size={18}
                          />

                          Ulangi Quiz

                        </button>

                      ) : null}

                    </div>

                  </>
                )}

              </div>

            </section>
          )}

          {/* COMPLETE SECTION */}

          <div className="material-complete-section">

            {completed ? (

              <div className="material-completed-box">

                <div className="material-completed-icon">

                  <CheckCircle2
                    size={24}
                  />

                </div>

                <div>

                  <strong>
                    Materi sudah selesai
                  </strong>

                  <p>
                    Kamu sudah
                    menyelesaikan materi
                    ini.
                  </p>

                </div>

              </div>

            ) : (

              <div className="material-complete-box">

                <div>

                  <h3>
                    Selesaikan materi
                  </h3>

                  <p>
                    Tandai materi ini
                    sebagai selesai
                    untuk membuka materi
                    berikutnya.
                  </p>

                  {quiz &&
                    !hasPassedQuiz && (
                      <div className="material-lock-notice">

                        <LockKeyhole
                          size={17}
                        />

                        <span>
                          Selesaikan quiz
                          dengan nilai 100
                          terlebih dahulu.
                        </span>

                      </div>
                    )}

                </div>

                <button
                  type="button"
                  className="material-primary-button"
                  onClick={
                    handleComplete
                  }
                  disabled={
                    !canComplete
                  }
                >

                  <CheckCircle2
                    size={18}
                  />

                  Tandai Selesai

                </button>

              </div>
            )}

          </div>

          {/* MATERIAL NAVIGATION */}

          <div className="material-navigation">

            <button
              type="button"
              className="material-navigation-button previous"
              onClick={
                handlePreviousMaterial
              }
              disabled={
                !previousMaterial
              }
            >

              <ArrowLeft
                size={18}
              />

              <div>

                <span>
                  Sebelumnya
                </span>

                <strong>
                  {previousMaterial
                    ? previousMaterial.title
                    : "Tidak ada materi"}
                </strong>

              </div>

            </button>

            <button
              type="button"
              className="material-navigation-button next"
              onClick={
                handleNextMaterial
              }
              disabled={
                !nextMaterial ||
                !completed
              }
            >

              <div>

                <span>
                  Berikutnya
                </span>

                <strong>
                  {nextMaterial
                    ? nextMaterial.title
                    : "Materi terakhir"}
                </strong>

              </div>

              <ArrowRight
                size={18}
              />

            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

export default MaterialDetail;