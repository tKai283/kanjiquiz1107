// src/components/Quiz.jsx
import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import Lives from "./Lives";
import Enemy from "./Enemy";
import Explosion from "./Explosion";
import Result from "./Result";
import LoadingScreen from "./LoadingScreen";
import ConfirmGiveUp from "./ConfirmGiveUp";
import TimeoutScreen from "./TimeoutScreen";
import QuestionCounter from "./QuestionCounter";
import ActionButtons from "./ActionButtons";
import MessageDisplay from "./MessageDisplay";
import allQuestions from "./questions";
import "../styles.css";

// === シャッフル関数 ===
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// === メインコンポーネント ===
export default function Quiz({ level, questionCount, timeLimit, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [answer, setAnswer] = useState("");
  const [lives, setLives] = useState(3);
  const [result, setResult] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [exploding, setExploding] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [warning, setWarning] = useState("");

  // === 初期化 ===
  useEffect(() => {
    const filtered = allQuestions.filter((q) => q.level === level);
    setQuestions(shuffle(filtered).slice(0, questionCount));
  }, [level, questionCount]);

  useEffect(() => {
    if (questions.length > 0 && !current) nextQuestion(false);
  }, [questions]);

  // === タイマー ===
  useEffect(() => {
    if (!current || showTimeout || showConfirm) return;
    setTimeLeft(timeLimit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, timeLimit, showTimeout, showConfirm]);

  // === 次の問題 ===
  const nextQuestion = (countUp = true) => {
    if (questions.length === 0) {
      setResult("🎉 全問正解！おめでとう 🎉");
      setCurrent(null);
      return;
    }

    const [q, ...rest] = questions;
    setQuestions(rest);
    setCurrent(q);
    setAnswer("");
    setResult("");
    setWarning("");

    if (countUp) setQuestionNumber((prev) => prev + 1);
  };

  // === 回答チェック ===
  const checkAnswer = () => {
    if (!current) return;
    const ans = answer.trim();

    // ローマ字検出
    if (/^[a-zA-Z]+$/.test(ans)) {
      setWarning("⚠️ ひらがなやカタカナで入力してください！");
      setResult("");
      setAnswer("");
      return;
    }

    const readings = current.reading
      .replace(/、/g, ",")
      .split(",")
      .map((r) => r.trim());

    if (readings.includes(ans)) {
      setResult("✅ 正解！");
      setWarning("");
      setTimeout(() => nextQuestion(true), 1200);
    } else if (
      readings.some(
        (r) =>
          ans.length === r.length &&
          [...ans].filter((c, i) => c !== r[i]).length === 1
      )
    ) {
      setResult("🩷 おしい！もう少し！");
      setAnswer("");
    } else {
      setResult("❌ 間違い！もう一度！");
      setAnswer("");
    }
  };

  // === タイムアップ処理 ===
  const handleTimeout = () => {
    if (!current) return;
    setLastAnswer(current.reading);
    setShowTimeout(true);
  };

  const handleNextAfterTimeout = () => {
    setShowTimeout(false);
    loseLife("時間切れ！", false);
  };

  const loseLife = (msg = "不正解…", countUp = true) => {
    const newLives = lives - 1;
    setLives(newLives);
    setResult(`❌ ${msg}（残り${newLives}機）`);

    if (newLives <= 0) {
      setResult("💀 GAME OVER 💀");
      setCurrent(null);
    } else {
      setTimeout(() => nextQuestion(countUp), 1500);
    }
  };

  const skipQuestion = () => {
    if (skipUsed || !current) return;
    setSkipUsed(true);
    setResult("🔁 問題を入れ替えました！");
    setWarning("");
    setTimeout(() => nextQuestion(false), 1000);
  };

  const handleGiveUp = () => setShowConfirm(true);

  const confirmGiveUp = (choice) => {
    if (choice === "yes") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onBack();
      }, 1500);
    } else {
      setShowConfirm(false);
    }
  };

  // === ローディング中 ===
  if (loading) return <LoadingScreen message="終了しています..." />;

  // === あきらめる確認 ===
  if (showConfirm) return <ConfirmGiveUp onConfirm={confirmGiveUp} />;

  // === タイムアウト画面 ===
  if (showTimeout && current) {
    return (
      <>
        <div className="quiz-mode">
          <div className="lives-container">
            <Lives lives={lives} />
          </div>
          <QuestionCounter current={questionNumber} total={questionCount} />
          <div className="quiz-card">
            <div className="question-text">{current.kanji}</div>
            <p style={{ color: "#f8b400" }}>タイムアップ中...</p>
          </div>
        </div>
        <TimeoutScreen
          correctAnswer={lastAnswer}
          onNext={handleNextAfterTimeout}
        />
      </>
    );
  }

  // === 終了時 ===
  if (!current)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "white", textShadow: "0 0 5px black" }}>
          {result || "ゲーム終了！"}
        </h2>
        <button onClick={onBack} style={{ marginTop: "20px" }}>
          ← 最初に戻る
        </button>
      </div>
    );

  // === メイン描画 ===
  return (
    <div className="quiz-mode">
      <div className="lives-container">
        <Lives lives={lives} />
      </div>
      <QuestionCounter current={questionNumber} total={questionCount} />

      <div className="quiz-card">
        <Enemy visible={level === "easy"} />
        <Timer timeLeft={timeLeft} />

        <div className="question-text">{current.kanji}</div>

        {/* === IME制御つき入力欄 === */}
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ひらがなで答えてね"
          className="answer-input"
          inputMode="none" // ★IMEをほぼ無効化
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          readOnly // ★最初は読み取り専用（IME起動防止）
          onFocus={(e) => e.target.removeAttribute("readOnly")} // ★フォーカス時に解除
        />

        {/* === メッセージは1つだけ表示（警告優先） === */}
        <MessageDisplay
          message={warning || result}
          type={
            warning
              ? "warning"
              : result.startsWith("✅")
              ? "success"
              : result.startsWith("❌") || result.startsWith("💀")
              ? "error"
              : result
              ? "info"
              : ""
          }
        />

        <ActionButtons
          onAnswer={checkAnswer}
          onSwap={skipQuestion}
          onGiveUp={handleGiveUp}
          disabled={skipUsed}
        />

        {exploding && <Explosion />}
      </div>
    </div>
  );
}
