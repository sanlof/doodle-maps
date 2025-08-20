import React from "react";

export default function useCountdown(targetHHmm = "14:30") {
  const [now, setNow] = React.useState(() => Date.now());

  // Om targetHHmm är ett Date-objekt, använd det direkt
  const getNextTarget = React.useCallback(() => {
    if (targetHHmm instanceof Date) {
      return targetHHmm;
    }
    // Annars förväntas en HH:mm-sträng
    const [hh, mm] = String(targetHHmm).split(":").map(Number);
    const t = new Date();
    t.setHours(hh, mm, 0, 0);
    if (t.getTime() <= Date.now()) {
      // Om tiden passerat idag -> ta i morgon
      t.setDate(t.getDate() + 1);
    }
    return t;
  }, [targetHHmm]);

  const target = React.useMemo(() => getNextTarget(), [getNextTarget]);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;

  return { formatted, isOver: diff === 0, targetDate: target };
}
