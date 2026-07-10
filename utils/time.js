export function secondsToHHMMSS(totalSeconds) {
  if (totalSeconds <= 0) return "00:00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * recibe un string en fomrato "HH:MM:DD" y devuelve los segundos exactos. 
 * @param {string} time 
 * @returns seconds
 */
export function HHMMSStoSeconds(time) {
  let seconds = 0;
  time.split(":").forEach((e, i) => {
    const value = Number(e);
    switch (i) {
      case 0:
        seconds += value * 3600;
        break;
      case 1:
        seconds += value * 60;
        break;
      case 2:
        seconds += value;
        break;
    }
  });
  return seconds;
}

