// src/components/QuestionCounter.jsx
import React from "react";
import "../styles.css";

export default function QuestionCounter({ current, total }) {
  return (
    <div className="map-progress">
      <div className="map-bar">
        {[...Array(total)].map((_, i) => (
          <div key={i} className="map-step">
            {/* 🏰 城（最初の数字の上） */}
            {i === 0 && <div className="castle-icon">🏰</div>}

            {/* 🐉 ドラゴン（最後の数字の上） */}
            {i === total - 1 && <div className="dragon-icon">🐉</div>}

            {/* 🧙‍♂️ プレイヤー（現在位置） */}
            {i === current - 1 && <div className="player-icon">🧙‍♂️</div>}

            {/* 数字 */}
            <div className={`step-circle ${i + 1 <= current ? "active" : ""}`}>
              {i + 1}
            </div>

            {/* 線 */}
            {i < total - 1 && (
              <div
                className={`step-line ${i + 1 < current ? "filled" : ""}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
