import { secondsToHHMMSS } from "../utils/time.js";
export let intervalo;
export let statusClock;

export const timer = {
  run: (elemtHtml) => {
    return new Promise((resolve) => {
      elemtHtml.textContent = secondsToHHMMSS(statusClock.cycle[0]); //para que no tarde un segundo en actualizar el reloj
      intervalo = setInterval(() => {
        statusClock.cycle[0]--;
        if (statusClock.cycle[0] <= 0) {
          clearInterval(intervalo);
          statusClock.cycle.shift();
          elemtHtml.textContent = `00:00:00`;
          resolve("termino");
        } else {
          elemtHtml.textContent = secondsToHHMMSS(statusClock.cycle[0]);
        }
      }, 1000);
    });
  },
  stop: () => {
    clearInterval(intervalo);
  },
  assignStatusClock: (content) => {
    statusClock = content;
  },
};
