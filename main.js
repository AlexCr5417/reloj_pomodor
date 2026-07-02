import {
  localStorage_cycles,
  mostrar_configuracion,
  restart_clock,
  run_clock,
  run_timer,
} from "./functions/reloj.js";
import {
  newCard_CycleContainer,
  ocultar_configuracion,
  reiniciar_configuracion,
  save_form_configuration,
} from "./functions/form_configuration.js";
import { secondsToHHMMSS } from "./utils/time.js";

const buttons_clock = [
  {
    text: "Editar temporizador",
    color: "#2563EB",
    accion: { type: "click", function: mostrar_configuracion },
  },
  {
    text: "Reiniciar",
    color: "#F59E0B",
    accion: { type: "click", function: restart_clock },
  },
  {
    text: "Iniciar",
    color: "#22C55E",
    accion: { type: "click", function: run_clock },
  },
];

let buttons_main_container = document.querySelector(".buttons_main_container");
buttons_clock.forEach((button) => {
  let div = document.createElement("div");
  div.classList.add("clock_button");
  div.textContent = button.text;
  buttons_main_container.append(div);
  div.style.backgroundColor = `${button.color}`;
  if (button.accion) {
    div.addEventListener(button.accion.type, button.accion.function);
  }
});

//---asignaciones de las funciones a los botones-----

//asignacion de las funciones a los botones del formulario de configuracion
let form_clock_footer_button_cancel = document.querySelector(
  "#form_clock_footer_button_cancel",
);
form_clock_footer_button_cancel.addEventListener("click", () => {
  ocultar_configuracion();
  reiniciar_configuracion();
});
let form_clock_footer_button_save = document.querySelector(
  "#form_clock_footer_button_save",
);
form_clock_footer_button_save.addEventListener("click", () => {
  ocultar_configuracion();
  save_form_configuration();
  run_clock();
  console.log(localStorage.getItem("cycles"));
});

let cycle_title = document.querySelector(".cycle_card_plus");
cycle_title.addEventListener("click", newCard_CycleContainer);
