import { swapButtons } from "../utils/dom.js";

export const cardEndCycle = {
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
