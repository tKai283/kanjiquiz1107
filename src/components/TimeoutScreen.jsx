// TimeoutScreen.jsx
import React from "react";

export default function TimeoutScreen({ correctAnswer, onNext }) {
  return (
    <>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 15px #f8b400; }
          50% { text-shadow: 0 0 5px rgba(248,180,0,0.5); }
        }
      `}
      </style>

      {/* 背景を透かすオーバーレイ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)", // 薄く透明
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        {/* カード部分 */}
        <div
          style={{
            background: "rgba(20, 20, 20, 0.8)",
            color: "white",
            padding: "40px 60px",
            borderRadius: "20px",
            textAlign: "center",
            border: "2px solid #f8b400",
            animation: "fadeIn 0.6s ease-out",
            boxShadow: "0 0 25px rgba(248,180,0,0.4)",
            maxWidth: "90%",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              fontSize: "1.8rem",
              animation: "glow 2s infinite",
            }}
          >
            ⏰ タイムアップ！
          </h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            正解は{" "}
            <span style={{ color: "#f8b400", fontWeight: "bold" }}>
              {correctAnswer}
            </span>
          </p>
          <button
            onClick={onNext}
            style={{
              padding: "10px 25px",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "none",
              background: "#f8b400",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#ffd34d")}
            onMouseOut={(e) => (e.target.style.background = "#f8b400")}
          >
            次の問題へ →
          </button>
        </div>
      </div>
    </>
  );
}
