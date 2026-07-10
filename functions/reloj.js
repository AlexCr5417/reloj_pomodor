import { secondsToHHMMSS } from "../utils/time.js";
import { swapButtons } from "../utils/dom.js";
import { cardEndCycle } from "./cardEndCycle.js";
import { Alarma } from "./alarm.js";
import { timer, statusClock } from "./timer.js";
//funciones de el reloj
export const clock = {
  run: async () => {
    if (statusClock) {
      const data = JSON.parse(localStorage.getItem("cycles"));
      //hacemos que cualquier otro reloj ejecutandose termine
      timer.stop();

      const repeats = statusClock.repeat;
      let cycles = statusClock.cycle;
      const cyclesLength = cycles.length;
      let clockMain = document.querySelector(".clock_timer_main");

      //corremos el reloj en bucle
      for (let repeat = 0; repeat < repeats; repeat++) {
        for (let cycle = 0; cycle < cyclesLength; cycle++) {
          //esperamos a que el reloj termine
          await timer.run(clockMain);

          //cuando termina solicitamos confirmacion para continuar;
          await cardEndCycle.run();
        }
        timer.assignStatusClock({ repeat: data.repeat--, cycle: data.cycle });
      }
    }
  },
  stop: () => {
    timer.stop();
    let clock_localStorage = {
      repeat: 0,
      cycle: [],
    };
    localStorage.setItem("cycles", JSON.stringify(clock_localStorage));
    let clock = document.querySelector(".clock_timer_main");
    clock.textContent = "00:00:00";
  },
  restart: () => {
    timer.stop();
    timer.assignStatusClock(JSON.parse(localStorage.getItem("cycles")));
    clock.run();
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
  },
  pause: () => {
    timer.stop();
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
    console.log(statusClock);
  },
};
