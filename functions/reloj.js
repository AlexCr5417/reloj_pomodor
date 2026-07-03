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
let intervalo;
export function run_timer(seconds) {
  let clock = document.querySelector(".clock_timer_main");

  // Añadimos una nueva variable
  let body = document.body;

  return new Promise((resolve) => {
    let time = seconds;

    intervalo = setInterval(() => {
      if (time <= 0) {
        clock.textContent = `00:00:00`;
        clearInterval(intervalo);
        
        const datosGuardados = localStorage.getItem("cycles");
        let tipoAlarma = 2;

        if(datosGuardados){
          const data = JSON.parse(datosGuardados);
          if(data.tipoAlarma !== undefined){
            tipoAlarma = Number(data.alarmType);
          }
        }

        // Disparamos la transicion sonora en el body
        ejecutarAlarmaInmersiva(tipoAlarma, body);

        resolve("terminó");
      }
      clock.textContent = secondsToHHMMSS(time);
      time--;
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

  if(tipo === 1){
    //Modo Zen: Frecuencia profunda expansiva + destello violeta lento en pantalla
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3); // Esto realizara un eco largo

    elementoBody.classList.add("flash-zen");
    setTimeout(() => elementoBody.classList.remove("flash-zen"), 4000);

    osc.start();
    osc.stop(audioCtx.currentTime + 3);
  }else if(tipo === 3){
    //Modo Alerta Maxima: Sonido ritmico aserrado + rafagas rojas
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(840, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);

    elementoBody.classList.add("flash-alert");
    setTimeout(() => elementoBody.classList.remove("flash-alert"), 2500);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  }else{
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

export function stop_clock() {
  clearInterval(intervalo);
}
