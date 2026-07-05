import { secondsToHHMMSS } from "../utils/time.js";
import { swapButtons } from "../utils/dom.js";
import { cardEndCycle } from "./cardEndCycle.js";
let intervalo;
//funciones de el reloj
export const clock = {
  open_form: () => {
    document.querySelector(".overlay").style.display = "flex";
    document.querySelector(".form_clock").style.display = "flex";
  },
  stop: () => {
    clearInterval(intervalo);
    let clock_localStorage = {
      repeat: 0,
      cycle: [],
    };
    localStorage.setItem("cycles", JSON.stringify(clock_localStorage));
    let clock = document.querySelector(".clock_timer_main");
    clock.textContent = "00:00:00";
  },
  run: async () => {
    let data = JSON.parse(localStorage.getItem("cycles"));

    if (data) {
      //hacemos que cualquier otro reloj ejecutandose termine
      if (intervalo) {
        clearInterval(intervalo);
      }
      //ocultar el boton de iniciar y mostrar el boton de pausa
      swapButtons("#button_clock_iniciar", "#button_clock_pausar");

      let repeats = data.repeat;
      let cycles = data.cycle;
      let tipoAlarma = data.tipoAlarma;
      let body = document.body;
      let clock = document.querySelector(".clock_timer_main");

      //si no hay reloj para cambiar, dar un error.
      if (!clock)
        throw new Error("No se encontró el elemento .clock_timer_main");

      //corremos el reloj en bucle
      for (let repeat = 0; repeat < repeats; repeat++) {
        for (let cycle = 0; cycle < cycles.length; cycle++) {
          //esperamos a que el reloj termine
          await run_timer(cycles[cycle], clock);

          // Disparamos la transicion sonora en el body
          ejecutarAlarmaInmersiva(tipoAlarma ? Number(tipoAlarma) : 2, body);

          if (cycle != cycles.length - 1) {
            //abrimos el mensaje de confirmacion
            cardEndCycle.open();
            //esperamos a que el usuario confirme que quiere continuar
            await cardEndCycle.confirmContinue();
            //cermmas el mensaje de confirmacion
            cardEndCycle.close();
          }
        }
        if (repeat != repeats - 1) {
          cardEndCycle.open();
          await cardEndCycle.confirmContinue();
          cardEndCycle.close();
        }
      }
      swapButtons("#button_clock_pausar", "#button_clock_iniciar"); //volvemos a mosta
    }
  },
  restart: () => {
    clearInterval(intervalo);
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
    clock.run();
  },
  pause: () => {
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
  },
};

export function run_timer(seconds, elemtHtml) {
  return new Promise((resolve) => {
    let time = seconds;

    elemtHtml.textContent = secondsToHHMMSS(time); //para que no tarde un segundo en actualizar el reloj
    intervalo = setInterval(() => {
      time--;
      if (time <= 0) {
        clearInterval(intervalo);
        elemtHtml.textContent = `00:00:00`;
        resolve("termino");
      } else {
        elemtHtml.textContent = secondsToHHMMSS(time);
      }
    }, 1000);
  });
}

// Aqui abajo añadimos una funcion asistente/coopera a la que ya esta realizando el conteo hacia atras que se encargara
// de añadir el audio de la alarma
function ejecutarAlarmaInmersiva(tipo, elementoBody) {
  const audioCtx = new (window.AudioContext || window.WebkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (tipo === 1) {
    //Modo Zen: Frecuencia profunda expansiva + destello violeta lento en pantalla
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3); // Esto realizara un eco largo

    elementoBody.classList.add("flash-zen");
    setTimeout(() => elementoBody.classList.remove("flash-zen"), 4000);

    osc.start();
    osc.stop(audioCtx.currentTime + 3);
  } else if (tipo === 3) {
    //Modo Alerta Maxima: Sonido ritmico aserrado + rafagas rojas
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(840, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);

    elementoBody.classList.add("flash-alert");
    setTimeout(() => elementoBody.classList.remove("flash-alert"), 2500);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  } else {
    // Modo Activo: Campana armonica estandar
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

    osc.start();
    osc.stop(audioCtx.currentTime + 1);
  }
}

export function localStorage_cycles() {
  console.log(localStorage.getItem("cycles"));
}
