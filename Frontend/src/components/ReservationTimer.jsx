import React, { useState, useEffect } from "react";
import "../styles/ReservationTimer.css";

export const ReservationTimer = ({ expiresInSeconds, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(expiresInSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft < 60;

  return (
    <div className={`reservation-timer ${isWarning ? "warning" : ""}`}>
      <p className="timer-label">Reservation expires in:</p>
      <div className="timer-display">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      {isWarning && (
        <p className="warning-text">
          Hurry! Your reservation is about to expire
        </p>
      )}
    </div>
  );
};

export default ReservationTimer;
