import { useEffect, useState } from "react";

export default function useLiveTimer(startedAt, isActive) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startedAt) {
      setElapsed(0);
      return undefined;
    }

    const startMs = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [startedAt, isActive]);

  return elapsed;
}
