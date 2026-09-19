"use client";

import { useState, useEffect, useCallback } from "react";

function getTimeRemaining() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();

  return {
    days: 0,
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label, size = "md" }) {
  const isSm = size === "sm";
  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800 shadow-xs border border-slate-800/80 ${isSm ? "h-9 w-9 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-14 sm:w-14"}`}>
        <span suppressHydrationWarning className={`font-extrabold tabular-nums ${isSm ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`mt-1 font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isSm ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-xs"}`}>
        {label}
      </span>
    </div>
  );
}

function Separator({ size = "md" }) {
  const isSm = size === "sm";
  return (
    <div className={`flex flex-col items-center gap-1.5 ${isSm ? "pb-3.5" : "pb-5"}`}>
      <div className={`rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse ${isSm ? "size-1" : "size-1.5"}`} />
      <div className={`rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse ${isSm ? "size-1" : "size-1.5"}`} />
    </div>
  );
}

export default function CountdownTimer({ size = "md" }) {
  const [time, setTime] = useState(getTimeRemaining);

  const tick = useCallback(() => {
    setTime((prev) => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      }
      if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      }
      if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      }
      return getTimeRemaining();
    });
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className={`flex items-center ${size === "sm" ? "gap-1.5 sm:gap-2 justify-center" : "gap-2 sm:gap-3"}`}>
      <TimeUnit value={time.hours} label="Hours" size={size} />
      <Separator size={size} />
      <TimeUnit value={time.minutes} label="Min" size={size} />
      <Separator size={size} />
      <TimeUnit value={time.seconds} label="Sec" size={size} />
    </div>
  );
}
