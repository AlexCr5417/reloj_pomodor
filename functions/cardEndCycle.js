import { swapButtons } from "../utils/dom.js";

export const cardEndCycle = {
  open: () => {
    swapButtons(".form_clock", ".card_end_cycle");
    document.querySelector(".overlay").style.display = "flex";
  },
};
