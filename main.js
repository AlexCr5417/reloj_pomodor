import { clock } from "./functions/reloj.js";
import { Alarma } from "./functions/alarm.js";
import { statusClock, timer } from "./functions/timer.js";
import { form_configuration } from "./functions/form_configuration.js";
import { secondsToHHMMSS } from "./utils/time.js";
import { swapButtons, changeText } from "./utils/dom.js";
import { cardEndCycle } from "./functions/cardEndCycle.js";
import { icons } from "./assets/icons.js";

const buttons_clock = [
  {
    id: "editar",
    text: "Editar temporizador",
    icon: icons.edit,
    color: "#2563EB",
    display: "flex",
    accion: { type: "click", function: form_configuration.open },
  },
  {
    id: "atras",
    text: "Atras",
    icon: icons.back,
    color: "#F59E0B",
    display: "flex",
    accion: null,
  },
  {
    id: "reiniciar",
    text: "Reiniciar",
    icon: icons.restart,
    color: "#F59E0B",
    display: "flex",
    accion: { type: "click", function: clock.restart },
  },
  {
    id: "iniciar",
    text: "Iniciar",
    icon: icons.play,
    color: "#22C55E",
    display: "flex",
    accion: {
      type: "click",
      function: () => {
        swapButtons("#button_clock_iniciar", "#button_clock_pausar");
        clock.run();
      },
    },
  },
  {
    id: "pausar",
    text: "Pausar",
    icon: icons.pause,
    color: "#EF4444",
    display: "none",
    accion: { type: "click", function: clock.pause },
  },
  {
    id: "detener",
    text: "Detener",
    icon: icons.stop,
    color: "#9c44ef",
    display: "flex",
    accion: { type: "click", function: clock.stop },
  },
  {
    id: "adelante",
    text: "Adelante",
    icon: icons.forward,
    color: "#9c44ef",
    display: "flex",
    accion: null,
  },
];

//---asignaciones de las funciones a los botones-----
let buttons_main_container = document.querySelector(".buttons_main_container");
buttons_clock.forEach((button) => {
  let div = document.createElement("div");
  div.id = `button_clock_${button.id}`;
  div.style.display = button.display;
  div.classList.add("clock_button");
  div.innerHTML = button.icon;
  //div.textContent = button.text;
  buttons_main_container.append(div);
  // div.style.backgroundColor = `${button.color}`;
  if (button.accion) {
    div.addEventListener(button.accion.type, button.accion.function);
  }
});

//asignacion de las funciones a los botones del formulario de configuracion
asignador("#form_clock_footer_button_cancel", "click", () => {
  form_configuration.close();
  form_configuration.restart();
});
asignador("#form_clock_footer_button_save", "click", () => {
  form_configuration.close();
  form_configuration.save();
  clock.run();
  swapButtons("#button_clock_iniciar", "#button_clock_pausar");
  console.log(localStorage.getItem("cycles"));
  console.log(statusClock);
});
asignador(".cycle_card_plus", "click", () => {
  form_configuration.cycle.new_card();
});

// document.addEventListener("DOMContentLoaded", () => {
//   const datosGuardados = localStorage.getItem("cycles");
//   const clockDisplay = document.querySelector(".clock_timer_main");

//   if (!datosGuardados) {
//     // Esto lo que hace es que si el ciclo por defecto esta vacio guarda un ciclo por defecto en este caso es una repeticion de 25 minutos
//     const cicloPorDefecto = {
//       repeat: 1,
//       cycle: [1500],
//       alarmType: 2,
//     };
//     localStorage.setItem("cycles", JSON.stringify(cicloPorDefecto));
//     if (clockDisplay) {
//       clockDisplay.textContent = "00:25:00";
//     }
//   } else {
//     const data = JSON.parse(datosGuardados);
//     if (data.cycle && data.cycle.length > 0 && clockDisplay) {
//       clockDisplay.textContent = secondsToHHMMSS(data.cycle[0]);
//     }
//   }

//   const alarmSlider = document.querySelector("#alarm_mood");
//   if (alarmSlider) {
//     alarmSlider.addEventListener("input", (e) => {
//       const valorNumerico = Number(e.target.value);

//       document
//         .querySelectorAll(".alarm_labels span")
//         .forEach((s) => s.classList.remove("active_mood"));
//       if (valorNumerico === 1) {
//         document.querySelector("#label_zen")?.classList.add("active_mood");
//       } else if (valorNumerico === 2) {
//         document.querySelector("#label_active")?.classList.add("active_mood");
//       } else if (valorNumerico === 3) {
//         document.querySelector("#label_alert")?.classList.add("active_mood");
//       }

//       if (typeof reproducirVistaPreviaAlarma === "function") {
//         reproducirVistaPreviaAlarma(valorNumerico);
//       }
//     });
//   }
// });

//-----Funcion para la asignacion de funcionalidades para los botones
function asignador(elementHtml, event, functionCallback) {
  let element = document.querySelector(elementHtml);
  if (element) {
    return element.addEventListener(event, functionCallback);
  }
}
