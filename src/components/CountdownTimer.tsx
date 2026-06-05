"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft: TimeLeft | null = null;

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="countdown-container">
        <p className="countdown-label">The event has started!</p>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <p className="countdown-label">Manifestation Starts In</p>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-unit">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-unit">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-unit">Mins</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-unit">Secs</span>
        </div>
      </div>
    </div>
  );
}
