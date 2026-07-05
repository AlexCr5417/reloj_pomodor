import { localStorage_cycles, run_timer, clock } from "./functions/reloj.js";
import { form_configuration } from "./functions/form_configuration.js";
import { secondsToHHMMSS } from "./utils/time.js";

const buttons_clock = [
  {
    id: "editar",
    text: "Editar temporizador",
    iconClass: "bi bi-pencil-square",
    color: "#2563EB",
    accion: { type: "click", function: clock.open_form },
  },
  {
    id: "reiniciar",
    text: "Reiniciar",
    iconClass: "bi bi-arrow-counterclockwise",
    color: "#F59E0B",
    accion: { type: "click", function: clock.restart },
  },
  {
    id: "iniciar",
    text: "Iniciar",
    iconClass: "bi bi-play-fill",
    color: "#22C55E",
    accion: { type: "click", function: clock.run },
  },
  {
    id: "pausar",
    text: "Pausar",
    iconClass: "bi bi-pause-btn-fill",
    color: "#EF4444",
    accion: { type: "click", function: clock.pause },
  },
];

let buttons_main_container = document.querySelector(".buttons_main_container");
buttons_clock.forEach((button) => {
  let div = document.createElement("div");
  div.id = `button_clock_${button.id}`;
  div.style.display = "flex";
  div.classList.add("clock_button");
  div.innerHTML = `<i class="${button.iconClass}" ></i>`;
  //div.textContent = button.text;
  buttons_main_container.append(div);
  div.style.backgroundColor = `${button.color}`;
  if (button.accion) {
    div.addEventListener(button.accion.type, button.accion.function);
  }
});

//---asignaciones de las funciones a los botones-----

//asignacion de las funciones a los botones del formulario de configuracion
asignador("#form_clock_footer_button_cancel", "click", () => {
  form_configuration.ocultar();
  form_configuration.reiniciar();
});
asignador("#form_clock_footer_button_save", "click", () => {
  form_configuration.ocultar();
  form_configuration.guardar();
  clock.run();
  console.log(localStorage.getItem("cycles"));
});
asignador(".cycle_card_plus", "click", form_configuration.cycle.new_card());

document.addEventListener("DOMContentLoaded", () => {
  const datosGuardados = localStorage.getItem("cycles");
  const clockDisplay = document.querySelector(".clock_timer_main");

  if (!datosGuardados) {
    // Esto lo que hace es que si el ciclo por defecto esta vacio guarda un ciclo por defecto en este caso es una repeticion de 25 minutos
    const cicloPorDefecto = {
      repeat: 1,
      cycle: [1500],
      alarmType: 2,
    };
    localStorage.setItem("cycles", JSON.stringify(cicloPorDefecto));
    if (clockDisplay) {
      clockDisplay.textContent = "00:25:00";
    }
  } else {
    const data = JSON.parse(datosGuardados);
    if (data.cycle && data.cycle.length > 0 && clockDisplay) {
      clockDisplay.textContent = secondsToHHMMSS(data.cycle[0]);
    }
  }

  const alarmSlider = document.querySelector("#alarm_mood");
  if (alarmSlider) {
    alarmSlider.addEventListener("input", (e) => {
      const valorNumerico = Number(e.target.value);

      document
        .querySelectorAll(".alarm_labels span")
        .forEach((s) => s.classList.remove("active_mood"));
      if (valorNumerico === 1) {
        document.querySelector("#label_zen")?.classList.add("active_mood");
      } else if (valorNumerico === 2) {
        document.querySelector("#label_active")?.classList.add("active_mood");
      } else if (valorNumerico === 3) {
        document.querySelector("#label_alert")?.classList.add("active_mood");
      }

      if (typeof reproducirVistaPreviaAlarma === "function") {
        reproducirVistaPreviaAlarma(valorNumerico);
      }
    });
  }
});

//-----Funcion para la asignacion de funcionalidades para los botones
function asignador(elementHtml, event, functionCallback) {
  let element = document.querySelector(elementHtml);
  if (element) {
    return element.addEventListener(event, functionCallback);
  }
}
