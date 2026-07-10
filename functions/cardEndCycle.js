import { swapButtons } from "../utils/dom.js";
import { statusClock } from "./timer.js";
import { Alarma } from "./alarm.js";

export const cardEndCycle = {
  run: async () => {
    let tipoAlarma = statusClock.alarmType;
    //reiniciamos cualquier audio anterior
    Alarma.reiniciar();
    //Hacemos sonar el audio
    Alarma.ejecutar(tipoAlarma, document.body);
    //abrimos el mensaje de confirmacion
    cardEndCycle.open();
    //esperamos a que el usuario confirme que quiere continuar
    await cardEndCycle.confirmContinue();
    //hacemos que la alarama deje de sonar
    Alarma.reiniciar();
    //cermmas el mensaje de confirmacion
    cardEndCycle.close();
  },
  open: () => {
    document.querySelector(".card_end_cycle").style.display = "flex";
    document.querySelector(".overlay").style.display = "flex";
  },
  close: () => {
    document.querySelector(".card_end_cycle").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
  },
  confirmContinue: () => {
    return new Promise((resolve) => {
      document
        .querySelector(".card_end_cycle_body_buttons_continue")
        .addEventListener("click", () => {
          resolve();
        });
    });
  },
};
