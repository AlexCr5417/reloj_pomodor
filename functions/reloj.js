import { secondsToHHMMSS } from "../utils/time.js";

//funciones de el reloj
export function mostrar_configuracion() {
  let form_clock = document.querySelector(".overlay");
  form_clock.style.display = "flex";
}

export function restart_clock() {
  const clock_localStorage = {
    repeat: 0,
    cycle: [],
  };
  localStorage.setItem("cycles", JSON.stringify(clock_localStorage));
  let clock = document.querySelector(".clock_timer_main");
  clock.textContent = "00:00:00";
}

export async function run_clock() {
  let data = JSON.parse(localStorage.getItem("cycles"));
  let repeats = data.repeat;
  let cycles = data.cycle;

  for (let repeat = 0; repeat < repeats; repeat++) {
    for (let cycle = 0; cycle < cycles.length; cycle++) {
      await run_timer(cycles[cycle]);
    }
  }
}

export function run_timer(seconds) {
  let clock = document.querySelector(".clock_timer_main");

  return new Promise((resolve) => {
    let time = seconds;

    const intervalo = setInterval(() => {
      if (time <= 0) {
        clock.textContent = `00:00:00`;
        clearInterval(intervalo);
        resolve("terminó");
      }
      clock.textContent = secondsToHHMMSS(time);
      time--;
    }, 1000);
  });
}

export function localStorage_cycles() {
  console.log(localStorage.getItem("cycles"));
}

function pause_clock() {
  clearInterval(intervalo);
}
